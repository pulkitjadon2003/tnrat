'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThankYouModal from '@/components/ThankYouModal';

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


export default function PaymentPage() {
    const params = useParams();
    const token = params.id;
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [transactionId, setTransactionId] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await axios.post('/api/member/get-member-by-token', { token });

            if (response?.data?.status === true) {
                setUserData(response?.data?.member);
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Something went wrong');
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const handlePayment = async () => {
        if (!userData) return;

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        };

        setProcessing(true);

        let result;

        try {
            result = await axios.post('/api/member/create-order', {
                amount: userData?.amount,
                email: userData?.email,
                phone: userData?.phone,
                membershipRenewLink: true,
            });

            if (result?.data?.status === false) {
                toast.error(result?.response?.data?.message || 'Failed to create order');
                return;
            }

        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error?.response?.data?.message || 'Failed to create order');
            setProcessing(false);
            return;
        }

        const order = result?.data?.order;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order?.amount,
            currency: order?.currency,
            name: "TNRAT",
            description: "Membership Renewal",
            order_id: order?.id,
            handler: async function (response) {
                try {
                    const payload = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const verification = await axios.post('/api/member/verify-membership-transaction', payload);

                    if (verification?.data?.status === true) {
                        toast.success("Payment Successful");
                        setTransactionId(payload.razorpay_payment_id)
                        setShowThankYouModal(true);
                    } else {
                        toast.error(verification?.response?.data?.message || 'Failed to submit application. Please try again.');
                        setPaymentFailed(true);
                    }
                } catch (error) {
                    console.error("Payment Verification Error:", error);
                    toast.error("Payment Verification Error");
                    setPaymentFailed(true);
                } finally {
                    setProcessing(false);
                }
            },
            modal: {
                ondismiss: function () {
                    setProcessing(false);
                }
            },
            prefill: {
                name: userData?.fullName || "TNRAT",
                email: userData?.email || "admintnrat@gmail.com",
                contact: userData?.phone || "0000000000",
            },
            theme: {
                color: "#5CE65C",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    if (loading) {
        return (
            <div className="flex bg-green-50 items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-green-50 items-center justify-center min-h-screen">
                <div className="bg-red-50 w-full h-full border border-red-200 rounded-lg p-8 max-w-md text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => router.push('/member/login')}
                        className="cursor-pointer mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Go to Login Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 md:py-12 md:px-4">
            {processing && <div
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className="rounded-lg p-6 max-w-md w-full mx-4">
                    {/* Content */}
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white-800 mx-auto"></div>
                        <p className="text-white text-gray-600 mt-6">
                            Please wait while we process your payment.
                        </p>
                    </div>
                </div>
            </div>}

            {paymentFailed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md animate-fade-in">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 text-center">
                                <button
                                    onClick={() => setPaymentFailed(false)}
                                    className="cursor-pointer absolute right-4 top-4 z-10 rounded-full p-2 text-gray-500 hover:bg-white/50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    aria-label="Close"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white p-3 shadow-lg">
                                    <svg
                                        className="h-10 w-10 text-red-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    Payment Failed
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-100">
                                    <div className="flex items-start">
                                        <svg
                                            className="mt-0.5 mr-3 h-5 w-5 text-amber-500 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-sm text-amber-800">
                                            If amount was debited, our system will automatically update your transaction in a few minutes, so please do not worry.
                                        </p>
                                    </div>
                                </div>

                                {/* Support contact */}
                                <div className="rounded-lg bg-gray-50 p-5 text-center">
                                    <p className="mb-3 text-sm font-medium text-gray-700">
                                        Need immediate assistance?
                                    </p>
                                    <div className="inline-flex items-center justify-center rounded-full bg-green-50 px-4 py-2">
                                        <svg
                                            className="mr-2 h-5 w-5 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span className="font-semibold text-green-700">+91 8827010771</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Available 24/7 for payment-related queries
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ThankYouModal
                isOpen={showThankYouModal}
                onClose={() => setShowThankYouModal(false)}
                transactionId={transactionId}
                amount={userData?.amount}
            />

            <div className="max-w-2xl md:mx-auto">
                <div className="bg-white md:rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-600 to-green-700 p-8 text-white">
                        <h1 className="text-xl md:text-3xl font-bold mb-2">Complete Your Payment</h1>
                        <p className="text-sm md:text-lg text-green-100">Secure payment powered by Razorpay</p>
                    </div>

                    {/* Payment Details */}
                    <div className="p-4 md:p-8">
                        {/* User Info */}
                        <div className="mb-8 p-3 md:p-6 bg-green-50 rounded-xl border border-green-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>

                            <div className="space-y-2 md:space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-xs md:text-sm text-gray-600">Full Name</span>
                                    <span className="text-xs md:text-sm font-medium text-gray-900">{userData?.fullName}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-xs md:text-sm text-gray-600">Email</span>
                                    <span className="text-xs md:text-sm font-medium text-gray-900">{userData?.email}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-xs md:text-sm text-gray-600">Phone</span>
                                    <span className="text-xs md:text-sm font-medium text-gray-900">{userData?.phone}</span>
                                </div>

                                <div className="flex justify-between items-center py-3">
                                    <span className="text-xs md:text-sm text-gray-600">Amount</span>
                                    <span className="text-sm text-2xl font-bold text-green-600">
                                        ₹{userData?.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3">
                                <svg className="w-10 h-10 md:w-5 md:h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Your payment is secured with SSL encryption. We never store your card details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="flex-1 py-4 px-6 cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Pay ₹{userData?.amount.toFixed(2)} Now</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                By completing this payment, you agree to our Terms of Service and Privacy Policy.
                                All payments are processed securely by Razorpay.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}