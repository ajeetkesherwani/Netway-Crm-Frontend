import React, { useEffect, useState } from "react";
import { getZones, updateZone, deleteZone } from "../../service/apiClient";
import { FaEye, FaEdit, FaTrash, FaEllipsisV, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function ZoneList() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const navigate = useNavigate();

  // Modals
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmZone, setConfirmZone] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateZoneData, setUpdateZoneData] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getZones();
      if (res.status) setZones(res.data || []);
      else setError(res.message || "Failed to load zones");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (id) => {
    navigate(`/setting/zone/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id, currentName) => {
    setUpdateZoneData({ id, currentName });
    setUpdateName(currentName || "");
    setUpdateOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (id, zoneName) => {
    setConfirmZone({ id, zoneName });
    setConfirmOpen(true);
    setOpenMenuId(null);
  };

  const confirmUpdate = async () => {
    if (!updateZoneData) return;
    const name = updateName.trim();
    if (!name) {
      toast.error("Zone name is required");
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await updateZone(updateZoneData.id, { zoneName: name });
      if (res?.status || res?.success) {
        toast.success("Zone updated successfully");
        await fetchZones();
        setUpdateOpen(false);
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setUpdateLoading(false);
      setUpdateZoneData(null);
      setUpdateName("");
    }
  };

  const confirmDelete = async () => {
    if (!confirmZone) return;
    try {
      const res = await deleteZone(confirmZone.id);
      if (res?.status || res?.success) {
        toast.success("Zone deleted successfully");
        await fetchZones();
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setConfirmOpen(false);
      setConfirmZone(null);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  const exportToExcel = () => {
    if (zones.length === 0) {
      toast.error("No zones to export");
      return;
    }
    const data = zones.map((z, i) => ({
      "S.No": i + 1,
      "Zone Name": z.zoneName,
      "Created By": z.createdBy || "—",
      "Created At": new Date(z.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Zones");
    XLSX.writeFile(wb, "zone_list.xlsx");
    toast.success("Zones exported successfully!");
  };

  const displayedZones = zones.filter((zone) =>
    zone.zoneName.toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-gray-600">Loading zones...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Title in Two Lines */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Zone List
            List
          </h1>
        </div>

        {/* Search + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search zones..."
              className="px-4 py-2 text-sm outline-none min-w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Download Excel
            </button>

            <ProtectedAction module="setting" action="zoneCreate">
              <button
                onClick={() => navigate("/setting/zone/create")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
              >
                Add Zone
              </button>
            </ProtectedAction>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-xl">×</button>
        </div>
      )}

      {/* Table */}
      {displayedZones.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching zones found." : "No zones available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">S.No</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Zone Name</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Created By</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Created At</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedZones.map((zone, index) => {
                  const date = new Date(zone.createdAt);
                  return (
                    <tr key={zone._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{zone.zoneName}</td>
                      <td className="px-6 py-4 text-gray-600">{zone.createdBy || "—"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(zone._id);
                          }}
                          className="p-2.5 hover:bg-gray-200 rounded-full transition"
                        >
                          <FaEllipsisV className="text-gray-600" />
                        </button>

                        {openMenuId === zone._id && (
                          <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleView(zone._id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                            >
                              <FaEye className="text-blue-600" /> View
                            </button>

                            <ProtectedAction module="setting" action="zoneUpdate">
                              <button
                                onClick={() => handleEdit(zone._id, zone.zoneName)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-green-600" /> Edit
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="setting" action="zoneDelete">
                              <button
                                onClick={() => handleDelete(zone._id, zone.zoneName)}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                              >
                                <FaTrash /> Delete
                              </button>
                            </ProtectedAction>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmOpen && confirmZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Delete "<strong>{confirmZone.zoneName}</strong>" permanently?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateOpen && updateZoneData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Update Zone</h3>
            <input
              type="text"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              placeholder="Zone name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUpdateOpen(false)}
                disabled={updateLoading}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                disabled={updateLoading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}