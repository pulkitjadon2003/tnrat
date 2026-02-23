"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditMemberModal({
    modalOpen,
    setModalOpen,
    fetchMembers,
    selectedData,
    setSelectedData
}) {
    const [formData, setFormData] = useState({
        memberId: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        joinReason: '',
        documentType: '',
        documentNumber: '',
        status: 'pending',
        memberShipStartDate: '',
        memberShipExpiry: '',
        yearlySubscriptionStart: '',
        yearlySubscriptionExpiry: '',
        alreadyMember: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [documentFile, setDocumentFile] = useState(null);
    const [facePictureFile, setFacePictureFile] = useState(null);
    const [faceVideoFile, setFaceVideoFile] = useState(null);
    const [memberDocumentFile, setMemberDocumentFile] = useState(null);
    const [existingDocument, setExistingDocument] = useState('');
    const [existingFacePicture, setExistingFacePicture] = useState('');
    const [existingFaceVideo, setExistingFaceVideo] = useState('');
    const [existingMemberDocument, setExistingMemberDocument] = useState('');

    const documentRef = useRef(null);
    const facePictureRef = useRef(null);
    const faceVideoRef = useRef(null);
    const memberDocumentRef = useRef(null);

    const documentTypes = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID'];
    const statusOptions = ['pending', 'active', 'suspended', 'expired', 'cancelled'];

    useEffect(() => {
        if (selectedData) {
            // Format dates for input fields (yyyy-MM-dd)
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                memberId: selectedData?.memberId || '',
                fullName: selectedData?.fullName || '',
                email: selectedData?.email || '',
                phone: selectedData?.phone || '',
                address: selectedData?.address || '',
                joinReason: selectedData?.joinReason || '',
                documentType: selectedData?.documentType || '',
                documentNumber: selectedData?.documentNumber || '',
                status: selectedData?.status || 'pending',
                memberShipStartDate: formatDate(selectedData?.memberShipStartDate),
                memberShipExpiry: formatDate(selectedData?.memberShipExpiry),
                yearlySubscriptionStart: formatDate(selectedData?.yearlySubscriptionStart),
                yearlySubscriptionExpiry: formatDate(selectedData?.yearlySubscriptionExpiry),
                alreadyMember: selectedData?.alreadyMember || false
            });

            // Set existing file paths
            setExistingDocument(selectedData?.document || '');
            setExistingFacePicture(selectedData?.facePicture || '');
            setExistingFaceVideo(selectedData?.faceVideo || '');
            setExistingMemberDocument(selectedData?.memberDocument || '');

            // Reset new files
            setDocumentFile(null);
            setFacePictureFile(null);
            setFaceVideoFile(null);
            setMemberDocumentFile(null);
        } else {
            resetForm();
        }
    }, [selectedData, modalOpen]);

    const resetForm = () => {
        setFormData({
            memberId: '',
            fullName: '',
            email: '',
            phone: '',
            address: '',
            joinReason: '',
            documentType: '',
            documentNumber: '',
            status: 'pending',
            memberShipStartDate: '',
            memberShipExpiry: '',
            yearlySubscriptionStart: '',
            yearlySubscriptionExpiry: '',
            alreadyMember: false
        });
        setDocumentFile(null);
        setFacePictureFile(null);
        setFaceVideoFile(null);
        setMemberDocumentFile(null);
        setExistingDocument('');
        setExistingFacePicture('');
        setExistingFaceVideo('');
        setExistingMemberDocument('');
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileUpload = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        // File size validation
        const maxSize = {
            document: 10 * 1024 * 1024, // 5MB
            image: 10 * 1024 * 1024, // 5MB
            video: 10 * 1024 * 1024, // 50MB
            memberDoc: 10 * 1024 * 1024 // 5MB
        }[fileType];

        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                [fileType]: `File size must be less than ${maxSize / (1024 * 1024)}MB`
            }));
            return;
        }

        // File type validation
        const allowedTypes = {
            document: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
            image: ['image/jpeg', 'image/png', 'image/jpg'],
            video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
            memberDoc: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        }[fileType];

        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [fileType]: `Please upload a valid ${fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : 'document'} file`
            }));
            return;
        }

        // Set the file
        switch (fileType) {
            case 'document':
                setDocumentFile(file);
                break;
            case 'image':
                setFacePictureFile(file);
                break;
            case 'video':
                setFaceVideoFile(file);
                break;
            case 'memberDoc':
                setMemberDocumentFile(file);
                break;
        }

        // Clear error
        setErrors(prev => ({ ...prev, [fileType]: '' }));
    };

    const removeFile = (fileType) => {
        switch (fileType) {
            case 'document':
                setDocumentFile(null);
                if (documentRef.current) documentRef.current.value = '';
                break;
            case 'image':
                setFacePictureFile(null);
                if (facePictureRef.current) facePictureRef.current.value = '';
                break;
            case 'video':
                setFaceVideoFile(null);
                if (faceVideoRef.current) faceVideoRef.current.value = '';
                break;
            case 'memberDoc':
                setMemberDocumentFile(null);
                if (memberDocumentRef.current) memberDocumentRef.current.value = '';
                break;
        }
    };

    const removeExistingFile = (fileType) => {
        switch (fileType) {
            case 'document':
                setExistingDocument('');
                break;
            case 'image':
                setExistingFacePicture('');
                break;
            case 'video':
                setExistingFaceVideo('');
                break;
            case 'memberDoc':
                setExistingMemberDocument('');
                break;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';

        if (!formData.documentType) newErrors.documentType = 'Document type is required';
        if (!formData.documentNumber.trim()) newErrors.documentNumber = 'Document number is required';

        // Validate dates if provided
        if (formData.memberShipStartDate && formData.memberShipExpiry) {
            const start = new Date(formData.memberShipStartDate);
            const expiry = new Date(formData.memberShipExpiry);
            if (start >= expiry) newErrors.memberShipExpiry = 'Expiry date must be after start date';
        }

        if (formData.yearlySubscriptionStart && formData.yearlySubscriptionExpiry) {
            const start = new Date(formData.yearlySubscriptionStart);
            const expiry = new Date(formData.yearlySubscriptionExpiry);
            if (start >= expiry) newErrors.yearlySubscriptionExpiry = 'Expiry date must be after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const submitData = new FormData();

            // Append form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key]);
                }
            });

            // Append files if they exist
            if (documentFile) submitData.append('document', documentFile);
            if (facePictureFile) submitData.append('facePicture', facePictureFile);
            // if (faceVideoFile) submitData.append('faceVideo', faceVideoFile);
            // if (memberDocumentFile) submitData.append('memberDocument', memberDocumentFile);

            // Append existing file paths
            submitData.append('existingDocument', existingDocument);
            submitData.append('existingFacePicture', existingFacePicture);
            // submitData.append('existingFaceVideo', existingFaceVideo);
            // submitData.append('existingMemberDocument', existingMemberDocument);

            const url = `/api/member/update-member-by-admin?id=${selectedData?._id}`;

            const response = await axios.put(url, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === true) {
                toast.success('Member updated successfully');
                fetchMembers();
                setModalOpen(false);
                resetForm();
                setSelectedData(null);
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            toast.error(error.response?.data?.message || 'Error updating member');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedData(null);
        resetForm();
    };

    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Update Member
                        </h2>
                        <button
                            onClick={handleClose}
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Member ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                                <input
                                    type="text"
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 cursor-not-allowed bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Auto-generated"
                                    disabled
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Document Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
                                <select
                                    name="documentType"
                                    value={formData.documentType}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.documentType ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select Document Type</option>
                                    {documentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
                            </div>

                            {/* Document Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Number *</label>
                                <input
                                    type="text"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter document number"
                                />
                                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
                            </div>

                            {/* Status */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div> */}

                            {/* Already Member */}
                            {/* <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="alreadyMember"
                                    checked={formData.alreadyMember}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-700">Already a Member</label>
                            </div> */}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter address"
                            />
                        </div>

                        {/* Join Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Joining</label>
                            <textarea
                                name="joinReason"
                                value={formData.joinReason}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter reason for joining"
                            />
                        </div>

                        {/* Membership Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Start Date</label>
                                <input
                                    type="date"
                                    name="memberShipStartDate"
                                    value={formData.memberShipStartDate}
                                    onChange={handleInputChange}
                                    className="cursor-not-allowed bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    // disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Expiry Date</label>
                                <input
                                    type="date"
                                    name="memberShipExpiry"
                                    value={formData.memberShipExpiry}
                                    onChange={handleInputChange}
                                    className={`cursor-not-allowed bg-gray-50 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.memberShipExpiry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        // disabled
                               />
                                {errors.memberShipExpiry && <p className="text-red-500 text-xs mt-1">{errors.memberShipExpiry}</p>}
                            </div>
                        </div>

                        {/* Yearly Subscription Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Subscription Start</label>
                                <input
                                    type="date"
                                    name="yearlySubscriptionStart"
                                    value={formData.yearlySubscriptionStart}
                                    onChange={handleInputChange}
                                    className="cursor-not-allowed bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        // disabled
                               />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Subscription Expiry</label>
                                <input
                                    type="date"
                                    name="yearlySubscriptionExpiry"
                                    value={formData.yearlySubscriptionExpiry}
                                    onChange={handleInputChange}
                                    className={`cursor-not-allowed bg-gray-50 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.yearlySubscriptionExpiry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        // disabled
                                />
                                {errors.yearlySubscriptionExpiry && <p className="text-red-500 text-xs mt-1">{errors.yearlySubscriptionExpiry}</p>}
                            </div>
                        </div>

                        {/* File Upload Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Document Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Document (PDF/Image) - Max 10MB
                                </label>
                                <input
                                    ref={documentRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, 'document')}
                                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}

                                {(documentFile || existingDocument) && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        {documentFile ?
                                            <span className="text-sm text-gray-700">
                                                {documentFile?.name}
                                            </span> :
                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-600">Identity Document</label>
                                                <div className="mt-2">
                                                    <a
                                                        href={existingDocument}
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
                                        }


                                        <button
                                            type="button"
                                            onClick={() => documentFile ? removeFile('document') : removeExistingFile('document')}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Face Picture Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Face Picture (Image) - Max 10MB
                                </label>
                                <input
                                    ref={facePictureRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, 'image')}
                                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                                {(facePictureFile || existingFacePicture) && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        {facePictureFile ?
                                            <span className="text-sm text-gray-700">
                                                {facePictureFile?.name}
                                            </span> :
                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-600">Face Picture</label>
                                                <div className="mt-2">
                                                    <a
                                                        href={existingFacePicture}
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
                                        }
                                        <button
                                            type="button"
                                            onClick={() => facePictureFile ? removeFile('image') : removeExistingFile('image')}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Face Video Upload */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Face Video - Max 10MB
                                </label>
                                <input
                                    ref={faceVideoRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video}</p>}

                                {(faceVideoFile || existingFaceVideo) && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        {faceVideoFile ?
                                            <span className="text-sm text-gray-700">
                                                {faceVideoFile?.name}
                                            </span> :
                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-600">Face Video</label>
                                                <div className="mt-2">
                                                    <a
                                                        href={existingFaceVideo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-150"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View Video
                                                    </a>
                                                </div>
                                            </div>
                                        }
                                        <button
                                            type="button"
                                            onClick={() => faceVideoFile ? removeFile('video') : removeExistingFile('video')}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div> */}

                            {/* Member Document Upload */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Existing Member Document (PDF/Image) - Max 10MB
                                </label>
                                <input
                                    ref={memberDocumentRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, 'memberDoc')}
                                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.memberDoc && <p className="text-red-500 text-xs mt-1">{errors.memberDoc}</p>}

                                {(memberDocumentFile || existingMemberDocument) && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        {memberDocumentFile ?
                                            <span className="text-sm text-gray-700">
                                                {memberDocumentFile?.name}
                                            </span> :
                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-600">Existing Member Document</label>
                                                <div className="mt-2">
                                                    <a
                                                        href={existingMemberDocument}
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
                                        }
                                        <button
                                            type="button"
                                            onClick={() => memberDocumentFile ? removeFile('memberDoc') : removeExistingFile('memberDoc')}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div> */}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Updating...' : 'Update Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}