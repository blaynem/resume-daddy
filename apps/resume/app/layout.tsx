import './global.css';
import Navbar from './navbar';
import { Providers } from './providers';
import SupabaseProvider from '../clients/supabase-provider';
import { supabaseSever } from '../clients/supabase';

export const metadata = {
  title: 'Resume Daddy',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await supabaseSever();
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
