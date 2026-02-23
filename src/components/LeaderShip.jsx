"use client";

import axios from "axios";
import { useEffect, useState } from "react";



function Leadership() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaders = async () => {
        try {
            const response = await axios.get('/api/leadership/get-all-leadership');

            const data = await response.data;

            if (data?.status === true) {
                setTeam(data?.leadership);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaders();
    }, []);

    const Loader = () => (
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center">
                    {/* Profile Image Loader */}
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200 animate-pulse"></div>

                    {/* Name Loader */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>

                    {/* Designation Loader */}
                    <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <div className="text-center mb-12 max-w-5xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Leadership Team</h3>
                <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            {
                loading ? <Loader /> :
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {team.map((member) => (
                            <div key={member?._id} className="bg-white rounded-lg p-6 text-center">
                                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-green-600">
                                    {
                                        member?.profile ?
                                            <img src={member?.profile} alt={member?.name} className="w-16 h-16 object-cover rounded-full" />
                                            :
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>}
                                </div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-1">
                                    {member?.name}
                                </h4>
                                <p className="text-green-600 font-medium mb-3">{member?.designation}</p>
                                {/* <p className="text-gray-600 text-sm">
                  {member.description}
                </p> */}
                            </div>
                        ))}
                    </div>
                    }
        </div>
    )
}

export default Leadership;