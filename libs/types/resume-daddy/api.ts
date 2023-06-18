export enum TypeOfPrediction {
  QUESTION = 'QUESTION',
}

export type PredictQuestionRequestBody = {
  jobDescription: string;
  question: string;
  typeOfPrediction: TypeOfPrediction;
  job_id?: string;
};

export type OnboardingSubmitResponse = {
  id: string | null;
  error?: string;
};

export type JobsDeleteResponse = {
  id: string | null;
  error?: string;
};
