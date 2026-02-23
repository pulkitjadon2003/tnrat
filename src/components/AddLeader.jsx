import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    designation: Yup.string().required("Designation is required"),
});

const AddLeader = ({
    modalOpen,
    setModalOpen,
    fetchLeadership,
    isEdit,
    setIsEdit,
    selectedData,
    setSelectedData,
}) => {
    const formikRef = useRef();
    const [previewUrl, setPreviewUrl] = useState("");

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("designation", values.designation);
            if (values.profilePicture) {
                formData.append("profile", values.profilePicture);
            }

            const endPoint = isEdit
                ? `/api/leadership/update-leadership?id=${selectedData?._id}`
                : "/api/leadership/create-leadership";

            const result = await axios.post(endPoint, formData);

            if (result?.data?.status === true) {
                toast.success(result?.data?.message);
                fetchLeadership();
                resetForm();
                handleClose();
            } else {
                toast.error(result?.data?.response?.data?.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error while adding sub-admin", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setIsEdit(false);
        setSelectedData({});
        setPreviewUrl("");
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];

        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
                event.target.value = ''; // Clear the file input
                return;
            }

            // Validate file size (5MB = 5 * 1024 * 1024 bytes)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                event.target.value = ''; // Clear the file input
                return;
            }

            // If validation passes, proceed
            setFieldValue("profilePicture", file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const getSrc = (file) => {
        if (!file) return "";

        if (typeof file === "string") {
            return file;
        } else {
            return URL.createObjectURL(file);
        }
    };

    useEffect(() => {
        if (selectedData?.profilePicture) {
            setPreviewUrl(getSrc(selectedData.profilePicture));
        }
    }, [selectedData]);

    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto text-black"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-md">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isEdit ? "Edit Leader" : "Add Leader"}
                        </h3>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-4">
                        <Formik
                            innerRef={formikRef}
                            initialValues={{
                                name: selectedData?.name || "",
                                profilePicture: selectedData?.profile || null,
                                designation: selectedData?.designation || "",
                            }}
                            validationSchema={validationSchema}
                            enableReinitialize
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, handleSubmit, values, isSubmitting }) => (
                                <Form className="space-y-4">
                                    {/* Profile Picture Preview */}
                                    {(previewUrl || values?.profilePicture) && (
                                        <div className="flex justify-center">
                                            <img
                                                src={previewUrl || getSrc(values?.profilePicture)}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter name"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    {/* Profile Picture Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Profile Picture
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <label className="flex-1">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                                />
                                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-center text-sm text-gray-600">
                                                    Choose File
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Designation
                                        </label>
                                        <Field
                                            name="designation"
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter designation"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </div>
                                        ) : (
                                            "Submit"
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Close Button */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeader;