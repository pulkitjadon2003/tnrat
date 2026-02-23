"use client";

import ThankYouModal from '@/components/ThankYouModal';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Donate() {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    donateAnonymously: false
  });
  const [errors, setErrors] = useState({});
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const impactStats = [
    {
      number: "500+",
      text: "Families Helped"
    },
    {
      number: "200+",
      text: "Students Supported"
    },
    {
      number: "100+",
      text: "Medical Cases"
    }
  ];

  const quickDonations = [100, 500, 1000, 2000, 5000, 10000];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() && !formData.donateAnonymously) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim() && !formData.donateAnonymously) {
      newErrors.email = 'Email is required';
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim() && !formData.donateAnonymously) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!donationAmount && !customAmount) {
      newErrors.amount = 'Please select or enter contribution amount';
    } else if ((donationAmount && donationAmount < 1) || (customAmount && customAmount < 1)) {
      newErrors.amount = 'Contribution amount must be at least ₹1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuickDonation = (amount) => {
    setDonationAmount(amount);
    setCustomAmount(amount);
    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: ''
      }));
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setDonationAmount('');
    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: ''
      }));
    }
  };

  const handleRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setIsProcessing(true);
    let result;
    try {
      result = await axios.post('/api/donate/create-order', {
        amount: donationAmount || customAmount,
        ...formData
      });

      if (result?.data?.status === false) {
        toast.error(result?.response?.data?.message || 'Failed to create order');
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error?.response?.data?.message || 'Failed to create order');
      setIsProcessing(false);
      return;
    }

    const order = result?.data?.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: "TNRAT",
      description: "TNRAT Contribution",
      order_id: order?.id,
      handler: async function (response) {
        try {
          const verification = await axios.post('/api/donate/verify-transaction', { ...response });

          if (verification?.data?.status === true) {
            setTransactionId(response?.razorpay_payment_id);
            setAmount(customAmount);
            setThankYouModalOpen(true);
            resetForm();
            toast.success("Payment Successful");
          } else {
            toast.error("Payment Failed");
            setPaymentFailed(true);
          }
        } catch (error) {
          console.error("Payment Verification Error:", error);
          toast.error("Payment Verification Error");
          setPaymentFailed(true);
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: formData?.fullName || "Anonymous",
        email: formData?.email || "admintnrat@gmail.com",
        contact: formData?.phone || "0000000000",
      },
      theme: {
        color: "#5CE65C",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const resetForm = () => {
    setDonationAmount('');
    setCustomAmount('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      donateAnonymously: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    handleRazorpay();
  };

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <ThankYouModal
        isOpen={thankYouModalOpen}
        onClose={() => setThankYouModalOpen(false)}
        transactionId={transactionId}
        amount={amount}
      />

      {paymentFailed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md animate-fade-in">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header with warning icon */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 text-center">
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
                      If amount was debited, our system will automatically update your donation in a few minutes, so please do not worry.
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

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Contribute to TNRAT</h1>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              <img src="/donate.png" alt="TNRAT Logo" className="h-26 w-26 object-contain" />
            </div>
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4">Support Our Mission</h2>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Your contribution helps us create lasting change in communities and transform lives.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Your Impact</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div className="bg-white rounded-2xl p-5 md:p-8 border border-green-300">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Quick Contribution</h3>

            {/* Quick Donation Amounts */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {quickDonations.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickDonation(amount)}
                    className={`py-3 rounded-lg font-semibold transition duration-300 ${donationAmount === amount
                      ? 'bg-green-600 text-white'
                      : 'bg-white-100 border border-green-300 text-gray-700 hover:bg-green-100 hover:text-green-700'
                      }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 ${errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>

            {/* Donor Details Form */}
            <form onSubmit={handleSubmit}>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Contributor Details</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={formData.donateAnonymously}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } ${formData.donateAnonymously ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={formData.donateAnonymously}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        } ${formData.donateAnonymously ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={formData.donateAnonymously}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        } ${formData.donateAnonymously ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="donateAnonymously"
                    checked={formData.donateAnonymously}
                    onChange={handleInputChange}
                    className="cursor-pointer w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-2 text-gray-700 font-medium">
                    Contribute anonymously
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`cursor-pointer w-full py-4 rounded-lg font-semibold transition duration-300 mt-8 ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Contribute Now'}
              </button>
            </form>
          </div>

          {/* Our Causes Section */}
          <div>
            <OurCauses />
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate Our Causes Component (unchanged)
function OurCauses() {
  const causes = [
    {
      title: "Food Distribution",
      description: "Providing nutritious meals to underprivileged families",
      raised: 45000,
      goal: 100000,
      color: "bg-green-500"
    },
    {
      title: "Education Support",
      description: "Ensuring quality education for every child",
      raised: 75000,
      goal: 150000,
      color: "bg-blue-500"
    },
    {
      title: "Healthcare Aid",
      description: "Medical assistance for those in need",
      raised: 60000,
      goal: 120000,
      color: "bg-red-500"
    },
    {
      title: "Opportunity Creation",
      description: "Empowering underprivileged individuals with new opportunities",
      raised: 30000,
      goal: 80000,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-8 border border-green-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Causes</h3>
      <div className="space-y-6">
        {causes.map((cause, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-green-300 transition duration-300">
            <h4 className="text-xl font-bold text-gray-800 mb-2">{cause.title}</h4>
            <p className="text-gray-600 mb-4">{cause.description}</p>

            {/* <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Raised: ₹{cause.raised.toLocaleString()}</span>
                <span>Goal: ₹{cause.goal.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${cause.color} transition-all duration-500`}
                  style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-semibold text-gray-700">
                {Math.round((cause.raised / cause.goal) * 100)}% Funded
              </span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}