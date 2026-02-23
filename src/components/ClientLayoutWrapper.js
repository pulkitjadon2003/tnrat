"use client";

import { useEffect, useState } from "react";
import Announcement from "./Announcement";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import LoginButton from "./LoginButton";

const { usePathname } = require("next/navigation");

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin/dashboard");
  const isHome = pathname === "/";
  const [announcements, setAnnouncements] = useState([]);
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  const getGlobalData = async () => {
    try {
      
      const res = await axios.get('/api/global');

      const result = res?.data;

      if (result?.status === true) {
        setAnnouncements(result?.global?.announcements || []);
        
        setFacebook(result?.global?.facebook || '');
        setInstagram(result?.global?.instagram || '');
        setTwitter(result?.global?.twitter || '');
      }
    } catch (error) {
      console.error('Error fetching current platform fee:', error);
    }
  };

  useEffect(() => {
    getGlobalData();
  }, []);


  return (
    <>
      {!isDashboard && announcements?.length > 0 && <Announcement messages={announcements} />}
      {!isDashboard && <Header announcements={announcements?.length > 0} />}
      {children}
      {!isDashboard && <Footer facebook={facebook} instagram={instagram} twitter={twitter} />}
      {isHome && <LoginButton announcements={announcements?.length > 0} />}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#4BB543",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
        }}
      />

    </>
  );
}
