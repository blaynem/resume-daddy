import prisma from '@apps/resume/app/clients/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type JobsDeleteResponse = {
  id: string | null;
  error?: string;
};

// Store data in the temo signup table
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<JobsDeleteResponse>> {
  try {
    // Check the user here from supabase and make sure they are allowed to delete
    const toDeleteStrings = (await request.json()) as string[];
    await prisma.jobs.updateMany({
      where: {
        id: {
          in: toDeleteStrings,
        },
      },
      data: {
        user_id: null,
      },
    });

    return NextResponse.json({ id: null });
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
