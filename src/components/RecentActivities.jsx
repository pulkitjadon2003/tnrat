"use client";

import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function RecentActivities() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/post/get-post-for-home');
      const data = await response.data;

      if (data.status === true) {
        setActivities(data?.posts);
      }

    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  // Loader component
  const Loader = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5">
              <div className="h-48 md:h-full bg-gray-200 animate-pulse"></div>
            </div>

            <div className="md:w-3/5 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 px-4" style={{ backgroundColor: 'white' }}>
      <div className="bg-white-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Recent Activities</h2>
          <p className="text-gray-600">
            Check out our latest initiatives and events making a difference in our community.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {activities?.map((activity) => (
                <div key={activity?._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      {/* <div 
                      className="h-48 md:h-full bg-gray-200 flex items-center justify-center relative">
                        <img
                          src={activity?.images?.[0]}
                          alt={activity?.title}
                          className="w-full h-full object-fill"
                        />
                      </div> */}

                      <div
                        className="h-48 md:h-full bg-gray-200 flex items-center justify-center relative">
                        <img
                          src={activity.images?.[0]}
                          alt={activity.title}
                          className="w-full h-full object-fill"
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
                    </div>

                    <div className="md:w-3/5 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 pr-2">
                           {activity?.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {activity?.description}
                      </p>

                      <span className="text-sm text-green-500 whitespace-nowrap rounded-full mb-2">
                        {dayjs(activity?.caseDate).format('DD MMMM, YYYY')}
                      </span>

                      <div className="text-sm text-gray-500 whitespace-nowrap rounded-full mb-2">
                        {activity?.city}, {activity?.state}
                      </div>

                      <button
                        onClick={() => router.push(`/post/${activity?._id}`)}
                        className="underline cursor-pointer text-green-600 hover:text-green-700 text-xs font-medium transition duration-300 flex items-center"
                      >
                        Read more
                        <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/post")}
                className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition duration-300 shadow-sm">
                View All Activities
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}