import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';
import { createContextPrompt } from './helpers';

/**
 * Structure of prompt:
 * - Instructions
 * - External info / context
 *  - Separate total context by `###`
 *  - Separate individual context by `\n\n##\n\n`
 * - Fewshot training
 * - output indicator
 *  - `Answer: """`
 *
 * TODO:
 * - Determine MaxContext
 * - Add "fewshot training" to prompts
 */

/**
 * Order of LLM:
 * 1. Fetch the user's resume from the database
 * 2. (PromptTemplate) Parse the resume into a format that can be used by the chatbot
 *  - Format of the jobs:
 *    - Job title
 *    - Job Summary
 *    - Job Experience (in bullet points)
 *    - Job skills (in bullet points)
 * 3. Send the resume to the chatbot
 *   - The chatbot will interpret:
 *    - `jobDescription` and `Experience`
 *    - What `industry` the job is in
 *    - What other titles this job may be called in the given industry, `industry_titles`
 * 4. Receive the chatbot's response
 *
 */

/**
 * Creates a prompt template for creating a cover letter for a given job description.
 */
export const shortCoverLetterPrompt = async ({
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
Write a cover letter for the job in the job description by matching qualifications from my resume to the job description provided.
Keep the cover letter very short, three paragraphs at most. Keep the language relatively casual. Only include experiences that are directly included in my resume context.`;

  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: 'The cover letter for the job description.',
  });

  const endingPrompt = `Write a cover letter for this Job Description:\n${jobDescription}`;

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
