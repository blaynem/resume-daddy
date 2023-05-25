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
  return <FancyBG>{children}</FancyBG>;
}
