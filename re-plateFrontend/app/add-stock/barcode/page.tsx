'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Mock inventory categories from the dashboard
const inventoryCategories = [
  'Baked Goods',
  'Produce',
  'Canned Goods',
  'Grains',
  'Dairy',
  'Dry Goods',
  'Meat',
  'Spreads'
];

// Mock function to simulate ML barcode scanning
const mockScanBarcode = async () => {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock data - in a real app, this would come from ML model
  const mockResults = [
    { name: 'Canned Beans', type: 'Canned Goods', condition: 'Good', tags: ['Vegan', 'Kosher'] },
    { name: 'Cereal Box', type: 'Dry Goods', condition: 'Good', tags: ['No Nuts', 'Kosher'] },
    { name: 'Milk Carton', type: 'Dairy', condition: 'Critical', tags: ['No Nuts'] }
  ];
  
  // Randomly return one of the mock items
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

export default function BarcodeScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Set up camera when component mounts
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setErrorMsg('Camera access denied or not available. Please check your permissions.');
        console.error('Error accessing camera:', err);
      }
    };

    setupCamera();

    // Clean up function to stop the camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start the scanning process
  const startScanning = async () => {
    setScanning(true);
    setErrorMsg('');
    
    try {
      // Simulate scanning process
      const result = await mockScanBarcode();
      setScannedItem(result);
      setScanSuccess(true);
      setScanning(false);
      
      // Draw a fake barcode overlay for visual feedback
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw scan area
          const width = videoRef.current.videoWidth || 300;
          const height = videoRef.current.videoHeight || 200;
          const scanAreaWidth = width * 0.7;
          const scanAreaHeight = scanAreaWidth * 0.25;
          
          ctx.strokeStyle = '#2ecc71';
          ctx.lineWidth = 4;
          ctx.strokeRect(
            (width - scanAreaWidth) / 2,
            (height - scanAreaHeight) / 2,
            scanAreaWidth,
            scanAreaHeight
          );
        }
      }
    } catch (err) {
      setErrorMsg('Failed to scan barcode. Please try again.');
      setScanning(false);
      console.error('Scanning error:', err);
    }
  };

  // Add the scanned item to inventory and return to dashboard
  const addToInventory = () => {
    // In a real app, this would make an API call to save the item
    
    // Show a brief success message
    const tempItem = { ...scannedItem };
    setScannedItem(null);
    setScanSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      // Redirect back to dashboard
      router.push('/dashboard');
    }, 1500);
  };

  // Retry scanning
  const handleRetry = () => {
    setScannedItem(null);
    setScanSuccess(false);
    setScanning(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3d9991]">Barcode Scanner</h1>
        <button 
          onClick={() => router.push('/add-stock')}
          className="flex items-center text-[#3d9991] hover:bg-[#e8f8f7] p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Camera View / Results */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-[#e0f2f0]">
        {!scannedItem ? (
          <div className="relative">
            {/* Camera view */}
            <div className="relative w-full h-[350px] mb-6 bg-black rounded-xl overflow-hidden">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="absolute object-cover w-full h-full" 
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full" 
                width={450}
                height={350}
              />
              
              {/* Scanning overlay */}
              {scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-64 h-16 border-2 border-[#2ecc71] relative">
                    <div className="absolute inset-0 bg-[#2ecc71] opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#2ecc71] animate-scan"></div>
                  </div>
                  <p className="text-white mt-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    Scanning...
                  </p>
                </div>
              )}
              
              {/* Error message */}
              {errorMsg && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white p-6 rounded-xl max-w-md">
                    <p className="text-red-500 mb-4">{errorMsg}</p>
                    <button
                      onClick={() => setErrorMsg('')}
                      className="bg-[#3d9991] text-white py-2 px-4 rounded-lg"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Instructions */}
            <div className="text-center mb-6">
              <p className="text-[#5a7775]">
                Position the barcode within the scan area and hold steady
              </p>
            </div>
            
            {/* Action button */}
            <div className="flex justify-center">
              <button
                onClick={startScanning}
                disabled={scanning}
                className={`py-3 px-8 rounded-xl text-white font-medium 
                  ${scanning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#3d9991] hover:bg-[#54b3aa]'
                  } transition-colors`}
              >
                {scanning ? 'Scanning...' : 'Scan Barcode'}
              </button>
            </div>
          </div>
        ) : (
          /* Results view */
          <div className="py-4">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-20 h-20">
                <Image
                  src="/check-circle.svg"
                  alt="Success"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-[#3d9991] mb-6">
              Item Identified
            </h2>
            
            <div className="bg-[#f0faf9] p-6 rounded-xl mb-8 border border-[#d5f0ed]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#5a7775]">Item Name</p>
                  <p className="font-medium text-[#3d9991]">{scannedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Category</p>
                  <p className="font-medium text-[#3d9991]">{scannedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Condition</p>
                  <p className="font-medium text-[#3d9991]">{scannedItem.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scannedItem.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-[#e0f2f0] text-[#3d9991] rounded-full text-xs border border-[#b0e8e3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetry}
                className="py-3 px-6 border border-[#3d9991] text-[#3d9991] rounded-xl hover:bg-[#f0faf9] transition-colors"
              >
                Scan Again
              </button>
              <button
                onClick={addToInventory}
                className="py-3 px-6 bg-[#3d9991] text-white rounded-xl hover:bg-[#54b3aa] transition-colors"
              >
                Add to Inventory
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 