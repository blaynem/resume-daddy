import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';

/**
 * Creates a prompt template for updating a jobs Experiences.
 */
export const experienceUpdatePrompt = async ({
  summary,
  experiences,
  jobDescription,
}: {
  summary: string;
  experiences: string;
  jobDescription?: string;
}) => {
  const contexts = [
    {
      name: 'Job Summary',
      value: summary,
    },
    {
      name: 'Job Experiences',
      value: experiences,
    },
  ]
    .map((context) => `${context.name}:\n${context.value}`)
    .join('\n\n##\n\n');
  const ExamplesPrompt = `
I want to write a resume Experiences section based on the STAR method.
Help me improve my resumes Job Experiences by rephrasing and clarifying any information that is unclear.
Please embellish the details as much as you see fit, but only include experiences that are directly included in my the Contexts.

### 

Contexts:
${contexts}

###
`;

  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: 'The updated Job Experiences for the job, separated by newlines.',
  });

  const prompt = new PromptTemplate({
    template: `${ExamplesPrompt}\n{format_instructions}`,
    inputVariables: [],
    partialVariables: {
      format_instructions: formatParser.getFormatInstructions(),
    },
  });

  const formatPrompt = await prompt.format({});

  const resp = await gptTurboModel.call(formatPrompt);

  const parsed = await formatParser.parse(resp);
  if (!parsed || !parsed.answer) {
    console.error('Failed to parse response from GPT-3', resp);
    throw new Error('Failed to parse response from GPT-3');
  }
  return parsed.answer;
};
