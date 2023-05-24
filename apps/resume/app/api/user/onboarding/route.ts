import { OnboardingSubmit } from '../../../onboarding/page';
import prisma from '../../../clients/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

/**
 * TODO:
 *  - Validate request body
 *  -
 */
export async function POST(request: NextRequest, res: NextResponse) {
  try {
    // TODO: Validate request body
    const body = (await request.json()) as OnboardingSubmit;
    const submitted = await prisma.user.create({
      data: {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        jobs: {
          createMany: {
            data: body.jobs.map((job, index) => ({
              title: job.jobTitle,
              description: job.description,
              company_name: job.companyName,
              user_job_order: index,
              responsibilities: job.responsibilities,
              temp_skills: job.skills,
            })),
          },
        } as Prisma.jobsCreateNestedManyWithoutUserInput,
      },
    });
    console.log('---submitted', submitted);
    return new Response(JSON.stringify(submitted));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'There was an error.' }), {
      status: 500,
    });
  }
}
