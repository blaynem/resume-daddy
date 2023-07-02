import { PredictionType } from '@prisma/client';

export enum TypeOfPrediction {
  QUESTION = 'QUESTION',
  SINGLE_EXPERIENCE_ENTRY = 'SINGLE_EXPERIENCE_ENTRY',
  COVER_LETTER = 'COVER_LETTER',
}

export type PredictResponseServer = {
  data: {
    user_id: string;
    prediction: string;
    question: string;
    job_description: string;
    resume: string;
    predictionType: PredictionType;
  } | null;
  error?: string;
};

export type PredictResponseClient = {
  data: string | null;
  error?: string;
};

export type PredictRequestBody<T> = {
  typeOfPrediction: TypeOfPrediction;
  /**
   * The user id of the user that is making the request
   */
  user_id: string;
} & T;

export type PredictQuestionRequestBody = PredictRequestBody<{
  /**
   * The job description that the experience is being rewritten for
   */
  targetJobDescription: string;
  /**
   * The question that the user is asking based on their resume
   */
  question: string;
}>;

export type PredictExperienceRequestBody = PredictRequestBody<{
  /**
   * Job Experience to be rewritten
   */
  experience: string;
  /**
   * The job description that the experience is being rewritten for
   */
  targetJobDescription: string;
}>;

export type PredictCoverLetterRequestBody = PredictRequestBody<{
  targetJobDescription: string;
}>;

export type OnboardingSubmitResponse = {
  id: string | null;
  error?: string;
};

export type JobsDeleteResponse = {
  id: string | null;
  error?: string;
};
