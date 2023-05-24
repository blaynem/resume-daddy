import './global.css';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import SupabaseProvider from './supabase-provider';
import Navbar from './navbar';

export const metadata = {
  title: 'Resume Daddy',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider session={session}>
          <Navbar />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
