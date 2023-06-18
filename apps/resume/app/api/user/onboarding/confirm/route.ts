import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../clients/prisma';
import type { ConfirmEmailPostBody } from '../../../../onboarding/confirm-email/page';
import { OnboardingSubmit } from '../../../../onboarding/page';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

/**
 * This route only goal is to fire once a user has successfully signed up.
 *  Flow:
 *  - User inputs all information on onboarding page
 *  - On submit, they are prompted to sign up
 *  - Once they enter their credentials
 *      - 1. The users inputted data is stored in signup table
 *          - Return the id in that signup table
 *      - 2. The verification email is sent off with the signup id
 *  - Once the user clicks the link in their email, they will be redirected to a "confirmed signup" page that will
 *      - Attach the session data
 *      - Call this api route with the signupId in the query params, and the session data will be grabbed from supabase.auth.getSession()
 *  - This api request will:
 *    - 1. Parse the sessions data + the signup table data
 *    - 2. Create a user with the data from the signup table
 *    - 3. Delete the signup table entry
 *    - 4. Return a confirmation message
 */
export type ConfirmEmailPostResponse = {
  success?: string;
  error?: string;
};
export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createRouteHandlerClient({
    cookies,
  });
  try {
    const requestData = (await req.json()) as ConfirmEmailPostBody;

    // Get the signup data
    const signupFetch = await prisma.signup.findUnique({
      where: { id: requestData.signupId },
    });

    if (!signupFetch || !signupFetch.data || signupFetch.completed) {
      throw new Error('Signup not found');
    }
    const signupData = signupFetch.data as OnboardingSubmit;

    // Get the current user from supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!signupData.email || !user?.email || signupData.email !== user?.email) {
      throw new Error('Not authenticated');
    }

    // We know there is a signupId, and that there was an actual signup data entry
    // We know the session email == signup data email, and that the user is authenticated

    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
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
      where: { id: requestData.signupId },
      data: { completed: true, date_completed: new Date() },
    });

    return NextResponse.json({ success: 'success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'There was an error.' }, { status: 500 });
  }
}
