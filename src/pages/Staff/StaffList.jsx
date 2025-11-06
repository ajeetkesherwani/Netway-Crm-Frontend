import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getStaff } from "../../service/staffService";

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await getStaff();
        setStaffList(res.data || []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff");
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleView = (id) => {
    navigate(`/staff/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/staff/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      // TODO: call delete API
      setStaffList(staffList.filter((s) => s._id !== id));
      setOpenMenuId(null);
    }
  };

  if (loading) return <p className="p-4">Loading Staff...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium">Staff List</h1>
        <ProtectedAction module="staff" action="create">
          <button
            onClick={() => navigate("/staff/create")}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            aria-label="Add Staff"
          >
            Add Staff
          </button>
        </ProtectedAction>
      </div>

      {staffList.length === 0 ? (
        <p className="text-gray-500">No Staff Found.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Name</th>
                  <th className="px-[2px] py-[2px] text-left">Phone No</th>
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map((staff, index) => (
                  <tr key={staff._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px]">{staff.name}</td>
                    <td className="px-[2px] py-[2px]">{staff.phoneNo}</td>
                    <td className="px-[2px] py-[2px]">{staff.email || "—"}</td>
                    <td className="px-[2px] py-[2px]">{staff.status}</td>
                    <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex justify-start space-x-3">
                        {/* <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === staff._id ? null : staff._id)
                          }
                          className="p-1 rounded hover:bg-gray-200"
                          aria-label="Open actions"
                        >
                          <FaEllipsisV />
                        </button> */}

                        <ProtectedAction module="staff" action="view">
                          <button
                            onClick={() => handleView(staff._id)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="staff" action="edit">
                          <button
                            onClick={() => handleEdit(staff._id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="staff" action="delete">
                          <button
                            onClick={() => handleDelete(staff._id)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </ProtectedAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {staffList.map((staff, index) => (
              <div key={staff._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">{staff.name}</h2>
                <p className="text-sm">{staff.phoneNo}</p>
                <p className="text-sm">{staff.email || "—"}</p>
                <p className="text-sm">{staff.status}</p>

                <div className="flex justify-end space-x-3 mt-3">
                  <ProtectedAction module="staff" action="view">
                    <button
                      onClick={() => handleView(staff._id)}
                      className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                      title="View"
                    >
                      <FaEye size={16} />
                    </button>
                  </ProtectedAction>

                  <ProtectedAction module="staff" action="edit">
                    <button
                      onClick={() => handleEdit(staff._id)}
                      className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                  </ProtectedAction>

                  <ProtectedAction module="staff" action="delete">
                    <button
                      onClick={() => handleDelete(staff._id)}
                      className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
