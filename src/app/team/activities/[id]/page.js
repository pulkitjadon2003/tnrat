"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import { State, City } from 'country-state-city';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    CalendarIcon,
    FunnelIcon,
    PhotoIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function ActivitiesPage() {
    const router = useRouter();
    const params = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        state: '',
        city: '',
        year: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [availableStates, setAvailableStates] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);

    const fetchFilter = async () => {
        try {
            const response = await axios.post(`/api/post/search-team-post?pageNumber=${page}?team=${params.id}`, filters);

            if (response?.data?.status === true) {
                const data = response.data;

                setActivities(data.posts || []);
                setHasMore(data.posts?.length === 10);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchActivities = async (pageNum = 1) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await axios.get(`/api/post/get-all-team-posts-for-user?pageNumber=${pageNum}&team=${params.id}`);

            if (response?.data?.status === true) {
                const newActivities = response?.data?.posts || [];

                if (pageNum === 1) {
                    setActivities(newActivities);
                } else {
                    setActivities(prev => [...prev, ...newActivities]);
                }

                setHasMore(newActivities.length === 10);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const allStates = State.getStatesOfCountry("IN");
        setAvailableStates(allStates.map((s) => s.name));
    }, []);

    useEffect(() => {
        if (filters.state) {
            const selectedState = State.getStatesOfCountry("IN").find(
                (s) => s.name === filters.state
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
    }, [filters?.state]);


    useEffect(() => {
        fetchActivities(1, true);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = () => {
        setPage(1);
        setActivities([]);
        fetchFilter()
        // setShowFilters(false);
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            state: '',
            city: '',
            year: '',
        });
        setPage(1);
        setActivities([]);
        fetchActivities(1, true);
        setShowFilters(false);
    };


    const handleScroll = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

        // Load more when 100px from bottom
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            fetchActivities(page + 1);
        }
    }, [loadingMore, hasMore, page, filters]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Handle activity click
    const handleActivityClick = (activityId) => {
        router.push(`/post/${activityId}`);
    };

    // Media preview component
    const MediaPreview = ({ activity }) => {
        const hasImages = activity?.images?.length > 0;
        const hasVideo = activity?.video;

        return (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
                {hasImages && (
                    <div className="flex items-center">
                        <PhotoIcon className="w-3 h-3 mr-1" />
                        <span>{activity.images.length}</span>
                    </div>
                )}
                {hasVideo && (
                    <div className="flex items-center">
                        <VideoCameraIcon className="w-3 h-3 mr-1" />
                        <span>Video</span>
                    </div>
                )}
            </div>
        );
    };

    if (loading && activities?.length === 0) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-green-50">
            <div className="bg-white border-b border-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ search: e.target.value }))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilters();
                                    }
                                }}
                                className="block text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                            {/* State Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                <select
                                    value={filters.state}
                                    onChange={(e) => handleFilterChange('state', e.target.value)}
                                    className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All States</option>
                                    {availableStates?.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div className="text-black">
                                <label className="block text-sm font-medium text-black mb-1">
                                    City
                                </label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Cities</option>
                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div className="text-black">
                                <label className="block text-black text-sm font-medium text-gray-700 mb-1">
                                    Year
                                </label>
                                <input
                                    type="number"
                                    placeholder="Year"
                                    value={filters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="block text-black w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />

                            </div>

                            <div className="flex gap-2 mt-2 items-center justify-end">
                                <button
                                    onClick={applyFilters}
                                    className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Apply
                                </button>

                                <button
                                    onClick={resetFilters}
                                    className="cursor-pointer inline-flex items-center px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {(filters.state || filters.city || filters.year) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {filters.state && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    State: {filters.state}
                                    <button
                                        onClick={() => handleFilterChange('state', '')}
                                        className="ml-1 hover:text-green-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.city && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    City: {filters.city}
                                    <button
                                        onClick={() => handleFilterChange('city', '')}
                                        className="ml-1 hover:text-blue-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.year && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Year: {filters.year}
                                    <button
                                        onClick={() => handleFilterChange('year', '')}
                                        className="ml-1 hover:text-purple-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Activities Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg border border-green-200 p-8">
                            <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search criteria or filters.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map((activity) => (
                                <div
                                    key={activity._id}
                                    className="bg-white rounded-xl border border-green-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                >
                                    {/* Image with Team Badge */}
                                    <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                                        <img
                                            src={activity.images?.[0]}
                                            alt={activity.title}
                                            className="w-full h-48 object-cover"
                                        />

                                        {/* Team Name Badge */}
                                        {activity.team && (
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border border-green-600">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                    </svg>
                                                    {activity.team?.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {activity?.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                            {activity?.description}
                                        </p>

                                        {/* Metadata */}
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {dayjs(activity?.caseDate).format('DD MMM, YYYY')}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPinIcon className="w-4 h-4 mr-1" />
                                                {activity?.city}, {activity?.state}
                                            </div>

                                            <MediaPreview activity={activity} />
                                        </div>

                                        {/* Read More */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => handleActivityClick(activity?._id)}
                                                className="cursor-pointer text-green-600 hover:text-green-700 text-sm font-medium transition duration-300 flex items-center">
                                                View Details
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Loading More Indicator */}
                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        )}

                        {/* No More Content */}
                        {!hasMore && activities.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">You've reached the end of the list</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}