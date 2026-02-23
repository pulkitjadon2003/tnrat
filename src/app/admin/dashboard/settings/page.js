"use client";

import { useState } from 'react';
import AccountInfo from "@/components/AccountInfo";
import ActivityLog from '@/components/ActivityLog';
import PlatformFeeSetting from '@/components/PlatformFeeSetting';

const Settings = () => {
  const menuItems = [
    'Account Info',
    'Platform Settings',
    'Activity Log',
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="p-6 text-black">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-1/4">
          <div className="font-semibold text-2xl lg:text-3xl mb-6">Settings</div>
          
          <nav className="space-y-1">
            {menuItems.map((text, index) => (
              <button
                key={text}
                onClick={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedIndex === index
                    ? 'bg-green-50 text-green-700 border-r-4 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`font-medium ${
                  selectedIndex === index ? 'font-semibold' : 'font-normal'
                }`}>
                  {text}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    selectedIndex === index ? 'text-green-600' : 'text-gray-400'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="p-4 lg:p-8 pt-0 lg:pt-0">
            {selectedIndex === 0 && <AccountInfo />}
            {selectedIndex === 1 && <PlatformFeeSetting />}
            {selectedIndex === 2 && <ActivityLog />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;