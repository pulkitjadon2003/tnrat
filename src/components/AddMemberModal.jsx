"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddMemberModal({
    modalOpen,
    setModalOpen,
    fetchMembers,
}) {
    const [formData, setFormData] = useState({
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
        alreadyMember: false,
        transactionId: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [documentFile, setDocumentFile] = useState(null);
    const [facePictureFile, setFacePictureFile] = useState(null);
    const [faceVideoFile, setFaceVideoFile] = useState(null);
    const [memberDocumentFile, setMemberDocumentFile] = useState(null);

    const documentRef = useRef(null);
    const facePictureRef = useRef(null);
    const faceVideoRef = useRef(null);
    const memberDocumentRef = useRef(null);

    const documentTypes = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID'];

    useEffect(() => {
        if (!modalOpen) {
            resetForm();
        }
    }, [modalOpen]);

    const resetForm = () => {
        setFormData({
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
        setErrors({});

        // Reset file inputs
        if (documentRef.current) documentRef.current.value = '';
        if (facePictureRef.current) facePictureRef.current.value = '';
        if (faceVideoRef.current) faceVideoRef.current.value = '';
        if (memberDocumentRef.current) memberDocumentRef.current.value = '';
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
            document: 10 * 1024 * 1024, // 10MB
            image: 10 * 1024 * 1024, // 10MB
            video: 10 * 1024 * 1024, // 10MB
            memberDoc: 10 * 1024 * 1024 // 10MB
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';

        if (!formData.documentType) newErrors.documentType = 'Document type is required';
        if (!formData.documentNumber.trim()) newErrors.documentNumber = 'Document number is required';

        // Required files for new member
        if (!documentFile) newErrors.document = 'Document is required';
        if (!facePictureFile) newErrors.image = 'Face picture is required';
        // if (!faceVideoFile) newErrors.video = 'Face video is required';
        // if (formData.alreadyMember && !memberDocumentFile) {
        //     newErrors.memberDoc = 'Existing member document is required when marking as already member';
        // }
        if (!formData.transactionId) newErrors.transactionId = 'Transaction ID is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadToCloudinary = async (file, folder) => {
        if (!file) return null;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "ctpn2xmb");
        fd.append("folder", folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
            method: "POST",
            body: fd,
        });

        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // const [
            //     facePhoto,
            //     document,
            // ] = await Promise.all([
            //     uploadToCloudinary(facePictureFile, "members/photos"),
            //     uploadToCloudinary(documentFile, "members/documents"),
            //     // uploadToCloudinary(faceVideoFile, "members/videos"),
            //     // uploadToCloudinary(memberDocumentFile, "members/documents"),
            // ]);

            const mediaData = new FormData();

            mediaData.append('photoFile', facePictureFile);
            mediaData.append('documentFile', documentFile);

            const mediaResult = await axios.post('/api/member/upload-member-document', mediaData);

            console.log('mediaResult', mediaResult);
            let uploadedFacePhoto = '';
            let uploadedDocumentFile = '';

            if (mediaResult?.data?.status === true) {
                uploadedFacePhoto = mediaResult?.data?.photoFileUrl;
                uploadedDocumentFile = mediaResult?.data?.documentFileUrl;
            } else {
                setErrors({ submit: mediaResult?.data?.message || 'Failed to create order' });
                toast.error(mediaResult?.data?.message || 'Failed to create order');
                setLoading(false);
                return;
            }

            const transactions = [{
                transactionId: formData?.transactionId,
                amount: "100",
                description: "Membership Joining Fee"
            }]

            const submitData = {
                fullName: formData?.fullName,
                email: formData?.email,
                phone: formData?.phone,
                transactions: transactions,
                address: formData?.address,
                password: formData?.password,
                joinReason: formData?.joinReason,
                documentType: formData?.documentType,
                documentNumber: formData?.documentNumber,
                alreadyMember: formData?.alreadyMember,
                document: uploadedDocumentFile,
                facePicture: uploadedFacePhoto,
                // faceVideo: videoFile,
                // memberDocument
            }

            const response = await axios.post('/api/member/create-member', submitData);

            if (response.data.status === true) {
                toast.success('Member added successfully');
                fetchMembers();
                setModalOpen(false);
                resetForm();
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error(error.response?.data?.message || 'Error adding member');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
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
                            Add New Member
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
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Id *</label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.transactionId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter reason for joining"
                            />
                        </div>


                        {/* File Upload Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
                                <select
                                    name="documentType"
                                    value={formData.documentType}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.documentType ? 'border-red-500' : 'border-gray-300'
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter document number"
                                />
                                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
                            </div>

                            {/* Document Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Document (PDF/Image) - Max 10MB *
                                </label>
                                <input
                                    ref={documentRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, 'document')}
                                    className={`cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.document ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}

                                {documentFile && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-sm text-gray-700">
                                            {documentFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile('document')}
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
                                    Face Picture (Image) - Max 10MB *
                                </label>
                                <input
                                    ref={facePictureRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, 'image')}
                                    className={`cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.image ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                                {facePictureFile && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-sm text-gray-700">
                                            {facePictureFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile('image')}
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
                                    Face Video - Max 10MB *
                                </label>
                                <input
                                    ref={faceVideoRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                    className={`cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.video ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video}</p>}

                                {faceVideoFile && (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-sm text-gray-700">
                                            {faceVideoFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile('video')}
                                            className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div> */}

                            {/* Already Member */}
                            {/* <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="alreadyMember"
                                    checked={formData.alreadyMember}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                                />
                                <label className="ml-2 text-sm text-gray-700">Already a Member</label>
                            </div> */}


                            {/* {
                                formData.alreadyMember && <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Old Member Document (PDF/Image) - Max 10MB
                                        {formData.alreadyMember && ' *'}
                                    </label>
                                    <input
                                        ref={memberDocumentRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'memberDoc')}
                                        className={`cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.memberDoc ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.memberDoc && <p className="text-red-500 text-xs mt-1">{errors.memberDoc}</p>}

                                    {memberDocumentFile && (
                                        <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                            <span className="text-sm text-gray-700">
                                                {memberDocumentFile.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('memberDoc')}
                                                className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>} */}
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
                                {loading ? 'Adding...' : 'Add Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}