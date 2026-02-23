"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddTeam({ 
    modalOpen, 
    setModalOpen, 
    fetchTeams, 
    isEdit, 
    setIsEdit, 
    selectedData, 
    setSelectedData 
}) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        leader: '',
        members: [],
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [availableLeaders, setAvailableLeaders] = useState([]);

    useEffect(() => {
        if (modalOpen) {
            fetchAvailableUsers();
            if (isEdit && selectedData) {
                setFormData({
                    name: selectedData.name || '',
                    description: selectedData.description || '',
                    leader: selectedData.leader?._id || '',
                    members: selectedData.members?.map(member => member._id) || [],
                    status: selectedData.status || 'active'
                });
            } else {
                resetForm();
            }
        }
    }, [modalOpen, isEdit, selectedData]);

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get('/api/users/get-available-users');
            if (response.data.status === true) {
                setAvailableMembers(response.data.users || []);
                setAvailableLeaders(response.data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            leader: '',
            members: [],
            status: 'active'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (isEdit) {
                response = await axios.put(`/api/team/update-team?id=${selectedData._id}`, formData);
            } else {
                response = await axios.post('/api/team/create-team', formData);
            }

            if (response.data.status === true) {
                toast.success(response.data.message);
                setModalOpen(false);
                resetForm();
                setIsEdit(false);
                setSelectedData({});
                fetchTeams();
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving team:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setIsEdit(false);
        setSelectedData({});
        resetForm();
    };

    const handleMemberSelect = (memberId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.includes(memberId)
                ? prev.members.filter(id => id !== memberId)
                : [...prev.members, memberId]
        }));
    };

    return (
        <>
            {modalOpen && (
                <div
                    
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">
                                {isEdit ? 'Edit Team' : 'Add New Team'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter team name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter team description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Leader *
                                </label>
                                <select
                                    required
                                    value={formData.leader}
                                    onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Team Leader</option>
                                    {availableLeaders.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Members
                                </label>
                                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                    {availableMembers.map(user => (
                                        <div key={user._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={formData.members.includes(user._id)}
                                                onChange={() => handleMemberSelect(user._id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">
                                                {user.name} ({user.email})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected: {formData.members.length} members
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : isEdit ? 'Update Team' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}