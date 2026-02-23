"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserCircleIcon,
  DocumentTextIcon,
  TrophyIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CalendarDateRangeIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  PencilIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import UpdateMember from '@/components/UpdateMember';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import UpdateMobile from '@/components/UpdateMobile';
import ThankYouModal from '@/components/ThankYouModal';
import { clearUser, setUser } from '@/redux/slices/userSlices';
import UpdateDocuments from '@/components/UpdateDocuments';
import { MdCardMembership } from "react-icons/md";
import { BiDonateHeart } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { MdCurrencyRupee } from "react-icons/md";
import MemberTransactions from '@/components/MemberTransactions';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MemberDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const memberData = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  // Document upload states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchGlobal = async () => {
    try {
      const res = await axios.get('/api/global');
      const result = res?.data;
      if (result?.status === true) {
        setAmount(result?.global?.memberSubscriptionFee || 0);
        setYearlyAmount(result?.global?.memberEntryFee || 0);
      }
    } catch (error) {
      console.error('Error fetching current platform fee:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGlobal();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateJoiningLetter = async () => {
    if (!memberData) {
      toast.error('Member data not available');
      return;
    }

    setGeneratingCertificate(true);
    try {
      const response = await axios.post('/api/generate-certificate', {
        memberId: memberData?.memberId,
        fullName: memberData?.fullName,
        joinDate: memberData?.memberShipStartDate,
        email: memberData?.email,
        phone: memberData?.phone,
        address: memberData?.address,
      }, {
        responseType: 'blob' // Important for file download
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TNRAT-Membership-Certificate-${memberData?.memberId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Joining letter downloaded successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate joining letter');
    } finally {
      setGeneratingCertificate(false);
    }
  };


  const handleEditDocument = (documentType) => {
    setEditingDocument(documentType);
    setSelectedFile(null);
    setShowEditModal(true);
  };


  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = url.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const isPdfFile = (url) => {
    if (!url) return false;
    const extension = url.split('.').pop().toLowerCase();
    return extension === 'pdf';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">Loading Your Profile</h3>
          <p className="text-green-700 max-w-md">We're getting everything ready for you...</p>
        </div>
      </div>
    );
  }

  const calculateDaysLeft = () => {
    if (!memberData?.memberShipExpiry) return null;
    const expiryDate = dayjs(memberData?.memberShipExpiry);
    const today = dayjs();
    const daysLeft = expiryDate.diff(today, 'day');
    return daysLeft;
  };

  const calculateYearlyDaysLeft = () => {
    if (!memberData?.yearlySubscriptionExpiry) return null;
    const expiryDate = dayjs(memberData?.yearlySubscriptionExpiry);
    const today = dayjs();
    const daysLeft = expiryDate.diff(today, 'day');
    return daysLeft;
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/logout');
      const result = res?.data;
      if (result?.status === true) {
        dispatch(clearUser());
        toast.success("Logged out successfully");
        router.push("/member/login");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  const handleRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    let result;
    let description;
    let amt;

    if (new Date(memberData?.yearlySubscriptionExpiry) < new Date() && new Date(memberData?.memberShipExpiry) < new Date()) {
      amt = amount + yearlyAmount;
      description = 'Monthly Contribution and Yearly Membership Renewal';
    } else if (new Date(memberData?.yearlySubscriptionExpiry) < new Date()) {
      amt = yearlyAmount;
      description = 'Yearly Subscription Renewal';
    } else if (new Date(memberData?.memberShipExpiry) < new Date()) {
      amt = amount;
      description = 'Monthly Contribution';
    }

    setPaidAmount(amt);

    try {
      setIsProcessing(true);

      result = await axios.post('/api/member/create-order', {
        amount: amt,
        email: memberData?.email,
        phone: memberData?.phone,
        membershipRenew: true,
      });

      if (result?.data?.status === false) {
        toast.error(result?.response?.data?.message || 'Failed to create order');
        setIsLoading(false);
        return;
      }

      setIsProcessing(false);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error?.response?.data?.message || 'Failed to create order');
      setIsLoading(false);
      setIsProcessing(false);
      return;
    }

    const order = result?.data?.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: "TNRAT",
      description: description,
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
          setIsLoading(false);
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        }
      },
      prefill: {
        name: memberData?.fullName || "TNRAT",
        email: memberData?.email || "admintnrat@gmail.com",
        contact: memberData?.phone || "0000000000",
      },
      theme: {
        color: "#5CE65C",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (isProcessing) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 text-black"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
          <p className="text-white max-w-md">Please wait while we process your payment.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">Verifying Payment</h3>
          <p className="text-green-700 max-w-md">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 to-emerald-100">
      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        transactionId={transactionId}
        amount={paidAmount}
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

      <UpdateMember modalOpen={modalOpen} setModalOpen={setModalOpen} title={'Profile'} user={memberData} />

      <UpdateMobile modalOpen={mobileModalOpen} setMobileModalOpen={setMobileModalOpen} user={memberData} />

      <UpdateDocuments
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingDocument={editingDocument}
        setEditingDocument={setEditingDocument}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        user={memberData}
      />

      <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b transition-all duration-300 ${isScrolled ? 'border-green-200' : 'border-transparent'
        }`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-green-900 flex items-center gap-3">
              <UserCircleIcon className="w-8 h-8 text-green-600" />
              Member Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="cursor-pointer flex gap-1 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 group">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-green-200 mb-8 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Picture */}
              <div className="flex-shrink-0 mx-auto lg:mx-0 relative">
                {memberData?.facePicture ? (
                  <div className="relative">
                    <img
                      src={memberData?.facePicture}
                      alt="Profile"
                      className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-green-200"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckBadgeIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-semibold border-4 border-green-200 relative">
                    {memberData?.fullName.charAt(0).toUpperCase()}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <PlusCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">
                      {memberData?.fullName}
                    </h1>
                    <p className="text-green-700 flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      {memberData?.email}
                    </p>
                  </div>

                  {
                    (new Date(memberData?.memberShipExpiry) < new Date() && new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                      <div className="flex gap-3 mt-4 lg:mt-0">
                        <button
                          onClick={handleRazorpay}
                          className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                        >
                          <CalendarDateRangeIcon className="w-5 h-5" />
                          {`Pay ₹${amount + yearlyAmount} Monthly Contribution + Yearly Subscription Renewal`}
                        </button>
                      </div>
                      : (new Date(memberData?.memberShipExpiry) < new Date()) ?
                        <div className="flex gap-3 mt-4 lg:mt-0">
                          <button
                            onClick={handleRazorpay}
                            className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                          >
                            <CalendarDateRangeIcon className="w-5 h-5" />
                            {`Pay ₹${amount} Monthly Contribution`}
                          </button>
                        </div>
                        : (new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                          <div className="flex gap-3 mt-4 lg:mt-0">
                            <button
                              onClick={handleRazorpay}
                              className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                            >
                              <CalendarDateRangeIcon className="w-5 h-5" />
                              {`Pay ₹${yearlyAmount} Yearly Subscription Renewal`}
                            </button>
                          </div> :
                          <></>
                  }

                  <div className="flex gap-3 mt-4 lg:mt-0">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="cursor-pointer w-full md:w-auto px-6 py-3 border-2 border-green-600 rounded-xl bg-white text-green-600 text-sm font-semibold hover:bg-green-50 transition-all duration-300 flex items-center gap-2 justify-center">
                      <PhotoIcon className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <div className="text-sm font-semibold text-green-700 mb-1">Member ID</div>
                    <div className="text-lg font-bold text-green-900">{memberData?.memberId}</div>
                  </div>
                  <div className={`rounded-2xl p-4 text-center ${new Date(memberData?.memberShipExpiry) > new Date() ? 'bg-green-50' : 'bg-red-200'}`}>
                    <div className="text-sm font-semibold text-green-700 mb-1 flex items-center justify-center gap-1">
                      Monthly Contribution
                    </div>
                    <div className={"text-lg font-bold text-green-900"}>
                      {new Date(memberData?.memberShipExpiry) > new Date() ? 'Active' : 'In Active'}
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 text-center ${new Date(memberData?.yearlySubscriptionExpiry) > new Date() ? 'bg-green-50' : 'bg-red-200'}`}>
                    <div className="text-sm font-semibold text-green-700 mb-1">Membership</div>
                    <div className="text-lg font-bold text-green-900 capitalize">
                      {new Date(memberData?.yearlySubscriptionExpiry) > new Date() ? 'Active' : 'In Active'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 text-green-900">
                    <PhoneIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{memberData?.phone}</span>
                    <button onClick={() => setMobileModalOpen(true)} className="ml-1 cursor-pointer">
                      <PencilSquareIcon className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-green-900">
                    <MapPinIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{memberData?.address}</span>
                  </div>
                </div>

                {/* Download Certificate Button */}
                <div className="mt-6">
                  <button
                    onClick={generateJoiningLetter}
                    disabled={generatingCertificate}
                    className="cursor-pointer w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingCertificate ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <DocumentArrowDownIcon className="w-5 h-5" />
                    )}
                    {generatingCertificate ? 'Generating...' : 'Download Joining Letter'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl border border-green-200 mb-8 overflow-hidden">
          <div className="flex flex-col justify-evenly md:flex-row">
            {[
              { id: 'profile', label: 'Profile', icon: UserCircleIcon },
              { id: 'membership', label: 'Membership', icon: MdCardMembership },
              { id: 'monthlydonation', label: 'Monthly Contribution', icon: BiDonateHeart },
              { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
              { id: 'transactions', label: 'Transactions', icon: GrTransaction },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`cursor-pointer flex items-center gap-3 py-4 px-4 transition-all duration-300 border-l-4 md:border-l-0 md:border-b-2 ${activeTab === tab.id
                    ? 'border-green-600 text-green-900 bg-green-50'
                    : 'border-transparent text-green-700 hover:text-green-900 hover:bg-green-25'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-600' : 'text-green-500'
                    }`} />
                  <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-green-200 mb-8 overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-6 md:p-8">
              <h3 className="text-sm md:text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                <UserCircleIcon className="w-8 h-8 text-green-600" />
                Personal Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2 max-w-full">
                {[
                  { label: 'Full Name', value: memberData?.fullName, icon: UserCircleIcon },
                  { label: 'Email', value: memberData?.email, icon: EnvelopeIcon },
                  { label: 'Phone', value: memberData?.phone, icon: PhoneIcon },
                  { label: 'Address', value: memberData?.address, icon: MapPinIcon },
                ].map((field, index) => {
                  const FieldIcon = field.icon;
                  return (
                    <div key={field.label} className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FieldIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-green-700 mb-1">{field.label}</label>
                        <p className="text-green-900 font-medium">{field.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="p-6 md:p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-md md:text-2xl font-bold text-green-900 mb-8 flex items-center gap-3 justify-center">
                  <TrophyIcon className="w-8 h-8 text-green-600" />
                  Membership Details
                </h3>

                {/* Status Badge */}
                <div className="flex justify-center mb-8">
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-md md:text-lg font-semibold ${new Date(memberData?.yearlySubscriptionExpiry) > new Date()
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                    {memberData?.status === 'active' ? (
                      <CheckBadgeIcon className="w-6 h-6 mr-2" />
                    ) : (
                      <ClockIcon className="w-6 h-6 mr-2" />
                    )}
                    {new Date(memberData?.yearlySubscriptionExpiry) > new Date() ? 'Active' : 'Expired'}
                  </div>
                </div>

                {/* Date Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white rounded-2xl p-6 border border-green-300 text-center">
                    <CalendarIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <label className="block text-lg font-semibold text-green-700 mb-3">Start Date</label>
                    <p className="text-2xl font-bold text-green-900">
                      {dayjs(memberData?.yearlySubscriptionStart)?.format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-green-300 text-center">
                    <CalendarDaysIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <label className="block text-lg font-semibold text-green-700 mb-3">Expiry Date</label>
                    <p className="text-2xl font-bold text-green-900">
                      {dayjs(memberData?.yearlySubscriptionExpiry)?.format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {
                  new Date(memberData?.yearlySubscriptionExpiry) > new Date() ?
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="flex-1 max-w-xs px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3">
                        <CalendarDateRangeIcon className="w-5 h-5" />
                        {calculateYearlyDaysLeft()} days left
                      </button>
                    </div>
                    :
                    (new Date(memberData?.memberShipExpiry) < new Date() && new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                      <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                        <button
                          onClick={handleRazorpay}
                          className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                        >
                          <CalendarDateRangeIcon className="w-5 h-5" />
                          {`Pay ₹${amount + yearlyAmount} Monthly Contribution + Yearly Subscription Renewal`}
                        </button>
                      </div>
                      : (new Date(memberData?.memberShipExpiry) < new Date()) ?
                        <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                          <button
                            onClick={handleRazorpay}
                            className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                          >
                            <CalendarDateRangeIcon className="w-5 h-5" />
                            {`Pay ₹${amount} Monthly Contribution`}
                          </button>
                        </div>
                        : (new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                          <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                            <button
                              onClick={handleRazorpay}
                              className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                            >
                              <CalendarDateRangeIcon className="w-5 h-5" />
                              {`Pay ₹${yearlyAmount} Yearly Subscription Renewal`}
                            </button>
                          </div> :
                          <></>
                }
              </div>
            </div>
          )}
          {activeTab === 'monthlydonation' && (
            <div className="p-6 md:p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-sm md:text-2xl font-bold text-green-900 mb-8 flex items-center gap-3 justify-center">
                  <TrophyIcon className="w-8 h-8 text-green-600" />
                  Monthly Contribution Details
                </h3>

                {/* Status Badge */}
                <div className="flex justify-center mb-8">
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-md md:text-lg font-semibold ${new Date(memberData?.memberShipExpiry) > new Date()
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                    {memberData?.status === 'active' ? (
                      <CheckBadgeIcon className="w-6 h-6 mr-2" />
                    ) : (
                      <ClockIcon className="w-6 h-6 mr-2" />
                    )}
                    {new Date(memberData?.memberShipExpiry) > new Date() ? 'Paid' : 'Due'}
                  </div>
                </div>

                {memberData?.memberShipStartDate && <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-2 py-4 md:p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Donation</span>
                        <span className={`font-medium ${calculateDaysLeft() < 0 ? 'text-red-600' :
                          calculateDaysLeft() <= 7 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                          {calculateDaysLeft() < 0 ? 'Expired' : `${calculateDaysLeft()} days`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${calculateDaysLeft() < 0 ? 'bg-red-600' :
                            calculateDaysLeft() <= 7 ? 'bg-orange-500' :
                              calculateDaysLeft() <= 20 ? 'bg-yellow-500' : 'bg-green-600'
                            }`}
                          style={{
                            width: `${Math.max(0, Math.min(100, (calculateDaysLeft() / 30) * 100))}%`
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Start: {memberData?.memberShipStartDate ? dayjs(memberData?.memberShipStartDate).format("DD MMM YYYY") : 'N/A'}</span>
                        <span>Expiry: {dayjs(memberData?.memberShipExpiry).format("DD MMM YYYY")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                }

                {
                  new Date(memberData?.memberShipExpiry) > new Date() ?
                    <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                      <button className="flex-1 max-w-xs px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3">
                        <CalendarDateRangeIcon className="w-5 h-5" />
                        {calculateDaysLeft()} days left
                      </button>
                    </div>
                    :
                    (new Date(memberData?.memberShipExpiry) < new Date() && new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                      <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                        <button
                          onClick={handleRazorpay}
                          className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                        >
                          <CalendarDateRangeIcon className="w-5 h-5" />
                          {`Pay ₹${amount + yearlyAmount} Monthly Contribution + Yearly Subscription Renewal`}
                        </button>
                      </div>
                      : (new Date(memberData?.memberShipExpiry) < new Date()) ?
                        <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                          <button
                            onClick={handleRazorpay}
                            className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                          >
                            <CalendarDateRangeIcon className="w-5 h-5" />
                            {`Pay ₹${amount} Monthly Contribution`}
                          </button>
                        </div>
                        : (new Date(memberData?.yearlySubscriptionExpiry) < new Date()) ?
                          <div className="flex flex-col mt-8 sm:flex-row gap-2 md:gap-4 justify-center">
                            <button
                              onClick={handleRazorpay}
                              className="cursor-pointer w-full text-center md:w-auto px-6 py-3 border-2 border-red-600 rounded-xl bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 mr-0 md:mr-2 justify-center"
                            >
                              <CalendarDateRangeIcon className="w-5 h-5" />
                              {`Pay ₹${yearlyAmount} Yearly Subscription Renewal`}
                            </button>
                          </div> :
                          <></>

                }
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-md md:text-2xl font-bold text-green-900 mb-8 flex items-center gap-3 justify-center">
                  <DocumentTextIcon className="w-8 h-8 text-green-600" />
                  Document Verification
                </h3>

                {/* Verification Status */}
                <div className="flex justify-center mb-8">
                  <div className={`inline-flex items-center px-8 py-4 rounded-2xl text-sm md:text-lg font-semibold ${memberData?.documentVerified
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                    {memberData?.documentVerified ? (
                      <>
                        <CheckBadgeIcon className="w-6 h-6 mr-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <ClockIcon className="w-6 h-6 mr-3" />
                        Pending Verification
                      </>
                    )}
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* Document 1: Document */}
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-lg font-semibold text-green-700">Document</label>
                      <button
                        onClick={() => handleEditDocument('document')}
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {memberData?.document ? (
                      <div className="text-center">
                        {isImageFile(memberData?.document) ? (
                          <a href={memberData?.document} target="_blank" rel="noopener noreferrer" className="block">
                            <img
                              src={memberData?.document}
                              alt="Document"
                              className="w-full h-48 object-contain rounded-lg border border-green-200"
                            />
                          </a>
                        ) : isPdfFile(memberData?.document) ? (
                          <a
                            href={memberData?.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-green-100 text-green-800 px-4 py-3 rounded-lg hover:bg-green-200 cursor-pointer"
                          >
                            <DocumentIcon className="w-6 h-6 mr-2" />
                            View PDF Document
                          </a>
                        ) : (
                          <a
                            href={memberData?.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <DocumentIcon className="w-6 h-6 mr-2" />
                            View Document
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No document uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Document 2: Member Document */}
                  {/* <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-lg font-semibold text-green-700">Member Document</label>
                      <button
                        onClick={() => handleEditDocument('memberDocument')}
                        className="text-green-600 hover:text-black cursor-pointer"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {memberData?.memberDocument ? (
                      <div className="text-center">
                        {isImageFile(memberData?.memberDocument) ? (
                          <a href={memberData?.memberDocument} target="_blank" rel="noopener noreferrer" className="block">
                            <img
                              src={memberData?.memberDocument}
                              alt="Member Document"
                              className="w-full h-48 object-contain rounded-lg border border-blue-200"
                            />
                          </a>
                        ) : isPdfFile(memberData?.memberDocument) ? (
                          <a
                            href={memberData?.memberDocument}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-green-200 text-black px-4 py-3 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            <DocumentIcon className="w-6 h-6 mr-2" />
                            View PDF Document
                          </a>
                        ) : (
                          <a
                            href={memberData?.memberDocument}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <DocumentIcon className="w-6 h-6 mr-2" />
                            View Document
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No member document uploaded</p>
                      </div>
                    )}
                  </div> */}

                  {/* Document 3: Face Picture */}
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-lg font-semibold text-green-700">Face Picture</label>
                      <button
                        onClick={() => handleEditDocument('facePicture')}
                        className="text-green-600 hover:text-purple-800 cursor-pointer"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {memberData?.facePicture ? (
                      <div className="text-center">
                        <a href={memberData?.facePicture} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={memberData?.facePicture}
                            alt="Face Picture"
                            className="w-full h-48 object-contain rounded-lg border border-purple-200"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No face picture uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Document 4: Face Video */}
                  {/* <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-lg font-semibold text-green-700">Face Video</label>
                      <button
                        onClick={() => handleEditDocument('faceVideo')}
                        className="text-green-600 hover:text-red-800 cursor-pointer"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {memberData?.faceVideo ? (
                      <div className="text-center">
                        <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
                          <video
                            src={memberData?.faceVideo}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <VideoCameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No face video uploaded</p>
                      </div>
                    )}
                  </div> */}
                </div>

                {/* Document Type Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Document Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li><span className="font-medium">Document & Member Document:</span> PDF, JPG, PNG (Max 10MB)</li>
                    <li><span className="font-medium">Face Picture:</span> JPG, PNG (Max 10MB)</li>
                    <li><span className="font-medium">Face Video:</span> MP4, MOV, AVI, WEBM (Max 10MB)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && <MemberTransactions memberData={memberData} />};
        </div>

        {/* Community CTA */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <UserGroupIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-lg md:text-2xl md:text-3xl font-bold mb-4">Continue Your Journey</h3>
            <p className="text-green-100 text-sm md:text-lg mb-8 leading-relaxed">
              Stay engaged with our vibrant community and participate in exclusive events,
              workshops, and networking opportunities designed just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/post")}
                className="cursor-pointer px-8 py-4 bg-white text-green-700 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                <CalendarDaysIcon className="w-5 h-5" />
                View Activites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;