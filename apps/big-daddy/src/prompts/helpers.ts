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
