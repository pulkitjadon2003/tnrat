"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { setUser } from '@/redux/slices/userSlices';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

export default function MemberForgotPassword() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        phone: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }


        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.confirmPassword.length < 6) {
            newErrors.confirmPassword = 'Confirm Password must be at least 6 characters';
        }

        if (formData.newPassword != formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password must be same as password"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            setTimeout(() => {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }, 50);
        }

        // Auto-submit when last digit is entered
        if (index === 6 && value) {
            const otpString = newOtp.join('');
            if (otpString.length === 6) {
                setTimeout(() => {
                    handleVerifyOtp();
                }, 100);
            }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input on backspace if current is empty
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) {
                    prevInput.focus();
                    // Clear the previous input
                    const newOtp = [...otp];
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                }
            } else if (otp[index]) {
                // Clear current input on backspace
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }

        // Handle arrow key navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }

        if (e.key === 'ArrowRight' && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits

        if (pastedDigits.length === 6) {
            const newOtp = pastedDigits.split('');
            setOtp(newOtp);

            // Focus the last input
            const lastInput = document.getElementById('otp-5');
            if (lastInput) lastInput.focus();

            // Auto-verify after paste
            setTimeout(() => handleVerifyOtp(), 100);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');

        if (otpString?.length !== 6) {
            setOtpError('Please enter complete 6-digit OTP');
            return;
        } else {
            setOtpError('');
        }

        setIsVerifyingOtp(true);
        setOtpError('');

        try {
            const response = await axios.post('/api/member/verify-otp-forgot-password', {
                phone: formData.phone,
                otp: otpString,
            });

            if (response?.data?.status === true) {
                toast.success('Phone number verified successfully');
                setIsOtpVerified(true);
                setShowOtpModal(false);
                setOtp(['', '', '', '', '', '']);
            } else {
                setOtpError(response.data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleChangePassword = async () => {

        if (!validateForm()) return;

        setIsVerifyingOtp(true)

        try {
            const response = await axios.put('/api/member/change-password', {
                phone: formData.phone,
                newPassword: formData.newPassword
            });

            if (response?.data?.status === true) {
                toast.success('Password Update successfully');
                setIsOtpVerified(false);
                router.push("/member/login")
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const OtpVerificationModal = () => (
        <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className="fixed inset-0 flex items-center justify-center z-50 text-black"
        >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Phone</h3>
                    <p className="text-gray-600 mb-6">
                        We've sent a 6-digit verification code to<br />
                        <span className="font-semibold">+91 {formData?.phone}</span>
                    </p>

                    {/* OTP Input Fields */}
                    <div className="flex justify-center space-x-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={index === 0 ? handleOtpPaste : undefined} // Only allow paste on first input
                                onFocus={(e) => e.target.select()} // Select all text when focused
                                autoFocus={index === 0}
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition duration-200"
                            />
                        ))}
                    </div>

                    {otpError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-800 text-sm">{otpError}</p>
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp || otp.join('').length !== 6}
                            className="cursor-pointer bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifyingOtp ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </div>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isSendingOtp}
                            className="cursor-pointer text-green-600 py-3 rounded-lg font-semibold border border-green-600 hover:bg-green-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                        </button>

                        <button
                            onClick={() => {
                                setShowOtpModal(false);
                                setOtp(['', '', '', '', '', '']);
                                setOtpError('');
                            }}
                            className="text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                        Didn't receive the code? Check your SMS messages
                    </p>
                </div>
            </div>
        </div>
    );

    const ChangeNumberModal = () => (
        <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className="fixed inset-0 flex items-center justify-center z-50 text-black"
        >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Change Your Password</h3>
                    <span className="font-semibold">+91 {formData?.phone}</span>

                    {/* OTP Input Fields */}
                    <div>
                        <div className="relative group mt-5">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-green-600">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 transition-all duration-300 ${errors.password
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:border-green-500'
                                    }`}
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer transition-colors duration-300 hover:text-green-600"
                            >
                                <svg className={`w-5 h-5 ${showPassword ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {showPassword ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="relative group mt-5">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-green-600">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData?.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 transition-all duration-300 ${errors.password
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:border-green-500'
                                    }`}
                                placeholder="Enter your confirm password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer transition-colors duration-300 hover:text-green-600"
                            >
                                <svg className={`w-5 h-5 ${showConfirmPassword ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {showConfirmPassword ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>


                    <div className="flex flex-col space-y-4 mt-5">
                        <button
                            onClick={handleChangePassword}
                            disabled={isVerifyingOtp}
                            className="cursor-pointer bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifyingOtp ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Changing...
                                </div>
                            ) : (
                                "Change Password"
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setIsOtpVerified(false);
                            }}
                            className="text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData?.phone.trim()) {
            setErrors({ phone: 'Phone number is required' });
            return;
        } else if (!/^\d{10}$/.test(formData?.phone)) {
            setErrors({ phone: 'Please enter a valid 10-digit phone number' });
            return;
        }


        setIsLoading(true);

        try {
            const res = await axios.post("/api/member/send-otp-forgot-password", formData);

            const result = res?.data;

            if (result?.status === true) {
                alert(result?.otp);
                setShowOtpModal(true);
            } else {
                setErrors({ general: result.error || "Something went wrong" });
            }
        } catch (error) {
            console.error("otp error:", error);
            setErrors({ general: error?.response?.data?.message || "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBecome = () => {
        router.push("/become-member");
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">

            {showOtpModal && <OtpVerificationModal />}

            {isOtpVerified && <ChangeNumberModal />}

            <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-200">
                <div className="flex flex-col md:flex-row">
                    <div className="bg-green-50 text-black hidden md:block md:w-1/2 p-12 text-white relative overflow-hidden">

                        <div className="relative z-10 text-black h-full flex flex-col justify-center">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl text-black font-bold mb-4">Welcome Back!</h1>
                                <p className="text-black-100 text-lg mb-8 max-w-md">
                                    Sign in to access your member features
                                </p>

                                <div className="space-y-4 mb-8">
                                    <img src="/tnrat-logo.png" alt="TNRAT Logo" className="h-40  w-40 object-contain" />
                                </div>
                            </div>

                            {/* Bottom decorative */}
                            <div className="mt-8 text-center md:text-left">
                                <p className="text-black-200 text-sm">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={handleBecome}
                                        className="text-black font-semibold hover:underline cursor-pointer"
                                    >
                                        Become a Member
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="md:w-1/2 p-12">
                        <div className="max-w-md mx-auto">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Member Forgot password</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.general && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 transition-all duration-300">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-red-700 text-sm">{errors.general}</p>
                                        </div>
                                    </div>
                                )}

                                {/* phone Field */}
                                <div>
                                    <label className="block text-gray-700 mb-3 font-medium">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-green-600">
                                            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 transition-all duration-300 ${errors.phone
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400 focus:border-green-500'
                                                }`}
                                            placeholder="Enter your phone Number"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300 cursor-pointer flex items-center group"
                                        onClick={() => router.push("/member/login")}
                                    >
                                        Remember a password?
                                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer ${isLoading
                                        ? 'bg-green-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            sending...
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Send otp
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};