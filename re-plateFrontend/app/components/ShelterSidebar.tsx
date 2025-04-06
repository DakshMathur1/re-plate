'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShelterSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasActiveRequests, setHasActiveRequests] = useState(true);
  
  // Handle logout
  const handleLogout = () => {
    // Clear any stored state if needed
    if (typeof window !== 'undefined') {
      // Optionally clear localStorage data
      // localStorage.clear();
    }
    
    // Redirect to login page
    router.push('/login-options');
  };
  
  return (
    <div className="h-screen w-56 bg-[#b0e8e3] flex flex-col overflow-hidden">
      {/* Logo at top */}
      <div className="p-8">
        <Image 
          src="/logo.png" 
          alt="RePlate Logo" 
          width={70} 
          height={70} 
        />
      </div>
      
      {/* Navigation links */}
      <div className="flex-grow mt-8">
        <Link href="/shelter/dashboard" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl ${
            pathname === '/shelter/dashboard' 
              ? 'bg-white text-[#2c3e50] shadow-md' 
              : 'text-[#2c3e50] hover:bg-[#7cbfb9]'
          } transition-colors`}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 13h4v7H4v-7zm6-7h4v14h-4V6zm6 3h4v11h-4V9z"/>
            </svg>
          </span>
          <span className="font-medium">Dashboard</span>
        </Link>
        
        <Link href="/shelter/create-request" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl relative ${
            pathname === '/shelter/create-request' || pathname.startsWith('/shelter/create-request/') 
              ? 'bg-white text-[#2c3e50] shadow-md' 
              : 'text-[#2c3e50] hover:bg-[#7cbfb9]'
          } transition-colors`}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </span>
          <span className="font-medium">Create Request</span>
        </Link>

        <Link href="/shelter/your-requests" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl relative ${
            pathname === '/shelter/your-requests' || pathname.startsWith('/shelter/your-requests/') 
              ? 'bg-white text-[#2c3e50] shadow-md' 
              : 'text-[#2c3e50] hover:bg-[#7cbfb9]'
          } transition-colors`}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </span>
          <span className="font-medium">Your Requests</span>
        </Link>
      </div>
      
      {/* Logout button at bottom */}
      <div className="p-8 mb-4">
        <button 
          onClick={handleLogout}
          className="flex items-center text-[#2c3e50] hover:text-[#1a2632] transition-colors"
          aria-label="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 