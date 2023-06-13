export type PredictResponse = {
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
