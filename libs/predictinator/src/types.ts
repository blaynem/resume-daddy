import {
  CoverLetterTemplateArgs,
  ResumeRewritePromptArgs,
  ExperiencesTemplateArgs,
  QuestionPromptTemplateArgs,
} from './lib/prompts';

/**
 * Predictinators response type.
 *
 * This is how it will always be returned from the predictinator.
 */
export type PredictinatorResponse =
  | { prediction: string; prompt: string }
  | {
      error: string;
    };

/**
 * Whether the prediction was parsed successfully or errored
 */
export type ParsePrediction =
  | {
      prediction: string;
    }
  | {
      error: string;
    };

/**
 * Generic function that allows us to create pass in args and the prediction builder
 */
export type PredictinatorPredict<T> = (
  args: T
) => Promise<PredictinatorResponse>;

/**
 * Generic PredictionBuilder that we pass args to and get the correct prompt and parser
 */
export type PredictionBuilder<PromptTemplateArgs> = {
  /**
   * Returns a prompt template that can be used to send to the GPT client.
   */
  promptTemplate: (args: PromptTemplateArgs) => Promise<string>;
  /**
   * Parses the response from the GPT client.
   * Will return an error if the response is not in the expected format.
   */
  parsePrediction: (predictResponse: string) => Promise<ParsePrediction>;
};

/**
 * The potential Predictions that the Predictinator can make
 */
export type PredictinatorType = {
  /**
   * Rewrite a cover letter based on a job description.
   */
  coverLetterPredict: PredictinatorPredict<CoverLetterTemplateArgs>;
  /**
   * Rewrite a resume based on a job description.
   */
  resumeRewritePredict: PredictinatorPredict<ResumeRewritePromptArgs>;
  /**
   * Rewrite experiences part of a resume based on a job description.
   */
  experiencesPredict: PredictinatorPredict<ExperiencesTemplateArgs>;
  /**
   * Answer a question based on a job description and resume.
   */
  questionAnswerPredict: PredictinatorPredict<QuestionPromptTemplateArgs>;
};
