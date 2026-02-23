"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-green-50 overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      </div>

      <div className="flex flex-col flex-1 lg:ml-64 min-w-0 h-full">
        <div className="sticky top-0 z-40">
          <Topbar onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
        </div>

        <main className="flex-1 bg-white p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}