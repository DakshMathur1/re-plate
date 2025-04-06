'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

// Food categories
const foodCategories = [
  'Produce',
  'Dairy',
  'Meat',
  'Baked Goods',
  'Canned Goods',
  'Dry Goods',
  'Beverages',
  'Frozen Foods',
  'Prepared Foods',
  'Other'
];

// Quantity units
const units = [
  'lbs',
  'kg',
  'oz',
  'g',
  'boxes',
  'cans',
  'packages',
  'loaves',
  'gallons',
  'liters',
  'pieces',
  'servings',
  'cases'
];

export default function CreateRequest() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<RequestItem[]>([
    { name: '', category: 'Produce', quantity: '', unit: 'lbs' }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', category: 'Produce', quantity: '', unit: 'lbs' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof RequestItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    let hasItemErrors = false;
    items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item-${index}-name`] = 'Item name is required';
        hasItemErrors = true;
      }
      
      if (!item.quantity.trim()) {
        newErrors[`item-${index}-quantity`] = 'Quantity is required';
        hasItemErrors = true;
      } else if (isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be a positive number';
        hasItemErrors = true;
      }
    });
    
    if (hasItemErrors) {
      newErrors.items = 'Please fix errors in your requested items';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Create new request object
    const newRequest: Request = {
      id: Date.now(),
      title,
      urgency,
      status: 'Active',
      items,
      notes,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('shelterRequests') || '[]');
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem('shelterRequests', JSON.stringify(updatedRequests));
    
    // Show confirmation dialog
    setSubmitting(false);
    setShowConfirmation(true);
  };

  const goToDashboard = () => {
    router.push('/shelter/dashboard');
  };

  const goToCreateAnother = () => {
    // Reset form
    setTitle('');
    setUrgency('Medium');
    setNotes('');
    setItems([{ name: '', category: 'Produce', quantity: '', unit: 'lbs' }]);
    setErrors({});
    setShowConfirmation(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <button
          onClick={goToDashboard}
          className="flex items-center text-[#3d9991] hover:text-[#2c7872] mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-[#2c3e50]">Create New Request</h1>
      </div>
      
      {showConfirmation ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">Request Submitted Successfully!</h2>
          <p className="text-[#5d6b79] mb-8">Your request has been submitted and is now active. You can view it on your dashboard.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={goToDashboard}
              className="px-6 py-3 bg-[#3d9991] text-white rounded-lg hover:bg-[#2c7872] transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={goToCreateAnother}
              className="px-6 py-3 bg-white border border-[#3d9991] text-[#3d9991] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8">
          {/* Request basic information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-[#2c3e50] font-medium mb-2">
                  Request Title*
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 border rounded-lg text-black ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Weekly Produce Delivery"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="urgency" className="block text-[#2c3e50] font-medium mb-2">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black"
                >
                  <option value="Low">Low - Within 2 weeks</option>
                  <option value="Medium">Medium - Within 1 week</option>
                  <option value="High">High - Within 2 days</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Requested items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#2c3e50]">Requested Items*</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-[#e0f2f0] text-[#3d9991] rounded-lg hover:bg-[#c5e8e5] transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </button>
            </div>
            
            {errors.items && <p className="text-red-500 text-sm mb-2">{errors.items}</p>}
            
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-[#2c3e50]">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor={`item-${index}-name`} className="block text-sm text-[#2c3e50] mb-1">
                      Item Name*
                    </label>
                    <input
                      type="text"
                      id={`item-${index}-name`}
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className={`w-full p-2 border rounded-lg text-black ${errors[`item-${index}-name`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Apples"
                    />
                    {errors[`item-${index}-name`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-name`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`item-${index}-category`} className="block text-sm text-[#2c3e50] mb-1">
                      Category
                    </label>
                    <select
                      id={`item-${index}-category`}
                      value={item.category}
                      onChange={(e) => updateItem(index, 'category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    >
                      {foodCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`item-${index}-quantity`} className="block text-sm text-[#2c3e50] mb-1">
                      Quantity*
                    </label>
                    <input
                      type="text"
                      id={`item-${index}-quantity`}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className={`w-full p-2 border rounded-lg text-black ${errors[`item-${index}-quantity`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 10"
                    />
                    {errors[`item-${index}-quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-quantity`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`item-${index}-unit`} className="block text-sm text-[#2c3e50] mb-1">
                      Unit
                    </label>
                    <select
                      id={`item-${index}-unit`}
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Notes */}
          <div className="mb-8">
            <label htmlFor="notes" className="block text-[#2c3e50] font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
              placeholder="Enter any specific requirements or additional information..."
            ></textarea>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={goToDashboard}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#3d9991] text-white rounded-lg hover:bg-[#2c7872] transition-colors flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 