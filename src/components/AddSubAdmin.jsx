import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone number should be 10 digits"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
    permission: Yup.array().min(1, "Please select at least one permission"),
});

const EditValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone number should be 10 digits"),
    permission: Yup.array().min(1, "Please select at least one permission"),
});

const permissions = [
    "Overview",
    "Create Post",
    "Post Management",
    "Member Management",
    "Donation Management",
    "Team Management",
    "Leadership Team Management",
];

const AddSubAdmin = ({
    modalOpen,
    setModalOpen,
    fetchSubAdmin,
    isEdit,
    setIsEdit,
    selectedData,
    setSelectedData,
}) => {
    const formikRef = useRef();
    const [previewUrl, setPreviewUrl] = useState("");

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const endPoint = isEdit
                ? `/api/super-admin/update-sub-admin?id=${selectedData?._id}`
                : "/api/super-admin/create-sub-admin";

            const result = await axios.post(endPoint, values);

            if (result?.data?.status === true) {
                toast.success(result?.data?.message);
                fetchSubAdmin();
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

    // const handleFileChange = (event, setFieldValue) => {
    //     const file = event.currentTarget.files[0];
    //     if (file) {
    //         setFieldValue("profilePicture", file);
    //         const url = URL.createObjectURL(file);
    //         setPreviewUrl(url);
    //     }
    // };

    // const getSrc = (file) => {
    //     if (!file) return "";

    //     if (typeof file === "string") {
    //         return `${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${file}`;
    //     } else {
    //         return URL.createObjectURL(file);
    //     }
    // };

    // useEffect(() => {
    //     if (selectedData?.profilePicture) {
    //         setPreviewUrl(getSrc(selectedData.profilePicture));
    //     }
    // }, [selectedData]);

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
                            {isEdit ? "Edit Sub Admin" : "Add Sub Admin"}
                        </h3>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-4">
                        <Formik
                            innerRef={formikRef}
                            initialValues={{
                                name: selectedData?.name || "",
                                profilePicture: selectedData?.profilePicture || null,
                                password: "",
                                confirmPassword: "",
                                email: selectedData?.email || "",
                                phone: selectedData?.phone || "",
                                permission: selectedData?.permission || [],
                            }}
                            validationSchema={isEdit ? EditValidationSchema : validationSchema}
                            enableReinitialize
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, handleSubmit, values, isSubmitting }) => (
                                <Form className="space-y-4">
                                    {/* Profile Picture Preview */}
                                    {/* {(previewUrl || values?.profilePicture) && (
                                        <div className="flex justify-center">
                                            <img
                                                src={previewUrl || getSrc(values?.profilePicture)}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                                            />
                                        </div>
                                    )} */}

                                    {/* Name Field */}
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
                                    {/* <div>
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
                                    </div> */}

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <Field
                                            name="email"
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter email"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    {/* Phone Number Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <Field
                                            name="phone"
                                            type="tel"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter phone number"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    {/* Password Field (only for create) */}
                                    {!isEdit && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Password
                                            </label>
                                            <Field
                                                name="password"
                                                type="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Enter password"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                    )}

                                    {/* Confirm Password Field (only for create) */}
                                    {!isEdit && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <Field
                                                name="confirmPassword"
                                                type="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Confirm password"
                                            />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                    )}

                                    {/* Permissions Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Permissions
                                        </label>
                                        <div className="space-y-2">
                                            {permissions.map((permission) => (
                                                <label key={permission} className="flex items-center">
                                                    <Field
                                                        type="checkbox"
                                                        name="permission"
                                                        value={permission}
                                                        className="cursor-pointer h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{permission}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <ErrorMessage name="permission" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    {/* Submit Button */}
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

export default AddSubAdmin;