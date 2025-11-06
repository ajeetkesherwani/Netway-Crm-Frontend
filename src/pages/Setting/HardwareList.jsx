import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import {
  getHardwareList,
  deleteHardware,
  updateHardware,
  assignHardware,
  getAllUserList,
} from "../../service/hardware";

export default function HardwareList() {
  const navigate = useNavigate();
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // users list (for assign)
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmHw, setConfirmHw] = useState(null); // { id, name }

  // update modal state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateHwData, setUpdateHwData] = useState(null); // { id, currentName }
  const [updateName, setUpdateName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // assign modal state
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignHw, setAssignHw] = useState(null); // { id, name }
  const [assignUserId, setAssignUserId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const fetchHardware = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHardwareList();
      // API returns {status:true, message, data: [...]}
      const list = Array.isArray(res)
        ? res
        : res?.data ?? res?.result ?? res?.hardware ?? [];
      setHardware(list);
    } catch (err) {
      setError(err?.message || "Failed to load hardware");
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await getAllUserList();
      const list = Array.isArray(res) ? res : res?.data ?? res?.users ?? [];
      setUsers(list);
    } catch (err) {
      // keep quiet, assign modal will show message
      console.error("Failed to load users", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchHardware();
    // prefetch users so assigned names can show in table
    fetchUsers();
  }, []);

  // helper map for assigned name display
  const usersMap = users.reduce((acc, u) => {
    // user object may have generalInformation?.name or name/email
    const id = u._id || u.id;
    const name = u.generalInformation?.name || u.name || u.fullName || u.email || id;
    if (id) acc[id] = name;
    return acc;
  }, {});

  // Delete flow (modal)
  const handleDelete = (id, name) => {
    setConfirmHw({ id, name: name || "Item" });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmHw) return;
    try {
      await deleteHardware(confirmHw.id);
      await fetchHardware();
    } catch (err) {
      setError(err?.message || "Failed to delete hardware");
    } finally {
      setConfirmOpen(false);
      setConfirmHw(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmHw(null);
  };

  // Open update page (use HardwareUpdate page instead of modal)
  const handleUpdate = (id) => {
    navigate(`/setting/hardware/update/${id}`);
  };

  // Assign flow (modal)
  const handleOpenAssign = (id, name) => {
    setAssignHw({ id, name: name || "Item" });
    setAssignUserId("");
    setAssignError(null);
    setAssignOpen(true);
    // ensure users are loaded
    if (users.length === 0) fetchUsers();
  };

  const confirmAssign = async () => {
    if (!assignHw) return;
    if (!assignUserId) {
      setAssignError("Please select a user");
      return;
    }
    setAssignLoading(true);
    setAssignError(null);
    try {
      // payload keys depend on backend; using common shape:
      // { hardwareId, assignedTo }
      await assignHardware({ hardwareId: assignHw.id, userId: assignUserId });
      await fetchHardware();
      setAssignOpen(false);
      setAssignHw(null);
      setAssignUserId("");
    } catch (err) {
      setAssignError(err?.message || "Failed to assign hardware");
    } finally {
      setAssignLoading(false);
    }
  };
  const cancelAssign = () => {
    setAssignOpen(false);
    setAssignHw(null);
    setAssignUserId("");
    setAssignError(null);
  };
  if (loading) return <p className="p-4">Loading hardware...</p>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Hardware List</h1>
        {/* <ProtectedAction module="hardware" action="create"> */}
          <button
            onClick={() => navigate("/setting/hardware/create")}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            aria-label="Add Hardware"
          >
            Add Hardware
          </button>
        {/* </ProtectedAction> */}
      </div>

      {hardware.length === 0 ? (
        <p className="text-gray-500">No hardware found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[1000px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Name</th>
                  <th className="px-[2px] py-[2px] text-left">Type</th>
                  <th className="px-[2px] py-[2px] text-left">Brand / Model</th>
                  <th className="px-[2px] py-[2px] text-left">Serial</th>
                  <th className="px-[2px] py-[2px] text-left">Assigned To</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hardware.map((hw, idx) => {
                  const id = hw._id || hw.id;
                  const name = hw.hardwareName || hw.name || "-";
                  const type = hw.hardwareType || hw.type || "-";
                  const brandModel = `${hw.brand || "-"} ${hw.model || ""}`.trim();
                  const serial = hw.serialNumber || hw.serialNo || hw.serial || "-";
                  const assigned = hw.assignedTo;
                  const assignedLabel = assigned ? (usersMap[assigned] || assigned) : "-";
                  const status = hw.status || "-";
                  return (
                    <tr key={id || idx} className="hover:bg-gray-50 relative">
                      <td className="px-[2px] py-[2px]">{idx + 1}</td>
                      <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline" onClick={() => navigate(`/setting/hardware/view/${id}`)}>
                        {name}
                      </td>
                      <td className="px-[2px] py-[2px]">{type}</td>
                      <td className="px-[2px] py-[2px]">{brandModel}</td>
                      <td className="px-[2px] py-[2px]">{serial}</td>
                      <td className="px-[2px] py-[2px]">{assignedLabel}</td>
                      <td className="px-[2px] py-[2px]">{status}</td>
                      <td className="px-[2px] py-[2px] text-right">
                        <div className="flex items-center space-x-2 justify-start">
                          {/* <ProtectedAction module="hardware" action="view"> */}
                          <button
                            onClick={() => navigate(`/setting/hardware/view/${id}`)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                            aria-label="View"
                          >
                            <FaEye size={16} />
                          </button>
                          {/* </ProtectedAction> */}

                          {/* <ProtectedAction module="hardware" action="edit"> */}
                          <button
                            onClick={() => handleUpdate(id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          {/* </ProtectedAction> */}

                          {/* <ProtectedAction module="hardware" action="assign"> */}
                          <button
                            onClick={() => handleOpenAssign(id, name)}
                            className="p-1 text-indigo-600 hover:bg-gray-100 focus:outline-none"
                            title="Assign"
                            aria-label="Assign"
                          >
                            Assign
                          </button>
                          {/* </ProtectedAction> */}

                          {/* <ProtectedAction module="hardware" action="delete"> */}
                          <button
                            onClick={() => handleDelete(id, name)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                          {/* </ProtectedAction> */}
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
            {hardware.map((hw, idx) => {
              const id = hw._id || hw.id;
              const name = hw.hardwareName || hw.name || "-";
              const serial = hw.serialNumber || hw.serialNo || hw.serial || "-";
              const assigned = hw.assignedTo;
              const assignedLabel = assigned ? (usersMap[assigned] || assigned) : "-";
              return (
                <div key={id || idx} className="p-4 border rounded-lg shadow-sm bg-white">
                  <p className="text-sm text-gray-500">#{idx + 1}</p>
                  <h2 className="text-lg font-medium">{name}</h2>
                  <p className="text-sm">Serial: {serial}</p>
                  <p className="text-sm">Assigned: {assignedLabel}</p>
                  <div className="flex justify-end space-x-3 mt-3">
                    {/* <ProtectedAction module="hardware" action="view"> */}
                    <button
                      onClick={() => navigate(`/setting/hardware/view/${id}`)}
                      className="px-2 py-1 text-sm text-blue-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="View"
                    >
                      <FaEye className="mr-1" size={14} /> View
                    </button>
                    {/* </ProtectedAction> */}
                    {/* <ProtectedAction module="hardware" action="edit"> */}
                    <button
                      onClick={() => handleUpdate(id)}
                      className="px-2 py-1 text-sm text-green-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="Edit"
                    >
                      <FaEdit className="mr-1" size={14} /> Edit
                    </button>
                    {/* </ProtectedAction> */}
                    {/* <ProtectedAction module="hardware" action="assign"> */}
                    <button
                      onClick={() => handleOpenAssign(id, name)}
                      className="px-2 py-1 text-sm text-indigo-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="Assign"
                    >
                      Assign
                    </button>
                    {/* </ProtectedAction> */}
                    {/* <ProtectedAction module="hardware" action="delete"> */}
                    <button
                      onClick={() => handleDelete(id, name)}
                      className="px-2 py-1 text-sm text-red-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="Delete"
                    >
                      <FaTrash className="mr-1" size={14} /> Delete
                    </button>
                    {/* </ProtectedAction> */}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* Confirmation modal */}
      {confirmOpen && confirmHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelDelete} />
          <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete hardware "<strong>{confirmHw.name}</strong>"?</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Update modal */}
      {updateOpen && updateHwData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelUpdate} />
          <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
            <h3 className="text-lg font-semibold mb-3">Update Hardware</h3>
            <label className="block text-sm mb-2">Hardware Name</label>
            <input
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter hardware name"
            />
            <div className="flex justify-end gap-3">
              <button onClick={cancelUpdate} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={updateLoading}>Cancel</button>
              <button onClick={confirmUpdate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign modal */}
      {assignOpen && assignHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelAssign} />
          <div className="bg-white rounded-lg shadow-lg z-60 max-w-md w-full p-5">
            <h3 className="text-lg font-semibold mb-3">Assign Hardware</h3>
            <p className="mb-3">Assign "<strong>{assignHw.name}</strong>" to a user</p>

            {assignError && <div className="text-red-600 mb-3">{assignError}</div>}

            <div className="mb-4">
              <label className="block text-sm mb-2">Select User</label>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">-- Select User --</option>
                {usersLoading && <option disabled>Loading users...</option>}
                {users.map((u) => {
                  const id = u._id || u.id;
                  const label = u.generalInformation?.name || u.name || u.email || id;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={cancelAssign} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={assignLoading}>Cancel</button>
              <button onClick={confirmAssign} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={assignLoading}>
                {assignLoading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}