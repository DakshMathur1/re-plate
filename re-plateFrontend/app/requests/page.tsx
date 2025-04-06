'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Function to get and update state in localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

export default function Requests() {
  const router = useRouter();
  const [activeRequest, setActiveRequest] = useState(1);
  const [hoveredRequest, setHoveredRequest] = useState<number | null>(null);
  const [completedRequestIds, setCompletedRequestIds] = useState<number[]>([]);
  
  // Mock data for requests
  const allRequests = [
    { id: 1, name: 'The Osborn', address: '27 W Hastings St, Vancouver, BC V6B 1G5', requirements: [
      { id: 1, item: 'Apples', quantity: '3 lbs', fulfilled: false },
      { id: 2, item: 'Oranges', quantity: '1 lb', fulfilled: false },
    ]},
    { id: 2, name: 'Yukon Shelter', address: '125 Main St, Vancouver, BC V6A 2S5', requirements: [
      { id: 1, item: 'Bread', quantity: '4 loaves', fulfilled: false },
      { id: 2, item: 'Milk', quantity: '2 gallons', fulfilled: false },
    ]},
    { id: 3, name: 'AI Mitchell', address: '356 E Hastings St, Vancouver, BC V6A 1P1', requirements: [
      { id: 1, item: 'Pasta', quantity: '5 boxes', fulfilled: false },
      { id: 2, item: 'Canned Soup', quantity: '10 cans', fulfilled: false },
    ]},
    { id: 4, name: 'New Fountain Shelter', address: '721 E Hastings St, Vancouver, BC V6A 1R3', requirements: [
      { id: 1, item: 'Rice', quantity: '10 lbs', fulfilled: false },
      { id: 2, item: 'Beans', quantity: '5 lbs', fulfilled: false },
    ]},
    { id: 5, name: 'Hope Center', address: '521 Powell St, Vancouver, BC V6A 1G8', requirements: [
      { id: 1, item: 'Vegetables', quantity: '8 lbs', fulfilled: false },
      { id: 2, item: 'Fruits', quantity: '6 lbs', fulfilled: false },
    ]},
  ];
  
  // Filter out completed requests
  const [requests, setRequests] = useState(allRequests);
  
  useEffect(() => {
    // Get completed requests from local storage
    const storedCompletedIds = getLocalStorage('completedRequests', []);
    setCompletedRequestIds(storedCompletedIds);
    
    // Filter out completed requests
    const filteredRequests = allRequests.filter(r => !storedCompletedIds.includes(r.id));
    setRequests(filteredRequests);
  }, []);
  
  const userInfo = {
    id: 'X2111956',
  };
  
  const handleRequestClick = (id: number) => {
    router.push(`/requests/${id}`);
  };
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with user ID */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Food Requests</h1>
        </div>
        <div className="flex items-center">
          <span className="text-[#2c3e50] mr-2">ID : {userInfo.id}</span>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Empty state if all requests are completed */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <svg 
            className="w-24 h-24 text-[#8ccfc9] mb-6" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">All requests fulfilled!</h2>
          <p className="text-[#5d6b79] mb-8 max-w-md">
            You've completed all the current donation requests. Check back later for new requests.
          </p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="px-6 py-3 bg-[#2c3e50] text-white rounded-full hover:bg-[#1a2632] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Requests fan layout */}
          <div className="relative h-[500px] flex justify-center items-center">
            {requests.map((request, index) => {
              // Calculate the rotation and position for the fan effect
              const isActive = activeRequest === request.id;
              const isHovered = hoveredRequest === request.id;
              
              // Replace the above with these lines:
              const angleStep = 4;         // Smaller angle for a subtle fan
              const translateStep = 20;    // Horizontal shift per card
              const rotation = index * angleStep;
              const translateX = index * translateStep;
              
              // Remove hoverLiftAmount and adjust z-index
              const zIndex = 100 + index;   // Ensures proper layering with higher z-index for top cards
              
              // The active or first card gets the teal color
              let bgColor = index === 0 ? 'bg-[#8ccfc9]' : 'bg-[#f5f5f5]';
              if (isHovered && index !== 0) {
                bgColor = 'bg-[#e8f5f3]';
              }
              
              return (
                <div
                  key={request.id}
                  className={`absolute w-full max-w-lg p-8 rounded-2xl shadow-lg ${bgColor} transition-all duration-300 cursor-pointer`}
                  style={{
                    transform: `translateX(${translateX}px) rotate(${rotation}deg) ${isHovered ? 'translateY(-10px)' : ''}`,
                    zIndex: hoveredRequest === request.id ? 999 : zIndex,
                    opacity: 1,
                    transformOrigin: 'bottom left',
                    border: isHovered ? '2px solid #8ccfc9' : 'none',
                  }}
                  onClick={() => handleRequestClick(request.id)}
                  onMouseEnter={() => setHoveredRequest(request.id)}
                  onMouseLeave={() => setHoveredRequest(null)}
                >
                  <div>
                    <h2 className="text-3xl font-bold text-[#2c3e50] mb-3">{request.name}</h2>
                    
                    <div className="flex items-center text-sm text-[#4a6276] mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{request.address}</span>
                    </div>
                    
                    {/* Requirements section */}
                    <div className="text-[#2c3e50]">
                      <h3 className="text-lg font-semibold mb-3">Requirements:</h3>
                      <ul className="space-y-3 pl-2">
                        {request.requirements.map((req) => (
                          <li key={req.id} className="flex items-center text-base">
                            <span className="mr-2 text-lg">•</span>
                            {req.item} - {req.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* View detail prompt on hover */}
                  {isHovered && (
                    <div className="absolute right-4 bottom-4 bg-[#2c3e50] text-white rounded-full px-4 py-2 shadow-md flex items-center animate-pulse">
                      <span className="mr-1 text-sm">View details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Helper text */}
          <p className="text-center text-[#5d6b79] mt-16 text-sm max-w-md mx-auto">
            Select a request card to view details and fulfill the requirements
          </p>
        </>
      )}
    </div>
  );
} 