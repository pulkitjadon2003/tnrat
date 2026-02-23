"use client";

import OtpVerificationModal from '@/components/OtpVerificationModal';
import ShowSuccessPopup from '@/components/ShowSuccessPopup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BecomeMember() {
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationBackdrop, setShowVerificationBackdrop] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    joinReason: '',
    documentType: '',
    documentNumber: '',
    alreadyMember: '',
    documentFile: null,
    photoFile: null,
    videoFile: null,
    memberDocument: null, // New field for member document
    // membershipMonths: 1
  });

  const [errors, setErrors] = useState({});

  const fetchGlobal = async () => {
    try {
      const res = await axios.get('/api/global');

      const result = res?.data;

      if (result?.status === true) {
        setAmount(result?.global?.memberEntryFee || 0);
      }
    } catch (error) {
      console.error('Error fetching current platform fee:', error);
    }
  }

  useEffect(() => {
    fetchGlobal();
  }, []);

  const benefits = [
    {
      title: "Community Access",
      description: "Join our growing network"
    },
    {
      title: "Event Participation",
      description: "Access exclusive events"
    },
    {
      title: "Regular Updates",
      description: "Stay informed always"
    },
    {
      title: "Volunteer Opportunities",
      description: "Make real impact"
    }
  ];

  const documentTypes = [
    "Aadhar Card",
    "PAN Card",
    "Driving License",
    "Voter ID",
    "Passport"
  ];

  // File size validation constants
  const FILE_SIZE_LIMITS = {
    document: 10 * 1024 * 1024, // 2MB
    photo: 10 * 1024 * 1024,    // 2MB
    video: 10 * 1024 * 1024,   // 10MB
    memberDocument: 10 * 1024 * 1024, // 2MB for member document
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);

    try {
      const response = await axios.post('/api/member/send-otp', {
        phone: formData?.phone,
        email: formData?.email
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
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData?.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData?.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData?.joinReason.trim()) {
      newErrors.joinReason = 'Please tell us why you want to join';
    }

    // if (!formData?.alreadyMember) {
    //   newErrors.alreadyMember = 'Please select an option';
    // }

    // Validate member document if user is already a member
    // if (formData?.alreadyMember === 'true' && !formData?.memberDocument) {
    //   newErrors.memberDocument = 'Please upload your old membership document';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData?.documentType) {
      newErrors.documentType = 'Please select a document type';
    }

    if (!formData?.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required';
    }

    if (!formData?.documentFile) {
      newErrors.documentFile = 'Please upload a document';
    } else if (formData?.documentFile.size > FILE_SIZE_LIMITS.document) {
      newErrors.documentFile = 'Document file size must be less than 10MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData?.photoFile) {
      newErrors.photoFile = 'Please upload a clear face photo';
    } else if (formData?.photoFile.size > FILE_SIZE_LIMITS.photo) {
      newErrors.photoFile = 'Photo file size must be less than 10MB';
    }

    // if (!formData?.videoFile) {
    //   newErrors.videoFile = 'Please upload a clear face video';
    // } else if (formData?.videoFile.size > FILE_SIZE_LIMITS.video) {
    //   newErrors.videoFile = 'Video file size must be less than 10MB';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const nextStep = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1()
      if (isValid && otpVerified === false) {
        handleSendOtp();
        return;
      }
    };
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size based on field type
      let sizeLimit = FILE_SIZE_LIMITS.document;
      let sizeError = '';

      if (fieldName === 'photoFile') {
        sizeLimit = FILE_SIZE_LIMITS.photo;
        if (file.size > sizeLimit) {
          sizeError = 'Photo file size must be less than 10MB';
        }
      } else if (fieldName === 'videoFile') {
        sizeLimit = FILE_SIZE_LIMITS.video;
        if (file.size > sizeLimit) {
          sizeError = 'Video file size must be less than 10MB';
        }
      } else if (fieldName === 'documentFile') {
        if (file.size > sizeLimit) {
          sizeError = 'Document file size must be less than 10MB';
        }
      } else if (fieldName === 'memberDocument') {
        sizeLimit = FILE_SIZE_LIMITS.memberDocument;
        if (file.size > sizeLimit) {
          sizeError = 'Member document file size must be less than 10MB';
        }
        // Validate file type for member document (PDF only)
        // if (file.type !== 'application/pdf') {
        //   sizeError = 'Member document must be a PDF file';
        // }
      }

      if (sizeError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: sizeError
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setIsLoading(true);

    let result;
    try {

      // const [
      //   facePhoto,
      //   documentFile,
      // ] = await Promise.all([
      //   uploadToCloudinary(formData?.photoFile, "members/photos"),
      //   uploadToCloudinary(formData?.documentFile, "members/documents"),
      // ]);
      const mediaData = new FormData();

      mediaData.append('photoFile', formData?.photoFile);
      mediaData.append('documentFile', formData?.documentFile);

      const mediaResult = await axios.post('/api/member/upload-member-document', mediaData);

      console.log('mediaResult', mediaResult);
      let facePhoto = '';
      let documentFile = '';

      if (mediaResult?.data?.status === true) {
        facePhoto = mediaResult?.data?.photoFileUrl;
        documentFile = mediaResult?.data?.documentFileUrl;
      } else {
        setErrors({ submit: mediaResult?.data?.response?.data?.message || 'Failed to create order' })
        toast.error(mediaResult?.data?.response?.data?.message || 'Failed to create order');
        setIsLoading(false);
        return;
      }

      const payload = {
        amount: amount,
        fullName: formData?.fullName,
        phone: formData?.phone,
        email: formData?.email,
        address: formData?.address,
        password: formData?.password,
        joinReason: formData?.joinReason,
        documentType: formData?.documentType,
        documentNumber: formData?.documentNumber,
        // alreadyMember: formData?.alreadyMember,
        document: documentFile,
        facePicture: facePhoto,
        // faceVideo: videoFile,
        // memberDocument: memberDocument
      };


      result = await axios.post('/api/member/create-order', payload);

      if (result?.data?.status === false) {
        setErrors({ submit: result?.response?.data?.message || 'Failed to create order' });
        toast.error(result?.response?.data?.message || 'Failed to create order');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ submit: error?.response?.data?.message || 'Failed to create order' });
      toast.error(error?.response?.data?.message || 'Failed to create order');
      setIsLoading(false);
      return;
    }

    const order = result?.data?.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: "TNRAT",
      description: "TNRAT Membership Payment",
      order_id: order?.id,
      handler: async function (response) {
        try {

          setShowVerificationBackdrop(true);

          const payload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verification = await axios.post('/api/member/verify-member-transaction', payload);

          if (verification?.data?.status === true) {
            toast.success("Payment Successful");
            setMemberId(payload?.razorpay_payment_id)
            setShowSuccessPopup(true);

            setFormData({
              fullName: '',
              phone: '',
              email: '',
              address: '',
              password: '',
              alreadyMember: '',
              joinReason: '',
              documentType: '',
              documentNumber: '',
              documentFile: null,
              photoFile: null,
              // videoFile: null,
              // memberDocument: null
            });

            setCurrentStep(1);
            setOtpVerified(false);
            setShowVerificationBackdrop(false);
            setIsLoading(false);
          } else {
            setErrors({ submit: verification?.response?.data?.message || 'Failed to submit application. Please try again.' });
          }
        } catch (error) {
          console.error("Payment Verification Error:", error);
          toast.error("Payment Verification Error");
          setPaymentFailed(true);
        } finally {
          setShowVerificationBackdrop(false);
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        }
      },
      prefill: {
        name: formData?.fullName || "TNRAT",
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

  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (validateStep3()) {
      setIsLoading(true);

      handleRazorpay();
    }
  };


  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Become a Member</h1>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Join our community and be part of meaningful change. Start your journey with us today.
          </p>
        </div>


        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 ${currentStep >= step
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
                  } transition-all duration-300`}>
                  {currentStep > step ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span className={`text-xs md:text-sm mt-3 font-medium ${currentStep >= step ? 'text-green-600' : 'text-gray-500'
                  }`}>

                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Documents'}
                  {step === 3 && 'Verification'}
                  {step === 4 && 'Payment'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-green-300 rounded-2xl p-4 md:p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Personal Information</h2>
                <p className="text-gray-600 mt-2">Please provide your basic details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors?.fullName && <p className="text-red-500 text-sm mt-1">{errors?.fullName}</p>}
                </div>

                {/* <div>
                  <label className="block text-black mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors?.phone}</p>}
                </div> */}

                <div>
                  <label className="block text-black mb-2 font-medium">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData?.phone}
                      onChange={handleInputChange}
                      className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.phone ? 'border-red-500' : 'border-gray-300'
                        } ${otpVerified ? 'pr-10' : ''}`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {otpVerified && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded border border-green-300">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors?.phone}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email address"
                  />
                  {errors?.email && <p className="text-red-500 text-sm mt-1">{errors?.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData?.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 ${errors?.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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
                  {errors?.password && <p className="text-red-500 text-sm mt-1">{errors?.password}</p>}
                </div>
              </div>

              <div>
                <label className="block text-black mb-2 font-medium">Address *</label>
                <textarea
                  name="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your complete address"
                />
                {errors?.address && <p className="text-red-500 text-sm mt-1">{errors?.address}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* <div>
                  <label className="block text-black mb-2 font-medium">Are you already a member of TNRAT? *</label>
                  <select
                    name="alreadyMember"
                    value={formData?.alreadyMember}
                    onChange={handleInputChange}
                    className={`cursor-pointer w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.alreadyMember ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select an option</option>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {errors?.alreadyMember && <p className="text-red-500 text-sm mt-1">{errors?.alreadyMember}</p>}
                </div> */}

                <div>
                  <label className="block text-black mb-2 font-medium">Why join TNRAT? *</label>
                  <input
                    type="text"
                    name="joinReason"
                    value={formData?.joinReason}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.joinReason ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Your motivation to join"
                  />
                  {errors?.joinReason && <p className="text-red-500 text-sm mt-1">{errors?.joinReason}</p>}
                </div>
              </div>

              {/* Member Document Upload - Only shown when user selects "Yes" */}
              {/* {formData?.alreadyMember === 'true' && (
                <div>
                  <label className="block text-black mb-2 font-medium">Upload your old joining letter *</label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-300 ${errors?.memberDocument ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400'
                    }`}>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'memberDocument')}
                      className="hidden"
                      id="member-document-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="member-document-upload" className="cursor-pointer">
                      <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 font-medium">Click to upload old joining letter</p>
                      <p className="text-gray-500 text-sm mt-1">PDF, PNG, JPG file up to 10MB</p>
                      {formData?.memberDocument && (
                        <div className="mt-2">
                          <p className="text-green-600 text-sm font-medium">
                            ✓ {formData?.memberDocument.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Size: {formatFileSize(formData?.memberDocument.size)}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors?.memberDocument && <p className="text-red-500 text-sm mt-2">{errors?.memberDocument}</p>}
                  <p className="text-gray-600 text-sm mt-2">
                    Please upload your TNRAT membership document/certificate in PDF format.
                  </p>
                </div>
              )} */}

              {/* <div className="flex justify-end pt-6">
                <button
                  onClick={nextStep}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center cursor-pointer"
                >
                  Next Step
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div> */}

              <div className="flex justify-end pt-6">
                <button
                  onClick={nextStep}
                  disabled={isSendingOtp}
                  className="bg-green-600 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </div>
                  ) : (
                    <>
                      Next Step
                      <svg className="w-4 sm:w-5 h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Document Verification</h2>
                <p className="text-gray-600 mt-2">Upload your identity documents</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black mb-2 font-medium">Document Type *</label>
                  <select
                    name="documentType"
                    value={formData?.documentType}
                    onChange={handleInputChange}
                    className={`w-full cursor-pointer text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.documentType ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors?.documentType && <p className="text-red-500 text-sm mt-1">{errors?.documentType}</p>}
                </div>

                <div>
                  <label className="block text-black mb-2 font-medium">Document Number *</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData?.documentNumber}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors?.documentNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter document number"
                  />
                  {errors?.documentNumber && <p className="text-red-500 text-sm mt-1">{errors?.documentNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-black mb-2 font-medium">Upload Document *</label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ${errors?.documentFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400'
                  }`}>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'documentFile')}
                    className="hidden"
                    id="document-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 font-medium">Click to upload document</p>
                    <p className="text-gray-500 text-sm mt-2">PDF, JPG, PNG up to 10MB</p>
                    {formData?.documentFile && (
                      <div className="mt-2">
                        <p className="text-green-600 text-sm font-medium">
                          ✓ {formData?.documentFile.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Size: {formatFileSize(formData?.documentFile.size)}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors?.documentFile && <p className="text-red-500 text-sm mt-2">{errors?.documentFile}</p>}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>Note:</strong> All documents will be verified within 2-3 business days. Please ensure documents are clear and valid.
                  <br /><strong>File size limit:</strong> 10MB maximum for documents
                </p>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-green-600 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <svg className="w-4 sm:w-5 h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Photo & Video Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Photo Verification</h2>
                <p className="text-gray-600 mt-2">Complete your identity verification</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black mb-2 font-medium">Upload Clear Face Photo *</label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-300 ${errors?.photoFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400'
                    }`}>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'photoFile')}
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Upload face photo</p>
                      <p className="text-gray-500 text-sm mt-1">JPG, PNG up to 10MB</p>
                      {formData?.photoFile && (
                        <div className="mt-2">
                          <p className="text-green-600 text-sm font-medium">
                            ✓ {formData?.photoFile.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Size: {formatFileSize(formData?.photoFile.size)}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors?.photoFile && <p className="text-red-500 text-sm mt-2">{errors?.photoFile}</p>}
                </div>

                {/* <div>
                  <label className="block text-black mb-2 font-medium">Upload Clear Face Video *</label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-300 ${errors?.videoFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400'
                    }`}>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'videoFile')}
                      accept="video/*"
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Upload face video</p>
                      <p className="text-gray-500 text-sm mt-1">MP4 up to 10MB, 30 seconds</p>
                      {formData?.videoFile && (
                        <div className="mt-2">
                          <p className="text-green-600 text-sm font-medium">
                            ✓ {formData?.videoFile.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Size: {formatFileSize(formData?.videoFile.size)}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors?.videoFile && <p className="text-red-500 text-sm mt-2">{errors?.videoFile}</p>}
                </div> */}
              </div>

              {errors?.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errors?.submit}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Requirements:</strong>
                  <br />• Face should be clearly visible in good lighting
                  {/* <br />• Video should be 30 seconds maximum */}
                  <br />• <strong>File size limits:</strong> Photo - 10MB
                </p>
              </div>


              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-green-600 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <svg className="w-4 sm:w-5 h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payment</h2>
                <p className="text-gray-600 mt-2">Complete your membership registration</p>
              </div>

              {/* Month Selection */}
              {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
                <label className="block text-black mb-4 font-medium text-lg">
                  Select Membership Duration
                </label>
                <select
                  name="membershipMonths"
                  value={formData?.membershipMonths || 1}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month} Month{month > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-gray-600 text-sm mt-2">
                  Select how many months you want to pay for
                </p>
              </div> */}

              {/* Order Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Joining Fee</span>
                    <span className="text-gray-800 font-medium">{formatIndianRupees(amount)}</span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-gray-800 font-medium">
                      {formData?.membershipMonths || 1} Month{(formData?.membershipMonths || 1) > 1 ? 's' : ''}
                    </span>
                  </div> */}
                  {/* <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatIndianRupees(amount * (formData?.membershipMonths || 1))}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Rest of the payment section remains the same */}
              <div className="mb-6">
                <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="bg-white border-2 border-green-500 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-semibold text-gray-800">Razorpay</p>
                        <p className="text-xs md:text-sm text-gray-600">Secure payment gateway</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-500">Powered by</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-800">Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-green-800 text-xs md:text-sm">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>

              {errors?.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errors?.submit}</p>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 flex items-center cursor-pointer"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <svg className="w-4 md:w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Pay {formatIndianRupees(amount)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {showOtpModal && <OtpVerificationModal
        phone={formData.phone}
        isSendingOtp={isSendingOtp}
        setIsSendingOtp={setIsSendingOtp}
        setOtpVerified={setOtpVerified}
        setShowOtpModal={setShowOtpModal}
        setCurrentStep={setCurrentStep}
      />}


      <ShowSuccessPopup
        showSuccessPopup={showSuccessPopup}
        setShowSuccessPopup={setShowSuccessPopup}
        membershipId={memberId}
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
                      If amount was debited, our system will automatically verify and create your account in a few minutes, so please do not worry.
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

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Spinner */}
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
              </div>

              {/* Verification Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Uploading documents
              </h3>
              <p className="text-gray-600 mb-6">
                Please wait while we upload your documents. This may take a upto 2 minutes...
              </p>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Backdrop */}
      {showVerificationBackdrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Spinner */}
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
              </div>

              {/* Verification Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Verifying Payment
              </h3>
              <p className="text-gray-600 mb-6">
                Please wait while we verify your payment. This may take a upto 2 minutes...
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Received</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verifying Transaction</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completing Registration</span>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}