import FancyBG from '../../wrappers/fancy-bg';
import { Sidebar } from './sidebar';
import { redirect } from 'next/navigation';
import { supabaseSever } from '../../clients/supabase';

export const metadata = {
  title: 'Dashboard | Resume Daddy',
  description: 'Dashboard',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await supabaseSever();

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
