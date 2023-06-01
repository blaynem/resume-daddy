import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';

/**
 * Creates a prompt template for updating a jobs responsibilities.
 */
export const responsibilitiesUpdatePrompt = async ({
  summary,
  responsibilities,
  jobDescription,
}: {
  summary: string;
  responsibilities: string;
  jobDescription?: string;
}) => {
  const contexts = [
    {
      name: 'Job Summary',
      value: summary,
    },
    {
      name: 'Job Responsibilities',
      value: responsibilities,
    },
  ]
    .map((context) => `${context.name}:\n${context.value}`)
    .join('\n\n##\n\n');
  const responsibilitiesPrompt = `
I want to write a resume Responsibilities section based on the STAR method.
Help me improve my resumes Job Responsibilities by rephrasing and clarifying any information that is unclear.
Please embellish the details as much as you see fit, but only include experiences that are directly included in my the Contexts.

### 

Contexts:
${contexts}

###
`;

  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer:
      'The updated Job Responsibilities for the job, separated by newlines.',
  });

  const prompt = new PromptTemplate({
    template: `${responsibilitiesPrompt}\n{format_instructions}`,
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
