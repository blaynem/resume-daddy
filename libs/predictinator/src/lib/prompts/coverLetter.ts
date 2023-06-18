import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction } from '../predictinator';

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
 * Each prompt file should have the following:
 * 1. A prompt template
 * 2. A parser function
 * 3. The exported return type of the formatted prompt
 */

const questionAnswerFormat = z.object({
  answer: z.string().describe('The new cover letter.'),
});

type CoverLetterPredictResponse = z.infer<typeof questionAnswerFormat>;

const predictionParser =
  StructuredOutputParser.fromZodSchema(questionAnswerFormat);

const coverLetterParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as CoverLetterPredictResponse;

  if (!parsed || !parsed.answer) {
    return {
      error: 'Failed to parse response from GPT-3',
    };
  }
  return {
    prediction: parsed.answer,
  };
};

const coverLetterPromptTemplate = async ({
  jobDescription,
  resume,
}: {
  jobDescription: string;
  resume: string;
}): Promise<string> => {
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
  ]);
  const startingPrompt = `
Write a cover letter for the job in the job description by matching qualifications from my resume to the job description provided.
Keep the cover letter very short, three paragraphs at most. Keep the language relatively casual. Only include experiences that are directly included in my resume context.`;

  const endingPrompt = `Write a cover letter for this Job Description:\n${jobDescription}`;

  const prompt = await new PromptTemplate({
    template: `{startingPrompt}\n{context}\n{format_instructions}\n{endingPrompt}`,
    inputVariables: ['startingPrompt', 'context', 'format_instructions'],
    partialVariables: {
      startingPrompt,
      context,
      format_instructions: predictionParser.getFormatInstructions(),
      endingPrompt,
    },
  }).format({});

  return prompt;
};

export const coverLetterPredict = {
  promptTemplate: coverLetterPromptTemplate,
  parsePrediction: coverLetterParsePrediction,
};
