"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddTeam from '@/components/AddTeam';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function TeamManagement() {
    const [teamList, setTeamList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalTeams, setTotalTeams] = useState(0);
    const [confirmModal, setConfirmModal] = useState(false);
    const router = useRouter();

    const fetchTeams = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`/api/team/get-all-teams?pageNumber=${currentPage}`);

            const result = res.data;

            if (result.status === true) {
                setTeamList(result?.teams || []);
                setTotalPages(result?.totalPages || 0);
                setTotalTeams(result?.totalTeams || 0);
            } else {
                console.error('Failed to fetch teams:', result);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm?.length === 0) {
            fetchTeams();
        } else {
            handleSearch();
        }
    }, [currentPage]);

    const handleSearch = async (pageNumber = currentPage) => {
        setLoading(true);

        if (searchTerm.trim() === '') {
            setCurrentPage(1);
            fetchTeams();
            return;
        }

        try {
            const result = await axios.post(`/api/team/search-teams?pageNumber=${pageNumber}`, { search: searchTerm });

            if (result.data?.status === true) {
                setTeamList(result?.data?.teams || []);
                setTotalPages(result?.data?.totalPages || 0);
            } else {
                console.error('Search failed:', result);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);

            const response = await axios.delete(`/api/team/delete-team?id=${selectedData?._id}`);
            const result = response.data;
            if (result.status === true) {
                fetchTeams();
                toast.success(result.message);
            } else {
                toast.error(result.response?.data?.message || "Something went wrong");
                console.error('Failed to delete team:', result);
            }
        } catch (error) {
            console.error('Error deleting team:', error);
        } finally {
            setLoading(false);
            setConfirmModal(false);
            setSelectedData({});
        }
    }

    const MemberTags = ({ members }) => {
        return (
            <div className="flex flex-wrap gap-1">
                {members?.map((member, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-800 border border-purple-200 rounded-full"
                    >
                        {member.name}
                    </span>
                ))}
            </div>
        );
    };

    const StatusBadge = ({ status }) => {
        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case 'active':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'inactive':
                    return 'bg-red-100 text-red-800 border-red-200';
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        };

        return (
            <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(status)}`}>
                {status || 'Inactive'}
            </span>
        );
    };

    if (loading && teamList.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const totalPagesCount = Math.ceil(totalTeams / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
        <div className="p-4">
            <ConfirmationModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleDelete}
                title={'Delete Team'}
                message='Are you sure you want to delete this team? This action cannot be undone.'
                loading={loading}
            />

            <div className="bg-white rounded-lg border border-gray-200 text-black">
                {/* Header with Search and Actions */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Team Management</h2>
                            <p className="text-sm text-gray-600">Total {totalTeams} Teams found</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search teams..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            setCurrentPage(1);
                                            handleSearch(1);
                                        }
                                    }}
                                    className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 cursor-pointer"
                                onClick={() => router.push("team-management/create-team")}
                            >
                                Add Team
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    { key: "logo", label: "Logo" },
                                    { key: "name", label: "Team Name" },
                                    { key: "leader", label: "Team Leader" },
                                    { key: "members", label: "Members" },
                                    { key: "actions", label: "Actions" }
                                ].map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {teamList?.length > 0 ? (
                                teamList?.map((team) => (
                                    <tr
                                        key={team?._id}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                         <td className="px-4 py-3">
                                            <img
                                                src={team?.logo}
                                                alt={team?.name}

                                            className="flex w-8 h-8 items-center font-medium text-gray-900" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center font-medium text-gray-900">
                                                {team?.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {team?.leader || 'Not assigned'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <MemberTags members={team?.members} />
                                        </td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="text-green-600 hover:text-green-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title="Edit"
                                                    onClick={() => {
                                                        router.push(`/admin/dashboard/team-management/edit-team/${team._id}`);
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {/* <button
                                                    className="text-green-600 hover:text-green-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title="View Details"
                                                    onClick={() => {
                                                        // Handle view details
                                                        console.log('View team:', team);
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button> */}
                                                <button
                                                    className="text-red-600 hover:text-red-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title='Delete'
                                                    onClick={() => {
                                                        setSelectedData(team)
                                                        setConfirmModal(true)
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-600">No teams found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your search criteria or create a new team</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {teamList.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, teamList.length)}
                                </span>{" "}
                                of <span className="font-medium">{teamList.length}</span> results
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {Array.from({ length: Math.min(5, totalPagesCount) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPagesCount <= 5) {
                                        pageNumber = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (currentPage >= totalPagesCount - 2) {
                                        pageNumber = totalPagesCount - 4 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`px-3 py-1 text-sm border rounded transition duration-150 ${currentPage === pageNumber
                                                ? "bg-green-600 text-white border-green-600"
                                                : "border-gray-300 hover:bg-gray-100"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))}
                                    disabled={currentPage === totalPagesCount}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}