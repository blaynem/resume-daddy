import { Database } from '@libs/database.types';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

/**
 * Middleware runs immediately before each route in rendered.
 * Next.js only provides read access to headers and cookies in Server Components and Route Handlers,
 * however, Supabase needs to be able to set cookies and headers to refresh expired access tokens.
 * Therefore, you must call the getSession function in middleware.js
 * in order to use a Supabase client in Server Components or Route Handlers.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}

export default middleware;
