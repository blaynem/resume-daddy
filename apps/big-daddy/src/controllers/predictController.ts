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
} from '@apps/big-daddy/types';
import { experienceUpdatePrompt } from '../prompts/experience';
import { resumeRewritePrompt } from '../prompts/resumeRewrite';

const temp_email = 'blayne.marjama@gmail.com';
const temp_user_id = '3bf7c478-23f6-473b-b5a2-620843034004';

type userFetch = user & { jobs: jobs[] };
const parseResumeToString = (resume: userFetch) => {
  const resumeString = resume.jobs.reduce((acc, job) => {
    const jobString = `Title:${job.title}\nSummary:${job.summary}\nExperience:${job.experience}\nSkills:${job.temp_skills}\n`;
    return acc + jobString;
  }, '');
  return resumeString;
};

const doUserFetch = async () => {
  return await prisma.user.findFirst({
    where: {
      email: temp_email,
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
    req: Request<any, any, PredictCoverLetterBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      const { jobDescription } = req.body;
      if (!jobDescription) {
        res.send({ error: 'No job description provided', data: null });
        return;
      }
      const userFetch = await doUserFetch();
      const parsedResume = parseResumeToString(userFetch);
      const answer = await shortCoverLetterPrompt({
        jobDescription,
        resume: parsedResume,
      });
      res.send({ data: answer });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null });
    }
  },
  resumeRewritePredict: async (
    req: Request<any, any, PredictResumeBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      // TODO: Improve this prompt
      const { jobDescription } = req.body;
      if (!jobDescription) {
        res.send({ error: 'No job description provided', data: null });
        return;
      }
      const userFetch = await doUserFetch();
      const parsedResume = parseResumeToString(userFetch);
      const answer = await resumeRewritePrompt({
        jobDescription,
        resume: parsedResume,
      });
      res.send({ data: answer });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null });
    }
  },
  summaryPredict: async (
    req: Request<any, any, PredictSummaryBody>,
    res: Response<PredictResponse>
  ) => {
    res.send({ data: 'not implemented' });
  },
  experiencesPredict: async (
    req: Request<any, any, PredictExperiencesBody>,
    res: Response<PredictResponse>
  ) => {
    try {
      const { jobId, jobDescription } = req.body;
      if (!jobId) {
        res.send({ error: 'No job id provided', data: null });
        return;
      }
      const jobFetch = await prisma.jobs.findFirst({
        where: {
          id: jobId,
          user_id: temp_user_id,
        },
      });
      if (!jobFetch) {
        res.send({ error: 'Job not found', data: null });
        return;
      }
      const answer = await experienceUpdatePrompt({
        summary: jobFetch.summary,
        experiences: jobFetch.experience,
        jobDescription,
      });
      res.send({ data: answer });
    } catch (err) {
      console.error(err);
      res.send({ error: 'Error API', data: null });
    }
  },
};

export default predictController;
