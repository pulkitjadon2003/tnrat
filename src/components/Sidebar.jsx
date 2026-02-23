"use client";
import { BuildingLibraryIcon, CurrencyRupeeIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user } = useSelector((state) => state.user);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Create Post",
      path: "/admin/dashboard/create-post",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: "Post Management",
      path: "/admin/dashboard/post-management",
      icon: (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke={"currentColor"} strokeWidth="2" />
          <path d="M8 7H16M8 11H16M8 15H12" stroke={"currentColor"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: "Member Management",
      path: "/admin/dashboard/member",
      icon: (
        <UsersIcon className="w-5 h-5 text-gray-500" />
      )
    },
    {
      name: "Donation Management",
      path: "/admin/dashboard/donation-management",
      icon: (
        <CurrencyRupeeIcon className="w-5 h-5 text-gray-500" />
      )
    },
    {
      name: "Team Management",
      path: "/admin/dashboard/team-management",
      icon: (
        <BuildingLibraryIcon className="w-5 h-5 text-gray-500" />
      )
    },
    {
      name: "LeaderShip team Management",
      path: "/admin/dashboard/leadership-team-management",
      icon: (
        <UsersIcon className="w-5 h-5 text-gray-500" />
      )
    },
    {
      name: "Role Management",
      path: "/admin/dashboard/role-management",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: "Settings",
      path: "/admin/dashboard/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white text-gray-800 h-screen
        flex flex-col border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/tnrat-logo.png" alt="TNRAT Logo" className="w-8 h-8" />
              <div>
                <h2 className="text-base font-bold text-gray-800">Admin Panel</h2>
                <p className="text-xs text-gray-500">TNRAT Organization</p>
              </div>
            </div>
            <button
              className="lg:hidden p-1 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsMobileOpen(false)}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu - Reduced padding */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems?.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMobileOpen(false)}
            >
              <div
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${pathname === item.path
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                <div className={`p-1 rounded-md ${pathname === item.path
                  ? "text-green-600"
                  : "text-gray-400"
                  }`}>
                  {item?.icon}
                </div>
                <span className="font-medium text-md truncate">{item?.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-green-200">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role === "subAdmin" ? "Sub Admin" : "Admin"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};