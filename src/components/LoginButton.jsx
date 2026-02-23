'use client';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


export default function LoginButton({announcements}) {
    const router = useRouter();
    const { user } = useSelector((state) => state.user);

    const handleLogin = () => {
        router.push('/member/login');
    };

    const handleNavigte = async () => {
        router.push('/member/dashboard');
    };

    const buttonColor = user?._id
        ? "bg-red-400 hover:bg-red-600"
        : "bg-green-400 hover:bg-green-600";

    return (
        <button
            onClick={user && user?.isMember ? handleNavigte : handleLogin}
            className={`fixed cursor-pointer ${announcements ? 'top-34' : 'top-20'} right-2 z-50 bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2`}        >
            <span className="text-lg">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </span>
            {user && user?.isMember ? 'Dashboard' : 'Login'}
        </button>
    );
}