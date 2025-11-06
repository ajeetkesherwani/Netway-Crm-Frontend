import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTicket,
  getAllUsers,
  getStaffList,
  getTicketCategories,
} from "../../service/ticket";
import { toast } from "react-toastify";

export default function TicketCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [staffRoles, setStaffRoles] = useState([]);
  const [categories, setCategories] = useState([]); // New
  const [formData, setFormData] = useState({
    userId: "",
    personName: "",
    personNumber: "",
    email: "",
    address: "",
    category: "", // Now stores category _id
    fileI: null,
    fileII: null,
    fileIII: null,
    callSource: "Phone",
    severity: "Medium",
    assignToId: "",
    callDescription: "",
    isChargeable: false,
    productId: "",
    price: 0,
  });

  // Fetch all dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roleRes, catRes] = await Promise.all([
          getAllUsers(),
          getStaffList(),
          getTicketCategories(),
        ]);
        setUsers(userRes.data || []);
        setStaffRoles(roleRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load users, roles, or categories");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "" && value !== false) {
          data.append(key, value);
        }
      });
      await createTicket(data);
      toast.success("Ticket created successfully");
      navigate("/ticket/list");
    } catch (err) {
      toast.error(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      userId: "",
      personName: "",
      personNumber: "",
      email: "",
      address: "",
      category: "",
      fileI: null,
      fileII: null,
      fileIII: null,
      callSource: "Phone",
      severity: "Medium",
      assignToId: "",
      callDescription: "",
      isChargeable: false,
      productId: "",
      price: 0,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">User *</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Customer</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Assign To (Role) */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Assign To (Role)</label>
          <select
            name="assignToId"
            value={formData.assignToId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Select Role (Optional) —</option>
            {staffRoles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown (NEW) */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Person Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Person Name *</label>
          <input
            type="text"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Person Number *</label>
          <input
            type="text"
            name="personNumber"
            value={formData.personNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
            required
          />
        </div>

        {/* Call Source */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Call Source</label>
          <select
            name="callSource"
            value={formData.callSource}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
          >
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="Web">Web</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Severity</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Call Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Call Description</label>
          <textarea
            name="callDescription"
            value={formData.callDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2.5"
          />
        </div>

        {/* File Uploads */}
        {["fileI", "fileII", "fileIII"].map((file) => (
          <div key={file}>
            <label className="block font-medium text-gray-700 mb-1">
              {file.replace("file", "File ")}
            </label>
            <input
              type="file"
              name={file}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700 mb-1">Product ID</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isChargeable"
            checked={formData.isChargeable}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="font-medium text-gray-700">Is Chargeable</label>
        </div>

        {/* Buttons */}
        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/ticket/list")}
            className="px-5 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}