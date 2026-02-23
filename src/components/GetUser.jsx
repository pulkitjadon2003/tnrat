"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/slices/userSlices";

export default function GetUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth", { withCredentials: true });
        console.log("User fetched:", res.data);

        if (res.data?.user) {
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.log("No user found");
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
}
