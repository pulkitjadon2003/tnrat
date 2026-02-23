"use client";

import { CurrencyRupeeIcon, UsersIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [memberChartData, setMemberChartData] = useState([]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/api/super-admin/fetch-analytics');
      if (response.data?.status === true) {
        setData(response?.data);

        // Transform data for charts
        if (response.data.monthlyData) {
          const transformedData = response.data.monthlyData.map(item => ({
            month: item?.month,
            members: item?.members,
            donations: item?.donations / 1000,
            applications: item?.applications
          }));
          setChartData(transformedData);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchMemberChartData = async () => {
    try {
      const response = await axios.get('/api/super-admin/fetch-member-chart-data');

      if (response?.data?.status === true) {
        setChartData(response.data?.data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchDonationChartData = async () => {
    try {
      const response = await axios.get('/api/super-admin/fetch-donation-chart-data');

      if (response?.data?.status === true) {
        const transformed = response.data.data.map(item => ({
          month: item.month,
          donations: item.totalDonations / 1000,
          transactions: item.totalTransactions
        }));
        setMemberChartData(transformed);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    fetchMemberChartData();
    fetchDonationChartData();
  }, []);


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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'donations' ? formatINRCurrency(entry.value * 1000) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 text-black border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-gray-600 text-base">Here's your analytics overview for TNRAT.</p>
          </div>
          <div className="mt-4 lg:mt-0">
            {/* <button className="bg-green-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition duration-200 cursor-pointer shadow-sm">
              Generate Report
            </button> */}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{data?.totalMembers || '0'}</p>
              {/* <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p> */}
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>
        </div>


          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{data?.activeMembers || '0'}</p>
              {/* <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p> */}
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{data?.pendingMembers || '0'}</p>
              {/* <p className="text-xs text-red-600 font-medium mt-1">{data?.pendingMembers} need immediate attention</p> */}
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donation</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatINRCurrency(data?.totalDonation) || formatINRCurrency(0)}</p>
              {/* <p className="text-xs text-green-600 font-medium mt-1">↑ 18% from last month</p> */}
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <CurrencyRupeeIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600"> Joining Fee Earning</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatINRCurrency(data?.joiningFeeEarning) || formatINRCurrency(0)}</p>
              {/* <p className="text-xs text-green-600 font-medium mt-1">↑ 18% from last month</p> */}
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <CurrencyRupeeIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Member Subscription Earning</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{formatINRCurrency(data?.subscriptionEarning) || formatINRCurrency(0)}</p>
              {/* <p className="text-xs text-green-600 font-medium mt-1">↑ 18% from last month</p> */}
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <CurrencyRupeeIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Members Growth</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total Members</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="members" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMembers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donations Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Donations Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Donations (in thousands)</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memberChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
}