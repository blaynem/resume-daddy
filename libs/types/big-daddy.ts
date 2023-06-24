import { PredictionType } from '@prisma/client';

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

export type PredictCoverLetterBody = {
  user_id: string;
  /**
   * The job description that we want to base our predictions on.
   */
  jobDescription: string;
};

export type PredictResumeBody = {
  user_id: string;
  /**
   * The job description that we want to base our predictions on.
   */
  jobDescription: string;
};

export type PredictSummaryBody = {
  /**
   * The job description that we want to base our predictions on.
   */
  jobDescription?: string;
};

export type PredictQuestionBody = {
  jobDescription: string;
  question: string;
  user_id: string;
  job_id?: string;
};

export type PredictExperiencesBody = {
  /**
   * The job id that we want to suggest updates for.
   */
  jobId: string;
  /**
   * The user id that we want to base our predictions on.
   */
  user_id: string;
};
