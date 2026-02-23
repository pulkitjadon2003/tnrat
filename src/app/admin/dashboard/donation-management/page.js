"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function DonationTable() {
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchDonations = async (pageNumber = currentPage) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/donate/get-all-donations?pageNumber=${pageNumber}`);
            const result = res?.data;

            if (result?.status === true) {
                setDonations(result?.donations || []);
                setTotalDonations(result?.totalDonations || 0);
                setTotalPages(result?.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = async (pageNumber = currentPage) => {
        setLoading(true);

        if (searchTerm.trim() === '') {
            setCurrentPage(1);
            fetchDonations(1);
            return;
        }

        try {
            const result = await axios.post(`/api/donate/search-donations?pageNumber=${pageNumber}`, {
                search: searchTerm
            });

            if (result.data?.status === true) {
                setDonations(result?.data?.donations || []);
                setTotalPages(result?.data?.totalPages || 0);
                setTotalDonations(result?.data?.totalDonations || 0);
            } else {
                console.error('Search failed:', result);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm?.length === 0) {
            fetchDonations();
        } else {
            handleSearch();
        }
    }, [currentPage]);

    // Handle row click to view donation details
    //   const handleRowClick = (donationId) => {
    //     router.push(`/admin/donations/${donationId}`);
    //   };

    const StatusBadge = ({ status }) => {
        const statusColors = {
            SUCCESS: "bg-green-100 text-green-800 border-green-200",
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            FAILED: "bg-red-100 text-red-800 border-red-200",
            CANCELLED: "bg-gray-100 text-gray-800 border-gray-200"
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium border rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };



    const AnonymousBadge = ({ isAnonymous }) => {
        if (!isAnonymous) return null;

        return (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 rounded-full ml-2">
                Anonymous
            </span>
        );
    };

    if (loading && donations.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const totalPagesCount = Math.ceil(totalDonations / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const formatINRCurrency = (amount) => {
        const number = Number(amount);

        if (isNaN(number)) return '';

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: number % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(number);
    };


    return (
        <div className="bg-white rounded-lg border border-gray-200 text-black">
            {/* Header with Search and Actions */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Donations Management</h2>
                        <p className="text-sm text-gray-600">Total {totalDonations} donations found</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search donations..."
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

                        {/* Export Button */}
                        {/* <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 text-sm font-medium"
                        >
                            Export
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                { key: "transactionId", label: "Transaction ID" },
                                { key: "donor", label: "Donor" },
                                { key: "contact", label: "Contact" },
                                { key: "amount", label: "Amount" },
                                { key: "date", label: "Date" },
                                { key: "status", label: "Status" }
                            ].map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {donations?.length > 0 ? (
                            donations?.map((donation) => (
                                <tr
                                    key={donation?._id}
                                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                //   onClick={() => handleRowClick(donation?._id)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                {donation?.transactionId || "N/A"}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            {donation?.donateAnonymously ? (
                                                <span className="text-gray-500 italic">Anonymous Donor</span>
                                            ) : (
                                                donation?.fullName || "N/A"
                                            )}
                                            {/* <AnonymousBadge isAnonymous={donation?.donateAnonymously} /> */}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{donation?.email || "N/A"}</div>
                                            {donation?.phone && (
                                                <div className="text-xs text-gray-600">{donation?.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatINRCurrency(donation?.amount) || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {dayjs(donation?.createdAt)?.format("DD MMM YYYY, hh:mm A")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={donation?.status?.toUpperCase()} />
                                    </td>
                                    {/* <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="text-green-600 hover:text-green-800 p-1 rounded transition duration-150 cursor-pointer"
                                                title="View Details"
                                                onClick={() => handleRowClick(donation?._id)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition duration-150 cursor-pointer"
                                                title="Download Receipt"
                                               
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-600">No donations found</p>
                                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {donations.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(indexOfLastItem, totalDonations)}
                            </span>{" "}
                            of <span className="font-medium">{totalDonations}</span> results
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
    );
}