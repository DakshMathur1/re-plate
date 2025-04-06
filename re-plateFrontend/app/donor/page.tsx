'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DonorLogin() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded credentials
  const VALID_CREDENTIALS = {
    loginId: 'X2111956',
    password: 'pwd1234'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials against hardcoded values
      if (loginId === VALID_CREDENTIALS.loginId && password === VALID_CREDENTIALS.password) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setError('Invalid login ID or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f1e6] text-[#2c3e50]">
      <div className="flex flex-col items-center p-8 max-w-md w-full">
        {/* Back button */}
        <button 
          onClick={() => router.push('/last-login')}
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
            width={80} 
            height={80} 
            className="mb-4 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-2">Food Donor Login</h1>
          <p className="text-[#5d6b79] mb-4">Sign in to access your RePlate account</p>
        </div>
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="loginId" className="block text-sm font-medium mb-1">
              Login ID
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
              placeholder="A0000000"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 border border-[#ccc] rounded bg-[#f5f1e6] focus:ring-2 focus:ring-[#2c3e50]"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
            
            <a href="#" className="text-sm text-[#2c3e50] hover:underline">
              Forgot ID/password?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-full ${
              isLoading 
                ? 'bg-[#8ca3b9] cursor-not-allowed' 
                : 'bg-[#2c3e50] hover:bg-[#1a2632] transition-colors'
            } text-white font-medium flex justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
        
        {/* Register link */}
        <p className="mt-6 text-center text-sm">
          New volunteer?{' '}
          <a 
            href="#" 
            className="text-[#2c3e50] hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              alert('Please contact your administrator for a new volunteer account.');
            }}
          >
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  );
} 