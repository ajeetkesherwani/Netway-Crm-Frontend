import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRetailer } from "../../service/retailer";
import { getRoles } from "../../service/role";
import { toast } from "react-toastify";

export default function RetailerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    title: "Mr.",
    resellerName: "",
    password: "",
    houseNo: "",
    address: "",
    taluka: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
    area: "",
    subArea: "",
    mobileNo: "",
    telephone: "",
    fax: "",
    email: "",
    website: "",
    messengerId: "",
    birthDate: "",
    anniversaryDate: "",
    latitude: "",
    longitude: "",
    gstin: "",
    panNumber: "",
    resellerCode: "",
    resellerBalance: "",
    dashboard: "Admin",
    status: "Active",
    contactPersonName: "",
    contactPersonNumber: "",
    supportEmail: "",
    whatsappSupport: "",
    description: "",
    role: "",
    NAS: [],
    roleId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const res = await getRoles(); 
      if (res.status && res.data) {
        const retailerRole = res.data.find(
          (role) => role.roleName === "Retailer"
        );
        if (retailerRole) {
          setRoles([retailerRole]);
          setFormData(prev => ({ ...prev, roleId: retailerRole._id })); // ✅ set default roleId
        } else {
          setRoles([]);
        }
      } else {
        setRoles([]);
      }
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  };

  fetchRoles();
}, []);


  // handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createRetailer(formData);
      toast.success("Retailer created successfully ✅");
      navigate("/retailer/list"); // redirect after success
    } catch (err) {
      console.error("Create Retailer Error:", err);
      toast.error(err.message || "Failed to create retailer ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle clear form
  const handleClear = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Retailer</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Mr.</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="M/s">M/s</option>
          </select>
        </div>

        {/* Reseller Name */}
        <div>
          <label className="block font-medium">Reseller Name *</label>
          <input
            type="text"
            name="resellerName"
            value={formData.resellerName}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium">Password *</label>
          <input
            type="password" // 👈 use type="password" so it hides characters
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
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

        {/* House No */}
        <div>
          <label className="block font-medium">House No.</label>
          <input
            type="text"
            name="houseNo"
            value={formData.houseNo}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Taluka */}
        <div>
          <label className="block font-medium">Taluka</label>
          <input
            type="text"
            name="taluka"
            value={formData.taluka}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* District */}
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* State */}
        <div>
          <label className="block font-medium">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select State</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Delhi">Delhi</option>
            <option value="Haryana">Haryana</option>
            {/* Add more states */}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block font-medium">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
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

        {/* Sub Area */}
        <div>
          <label className="block font-medium">Sub Area</label>
          <input
            type="text"
            name="subArea"
            value={formData.subArea}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Mobile No */}
        <div>
          <label className="block font-medium">Mobile No *</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Telephone */}
        <div>
          <label className="block font-medium">Telephone</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Fax */}
        <div>
          <label className="block font-medium">Fax</label>
          <input
            type="text"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
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

        {/* Website */}
        <div>
          <label className="block font-medium">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Messenger ID */}
        <div>
          <label className="block font-medium">Messenger ID</label>
          <input
            type="text"
            name="messengerId"
            value={formData.messengerId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block font-medium">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Anniversary Date */}
        <div>
          <label className="block font-medium">Anniversary Date</label>
          <input
            type="date"
            name="anniversaryDate"
            value={formData.anniversaryDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block font-medium">Latitude</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block font-medium">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* GSTIN */}
        <div>
          <label className="block font-medium">GSTIN</label>
          <input
            type="text"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* PAN Number */}
        <div>
          <label className="block font-medium">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Reseller Code */}
        <div>
          <label className="block font-medium">Reseller Code</label>
          <input
            type="text"
            name="resellerCode"
            value={formData.resellerCode}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Reseller Balance */}
        <div>
          <label className="block font-medium">Reseller Balance</label>
          <input
            type="number"
            name="resellerBalance"
            value={formData.resellerBalance}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Dashboard */}
        <div>
          <label className="block font-medium">Dashboard</label>
          <select
            name="dashboard"
            value={formData.dashboard}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Admin</option>
            <option value="Reseller Dashboard">Reseller</option>
            <option value="Admin Dashboard">Admin</option>
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Contact Person Name */}
        <div>
          <label className="block font-medium">Contact Person Name</label>
          <input
            type="text"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Contact Person Number */}
        <div>
          <label className="block font-medium">Contact Person Number</label>
          <input
            type="text"
            name="contactPersonNumber"
            value={formData.contactPersonNumber}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Support Email */}
        <div>
          <label className="block font-medium">Support Email</label>
          <input
            type="email"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* WhatsApp Support Number */}
        <div>
          <label className="block font-medium">WhatsApp Support Number</label>
          <input
            type="text"
            name="whatsappSupport"
            value={formData.whatsappSupport}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium">Role</label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {/* NAS Checkboxes */}
        <div className="col-span-2">
          <label className="block font-medium mb-2">NAS</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
            {[
              "Netway-103.255.235.3",
              "Netway-Tyagjibroadband",
              "Netway-Shivamnet",
              "Netway-Netwayinternet",
            ].map((nasOption) => (
              <label key={nasOption} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="NAS"
                  value={nasOption}
                  checked={formData.NAS.includes(nasOption)} // ✅ check if selected
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setFormData((prev) => {
                      let updatedNAS = [...prev.NAS];
                      if (checked) {
                        updatedNAS.push(value);
                      } else {
                        updatedNAS = updatedNAS.filter(
                          (item) => item !== value
                        );
                      }
                      return { ...prev, NAS: updatedNAS }; // ✅ update state
                    });
                  }}
                  className="h-4 w-4"
                />
                <span>{nasOption}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded h-24"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/retailer/list")}
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
