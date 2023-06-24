import type {
  PredictResponseServer,
  PredictQuestionBody,
  PredictResumeBody,
} from '@libs/types/big-daddy';
import { parseResumeForPrompts } from '@libs/predictinator/src';
import prisma from '../../../../clients/prisma';
import predictinator from '../../../../clients/predictinator';
import { PredictionType } from '@prisma/client';
import { ResumeTailorPromptTemplateArgs } from '@libs/predictinator/src/lib/prompts/resumeTailor';

/**
 * Saves a prediction to the database.
 */
export const savePredictionToDb = async ({
  user_id,
  prediction,
  question,
  job_description,
  resume,
  predictionType,
}: {
  user_id: string;
  prediction: string;
  question: string;
  job_description: string;
  resume: string;
  predictionType: PredictionType;
}) => {
  return await prisma.predictions.create({
    data: {
      user_id,
      prediction,
      question,
      job_description,
      resume,
      type: predictionType,
    },
  });
};

const doUserFetch = async (id: string) => {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      jobs: {
        orderBy: [
          {
            user_job_order: 'asc',
          },
        ],
      },
    },
  });
};

export const questionAnswerPredict = async (
  body: PredictQuestionBody
): Promise<PredictResponseServer> => {
  try {
    const { jobDescription, question, user_id } = body;
    if (!jobDescription || !question) {
      // res.send if they are missing one of these params
      return { error: 'No job description or question provided', data: null };
    }
    const userFetch = await doUserFetch(user_id);
    if (userFetch === null) {
      return { error: 'User not found', data: null };
    }

    // Parse resume for prompt
    const parsedResume = parseResumeForPrompts(userFetch.jobs);
    // Make fetch to predictinator
    const response = await predictinator.questionAnswerPredict({
      jobDescription,
      resume: parsedResume,
      question,
    });
    if ('error' in response) {
      throw new Error(response.error);
    }
    return {
      data: {
        user_id,
        prediction: response.prediction,
        question,
        job_description: jobDescription,
        resume: parsedResume,
        predictionType: PredictionType.FREE_FORM_QUESTION,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: 'Error API', data: null };
  }
};

export const resumeTailorPredict = async (
  body: PredictResumeBody
): Promise<PredictResponseServer> => {
  try {
    const { jobDescription, user_id } = body;
    if (!jobDescription) {
      return { error: 'No job description provided', data: null };
    }
    const userFetch = await doUserFetch(user_id);
    if (!userFetch || !userFetch.jobs) {
      throw new Error('No user found');
    }
    // Parse resume for prompt
    const parsedResume = parseResumeForPrompts(userFetch.jobs);
    // Make fetch to predictinator
    const args: ResumeTailorPromptTemplateArgs = {
      jobDescription,
      resume: parsedResume,
    };
    const response = await predictinator.resumeTailorPredict(args);
    if ('error' in response) {
      throw new Error(response.error);
    }

    return {
      data: {
        user_id: user_id,
        prediction: response.prediction,
        job_description: jobDescription,
        question: '',
        resume: parsedResume,
        predictionType: PredictionType.RESUME_TAILOR,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: 'Error API', data: null };
  }
};

/** ALL BELOW HERE NEED THE PREDICTIOSN SAVED IN DB AS WELL */

// export const coverLetterPredict = async (
//   body: PredictQuestionBody
// ): Promise<PredictResponse> => {
//   try {
//     const { jobDescription, user_id } = body;
//     if (!jobDescription) {
//       return { error: 'No job description provided', data: null };
//     }
//     const userFetch = await doUserFetch(user_id);
//     if (!userFetch || !userFetch.jobs) {
//       throw new Error('No user found');
//     }
//     // Parse resume for prompt
//     const parsedResume = parseResumeForPrompts(userFetch.jobs);
//     // Make fetch to predictinator
//     const response = await predictinator.coverLetterPredict(
//       jobDescription,
//       parsedResume
//     );
//     if ('error' in response) {
//       throw new Error(response.error);
//     }
//     return { data: response.data.prediction };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error API', data: null };
//   }
// };
// export const resumeRewritePredict = async (
//   body: PredictQuestionBody
// ): Promise<PredictResponse> => {
//   try {
//     // TODO: Improve this prompt
//     const { jobDescription, user_id } = body;
//     if (!jobDescription) {
//       return { error: 'No job description provided', data: null };
//     }
//     const userFetch = await doUserFetch(user_id);
//     if (!userFetch || !userFetch.jobs) {
//       throw new Error('No user found');
//     }
//     // Parse resume for prompt
//     const parsedResume = parseResumeForPrompts(userFetch.jobs);
//     // Make fetch to predictinator
//     const response = await predictinator.resumeRewritePredict(
//       jobDescription,
//       parsedResume
//     );
//     if ('error' in response) {
//       throw new Error(response.error);
//     }
//     return { data: response.data.prediction };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error API', data: null };
//   }
// };
// export const summaryPredict = async (
//   body: PredictQuestionBody
// ): Promise<PredictResponse> => {
//   return { data: 'not implemented' };
// };
// export const experiencesPredict = async (
//   body: PredictQuestionBody
// ): Promise<PredictResponse> => {
//   try {
//     const { job_id, user_id } = body;
//     console.log('---body---', body);
//     if (!job_id) {
//       return { error: 'No job id provided', data: null };
//     }
//     const jobFetch = await prisma.jobs.findFirst({
//       where: {
//         id: job_id,
//         user_id: user_id,
//       },
//     });
//     console.log('--jobfetch--', jobFetch);
//     if (!jobFetch) {
//       return { error: 'Job not found', data: null };
//     }
//     // Make fetch to predictinator
//     const response = await predictinator.experiencesPredict(jobFetch);
//     if ('error' in response) {
//       throw new Error(response.error);
//     }
//     return { data: response.data.prediction };
//   } catch (err) {
//     console.error(err);
//     return { error: 'Error API', data: null };
//   }
// };
