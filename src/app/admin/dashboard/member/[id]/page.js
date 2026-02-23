"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { FaCopy, FaExternalLinkAlt, FaWhatsapp, FaSpinner } from 'react-icons/fa';

export default function MemberDetail() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('facePicture');
  const [generating, setGenerating] = useState(false);
  const [link, setLink] = useState(null);
  const [amt, setAmt] = useState(0);
  const [plan, setPlan] = useState('');


  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/member/get-member?id=${params.id}`);
      const result = res?.data;

      if (result?.status === true) {
        setMember(result?.member);
      }
    } catch (error) {
      console.error("Error fetching member:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await axios.put(`/api/member/update-member`, {
        id: params.id,
        status: newStatus,
        isStatusChange: true
      });

      if (res?.data?.status === true) {
        setMember(res?.data?.member);
      }
    } catch (error) {
      console.error("Error updating member status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleDocumentVerification = async () => {
    try {
      setUpdating(true);
      const res = await axios.put(`/api/member/update-member`, {
        id: params.id,
        documentVerified: !member?.documentVerified
      });

      if (res?.data?.status === true) {
        setMember(prev => ({ ...prev, documentVerified: !prev?.documentVerified }));
      }
    } catch (error) {
      console.error("Error updating document verification:", error);
    } finally {
      setUpdating(false);
    }
  };



  useEffect(() => {
    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Member not found</p>
      </div>
    );
  }

  const formatINRCurrency = (amount) => {
    const number = Number(amount);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: number % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  // Add this function to calculate days left (place it near the formatINRCurrency function)
  const calculateDaysLeft = () => {
    if (!member?.memberShipExpiry) return null;

    const expiryDate = dayjs(member.memberShipExpiry);
    const today = dayjs();
    const daysLeft = expiryDate.diff(today, 'day');

    return daysLeft;
  };


  const calculateDaysLeftYearly = () => {
    if (!member?.yearlySubscriptionExpiry) return null;

    const expiryDate = dayjs(member.yearlySubscriptionExpiry);
    const today = dayjs();
    const daysLeft = expiryDate.diff(today, 'day');

    return daysLeft;
  };

  const handleGeneratePaymentLink = async () => {
    try {
      setGenerating(true);

      const res = await axios.post('/api/member/generate-payment-link', { id: params.id });

      if (res?.data?.status === true) {
        setLink(`https://tnrat.com/payment/${res?.data?.token}`);
        setPlan(res?.data?.plan);
        setAmt(res?.data?.amount);
      } else {
        toast.error(res?.data?.message || "Error generating payment link");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error generating payment link");
      console.error("Error generating payment link:", error);
    } finally {
      setGenerating(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Member Details</h1>
          <p className="text-gray-600">Manage member information and status</p>
        </div>
        <button
          onClick={() => router.back()}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
        >
          Back to Members
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Member ID</label>
                  <p className="text-gray-900 mt-1">{member?.memberId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900 mt-1">{member?.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{member?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900 mt-1">{member?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-gray-900 mt-1">{dayjs(member?.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${member?.status === 'active' ? 'bg-green-100 text-green-800' :
                      member?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {member?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900 mt-1">{member?.address || "Not provided"}</p>
                </div>
                <div>
                  {link ? (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Payment Link</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full flex-1 flex items-center text-black border border-gray-300 rounded-lg px-3 py-2">
                            <span className="truncate text-sm flex-1">{link}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(link);
                                toast.success('Link copied to clipboard');
                              }}
                              className="cursor-pointer ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                              title="Copy to clipboard"
                            >
                              <FaCopy className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const whatsappUrl = `https://wa.me/${member.phone}?text=${encodeURIComponent(`अस्सलामु अलैकुम,
                                आपकी ${plan} अवधि समाप्त हो चुकी है।
                                कृपया ₹${amt} जमा कर के अपनी सदस्यता चालू रखें। : ${link}`)}`;
                                window.open(whatsappUrl, '_blank');
                              }}
                              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <FaWhatsapp className="w-4 h-4" />
                              <span>Send</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <button
                      className={`flex items-center justify-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={handleGeneratePaymentLink}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate payment link'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Member Document Section - Only show if member is already a member */}
          {/* {member?.alreadyMember && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Existing Membership Document</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member Document Status</p>
                    <p className={`text-sm font-medium mt-1 ${member?.memberDocument ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                      {member?.memberDocument ? 'Document Uploaded' : 'No Document Uploaded'}
                    </p>
                  </div>

                  {member?.memberDocument && (
                    <div className="flex items-center gap-3">
                      <a
                        href={member.memberDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-150"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Document
                      </a>
                      <a
                        href={member.memberDocument}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </a>
                    </div>
                  )}
                </div>

                {!member?.memberDocument && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">No Membership Document</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This member claimed to be an existing member but didn't upload a membership document.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Document Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Document Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Document Type</label>
                  <p className="text-gray-900 mt-1">{member?.documentType || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Document Number</label>
                  <p className="text-gray-900 mt-1">{member?.documentNumber || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Join Reason</label>
                  <p className="text-gray-900 mt-1">{member?.joinReason || "Not provided"}</p>
                </div>
              </div>

              {/* Document Actions */}
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Document Verified: </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${member?.documentVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {member?.documentVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <button
                  onClick={toggleDocumentVerification}
                  disabled={updating}
                  className="px-4 py-2 border border-gray-200 text-sm font-medium text-black bg-white-600 rounded-lg hover:bg-green-200 disabled:opacity-50 transition duration-150 cursor-pointer"
                >
                  {updating ? 'Updating...' : member?.documentVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                </button>
              </div>

              {/* Document Preview */}
              {member?.document && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Identity Document</label>
                  <div className="mt-2">
                    <a
                      href={member.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-150"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Membership Progress Bar - Add this above the Member Summary section */}
          {member?.memberShipStartDate && <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Membership Progress</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Contribution Status</span>
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
                  <span>Start: {member?.memberShipStartDate ? dayjs(member.memberShipStartDate).format("DD MMM YYYY") : 'N/A'}</span>
                  <span>Expiry: {dayjs(member.memberShipExpiry).format("DD MMM YYYY")}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Yearly Subscription Days Remaining</span>
                  <span className={`font-medium ${calculateDaysLeftYearly() < 0 ? 'text-red-600' :
                    calculateDaysLeftYearly() <= 7 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                    {calculateDaysLeftYearly() < 0 ? 'Expired' : `${calculateDaysLeftYearly()} days`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${calculateDaysLeftYearly() < 0 ? 'bg-red-600' :
                      calculateDaysLeftYearly() <= 7 ? 'bg-orange-500' :
                        calculateDaysLeftYearly() <= 30 ? 'bg-yellow-500' : 'bg-green-600'
                      }`}
                    style={{
                      width: `${Math.max(0, Math.min(100, (calculateDaysLeftYearly() / 365) * 100))}%`
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start: {member?.yearlySubscriptionStart ? dayjs(member.yearlySubscriptionStart).format("DD MMM YYYY") : 'N/A'}</span>
                  <span>Expiry: {dayjs(member.yearlySubscriptionExpiry).format("DD MMM YYYY")}</span>
                </div>
              </div>
            </div>
          </div>}

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Payment Information</h2>
              </div>

              <div className="p-6">
                {member?.transactions && member?.transactions?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      {/* Table Header */}
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody className="bg-white divide-y divide-gray-200">
                        {member.transactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {transaction?.transactionId || "Not provided"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {formatINRCurrency(transaction?.amount) || "Not provided"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                              {transaction?.description || "Not provided"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction?.date ? dayjs(transaction.date).format("DD MMM YYYY") : "Not provided"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Media and Actions */}
        <div className="space-y-6">
          {/* Face Media */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Face Verification</h2>
            </div>
            <div className="p-6">
              {/* Media Tabs */}
              {/* <div className="flex border-b border-gray-200 mb-4"> */}
              {/* <button
                  onClick={() => setActiveMediaTab('facePicture')}
                  className={`flex-1 py-2 px-3 text-sm font-medium border-b-2 transition duration-150 cursor-pointer ${activeMediaTab === 'facePicture'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Photo
                </button> */}
              {/* <button
                  onClick={() => setActiveMediaTab('faceVideo')}
                  className={`flex-1 py-2 px-3 text-sm font-medium border-b-2 transition duration-150 cursor-pointer ${activeMediaTab === 'faceVideo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Video
                </button> */}
              {/* </div> */}

              {/* Media Content */}
              <div className="rounded-lg bg-gray-50 border border-gray-200">
                {activeMediaTab === 'facePicture' ? (
                  member?.facePicture ? (
                    <div className="p-4">
                      <img
                        src={member.facePicture}
                        alt="Face Picture"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="mt-3 flex justify-center">
                        <a
                          href={member.facePicture}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No face picture uploaded</p>
                    </div>
                  )
                ) : (
                  member?.faceVideo ? (
                    <div className="p-4">
                      <video
                        controls
                        className="w-full h-64 object-cover rounded-lg bg-black"
                      >
                        <source src={member.faceVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="mt-3 flex justify-center">
                        <a
                          href={member.faceVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Download Video
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No face video uploaded</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Status Management</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
                  { value: 'inactive', label: 'Inactive', color: 'bg-red-100 text-red-800' }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateMemberStatus(status?.value)}
                    disabled={updating || member?.status === status?.value}
                    className={`w-full border border-gray-200 px-4 py-3 text-sm font-medium rounded-lg transition duration-150 flex items-center justify-between cursor-pointer ${member?.status === status.value
                      ? 'bg-green-600 text-white'
                      : 'bg-white-100 text-gray-700 hover:bg-gray-200'
                      } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{status.label}</span>
                    {member?.status === status?.value && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Current Status Display */}
              <div className={`mt-4 p-3 rounded-lg ${member?.status === "pending" ? 'bg-yellow-100 text-yellow-800' :
                member?.status === "active" ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                <p className="text-sm">Current Status</p>
                <p className="text-lg font-semibold capitalize">{member?.status}</p>
              </div>
            </div>
          </div>


          {/* Member Summary */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Member Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Document Verified</span>
                  <span className={`text-sm font-medium ${member?.documentVerified ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {member?.documentVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Face Photo</span>
                  <span className={`text-sm font-medium ${member?.facePicture ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {member?.facePicture ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Face Video</span>
                  <span className={`text-sm font-medium ${member?.faceVideo ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {member?.faceVideo ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Existing Member</span>
                  <span className={`text-sm font-medium ${member?.alreadyMember ? 'text-green-600' : 'text-gray-600'
                    }`}>
                    {member?.alreadyMember ? 'Yes' : 'No'}
                  </span>
                </div> */}
                {member?.alreadyMember && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member Document</span>
                    <span className={`text-sm font-medium ${member?.memberDocument ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {member?.memberDocument ? 'Uploaded' : 'Not Uploaded'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(member?.createdAt).format("DD MMM YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}