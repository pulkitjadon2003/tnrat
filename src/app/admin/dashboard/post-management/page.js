"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import EditPostModal from '@/components/EditPostModal';

export default function PostManagement() {
    const [postList, setPostList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalPosts, setTotalPosts] = useState(0);
    const [confirmModal, setConfirmModal] = useState(false);
    const router = useRouter();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/post/get-all-posts?pageNumber=${currentPage}`);
            const result = res.data;

            if (result?.status === true) {
                setPostList(result?.posts || []);
                setTotalPages(result?.totalPages || 0);
                setTotalPosts(result?.totalPosts || 0);
            } else {
                console.error('Failed to fetch posts:', result);
                toast.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Error fetching posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm?.length === 0) {
            fetchPosts();
        } else {
            handleSearch();
        }
    }, [currentPage]);

    const handleSearch = async (pageNumber = currentPage) => {
        setLoading(true);

        if (searchTerm.trim() === '') {
            setCurrentPage(1);
            fetchPosts();
            return;
        }

        try {
            const result = await axios.post(`/api/post/search-post?pageNumber=${pageNumber}`, { 
                search: searchTerm 
            });

            if (result.data?.status === true) {
                setPostList(result?.data?.posts || []);
                setTotalPages(result?.data?.totalPages || 0);
                setTotalPosts(result?.data?.totalPosts || 0);
            } else {
                console.error('Search failed:', result);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await axios.delete(`/api/post/delete-post?id=${selectedData?._id}`);
            const result = response.data;
            
            if (result.status === true) {
                fetchPosts();
                toast.success('Post deleted successfully');
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Error deleting post');
        } finally {
            setLoading(false);
            setConfirmModal(false);
            setSelectedData({});
        }
    };

    const MediaPreview = ({ post }) => {
        const hasImages = post?.images?.length > 0;
        const hasVideo = post?.video;

        if (!hasImages && !hasVideo) {
            return (
                <span className="text-xs text-gray-500">No media</span>
            );
        }

        return (
            <div className="flex items-center space-x-2">
                {hasImages && (
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-blue-600">{post?.images.length}</span>
                    </div>
                )}
                {hasVideo && (
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    const ViewPostModal = ({ post, isOpen, onClose }) => {
        if (!isOpen || !post) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Post Details</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Text Content */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-black mb-1">Team</label>
                                    <p className="text-gray-900">{post?.team?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-black mb-1">Title</label>
                                    <p className="text-gray-900">{post?.title}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-black mb-1">Description</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{post?.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-1">Case Date</label>
                                        <p className="text-gray-900">
                                            {post?.caseDate ? dayjs(post?.caseDate).format('DD MMM YYYY') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-1">Location</label>
                                        <p className="text-gray-900">
                                            {post?.city && post?.state ? `${post?.city}, ${post?.state}` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Media Content */}
                            <div className="space-y-4">
                                {/* Video */}
                                {post?.video && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                                        <video 
                                            controls 
                                            className="w-full rounded-lg border"
                                            src={post?.video}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}

                                {/* Images */}
                                {post?.images?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Images ({post?.images.length})
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {post?.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Post image ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-90"
                                                    onClick={() => window.open(image, '_blank')}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    setIsEdit(true);
                                    setSelectedData(post);
                                    setModalOpen(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 cursor-pointer"
                            >
                                Edit Post
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    if (loading && postList.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const totalPagesCount = Math.ceil(totalPosts / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
        <div className="p-4">
            <EditPostModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                fetchPosts={fetchPosts}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
            />

            <ViewPostModal 
                post={selectedPost}
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedPost(null);
                }}
            />

            <ConfirmationModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleDelete}
                title={'Delete Post'}
                message='Are you sure you want to delete this post? This action cannot be undone.'
                loading={loading}
            />

            <div className="bg-white rounded-lg border border-gray-200 text-black">
                {/* Header with Search */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Post Management</h2>
                            <p className="text-sm text-gray-600">Total {totalPosts} Posts found</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
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
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    { key: "team", label: "Team" },
                                    { key: "title", label: "Title" },
                                    { key: "description", label: "Description" },
                                    { key: "caseDate", label: "Case Date" },
                                    { key: "location", label: "Location" },
                                    { key: "media", label: "Media" },
                                    // { key: "created", label: "Created" },
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
                            {postList?.length > 0 ? (
                                postList?.map((post) => (
                                    <tr
                                        key={post?._id}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                         <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className="text-sm font-medium text-gray-900 truncate" title={post?.title}>
                                                    {post?.team?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className="text-sm font-medium text-gray-900 truncate" title={post?.title}>
                                                    {post?.title || 'No Title'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-gray-900 truncate" title={post?.description}>
                                                    {post?.description || 'No Description'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {post?.caseDate ? dayjs(post?.caseDate).format('DD MMM YYYY') : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {post?.city && post?.state ? (
                                                <div>
                                                    <span className="font-medium">{post?.city}</span>
                                                    <br />
                                                    <span className="text-xs text-gray-500">{post?.state}</span>
                                                </div>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <MediaPreview post={post} />
                                        </td>
                                        {/* <td className="px-4 py-3 text-sm text-gray-500">
                                            {dayjs(post?.createdAt).format('DD MMM YYYY')}
                                        </td> */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="text-green-600 hover:text-green-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title="View Details"
                                                    onClick={() => {
                                                        setSelectedPost(post);
                                                        setViewModalOpen(true);
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setIsEdit(true);
                                                        setSelectedData(post);
                                                        setModalOpen(true);
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 p-1 rounded transition duration-150 cursor-pointer"
                                                    title='Delete'
                                                    onClick={() => {
                                                        setSelectedData(post);
                                                        setConfirmModal(true);
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
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-600">No posts found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {postList.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, totalPosts)}
                                </span>{" "}
                                of <span className="font-medium">{totalPosts}</span> results
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