"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "@/redux/slices/userSlices";
import { useDispatch } from "react-redux";

const nameSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

const contactSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone number should be 10 digits"),
});

const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
        .required("New Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const UpdateAccountInfo = ({ modalOpen, setModalOpen, title, user }) => {
    const dispatch = useDispatch();
    const formikRef = useRef();

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            let payload;

            if (title === "Name") {
                payload = { name: values?.name };
            } else if (title === "Contact") {
                payload = {
                    email: values?.email,
                    phone: values?.phone,
                };
            } else if (title === "Password") {
                payload = {
                    currentPassword: values?.currentPassword,
                    newPassword: values?.newPassword,
                };
            }

            const url = title === "Password" ? '/api/super-admin/update-password' : '/api/super-admin/update-super-admin';

            const res = await axios.put(url, payload);

            if (res?.data?.status === true) {
                toast.success(`${title} updated successfully`);
                dispatch(setUser(res?.data?.superAdmin));
            }

            resetForm();
            setModalOpen(false);
        } catch (e) {
            console.log('error while updating account info', e);
            toast.error(e?.response?.data?.error || "Something went wrong. Please try again.");
            // alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };

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

        if (modalOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    if (!modalOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">
                            Update {title}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded transition duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Name Update Form */}
                    {title === "Name" && (
                        <Formik
                            innerRef={formikRef}
                            initialValues={{ name: user?.name || "" }}
                            validationSchema={nameSchema}
                            enableReinitialize
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit, isSubmitting, errors, touched }) => (
                                <FormikForm onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <Field 
                                            name="name" 
                                            type="text"
                                            placeholder="Enter your name"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="name">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="cursor-pointer flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                "Update"
                                            )}
                                        </button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    )}

                    {/* Contact Update Form */}
                    {title === "Contact" && (
                        <Formik
                            innerRef={formikRef}
                            initialValues={{
                                email: user?.email || "",
                                phone: user?.phone || "",
                            }}
                            validationSchema={contactSchema}
                            enableReinitialize
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit, isSubmitting, errors, touched }) => (
                                <FormikForm onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <Field 
                                            name="email" 
                                            type="email"
                                            placeholder="Enter email address"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="email">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <Field 
                                            name="phone" 
                                            type="tel"
                                            placeholder="Enter 10-digit phone number"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="phone">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="cursor-pointer flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                "Update"
                                            )}
                                        </button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    )}

                    {/* Password Update Form */}
                    {title === "Password" && (
                        <Formik
                            innerRef={formikRef}
                            initialValues={{
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                            }}
                            validationSchema={passwordSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit, isSubmitting, errors, touched }) => (
                                <FormikForm onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <Field 
                                            name="currentPassword" 
                                            type="password"
                                            placeholder="Enter current password"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.currentPassword && touched.currentPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="currentPassword">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <Field 
                                            name="newPassword" 
                                            type="password"
                                            placeholder="Enter new password"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="newPassword">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <Field 
                                            name="confirmPassword" 
                                            type="password"
                                            placeholder="Confirm new password"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage name="confirmPassword">
                                            {(msg) => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="cursor-pointer flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                "Update"
                                            )}
                                        </button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateAccountInfo;