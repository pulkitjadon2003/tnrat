'use client'; // Only for App Router

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateTeamPage() {
    const [team, setTeam] = useState({
        name: '',
        leader: '',
        logo: null,
        members: [{
            name: '',
            email: '',
            phone: ''
        }]
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    // Handle team field changes
    const handleTeamChange = (e) => {
        const { name, value } = e.target;
        setTeam(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle logo upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setTeam(prev => ({
                ...prev,
                logo: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove logo
    const removeLogo = () => {
        setTeam(prev => ({
            ...prev,
            logo: null
        }));
        setLogoPreview(null);
    };

    // Handle member field changes
    const handleMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...team.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value
        };

        setTeam(prev => ({
            ...prev,
            members: updatedMembers
        }));
    };

    // Add new member field
    const addMember = () => {
        const obj = team?.members;

        if (obj[obj.length - 1]?.name === '') {
            return;
        }

        setTeam(prev => ({
            ...prev,
            members: [
                ...prev.members,
                { name: '', email: '', phone: '' }
            ]
        }));
    };

    // Remove member field
    const removeMember = (index) => {
        if (team.members.length > 1) {
            const updatedMembers = team.members.filter((_, i) => i !== index);
            setTeam(prev => ({
                ...prev,
                members: updatedMembers
            }));
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!team.name.trim()) {
            newErrors.teamName = 'Team name is required';
        }

        if (!team.leader.trim()) {
            newErrors.leader = 'Team leader is required';
        }

        team.members.forEach((member, index) => {
            if (!member.name.trim()) {
                newErrors[`memberName_${index}`] = 'Member name is required';
            }

            if (!member.email.trim()) {
                newErrors[`memberEmail_${index}`] = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(member.email)) {
                newErrors[`memberEmail_${index}`] = 'Email is invalid';
            }

            if (!member.phone.trim()) {
                newErrors[`memberPhone_${index}`] = 'Phone is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData to handle file upload
            const formData = new FormData();
            formData.append('name', team.name);
            formData.append('leader', team.leader);
            
            if (team.logo) {
                formData.append('logo', team.logo);
            }

            // Append members as JSON string
            formData.append('members', JSON.stringify(team.members));

            const res = await axios.post('/api/team/create-team', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data?.status === true) {
                toast.success(res.data?.message);
                setTeam({
                    name: '',
                    leader: '',
                    logo: null,
                    members: [{
                        name: '',
                        email: '',
                        phone: ''
                    }]
                });
                setLogoPreview(null);
            }
        } catch (error) {
            console.error('Error creating team:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen text-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Team</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Enter team details and add team members.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Team Information */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Team Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={team.name}
                                    onChange={handleTeamChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.teamName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter team name"
                                />
                                {errors.teamName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="leader" className="block text-sm font-medium text-gray-700">
                                    Team Leader *
                                </label>
                                <input
                                    type="text"
                                    id="leader"
                                    name="leader"
                                    value={team.leader}
                                    onChange={handleTeamChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.leader ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter team leader name"
                                />
                                {errors.leader && (
                                    <p className="mt-1 text-sm text-red-600">{errors.leader}</p>
                                )}
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Team Logo
                                </label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {logoPreview ? (
                                            <div className="relative">
                                                <img
                                                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                                                    src={logoPreview}
                                                    alt="Team logo preview"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Upload Logo
                                        </label>
                                        <input
                                            id="logo-upload"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="sr-only"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                                <button
                                    type="button"
                                    onClick={addMember}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Add Member
                                </button>
                            </div>

                            <div className="space-y-4">
                                {team.members.map((member, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-700">Member {index + 1}</h4>
                                            {team.members.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(index)}
                                                    className="cursor-pointer text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(index, e)}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors[`memberName_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Full name"
                                                />
                                                {errors[`memberName_${index}`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors[`memberName_${index}`]}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={member.email}
                                                    onChange={(e) => handleMemberChange(index, e)}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors[`memberEmail_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="email@example.com"
                                                />
                                                {errors[`memberEmail_${index}`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors[`memberEmail_${index}`]}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={member.phone}
                                                    onChange={(e) => handleMemberChange(index, e)}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors[`memberPhone_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Phone number"
                                                />
                                                {errors[`memberPhone_${index}`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors[`memberPhone_${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating Team...' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}