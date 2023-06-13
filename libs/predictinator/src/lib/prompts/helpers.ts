import { jobs } from '@prisma/client';

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
 * Takes in an array of jobs and returns a string that can be used as a resume for the AI Prompt.
 * @param jobs - Array of jobs from the database.
 */
export const parseResumeForPrompts = (jobs: jobs[]): string =>
  jobs.reduce((acc, job) => {
    const jobString = `Title:${job.title}\nSummary:${job.summary}\nExperience:${job.experience}\nSkills:${job.temp_skills}\n`;
    return acc + jobString;
  }, '');
