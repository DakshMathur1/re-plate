'use client';

import Sidebar from '../components/Sidebar';

export default function RequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f1e6]">
      <Sidebar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 