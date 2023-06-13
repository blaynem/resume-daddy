import prisma from '../clients/prisma';
import predictinator from '../clients/predictinator';
import { Request, Response } from 'express';
import type {
  PredictCoverLetterBody,
  PredictResponse,
  PredictExperiencesBody,
  PredictResumeBody,
  PredictSummaryBody,
  PredictQuestionBody,
} from '@libs/types/big-daddy';
import { parseResumeForPrompts } from '@libs/predictinator/src';

// TODO: Eventually we need to get the user from the supabase auth header
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
    req: Request<unknown, unknown, PredictCoverLetterBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      const { jobDescription, user_id } = req.body;
      if (!jobDescription) {
        res
          .send({ error: 'No job description provided', data: null })
          .status(400);
        return;
      }
      const userFetch = await doUserFetch(user_id);
      const parsedResume = parseResumeForPrompts(userFetch.jobs);
      const answer = await predictinator.coverLetterPredict(
        jobDescription,
        parsedResume
      );
      if (answer.error) {
        throw new Error(answer.error);
      }
      res.send({ data: answer.prediction });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null }).status(400);
    }
  },
  resumeRewritePredict: async (
    req: Request<unknown, unknown, PredictResumeBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      // TODO: Improve this prompt
      const { jobDescription, user_id } = req.body;
      if (!jobDescription) {
        res
          .send({ error: 'No job description provided', data: null })
          .status(400);
        return;
      }
      const userFetch = await doUserFetch(user_id);
      const parsedResume = parseResumeForPrompts(userFetch.jobs);
      const answer = await predictinator.resumeRewritePredict(
        jobDescription,
        parsedResume
      );
      if (answer.error) {
        throw new Error(answer.error);
      }
      res.send({ data: answer.prediction });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null }).status(400);
    }
  },
  summaryPredict: async (
    req: Request<unknown, unknown, PredictSummaryBody>,
    res: Response<PredictResponse>
  ) => {
    res.send({ data: 'not implemented' });
  },
  experiencesPredict: async (
    req: Request<unknown, unknown, PredictExperiencesBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      const { jobId, user_id } = req.body;
      console.log('---req.body---', req.body);
      console.log('---req.headers---', req.headers);
      if (!jobId) {
        res.send({ error: 'No job id provided', data: null }).status(400);
        return;
      }
      const jobFetch = await prisma.jobs.findFirst({
        where: {
          id: jobId,
          user_id: user_id,
        },
      });
      console.log('--jobfetch--', jobFetch);
      if (!jobFetch) {
        res.send({ error: 'Job not found', data: null }).status(400);
        return;
      }
      const answer = await predictinator.experiencesPredict(jobFetch);
      if (answer.error) {
        throw new Error(answer.error);
      }
      res.send({ data: answer.prediction });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null }).status(400);
    }
  },
  questionAnswerPredict: async (
    req: Request<unknown, unknown, PredictQuestionBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      const { jobDescription, question, user_id } = req.body;
      if (!jobDescription || !question) {
        // res.send if they are missing one of these params
        res
          .send({
            error: 'No job description or question provided',
            data: null,
          })
          .status(400);
        return;
      }
      const userFetch = await doUserFetch(user_id);
      if (userFetch === null) {
        res.send({ error: 'User not found', data: null }).status(400);
        return;
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
      res.send({ data: answer.prediction });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null }).status(400);
    }
  },
};

export default predictController;
