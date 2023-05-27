'use client';

export default function ResumesPage() {
  const onClick = async () => {
    console.log('---onClick');
  };
  return (
    <div className="p-6">
      <button
        onClick={onClick}
        className="border-2 p-2 rounder border-indigo-200"
      >
        Clicky!!!
      </button>
    </div>
  );
}
