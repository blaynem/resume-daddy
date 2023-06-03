import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';

import { StructuredOutputParser } from 'langchain/output_parsers';
import { gptTurboModel } from '../clients/openAI';
import { createContextPrompt } from './helpers';
import { jobs } from '@prisma/client';

/**
 * Creates a prompt template for updating a jobs Experiences.
 */
export const experienceUpdatePrompt = async ({
  job,
  jobDescription,
}: {
  job: jobs;
  jobDescription?: string;
}) => {
  const context = createContextPrompt([
    {
      name: 'Job Summary',
      value: job.summary,
    },
    {
      name: 'Job Experiences',
      value: job.experience,
    },
  ]);
  const startingPrompt = `I want to write a resume Experiences section based on the STAR method.
Help me improve my resumes Job Experiences by rephrasing and clarifying any information that is unclear.
Please embellish the details as much as you see fit, but only include experiences that are directly included in my the Contexts.`;

  const formatParser = StructuredOutputParser.fromZodSchema(
    z.object({
      experience: z
        .string()
        .describe('A newly rephrased experience entry')
        .array()
        .describe('The list of experiences that were rephrased'),
    })
  );

  const prompt = await new PromptTemplate({
    template: `{startingPrompt}\n{context}\n{format_instructions}`,
    inputVariables: ['startingPrompt', 'context', 'format_instructions'],
    partialVariables: {
      startingPrompt,
      context,
      format_instructions: formatParser.getFormatInstructions(),
    },
  }).format({});
  // NEED TO CHANGE THIS PROMPT
  // THE PROBLEM IS THAT
  // We are asking for the STAR method so its giving us back an object like this:
  // { description, STAR, situation, task, action, result }.

  console.log('---prompt---', prompt);

  // const resp = await gptTurboModel.call(prompt);
  // console.log('--resp--', resp);
  return 'test';

  // const parsed = await formatParser.parse(resp);
  // console.log('---parsed---', parsed);
  // if (!parsed || !parsed.experience) {
  //   console.error('Failed to parse response from GPT-3', resp);
  //   throw new Error('Failed to parse response from GPT-3');
  // }
  // return parsed.experience.join('\n\n');
};
