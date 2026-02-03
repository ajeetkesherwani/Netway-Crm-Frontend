
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";
import {
  deleteConfig,
  getAllConfigList,
  updateConfigStatus,
} from "../../service/roleConfig";
import toast from "react-hot-toast";
import ProtectedAction from "../../components/ProtectedAction";

export default function RoleConfigList() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openStatusModalId, setOpenStatusModalId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch configs
  const fetchConfigs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllConfigList();
      setConfigs(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching configs:", err);
      setError("Failed to load configs");
      toast.error("Failed to load configs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleView = (id) => {
    navigate(`/config/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/config/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id, name = "this config") => {
    if (!window.confirm(`Delete "${name}" permanently?`)) {
      setOpenMenuId(null);
      return;
    }

    try {
      await deleteConfig(id);
      setConfigs((prev) => prev.filter((c) => c._id !== id));
      toast.success("Config deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete config");
    }
    setOpenMenuId(null);
  };

  const handleUpdateStatus = async (id, status) => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    setIsUpdating(true);
    try {
      await updateConfigStatus(id, status);
      toast.success("Status updated successfully");
      await fetchConfigs(); // Refresh data
      setOpenStatusModalId(null);
      setNewStatus("");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  // Client-side search filter
  const displayedConfigs = configs.filter((config) => {
    const search = appliedSearch;
    if (!search) return true;
    return (
      config.type?.toLowerCase().includes(search) ||
      config.typeId?.resellerName?.toLowerCase().includes(search) ||
      config.generalInformation?.name?.toLowerCase().includes(search) ||
      config.generalInformation?.description?.toLowerCase().includes(search)
    );
  });

  if (loading)
    return <p className="p-6 text-gray-600">Loading configs...</p>;
  if (error)
    return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Config List

          </h1>
        </div>

        {/* Search + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by type"
              className="px-4 py-2 text-sm outline-none min-w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              Search
            </button>
          </div>

          <ProtectedAction module="configlist" action="Create">
            <button
              onClick={() => navigate("/config/create")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
            >
              Add Config
            </button>
          </ProtectedAction>
        </div>
      </div>

      {/* No Data Message */}
      {displayedConfigs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching configs found." : "No configs available."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Name / Reseller</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Created At</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedConfigs.map((config, index) => (
                    <tr key={config._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td
                        className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleView(config._id)}
                      >
                        {config.type || "—"}
                      </td>
                      <td className="px-4 py-2">
                        {config.typeId?.resellerName ||
                          config.generalInformation?.name ||
                          "—"}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {config.createdAt
                          ? new Date(config.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(config._id);
                          }}
                          className="p-2.5 hover:bg-gray-200 rounded-full transition"
                        >
                          <FaEllipsisV className="text-gray-600" />
                        </button>

                        {openMenuId === config._id && (
                          <div
                            className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ProtectedAction module="configlist" action="View">
                              <button
                                onClick={() => handleView(config._id)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEye className="text-blue-600" /> View
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="configlist" action="Edit">
                              <button
                                onClick={() => handleEdit(config._id)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-green-600" /> Edit
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="configlist" action="Delete">
                              <button
                                onClick={() =>
                                  handleDelete(
                                    config._id,
                                    config.typeId?.resellerName || config.type || "Config"
                                  )
                                }
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                              >
                                <FaTrash /> Delete
                              </button>
                            </ProtectedAction>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mt-6">
            {displayedConfigs.map((config, index) => (
              <div
                key={config._id}
                className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                    <h3
                      className="font-medium text-lg mt-1 text-blue-600 cursor-pointer"
                      onClick={() => handleView(config._id)}
                    >
                      {config.type || "—"}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {config.typeId?.resellerName ||
                        config.generalInformation?.name ||
                        "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {config.createdAt
                        ? new Date(config.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(config._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaEllipsisV className="text-gray-600" />
                  </button>
                </div>

                {openMenuId === config._id && (
                  <div className="mt-4 border-t pt-4">
                    <ProtectedAction module="configlist" action="View">
                      <button
                        onClick={() => handleView(config._id)}
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        View
                      </button>
                    </ProtectedAction>

                    <ProtectedAction module="configlist" action="Edit">
                      <button
                        onClick={() => handleEdit(config._id)}
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        Edit
                      </button>
                    </ProtectedAction>

                    <ProtectedAction module="configlist" action="Delete">
                      <button
                        onClick={() =>
                          handleDelete(
                            config._id,
                            config.typeId?.resellerName || config.type || "Config"
                          )
                        }
                        className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        Delete
                      </button>
                    </ProtectedAction>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Status Update Modal */}
      {openStatusModalId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Update Config Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspend">Suspend</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenStatusModalId(null);
                  setNewStatus("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(openStatusModalId, newStatus)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={!newStatus || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}