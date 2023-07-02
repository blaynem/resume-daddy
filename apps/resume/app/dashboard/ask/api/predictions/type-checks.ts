import {
  PredictRequestBody,
  PredictQuestionRequestBody,
  TypeOfPrediction,
  PredictExperienceRequestBody,
} from '@libs/types';

/**
 * Type guard for PredictQuestionRequestBody
 */
export function isQuestionRequestBody(
  body: PredictRequestBody<object>
): body is PredictQuestionRequestBody {
  return body.typeOfPrediction === TypeOfPrediction.QUESTION;
}

/**
 * Type guard for PredictExperienceRequestBody
 */
export function isExperienceRequestBody(
  body: PredictRequestBody<object>
): body is PredictExperienceRequestBody {
  return body.typeOfPrediction === TypeOfPrediction.SINGLE_EXPERIENCE_ENTRY;
}
