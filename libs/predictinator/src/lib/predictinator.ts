import {
  CoverLetterTemplateArgs,
  ExperiencesTemplateArgs,
  QuestionPromptTemplateArgs,
  ResumeRewritePromptArgs,
  coverLetterPromptBuilder,
  experiencesPromptBuilder,
  questionPromptBuilder,
  resumeRewritePromptBuilder,
} from './prompts';
import { gptTurboModel } from '../clients/openAI';
import { createPredictor } from './createPredictor';
import { PredictinatorType } from '../types';

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
  };
};
