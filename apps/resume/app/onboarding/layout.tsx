import { redirect } from 'next/navigation';
import FancyBG from '../../wrappers/fancy-bg';
import { supabaseSever } from '../../clients/supabase';

export const metadata = {
  title: 'Onboarding | Resume Daddy',
  description: 'Onboarding',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await supabaseSever();

  // If the user is already signed in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  return <FancyBG>{children}</FancyBG>;
}
