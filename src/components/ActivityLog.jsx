"use client";

import { useEffect, useState } from "react";
import AddIPModal from "./AddIPModal";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";

const ActivityLog = () => {
  const [enableIPWhitelisting, setEnableIPWhitelisting] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [customTime, setCustomTime] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTime, setLoadingTime] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);


  const fetchAllIps = async () => {
    try {
      const res = await axios.get(`/api/ip/get-all-ips?pageNumber=${currentPage}`);

      const data = res.data;

      if (data?.status === true) {
        setData(data?.ips);
        setLoading(false);
      }
    } catch (err) {
      console.log('error while fetching all IPs', err);
      setLoading(false);
    }
  };

  const fetchGlobal = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/global');

      const data = res.data;

      if (data?.status === true) {
        setEnableIPWhitelisting(data?.global?.whitelistEnabled || false);
        setSessionTime(data?.global?.sessionTimeout || 0);
      }
    } catch (err) {
      console.log('error while fetching global settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobal();
    fetchAllIps();
  }, [currentPage]);

  const handleEnable = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/global", {
        whitelistEnabled: !enableIPWhitelisting,
      });

      const data = res.data;

      if (data?.status === true) {
        setEnableIPWhitelisting(data?.global?.whitelistEnabled || false);
      }

    } catch (error) {
      console.log('error while enable ip whitelisting', error);
    } finally {
      setLoading(false);
      setConfirmModal(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/ip/delete-ip?id=${id}`);
      const data = res.data;

      if (data?.status === true) {
        toast.success("IP deleted successfully");
        fetchAllIps();
      }
    } catch (error) {
      console.log('error while delete ip', error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!customTime && !sessionTime) {
      toast.error("Please select a session time or enter a custom time");
      return;
    }

    setLoadingTime(true);
    try {
      const res = await axios.post("/api/global", {
        sessionTimeout: customTime || sessionTime,
      });

      const data = res.data;

      if (data?.status === true) {
        setSessionTime(data?.global?.sessionTimeout || 0);
        toast.success("Preferences saved successfully");
      }

    } catch (error) {
      console.log('error while saving preferences', error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingTime(false);
    }

  };

  return (
    <div className="space-y-6">
      <AddIPModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        editData={editData}
        setEditData={setEditData}
        fetchAllIPs={fetchAllIps}
      />

      <ConfirmationModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleEnable}
        title={`${enableIPWhitelisting ? "Disable" : "Enable"} IP Whitelisting`}
        message={`Are you sure you want to ${enableIPWhitelisting ? "disable" : "enable"} IP Whitelisting?`}
        loading={loading}
      />

      {/* IP Whitelisting Section */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white">
        <div className="text-xl font-bold mb-4">Activity logs</div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Allowed IP address</div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Enable IP Whitelisting</label>
            <input
              type="checkbox"
              checked={enableIPWhitelisting}
              onChange={(e) => setConfirmModal(true)}
              className="cursor-pointer w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
          </div>
        </div>

        {/* IP Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg mb-4">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data && data?.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setEditData(item);
                          setModalOpen(true);
                        }}
                        className="cursor-pointer text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item?._id)}
                        className="cursor-pointer text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 border border-gray-700 text-gray-900 rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer"
        >
          + Add New IP address
        </button>
      </div>

      {/* Session Timeout Settings */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white">
        <div className="text-lg font-semibold mb-4">Session timeout settings</div>
        <div className="text-sm mb-4">Session expiration time</div>

        <div className="space-y-3">
          {[1, 15, 30, 60].map((time) => (
            <label key={time} className="flex items-center">
              <input
                type="radio"
                name="sessionTime"
                value={time}
                checked={sessionTime === time}
                onChange={(e) => setSessionTime(Number(e.target.value))}
                className="cursor-pointer w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm">{time} minutes</span>
            </label>
          ))}

          <label className="flex items-center">
            <input
              type="radio"
              name="sessionTime"
              value="custom"
              checked={sessionTime === "custom"}
              onChange={() => setSessionTime("custom")}
              className="cursor-pointer w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm flex items-center gap-2">
              Custom
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                disabled={sessionTime !== "custom"}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              />
              minutes
            </span>
          </label>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={loadingTime}
          className="cursor-pointer mt-4 px-4 py-2 border border-gray-700 text-gray-900 rounded-lg hover:bg-gray-50 transition duration-150 disabled:opacity-50 flex items-center gap-2"
        >
          {loadingTime && (
            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          )}
          Save preferences
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;