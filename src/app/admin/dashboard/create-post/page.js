"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { State, City } from 'country-state-city';
import imageCompression from "browser-image-compression";

export default function CreatePost() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        caseDate: '',
        state: '',
        city: '',
        team: ''
    });
    const [availableStates, setAvailableStates] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [teams, setTeam] = useState([]);
    // File state
    const [video, setVideo] = useState(null);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const imageRef = useRef(null);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchTeams = async () => {
        try {
            const res = await axios.get('/api/team/get-team-for-options');

            const result = res?.data;

            if (result?.status === true) {
                setTeam(result?.teams || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const allStates = State.getStatesOfCountry("IN");
        setAvailableStates(allStates.map((s) => s.name));

        fetchTeams();
    }, []);

    useEffect(() => {
        if (formData?.state) {
            const selectedState = State.getStatesOfCountry("IN").find(
                (s) => s.name === formData?.state
            );

            if (selectedState) {
                const cities = City.getCitiesOfState("IN", selectedState.isoCode);

                if (selectedState.isoCode === "CT") {
                    setAvailableCities(['Manendragarh', ...cities.map((c) => c.name)]);
                } else {
                    setAvailableCities(cities.map((c) => c.name));
                }
            } else {
                setAvailableCities([]);
            }

        } else {
            setAvailableCities([]);
        }
    }, [formData?.state]);

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    video: 'Video size must be less than 50MB'
                }));
                return;
            }

            // Check file type
            if (!file.type.startsWith('video/')) {
                setErrors(prev => ({
                    ...prev,
                    video: 'Please upload a valid video file'
                }));
                return;
            }

            setVideo(file);
            setErrors(prev => ({ ...prev, video: '' }));
        }
    };
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check total images count
        if (images.length + files.length > 10) {
            setErrors(prev => ({
                ...prev,
                images: 'Maximum 10 images allowed'
            }));
            return;
        }

        let invalidFiles = [];

        // Validate each file
        const validFiles = files.filter(file => {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                invalidFiles.push(`${file.name} - Not an image file`);
                return false;
            }

            // Check file size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                invalidFiles.push(`${file.name} - File too large (max 5MB)`);
                return false;
            }

            return true;
        });

        // Set appropriate error message
        if (invalidFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                images: `Some files were skipped: ${invalidFiles.join(', ')}`
            }));
        } else {
            setErrors(prev => ({ ...prev, images: '' }));
        }

        setImages(prev => [...prev, ...validFiles]);
    };
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        setVideo(null);
        if (videoRef.current) {
            videoRef.current.value = '';
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData?.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData?.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData?.caseDate) {
            newErrors.caseDate = 'Case Date is required';
        }

        if (!formData?.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData?.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (images.length === 0) {
            newErrors.images = 'At least one image is required';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const uploadToCloudinary = async (file) => {
    //     const fd = new FormData();
    //     fd.append("file", file);
    //     fd.append("upload_preset", "ctpn2xmb");
    //     fd.append("folder", "post");

    //     const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    //         method: "POST",
    //         body: fd,
    //     });

    //     const data = await res.json();
    //     return data.secure_url;
    // };


    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.5,          // final size target (0.5MB)
            maxWidthOrHeight: 1280,  // resize resolution
            useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        console.log("Original:", file.size / 1024 / 1024, "MB");
        console.log("Compressed:", compressedFile.size / 1024 / 1024, "MB");

        return compressedFile;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const appendData = new FormData();
            // const uploadedImages = [];

            for (const img of images) {
                const compressed = await compressImage(img);
                // const url = await uploadToCloudinary(img);
                // uploadedImages.push(url);
                appendData.append("images", compressed, compressed.name);

            }

            // let uploadedVideo = "";
            if (video) {
                appendData.append("video", video);
                // uploadedVideo = await uploadToCloudinary(video);
            }

            appendData.append("title", formData?.title);
            appendData.append("description", formData?.description);
            appendData.append("caseDate", formData?.caseDate);
            appendData.append("state", formData?.state);
            appendData.append("city", formData?.city);
            appendData.append("team", formData?.team);


            const res = await axios.post('/api/post/create-post', appendData);

            const result = res.data;

            if (result?.status) {
                toast.success("Post created successfully");

                setFormData({
                    title: '',
                    description: '',
                    caseDate: '',
                    state: '',
                    city: ''
                });

                setImages([]);
                setVideo(null);

                if (videoRef.current) videoRef.current.value = "";
                if (imageRef.current) imageRef.current.value = "";
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto px-4">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg px-8 pt-6 pb-8 mb-4">

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title *
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData?.title}
                            onChange={handleInputChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors?.title ? 'border-red-500' : ''}`}
                            placeholder="Enter post title"
                        />
                        {errors?.title && (
                            <p className="text-red-500 text-xs mt-1">{errors?.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData?.description}
                            onChange={handleInputChange}
                            rows="4"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors?.description ? 'border-red-500' : ''}`}
                            placeholder="Enter post description"
                        />
                        {errors?.description && (
                            <p className="text-red-500 text-xs mt-1">{errors?.description}</p>
                        )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                                Team
                            </label>
                            <select
                                id="team"
                                name="team"
                                value={formData?.team}
                                onChange={handleInputChange}
                                className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Team</option>
                                {teams?.map((team) => (
                                    <option key={team?._id} value={team?._id}>
                                        {team?.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="caseDate">
                                Case Date *
                            </label>
                            <input
                                id="caseDate"
                                name="caseDate"
                                type="date"
                                min="1900-01-01"
                                max={new Date().toISOString().split('T')[0]}
                                value={formData?.caseDate}
                                onChange={handleInputChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors?.caseDate ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors?.caseDate && (
                                <p className="text-red-500 text-xs mt-1">{errors?.caseDate}</p>
                            )}
                        </div>
                    </div>


                    {/* State and City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                                State *
                            </label>
                            <select
                                id="state"
                                name="state"
                                value={formData?.state}
                                onChange={handleInputChange}
                                className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All States</option>
                                {availableStates?.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {/* <input
                                id="state"
                                name="state"
                                type="text"
                                value={formData?.state}
                                onChange={handleInputChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors?.state ? 'border-red-500' : ''
                                    }`}
                                placeholder="Enter state"
                            /> */}
                            {errors?.state && (
                                <p className="text-red-500 text-xs mt-1">{errors?.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                City *
                            </label>
                            <select
                                id="city"
                                name="city"
                                value={formData?.city}
                                onChange={handleInputChange}
                                className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Cities</option>
                                {availableCities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {/* <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData?.city}
                                onChange={handleInputChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors?.city ? 'border-red-500' : ''
                                    }`}
                                placeholder="Enter city"
                            /> */}
                            {errors?.city && (
                                <p className="text-red-500 text-xs mt-1">{errors?.city}</p>
                            )}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="video">
                            Video (Optional - Max 50MB)
                        </label>
                        <input
                            ref={videoRef}
                            id="video"
                            name="video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors?.video && (
                            <p className="text-red-500 text-xs mt-1">{errors?.video}</p>
                        )}
                        {video && (
                            <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-sm text-gray-700">{video.name}</span>
                                <button
                                    type="button"
                                    onClick={removeVideo}
                                    className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Images Upload */}
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                            Images * (Max 10 images, at least 1 required)
                        </label>
                        <input
                            ref={imageRef}
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors?.images && (
                            <p className="text-red-500 text-xs mt-1">{errors?.images}</p>
                        )}

                        {/* Selected Images Preview */}
                        {images.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Selected images ({images.length}/10):
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {images?.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-contain rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex gap-2 bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {
                                loading ?
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                    : 'Create Post'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}