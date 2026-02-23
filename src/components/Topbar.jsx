"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Topbar({ onMenuClick }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
        const res = await axios.get('/api/logout');
        const result = res?.data;
        if (result?.status === true) {
          toast.success("Logged out successfully");
          router.push("/admin/login");
        }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-14 bg-white flex items-center justify-between px-4 border-b border-gray-200 sticky top-0 z-30">
      {/* Left Section - Menu Button & Title */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-1.5 cursor-pointer rounded hover:bg-gray-100 transition-colors duration-200"
          onClick={onMenuClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h3 className="text-base font-bold text-gray-800">Dashboard</h3>
          <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <div className="text-right hidden sm:block">
          <button
            className="bg-white px-6 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-100 cursor-pointer"
            onClick={handleLogout}
         >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-8 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
              autoFocus
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsSearchOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}