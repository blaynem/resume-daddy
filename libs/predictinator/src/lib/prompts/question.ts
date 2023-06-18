import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction } from '../predictinator';

const questionAnswerFormat = z.object({
  answer: z.string().describe('The answer to the question:'),
});

type QuestionPredictResponse = z.infer<typeof questionAnswerFormat>;

const predictionParser =
  StructuredOutputParser.fromZodSchema(questionAnswerFormat);

const questionParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as QuestionPredictResponse;

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
const questionPromptTemplate = async ({
  jobDescription,
  resume,
  question,
}: {
  jobDescription: string;
  resume: string;
  question: string;
}) => {
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
    {
      name: 'New Job Description',
      value: jobDescription,
    },
    {
      name: 'Question',
      value: question,
    },
  ]);
  const startingPrompt = `
You are filling out a job application and are asked to answer a few questions. Below is your resume, the job description and the question you are asked to answer.
Please answer the question in the context of the job description and your resume if possible. Only include experiences that are directly included in my resume context.`;

  const endingPrompt = `Interviewer:\n${question}`;

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

export const questionPredict = {
  promptTemplate: questionPromptTemplate,
  parsePrediction: questionParsePrediction,
};
