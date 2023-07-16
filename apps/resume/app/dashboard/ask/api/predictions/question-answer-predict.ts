import predictinator from '../../../../../clients/predictinator';
import { parseResumeForPrompts } from '@libs/predictinator/src';
import { PredictQuestionRequestBody, PredictResponseServer } from '@libs/types';
import { PredictionType } from '@prisma/client';
import { findUserById } from './utils';

export const questionAnswerPredict = async (
  body: PredictQuestionRequestBody
): Promise<PredictResponseServer> => {
  try {
    const { targetJobDescription, question, user_id } = body;
    if (!targetJobDescription || !question) {
      // res.send if they are missing one of these params
      return { error: 'No job description or question provided', data: null };
    }
    const userFetch = await findUserById(user_id);
    if (userFetch === null) {
      return { error: 'User not found', data: null };
    }

    // Parse resume for prompt
    const parsedResume = parseResumeForPrompts(userFetch.jobs);
    // Make fetch to predictinator
    const response = await predictinator.questionAnswerPredict({
      jobDescription: targetJobDescription,
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
        job_description: targetJobDescription,
        resume: parsedResume,
        predictionType: PredictionType.FREE_FORM_QUESTION,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: 'Error API', data: null };
  }
};
