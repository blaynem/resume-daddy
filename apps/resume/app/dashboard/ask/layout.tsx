export const metadata = {
  title: 'Ask | Resume Daddy',
  description: 'Get help with your job application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4">
      <header className="mb-2">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Ask</h2>
        <p className="text-sm leading-6 text-gray-500">
          Need help with your job application? Fill out the form below and let
          us create the perfect response based on your profile.
        </p>
      </header>
      {children}
    </div>
  );
}
