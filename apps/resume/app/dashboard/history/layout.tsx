export const metadata = {
  title: 'Resumes | Resume Daddy',
  description: 'Resumes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4">
      <header className="mb-2">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          History
        </h2>
        <p className="text-sm leading-6 text-gray-500">
          {`Below is a history of what what you've asked.`}
        </p>
      </header>
      {children}
    </div>
  );
}
