import { OpenAI } from 'langchain/llms/openai';

const gptTurboModel = (apiKey: string) =>
  new OpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.9,
    openAIApiKey: apiKey,
  });

export { gptTurboModel };
