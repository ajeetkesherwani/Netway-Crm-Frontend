
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaSignInAlt } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getStaff } from "../../service/staffService";
import toast from "react-hot-toast";
import { useLogin } from "../../service/login";

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useLogin(); // ✅ FIXED

  // ✅ Load staff data
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

  // ✅ View / Edit / Delete Handlers
  const handleView = (id) => navigate(`/staff/view/${id}`);
  const handleEdit = (id) => navigate(`/staff/update/${id}`);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaffList(staffList.filter((s) => s._id !== id));
    }
  };

  // ✅ Admin Login as Staff
  const handleLoginAsStaff = async (staff) => {
    console.log("🧩 Login clicked for:", staff?.name);

    if (!staff?.userName || !staff?.plainPassword) {
      toast.error("This staff does not have login credentials ❌");
      return;
    }

    if (!window.confirm(`Login as ${staff.name}?`)) return;

    try {
      toast.loading(`Logging in as ${staff.name}...`);

      console.log("📡 Sending to API:", {
        userName: staff.userName,
        password: staff.plainPassword,
      });

      // ✅ use login() from your hook
      const res = await login({
        userName: staff.userName,
        password: staff.plainPassword,
      });

      toast.dismiss();
      console.log("✅ API Response:", res);

      if (res?.token || res?.success) {
        // ❌ remove this (no need to setAuth)
        // setAuth(res.token);

        // ✅ Permissions saved automatically inside useLogin
        toast.success(`Logged in as ${staff.name} ✅`);
        navigate("/");
      } else {
        toast.error(res?.message || "Login failed ❌");
      }
    } catch (err) {
      toast.dismiss();
      console.error("❌ Login failed:", err);
      toast.error(err.message || "Something went wrong ❌");
    }
  };

  // const handleLoginAsStaff = async (staff) => {
  //   console.log("🧩 Login clicked for:", staff?.name);

  //   if (!staff?.userName || !staff?.plainPassword) {
  //     toast.error("This staff does not have login credentials ❌");
  //     return;
  //   }

  //   if (!window.confirm(`Login as ${staff.name}?`)) return;

  //   try {
  //     toast.loading(`Logging in as ${staff.name}...`);

  //     console.log("📡 Sending to API:", {
  //       userName: staff.userName,
  //       password: staff.plainPassword,
  //     });

  //     // ✅ API hit using /api/admin/auth/login
  //     const res = await login({
  //       userName: staff.userName,
  //       password: staff.plainPassword,
  //     });

  //     toast.dismiss();
  //     console.log("✅ API Response:", res);

  //     if (res?.token || res?.success) {
  //       setAuth(res.token);
  //       localStorage.setItem(
  //         "rolePermission",
  //         JSON.stringify(res?.data?.user?.role?.permissions || [])
  //       );
  //       toast.success(`Logged in as ${staff.name} ✅`);
  //       navigate("/");
  //     } else {
  //       toast.error(res?.message || "Login failed ❌");
  //     }
  //   } catch (err) {
  //     toast.dismiss();
  //     console.error("❌ Login failed:", err);
  //     toast.error(err.message || "Something went wrong ❌");
  //   }
  // };

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
          >
            Add Staff
          </button>
        </ProtectedAction>
      </div>

      {staffList.length === 0 ? (
        <p className="text-gray-500">No Staff Found.</p>
      ) : (
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[900px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-[2px] py-[2px] text-left">S.No</th>
                <th className="px-[2px] py-[2px] text-left">Name</th>
                <th className="px-[2px] py-[2px] text-left">Phone No</th>
                <th className="px-[2px] py-[2px] text-left">Email</th>
                <th className="px-[2px] py-[2px] text-left">Status</th>
                <th className="px-[2px] py-[2px] text-left">Action</th>
                <th className="px-[2px] py-[2px] text-center">Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.map((staff, index) => (
                <tr key={staff._id} className="hover:bg-gray-50">
                  <td className="px-[2px] py-[2px]">{index + 1}</td>
                  <td className="px-[2px] py-[2px]">{staff.name}</td>
                  <td className="px-[2px] py-[2px]">{staff.phoneNo}</td>
                  <td className="px-[2px] py-[2px]">{staff.email || "—"}</td>
                  <td className="px-[2px] py-[2px]">{staff.status}</td>
                  <td className="px-[2px] py-[2px]">
                    <div className="flex items-center gap-2">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => handleView(staff._id)}
                        title="View"
                      />
                      <FaEdit
                        className="text-green-600 cursor-pointer hover:text-green-800"
                        onClick={() => handleEdit(staff._id)}
                        title="Edit"
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={() => handleDelete(staff._id)}
                        title="Delete"
                      />
                    </div>
                  </td>
                  <td className="px-[2px] py-[2px] text-center">
                    <button
                      onClick={() => handleLoginAsStaff(staff)}
                      className="p-1 text-blue-600 bg-gray-100 rounded hover:bg-blue-100 focus:outline-none"
                      title="Login as this staff"
                    >
                      <FaSignInAlt size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
