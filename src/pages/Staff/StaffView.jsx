import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoles } from "../../service/role";
import { toast } from "react-toastify";
import { getStaffDetails } from "../../service/staffService";

export default function StaffView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff details and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, rolesRes] = await Promise.all([
          getStaffDetails(id),
          getRoles(),
        ]);
        setStaff(staffRes.data || null);
        setRoles(rolesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load staff details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Resolve role name
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r._id === roleId);
    return role ? role.roleName : `Unknown (${roleId})`;
  };

  // Normalize status
  const formatStatus = (status) => {
    if (status === "active" || status === "true") return "Active";
    if (status === "false") return "Inactive";
    return status || "N/A";
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!staff) {
    return <div className="text-center p-6 text-red-500">Staff not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Staff Details</h2>
        <button
          onClick={() => navigate("/staff/list")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">ID</label>
          <p className="border p-2 rounded bg-gray-50">{staff._id || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <p className="border p-2 rounded bg-gray-50">{staff.name || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Staff Name</label>
          <p className="border p-2 rounded bg-gray-50">{staff.staffName || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <p className="border p-2 rounded bg-gray-50">{staff.email || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Phone Number</label>
          <p className="border p-2 rounded bg-gray-50">{staff.phoneNo || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Log ID</label>
          <p className="border p-2 rounded bg-gray-50">{staff.logId || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Role</label>
          <p className="border p-2 rounded bg-gray-50">{getRoleName(staff.role)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <p className="border p-2 rounded bg-gray-50">{formatStatus(staff.status)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Salary</label>
          <p className="border p-2 rounded bg-gray-50">{staff.salary ? `₹${staff.salary}` : "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Area</label>
          <p className="border p-2 rounded bg-gray-50">{staff.area || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Staff IP</label>
          <p className="border p-2 rounded bg-gray-50">{staff.staffIp || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Address</label>
          <p className="border p-2 rounded bg-gray-50">{staff.address || "N/A"}</p>
        </div>
        <div className="col-span-2">
          <label className="block font-medium text-gray-700">Bio</label>
          <p className="border p-2 rounded bg-gray-50">{staff.bio || "N/A"}</p>
        </div>
        <div className="col-span-2">
          <label className="block font-medium text-gray-700">Comment</label>
          <p className="border p-2 rounded bg-gray-50">{staff.comment || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Created At</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(staff.createdAt)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Updated At</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(staff.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}