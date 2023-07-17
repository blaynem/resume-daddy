import FancyBG from '../../wrappers/fancy-bg';

export const metadata = {
  title: 'Sign in | Resume Daddy',
  description: 'Sign in',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FancyBG>{children}</FancyBG>;
}
