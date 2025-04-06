'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Function to get state from localStorage
const getLocalStorage = (key: string, defaultValue: unknown) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasActiveRequests, setHasActiveRequests] = useState(true);
  
  // Check if there are any pending requests
  useEffect(() => {
    const checkRequests = () => {
      // Get completed requests from localStorage
      const completedRequests = getLocalStorage('completedRequests', []);
      
      // Total number of requests in the system (same as in the requests page)
      const TOTAL_REQUESTS = 5;
      
      // Hide the notification dot if all requests are completed
      setHasActiveRequests(completedRequests.length < TOTAL_REQUESTS);
    };
    
    // Check initially
    checkRequests();
    
    // Set up an interval to check periodically
    const interval = setInterval(checkRequests, 1000);
    
    // Listen for storage changes (when requests are completed)
    const handleStorageChange = () => checkRequests();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
        <Link href="/dashboard" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl ${
            pathname === '/dashboard' 
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
        
        <Link href="/analytics" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl ${
            pathname === '/analytics' 
              ? 'bg-white text-[#2c3e50] shadow-md' 
              : 'text-[#2c3e50] hover:bg-[#7cbfb9]'
          } transition-colors`}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          <span className="font-medium">Analytics</span>
        </Link>
        
        <Link href="/requests" 
          className={`flex items-center mb-4 py-3 px-8 mx-4 rounded-xl relative ${
            pathname === '/requests' || pathname.startsWith('/requests/') 
              ? 'bg-white text-[#2c3e50] shadow-md' 
              : 'text-[#2c3e50] hover:bg-[#7cbfb9]'
          } transition-colors`}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </span>
          <span className="font-medium">Requests</span>
          
          {/* Notification dot - only show if there are active requests */}
          {hasActiveRequests && (
            <span className="absolute top-3 right-6 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
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