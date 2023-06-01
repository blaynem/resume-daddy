import { shortCoverLetterPrompt } from '../prompts/coverLetter';
import prisma from '../clients/prisma';
import { jobs, user } from '@prisma/client';
import { Request, Response } from 'express';
import type {
  PredictCoverLetterBody,
  PredictResponse,
  PredictResponsibilitiesBody,
  PredictSummaryBody,
} from '@apps/big-daddy/types';

type userFetch = user & { jobs: jobs[] };
const parseResumeToString = (resume: userFetch) => {
  const resumeString = resume.jobs.reduce((acc, job) => {
    const jobString = `Title:${job.title}\nSummary:${job.description}\nResponsibilities:${job.responsibilities}\nSkills:${job.temp_skills}\n`;
    return acc + jobString;
  }, '');
  return resumeString;
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
      const userFetch = await prisma.user.findFirst({
        where: {
          email: 'blayne.marjama@gmail.com',
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
      const parsedResume = parseResumeToString(userFetch);
      const answer = await shortCoverLetterPrompt({
        jobDescription,
        resume: parsedResume,
      });
      res.send({ data: answer });
    } catch (err) {
      console.log('err', err);
      res.send({ error: 'Error API', data: null });
    }
  },
  summaryPredict: async (
    req: Request<any, any, PredictSummaryBody>,
    res: Response<PredictResponse>
  ) => {
    res.send({ data: 'not implemented' });
  },
  responsibilitiesPredict: async (
    req: Request<any, any, PredictResponsibilitiesBody>,
    res: Response<PredictResponse>
  ) => {
    res.send({ data: 'not implemented' });
  },
};

export default predictController;
