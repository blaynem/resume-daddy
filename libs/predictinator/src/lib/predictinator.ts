import {
  coverLetterPredict,
  experiencesPredict,
  questionPredict,
  resumeRewritePredict,
} from './prompts';
import { gptTurboModel } from '../clients/openAI';
import { jobs } from '@prisma/client';

export type PredictinatorResponse =
  | {
      data: { prediction: string; prompt: string };
    }
  | {
      data: null;
      error: string;
    };

export type ParsePrediction =
  | {
      prediction: string;
    }
  | {
      error: string;
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
  ) => Promise<PredictinatorResponse>;
  resumeRewritePredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictinatorResponse>;
  experiencesPredict: (
    /**
     * Individiual job object
     */
    job: jobs
  ) => Promise<PredictinatorResponse>;
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
  ) => Promise<PredictinatorResponse>;
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
    coverLetterPredict: async (
      jobDescription,
      resume
    ): Promise<PredictinatorResponse> => {
      try {
        if (!jobDescription || !resume) {
          throw new Error('Missing fields');
        }
        const prompt = await coverLetterPredict.promptTemplate({
          jobDescription,
          resume,
        });
        const predictResponse = await gptClient.call(prompt);
        const parsedPrediction = await coverLetterPredict.parsePrediction(
          predictResponse
        );
        if ('error' in parsedPrediction) {
          throw new Error(parsedPrediction.error);
        }
        return {
          data: {
            prompt: prompt,
            prediction: parsedPrediction.prediction,
          },
        };
      } catch (err) {
        return { error: (err as Error).message, data: null };
      }
    },
    resumeRewritePredict: async (
      jobDescription,
      resume
    ): Promise<PredictinatorResponse> => {
      try {
        if (!jobDescription || !resume) {
          throw new Error('Missing fields');
        }
        const prompt = await resumeRewritePredict.promptTemplate({
          jobDescription,
          resume,
        });
        const predictResponse = await gptClient.call(prompt);
        const parsedPrediction = await resumeRewritePredict.parsePrediction(
          predictResponse
        );
        if ('error' in parsedPrediction) {
          throw new Error(parsedPrediction.error);
        }
        return {
          data: {
            prompt: prompt,
            prediction: parsedPrediction.prediction,
          },
        };
      } catch (err) {
        return { error: (err as Error).message, data: null };
      }
    },
    experiencesPredict: async (job: jobs): Promise<PredictinatorResponse> => {
      try {
        if (!job) {
          throw new Error('Missing fields');
        }
        const prompt = await experiencesPredict.promptTemplate({ job });
        const predictResponse = await gptClient.call(prompt);
        const parsedPrediction = await experiencesPredict.parsePrediction(
          predictResponse
        );
        if ('error' in parsedPrediction) {
          throw new Error(parsedPrediction.error);
        }
        return {
          data: {
            prompt: prompt,
            prediction: parsedPrediction.prediction,
          },
        };
      } catch (err) {
        return { error: (err as Error).message, data: null };
      }
    },
    questionAnswerPredict: async (
      jobDescription: string,
      resume: string,
      question: string
    ): Promise<PredictinatorResponse> => {
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
        const parsedPrediction = await questionPredict.parsePrediction(
          predictResponse
        );
        if ('error' in parsedPrediction) {
          throw new Error(parsedPrediction.error);
        }
        return {
          data: {
            prompt: prompt,
            prediction: parsedPrediction.prediction,
          },
        };
      } catch (err) {
        return { error: (err as Error).message, data: null };
      }
    },
  };
};

// const predictor = Predictinator(process.env.OPENAI_API_KEY!);
// const blah = await predictor.questionAnswerPredict("", "","");
// blah.prediction;
export default Predictinator;
