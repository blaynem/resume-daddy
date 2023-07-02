import { PredictRequestBody, PredictResponseServer } from '@libs/types';
import { questionAnswerPredict } from './predictions/question-answer-predict';
import { singleExperiencePredict } from './predictions/single-experience-predict';
import {
  isQuestionRequestBody,
  isExperienceRequestBody,
} from './predictions/type-checks';

/**
 * Fires the prediction based on the type of prediction in the request body.
 */
export const doPrediction = async (
  body: PredictRequestBody<object>
): Promise<PredictResponseServer> => {
  if (isQuestionRequestBody(body)) {
    return questionAnswerPredict(body);
  }

  if (isExperienceRequestBody(body)) {
    return singleExperiencePredict(body);
  }

  throw new Error('Invalid type of prediction provided');
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
