'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddStock() {
  const router = useRouter();

  // Handle navigation to barcode scanner
  const handleBarcodeScan = () => {
    router.push('/add-stock/barcode');
  };

  // Handle navigation to image recognition scanner
  const handleImageScan = () => {
    router.push('/add-stock/image-recognition');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3d9991]">Add Stock</h1>
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-[#3d9991] hover:bg-[#e8f8f7] p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-[#f0faf9] p-6 rounded-xl shadow-sm mb-8 border border-[#d5f0ed]">
        <h2 className="text-xl font-medium text-[#3d9991] mb-3">How to add items to inventory</h2>
        <p className="text-[#5a7775]">
          Choose the appropriate scanning method below based on your item:
        </p>
        <ul className="mt-3 space-y-2 text-[#5a7775]">
          <li className="flex items-start">
            <span className="text-[#3d9991] mr-2">•</span>
            <span><strong>Barcode Scanner</strong>: For packaged items with barcodes (e.g., canned goods, packaged items)</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#3d9991] mr-2">•</span>
            <span><strong>Image Recognition</strong>: For fresh produce and items without barcodes (e.g., fruits, vegetables)</span>
          </li>
        </ul>
      </div>

      {/* Scanning Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Barcode Scanner Option */}
        <div 
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-[#e0f2f0]"
          onClick={handleBarcodeScan}
        >
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <Image
                src="/barcode-scan.svg"
                alt="Barcode Scanner"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-[#3d9991] mb-4">Barcode Scanner</h3>
          <p className="text-center text-[#5a7775]">
            Scan items with barcodes to quickly add them to inventory. 
            Our system will identify and categorize the product automatically.
          </p>
          <div className="mt-6 flex justify-center">
            <button 
              className="bg-[#3d9991] text-white py-3 px-6 rounded-xl hover:bg-[#54b3aa] transition-colors"
              onClick={handleBarcodeScan}
            >
              Start Scanning
            </button>
          </div>
        </div>

        {/* Image Recognition Option */}
        <div 
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-[#e0f2f0]"
          onClick={handleImageScan}
        >
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <Image
                src="/image-recognition.svg"
                alt="Image Recognition"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-[#3d9991] mb-4">Image Recognition</h3>
          <p className="text-center text-[#5a7775]">
            Use our image recognition technology for fresh produce and items without barcodes.
            Simply take a photo and we'll identify the item.
          </p>
          <div className="mt-6 flex justify-center">
            <button 
              className="bg-[#3d9991] text-white py-3 px-6 rounded-xl hover:bg-[#54b3aa] transition-colors"
              onClick={handleImageScan}
            >
              Start Scanning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 