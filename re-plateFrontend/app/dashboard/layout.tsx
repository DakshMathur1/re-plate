'use client';

import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f1e6] overflow-hidden">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <div className="flex-grow ml-56">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 