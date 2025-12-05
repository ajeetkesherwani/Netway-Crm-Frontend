import React, { useEffect, useState } from "react";
import { getZones, updateZone, deleteZone } from "../../service/apiClient";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";

export default function ZoneList() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmZone, setConfirmZone] = useState(null); // { id, zoneName }
  // update modal state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateZoneData, setUpdateZoneData] = useState(null); // { id, currentName }
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
      setError(err.message || "Network error");
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

  // open update modal (replace prompt)
  const handleUpdate = (id, currentName) => {
    setUpdateZoneData({ id, currentName });
    setUpdateName(currentName || "");
    setUpdateOpen(true);
  };

  const confirmUpdate = async () => {
    if (!updateZoneData) return;
    const name = (updateName || "").trim();
    if (!name) {
      setError("Zone name is required");
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await updateZone(updateZoneData.id, { zoneName: name });
      if (res && (res.status === true || res.status === "success" || res.success)) {
        await fetchZones();
      } else if (res && res.message) {
        setError(res.message);
      } else {
        setError("Failed to update zone");
      }
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setUpdateLoading(false);
      setUpdateOpen(false);
      setUpdateZoneData(null);
      setUpdateName("");
    }
  };

  const cancelUpdate = () => {
    setUpdateOpen(false);
    setUpdateZoneData(null);
    setUpdateName("");
  };

  // open confirmation modal (instead of window.confirm)
  const handleDelete = (id, zoneName) => {
    setConfirmZone({ id, zoneName });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmZone) return;
    const { id } = confirmZone;
    try {
      const res = await deleteZone(id);
      if (res && (res.status === true || res.success || res.status === "deleted")) {
        await fetchZones();
      } else if (res && res.message) {
        setError(res.message);
      } else {
        setError("Failed to delete zone");
      }
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setConfirmOpen(false);
      setConfirmZone(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmZone(null);
  };

  if (loading) return <p className="p-4">Loading zones...</p>;
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Zone List</h1>
        <ProtectedAction module="setting" action="zoneCreate">
          <button
            onClick={() => navigate("/setting/zone/create")}
            className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Zone
          </button>
        </ProtectedAction>
      </div>
      {zones.length === 0 ? (
        <p className="text-gray-500">No zones found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[0px] text-left">S.No</th>
                  <th className="px-[2px] py-[0px] text-left">Zone Name</th>
                  <th className="px-[2px] py-[0px] text-left">Created By</th>
                  <th className="px-[2px] py-[0px] text-left">Created At</th>
                  <th className="px-[2px] py-[0px] text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zones.map((zone, index) => {
                  const date = new Date(zone.createdAt);
                  const dateStr = date.toLocaleString();
                  return (
                    <tr key={zone._id} className="hover:bg-gray-50">
                      <td className="px-[2px] py-[0px]">{index + 1}</td>
                      <td className="px-[2px] py-[0px]">{zone.zoneName}</td>
                      <td className="px-[2px] py-[0px]">{zone.createdBy}</td>
                      <td className="px-[2px] py-[0px]" title={dateStr}>
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-[2px] py-[0px] text-left">
                        <div className="flex items-center gap-1">
                          <ProtectedAction module="setting" action="zoneUpdate">
                            <button
                              onClick={() => handleUpdate(zone._id, zone.zoneName)}
                              className="p-1 text-gray-600 hover:text-green-600 rounded"
                              title="Update"
                            >
                              <FaEdit />
                            </button>
                          </ProtectedAction>
                          <ProtectedAction module="setting" action="zoneDelete">
                          <button
                            onClick={() => handleDelete(zone._id, zone.zoneName)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </ProtectedAction>
                      </div>
                    </td>
                    </tr>
              );
                })}
            </tbody>
          </table>
        </div>
      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {zones.map((zone, index) => {
          const date = new Date(zone.createdAt);
          const dateStr = date.toLocaleString();
          return (
            <div
              key={zone._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="text-sm text-gray-500">{index + 1}</p>
              <h2 className="text-lg font-medium">{zone.zoneName}</h2>
              <p className="text-sm">Created By: {zone.createdBy}</p>
              <p className="text-sm" title={dateStr}>
                Created At: {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="flex justify-end space-x-3 mt-3">
                <button
                  onClick={() => handleUpdate(zone._id, zone.zoneName)}
                  className="text-green-600 flex items-center text-sm"
                >
                  <FaEdit className="mr-1" /> Update
                </button>
                <button
                  onClick={() => handleDelete(zone._id, zone.zoneName)}
                  className="text-red-600 flex items-center text-sm"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )
}

{/* Confirmation modal */ }
{
  confirmOpen && confirmZone && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={cancelDelete} />
      <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
        <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
        <p className="mb-4">Are you sure you want to delete zone "<strong>{confirmZone.zoneName}</strong>"?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

{/* Update modal */ }
{
  updateOpen && updateZoneData && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={cancelUpdate} />
      <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
        <h3 className="text-lg font-semibold mb-3">Update Zone</h3>
        <label className="block text-sm mb-2">Zone Name</label>
        <input
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter zone name"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelUpdate}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={updateLoading}
          >
            Cancel
          </button>
          <button
            onClick={confirmUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={updateLoading}
          >
            {updateLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}
    </div >
  );
}