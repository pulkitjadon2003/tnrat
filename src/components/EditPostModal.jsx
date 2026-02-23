"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { City, State } from 'country-state-city';

export default function EditPostModal({
    modalOpen,
    setModalOpen,
    fetchPosts,
    selectedData,
    setSelectedData
}) {
    const [formData, setFormData] = useState({
        team: '',
        title: '',
        description: '',
        caseDate: '',
        state: '',
        city: '',
    });
    const [availableStates, setAvailableStates] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [teams, setTeam] = useState([]);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideo, setExistingVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const imageRef = useRef(null);
    const videoRef = useRef(null);

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
                    setAvailableCities(['Manendragrah', ...cities.map((c) => c.name)]);
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

    useEffect(() => {
        if (selectedData) {
            setFormData({
                _id: selectedData._id,
                team: selectedData.team?._id || '',
                title: selectedData.title || '',
                description: selectedData.description || '',
                caseDate: selectedData.caseDate ? new Date(selectedData?.caseDate).toISOString().split('T')[0] : '',
                state: selectedData.state || '',
                city: selectedData.city || '',
            });
            setExistingImages(selectedData.images || []);
            setExistingVideo(selectedData.video || null);
            setImages([]);
            setVideo(null);
        } else {
            resetForm();
        }
    }, [selectedData, modalOpen]);

    const resetForm = () => {
        setFormData({
            team: '',
            title: '',
            description: '',
            caseDate: '',
            state: '',
            city: '',
        });
        setImages([]);
        setVideo(null);
        setExistingImages([]);
        setExistingVideo(null);
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check total image count
        if (existingImages.length + images.length + files.length > 10) {
            setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
            return;
        }

        const validFiles = files.filter(file => {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                return false;
            }

            // Check file size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                return false;
            }

            return true;
        });

        // Check if any files were rejected due to size
        if (validFiles.length !== files.length) {
            setErrors(prev => ({ ...prev, images: 'Some files were skipped. Only images under 5MB are allowed.' }));
        } else {
            setErrors(prev => ({ ...prev, images: '' }));
        }

        setImages(prev => [...prev, ...validFiles]);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, video: 'Video size must be less than 50MB' }));
                return;
            }

            if (!file.type.startsWith('video/')) {
                setErrors(prev => ({ ...prev, video: 'Please upload a valid video file' }));
                return;
            }

            setVideo(file);
            setErrors(prev => ({ ...prev, video: '' }));
        }
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        setVideo(null);
        setExistingVideo(null);
        if (videoRef.current) videoRef.current.value = '';
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.caseDate) newErrors.caseDate = 'Date is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (existingImages.length + images.length === 0) newErrors.images = 'At least one image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'team' && formData[key] === '') {

                } else {
                    submitData.append(key, formData[key]);
                }
            });

            if (video) {
                submitData.append('video', video);
            }

            images.forEach(image => {
                submitData.append('images', image);
            });

            submitData.append('existingImages', JSON.stringify(existingImages));
            submitData.append('existingVideo', existingVideo || '');

            const url = `/api/post/update-post?id=${selectedData?._id}`;


            const response = await axios.put(url, submitData);
            if (response.data.status === true) {
                toast.success('Post updated successfully');
                fetchPosts();
                setModalOpen(false);
                resetForm();
                setSelectedData({});
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('Error saving post');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedData({});
        resetForm();
    };

    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Update Post
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
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter post title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter post description"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    name="caseDate"
                                    value={formData.caseDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.caseDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.caseDate && <p className="text-red-500 text-xs mt-1">{errors.caseDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                                <select
                                    id="team"
                                    name="team"
                                    value={formData?.team}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.caseDate ? 'border-red-500' : 'border-gray-300'
                                        }`}                                >
                                    <option value="">Select Team</option>
                                    {teams?.map((team) => (
                                        <option key={team?._id} value={team?._id}>
                                            {team?.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.caseDate && <p className="text-red-500 text-xs mt-1">{errors.caseDate}</p>}
                            </div>
                        </div>

                        {/* Date and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={formData?.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                                        }`}                            >
                                    <option value="">All States</option>
                                    {availableStates?.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                                {/* <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter state"
                                /> */}
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <select
                                    id="city"
                                    name="city"
                                    value={formData?.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">All Cities</option>
                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {/* <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter city"
                                /> */}
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video (Optional - Max 50MB)
                            </label>
                            <input
                                ref={videoRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video}</p>}

                            {/* Video Preview */}
                            {(video || existingVideo) && (
                                <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span className="text-sm text-gray-700">
                                        {/* {video ? video.name : 'Existing video'} */}
                                        <video
                                            controls
                                            className="w-1/2 rounded-lg border"
                                            src={video ? URL.createObjectURL(video) : existingVideo}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </span>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images * (Max 10 images, at least 1 required)
                            </label>
                            <input
                                ref={imageRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.images && <p className="text-red-500 text-xs mt-1">{errors?.images}</p>}

                            {/* Images Preview */}
                            {(existingImages.length > 0 || images.length > 0) && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected images ({existingImages.length + images.length}/10):
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Existing Images */}
                                        {existingImages?.map((image, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-full h-20 object-contain rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {/* New Images */}
                                        {images?.map((image, index) => (
                                            <div key={`new-${index}`} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-20 object-contain rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                {loading ? 'Saving...' : 'Update Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}