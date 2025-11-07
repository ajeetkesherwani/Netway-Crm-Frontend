import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getRoles } from "../../service/role";
import { toast } from "react-toastify";
import { createStaff } from "../../service/staffService";
import { getStaffList } from "../../service/ticket";

export default function StaffCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
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
  // Fetch roles and set default "Staff" role
  // useEffect(() => {
  //     const fetchRoles = async () => {
  //         try {
  //             const res = await getRoles();
  //             if (res.status && res.data) {
  //                 const staffRole = res.data.find((role) => role.roleName === "Staff");
  //                 console.log("Staff Role:", staffRole);
  //                 setRoles(staffRole);
  //                 if (staffRole) {
  //                     setFormData((prev) => ({ ...prev, role: staffRole._id }));
  //                 }
  //             } else {
  //                 setRoles([]);
  //             }
  //         } catch (err) {
  //             console.error("Failed to load roles:", err);
  //             toast.error("Failed to load roles ❌");
  //         }
  //     };
  //     fetchRoles();
  // }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getStaffList();
      if (res.status && res.data?.length) {
        setRoles(res.data);
        const staffRole = res.data.find(
          (r) => r.roleName?.toLowerCase() === "staff"
        );
        if (staffRole)
          setFormData((prev) => ({ ...prev, role: staffRole._id }));
      } else {
        toast.error("Failed to load roles ❌");
      }
    };
    fetchRoles();
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
          <label className="block font-medium">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            maxLength={10} // max 10 digits
            pattern="\d{10}" // exactly 10 digits only
            title="Phone number must be 10 digits"
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

        {/* Staff Name */}
        <div>
          <label className="block font-medium">Staff Name *</label>
          <input
            type="text"
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Log ID */}
        <div>
          <label className="block font-medium">Log ID *</label>
          <input
            type="text"
            name="logId"
            value={formData.logId}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        {/* Role */}
        {/* <div>
          <label className="block font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select Role</option>
            <option key={roles._id} value={roles._id}>
              {roles.roleName}
            </option>
          </select>
        </div> */}

        <div>
          <label className="block font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select Role</option>
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

        {/* Address */}
        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block font-medium">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
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

        {/* Staff IP */}
        <div>
          <label className="block font-medium">Staff IP</label>
          <input
            type="text"
            name="staffIp"
            value={formData.staffIp}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="e.g., 192.168.1.1"
          />
        </div>

        {/* Reset OTP Expires */}
        <div>
          <label className="block font-medium">Reset OTP Expires</label>
          <input
            type="datetime-local"
            name="resetOtpExpires"
            value={formData.resetOtpExpires}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Bio */}
        <div className="col-span-2">
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="border p-2 w-full rounded h-24"
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
