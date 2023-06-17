import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { jobs } from '@prisma/client';
import { ParsePrediction } from '../predictinator';

const questionAnswerFormat = z.object({
  experience: z
    .string()
    .describe('A newly rephrased experience entry')
    .array()
    .describe('The list of experiences that were rephrased'),
});

export type ExperiencesPredictResponse = z.infer<typeof questionAnswerFormat>;

const predictionParser =
  StructuredOutputParser.fromZodSchema(questionAnswerFormat);

const experiencesParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as ExperiencesPredictResponse;

  if (!parsed || !parsed.experience) {
    return {
      error: 'Failed to parse response from GPT-3',
      prediction: null,
    };
  }
  return {
    prediction: parsed.experience.join('\n\n'),
  };
};

/**
 * Creates a prompt template for updating a jobs Experiences.
 */
const experiencesPromptTemplate = async ({
  job,
}: {
  job: jobs;
}): Promise<string> => {
  const context = createContextPrompt([
    {
      name: 'Job Summary',
      value: job.summary,
    },
    {
      name: 'Job Experiences',
      value: job.experience,
    },
  ]);
  // NEED TO CHANGE THIS PROMPT
  // THE PROBLEM IS THAT
  // We are asking for the STAR method so its giving us back an object like this:
  // { description, STAR, situation, task, action, result }.
  const startingPrompt = `I want to write a resume Experiences section based on the STAR method.
Help me improve my resumes Job Experiences by rephrasing and clarifying any information that is unclear.
Please embellish the details as much as you see fit, but only include experiences that are directly included in my the Contexts.`;

  const prompt = await new PromptTemplate({
    template: `{startingPrompt}\n{context}\n{format_instructions}`,
    inputVariables: ['startingPrompt', 'context', 'format_instructions'],
    partialVariables: {
      startingPrompt,
      context,
      format_instructions: predictionParser.getFormatInstructions(),
    },
  }).format({});

  return prompt;
};

export const experiencesPredict = {
  promptTemplate: experiencesPromptTemplate,
  parsePrediction: experiencesParsePrediction,
};
