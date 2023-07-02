import prisma from '../../../../../clients/prisma';
import { PredictionType, Prisma } from '@prisma/client';

/**
 * Saves a prediction to the database.
 */
export const savePredictionToDb = async ({
  user_id,
  prediction,
  question,
  job_description,
  resume,
  predictionType,
}: {
  user_id: string;
  prediction: string;
  question: string;
  job_description: string;
  resume: string;
  predictionType: PredictionType;
}) => {
  try {
    return await prisma.predictions.create({
      data: {
        user_id,
        prediction,
        question,
        job_description,
        resume,
        type: predictionType,
      },
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return null;
    }
  }
  return null;
};

export const findUserById = async (id: string) => {
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

export const getUserAndJobById = async (user_id: string, job_id: string) => {
  return await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    include: {
      jobs: {
        where: {
          id: job_id,
        },
      },
    },
  });
};
