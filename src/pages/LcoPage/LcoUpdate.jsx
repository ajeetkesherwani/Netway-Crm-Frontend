import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoles } from "../../service/role";
import { toast } from "react-toastify";
import { getLcoDetails, updateLco } from "../../service/lco";

export default function LcoUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "M/s",
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
    phoneNo: "",
    fax: "",
    email: "",
    website: "",
    messengerId: "",
    dob: "",
    anniversaryDate: "",
    latitude: "",
    longitude: "",
    gstNo: "",
    panNumber: "",
    resellerCode: "",
    balance: "",
    dashboard: "Admin",
    status: "true",
    contactPersonName: "",
    contactPersonNumber: "",
    supportEmail: "",
    whatsAppNumber: "",
    description: "",
    roleId: "",
    nas: [],
  });
  const [roles, setRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, retailerRes] = await Promise.all([
          getRoles(),
          getLcoDetails(id),
        ]);
        if (rolesRes.status && rolesRes.data) {
          setRoles(rolesRes.data);
        }
        if (retailerRes.data) {
          setFormData({
            ...formData,
            ...retailerRes.data,
            password: "", // Do not prefill password for security
          });
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load retailer details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  // Validate form data
  const validate = () => {
    const errors = {};
    if (!formData.resellerName)
      errors.resellerName = "Reseller Name is required";
    if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
    if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
      errors.mobileNo = "Mobile Number must be 10 digits";
    if (formData.phoneNo && !/^[0-9]{10}$/.test(formData.phoneNo))
      errors.phoneNo = "Phone Number must be 10 digits";
    if (
      formData.contactPersonNumber &&
      !/^[0-9]{10}$/.test(formData.contactPersonNumber)
    )
      errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
      errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
    return errors;
  };
  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // Handle NAS checkboxes
  // const handleNasChange = (e) => {
  //   const { value, checked } = e.target;
  //   setFormData((prev) => {
  //     let updatedNas = [...prev.nas];
  //     if (checked) {
  //       updatedNas.push(value);
  //     } else {
  //       updatedNas = updatedNas.filter((item) => item !== value);
  //     }
  //     return { ...prev, nas: updatedNas };
  //   });
  // };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await updateLco(id, formData);
      toast.success("Retailer updated successfully ✅");
      navigate("/retailer/list");
    } catch (err) {
      console.error("Update Retailer Error:", err);
      toast.error(err.message || "Failed to update retailer ❌");
    } finally {
      setLoading(false);
    }
  };
  // Handle clear form
  const handleClear = () => {
    setFormData({
      title: "M/s",
      resellerName: "",
      //   password: "",
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
      phoneNo: "",
      fax: "",
      email: "",
      website: "",
      messengerId: "",
      dob: "",
      anniversaryDate: "",
      latitude: "",
      longitude: "",
      gstNo: "",
      panNumber: "",
      resellerCode: "",
      balance: "",
      dashboard: "Admin",
      status: "true",
      contactPersonName: "",
      contactPersonNumber: "",
      supportEmail: "",
      whatsAppNumber: "",
      description: "",
      roleId: "",
      nas: [],
    });
    setFormErrors({});
  };
  if (loading) return <p className="p-4">Loading retailer details...</p>;
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Retailer</h2>
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
            <option value="Ms">Ms</option>
            <option value="M/s">M/s</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
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
            className={`border p-2 w-full rounded ${
              formErrors.resellerName ? "border-red-500" : ""
            }`}
          />
          {formErrors.resellerName && (
            <p className="text-red-500 text-sm">{formErrors.resellerName}</p>
          )}
        </div>

        {/* Password */}
        {/* <div>
          <label className="block font-medium">Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}

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
            <option value="Maharashtra">Maharashtra</option>
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
            type="number"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.mobileNo ? "border-red-500" : ""
            }`}
            pattern="[0-9]{10}"
          />
          {formErrors.mobileNo && (
            <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>
          )}
        </div>

        {/* Phone No */}
        <div>
          <label className="block font-medium">Phone No</label>
          <input
            type="number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.phoneNo ? "border-red-500" : ""
            }`}
            pattern="[0-9]{10}"
          />
          {formErrors.phoneNo && (
            <p className="text-red-500 text-sm">{formErrors.phoneNo}</p>
          )}
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

        {/* DOB */}
        {/* <div>
          <label className="block font-medium">Birth Date</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}
        {/* Anniversary Date */}
        {/* <div>
          <label className="block font-medium">Anniversary Date</label>
          <input
            type="date"
            name="anniversaryDate"
            value={formData.anniversaryDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}

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

        {/* GST No */}
        <div>
          <label className="block font-medium">GST No</label>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
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

        {/* Balance */}
        <div>
          <label className="block font-medium">Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
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
            <option value="Admin">Admin</option>
            <option value="Reseller">Reseller</option>
            <option value="Lco">LCO</option>
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
            type="number"
            name="contactPersonNumber"
            value={formData.contactPersonNumber}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.contactPersonNumber ? "border-red-500" : ""
            }`}
            pattern="[0-9]{10}"
          />
          {formErrors.contactPersonNumber && (
            <p className="text-red-500 text-sm">
              {formErrors.contactPersonNumber}
            </p>
          )}
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

        {/* WhatsApp Number */}
        <div>
          <label className="block font-medium">WhatsApp Number</label>
          <input
            type="number"
            name="whatsAppNumber"
            value={formData.whatsAppNumber}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${
              formErrors.whatsAppNumber ? "border-red-500" : ""
            }`}
            pattern="[0-9]{10}"
          />
          {formErrors.whatsAppNumber && (
            <p className="text-red-500 text-sm">{formErrors.whatsAppNumber}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium">Role</label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
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

        {/* NAS Checkboxes */}
        {/* <div className="col-span-2">
          <label className="block font-medium mb-2">NAS</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
            {[
              "Feature1",
              "Feature2",
              "Feature3",
              "Netway-103.255.235.3",
              "Netway-Tyagjibroadband",
              "Netway-Shivamnet",
              "Netway-Netwayinternet",
            ].map((nasOption) => (
              <label key={nasOption} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={nasOption}
                  checked={formData.nas.includes(nasOption)}
                  onChange={handleNasChange}
                  className="h-4 w-4"
                />
                <span>{nasOption}</span>
              </label>
            ))}
          </div>
        </div> */}

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
            {loading ? "Updating..." : "Update"}
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
