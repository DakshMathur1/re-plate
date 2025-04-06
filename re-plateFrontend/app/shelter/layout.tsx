'use client';

import React from 'react';
import Sidebar from '../components/ShelterSidebar';

export default function ShelterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 