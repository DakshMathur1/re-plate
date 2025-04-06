'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginOptions() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Only run client-side effects after mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Show options with a slight delay for animation
    const timer = setTimeout(() => {
      setShowOptions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Only show content after client-side hydration is complete
  if (!isMounted) {
    return null; // Return nothing during SSR to avoid hydration mismatch
  }

  const handleDonorClick = () => {
    router.push('/last-login');
  };

  const handleShelterClick = () => {
    // Will implement later
    alert('Food Shelter login coming soon!');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f1e6] text-[#2c3e50]">
      <div className={`flex flex-col items-center p-8 max-w-md w-full transition-all duration-500 ${
        showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
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

        {/* Logo and title */}
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="RePlate Logo" 
            width={100} 
            height={100} 
            className="mb-4 mx-auto"
            priority
          />
          <p className="text-[#5d6b79] mb-6">Choose your login option</p>
        </div>
        
        {/* Login Options */}
        <div className="flex flex-col items-center w-full">
          <button 
            onClick={handleDonorClick}
            className="w-full py-3 px-4 rounded-full border border-[#2c3e50] bg-[#f5f1e6] text-[#2c3e50] hover:bg-[#e0dace] transition-colors mb-4"
          >
            Food Donor
          </button>
          
          <div className="flex items-center w-full mb-4">
            <hr className="flex-grow border-t border-[#ccc]" />
            <span className="px-3 text-sm text-[#a0a0a0]">OR</span>
            <hr className="flex-grow border-t border-[#ccc]" />
          </div>
          
          <button 
            onClick={handleShelterClick}
            className="w-full py-3 px-4 rounded-full border border-[#2c3e50] bg-[#f5f1e6] text-[#2c3e50] hover:bg-[#e0dace] transition-colors"
          >
            Food Shelter
          </button>
        </div>
      </div>
    </div>
  );
} 