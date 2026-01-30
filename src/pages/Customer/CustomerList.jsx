import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaKey,
  FaTicketAlt,
  FaSync,
  FaUserAlt,
  FaEye,
} from "react-icons/fa";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import {
  deleteUser,
  getAllUserList,
  updateUserStatus,
  resetUserPassword,
} from "../../service/user";
import { toast } from "react-toastify";
import ProtectedAction from "../../components/ProtectedAction";
import { useDebounce } from "../../hooks/useDebounce";
import CustomerFilters from "./components/CustomerFilters";
import * as XLSX from "xlsx";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openStatusModalId, setOpenStatusModalId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // NEW: Password change modal states
  const [openPasswordModalId, setOpenPasswordModalId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    searchQuery: searchParams.get("searchQuery") || "",
    status: searchParams.get("status") || "",
    area: searchParams.get("area") || "",
    subZone: searchParams.get("subZone") || "",
    ekyc: searchParams.get("ekyc") || "",
    serviceOpted: searchParams.get("serviceOpted") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    reseller: searchParams.get("reseller") || "",
    lco: searchParams.get("lco") || "",
    cafUploaded: searchParams.get("cafUploaded") || "",
  };

  const debouncedSearch = useDebounce(filters.searchQuery, 500);

  const menuRefs = useRef({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        const ref = menuRefs.current[openMenuId];
        if (ref && !ref.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // Fetch users
  const loadUsers = async () => {
    try {
      const res = await getAllUserList({ ...filters });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [
    debouncedSearch,
    filters.status,
    filters.area,
    filters.subZone,
    filters.ekyc,
    filters.serviceOpted,
    filters.startDate,
    filters.endDate,
    filters.reseller,
    filters.lco,
    filters.cafUploaded,
  ]);

  const toggleMenu = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const toggleStatus = (userId, currentStatus) => {
    setNewStatus(currentStatus);
    setOpenStatusModalId(userId);
    setOpenMenuId(null);
  };

  // FIX: Correct view route
  const handleView = (id) => {
    navigate(`/user/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/user/update/${id}`);
    setOpenMenuId(null);
  };

  // FIX: Delete + Refresh full list
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully ✅");
        await loadUsers(); // refresh list
        setOpenMenuId(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user ❌");
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      toast.success("User status updated successfully ✅");
      await loadUsers();
      setOpenStatusModalId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update user status ❌"
      );
    }
  };

  // NEW: Open password change modal
  const handleChangePassword = (id) => {
    setOpenPasswordModalId(id);
    setNewPassword("");
    setPasswordError("");
    setOpenMenuId(null);
  };

  // NEW: Submit password change
  const handlePasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    try {
      await resetUserPassword(openPasswordModalId, newPassword);
      toast.success("Password changed successfully!");
      setOpenPasswordModalId(null);
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  const handleCreateTicket = (id) => {
    navigate(`/ticket/create?userId=${id}`);
    setOpenMenuId(null);
  };

  const handleRechargePackage = (userId) => {
    navigate(`/user/profile/${userId}/recharge-package`);
    setOpenMenuId(null);
  };

  const handleLoginAsCustomer = () => {
    toast.info("Login as customer - coming soon");
  };

  if (loading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <CustomerFilters filters={filters} setSearchParams={setSearchParams} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold">Customer List</h1>

        <div className="flex flex-wrap gap-3">
          {/* Download Excel Button */}
          <button
            onClick={() => {
              if (users.length === 0) {
                toast.info("No data to export");
                return;
              }

              const exportData = users.map((user, index) => ({
                "S.No": index + 1,
                Name: user.generalInformation?.name || "-",
                Email: user.generalInformation?.email || "-",
                Phone: user.generalInformation?.phone || "-",
                Address:
                  user.addressDetails?.permanentAddress?.addressine1 ||
                  user.addressDetails?.installationAddress?.addressLine1 ||
                  "-",
                City:
                  user.addressDetails?.permanentAddress?.city ||
                  user.addressDetails?.installationAddress?.city ||
                  "-",
                Pincode:
                  user.addressDetails?.permanentAddress?.pincode ||
                  user.addressDetails?.installationAddress?.pincode ||
                  "-",
                Status: user.status?.charAt(0).toUpperCase() + user.status?.slice(1),
                // "Package Name": user.packageDetails?.packageName || "-",
                // "Package Amount": user.packageDetails?.packageAmount || "-",
                "Connection Type": user.generalInformation?.connectionType || "-",
                "Service Opted": user.generalInformation?.serviceOpted || "-",
                "Created Date": user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN")
                  : "-",
              }));

              const ws = XLSX.utils.json_to_sheet(exportData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Customers");

              // Auto-size columns
              const colWidths = [
                { wch: 6 },   // S.No
                { wch: 25 },  // Name
                { wch: 30 },  // Email
                { wch: 15 },  // Phone
                { wch: 40 },  // Address
                { wch: 15 },  // City
                { wch: 10 },  // Pincode
                { wch: 10 },  // Status
                { wch: 20 },  // Package Name
                { wch: 15 },  // Package Amount
                { wch: 15 },  // Connection Type
                { wch: 15 },  // Service Opted
                { wch: 15 },  // Created Date
              ];
              ws["!cols"] = colWidths;

              // Generate filename with date
              const today = new Date().toISOString().slice(0, 10);
              XLSX.writeFile(wb, `Customers_List_${today}.xlsx`);

              toast.success("Excel downloaded successfully!");
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Excel
          </button>

          {/* Add Customer Button */}
          <ProtectedAction module="users" action="create">
            <button
              onClick={() => navigate("/user/create")}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium"
            >
              Add Customer
            </button>
          </ProtectedAction>
        </div>
      </div>

      {/* <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Customer List</h1>

        <ProtectedAction module="users" action="create">
          <button
            onClick={() => navigate("/user/create")}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Customer
          </button>
        </ProtectedAction>
      </div> */}

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Name</th>
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Phone</th>
                  <th className="px-[2px] py-[2px] text-left">Address</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>

                    <td
                      className="px-[2px] py-[2px] hover:underline cursor-pointer"
                      onClick={() => navigate(`/user/profile/${user._id}`)}
                    >
                      {user.generalInformation?.name}
                    </td>

                    <td className="px-[2px] py-[2px]">
                      {user.generalInformation?.email}
                    </td>
                    <td className="px-[2px] py-[2px]">
                      {user.generalInformation?.phone}
                    </td>

                    <td className="px-[2px] py-[2px]">
                      {user.addressDetails?.permanentAddress?.addressine1 ||
                        "--"}
                    </td>

                    <td className="px-[2px] py-[2px]">
                      <span
                        className={`px-2 py-1 rounded text-xs ${user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* ACTION MENU */}
                    <td className="px-[2px] py-[2px] relative text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(user._id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === user._id && (
                        <div
                          ref={(el) => (menuRefs.current[user._id] = el)}
                          className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <ul className="py-2 text-sm">
                            {/* Status */}
                            <li>
                              <button
                                onClick={() =>
                                  toggleStatus(user._id, user.status)
                                }
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                              >
                                {user.status === "active" ? (
                                  <FiToggleRight className="text-green-600" />
                                ) : (
                                  <FiToggleLeft className="text-red-600" />
                                )}
                                Change Status
                              </button>
                            </li>

                            {/* Change Password */}
                            <li>
                              <button
                                onClick={() => handleChangePassword(user._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaKey /> Change Password
                              </button>
                            </li>

                            {/* View */}
                            <ProtectedAction module="customer" action="view">
                              <li>
                                <button
                                  onClick={() => handleView(user._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                                >
                                  <FaEye /> View
                                </button>
                              </li>
                            </ProtectedAction>

                            {/* Edit */}
                            <ProtectedAction module="customer" action="edit">
                              <li>
                                <button
                                  onClick={() => handleEdit(user._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-green-600"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </li>
                            </ProtectedAction>

                            {/* Create Ticket */}
                            <li>
                              <button
                                onClick={() => handleCreateTicket(user._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaTicketAlt /> Create Ticket
                              </button>
                            </li>

                            {/* Recharge */}
                            <li>
                              <button
                                onClick={() => handleRechargePackage(user._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                              >
                                <FaSync /> Recharge Package
                              </button>
                            </li>

                            {/* Login as Customer */}
                            <li>
                              <button
                                onClick={handleLoginAsCustomer}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaUserAlt /> Login as Customer
                              </button>
                            </li>

                            {/* Delete */}
                            <ProtectedAction module="customer" action="delete">
                              <li>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600"
                                >
                                  <FaTrash /> Remove
                                </button>
                              </li>
                            </ProtectedAction>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* STATUS MODAL */}
      {openStatusModalId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspend">Suspend</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenStatusModalId(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(openStatusModalId, newStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD CHANGE MODAL */}
      {openPasswordModalId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter new password"
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenPasswordModalId(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}