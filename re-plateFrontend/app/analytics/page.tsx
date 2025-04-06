'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  
  // Mock analytics data
  const wastagePreventedData = {
    week: 230,
    month: 980,
    year: 11520
  };
  
  const co2OffsetData = {
    week: 42,
    month: 176,
    year: 2074
  };
  
  const peopleServedData = {
    week: 80,
    month: 348,
    year: 4120
  };
  
  const foodCategoryData = {
    'Fruits & Vegetables': 35,
    'Bakery & Bread': 22,
    'Dairy & Eggs': 18,
    'Canned Goods': 12,
    'Meat & Poultry': 8,
    'Others': 5
  };
  
  const foodStatusData = {
    'Good': 65,
    'Critical': 27,
    'Waste (Prevented)': 8
  };
  
  const monthlyDonationData = [
    42, 38, 55, 40, 45, 53, 58, 62, 48, 53, 59, 68
  ];
  
  const shelterDistributionData = [
    { name: 'Yukon Shelter', percentage: 32 },
    { name: 'AI Mitchell', percentage: 28 },
    { name: 'New Fountain', percentage: 22 },
    { name: 'The Osborn', percentage: 18 }
  ];
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Chart options
  const donutOptions = {
    labels: Object.keys(foodCategoryData),
    colors: ['#3d9991', '#54b3aa', '#79ccc7', '#a0deda', '#c4eeeb', '#e7faf9'],
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };
  
  const barOptions = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '70%',
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#3d9991'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Food Items Donated',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        }
      }
    }
  };
  
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const getImpactDescription = () => {
    const pounds = wastagePreventedData[timeframe];
    const co2 = co2OffsetData[timeframe];
    const people = peopleServedData[timeframe];
    
    if (timeframe === 'week') {
      return `This week, you've saved ${formatNumber(pounds)} pounds of food from going to waste. That's equivalent to ${co2} kg of CO₂ emissions prevented and helped serve approximately ${people} people in need.`;
    } else if (timeframe === 'month') {
      return `This month, you've saved ${formatNumber(pounds)} pounds of food from going to waste. That's equivalent to ${co2} kg of CO₂ emissions prevented and helped serve approximately ${formatNumber(people)} people in need.`;
    } else {
      return `This year, you've saved ${formatNumber(pounds)} pounds of food from going to waste. That's equivalent to ${formatNumber(co2)} kg of CO₂ emissions prevented and helped serve approximately ${formatNumber(people)} people in need.`;
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-[#f5f1e6]">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3d9991]">Donation Analytics</h1>
        </div>
        
        {/* Time frame selector */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8 border border-[#e0f2f0]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#2c3e50]">Your Impact</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('week')}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  timeframe === 'week' 
                    ? 'bg-[#3d9991] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  timeframe === 'month' 
                    ? 'bg-[#3d9991] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  timeframe === 'year' 
                    ? 'bg-[#3d9991] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Year
              </button>
            </div>
          </div>
        </div>
        
        {/* Impact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Food Wastage Prevented */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 font-medium">Food Wastage Prevented</h3>
                <p className="text-3xl font-bold text-[#2c3e50]">{formatNumber(wastagePreventedData[timeframe])} lbs</p>
              </div>
              <div className="p-3 bg-[#e8f8f7] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>12% increase</span>
              </span>
              <span className="ml-2 text-gray-500">vs previous {timeframe}</span>
            </div>
          </div>
          
          {/* CO2 Emissions Offset */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 font-medium">CO₂ Emissions Offset</h3>
                <p className="text-3xl font-bold text-[#2c3e50]">{formatNumber(co2OffsetData[timeframe])} kg</p>
              </div>
              <div className="p-3 bg-[#e8f8f7] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>8% increase</span>
              </span>
              <span className="ml-2 text-gray-500">vs previous {timeframe}</span>
            </div>
          </div>
          
          {/* People Served */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 font-medium">People Served</h3>
                <p className="text-3xl font-bold text-[#2c3e50]">{formatNumber(peopleServedData[timeframe])}</p>
              </div>
              <div className="p-3 bg-[#e8f8f7] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>15% increase</span>
              </span>
              <span className="ml-2 text-gray-500">vs previous {timeframe}</span>
            </div>
          </div>
        </div>
        
        {/* Impact summary */}
        <div className="bg-[#f0faf9] p-6 rounded-xl shadow-sm mb-8 border border-[#d5f0ed]">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3d9991] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-[#3d9991]">Your Impact</h2>
          </div>
          <p className="text-[#5a7775]">
            {getImpactDescription()}
          </p>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Food Category Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Food Category Distribution</h3>
            {loading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d9991]"></div>
              </div>
            ) : (
              <div className="h-80">
                {typeof window !== 'undefined' && (
                  <Chart
                    options={donutOptions}
                    series={Object.values(foodCategoryData)}
                    type="donut"
                    height="100%"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Monthly Donation Trend */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Monthly Donation Trend</h3>
            {loading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d9991]"></div>
              </div>
            ) : (
              <div className="h-80">
                {typeof window !== 'undefined' && (
                  <Chart
                    options={barOptions}
                    series={[{
                      name: 'Donations',
                      data: monthlyDonationData
                    }]}
                    type="bar"
                    height="100%"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Shelter Distribution & Food Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Shelter Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Distribution by Shelter</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d9991]"></div>
              </div>
            ) : (
              <div>
                {shelterDistributionData.map((shelter, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">{shelter.name}</span>
                      <span className="text-[#3d9991] font-medium">{shelter.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#3d9991] h-2.5 rounded-full" 
                        style={{ width: `${shelter.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Food Status */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0]">
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Food Status at Donation</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d9991]"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(foodStatusData).map(([status, percentage], index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{status}</span>
                      <span className={`font-medium ${
                        status === 'Good' ? 'text-green-600' : 
                        status === 'Critical' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status === 'Good' ? 'bg-green-500' : 
                          status === 'Critical' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">Critical foods saved from waste through<br />immediate distribution:</span>
                    <span className="ml-auto text-green-600 font-bold text-xl">94%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips & Insights */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#e0f2f0] mb-8">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Tips & Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="flex-shrink-0 p-3 bg-[#e8f8f7] rounded-full h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Optimize Distribution Times</h4>
                <p className="text-gray-600 text-sm">
                  Based on our analysis, donating bread and dairy products in the morning can increase their chances of immediate distribution by 40%.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 p-3 bg-[#e8f8f7] rounded-full h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Track Best Before Dates</h4>
                <p className="text-gray-600 text-sm">
                  Your donations with best before dates tracked were distributed 75% faster than those without date information.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 p-3 bg-[#e8f8f7] rounded-full h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Most Needed Items</h4>
                <p className="text-gray-600 text-sm">
                  Currently, protein-rich foods and fresh produce are in highest demand. Consider donating these items for maximum impact.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 p-3 bg-[#e8f8f7] rounded-full h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3d9991]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Increasing Your Impact</h4>
                <p className="text-gray-600 text-sm">
                  Your donations have increased by 18% compared to last {timeframe === 'year' ? 'year' : timeframe === 'month' ? 'month' : 'week'}. Keep up the great work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 