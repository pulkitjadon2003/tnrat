import axios from "axios";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function OtpVerificationModal({ phone, isSendingOtp, setIsSendingOtp, setOtpVerified, setShowOtpModal, setCurrentStep }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const inputRefs = useRef([]);

    // Initialize refs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            setTimeout(() => {
                const nextInput = inputRefs.current[index + 1];
                if (nextInput) nextInput.focus();
            }, 50);
        }

        // Auto-submit when last digit is entered
        if (index === 5 && value) {
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
                const prevInput = inputRefs.current[index - 1];
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
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) prevInput.focus();
        }

        if (e.key === 'ArrowRight' && index < 5) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpPaste = async (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (pastedDigits.length === 6) {
            const newOtp = pastedDigits.split('');
            setOtp(newOtp);
            
            // Focus the last input
            const lastInput = inputRefs.current[5];
            if (lastInput) lastInput.focus();
            
            // Wait for state update, then verify
            setTimeout(() => {
                handleVerifyOtp();
            }, 50);
        } else {
            // Handle partial paste - fill available digits
            const newOtp = [...otp];
            for (let i = 0; i < pastedDigits.length && i < 6; i++) {
                newOtp[i] = pastedDigits[i];
            }
            setOtp(newOtp);
            
            // Focus the next empty input or last filled
            const focusIndex = Math.min(pastedDigits.length, 5);
            const nextInput = inputRefs.current[focusIndex];
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');

        console.log('otpsting', otpString?.length)

        if (otpString.length !== 6) {
            // setOtpError('Please enter complete 6-digit OTP');
            
            // Focus the first empty input
            const firstEmptyIndex = otp.findIndex(digit => digit === '');
            const inputToFocus = inputRefs.current[firstEmptyIndex] || inputRefs.current[0];
            if (inputToFocus) inputToFocus.focus();
            
            return;
        } else {
            setOtpError('');
        }

        setIsVerifyingOtp(true);
        setOtpError('');

        try {
            const response = await axios.post('/api/member/verify-otp', {
                phone: phone,
                otp: otpString
            });

            if (response?.data?.status === true) {
                toast.success('Phone number verified successfully');
                setOtpVerified(true);
                setShowOtpModal(false);
                setOtp(['', '', '', '', '', '']);
                window.scrollTo(0, 0);
                setCurrentStep(2);
            } else {
                setOtpError(response.data.message || 'Invalid OTP');
                // Focus the first input on error
                const firstInput = inputRefs.current[0];
                if (firstInput) firstInput.focus();
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
            // Focus the first input on error
            const firstInput = inputRefs.current[0];
            if (firstInput) firstInput.focus();
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const resendOtp = async () => {
        setIsSendingOtp(true);
        setOtpError('');

        try {
            const response = await axios.post('/api/member/send-otp', {
                phone: phone
            });

            if (response.data.status === true) {
                alert(response?.data?.otp)
                toast.success('OTP resent successfully');
                setOtp(['', '', '', '', '', '']);
                const firstInput = inputRefs.current[0];
                if (firstInput) firstInput.focus();
            } else {
                toast.error(response.data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    return (
        <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className="fixed inset-0 flex items-center justify-center z-50 text-black mx-1"
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
                        <span className="font-semibold">+91 {phone}</span>
                    </p>

                    {/* OTP Input Fields */}
                    <div className="flex justify-center space-x-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                id={`otp-${index}`}
                                type="tel"  // Changed from "text" to "tel" for numeric keypad
                                inputMode="numeric"  // Additional hint for numeric input
                                pattern="[0-9]*"  // Pattern for numeric input
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                onFocus={(e) => e.target.select()}
                                autoFocus={index === 0}
                                autoComplete="one-time-code"  // Helps with autofill
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition duration-200 appearance-none"  // Added appearance-none
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
                            onClick={resendOtp}
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
    )
}