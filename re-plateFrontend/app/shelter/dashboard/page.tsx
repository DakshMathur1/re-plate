'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Helper function to get data from localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

// Helper function to set data in localStorage
const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

type RequestItem = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
};

type Request = {
  id: number;
  title: string;
  urgency: string;
  status: string;
  items: RequestItem[];
  notes: string;
  createdAt: string;
  updatedAt?: string;
};

type RequestFilter = 'All' | 'Active' | 'Accepted' | 'Completed';

// Sample requests for the dashboard
const sampleRequests: Request[] = [
  {
    id: 1,
    title: 'Emergency Food Supplies',
    urgency: 'High',
    status: 'Active',
    items: [
      {
        name: 'Tomatoes',
        category: 'Produce',
        quantity: '20',
        unit: 'lbs'
      }
    ],
    notes: 'We need fresh tomatoes for our soup kitchen that serves 100 people daily',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    title: 'Weekly Bread Pickup',
    urgency: 'Medium',
    status: 'Completed',
    items: [
      {
        name: 'Bread',
        category: 'Baked Goods',
        quantity: '30',
        unit: 'loaves'
      },
      {
        name: 'Rolls',
        category: 'Baked Goods',
        quantity: '40',
        unit: 'pieces'
      }
    ],
    notes: 'Regular weekly pickup for our breakfast program',
    createdAt: new Date(Date.now() - 8 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
  {
    id: 3,
    title: 'Dairy Products',
    urgency: 'Low',
    status: 'Completed',
    items: [
      {
        name: 'Milk',
        category: 'Dairy',
        quantity: '15',
        unit: 'gallons'
      },
      {
        name: 'Yogurt',
        category: 'Dairy',
        quantity: '50',
        unit: 'cups'
      }
    ],
    notes: 'Monthly dairy products for our senior nutrition program',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 29 * 24 * 3600000).toISOString(),
  }
];

export default function ShelterDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [shelterName, setShelterName] = useState('The Osborn');
  const [employeeInfo, setEmployeeInfo] = useState({ name: 'Mark Johnson', role: 'Distribution Manager' });
  const [isLoading, setIsLoading] = useState(true);
  const [requestedDeliveries, setRequestedDeliveries] = useState(1);
  const [highlightDeliveries, setHighlightDeliveries] = useState(false);
  const [activeFilter, setActiveFilter] = useState<RequestFilter>('Active');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  
  // Mock data for donors network
  const donors = [
    { id: 1, name: 'Food Stash Organization', active: true },
    { id: 2, name: 'Local Grocery Co-op', active: true },
    { id: 3, name: 'Community Kitchen', active: true },
    { id: 4, name: 'Harvest Share Program', active: true },
  ];

  useEffect(() => {
    // Check if user is logged in as shelter
    const userType = localStorage.getItem('userType');
    if (userType !== 'shelter') {
      router.push('/login-options');
      return;
    }

    // Get shelter name if it exists
    const storedShelterName = localStorage.getItem('shelterName');
    if (storedShelterName) {
      setShelterName(storedShelterName);
    }

    // Get employee information if it exists
    const storedEmployeeInfo = localStorage.getItem('shelterEmployee');
    if (storedEmployeeInfo) {
      setEmployeeInfo(JSON.parse(storedEmployeeInfo));
    }

    // Fetch requests from localStorage or use sample data if none exists
    const storedRequests = getLocalStorage('shelterRequests', []);
    if (storedRequests.length === 0) {
      // Initialize with sample requests if no requests exist
      setLocalStorage('shelterRequests', sampleRequests);
      setRequests(sampleRequests);
    } else {
      setRequests(storedRequests);
    }
    
    // Set requested deliveries count (active requests)
    const activeReqCount = storedRequests.length > 0 
      ? storedRequests.filter((req: Request) => req.status === 'Active').length
      : sampleRequests.filter(req => req.status === 'Active').length;
    setRequestedDeliveries(activeReqCount);
    
    setIsLoading(false);
  }, [router]);

  // Calculate dashboard statistics
  const totalRequests = requests.length;
  const activeRequests = requests.filter(req => req.status === 'Active').length;

  const handleCreateRequest = () => {
    router.push('/shelter/create-request');
  };

  const handleViewRequestDetails = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const closeRequestDetails = () => {
    setShowRequestDetails(false);
    setSelectedRequest(null);
  };

  // Filter requests based on selected filter
  const filteredRequests = requests.filter(request => {
    if (activeFilter === 'All') return true;
    return request.status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d9991]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with user ID */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center">
          <span className="text-[#2c3e50] mr-2">ID: OSB27111</span>
          <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src="/shelter-avatar.svg"
              alt="Shelter Profile"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
      
      {/* Welcome section */}
      <div className="bg-white p-8 rounded-2xl shadow-md mb-8 flex items-center">
        <div className="w-48 h-48 flex mr-10 justify-center">
          <Image 
            src="/shelter-worker.png" 
            alt="Shelter Worker"
            width={180}
            height={180}
            priority
            className="rounded-full border-4 border-gray-100"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-[#2c3e50] text-lg mb-2">Welcome</h2>
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-2">{employeeInfo.name}</h1>
          <p className="text-black">thank you for helping out <span className="text-red-500">♥</span></p>
        </div>
      </div>
      
      {/* Actions section */}
      <div className="flex gap-8 mb-8">
        {/* Requested deliveries */}
        <div className="bg-[#2c3e50] text-white p-6 rounded-2xl shadow-md flex items-center relative overflow-hidden">
          <div 
            className={`absolute top-3 right-3 ${
              highlightDeliveries ? 'bg-green-500 animate-pulse scale-125' : 'bg-[#1a2632]'
            } p-1 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300`}
          >
            <span className="text-lg font-bold">{requestedDeliveries}</span>
          </div>
          <div className="pr-8">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <h3 className="font-medium">Requested</h3>
            </div>
            <p className="text-sm">Deliveries</p>
          </div>
        </div>
        
        {/* Create Request button */}
        <button 
          onClick={handleCreateRequest}
          className="bg-white p-6 rounded-2xl shadow-md flex items-center flex-1 hover:bg-gray-50 transition-colors group"
        >
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="font-medium text-[#3d9991]">Request Stock</h3>
            </div>
          </div>
          <div className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3d9991] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-4 gap-8">
        {/* Requests table */}
        <div className="col-span-3">
          {/* Filter tabs */}
          <div className="flex space-x-4 mb-8">
            {(['All', 'Active', 'Accepted', 'Completed'] as RequestFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-3 rounded-2xl text-lg transition-colors ${
                  activeFilter === filter 
                    ? 'bg-white text-[#2c3e50] font-medium shadow-md' 
                    : 'bg-gray-100 text-black'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Main content with filtered requests */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">No requests found</h2>
                <p className="text-black mb-8">You don't have any {activeFilter.toLowerCase()} requests.</p>
                <button
                  onClick={handleCreateRequest}
                  className="flex items-center px-6 py-3 bg-[#3d9991] text-white rounded-lg hover:bg-[#2c7872] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Request
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Request Title</th>
                    <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Urgency</th>
                    <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Created On</th>
                    <th className="py-3 px-4 text-center text-[#2c3e50] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-[#2c3e50]">{request.title}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.urgency === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : request.urgency === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Active' 
                            ? 'bg-blue-100 text-blue-800' 
                            : request.status === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-black">{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => handleViewRequestDetails(request)}
                          className="text-[#3d9991] hover:text-[#2c7872] font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Donors network section */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Donor Network</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <ul className="space-y-4">
              {donors.map((donor) => (
                <li key={donor.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-green-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-[#2c3e50] font-medium">{donor.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Request details modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Request Details</h2>
              <button 
                onClick={closeRequestDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#2c3e50] mb-2">Request Information</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-700">Title</p>
                    <p className="font-medium text-[#2c3e50]">{selectedRequest.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block mt-1 ${
                      selectedRequest.status === 'Active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : selectedRequest.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Urgency</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block mt-1 ${
                      selectedRequest.urgency === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : selectedRequest.urgency === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Created On</p>
                    <p className="font-medium text-[#2c3e50]">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Notes</p>
                  <p className="text-black mt-1">{selectedRequest.notes}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#2c3e50] mb-2">Requested Items</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left text-[#2c3e50] font-medium">Item</th>
                      <th className="py-2 px-4 text-left text-[#2c3e50] font-medium">Category</th>
                      <th className="py-2 px-4 text-right text-[#2c3e50] font-medium">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-medium text-[#2c3e50]">{item.name}</td>
                        <td className="py-3 px-4 text-black">{item.category}</td>
                        <td className="py-3 px-4 text-right text-[#2c3e50]">{item.quantity} {item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeRequestDetails}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-4"
              >
                Close
              </button>
              
              {selectedRequest.status === 'Active' && (
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 