import {
  Session,
  SupabaseClient,
  User,
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export type MaybeSession = Session | null;
export type MaybeUser = User | null;

export type SupabaseClientType = {
  /**
   * The current usersession
   */
  session: MaybeSession;
  /**
   * The supabase client
   */
  supabase: SupabaseClient;
  /**
   * The current user
   */
  user: MaybeUser;
};

/**
 * Create a supabase client for use in server components
 */
export const supabaseSever = async (): Promise<SupabaseClientType> => {
  const supabase = createServerComponentClient({
    cookies,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { session, supabase, user };
};

/**
 * Create a supabase client for use in API routes
 */
export const supabaseRouter = async (): Promise<SupabaseClientType> => {
  const supabase = createRouteHandlerClient({
    cookies,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { session, supabase, user };
};
