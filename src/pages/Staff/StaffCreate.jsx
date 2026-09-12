import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createStaff } from "../../service/staffService";
import { getAllRolesList } from "../../service/ticket";
import { getAllZoneList } from "../../service/staffService";

export default function StaffCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const initialFormData = {
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    address: "",
    bio: "",
    role: "",
    logId: "",
    staffName: "",
    salary: "",
    comment: "",
    area: "",
    staffIp: "",
    status: "true",
    resetOtpExpires: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     const res = await getAllRolesList();
  //     if (res.status && res.data?.length) {
  //       setRoles(res.data);
  //       const staffRole = res.data.find(
  //         (r) => r.roleName?.toLowerCase() === "staff"
  //       );
  //       if (staffRole)
  //         setFormData((prev) => ({ ...prev, role: staffRole._id }));
  //     } else {
  //       toast.error("Failed to load roles ❌");
  //     }
  //   };
  //   fetchRoles();
  // }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rolesData, zoneData] =
          await Promise.allSettled([
            getAllRolesList(),
            getAllZoneList(),
          ]);

        console.log("rolesData", rolesData);
        console.log("zoneData", zoneData);
        if (rolesData.status === "fulfilled" && rolesData.value?.status)
          setRoles(rolesData.value.data);
        if (zoneData.status === "fulfilled" && zoneData.value?.status)
          setZoneList(zoneData.value.data);
      } catch (err) {
        console.error("fetch error", err);
      }
    };
    fetchAll();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate phoneNo format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNo)) {
      toast.error("Phone number must be 10 digits ❌");
      setLoading(false);
      return;
    }

    // Construct payload
    const payload = {
      ...formData,
      // Only include resetOtpExpires if provided
      ...(formData.resetOtpExpires && {
        resetOtpExpires: new Date(formData.resetOtpExpires).toISOString(),
      }),
    };
    try {
      await createStaff(payload);
      toast.success("Staff created successfully ✅");
      navigate("/staff/list");
    } catch (err) {
      console.error("Create Staff Error:", err);
      toast.error(err.message || "Failed to create staff ❌");
    } finally {
      setLoading(false);
    }
  };
  console.log("roles", roles);

  // Handle form clear
  const handleClear = () => {
    setFormData(initialFormData);
    // Reset role to "Staff" if available
    const staffRole = roles.find((role) => role.roleName === "Staff");
    if (staffRole) {
      setFormData((prev) => ({ ...prev, role: staffRole._id }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Staff</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        {/* Name */}
        <div>
          <label className="block font-medium">Staff Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium">Phone Number *</label>
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
            placeholder="10-digit number"
            maxLength={10}
            pattern="\d{10}"
            title="Phone number must be 10 digits"
          />
        </div>

        {/* User ID */}
        <div>
          <label className="block font-medium">User ID *</label>
          <input
            type="text"
            name="logId"
            value={formData.logId}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label className="block font-medium">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>

        {/* Comment */}
        <div className="col-span-2">
          <label className="block font-medium">Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="border p-2 w-full rounded h-24"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/staff/list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
