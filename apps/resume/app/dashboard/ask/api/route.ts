import {
  PredictQuestionBody,
  PredictQuestionRequestBody,
  PredictResponseClient,
  TypeOfPrediction,
} from '@libs/types';
import { NextRequest, NextResponse } from 'next/server';
import { questionAnswerPredict, savePredictionToDb } from './controller';
import { supabaseRouter } from '../../../../clients/supabase';

const typeOfPredictionToUrl = {
  [TypeOfPrediction.QUESTION]: questionAnswerPredict,
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<PredictResponseClient>> {
  try {
    const { user } = await supabaseRouter();
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
    if (predictQuestionResp.error || !predictQuestionResp.data) {
      throw new Error(predictQuestionResp.error);
    }

    // Save prediction to db
    await savePredictionToDb(predictQuestionResp.data);

    const predictionResp = { data: predictQuestionResp.data.prediction };
    return NextResponse.json(predictionResp);
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
