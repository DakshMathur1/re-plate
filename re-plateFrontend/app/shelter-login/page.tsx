'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ShelterLogin() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for shelter employee
  const shelterEmployee = {
    name: "Mark Johnson",
    role: "Distribution Manager",
    shelterId: "S3201485",
    shelterName: "The Osborn"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simple validation
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError('Please enter both username and password');
      setIsSubmitting(false);
      return;
    }

    // Mock credentials check - in a real app this would be an API call
    setTimeout(() => {
      // For demo purposes, accept any non-empty credentials
      if (loginForm.username && loginForm.password) {
        // Store shelter information in localStorage
        localStorage.setItem('userType', 'shelter');
        localStorage.setItem('shelterName', shelterEmployee.shelterName);
        localStorage.setItem('shelterEmployee', JSON.stringify({
          name: shelterEmployee.name,
          role: shelterEmployee.role
        }));

        router.push('/shelter/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRecentLogin = () => {
    // Store shelter information in localStorage with Mark's details
    localStorage.setItem('userType', 'shelter');
    localStorage.setItem('shelterName', shelterEmployee.shelterName);
    localStorage.setItem('shelterEmployee', JSON.stringify({
      name: shelterEmployee.name,
      role: shelterEmployee.role
    }));

    router.push('/shelter/dashboard');
  };

  const handleBackClick = () => {
    router.push('/login-options');
  };

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
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

        <div className="text-center mb-6">
          <Image 
            src="/shelter_logo.svg" 
            alt="Shelter" 
            width={100} 
            height={100} 
            className="mb-4 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-2">{shelterEmployee.shelterName}</h1>
          <p className="text-[#5d6b79]">Food Shelter Portal</p>
        </div>
        
        {!showLoginForm ? (
          /* Recent login option */
          <div className="w-full bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium text-[#2c3e50] mb-4">Recent Login</h2>
            <div 
              className="flex items-center p-4 border border-gray-200 rounded-xl mb-6 cursor-pointer hover:bg-[#f5fcfb] hover:border-[#3d9991] transition-colors"
              onClick={handleRecentLogin}
            >
              <div className="relative h-16 w-16 mr-4 flex-shrink-0">
                <Image
                  src="/shelter-avatar.png"
                  alt="Employee Profile"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-[#e0f2f0]"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#2c3e50]">{shelterEmployee.name}</h3>
                <p className="text-[#5d6b79]">{shelterEmployee.role}</p>
                <p className="text-sm text-[#8ccfc9] mt-1">Last login: Today, 9:45 AM</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleShowLoginForm}
                className="text-[#3d9991] font-medium hover:underline"
              >
                Sign in with different account
              </button>
            </div>
          </div>
        ) : (
          /* Login form */
          <div className="w-full bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium text-[#2c3e50] mb-4">Staff Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-[#5d6b79] mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginForm.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-[#5d6b79] mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-[#3d9991] text-white hover:bg-[#54b3aa]'
                }`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button className="text-[#3d9991] text-sm hover:underline">
                Forgot password?
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <button 
                onClick={() => setShowLoginForm(false)}
                className="text-[#3d9991] font-medium hover:underline"
              >
                Back to recent logins
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-center w-full">
            <span className="text-sm text-[#5d6b79]">
              Staff Portal | {shelterEmployee.shelterName}
            </span>
          </div>
        </div>
      
    </div>
  );
} 