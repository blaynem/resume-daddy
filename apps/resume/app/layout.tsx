import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import './global.css';
import Navbar from './navbar';
import { Providers } from './providers';
import SupabaseProvider from './supabase-provider';

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
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
