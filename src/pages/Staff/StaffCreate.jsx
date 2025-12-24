import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createStaff } from "../../service/staffService";
import { getAllRolesList } from "../../service/ticket";
import { getAllZoneList } from "../../service/staffService";
// Import validation functions
import { characterValidate } from "../../validations/characterValidate";
import { emailValidate } from "../../validations/emailValidate";
import { mobileValidate } from "../../validations/mobileValidate";

export default function StaffCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [formErrors, setFormErrors] = useState({});

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
    status: "true", // default Active
    resetOtpExpires: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rolesData, zoneData] = await Promise.allSettled([
          getAllRolesList(),
          getAllZoneList(),
        ]);
        if (rolesData.status === "fulfilled" && rolesData.value?.status) {
          setRoles(rolesData.value.data);
        }
        if (zoneData.status === "fulfilled" && zoneData.value?.status) {
          setZoneList(zoneData.value.data);
        }
      } catch (err) {
        console.error("fetch error", err);
      }
    };
    fetchAll();
  }, []);

  // Handle input change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "name") {
      error = characterValidate(value);
    } else if (name === "email") {
      error = emailValidate(value);
    } else if (name === "phoneNo") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      error = mobileValidate(cleaned);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
      return;
    } else if (name === "logId") {
      if (!value.trim()) {
        error = "User ID is required";
      } else if (value.length < 3) {
        error = "User ID must be at least 3 characters";
      }
    } 
    // ── Password validation ──
    else if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    } 
    // ── Salary validation ──
    else if (name === "salary") {
      if (!value.trim()) {
        error = "Salary is required";
      } else if (isNaN(value) || Number(value) <= 0) {
        error = "Salary must be a positive number";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Full form validation on submit
  const validateForm = () => {
    const errors = {};

    // Name
    if (!formData.name.trim()) {
      errors.name = "Staff name is required";
    } else {
      const nameError = characterValidate(formData.name);
      if (nameError) errors.name = nameError;
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailError = emailValidate(formData.email);
      if (emailError) errors.email = emailError;
    }

    // Phone Number
    if (!formData.phoneNo.trim()) {
      errors.phoneNo = "Phone number is required";
    } else {
      const mobileError = mobileValidate(formData.phoneNo);
      if (mobileError) errors.phoneNo = mobileError;
    }

    // Password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Salary
    if (!formData.salary.trim()) {
      errors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      errors.salary = "Salary must be a positive number";
    }

    // User ID
    if (!formData.logId.trim()) {
      errors.logId = "User ID is required";
    } else if (formData.logId.length < 3) {
      errors.logId = "User ID must be at least 3 characters";
    }

    // Role
    if (!formData.role) {
      errors.role = "Role is required";
    }

    // Status
    if (!formData.status) {
      errors.status = "Status is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please correct the errors highlighted in red.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      ...(formData.resetOtpExpires && {
        resetOtpExpires: new Date(formData.resetOtpExpires).toISOString(),
      }),
    };

    try {
      await createStaff(payload);
      toast.success("Staff created successfully");
      navigate("/staff/list");
    } catch (err) {
      console.error("Create Staff Error:", err);
      toast.error(err.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Staff</h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Staff Name */}
        <div>
          <label className="block font-medium">Staff Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.name ? "border-red-500" : ""
            }`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.email ? "border-red-500" : ""
            }`}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium">Phone Number *</label>
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="10-digit number"
            maxLength={10}
            className={`border p-2 w-full rounded ${
              formErrors.phoneNo ? "border-red-500" : ""
            }`}
          />
          {formErrors.phoneNo && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNo}</p>
          )}
        </div>

        {/* Password - REQUIRED */}
        <div>
          <label className="block font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.password ? "border-red-500" : ""
            }`}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        {/* User ID */}
        <div>
          <label className="block font-medium">User ID *</label>
          <input
            type="text"
            name="logId"
            value={formData.logId}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.logId ? "border-red-500" : ""
            }`}
          />
          {formErrors.logId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.logId}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.role ? "border-red-500" : ""
            }`}
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
          {formErrors.role && (
            <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.status ? "border-red-500" : ""
            }`}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {formErrors.status && (
            <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
          )}
        </div>

        {/* Salary - REQUIRED */}
        <div>
          <label className="block font-medium">Salary *</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            min="1" // prevents negative/zero in browser
            className={`border p-2 w-full rounded ${
              formErrors.salary ? "border-red-500" : ""
            }`}
          />
          {formErrors.salary && (
            <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>
          )}
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-60"
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