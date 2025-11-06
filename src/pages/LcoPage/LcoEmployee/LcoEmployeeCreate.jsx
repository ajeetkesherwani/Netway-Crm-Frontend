import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addLcoEmployee } from "../../../service/lcoEmployee";


export default function LcoEmployeeCreate() {
  const navigate = useNavigate();
  const { resellerId: retailerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeUserName: "",
    password: "",
    employeeName: "",
    type: "Admin",
    mobile: "",
    email: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // Validate form data
  const validate = () => {
    const errors = {};
    if (!formData.employeeUserName) errors.employeeUserName = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.employeeName) errors.employeeName = "Name is required";
    if (!formData.mobile) errors.mobile = "Mobile number is required";
    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile))
      errors.mobile = "Mobile Number must be 10 digits";
    return errors;
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await addLcoEmployee(retailerId, formData);
      toast.success("Employee added successfully ✅");
      // navigate(`/lco/employee/list/${retailerId}`);
      navigate(-1)
    } catch (err) {
      console.error("Add Employee Error:", err);
      toast.error(err.message || "Failed to add employee ❌");
    } finally {
      setLoading(false);
    }
  };
  // Handle clear form
  const handleClear = () => {
    setFormData({
      employeeUserName: "",
      password: "",
      employeeName: "",
      type: "Admin",
      mobile: "",
      email: "",
      status: "active",
    });
    setErrors({});
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Employee Username */}
        <div>
          <label className="block font-medium">Username *</label>
          <input
            type="text"
            name="employeeUserName"
            value={formData.employeeUserName}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.employeeUserName ? "border-red-500" : ""}`}
          />
          {errors.employeeUserName && (
            <p className="text-red-500 text-sm">{errors.employeeUserName}</p>
          )}
        </div>

        {/* Employee Password */}
        <div>
          <label className="block font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.password ? "border-red-500" : ""}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Employee Name */}
        <div>
          <label className="block font-medium">Employee Name *</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.employeeName ? "border-red-500" : ""}`}
          />
          {errors.employeeName && (
            <p className="text-red-500 text-sm">{errors.employeeName}</p>
          )}
        </div>

        {/* Employee Type */}
        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Operator">Operator</option>
          </select>
        </div>

        {/* Employee Mobile */}
        <div>
          <label className="block font-medium">Mobile *</label>
          <input
            type="number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.mobile ? "border-red-500" : ""}`}
            pattern="[0-9]{10}"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>

        {/* Employee Email */}
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

        {/* Employee Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            // onClick={() => navigate(`/lco/employee/list/${retailerId}`)}
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