'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DonorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Here you would implement actual registration
      // For now we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to login on successful registration
      router.push('/donor');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e6] text-[#2c3e50] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button 
          onClick={() => router.push('/')}
          className="mb-8 flex items-center text-[#2c3e50] hover:text-[#1a2632] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="RePlate Logo" 
            width={80} 
            height={80} 
            className="mb-4 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-2">Register as a Food Donor</h1>
          <p className="text-[#5d6b79]">Join our community to help reduce food waste and feed those in need</p>
        </div>

        {/* Registration form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Organization Information */}
              <div className="sm:col-span-2">
                <h2 className="text-xl font-medium mb-4">Organization Information</h2>
              </div>

              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium mb-1">
                  Organization/Business Name*
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                  Contact Person's Name*
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="sm:col-span-2 mt-4">
                <h2 className="text-xl font-medium mb-4">Contact Information</h2>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number*
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              {/* Account Security */}
              <div className="sm:col-span-2 mt-4">
                <h2 className="text-xl font-medium mb-4">Account Security</h2>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password*
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
                <p className="mt-1 text-xs text-[#5d6b79]">
                  Password must be at least 8 characters long and include a mix of letters and numbers.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password*
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2 mt-4">
                <h2 className="text-xl font-medium mb-4">Business Address</h2>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Street Address*
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City*
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State*
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium mb-1">
                    ZIP Code*
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#ccc] rounded-md bg-[#f5f1e6] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="sm:col-span-2 mt-6">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-1 border border-[#ccc] rounded bg-[#f5f1e6] focus:ring-2 focus:ring-[#2c3e50]"
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-sm">
                    I agree to the <a href="#" className="text-[#2c3e50] hover:underline">Terms of Service</a> and <a href="#" className="text-[#2c3e50] hover:underline">Privacy Policy</a>. I understand that my information will be used as described.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 mt-6">
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
                      Creating Account...
                    </>
                  ) : 'Register Account'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm">
          Already have an account?{' '}
          <a 
            href="#" 
            className="text-[#2c3e50] hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              router.push('/donor');
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
} 