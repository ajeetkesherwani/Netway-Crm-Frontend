import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash ,FaEye} from "react-icons/fa";
import { deleteUser, getAllUserList, updateUserStatus } from "../../service/user";
import { toast } from "react-toastify";
import ProtectedAction from "../../components/ProtectedAction";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openStatusModalId, setOpenStatusModalId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUserList();
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleView = (id) => {
    navigate(`/user/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/user/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
        setOpenMenuId(null);
        toast.success("User deleted successfully ✅");
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user");
        toast.error(err.message || "Failed to delete user ❌");
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateUserStatus(id, newStatus);
      toast.success("User status updated successfully ✅");
      // Refresh user list
      const res = await getAllUserList();
      setUsers(res.data || []);
      setOpenStatusModalId(null);
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error(err.message || "Failed to update user status ❌");
    }
  };

  if (loading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">User List</h1>
        <ProtectedAction module="users" action="create">
          <button
            onClick={() => navigate("/user/create")}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            aria-label="Add User"
          >
            Add User
          </button>
        </ProtectedAction>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
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
                  <tr key={user._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline"
                    //  onClick={() => handleView(user._id)}
                   onClick={() => navigate(`/user/profile/${user._id}`)}
                     >
                      {user.generalInformation?.name}</td>
                    <td className="px-[2px] py-[2px]">{user.generalInformation?.email}</td>
                    <td className="px-[2px] py-[2px]">{user.generalInformation?.phone}</td>
                    <td className="px-[2px] py-[2px]">{user.generalInformation?.address}</td>
                    <td className="px-[2px] py-[2px]">
                      {user.status || "inActive"}
                      <button
                        onClick={() => setOpenStatusModalId(user._id)}
                        className="ml-2 text-white hover:text-gray-800 bg-blue-600 text-sm p-1 rounded"
                      >
                        Update
                      </button>
                    </td>
                    <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex items-center gap-3">
                        <ProtectedAction module="customer" action="view">
                          <button
                            onClick={() => handleView(user._id)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                            aria-label="View"
                          >
                            <FaEye />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="customer" action="edit">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="customer" action="delete">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <FaTrash />
                          </button>
                        </ProtectedAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">
                  {user.generalInformation?.name}
                </h2>
                <p className="text-sm">{user.generalInformation?.email}</p>
                <p className="text-sm">{user.generalInformation?.phone}</p>
                <p className="text-sm">{user.generalInformation?.address}</p>
                <p className="text-sm font-medium">
                  Status: {user.status || "inActive"}
                  <button
                    onClick={() => setOpenStatusModalId(user._id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Update
                  </button>
                </p>

                <div className="flex justify-end space-x-3 mt-3">
                  <ProtectedAction module="customer" action="view">
                    <button
                      onClick={() => handleView(user._id)}
                      className="px-2 py-1 text-sm text-blue-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="View"
                    >
                      <FaEye className="mr-1" size={14} /> View
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="customer" action="edit">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="px-2 py-1 text-sm text-green-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="Edit"
                    >
                      <FaEdit className="mr-1" size={14} /> Edit
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="customer" action="delete">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 text-sm text-red-600 rounded hover:bg-gray-100 flex items-center"
                      aria-label="Delete"
                    >
                      <FaTrash className="mr-1" size={14} /> Delete
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Status Update Modal (unchanged) */}
      {openStatusModalId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">Select Status</option>
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                disabled={!newStatus || loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}