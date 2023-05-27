import prisma from '@apps/resume/app/clients/prisma';
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type JobsDeleteResponse = {
  id: string | null;
  error?: string;
};

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<JobsDeleteResponse>> {
  try {
    const supabase = createRouteHandlerSupabaseClient({
      headers,
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    // Check the user here from supabase and make sure they are allowed to delete
    const toDeleteStrings = (await request.json()) as string[];
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
