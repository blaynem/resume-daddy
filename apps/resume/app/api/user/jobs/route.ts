import prisma from '../../../../clients/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type JobsDeleteResponse = {
  id: string | null;
  error?: string;
};

// Note that when we delete a job, we only delete the user_id reference to it.
//  - TODO: Anything that relies on the user_id + job_id should be taken care of as well.
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<JobsDeleteResponse>> {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    const { searchParams } = new URL(request.url);

    // Should be a string of comma separated ids
    const deleteIds = searchParams.get('deleteIds') as string;
    const toDeleteStrings = deleteIds.split(',');
    await prisma.jobs.updateMany({
      where: {
        user_id: user.id,
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
