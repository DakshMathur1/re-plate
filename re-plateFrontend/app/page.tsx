'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  // Only run client-side effects after mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Show logo with animation
    const showTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);
    
    // Redirect to login options after delay
    const redirectTimer = setTimeout(() => {
      router.push('/login-options');
    }, 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  // Only show content after client-side hydration is complete
  if (!isMounted) {
    return null; // Return nothing during SSR to avoid hydration mismatch
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f1e6] text-[#2c3e50] overflow-hidden">
      {/* Simple Logo Page */}
      <div 
        className={`flex flex-col items-center transition-all duration-1000 ease-in-out ${
          showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <Image 
          src="/logo.png" 
          alt="RePlate Logo" 
          width={180} 
          height={180} 
          className="mb-8"
          priority
        />
        
      </div>
    </div>
  );
}
