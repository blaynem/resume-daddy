import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction, PredictionBuilder } from '../../types';

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

export type CoverLetterTemplateArgs = {
  /**
   * User pasted job description they are applying to.
   */
  jobDescription: string;
  /**
   * User's resume.
   */
  resume: string;
};

const coverLetterPromptTemplate = async ({
  jobDescription,
  resume,
}: CoverLetterTemplateArgs): Promise<string> => {
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
    {
      name: 'Target Job Description',
      value: jobDescription,
    },
  ]);
  const startingPrompt = `
You are writing a cover letter for the role in the provided Target Job Description, by matching qualifications to your resume.
Keep the cover letter very short, three paragraphs at most. Keep the language relatively casual.
Please write the cover letter in the context of the provided job description and your resume.

DO NOT include experiences that ARE NOT directly included in the resume context.
If there are no experiences in the resume that match the job description, then make an attempt to draw parallels to the job description.
If none of this is possible, then mention the job description in the cover letter and explain why you may be a good fit.`;

  const endingPrompt = `Cover Letter:\n`;

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

export const coverLetterPromptBuilder: PredictionBuilder<CoverLetterTemplateArgs> =
  {
    promptTemplate: coverLetterPromptTemplate,
    parsePrediction: coverLetterParsePrediction,
  };
