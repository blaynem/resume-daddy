import FancyBG from '../../wrappers/fancy-bg';

export const metadata = {
  title: 'Onboarding | Resume Daddy',
  description: 'Onboarding',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FancyBG>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl p-4 bg-white border rounded-md border-violet-200">
          {children}
        </div>
      </div>
    </FancyBG>
  );
}
