import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction } from '../predictinator';

const ResumeAnswerFormat = z.object({
  answer: z.string()
    .describe(`A resume tailored to the job description with the following sections:  Job Experience: Contains separate sections within for each relevant job, each with bullet points detailing the experiences there that are relevant to the job description, 
  Skills: detailing all skills that would be releavant to the current position, that emphasizes relevant skills and experiences to the job description, 
  Education: detailing all education that would be relevant to the current position, that emphasizes relevant skills and experiences to the job description,`),
});

type ResumeTailorPredictResponse = z.infer<typeof ResumeAnswerFormat>;

export type ResumeTailorPromptTemplateArgs = {
  /**
   * User pasted job description they are applying to.
   */
  jobDescription: string;
  /**
   * User's resume.
   */
  resume: string;
};

const predictionParser =
  StructuredOutputParser.fromZodSchema(ResumeAnswerFormat);

const resumeParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as ResumeTailorPredictResponse;

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
 * Creates and fires a prompt that attempts to answer a question in the contet of a job interview.
 * It will help predict the answer to the question by using the user's resume + job description.
 */
const resumeTailorPromptTemplate = async ({
  jobDescription,
  resume,
}: ResumeTailorPromptTemplateArgs) => {
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
    {
      name: 'New Job Description',
      value: jobDescription,
    },
  ]);
  const startingPrompt = `
    You are writing a resume to emphasize skills relevant to a job description. 
    Below is your resume and the job description. Only include experiences that are directly included in my resume context.`;

  const endingPrompt = ``;

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

export const resumeTailorPromptBuilder = {
  promptTemplate: resumeTailorPromptTemplate,
  parsePrediction: resumeParsePrediction,
};
