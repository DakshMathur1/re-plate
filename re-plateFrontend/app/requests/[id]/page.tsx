'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Function to get and update state in localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export default function RequestDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const requestId = parseInt(params.id);
  const [request, setRequest] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [allFulfilled, setAllFulfilled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  
  // Mock data for the request
  const mockRequests = [
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
  
  const userInfo = {
    id: 'X2111956',
  };
  
  // Main effect to initialize
  useEffect(() => {
    // Check if this request is already completed
    const completedRequests = getLocalStorage('completedRequests', []);
    if (completedRequests.includes(requestId)) {
      router.push('/requests');
      return;
    }
    
    // Find the request by ID
    const foundRequest = mockRequests.find(r => r.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
      setRequirements([...foundRequest.requirements]);
    } else {
      // Redirect to requests page if not found
      router.push('/requests');
    }
  }, [requestId, router]);
  
  // Check if all requirements are fulfilled
  useEffect(() => {
    if (requirements.length > 0) {
      const fulfilled = requirements.every(req => req.fulfilled);
      setAllFulfilled(fulfilled);
    }
  }, [requirements]);
  
  // Effect for confetti
  useEffect(() => {
    if (showConfetti) {
      // Load canvas-confetti dynamically as it's a client component
      import('canvas-confetti').then((confetti) => {
        const launch = () => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8ccfc9', '#2c3e50', '#f5f1e6', '#e74c3c', '#3498db', '#f1c40f']
          });
        };
        
        // Initial burst
        launch();
        
        // Multiple bursts for a more dynamic effect
        setTimeout(launch, 250);
        setTimeout(launch, 500);
        setTimeout(launch, 750);
        setTimeout(launch, 1000);
        
        // School pride confetti - left and right sides
        setTimeout(() => {
          confetti.default({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#8ccfc9', '#2c3e50', '#f5f1e6']
          });
        }, 200);
        
        setTimeout(() => {
          confetti.default({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8ccfc9', '#2c3e50', '#f5f1e6']
          });
        }, 400);
      });
    }
  }, [showConfetti]);
  
  const handleToggleRequirement = (id: number) => {
    const updatedRequirements = requirements.map(req => {
      if (req.id === id) {
        return { ...req, fulfilled: !req.fulfilled };
      }
      return req;
    });
    setRequirements(updatedRequirements);
  };
  
  const handleAcceptRequest = () => {
    if (allFulfilled) {
      setShowConfetti(true);
      
      // Update completed requests and increment accepted requests count
      const completedRequests = getLocalStorage('completedRequests', []);
      const acceptedRequestCount = getLocalStorage('acceptedRequests', 0);
      
      // Only add to completed if not already there
      if (!completedRequests.includes(requestId)) {
        const updatedCompletedRequests = [...completedRequests, requestId];
        setLocalStorage('completedRequests', updatedCompletedRequests);
        
        // Increment the accepted requests count
        const newAcceptedCount = acceptedRequestCount + 1;
        setLocalStorage('acceptedRequests', newAcceptedCount);
        
        // Show success message with the updated count
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-10 right-10 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-bounce';
        successMessage.innerHTML = `
          <div class="flex items-center">
            <div class="mr-3">
              <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-bold">Delivery Added!</p>
              <p>Upcoming deliveries: ${3 + newAcceptedCount}</p>
            </div>
          </div>
        `;
        document.body.appendChild(successMessage);
        
        // Remove the message after confetti is done
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      }
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }
  };
  
  if (!request) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>Loading request details...</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Hidden canvas for confetti */}
      <canvas 
        ref={confettiRef} 
        className="fixed inset-0 pointer-events-none z-50" 
        style={{width: '100vw', height: '100vh'}}
      />
      
      <div className="p-8 max-w-3xl mx-auto">
        {/* Header with user ID */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/requests')}
            className="flex items-center text-[#2c3e50] hover:text-[#1a2632] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Requests
          </button>
          <div className="flex items-center">
            <span className="text-[#2c3e50] mr-2">ID : {userInfo.id}</span>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Request Card */}
        <div className="bg-[#8ccfc9] rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">{request.name}</h2>
            {allFulfilled && (
              <button 
                onClick={handleAcceptRequest}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex items-center mb-6 text-[#2c3e50]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{request.address}</span>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Requirements</h3>
            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req.id} className="flex items-center">
                  <div 
                    className={`w-6 h-6 border-2 mr-3 rounded flex items-center justify-center cursor-pointer ${
                      req.fulfilled ? 'bg-[#2c3e50] border-[#2c3e50]' : 'border-[#2c3e50]'
                    }`}
                    onClick={() => handleToggleRequirement(req.id)}
                  >
                    {req.fulfilled && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`${req.fulfilled ? 'line-through text-gray-500' : 'text-[#2c3e50]'}`}>
                    {req.item} - {req.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {allFulfilled && (
          <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg">
            <p className="font-medium">All requirements fulfilled! Click the checkmark to accept the request.</p>
          </div>
        )}
      </div>
    </>
  );
} 