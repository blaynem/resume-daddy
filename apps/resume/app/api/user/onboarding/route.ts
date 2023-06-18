import { OnboardingSubmit } from '../../../onboarding/page';
import prisma from '../../../../clients/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type OnboardingSubmitResponse = {
  id: string | null;
  error?: string;
};

// Store data in the temo signup table
export async function POST(
  request: NextRequest
): Promise<NextResponse<OnboardingSubmitResponse>> {
  try {
    const { signupId, ...onboardingData } =
      (await request.json()) as OnboardingSubmit;
    const submitted = await prisma.signup.create({
      data: {
        id: signupId,
        data: {
          ...onboardingData,
        },
      },
    });

    return NextResponse.json({ id: submitted.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'There was an error.', id: null },
      {
        status: 500,
      }
    );
  }
}
