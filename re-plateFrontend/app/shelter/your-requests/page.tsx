'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Function to get state from localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

type RequestItem = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
};

type FoodRequest = {
  id: number;
  title: string;
  urgency: string;
  status: string;
  items: RequestItem[];
  notes: string;
  createdAt: string;
};

export default function YourRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch requests from localStorage
    const storedRequests = getLocalStorage('shelterRequests', []);
    setRequests(storedRequests);
    setIsLoading(false);
  }, []);

  // Filter requests based on status
  const filteredRequests = activeFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status.toLowerCase() === activeFilter.toLowerCase());
  
  // Function to get appropriate badge color based on urgency
  const getUrgencyColor = (urgency: string) => {
    switch(urgency.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Function to get appropriate badge color based on status
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#3d9991] mb-4 md:mb-0">Your Food Requests</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => router.push('/shelter/dashboard')}
            className="px-4 py-2 border border-[#3d9991] text-[#3d9991] rounded-lg hover:bg-[#f5fcfb] transition-colors"
          >
            Back to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/shelter/create-request')}
            className="px-4 py-2 bg-[#3d9991] text-white rounded-lg hover:bg-[#2c7872] transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Request
          </button>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-full sm:w-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-md ${
            activeFilter === 'all' ? 'bg-white shadow-sm text-black': 'text-black hover:text-gray-900'
          } transition-colors`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 rounded-md ${
            activeFilter === 'active' ? 'bg-white shadow-sm text-black' : 'text-black hover:text-gray-900'
          } transition-colors`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('accepted')}
          className={`px-4 py-2 rounded-md ${
            activeFilter === 'accepted' ? 'bg-white shadow-sm text-black' : 'text-black hover:text-gray-900'
          } transition-colors`}
        >
          Accepted
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            activeFilter === 'completed' ? 'bg-white shadow-sm text-black' : 'text-black hover:text-gray-900'
          } transition-colors`}
        >
          Completed
        </button>
      </div>
      
      {/* Requests list */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d9991] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === 'all' 
              ? "You haven't created any food requests yet."
              : `You don't have any ${activeFilter} requests.`
            }
          </p>
          <button
            onClick={() => router.push('/shelter/create-request')}
            className="inline-flex items-center px-4 py-2 bg-[#3d9991] text-white rounded-lg hover:bg-[#2c7872] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2c3e50] mb-1">{request.title}</h2>
                  <p className="text-gray-500 text-sm mb-2">Created on {formatDate(request.createdAt)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency} Urgency
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium text-[#2c3e50] mb-3">Requested Items:</h3>
                <div className="space-y-2">
                  {request.items.map((item, index) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-black">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({item.category})</span>
                      </div>
                      <span className="text-gray-700">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {request.notes && (
                <div className="mt-4 bg-[#f5fcfb] p-3 rounded-lg">
                  <h3 className="font-medium text-[#2c3e50] mb-1">Notes:</h3>
                  <p className="text-gray-700 text-sm">{request.notes}</p>
                </div>
              )}
              
              {/* Actions based on status */}
              <div className="mt-6 flex justify-end space-x-3">
                {request.status === 'Active' && (
                  <button 
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={() => {
                      // Update status to cancelled in localStorage
                      const updatedRequests = requests.map(r => 
                        r.id === request.id ? { ...r, status: 'Cancelled' } : r
                      );
                      setRequests(updatedRequests);
                      localStorage.setItem('shelterRequests', JSON.stringify(updatedRequests));
                    }}
                  >
                    Cancel Request
                  </button>
                )}
                
                <button 
                  className="px-4 py-2 border border-[#3d9991] text-[#3d9991] rounded-lg hover:bg-[#f5fcfb] transition-colors"
                  onClick={() => {
                    // View request details (in a real app, this would navigate to a details page)
                    console.log('View details for request:', request.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 