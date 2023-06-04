import { PredictQuestionBody, PredictResponse } from '@libs/types';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { TypeOfPrediction } from '../../resumes/page';

export type PredictQuestionRequestBody = {
  jobDescription: string;
  question: string;
  typeOfPrediction: TypeOfPrediction;
};

const typeOfPredictionToUrl = {
  [TypeOfPrediction.QUESTION]: '/predict/questions',
  [TypeOfPrediction.JOB_EXPERIENCE]: '/predict/experiences',
  [TypeOfPrediction.COVER_LETTER]: '/predict/coverLetter',
  [TypeOfPrediction.RESUME]: '/predict/resume',
  [TypeOfPrediction.SUMMARY]: '/predict/summary',
};

const BASE_SERVER_URL = 'http://localhost:3000';
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
    };
    // Get the correct url
    const predictUrl = typeOfPredictionToUrl[reqBody.typeOfPrediction];
    // Make fetch to the server
    const predictQuestionResp = (await fetch(
      `${BASE_SERVER_URL}${predictUrl}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverBody),
      }
    ).then((res) => res.json())) as PredictResponse;

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
