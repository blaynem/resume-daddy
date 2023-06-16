import {
  coverLetterPredict,
  experiencesPredict,
  questionPredict,
  resumeRewritePredict,
} from './prompts';
import { gptTurboModel } from '../clients/openAI';
import { jobs } from '@prisma/client';

export type PredictResponse = {
  prediction: string | null;
  error?: string;
};

type Predictinator = {
  coverLetterPredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictResponse>;
  resumeRewritePredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictResponse>;
  experiencesPredict: (
    /**
     * Individiual job object
     */
    job: jobs
  ) => Promise<PredictResponse>;
  /**
   * Answer a question based on a job description and resume.
   */
  questionAnswerPredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string,
    /**
     * Question to answer for the context of the job description.
     */
    question: string
  ) => Promise<PredictResponse>;
};

/**
 * Simple wrapper for using our AI models that helps us get typed responses.
 *
 * To use:
 * 1. Create a new instance of Predictinator
 * 2. Call the function you want to use with necessary parameters
 * 3. Get the response in the expected format, or an error.
 * @param openAIApiKey - OpenAI API key
 */
export const Predictinator = (openAIApiKey: string): Predictinator => {
  const gptClient = gptTurboModel(openAIApiKey);

  return {
    coverLetterPredict: async (jobDescription, resume) => {
      try {
        if (!jobDescription || !resume) {
          throw new Error('Missing fields');
        }
        const prompt = await coverLetterPredict.promptTemplate({
          jobDescription,
          resume,
        });
        const predictResponse = await gptClient.call(prompt);
        return coverLetterPredict.parsePrediction(predictResponse);
      } catch (err) {
        return { error: err.message, prediction: null };
      }
    },
    resumeRewritePredict: async (jobDescription, resume) => {
      try {
        if (!jobDescription || !resume) {
          throw new Error('Missing fields');
        }
        const prompt = await resumeRewritePredict.promptTemplate({
          jobDescription,
          resume,
        });
        const predictResponse = await gptClient.call(prompt);
        return resumeRewritePredict.parsePrediction(predictResponse);
      } catch (err) {
        return { error: err.message, prediction: null };
      }
    },
    experiencesPredict: async (job: jobs) => {
      try {
        if (!job) {
          throw new Error('Missing fields');
        }
        const prompt = await experiencesPredict.promptTemplate({ job });
        const predictResponse = await gptClient.call(prompt);
        return experiencesPredict.parsePrediction(predictResponse);
      } catch (err) {
        return { error: err.message, prediction: null };
      }
    },
    questionAnswerPredict: async (
      jobDescription: string,
      resume: string,
      question: string
    ) => {
      try {
        if (!jobDescription || !resume || !question) {
          throw new Error('Missing fields');
        }
        const prompt = await questionPredict.promptTemplate({
          jobDescription,
          resume,
          question,
        });
        const predictResponse = await gptClient.call(prompt);
        return questionPredict.parsePrediction(predictResponse);
      } catch (err) {
        return { error: err.message, prediction: null };
      }
    },
  };
};

// const predictor = Predictinator(process.env.OPENAI_API_KEY!);
// const blah = await predictor.questionAnswerPredict("", "","");
// blah.prediction;
export default Predictinator;
