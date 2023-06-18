import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction } from '../predictinator';

const questionAnswerFormat = z.object({
  answer: z
    .string()
    .describe('The newly rewritten resume based on the job description.'),
});

type ResumeRewritePredictResponse = z.infer<typeof questionAnswerFormat>;

const predictionParser =
  StructuredOutputParser.fromZodSchema(questionAnswerFormat);

const resumeRewriteParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as ResumeRewritePredictResponse;

  if (!parsed || !parsed.answer) {
    return {
      error: 'Failed to parse response from GPT-3',
    };
  }
  return {
    prediction: parsed.answer,
  };
};

/**
 * Completely rewrite a Resume based on a job description.
 */
const resumeRewritePrompt = async ({
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

  const endingPrompt = `Rewrite my resume for this Job Description:\n${jobDescription}`;

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

export const resumeRewritePredict = {
  promptTemplate: resumeRewritePrompt,
  parsePrediction: resumeRewriteParsePrediction,
};
