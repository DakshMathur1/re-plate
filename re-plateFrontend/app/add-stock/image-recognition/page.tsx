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

// Mock function to simulate ML image recognition
const mockImageRecognition = async (imageData: string) => {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Mock data - in a real app, this would come from ML model
  const mockResults = [
    { name: 'Apples', type: 'Produce', condition: 'Good', tags: ['No Nuts', 'Gluten Free'] },
    { name: 'Bananas', type: 'Produce', condition: 'Critical', tags: ['Gluten Free', 'Vegan'] },
    { name: 'Potatoes', type: 'Produce', condition: 'Good', tags: ['Gluten Free', 'Vegan'] }
  ];
  
  // Randomly return one of the mock items
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

export default function ImageRecognition() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recognizedItem, setRecognizedItem] = useState<any>(null);
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

  // Take photo from camera
  const takePhoto = () => {
    if (!videoRef.current || !photoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const photo = photoRef.current;
    const canvas = canvasRef.current;
    
    // Match photo dimensions to video feed
    const width = video.videoWidth;
    const height = video.videoHeight;
    photo.width = width;
    photo.height = height;
    
    // Draw guidelines on canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw scan area (centered square)
      const size = Math.min(width, height) * 0.7;
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 4;
      ctx.strokeRect(
        (width - size) / 2,
        (height - size) / 2,
        size,
        size
      );
    }
    
    // Draw video frame to photo canvas
    const photoCtx = photo.getContext('2d');
    if (photoCtx) {
      photoCtx.drawImage(video, 0, 0, width, height);
    }
    
    setHasPhoto(true);
  };

  // Clear photo and return to camera view
  const clearPhoto = () => {
    if (!photoRef.current) return;
    
    const photoCtx = photoRef.current.getContext('2d');
    if (photoCtx) {
      photoCtx.clearRect(0, 0, photoRef.current.width, photoRef.current.height);
    }
    
    setHasPhoto(false);
  };

  // Process the photo with image recognition
  const processPhoto = async () => {
    if (!photoRef.current) return;
    
    try {
      setProcessing(true);
      
      // Get image data for processing
      const imageData = photoRef.current.toDataURL('image/jpeg');
      
      // Use mock ML function to process image
      const result = await mockImageRecognition(imageData);
      setRecognizedItem(result);
      setProcessing(false);
      
    } catch (err) {
      setErrorMsg('Failed to process image. Please try again.');
      setProcessing(false);
      console.error('Image processing error:', err);
    }
  };

  // Add the recognized item to inventory and return to dashboard
  const addToInventory = () => {
    // In a real app, this would make an API call to save the item
    
    // Simulate API call
    setTimeout(() => {
      // Redirect back to dashboard
      router.push('/dashboard');
    }, 1500);
  };

  // Retry photo capture
  const handleRetry = () => {
    setRecognizedItem(null);
    clearPhoto();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
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

      {/* Main Content */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-[#e0f2f0]">
        {!recognizedItem ? (
          <div>
            {/* Camera/Photo View */}
            <div className="relative w-full h-[350px] mb-6 bg-black rounded-xl overflow-hidden">
              {!hasPhoto ? (
                <>
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
                </>
              ) : (
                <canvas 
                  ref={photoRef}
                  className="absolute top-0 left-0 w-full h-full" 
                />
              )}
              
              {/* Processing overlay */}
              {processing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-[#2ecc71] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white">Analyzing image...</p>
                  </div>
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
                {!hasPhoto 
                  ? 'Position the produce within the green box for best results' 
                  : 'Review the photo before analyzing'}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-center space-x-4">
              {!hasPhoto ? (
                <button
                  onClick={takePhoto}
                  className="py-3 px-8 rounded-xl bg-[#3d9991] text-white font-medium hover:bg-[#54b3aa] transition-colors"
                >
                  Take Photo
                </button>
              ) : (
                <>
                  <button
                    onClick={clearPhoto}
                    className="py-3 px-6 border border-[#3d9991] text-[#3d9991] rounded-xl hover:bg-[#f0faf9] transition-colors"
                  >
                    Retake
                  </button>
                  <button
                    onClick={processPhoto}
                    disabled={processing}
                    className={`py-3 px-6 rounded-xl text-white font-medium 
                      ${processing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#3d9991] hover:bg-[#54b3aa]'
                      } transition-colors`}
                  >
                    {processing ? 'Processing...' : 'Analyze Image'}
                  </button>
                </>
              )}
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
                  <p className="font-medium text-[#3d9991]">{recognizedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Category</p>
                  <p className="font-medium text-[#3d9991]">{recognizedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Condition</p>
                  <p className="font-medium text-[#3d9991]">{recognizedItem.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a7775]">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recognizedItem.tags.map((tag: string, index: number) => (
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
                Try Again
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