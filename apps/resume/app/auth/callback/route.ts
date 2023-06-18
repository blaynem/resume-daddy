import prisma from '../../../clients/prisma';
import { Database } from '@libs/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { OnboardingSubmit } from '@libs/types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  try {
    const code = requestUrl.searchParams.get('code');

    if (!code) {
      throw new Error('No code found');
    }

    // Trade the code for a supabase auth token
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const authToken = await supabase.auth.exchangeCodeForSession(code);
    if (authToken.error) {
      throw new Error(authToken.error.message);
    }

    const authUser = authToken.data.user;
    // Signup data was created with the user id as the id
    const signupFetch = await prisma.signup.findUnique({
      where: { id: authUser.id },
    });

    if (!signupFetch || !signupFetch.data || signupFetch.completed) {
      throw new Error('Signup not found');
    }
    const signupData = signupFetch.data as OnboardingSubmit;

    if (
      !signupData.email ||
      !authUser?.email ||
      signupData.email !== authUser?.email
    ) {
      throw new Error('Not authenticated');
    }

    // We know there is a signupId, and that there was an actual signup data entry
    // We know the session email == signup data email, and that the user is authenticated

    await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        jobs: {
          createMany: {
            data: signupData.jobs.map(
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

    await prisma.signup.update({
      where: { id: authUser.id },
      data: { completed: true, date_completed: new Date() },
    });

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(requestUrl.origin);
  }
}
