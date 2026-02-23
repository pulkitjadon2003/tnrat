"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "@/redux/slices/userSlices";
import { useDispatch } from "react-redux";


const nameSchema = Yup.object().shape({
    phone: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone number should be 10 digits"),
});

const UpdateMobile = ({ modalOpen, setModalOpen, user }) => {
    const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const formikRef = useRef();

    // const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    //     try {
    //         const payload = {
    //             id: user?._id,
    //             phone: values?.phone
    //         };

    //         const url = '/api/member/update-member';

    //         const res = await axios.put(url, payload);

    //         if (res?.data?.status === true) {
    //             toast.success(`${title} updated successfully`);
    //             dispatch(setUser(res?.data?.member));
    //         }

    //         resetForm();
    //         setModalOpen(false);
    //     } catch (e) {
    //         console.log('error while updating account info', e);
    //         toast.error(e?.response?.data?.message || "Something went wrong. Please try again.");
    //         // alert("Something went wrong. Please try again.");
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const handleClose = () => {
        setModalOpen(false);
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (modalOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    if (!modalOpen) return null;

    
    const handleReSendOtp = async () => {
        setIsSendingOtp(true);
        setOtpError('');
        try {
            const response = await axios.post('/api/member/send-otp-for-change-phone', {
                phone: phone,
            });

            if (response?.data?.status === true) {
                alert(response?.data?.otp);
                toast.success('OTP sent successfully to your phone');
                setShowOtpModal(true);
            } else {
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
            setSubmitting(false);
        }
    };
    const handleSendOtp = async (values, { setSubmitting }) => {
        setIsSendingOtp(true);
        setOtpError('');
        setPhone(values?.phone);

        try {
            const response = await axios.post('/api/member/send-otp-for-change-phone', {
                phone: values?.phone,
            });

            if (response?.data?.status === true) {
                alert(response?.data?.otp);
                toast.success('OTP sent successfully to your phone');
                setShowOtpModal(true);
            } else {
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
            setSubmitting(false);
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
            const response = await axios.post('/api/member/verify-otp-for-change-phone', {
                phone: phone,
                otp: otpString,
                id: user?._id
            });

            if (response?.data?.status === true) {
                dispatch(setUser(response?.data?.member));
                toast.success('Phone number verified successfully');
                setShowOtpModal(false);
                setOtp(['', '', '', '', '', '']);
                setModalOpen(false);
                setPhone('');
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
                        <span className="font-semibold">+91 {phone}</span>
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
                            onClick={handleReSendOtp}
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

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 text-black"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            {showOtpModal && <OtpVerificationModal />}

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">
                            Change Phone Number
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded transition duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Name Update Form */}
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            phone: '',
                        }}
                        validationSchema={nameSchema}
                        enableReinitialize
                        onSubmit={handleSendOtp}
                    >
                        {({ handleSubmit, isSubmitting, errors, touched }) => (
                            <FormikForm onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter new phone number
                                    </label>
                                    <Field
                                        name="phone"
                                        type="number"
                                        placeholder="Enter new phone number"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <ErrorMessage name="name">
                                        {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>


                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="cursor-pointer flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            "Update"
                                        )}
                                    </button>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default UpdateMobile;