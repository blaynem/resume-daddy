export const metadata = {
  title: 'Resumes | Resume Daddy',
  description: 'Resumes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-6">{children}</div>;
}
