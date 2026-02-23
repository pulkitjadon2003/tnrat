"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TeamsPage() {
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTeams, setTotalTeams] = useState(0);

    const teamsPerPage = 10;
    const totalPages = Math.ceil(totalTeams / teamsPerPage);


    const fetchTeams = async () => {
        try {
            setLoading(true);

            const response = await axios.get('/api/team/get-all-teams');

            if (response?.data?.status === true) {
                setTeams(response?.data?.teams);
                setTotalTeams(response?.data?.totalTeams);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTeams();
    }, []);

    const handleTeamClick = (team) => {
        router.push(`/team/activities/${team._id}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && teams.length === 0) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Team</h1>
                    <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-md max-w-4xl mx-auto">
                        “Here you can explore the dedicated work, activities, and contributions of all TNRAT State Teams and Wings.”
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            className="bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleTeamClick(team)}
                        >
                            {/* Team Logo/Header */}
                            <div className="p-6 text-center border-b">
                                {team.logo ? (
                                    <img
                                        src={team.logo}
                                        alt={team.name}
                                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-purple-500 mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {team.name?.charAt(0) || "T"}
                                        </span>
                                    </div>
                                )}
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {team.name || "Unnamed Team"}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Led by {team.leader || "Unknown Leader"}
                                </p>
                            </div>

                            {/* Team Preview */}
                            <div className="p-4">
                                <div className="flex items-center justify-center text-sm text-gray-600">
                                    {/* <span>{team.members?.length || 0} members</span> */}
                                    <span className="text-green-500 hover:text-green-600">
                                        View team activites →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-12">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNum
                                            ? "bg-green-500 text-white"
                                            : "text-gray-500 bg-white border border-gray-300 hover:bg-green-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Team Count */}
                {/* <div className="text-center mt-6 text-gray-500 text-sm">
          Showing {(currentPage - 1) * teamsPerPage + 1} to{" "}
          {Math.min(currentPage * teamsPerPage, totalTeams)} of {totalTeams} teams
        </div> */}
            </main>
        </div>
    );
}