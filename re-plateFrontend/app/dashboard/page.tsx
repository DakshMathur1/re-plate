'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define types for inventory items
type InventoryItem = {
  id: number;
  name: string;
  type: string;
  condition: string;
  tags: string[];
};

export default function Dashboard() {
  const router = useRouter();
  const [upcomingDeliveries, setUpcomingDeliveries] = useState(2);
  const [highlightDeliveries, setHighlightDeliveries] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Bread', type: 'Baked Goods', condition: 'Critical', tags: ['No Nuts'] },
    { id: 2, name: 'Apples', type: 'Produce', condition: 'Good', tags: ['No Nuts', 'Gluten Free'] },
    { id: 3, name: 'Canned Soup', type: 'Canned Goods', condition: 'Good', tags: ['No Nuts', 'Vegan'] },
    { id: 4, name: 'Rice', type: 'Grains', condition: 'Good', tags: ['Gluten Free', 'Vegan'] },
    { id: 5, name: 'Milk', type: 'Dairy', condition: 'Critical', tags: ['No Nuts'] },
    { id: 6, name: 'Pasta', type: 'Dry Goods', condition: 'Good', tags: ['Vegetarian'] },
    { id: 7, name: 'Bananas', type: 'Produce', condition: 'Waste', tags: ['Gluten Free', 'Vegan'] },
    { id: 8, name: 'Yogurt', type: 'Dairy', condition: 'Critical', tags: ['Vegetarian', 'Probiotic'] },
    { id: 9, name: 'Canned Beans', type: 'Canned Goods', condition: 'Good', tags: ['Vegan', 'Kosher'] },
    { id: 10, name: 'Cereal', type: 'Dry Goods', condition: 'Good', tags: ['No Nuts', 'Kosher'] },
    { id: 11, name: 'Potatoes', type: 'Produce', condition: 'Good', tags: ['Gluten Free', 'Vegan'] },
    { id: 12, name: 'Chicken', type: 'Meat', condition: 'Critical', tags: ['Kosher'] },
    { id: 13, name: 'Tomatoes', type: 'Produce', condition: 'Waste', tags: ['Gluten Free', 'Vegetarian'] },
    { id: 14, name: 'Peanut Butter', type: 'Spreads', condition: 'Good', tags: ['Vegan'] },
  ]);
  
  const shelters = [
    { id: 1, name: 'Yukon Shelter', active: true },
    { id: 2, name: 'AI Mitchell', active: false },
    { id: 3, name: 'New Fountain Shelter', active: false },
    { id: 4, name: 'The Osborn', active: false },
  ];
  
  const userInfo = {
    id: 'X2111956',
    name: 'John',
  };
  
  useEffect(() => {
    // Check if there's a newly accepted request and update the upcoming deliveries count
    let acceptedRequestCount = 0;
    try {
      const savedRequests = localStorage.getItem('acceptedRequests');
      acceptedRequestCount = savedRequests ? JSON.parse(savedRequests) : 0;
    } catch (e) {
      console.error('Error reading acceptedRequests from localStorage:', e);
    }
    
    const newValue = 2 + acceptedRequestCount;
    
    if (newValue !== upcomingDeliveries) {
      setUpcomingDeliveries(newValue);
      
      // Highlight the counter if it's not the initial render and value changed
      if (upcomingDeliveries !== 2) {
        setHighlightDeliveries(true);
        setTimeout(() => setHighlightDeliveries(false), 3000);
      }
    }
    
    // Load inventory items from localStorage if available
    try {
      const storedInventory = localStorage.getItem('inventory');
      if (storedInventory) {
        const parsedInventory = JSON.parse(storedInventory);
        
        // Combine default items with stored items (for demo purposes)
        // In a real app, you might want to only use the stored items
        // or fetch them from an API
        if (Array.isArray(parsedInventory) && parsedInventory.length > 0) {
          // Map the stored items to match the expected format if needed
          const formattedItems = parsedInventory.map(item => ({
            id: item.id,
            name: item.name,
            type: item.food_type,
            condition: item.condition,
            tags: Array.isArray(item.restriction_tags) ? item.restriction_tags : []
          }));
          
          // Add new items to the top of the list
          setInventoryItems([...formattedItems, ...inventoryItems]);
        }
      }
    } catch (error) {
      console.error('Error loading inventory from localStorage:', error);
    }
  }, []);
  
  const handleAddStock = () => {
    // Navigate to the add-stock page
    router.push('/add-stock');
  };
  
  const handleNeedMap = () => {
    // Implement NeedMap functionality
    alert('NeedMap functionality coming soon!');
  };
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with user ID */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center">
          <span className="text-[#2c3e50] mr-2">ID : {userInfo.id}</span>
          <div className="h-10 w-10 bg-gray-200 rounded-full"><Image 
            src="/john.png" 
            alt="Volunteer John" 
            width={80} 
            height={80} 
            className="mb-4 mx-auto"
          /></div>
        </div>
      </div>
      
      {/* Welcome section */}
      <div className="bg-white p-8 rounded-2xl shadow-md mb-8 flex items-center">
        <div className="w-48 h-48 flex mr-10 justify-center">
          {/* Use the Image component with the volunteer.png file */}
          <Image 
            src="/volunteer.png" 
            alt="Volunteer"
            width={180}
            height={180}
            priority
            className="rounded-full border-4 border-gray-100"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-[#2c3e50] text-lg mb-2">Welcome</h2>
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-2">{userInfo.name}</h1>
          <p className="text-[#5d6b79]">thank you for helping out <span className="text-red-500">♥</span></p>
        </div>
      </div>
      
      {/* Actions section */}
      <div className="flex gap-8 mb-8">
        {/* Upcoming deliveries */}
        <div className="bg-[#2c3e50] text-white p-6 rounded-2xl shadow-md flex items-center relative overflow-hidden">
          <div 
            className={`absolute top-3 right-3 ${
              highlightDeliveries ? 'bg-green-500 animate-pulse scale-125' : 'bg-[#1a2632]'
            } p-1 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300`}
          >
            <span className="text-lg font-bold">{upcomingDeliveries}</span>
          </div>
          <div className="pr-8">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <h3 className="font-medium">Upcoming</h3>
            </div>
            <p className="text-sm">Deliveries</p>
          </div>
        </div>
        
        {/* Add Stock button */}
        <button 
          onClick={handleAddStock}
          className="bg-white p-6 rounded-2xl shadow-md flex items-center flex-1 hover:bg-gray-50 transition-colors group"
        >
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#2c3e50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="font-medium text-[#2c3e50]">Add Stock</h3>
            </div>
          </div>
          <div className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2c3e50] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
        
        {/* NeedMap button */}
        <button 
          onClick={handleNeedMap}
          className="bg-white p-6 rounded-2xl shadow-md flex items-center flex-1 hover:bg-gray-50 transition-colors group"
        >
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#2c3e50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="font-medium text-[#2c3e50]">NeedMap</h3>
            </div>
          </div>
          <div className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2c3e50] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-4 gap-8">
        {/* Inventory table */}
        <div className="col-span-3">
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Inventory</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Name</th>
                  <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Food Type</th>
                  <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Condition</th>
                  <th className="py-3 px-4 text-left text-[#2c3e50] font-semibold">Restriction Tags</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item, index) => (
                  <tr key={item.id} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                    <td className="py-4 px-4 font-medium text-[#2c3e50]">{item.name}</td>
                    <td className="py-4 px-4 text-[#4a6276]">{item.type}</td>
                    <td className="py-4 px-4">
                      {item.condition && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.condition === 'Critical' 
                            ? 'bg-red-100 text-red-800' 
                            : item.condition === 'Good'
                              ? 'bg-green-100 text-green-800'
                              : item.condition === 'Waste'
                                ? 'bg-gray-200 text-gray-700'
                                : ''
                        }`}>
                          {item.condition}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Network section */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Our Network</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <ul className="space-y-4">
              {shelters.map((shelter) => (
                <li key={shelter.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-green-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-[#2c3e50] font-medium">{shelter.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 mb-8">
        <a href="/dashboard" className="flex items-center px-4 py-2 bg-[#e8f8f7] text-[#3d9991] rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </a>
        <a href="/add-stock" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add Stock
        </a>
        <a href="/analytics" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </a>
      </nav>
    </div>
  );
} 