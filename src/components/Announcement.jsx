"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Announcement({ messages }) {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-2 px-3 md:py-2 md:px-4">
            <div className="container mx-auto flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <marquee className="text-md md:text-lg">
                            {messages}
                            <span className="inline-block w-[2px] h-3 md:h-4 bg-white ml-1 animate-pulse" />
                        </marquee>
                    </div>
                </div>
            </div>
        </div>
    );
}