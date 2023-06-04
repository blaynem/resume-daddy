import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { callAndParsePrompt, createContextPrompt } from './helpers';

/**
 * Creates and fires a prompt that attempts to answer a question in the contet of a job interview.
 * It will help predict the answer to the question by using the user's resume + job description.
 */
export const questionAnswerPrompt = async ({
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

  type QuestionAnswer = {
    answer: string;
  };
  const formatParser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: 'The answer to the question that was asked.',
  });

  const endingPrompt = `Interviewer:\n${question}`;

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

  const parsed = await callAndParsePrompt<QuestionAnswer>({
    prompt,
    parserFn: (val) => formatParser.parse(val),
  });
  if (!parsed) {
    throw new Error('Failed to parse response from GPT-3');
  }

  return parsed.answer;
};
