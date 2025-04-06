'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DonorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('donations');
  // Add volunteer info
  const volunteerInfo = {
    id: 'X2111956',
    name: 'John Doe',
    organization: 'Community Food Bank',
    role: 'Volunteer Coordinator'
  };

  // Mock data for demonstration
  const donations = [
    { id: 1, name: 'Pasta and Salad', quantity: '5 meals', date: 'April 5, 2023', status: 'Scheduled', shelter: 'Hope Community Center' },
    { id: 2, name: 'Sandwiches', quantity: '10 boxes', date: 'April 3, 2023', status: 'Completed', shelter: 'Second Harvest Food Bank' },
    { id: 3, name: 'Fresh Vegetables', quantity: '15 lbs', date: 'March 28, 2023', status: 'Completed', shelter: 'City Mission' },
  ];

  // Add session check
  useEffect(() => {
    // In a real app, you would check if the user is logged in
    // For now, we'll just simulate it
    const isAuthenticated = true;
    if (!isAuthenticated) {
      router.push('/donor');
    }
  }, [router]);

  const handleLogout = () => {
    // In a real app, you would clear session/auth data here
    router.push('/donor');
  };

  return (
    <div className="min-h-screen bg-[#f5f1e6] text-[#2c3e50]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="RePlate Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">{volunteerInfo.name}</div>
              <div className="text-xs text-gray-500">ID: {volunteerInfo.id}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-md border border-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">Volunteer Dashboard</h2>
              <p className="text-[#5d6b79]">
                Manage your food donations and help reduce food waste while supporting those in need.
              </p>
            </div>
            <div className="text-right bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium">{volunteerInfo.organization}</p>
              <p className="text-xs text-[#5d6b79]">{volunteerInfo.role}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-[#ccc]">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('donations')}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'donations' 
                  ? 'border-[#2c3e50] text-[#2c3e50]' 
                  : 'border-transparent text-[#5d6b79] hover:text-[#2c3e50] hover:border-[#ccc]'
              }`}
            >
              My Donations
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'schedule' 
                  ? 'border-[#2c3e50] text-[#2c3e50]' 
                  : 'border-transparent text-[#5d6b79] hover:text-[#2c3e50] hover:border-[#ccc]'
              }`}
            >
              Schedule Pickup
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'profile' 
                  ? 'border-[#2c3e50] text-[#2c3e50]' 
                  : 'border-transparent text-[#5d6b79] hover:text-[#2c3e50] hover:border-[#ccc]'
              }`}
            >
              Profile Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          {activeTab === 'donations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Recent Donations</h3>
                <button className="px-4 py-2 rounded-md bg-[#2c3e50] text-white hover:bg-[#1a2632] transition-colors text-sm">
                  New Donation
                </button>
              </div>
              
              {/* Donations table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#edf2f7]">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Food Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#5d6b79] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf2f7] bg-white">
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {donation.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#5d6b79]">
                          {donation.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#5d6b79]">
                          {donation.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            donation.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#5d6b79]">
                          {donation.shelter}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#2c3e50] hover:text-[#1a2632] mr-3">
                            View
                          </button>
                          {donation.status === 'Scheduled' && (
                            <button className="text-red-600 hover:text-red-800">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                          No donations yet. Create a new donation to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Schedule New Pickup</h3>
              <p className="text-[#5d6b79] mb-6">Schedule a pickup for food donations from your organization</p>
              <button className="px-4 py-2 rounded-md bg-[#2c3e50] text-white hover:bg-[#1a2632] transition-colors">
                Create New Pickup Request
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto py-8">
              <h3 className="text-lg font-medium mb-6 text-center">Your Profile</h3>
              
              <div className="bg-[#f5f1e6] rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#5d6b79]">Volunteer ID</p>
                    <p className="font-medium">{volunteerInfo.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5d6b79]">Full Name</p>
                    <p className="font-medium">{volunteerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5d6b79]">Organization</p>
                    <p className="font-medium">{volunteerInfo.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5d6b79]">Role</p>
                    <p className="font-medium">{volunteerInfo.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 rounded-md border border-[#2c3e50] text-[#2c3e50] hover:bg-[#f5f1e6] transition-colors text-sm">
                  Change Password
                </button>
                <button className="px-4 py-2 rounded-md bg-[#2c3e50] text-white hover:bg-[#1a2632] transition-colors text-sm">
                  Update Contact Info
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 