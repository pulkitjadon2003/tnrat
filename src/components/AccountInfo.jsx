"use client";

import { useState } from 'react';
import UpdateAccountInfo from './UpdateAccountInfo';
import { useSelector } from 'react-redux';

function AccountInfo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { user } = useSelector((state) => state.user);

  const handleDeleteProfilePic = async () => {
    if (confirm("Are you sure you want to delete your profile picture?")) {
      // Handle delete logic here
      console.log('Delete profile picture');
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-xl p-6 bg-white">
      <UpdateAccountInfo 
        modalOpen={modalOpen} 
        setModalOpen={setModalOpen} 
        title={title} 
        user={user} 
      />

      <div className="text-2xl font-bold mb-6">Account Info</div>

      {/* Profile Picture Section */}
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div> */}
{/* 
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDeleteProfilePic}
            className="text-red-600 hover:text-red-800 transition duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition duration-150 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        </div> */}
      {/* </div> */}

      {/* Account Details */}
      {[
        { label: 'Name', value: user?.name },
        { label: 'Contact', value: `${user?.email}\n${user?.phone || ''}` },
        { label: 'Password', value: '**********' },
      ].map((item, idx) => (
        <div key={idx} className="flex justify-between items-start mb-6">
          <div>
            <div className="font-medium text-lg text-gray-900">{item.label}</div>
            <div className="text-gray-600 whitespace-pre-line mt-1">{item.value}</div>
          </div>
          <button
            onClick={() => {
              setModalOpen(true);
              setTitle(item.label);
            }}
            className="px-4 py-2 border border-gray-400 text-gray-700 font-bold text-sm rounded hover:bg-gray-50 transition duration-150 cursor-pointer"
          >
            Edit
          </button>
        </div>
      ))}

      
    </div>
  );
}

export default AccountInfo;