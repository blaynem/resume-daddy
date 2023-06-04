import { gptTurboModel } from '../clients/openAI';

export type PromptContext = {
  name: string;
  value: string;
};
/**
 * Creates a context string for a given set of contexts. Split by two newlines and a `##`.
 */
export const createContextPrompt = (contexts: PromptContext[]) => {
  const middleContext = contexts
    .map((context) => `${context.name}:\n${context.value}`)
    .join('\n\n##\n\n');
  return `###\n\nContexts:\n${middleContext}\n\n###`;
};

/**
 * Calls the gptTurboModel and parses the prompt response.
 * Returns null if it failed to parse.
 * @returns {Promise<T | null>} The parsed response from GPT-3 or null if it failed to parse.
 */
export const callAndParsePrompt = async <T>({
  prompt,
  parserFn,
}: {
  prompt: string;
  parserFn: (val: string) => Promise<
    | T
    | {
        [x: string]: string;
      }
  >;
}): Promise<T | null> => {
  try {
    const resp = await gptTurboModel.call(prompt);
    const parsed = (await parserFn(resp)) as T;
    if (!parsed) {
      console.error('Unable to parse response from GPT-3', parsed);
      throw new Error('Error parsing in callAndParsePrompt.');
    }
    return parsed;
  } catch (e) {
    return null;
  }
};
