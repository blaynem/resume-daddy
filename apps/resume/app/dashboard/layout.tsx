import FancyBG from '../../wrappers/fancy-bg';
import { Sidebar } from './sidebar';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { Database } from '@libs/database.types';

export const metadata = {
  title: 'Dashboard | Resume Daddy',
  description: 'Dashboard',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentSupabaseClient<Database>({
    cookies,
    headers,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }
  return (
    <FancyBG>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative mx-auto max-w-3xl p-4 bg-white border rounded-md border-violet-200 flex">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </FancyBG>
  );
}
