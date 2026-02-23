// components/ThankYouModal.jsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ThankYouModal = ({ isOpen, onClose, transactionId, amount }) => {
    const router = useRouter();
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Thank You!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Your contribution has been successfully processed.
                    </p>

                    {/* Transaction Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-semibold text-black">₹{amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono text-sm text-green-600">
                                {transactionId}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/')}
                            className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Continue
                        </button>
                        <button
                            onClick={() => {
                                // Copy transaction ID to clipboard
                                navigator.clipboard.writeText(transactionId);
                                // You can add a toast notification here
                                toast.success('Transaction ID copied to clipboard!');
                            }}
                            className="cursor-pointer flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            Copy ID
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYouModal;