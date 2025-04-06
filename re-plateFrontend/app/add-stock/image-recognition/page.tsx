'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Webcam from 'react-webcam';

// Helper to map API condition values to UI display values
const mapConditionToUI = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'safe for consumption': return 'Good';
    case 'needs immediate distribution': return 'Critical';
    case 'waste': return 'Waste';
    default: return condition;
  }
}

export default function ImageRecognition() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    condition: string;
    food_type: string;
    restrictions: string[];
    reason: string;
    item_name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  
  // Form fields for inventory item
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Add types for best before analysis
  const [showBestBeforeForm, setShowBestBeforeForm] = useState(false);
  const [bestBeforeDate, setBestBeforeDate] = useState('');
  const [isFoodOpened, setIsFoodOpened] = useState(false);
  const [storageMethod, setStorageMethod] = useState('refrigerated');
  const [bestBeforeResults, setBestBeforeResults] = useState<{
    is_safe: boolean;
    safe_until: string | null;
    explanation: string;
    recommendation: string;
  } | null>(null);
  const [isAnalyzingBestBefore, setIsAnalyzingBestBefore] = useState(false);

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setResults(null);
      setError(null);
    }
  }, [webcamRef]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setResults(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Reset image
  const resetImage = () => {
    setCapturedImage(null);
    setResults(null);
    setError(null);
    
    // Reset item details
    setItemName('');
    setQuantity(1);
    
    // Reset Best Before analysis
    setShowBestBeforeForm(false);
    setBestBeforeDate('');
    setIsFoodOpened(false);
    setStorageMethod('refrigerated');
    setBestBeforeResults(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Analyze the image using the backend API
  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image_data', capturedImage);
      
      // Call the backend API
      const response = await fetch('http://localhost:8000/classify-base64/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug the response
      setResults(data);
      
      // Set the item name with fallback options
      if (data.item_name) {
        // Primary: Use the item_name from the API if available
        setItemName(data.item_name);
        console.log('Using item_name from API:', data.item_name);
      } else if (data.food_type) {
        // Fallback 1: Extract from food_type if item_name is missing
        let suggestedName = '';
        
        if (data.food_type.includes('Fruits & Vegetables')) {
          // Check the reason for mentions of common fruits/vegetables
          const reason = data.reason.toLowerCase();
          const commonProduce = ['banana', 'apple', 'orange', 'tomato', 'potato', 'carrot'];
          
          for (const item of commonProduce) {
            if (reason.includes(item)) {
              suggestedName = item.charAt(0).toUpperCase() + item.slice(1);
              break;
            }
          }
          
          // If no specific item found in reason, use generic name
          if (!suggestedName) {
            suggestedName = 'Produce Item';
          }
        } else if (data.food_type.includes('Dairy')) {
          suggestedName = 'Dairy Product';
        } else if (data.food_type.includes('Meat')) {
          suggestedName = 'Meat Product';
        } else if (data.food_type.includes('Bakery')) {
          suggestedName = 'Baked Good';
        } else {
          // Use the food type as generic name
          suggestedName = data.food_type;
        }
        
        setItemName(suggestedName);
        console.log('Using extracted name from food_type:', suggestedName);
      }
      
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to save the item to inventory
  const addToInventory = async () => {
    if (!results || !itemName) return;
    
    setIsSaving(true);
    
    try {
      // Get existing inventory from localStorage or initialize empty array
      const existingInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      
      // Create new inventory item
      const newItem = {
        id: Date.now(), // Simple unique id
        name: itemName,
        food_type: results.food_type,
        condition: mapConditionToUI(results.condition),
        restriction_tags: results.restrictions.filter(r => r !== "None identified"),
        quantity: quantity,
        date_added: new Date().toISOString()
      };
      
      // Add new item to inventory
      const updatedInventory = [...existingInventory, newItem];
      
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      // Show success message
      alert('Item successfully added to inventory!');
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error saving to inventory:', err);
      setError('Failed to add item to inventory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Function to determine text color based on condition
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'safe for consumption':
        return 'text-green-600';
      case 'needs immediate distribution':
        return 'text-yellow-600';
      case 'waste':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };

  // Function to analyze best before date
  const analyzeBestBefore = async () => {
    if (!results || !bestBeforeDate) return;
    
    setIsAnalyzingBestBefore(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('food_type', results.food_type);
      formData.append('item_name', results.item_name || itemName);
      formData.append('best_before_date', bestBeforeDate);
      formData.append('is_opened', isFoodOpened ? 'true' : 'false');
      formData.append('storage_method', storageMethod);
      
      // Use the new combined-analysis endpoint that incorporates both image and best-before date
      const response = await fetch('http://localhost:8000/combined-analysis/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Combined Analysis Response:', data);
      
      // Update both the main results and best before results
      setResults({
        ...results,
        condition: data.condition  // Update condition based on safety analysis
      });
      
      setBestBeforeResults({
        is_safe: data.is_safe,
        safe_until: data.safe_until,
        explanation: data.safety_explanation,
        recommendation: data.recommendation
      });
      
    } catch (err) {
      console.error('Error analyzing best before date:', err);
      setError('Failed to analyze best before date. Please try again.');
    } finally {
      setIsAnalyzingBestBefore(false);
    }
  };

  // Function to get color based on safety
  const getSafetyColor = (isSafe: boolean) => {
    return isSafe ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3d9991]">Image Recognition</h1>
        <button 
          onClick={() => router.push('/add-stock')}
          className="flex items-center text-[#3d9991] hover:bg-[#e8f8f7] p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-[#f0faf9] p-6 rounded-xl shadow-sm mb-8 border border-[#d5f0ed]">
        <h2 className="text-xl font-medium text-[#3d9991] mb-3">Food Image Recognition</h2>
        <p className="text-[#5a7775]">
          Take a photo of a food item or upload an image to analyze its condition and type.
          Our AI will determine if the item is safe for consumption, needs immediate distribution, or should be discarded.
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-[#e0f2f0]">
        {/* Tabs */}
        {!capturedImage && (
          <div className="flex border-b border-[#e0f2f0] mb-6">
            <button
              onClick={() => setActiveTab('camera')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'camera' 
                  ? 'text-[#3d9991] border-b-2 border-[#3d9991]' 
                  : 'text-gray-500 hover:text-[#3d9991]'
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'upload' 
                  ? 'text-[#3d9991] border-b-2 border-[#3d9991]' 
                  : 'text-gray-500 hover:text-[#3d9991]'
              }`}
            >
              Upload Image
            </button>
          </div>
        )}

        {/* Camera or File Upload */}
        {!capturedImage && (
          <div className="mb-6">
            {activeTab === 'camera' ? (
              <div className="flex flex-col items-center">
                <div className="rounded-xl overflow-hidden border-2 border-[#e0f2f0] mb-4">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full max-w-lg"
                  />
                </div>
                <button
                  onClick={captureImage}
                  className="bg-[#3d9991] text-white py-3 px-6 rounded-xl hover:bg-[#54b3aa] transition-colors"
                >
                  Take Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  onClick={triggerFileInput}
                  className="w-full max-w-lg h-64 border-2 border-dashed border-[#d5f0ed] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#f0faf9] transition-colors mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-[#3d9991] mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-[#5a7775]">Click to upload an image</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className="bg-[#3d9991] text-white py-3 px-6 rounded-xl hover:bg-[#54b3aa] transition-colors"
                >
                  Select Image
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview & Results */}
        {capturedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden border-2 border-[#e0f2f0] mb-4">
                <Image
                  src={capturedImage}
                  alt="Captured food"
                  width={500}
                  height={400}
                  className="w-full object-contain"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetImage}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                {!results && !isAnalyzing && (
                  <button
                    onClick={analyzeImage}
                    className="bg-[#3d9991] text-white py-2 px-4 rounded-xl hover:bg-[#54b3aa] transition-colors"
                  >
                    Analyze
                  </button>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-[#f8fcfc] p-6 rounded-xl border border-[#e0f2f0]">
              <h3 className="text-xl font-medium text-[#3d9991] mb-4">Analysis Results</h3>
              
              {isAnalyzing && (
                <div className="flex flex-col items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d9991] mb-4"></div>
                  <p className="text-[#5a7775]">Analyzing image...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                  {error}
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-500 font-medium">Condition:</h4>
                    <p className={`text-lg font-semibold ${getConditionColor(results.condition)}`}>
                      {results.condition.charAt(0).toUpperCase() + results.condition.slice(1)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-500 font-medium">Food Type:</h4>
                    <p className="text-lg font-semibold text-gray-800">{results.food_type}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-500 font-medium">Dietary Restrictions:</h4>
                    {results.restrictions.length > 0 && results.restrictions[0] !== "None identified" ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {results.restrictions.map((restriction, index) => (
                          <span 
                            key={index}
                            className="bg-[#e8f8f7] text-[#3d9991] px-3 py-1 rounded-full text-sm"
                          >
                            {restriction}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">None identified</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-gray-500 font-medium">Reason:</h4>
                    <p className="text-gray-700">{results.reason}</p>
                  </div>

                  {/* Best Before Analysis */}
                  <div className="pt-4 mt-4 border-t border-[#e0f2f0]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-gray-500 font-medium">Best Before Analysis:</h4>
                      <button
                        onClick={() => setShowBestBeforeForm(!showBestBeforeForm)}
                        className="text-[#3d9991] hover:text-[#54b3aa] text-sm"
                      >
                        {showBestBeforeForm ? 'Hide' : 'Analyze best before date'}
                      </button>
                    </div>
                    
                    {showBestBeforeForm && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
                        <div>
                          <label htmlFor="bestBeforeDate" className="block text-sm text-gray-500 mb-1">
                            Best Before Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="bestBeforeDate"
                            type="date"
                            value={bestBeforeDate}
                            onChange={(e) => setBestBeforeDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center space-x-2 text-sm text-gray-500">
                            <input
                              type="checkbox"
                              checked={isFoodOpened}
                              onChange={(e) => setIsFoodOpened(e.target.checked)}
                              className="h-4 w-4 text-[#3d9991] focus:ring-[#3d9991]"
                            />
                            <span>Package has been opened</span>
                          </label>
                        </div>
                        
                        <div>
                          <label htmlFor="storageMethod" className="block text-sm text-gray-500 mb-1">
                            Storage Method
                          </label>
                          <select
                            id="storageMethod"
                            value={storageMethod}
                            onChange={(e) => setStorageMethod(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                          >
                            <option value="refrigerated">Refrigerated</option>
                            <option value="frozen">Frozen</option>
                            <option value="room temperature">Room Temperature</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={analyzeBestBefore}
                          disabled={!bestBeforeDate || isAnalyzingBestBefore}
                          className="w-full bg-[#3d9991] text-white py-2 px-4 rounded-lg hover:bg-[#54b3aa] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isAnalyzingBestBefore ? 'Analyzing...' : 'Analyze Safety'}
                        </button>
                      </div>
                    )}
                    
                    {bestBeforeResults && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Safety Status:</span>
                          <p className={`text-lg font-semibold ${getSafetyColor(bestBeforeResults.is_safe)}`}>
                            {bestBeforeResults.is_safe ? 'Safe to Consume' : 'Not Safe to Consume'}
                          </p>
                        </div>
                        
                        {bestBeforeResults.safe_until && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-500">Safe Until:</span>
                            <p className="text-gray-700">{bestBeforeResults.safe_until}</p>
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Explanation:</span>
                          <p className="text-gray-700">{bestBeforeResults.explanation}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Recommendation:</span>
                          <p className="text-gray-700 font-medium">{bestBeforeResults.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item Details Form */}
                  <div className="pt-4 border-t border-[#e0f2f0] space-y-4">
                    <h4 className="text-gray-500 font-medium">Item Details:</h4>
                    
                    <div>
                      <label htmlFor="itemName" className="block text-sm text-gray-500 mb-1">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="itemName"
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Enter item name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d9991]"
                      />
                    </div>
                    
                    <button
                      className="w-full bg-[#3d9991] text-white py-3 px-6 rounded-xl hover:bg-[#54b3aa] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={addToInventory}
                      disabled={!itemName || isSaving}
                    >
                      {isSaving ? "Adding..." : "Add to Inventory"}
                    </button>
                  </div>
                </div>
              )}

              {!results && !isAnalyzing && !error && (
                <div className="flex flex-col items-center py-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-[#d5f0ed] mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[#5a7775]">
                    Click the &quot;Analyze&quot; button to classify the food item
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 