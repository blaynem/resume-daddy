import predictinator from '../../../../../clients/predictinator';
import {
  PredictCoverLetterRequestBody,
  PredictResponseServer,
} from '@libs/types';
import { findUserById } from './utils';
import { parseResumeForPrompts } from '@libs/predictinator/src';
import { PredictionType } from '@prisma/client';

export const coverLetterPredict = async (
  body: PredictCoverLetterRequestBody
): Promise<PredictResponseServer> => {
  try {
    const { targetJobDescription, user_id } = body;
    if (!targetJobDescription) {
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

    // Parse resume for prompt
    const parsedResume = parseResumeForPrompts(userFetch.jobs);
    // Make fetch to predictinator
    const response = await predictinator.coverLetterPredict({
      resume: parsedResume,
      jobDescription: targetJobDescription,
    });

    if ('error' in response) {
      throw new Error(response.error);
    }

    return {
      data: {
        user_id,
        prediction: response.prediction,
        question: 'Cover Letter',
        job_description: targetJobDescription,
        resume: parsedResume,
        predictionType: PredictionType.COVER_LETTER,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: 'Error API', data: null };
  }
};
