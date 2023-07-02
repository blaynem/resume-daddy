import predictinator from '../../../../../clients/predictinator';
import {
  PredictExperienceRequestBody,
  PredictResponseServer,
} from '@libs/types';
import { findUserById } from './utils';
import { parseResumeForPrompts } from '@libs/predictinator/src';
import { PredictionType } from '@prisma/client';

export const singleExperiencePredict = async (
  body: PredictExperienceRequestBody
): Promise<PredictResponseServer> => {
  try {
    const { targetJobDescription, user_id, experience } = body;
    if (!targetJobDescription || !experience) {
      // res.send if they are missing one of these params
      return {
        error: 'No job description or job experience provided',
        data: null,
      };
    }
    const userFetch = await findUserById(user_id);
    if (userFetch === null) {
      return { error: 'User not found', data: null };
    }

    // Make fetch to predictinator
    const response = await predictinator.experiencesPredict({
      job: userFetch.jobs[0],
      jobDescription: targetJobDescription,
    });

    if ('error' in response) {
      throw new Error(response.error);
    }

    return {
      data: {
        user_id,
        prediction: response.prediction,
        question: '',
        job_description: targetJobDescription,
        resume: parseResumeForPrompts(userFetch.jobs),
        predictionType: PredictionType.SINGLE_EXPERIENCE_ENTRY,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: 'Error API', data: null };
  }
};
