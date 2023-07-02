import { OpenAI } from 'langchain/llms/openai';
import { PredictinatorResponse, PredictionBuilder } from '../types';

/**
 * Generic function that allows us to create pass in args and the prediction builder
 * that will be used to create the prompt, fetch it from gpt, and parse the response
 *
 * @param args The arguments that will be passed to the prediction builder
 * @param predictionBuilder The prediction builder that will be used to create the prompt, fetch it from gpt, and parse the response
 * @param gptClient The gpt client that will be used
 */
export const createPredictor = async <T>(
  args: T,
  gptClient: OpenAI,
  predictionBuilder: PredictionBuilder<T>
): Promise<PredictinatorResponse> => {
  try {
    if (!args) {
      throw new Error('Missing fields');
    }
    const { promptTemplate, parsePrediction } = predictionBuilder;
    const prompt = await promptTemplate(args);
    const predictResponse = await gptClient.call(prompt);
    const parsedPrediction = await parsePrediction(predictResponse);
    console.log('parsedPrediction', parsedPrediction);
    if ('error' in parsedPrediction) {
      throw new Error(parsedPrediction.error);
    }

    return {
      prompt: prompt,
      prediction: parsedPrediction.prediction,
    };
  } catch (err) {
    return { error: (err as Error).message };
  }
};
