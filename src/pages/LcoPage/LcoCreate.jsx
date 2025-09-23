import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLco } from "../../service/lco";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { toast } from "react-toastify";

export default function CreateLco() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const nasOptions = [
    "NAS Server 1",
    "NAS Server 2",
    "NAS Server 3",
    "NAS Server 4",
  ];

  const initialFormData = {
    title: "Mr.",
    retailerId: "",
    roleId: "",
    lcoName: "",
    password: "",
    mobileNo: "",
    address: "",
    houseNo: "",
    taluka: "",
    pincode: "",
    district: "",
    area: "",
    state: "",
    county: "",
    telephone: "",
    faxNo: "",
    email: "",
    messengerId: "",
    website: "",
    dob: "",
    anniversaryDate: "",
    latitude: "",
    longitude: "",
    lcoBalance: "",
    gst: "",
    panNo: "",
    dashboard: "",
    contactPersonName: "",
    contactPersonNumber: "",
    supportEmail: "",
    supportWhatsApp: "",
    lcoCode: "",
    nas: [],
    descripition: "",
    status: "inActive",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchRolesAndRetailers = async () => {
      try {
        // ✅ Fetch Roles
        const roleRes = await getRoles();
        if (roleRes.status && roleRes.data) {
          const lcoRole = roleRes.data.find((r) => r.roleName === "Lco");
          if (lcoRole) {
            setRoles([lcoRole]);
            setFormData((prev) => ({ ...prev, roleId: lcoRole._id }));
          }
        }

        // ✅ Fetch Retailers
        const retailerRes = await getRetailer();
        if (retailerRes.status && retailerRes.data) {
          setRetailers(retailerRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles/retailers:", err);
      }
    };
    fetchRolesAndRetailers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNasChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedNas = checked
        ? [...prev.nas, value]
        : prev.nas.filter((item) => item !== value);
      return { ...prev, nas: updatedNas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLco(formData);
      toast.success("LCO created successfully ✅");
      navigate("/lco/list");
    } catch (err) {
      console.error("Create LCO Error:", err);
      toast.error(err.message || "Failed to create LCO ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setFormData(initialFormData);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create LCO</h2>
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
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="M/s">M/s</option>
          </select>
        </div>

        {/* LCO Name */}
        <div>
          <label className="block font-medium">LCO Name *</label>
          <input
            type="text"
            name="lcoName"
            value={formData.lcoName}
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
          <label className="block font-medium">House No</label>
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

        {/* County */}
        <div>
          <label className="block font-medium">County</label>
          <input
            type="text"
            name="county"
            value={formData.county}
            onChange={handleChange}
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

        {/* Fax No */}
        <div>
          <label className="block font-medium">Fax No</label>
          <input
            type="text"
            name="faxNo"
            value={formData.faxNo}
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

        {/* DOB */}
        <div>
          <label className="block font-medium">DOB</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
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

        {/* LCO Balance */}
        <div>
          <label className="block font-medium">LCO Balance</label>
          <input
            type="number"
            name="lcoBalance"
            value={formData.lcoBalance}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* GST */}
        <div>
          <label className="block font-medium">GST</label>
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* PAN No */}
        <div>
          <label className="block font-medium">PAN No</label>
          <input
            type="text"
            name="panNo"
            value={formData.panNo}
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
            className="border p-2 w-full rounded">
            <option value="Admin">Admin</option>
            <option value="Reseller Dashboard">Reseller</option>
            <option value="Admin Dashboard">Admin</option>
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

        {/* Support WhatsApp */}
        <div>
          <label className="block font-medium">Support WhatsApp</label>
          <input
            type="text"
            name="supportWhatsApp"
            value={formData.supportWhatsApp}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* LCO Code */}
        <div>
          <label className="block font-medium">LCO Code</label>
          <input
            type="text"
            name="lcoCode"
            value={formData.lcoCode}
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

        {/* Retailer */}
        <div className="relative overflow-visible">
          <label className="block font-medium">Retailer</label>
          <select
            name="retailerId"
            value={formData.retailerId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Retailer</option>
            {retailers.map((retailer) => (
              <option key={retailer._id} value={retailer._id}>
                {retailer.resellerName || retailer.resellerName}
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
            <option value="Active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>

        {/* NAS Checkboxes */}
        <div className="col-span-2">
          <label className="block font-medium mb-2">NAS</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
            {nasOptions.map((nas) => (
              <label key={nas} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={nas}
                  checked={formData.nas.includes(nas)}
                  onChange={handleNasChange}
                  className="h-4 w-4"
                />
                <span>{nas}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block font-medium">Description</label>
          <textarea
            name="descripition"
            value={formData.descripition}
            onChange={handleChange}
            className="border p-2 w-full rounded h-24"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/lco/list")}
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
