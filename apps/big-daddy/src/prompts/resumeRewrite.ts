import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';

/**
 * Completely rewrite a Resume based on a job description.
 */
export const resumeRewritePrompt = async ({
  jobDescription,
  resume,
}: {
  jobDescription: string;
  resume: string;
}) => {
  const contexts = [
    {
      name: 'My Resume',
      value: resume,
    },
  ]
    .map((context) => `${context.name}:\n${context.value}`)
    .join('\n\n##\n\n');
  const rewritePrompt = `
I am applying for the job with this job description using my resume. I want to custom tailor my resume to give me the best shot landing the job.
Whenever applicable, customize bullet points from my resume to match key words from the job description provided to give me the best shot of landing an interview.
Do not change company names of where I worked in the updated resume.
Only include experiences that are directly included in my resume context.

### 

Contexts:
${contexts}

###
`;

  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: 'The newly rewritten resume based on the job description.',
  });

  const question = `Rewrite my resume for this Job Description:\n${jobDescription}`;

  const prompt = new PromptTemplate({
    template: `${rewritePrompt}\n{format_instructions}\n{question}`,
    inputVariables: ['question'],
    partialVariables: {
      format_instructions: formatParser.getFormatInstructions(),
    },
  });

  const formatPrompt = await prompt.format({
    question,
  });

  const resp = await gptTurboModel.call(formatPrompt);

  const parsed = await formatParser.parse(resp);
  if (!parsed || !parsed.answer) {
    console.error('Failed to parse response from GPT-3', resp);
    throw new Error('Failed to parse response from GPT-3');
  }
  return parsed.answer;
};
