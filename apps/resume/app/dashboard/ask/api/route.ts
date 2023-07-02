import { PredictRequestBody, PredictResponseClient } from '@libs/types';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseRouter } from '../../../../clients/supabase';
import { savePredictionToDb } from './predictions/utils';
import { doPrediction } from './controller';

export async function POST(
  request: NextRequest
): Promise<NextResponse<PredictResponseClient>> {
  try {
    const { user } = await supabaseRouter();
    if (!user) {
      throw new Error('No user found');
    }

    // We always require the user_id and type of prediction to be passed in.
    const reqBody = (await request.json()) as PredictRequestBody<object>;
    if (user.id !== reqBody.user_id) {
      throw new Error('User id does not match');
    }

    if (!reqBody.typeOfPrediction) {
      throw new Error('No type of prediction provided');
    }

    const predictQuestionResp = await doPrediction(reqBody);

    // If the req fails, throw an error
    if (predictQuestionResp.error || !predictQuestionResp.data) {
      throw new Error(predictQuestionResp.error);
    }

    // Save prediction to db
    const saveToDb = await savePredictionToDb(predictQuestionResp.data);
    if (!saveToDb) {
      throw new Error('Error saving prediction to db.');
    }

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
