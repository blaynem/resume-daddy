import { PredictQuestionBody, PredictResponse } from '@libs/types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { questionAnswerPredict } from './controller';

export enum TypeOfPrediction {
  QUESTION = 'QUESTION',
}

export type PredictQuestionRequestBody = {
  jobDescription: string;
  question: string;
  typeOfPrediction: TypeOfPrediction;
  job_id?: string;
};

const typeOfPredictionToUrl = {
  [TypeOfPrediction.QUESTION]: questionAnswerPredict,
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<PredictResponse>> {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    const reqBody = (await request.json()) as PredictQuestionRequestBody;
    // Get the predict action
    const predictAction = typeOfPredictionToUrl[reqBody.typeOfPrediction];
    if (!predictAction) {
      throw new Error('No predict action found');
    }

    const predictBody: PredictQuestionBody = {
      user_id: user.id,
      jobDescription: reqBody.jobDescription,
      question: reqBody.question,
      job_id: reqBody.job_id,
    };
    const predictQuestionResp = await predictAction(predictBody);

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
