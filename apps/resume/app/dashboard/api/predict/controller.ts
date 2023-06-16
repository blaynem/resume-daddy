import type {
  PredictResponse,
  PredictQuestionBody,
} from '@libs/types/big-daddy';
import { parseResumeForPrompts } from '@libs/predictinator/src';
import prisma from '../../../../clients/prisma';
import predictinator from '../../../../clients/predictinator';

const doUserFetch = async (id: string) => {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      jobs: {
        orderBy: [
          {
            user_job_order: 'asc',
          },
        ],
      },
    },
  });
};

const predictController = {
  coverLetterPredict: async (
    body: PredictQuestionBody
  ): Promise<PredictResponse> => {
    try {
      const { jobDescription, user_id } = body;
      if (!jobDescription) {
        return { error: 'No job description provided', data: null };
      }
      const userFetch = await doUserFetch(user_id);
      if (!userFetch || !userFetch.jobs) {
        throw new Error('No user found');
      }
      const parsedResume = parseResumeForPrompts(userFetch.jobs);
      const answer = await predictinator.coverLetterPredict(
        jobDescription,
        parsedResume
      );
      if (answer.error) {
        throw new Error(answer.error);
      }
      return { data: answer.prediction };
    } catch (err) {
      console.error(err);
      return { error: 'Error API', data: null };
    }
  },
  resumeRewritePredict: async (
    body: PredictQuestionBody
  ): Promise<PredictResponse> => {
    try {
      // TODO: Improve this prompt
      const { jobDescription, user_id } = body;
      if (!jobDescription) {
        return { error: 'No job description provided', data: null };
      }
      const userFetch = await doUserFetch(user_id);
      if (!userFetch || !userFetch.jobs) {
        throw new Error('No user found');
      }
      const parsedResume = parseResumeForPrompts(userFetch.jobs);
      const answer = await predictinator.resumeRewritePredict(
        jobDescription,
        parsedResume
      );
      if (answer.error) {
        throw new Error(answer.error);
      }
      return { data: answer.prediction };
    } catch (err) {
      console.error(err);
      return { error: 'Error API', data: null };
    }
  },
  summaryPredict: async (
    body: PredictQuestionBody
  ): Promise<PredictResponse> => {
    return { data: 'not implemented' };
  },
  experiencesPredict: async (
    body: PredictQuestionBody
  ): Promise<PredictResponse> => {
    try {
      const { job_id, user_id } = body;
      console.log('---body---', body);
      if (!job_id) {
        return { error: 'No job id provided', data: null };
      }
      const jobFetch = await prisma.jobs.findFirst({
        where: {
          id: job_id,
          user_id: user_id,
        },
      });
      console.log('--jobfetch--', jobFetch);
      if (!jobFetch) {
        return { error: 'Job not found', data: null };
      }
      const answer = await predictinator.experiencesPredict(jobFetch);
      if (answer.error) {
        throw new Error(answer.error);
      }
      return { data: answer.prediction };
    } catch (err) {
      console.error(err);
      return { error: 'Error API', data: null };
    }
  },
  questionAnswerPredict: async (
    body: PredictQuestionBody
  ): Promise<PredictResponse> => {
    try {
      const { jobDescription, question, user_id } = body;
      if (!jobDescription || !question) {
        // res.send if they are missing one of these params
        return { error: 'No job description or question provided', data: null };
      }
      const userFetch = await doUserFetch(user_id);
      if (userFetch === null) {
        return { error: 'User not found', data: null };
      }

      const parsedResume = parseResumeForPrompts(userFetch.jobs);
      const answer = await predictinator.questionAnswerPredict(
        jobDescription,
        parsedResume,
        question
      );
      if (answer.error) {
        throw new Error(answer.error);
      }
      return { data: answer.prediction };
    } catch (err) {
      console.error(err);
      return { error: 'Error API', data: null };
    }
  },
};

export default predictController;
