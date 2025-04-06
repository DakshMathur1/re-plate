'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LastLogin() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Mock data for last login
  const lastLogin = {
    time: "April 6, 2023 at 10:45 AM",
    user: "X2111956"
  };

  // Only run client-side effects after mounting
  useEffect(() => {
    setIsMounted(true);
    
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Only show content after client-side hydration is complete
  if (!isMounted) {
    return null; // Return nothing during SSR to avoid hydration mismatch
  }

  const handleContinue = () => {
    router.push('/donor');
  };

  const handleBackClick = () => {
    router.push('/login-options');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f1e6] text-[#2c3e50] overflow-hidden">
      <div 
        className={`flex flex-col items-center p-8 max-w-md w-full transition-all duration-500 ease-in-out ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Back button */}
        <button 
          onClick={handleBackClick}
          className="self-start mb-8 flex items-center text-[#2c3e50] hover:text-[#1a2632] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <Image 
            src="/food_stash.png" 
            alt="Food Stash Logo" 
            width={180} 
            height={180} 
            className="mb-6 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
          <p className="text-[#5d6b79] mb-1">Ready to reduce food waste and fight hunger</p>
          
          {/* Last login information */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm text-sm text-[#5d6b79]">
            <p>Last login: {lastLogin.time}</p>
            <p>User ID: {lastLogin.user}</p>
          </div>
        </div>
        
        <button 
          onClick={handleContinue}
          className="mt-6 py-3 px-8 rounded-full bg-[#2c3e50] text-white hover:bg-[#1a2632] transition-colors font-medium"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
} 