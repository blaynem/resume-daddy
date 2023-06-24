import {
  CoverLetterTemplateArgs,
  ExperiencesTemplateArgs,
  QuestionPromptTemplateArgs,
  ResumeRewritePromptArgs,
  coverLetterPromptBuilder,
  experiencesPromptBuilder,
  questionPromptBuilder,
  resumeRewritePromptBuilder,
  resumeTailorPromptBuilder,
} from './prompts';
import { gptTurboModel } from '../clients/openAI';
import { jobs } from '@prisma/client';
import { createPredictor } from './createPredictor';
import { PredictinatorType } from '../types';
import { ResumeTailorPromptTemplateArgs } from './prompts/resumeTailor';

export type PredictinatorResponse =
  | {
      data: { prediction: string; prompt: string };
    }
  | {
      data: null;
      error: string;
    };

export type ParsePrediction =
  | {
      prediction: string;
    }
  | {
      error: string;
    };

type Predictinator = {
  coverLetterPredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictinatorResponse>;
  resumeRewritePredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictinatorResponse>;
  experiencesPredict: (
    /**
     * Individiual job object
     */
    job: jobs
  ) => Promise<PredictinatorResponse>;
  /**
   * Answer a question based on a job description and resume.
   */
  questionAnswerPredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string,
    /**
     * Question to answer for the context of the job description.
     */
    question: string
  ) => Promise<PredictinatorResponse>;

  resumeTailorPredict: (
    /**
     * User pasted job description they are applying to.
     */
    jobDescription: string,
    /**
     * User's resume.
     */
    resume: string
  ) => Promise<PredictinatorResponse>;
};

/**
 * Simple wrapper for using our AI models that helps us get typed responses.
 *
 * To use:
 * 1. Create a new instance of Predictinator
 * 2. Call the function you want to use with necessary parameters
 * 3. Get the response in the expected format, or an error.
 * @param openAIApiKey - OpenAI API key
 */
export const Predictinator = (openAIApiKey: string): PredictinatorType => {
  const gptClient = gptTurboModel(openAIApiKey);

  return {
    coverLetterPredict: (args: CoverLetterTemplateArgs) =>
      createPredictor<CoverLetterTemplateArgs>(
        args,
        gptClient,
        coverLetterPromptBuilder
      ),
    resumeRewritePredict: (args: ResumeRewritePromptArgs) =>
      createPredictor<ResumeRewritePromptArgs>(
        args,
        gptClient,
        resumeRewritePromptBuilder
      ),
    experiencesPredict: (args: ExperiencesTemplateArgs) =>
      createPredictor<ExperiencesTemplateArgs>(
        args,
        gptClient,
        experiencesPromptBuilder
      ),
    questionAnswerPredict: (args: QuestionPromptTemplateArgs) =>
      createPredictor<QuestionPromptTemplateArgs>(
        args,
        gptClient,
        questionPromptBuilder
      ),
    resumeTailorPredict: (args: ResumeTailorPromptTemplateArgs) =>
      createPredictor<ResumeTailorPromptTemplateArgs>(
        args,
        gptClient,
        resumeTailorPromptBuilder
      ),
  };
};
