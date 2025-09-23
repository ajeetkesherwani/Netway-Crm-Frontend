import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { getAllUserList } from "../../service/user"; 

export default function UserList() {
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
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
      // TODO: Call delete API
      setUsers(users.filter((u) => u._id !== id));
      setOpenMenuId(null);
    }
  };

  if (loading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">User List</h1>
        <button
          onClick={() => navigate("/user/create")}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">S.No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 relative">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.generalInformation?.name}</td>
                    <td className="px-4 py-2">{user.generalInformation?.email}</td>
                    <td className="px-4 py-2">{user.generalInformation?.phone}</td>
                    <td className="px-4 py-2">{user.generalInformation?.address}</td>
                    <td className="px-4 py-2">{user.status || "inActive"}</td>
                    <td className="px-4 py-2 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === user._id ? null : user._id
                          )
                        }
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === user._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
                        >
                          <button
                            onClick={() => handleView(user._id)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <FaEye className="mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
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
                  Status: {user.generalInformation?.status || "Active"}
                </p>

                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(user._id)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
