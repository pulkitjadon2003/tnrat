"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
    ip: Yup.string()
        .required("IP address is required")
        .matches(
            /^(\d{1,3}\.){3}\d{1,3}$/,
            "Please enter a valid IP address"
        ),
    description: Yup.string()
        .required("Description is required")
        .min(3, "Description must be at least 3 characters")
        .max(100, "Description must be less than 100 characters"),
});

const AddIPModal = ({ modalOpen, setModalOpen, fetchAllIPs, isEdit, setIsEdit, editData, setEditData }) => {
    const formikRef = useRef();

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const payload = {
                ip: values?.ip,
                description: values?.description
            }

            if (isEdit) {
                payload._id = editData?._id;
            }

            const res = await axios.post(isEdit ? '/api/ip/update-ip' : '/api/ip/create-ip', payload);

            const data = res.data;

            if (data?.status === true) {
                toast.success('IP added successfully');
                fetchAllIPs();
                resetForm();
                handleClose();
            }
        } catch (e) {
            console.log('error while add ip', e);
            toast.error(e?.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setIsEdit(false);
        setEditData({});
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };

    // Close modal when clicking outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };


    if (!modalOpen) return null;

    return (
        <div
            className="fixed h-screen inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isEdit ? "Edit IP Address" : "Add IP Address"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        {isEdit ? "Update the IP address details" : "Add a new IP address to the whitelist"}
                    </p>
                </div>

                <div className="p-6">
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            ip: editData?.ip || "",
                            description: editData?.description || "",
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, handleSubmit, values, isSubmitting, errors, touched }) => (
                            <FormikForm onSubmit={handleSubmit} className="space-y-6">
                                {/* IP Address Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        IP Address *
                                    </label>
                                    <Field
                                        name="ip"
                                        as="input"
                                        type="text"
                                        placeholder="e.g., 192.168.1.1"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${errors.ip && touched.ip ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <ErrorMessage name="ip">
                                        {(msg) => <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {msg}
                                        </div>}
                                    </ErrorMessage>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Description *
                                    </label>
                                    <Field
                                        name="description"
                                        as="input"
                                        type="text"
                                        placeholder="e.g., Office Network, Home Network, etc."
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <ErrorMessage name="description">
                                        {(msg) => <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {msg}
                                        </div>}
                                    </ErrorMessage>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="cursor-pointer flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>{isEdit ? "Updating..." : "Adding..."}</span>
                                            </>
                                        ) : (
                                            isEdit ? "Update IP" : "Add IP"
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

export default AddIPModal;