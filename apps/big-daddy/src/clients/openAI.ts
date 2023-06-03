import { OpenAI } from 'langchain/llms/openai';

const gptTurboModel = new OpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.9,
});

export { gptTurboModel };
