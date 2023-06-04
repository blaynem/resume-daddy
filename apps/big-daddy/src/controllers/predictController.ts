import { shortCoverLetterPrompt } from '../prompts/coverLetter';
import prisma from '../clients/prisma';
import { jobs, user } from '@prisma/client';
import { Request, Response } from 'express';
import type {
  PredictCoverLetterBody,
  PredictResponse,
  PredictExperiencesBody,
  PredictResumeBody,
  PredictSummaryBody,
  PredictQuestionBody,
} from '@libs/types/big-daddy';
import { experienceUpdatePrompt } from '../prompts/experiences';
import { resumeRewritePrompt } from '../prompts/resumeRewrite';
import { questionAnswerPrompt } from '../prompts/question';

type userFetch = user & { jobs: jobs[] };
const parseResumeToString = (resume: userFetch) => {
  const resumeString = resume.jobs.reduce((acc, job) => {
    const jobString = `Title:${job.title}\nSummary:${job.summary}\nExperience:${job.experience}\nSkills:${job.temp_skills}\n`;
    return acc + jobString;
  }, '');
  return resumeString;
};

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
      const parsedResume = parseResumeToString(userFetch);
      const answer = await shortCoverLetterPrompt({
        jobDescription,
        resume: parsedResume,
      });
      res.send({ data: answer });
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
      const parsedResume = parseResumeToString(userFetch);
      const answer = await resumeRewritePrompt({
        jobDescription,
        resume: parsedResume,
      });
      res.send({ data: answer });
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
      const { jobId, user_id, jobDescription } = req.body;
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
      const answer = await experienceUpdatePrompt({
        job: jobFetch,
        jobDescription,
      });
      res.send({ data: answer });
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

      const parsedResume = parseResumeToString(userFetch);
      const answer = await questionAnswerPrompt({
        jobDescription,
        resume: parsedResume,
        question,
      });
      res.send({ data: answer });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null }).status(400);
    }
  },
};

export default predictController;
