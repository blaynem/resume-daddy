import prisma from '../../../../clients/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { OnboardingSubmit, OnboardingSubmitResponse } from '@libs/types';
import { supabaseRouter } from '../../../../clients/supabase';
import { Prisma } from '@prisma/client';

export async function POST(
  request: NextRequest
): Promise<NextResponse<OnboardingSubmitResponse>> {
  try {
    const { supabase } = await supabaseRouter();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { signupId, ...onboardingData } =
      (await request.json()) as OnboardingSubmit;

    if (!authUser || !signupId || authUser.id !== signupId) {
      throw new Error('Not authenticated');
    }

    const user = await prisma.user.findFirst({
      where: {
        email: onboardingData.email,
      },
    });

    if (user) {
      // If the user already exists, we can just return the user id and not onboard anything
      return NextResponse.json({ id: authUser.id });
    }

    await prisma.user.create({
      data: {
        id: authUser.id,
        email: onboardingData.email,
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        jobs: {
          createMany: {
            data: onboardingData.jobs.map(
              (job, index) =>
                ({
                  company_name: job.companyName,
                  title: job.jobTitle,
                  summary: job.summary,
                  experience: job.experiences,
                  user_job_order: index,
                  temp_skills: job.skills,
                } as Prisma.jobsCreateManyUserInput)
            ),
          } as Prisma.jobsCreateManyUserInputEnvelope,
        },
      },
    });

    return NextResponse.json({ id: authUser.id });
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
