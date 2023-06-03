import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';
import { createContextPrompt } from './helpers';

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
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
  ]);
  const startingPrompt = `
I am applying for the job with this job description using my resume. I want to custom tailor my resume to give me the best shot landing the job.
Whenever applicable, customize bullet points from my resume to match key words from the job description provided to give me the best shot of landing an interview.
Do not change company names of where I worked in the updated resume.
Only include experiences that are directly included in my resume context.`;

  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: 'The newly rewritten resume based on the job description.',
  });

  const endingPrompt = `Rewrite my resume for this Job Description:\n${jobDescription}`;

  const prompt = await new PromptTemplate({
    template: `{startingPrompt}\n{context}\n{format_instructions}\n{endingPrompt}`,
    inputVariables: ['startingPrompt', 'context', 'format_instructions'],
    partialVariables: {
      startingPrompt,
      context,
      format_instructions: formatParser.getFormatInstructions(),
      endingPrompt,
    },
  }).format({});

  const resp = await gptTurboModel.call(prompt);

  const parsed = await formatParser.parse(resp);
  if (!parsed || !parsed.answer) {
    console.error('Failed to parse response from GPT-3', resp);
    throw new Error('Failed to parse response from GPT-3');
  }
  return parsed.answer;
};
