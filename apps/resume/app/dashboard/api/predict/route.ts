import { PredictQuestionBody, PredictResponse } from '@libs/types';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import predictController from './controller';

export enum TypeOfPrediction {
  JOB_EXPERIENCE = 'JOB_EXPERIENCE',
  COVER_LETTER = 'COVER_LETTER',
  QUESTION = 'QUESTION',
  RESUME = 'RESUME',
  SUMMARY = 'SUMMARY',
}

export type PredictQuestionRequestBody = {
  jobDescription: string;
  question: string;
  typeOfPrediction: TypeOfPrediction;
  job_id?: string;
};

const typeOfPredictionToUrl = {
  [TypeOfPrediction.QUESTION]: predictController.questionAnswerPredict,
  [TypeOfPrediction.JOB_EXPERIENCE]: predictController.experiencesPredict,
  [TypeOfPrediction.COVER_LETTER]: predictController.coverLetterPredict,
  [TypeOfPrediction.RESUME]: predictController.resumeRewritePredict,
  [TypeOfPrediction.SUMMARY]: predictController.summaryPredict,
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<PredictResponse>> {
  try {
    const supabase = createRouteHandlerSupabaseClient({
      headers,
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }
    const reqBody = (await request.json()) as PredictQuestionRequestBody;
    const serverBody: PredictQuestionBody = {
      user_id: user.id,
      jobDescription: reqBody.jobDescription,
      question: reqBody.question,
      job_id: reqBody.job_id,
    };
    // Get the predict action
    const predictAction = typeOfPredictionToUrl[reqBody.typeOfPrediction];
    if (!predictAction) {
      throw new Error('No predict action found');
    }
    const predictQuestionResp = await predictAction(serverBody);

    // If the req fails, throw an error
    if (predictQuestionResp.error) {
      throw new Error(predictQuestionResp.error);
    }

    return NextResponse.json(predictQuestionResp);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message, data: null },
      {
        status: 500,
      }
    );
  }
}
