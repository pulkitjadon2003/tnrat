"use client";

import { IoLanguage } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function GoogleTranslate() {
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const addScript = document.createElement("script");
        addScript.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(addScript);

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,mr,ta,te,kn,bn,gu,pa,ur",
                    autoDisplay: false,
                },
                "google_translate_element"
            );

            const savedLang = localStorage.getItem("selectedLanguage");
            if (savedLang) {
                setTimeout(() => {
                    changeLanguage(savedLang);
                }, 500);
            }
        };
    }, []);

    const changeLanguage = (lang) => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event("change"));
        }
    };

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const select = document.querySelector(".goog-te-combo");
            if (select) {
                select.addEventListener("change", (e) => {
                    localStorage.setItem("selectedLanguage", e.target.value);
                });

                select.style.padding = "8px 12px";
                select.style.border = "1px solid #d1d5db";
                select.style.borderRadius = "8px";
                select.style.fontSize = "14px";
                select.style.cursor = "pointer";
                select.style.outline = "none";

                if (window.innerWidth <= 480) {
                    select.style.width = "80px";
                } else {
                    select.style.width = "auto";
                }

                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div>
            {!showDropdown ? (
                <div
                    onClick={() => setShowDropdown(true)}
                    style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        padding: "6px",
                    }}
                >
                    <IoLanguage className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </div>
            ) : null}


            <div id="google_translate_element" style={{ display: showDropdown ? "block" : "none" }}></div>

        </div>
    );
};