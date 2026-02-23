"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlices";


const UpdateDocuments = ({ showEditModal, setShowEditModal, selectedFile, setSelectedFile, editingDocument }) => {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const [isUploading, setIsUploading] = useState(false);

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

        if (showEditModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showEditModal]);

    if (!showEditModal) return null;


    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            toast.error(`File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            e.target.value = '';
            setSelectedFile(null);
            return;
        }

        // Check file type based on document type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const acceptTypes = getAcceptFileTypes(editingDocument).replace(/\./g, '').split(',');

        if (!acceptTypes.includes(fileExtension)) {
            toast.error(`Invalid file type. Allowed: ${acceptTypes.join(', ')}`);
            e.target.value = '';
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const handleSaveDocument = async () => {
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('documentType', editingDocument);

            const response = await axios.put('/api/member/update-document-by-member', formData);

            if (response.data.status === true) {
                toast.success('Document uploaded successfully!');

                if (response?.data?.member) {
                    dispatch(setUser(response.data.member));
                }

                setShowEditModal(false);
                setSelectedFile(null);
            } else {
                toast.error(response.data.message || 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            toast.error(error.response?.data?.message || 'Failed to upload document');
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };


    const getAcceptFileTypes = (documentType) => {
        switch (documentType) {
            case 'document':
            case 'memberDocument':
                return '.jpg,.jpeg,.png,.pdf';
            case 'facePicture':
                return '.jpg,.jpeg,.png';
            case 'faceVideo':
                return '.mp4,.mov,.avi,.webm';
            default:
                return '*';
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">
                        Edit {editingDocument.charAt(0).toUpperCase() + editingDocument.slice(1)}
                    </h3>
                    <button
                        onClick={() => {
                            setShowEditModal(false);
                            clearSelectedFile();
                        }}
                        className="text-black hover:text-black"
                    >
                        <XMarkIcon className="w-6 h-6 cursor-pointer " />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-black-50 rounded-lg">
                        <p className="text-xs md:text-sm text-black mb-2">
                            Allowed formats: {getAcceptFileTypes(editingDocument)}
                        </p>
                        <p className="text-xs md:text-sm text-black">
                            Maximum size: 10MB
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Choose File
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept={getAcceptFileTypes(editingDocument)}
                            className="w-full p-3 border border-black text-black rounded-lg cursor-pointer"
                            disabled={isUploading}
                        />
                    </div>

                    {selectedFile && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-green-800">{selectedFile.name}</p>
                                    <p className="text-sm text-green-600">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => clearSelectedFile()}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    disabled={isUploading}
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                clearSelectedFile();
                            }}
                            className="cursor-pointer text-xs md:text-md px-4 py-2 text-black hover:text-black disabled:opacity-50"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveDocument}
                            disabled={!selectedFile || isUploading}
                            className="cursor-pointer text-xs md:text-md px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateDocuments;