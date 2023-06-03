export type PredictResponse = {
  data: string;
  error?: string;
};

export type PredictCoverLetterBody = {
  /**
   * The job description that we want to base our predictions on.
   */
  jobDescription: string;
};

export type PredictResumeBody = {
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

export type PredictExperiencesBody = {
  /**
   * The job id that we want to suggest updates for.
   */
  jobId: string;
  /**
   * The user id that we want to base our predictions on.
   */
  user_id;
  /**
   * The job description that we want to base our predictions on.
   */
  jobDescription?: string;
};
