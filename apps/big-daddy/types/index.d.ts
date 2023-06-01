export type PredictResponse = {
  data: string;
  error?: string;
};

export type PredictCoverLetterBody = {
  jobDescription: string;
};

export type PredictSummaryBody = {
  jobDescription?: string;
};

export type PredictResponsibilitiesBody = {
  jobDescription?: string;
};
