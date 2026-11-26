import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaUserPlus,
  FaUpload,
} from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import {
  getHardwareList,
  deleteHardware,
  assignHardware,
  getAllUserList,
  bulkUploadHardware,
} from "../../service/hardware";
import { getStaff } from "../../service/staffService";
import Select from "react-select";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function HardwareList() {
  const navigate = useNavigate();
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const fileInputRef = React.useRef(null);

  // Users for assign
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  // Modals
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmHw, setConfirmHw] = useState(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignHw, setAssignHw] = useState(null);
  const [assignType, setAssignType] = useState("staff");
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const fetchHardware = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHardwareList();
      const list = Array.isArray(res)
        ? res
        : res?.data ?? res?.result ?? res?.hardware ?? [];
      setHardware(list);
    } catch (err) {
      setError("Failed to load hardware");
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
      console.error("Failed to load users", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const res = await getStaff();
      const list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.staff || res?.staff || [];
      setStaff(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchHardware();
    fetchUsers();
    fetchStaff();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (id) => {
    navigate(`/setting/hardware/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/setting/hardware/update/${id}`);
    setOpenMenuId(null);
  };

  const handleAssign = (id, name) => {
    setAssignHw({ id, name });
    setAssignType("staff");
    setAssignTarget(null);
    setAssignError(null);
    setAssignOpen(true);
    if (users.length === 0 && !usersLoading) fetchUsers();
    if (staff.length === 0 && !staffLoading) fetchStaff();
    setOpenMenuId(null);
  };

  const handleDelete = (id, name) => {
    setConfirmHw({ id, name: name || "Item" });
    setConfirmOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!confirmHw) return;
    try {
      await deleteHardware(confirmHw.id);
      toast.success("Hardware deleted successfully");
      await fetchHardware();
    } catch (err) {
      toast.error("Failed to delete hardware");
    } finally {
      setConfirmOpen(false);
      setConfirmHw(null);
    }
  };

  const confirmAssign = async () => {
    if (!assignHw || !assignTarget) {
      setAssignError("Please select a user or staff member");
      return;
    }
    setAssignLoading(true);
    try {
      await assignHardware({
        hardwareId: assignHw.id,
        [assignTarget.type === "staff" ? "staffId" : "userId"]: assignTarget.value,
      });
      toast.success("Hardware assigned successfully");
      await fetchHardware();
      setAssignOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to assign");
    } finally {
      setAssignLoading(false);
      setAssignHw(null);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Uploading hardware...", { id: "upload-hw" });
      await bulkUploadHardware(formData);
      toast.success("Bulk upload successful", { id: "upload-hw" });
      fetchHardware();
    } catch (err) {
      toast.error(err.message || "Bulk upload failed", { id: "upload-hw" });
    }
    
    // Reset input
    e.target.value = null;
  };

  const exportToExcel = () => {
    if (hardware.length === 0) {
      toast.error("No hardware to export");
      return;
    }
    const data = hardware.map((hw, i) => ({
      "S.No": i + 1,
      Name: hw.hardwareName || hw.name || "-",
      Type: hw.hardwareType || hw.type || "-",
      "Brand/Model": `${hw.brand || ""} ${hw.model || ""}`.trim() || "-",
      Serial: hw.serialNumber || hw.serialNo || "-",
      "Assigned To": getAssignedName(hw.assignedTo, hw.assignedToStaff),
      Status: hw.status || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hardware");
    XLSX.writeFile(wb, "hardware_list.xlsx");
    toast.success("Hardware exported successfully!");
  };

  const getAssignedName = (userId, staffId) => {
    const getId = (value) =>
      value && typeof value === "object" ? value._id || value.id : value;

    if (staffId) {
      const id = getId(staffId);
      const assignedStaff = staff.find((member) => (member._id || member.id) === id);
      return `Staff: ${
        assignedStaff?.staffName ||
        assignedStaff?.name ||
        (typeof staffId === "object" ? staffId.staffName || staffId.name : id)
      }`;
    }
    if (!userId) return "-";
    const id = getId(userId);
    const user = users.find((item) => (item._id || item.id) === id);
    return `User: ${
      user?.generalInformation?.name ||
      user?.name ||
      user?.email ||
      (typeof userId === "object"
        ? userId.generalInformation?.name || userId.name || id
        : id)
    }`;
  };

  const assignmentOptions =
    assignType === "staff"
      ? staff.map((member) => {
          const id = member._id || member.id;
          return {
            value: id,
            type: "staff",
            label: member.staffName || member.name || member.email || id,
          };
        })
      : users.map((user) => {
          const id = user._id || user.id;
          return {
            value: id,
            type: "user",
            label: user.generalInformation?.name || user.name || user.email || id,
          };
        });

  const displayedHardware = hardware.filter((hw) =>
    (hw.hardwareName || hw.name || "").toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-gray-600">Loading hardware...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Title in Two Lines */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Hardware Lists
            
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
              placeholder="Search hardware name"
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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
            />
            
            <button
              onClick={handleBulkUploadClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
            >
              <FaUpload /> Bulk Upload
            </button>

            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Download as Excel
            </button>

            <ProtectedAction module="setting" action="HardwareCreate">
              <button
                onClick={() => navigate("/setting/hardware/create")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
              >
                Add Hardware
              </button>
            </ProtectedAction>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-xl">
            ×
          </button>
        </div>
      )}

      {/* Table */}
      {displayedHardware.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching hardware found." : "No hardware available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Brand / Model</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Serial</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Assigned To</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedHardware.map((hw, idx) => {
                  const id = hw._id || hw.id;
                  const name = hw.hardwareName || hw.name || "-";
                  const type = hw.hardwareType || hw.type || "-";
                  const brandModel = `${hw.brand || ""} ${hw.model || ""}`.trim() || "-";
                  const serial = hw.serialNumber || hw.serialNo || "-";
                  const assignedName = getAssignedName(hw.assignedTo, hw.assignedToStaff);
                  const status = hw.status || "-";

                  return (
                    <tr key={id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                      <td
                        className="px-6 py-4 font-medium text-gray-600 hover:underline cursor-pointer"
                        onClick={() => handleView(id)}
                      >
                        {name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{type}</td>
                      <td className="px-4 py-2 text-gray-600">{brandModel}</td>
                      <td className="px-4 py-2 text-gray-600">{serial}</td>
                      <td className="px-4 py-2 text-gray-600">{assignedName}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === "active" || status === "assigned"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(id);
                          }}
                          className="p-2.5 hover:bg-gray-200 rounded-full transition"
                        >
                          <FaEllipsisV className="text-gray-600" />
                        </button>

                        {openMenuId === id && (
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleView(id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                            >
                              <FaEye className="text-blue-600" /> View
                            </button>

                            <ProtectedAction module="setting" action="HardwareUpdate">
                              <button
                                onClick={() => handleEdit(id)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-green-600" /> Edit
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="setting" action="HardwareAssign">
                              <button
                                onClick={() => handleAssign(id, name)}
                                className="w-full text-left px-4 py-3 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-3"
                              >
                                <FaUserPlus /> Assign
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="setting" action="HardwareRemove">
                              <button
                                onClick={() => handleDelete(id, name)}
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
      {confirmOpen && confirmHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Delete "<strong>{confirmHw.name}</strong>" permanently?
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

      {/* Assign Modal */}
      {assignOpen && assignHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Assign Hardware</h3>
            <p className="text-gray-600 mb-4">
              Assign "<strong>{assignHw.name}</strong>" to:
            </p>

            {assignError && <p className="text-red-600 mb-4">{assignError}</p>}

            <div
              role="tablist"
              aria-label="Choose who to assign this hardware to"
              className="mb-4 flex border-b border-gray-200"
            >
              {[
                { id: "staff", label: "Staff" },
                { id: "user", label: "User" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={assignType === tab.id}
                  onClick={() => {
                    setAssignType(tab.id);
                    setAssignTarget(null);
                    setAssignError(null);
                  }}
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    assignType === tab.id
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Select
              value={assignTarget}
              onChange={setAssignTarget}
              options={assignmentOptions}
              isLoading={assignType === "staff" ? staffLoading : usersLoading}
              isClearable
              placeholder={`Search and select ${assignType === "staff" ? "staff" : "a user"}...`}
              noOptionsMessage={() =>
                `No ${assignType === "staff" ? "staff" : "users"} found`
              }
              className="mb-6"
              classNamePrefix="react-select"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAssignOpen(false)}
                disabled={assignLoading}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={assignLoading || !assignTarget}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
              >
                {assignLoading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}