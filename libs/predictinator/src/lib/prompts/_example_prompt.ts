import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createContextPrompt } from './helpers';
import { ParsePrediction, PredictionBuilder } from '../../types';

/**
 * ====== Example Prompt ======
 * In this example we will create a prompt that asks a question in the context of a job interview.
 *
 *
 * Each prompt builder needs to:
 * 1. Create the questionAnswerFormat type object
 * 2. Type the Prompt Template Args
 * 3. Create the promptTemplate function
 * 4. Create the parsePrediction function
 * 5. Export the builder
 */

/**
 * Arguments that will be passed to the prompt template.
 */
export type NewPromptArgs = {
  /**
   * User pasted job description they are applying to.
   */
  jobDescription: string;
  /**
   * User's resume.
   */
  resume: string;
};

/**
 * The format we expect the response from gpt to be in.
 */
const questionAnswerFormat = z.object({
  answer: z
    .string()
    .describe('The newly rewritten resume based on the job description.'),
});

// Infer the type of the questionAnswerFormat
type ResumeRewritePredictResponse = z.infer<typeof questionAnswerFormat>;

// Get the parser from the questionAnswerFormat
const predictionParser =
  StructuredOutputParser.fromZodSchema(questionAnswerFormat);

/**
 * Used to parse the response from gpt
 */
const resumeRewriteParsePrediction = async (
  predictResponse: string
): Promise<ParsePrediction> => {
  const parsed = (await predictionParser.parse(
    predictResponse
  )) as ResumeRewritePredictResponse;

  // Return an error if we don't get the expected response
  if (!parsed || !parsed.answer) {
    return {
      error: 'Failed to parse response from GPT',
    };
  }

  return {
    prediction: parsed.answer,
  };
};

/**
 * The prompt template that will be sent to the GPT client.
 * Takes in the args and returns a string.
 */
const resumeRewritePrompt = async ({
  jobDescription,
  resume,
}: NewPromptArgs) => {
  // Create a context prompt that will be used to give the model context.
  const context = createContextPrompt([
    {
      name: 'My Resume',
      value: resume,
    },
  ]);

  // Create the starting
  const startingPrompt = `
I am applying for the job with this job description using my resume. I want to custom tailor my resume to give me the best shot landing the job.
Whenever applicable, customize bullet points from my resume to match key words from the job description provided to give me the best shot of landing an interview.
Do not change company names of where I worked in the updated resume.
Only include experiences that are directly included in my resume context.`;

  // Create the ending prompt
  const endingPrompt = `Rewrite my resume for this Job Description:\n${jobDescription}`;

  // Create the prompt using the PromptTemplate from langchain.
  // Note the order of the template is how the prompt will be built.
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

  // Log the prompt to see what it looks like
  // console.log('--myNewPrompt--', prompt)

  return prompt;
};

/**
 * The builder that will be exported and used by the Predictinator.
 */
export const resumeRewritePromptBuilder: PredictionBuilder<NewPromptArgs> = {
  promptTemplate: resumeRewritePrompt,
  parsePrediction: resumeRewriteParsePrediction,
};
