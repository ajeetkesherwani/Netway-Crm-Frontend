import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLco } from "../../service/lco";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { toast } from "react-toastify";

export default function CreateLco() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // State for active tab
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const nasOptions = [
    "NAS Server 1",
    "NAS Server 2",
    "NAS Server 3",
    "NAS Server 4",
  ];
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
  ];
  const initialFormData = {
    title: "Mr.",
    retailerId: "",
    role: "Lco",
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
    county: "India",
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
    description: "",
    status: "active",
    employeeAssociation: [],
  };
  const initialEmployeeData = {
    employeeUserName: "",
    password: "",
    employeeName: "",
    type: "Manager",
    mobile: "",
    email: "",
    status: "active",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [employeeErrors, setEmployeeErrors] = useState({});

  useEffect(() => {
    const fetchRolesAndRetailers = async () => {
      try {
        // Fetch Roles
        const roleRes = await getRoles();
        if (roleRes.status && roleRes.data) {
          const lcoRole = roleRes.data.find((r) => r.roleName === "Lco");
          if (lcoRole) {
            setRoles([lcoRole]);
            setFormData((prev) => ({ ...prev, role: lcoRole._id }));
          }
        }

        // Fetch Retailers
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

  // Validate LCO form data
  const validateLco = () => {
    const errors = {};
    if (!formData.lcoName) errors.lcoName = "LCO Name is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
    if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
      errors.mobileNo = "Mobile Number must be 10 digits";
    if (formData.telephone && !/^[0-9]{10}$/.test(formData.telephone))
      errors.telephone = "Telephone must be 10 digits";
    if (formData.contactPersonNumber && !/^[0-9]{10}$/.test(formData.contactPersonNumber))
      errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    if (formData.supportWhatsApp && !/^[0-9]{10}$/.test(formData.supportWhatsApp))
      errors.supportWhatsApp = "Support WhatsApp must be 10 digits";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    setEmployeeErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmployee = () => {
    const errors = {};
    if (!employeeData.employeeUserName) errors.employeeUserName = "Username is required";
    if (!employeeData.password) errors.password = "Password is required";
    if (!employeeData.employeeName) errors.employeeName = "Name is required";
    if (!employeeData.mobile) errors.mobile = "Mobile number is required";
    if (employeeData.mobile && !/^[0-9]{10}$/.test(employeeData.mobile))
      errors.mobile = "Mobile Number must be 10 digits";
    return errors;
  };

  const handleAddEmployee = () => {
    const errors = validateEmployee();
    if (Object.keys(errors).length > 0) {
      setEmployeeErrors(errors);
      return;
    }

    // attach a stable unique id so we can remove exactly that employee later
    const newEmployee = {
      ...employeeData,
      _id:
        employeeData.employeeUserName
          ? `emp-${employeeData.employeeUserName}-${Date.now()}`
          : `emp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: [...(prev.employeeAssociation || []), newEmployee],
    }));
    setEmployeeData(initialEmployeeData);
    setEmployeeErrors({});
  };

  const handleRemoveEmployee = (empId) => {
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: (prev.employeeAssociation || []).filter(
        (e) => (e._id || e.employeeUserName) !== empId
      ),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lcoErrors = validateLco();
    if (Object.keys(lcoErrors).length > 0) {
      setFormErrors(lcoErrors);
      setActiveTab("general");
      return;
    }
    setLoading(true);
    try {
      await createLco(formData);
      toast.success("LCO created successfully ✅");
      // navigate("/lco/list");
      navigate("/retailer/list");
    } catch (err) {
      console.error("Create LCO Error:", err);
      toast.error(err.message || "Failed to create LCO ❌");
    } finally {
      setLoading(false);
    }
  };
  const handleClear = () => {
    setFormData(initialFormData);
    setEmployeeData(initialEmployeeData);
    setFormErrors({});
    setEmployeeErrors({});
  };
  const handleNext = () => {
    const lcoErrors = validateLco();
    if (Object.keys(lcoErrors).length > 0) {
      setFormErrors(lcoErrors);
      return;
    }
    setActiveTab("associated");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create LCO</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "general" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "associated" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("associated")}
        >
          Associated Employee
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Information Tab */}
        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-4">
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
                className={`border p-2 w-full rounded ${formErrors.lcoName ? "border-red-500" : ""}`}
              />
              {formErrors.lcoName && <p className="text-red-500 text-sm">{formErrors.lcoName}</p>}
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
                className={`border p-2 w-full rounded ${formErrors.password ? "border-red-500" : ""}`}
              />
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div>

            {/* Mobile No */}
            <div>
              <label className="block font-medium">Mobile No *</label>
              <input
                type="number"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
                className={`border p-2 w-full rounded ${formErrors.mobileNo ? "border-red-500" : ""}`}
                pattern="[0-9]{10}"
              />
              {formErrors.mobileNo && <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>}
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
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
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
            {/* Telephone */}
            <div>
              <label className="block font-medium">Telephone</label>
              <input
                type="number"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.telephone ? "border-red-500" : ""}`}
                pattern="[0-9]{10}"
              />
              {formErrors.telephone && <p className="text-red-500 text-sm">{formErrors.telephone}</p>}
            </div>

            {/* Fax No */}
            {/* <div>
              <label className="block font-medium">Fax No</label>
              <input
                type="text"
                name="faxNo"
                value={formData.faxNo}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

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
            {/* <div>
              <label className="block font-medium">DOB</label>
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
            {/* <div>
              <label className="block font-medium">Dashboard</label>
              <select
                name="dashboard"
                value={formData.dashboard}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="">Select Dashboard</option>
                <option value="Admin">Admin</option>
                <option value="Reseller Dashboard">Reseller</option>
                <option value="Admin Dashboard">Admin</option>
              </select>
            </div> */}

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
                className={`border p-2 w-full rounded ${formErrors.contactPersonNumber ? "border-red-500" : ""}`}
                pattern="[0-9]{10}"
              />
              {formErrors.contactPersonNumber && <p className="text-red-500 text-sm">{formErrors.contactPersonNumber}</p>}
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
                type="number"
                name="supportWhatsApp"
                value={formData.supportWhatsApp}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.supportWhatsApp ? "border-red-500" : ""}`}
                pattern="[0-9]{10}"
              />
              {formErrors.supportWhatsApp && <p className="text-red-500 text-sm">{formErrors.supportWhatsApp}</p>}
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
                value={formData.role}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="Lco">Lco</option>
                {/* {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))} */}
              </select>
            </div>

            {/* Retailer */}
            <div>
              <label className="block font-medium">Reseller</label>
              <select
                name="retailerId"
                value={formData.retailerId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Reseller</option>
                {retailers.map((retailer) => (
                  <option key={retailer._id} value={retailer._id}>
                    {retailer.resellerName}
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
                <option value="active">Active</option>
                <option value="inActive">Inactive</option>
              </select>
            </div>

            {/* NAS Checkboxes */}
            {/* <div className="col-span-2">
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
            </div> */}

            {/* Description */}
            <div className="col-span-2">
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full rounded h-24"
              />
            </div>
          </div>
        )}

        {/* Associated Employee Tab */}
        {activeTab === "associated" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Employee Username */}
            <div>
              <label className="block font-medium">Username *</label>
              <input
                type="text"
                name="employeeUserName"
                value={employeeData.employeeUserName}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeUserName ? "border-red-500" : ""}`}
              // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.employeeUserName && (
                <p className="text-red-500 text-sm">{employeeErrors.employeeUserName}</p>
              )}
            </div>

            {/* Employee Password */}
            <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={employeeData.password}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.password ? "border-red-500" : ""}`}
              // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.password && (
                <p className="text-red-500 text-sm">{employeeErrors.password}</p>
              )}
            </div>

            {/* Employee Name */}
            <div>
              <label className="block font-medium">Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={employeeData.employeeName}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeName ? "border-red-500" : ""}`}
              // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.employeeName && (
                <p className="text-red-500 text-sm">{employeeErrors.employeeName}</p>
              )}
            </div>

            {/* Employee Type */}
            <div>
              <label className="block font-medium">Type</label>
              <select
                name="type"
                value={employeeData.type}
                onChange={handleEmployeeChange}
                className="border p-2 w-full rounded"
              // disabled={formData.employeeAssociation.length > 0}
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
                value={employeeData.mobile}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.mobile ? "border-red-500" : ""}`}
                pattern="[0-9]{10}"
              // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.mobile && (
                <p className="text-red-500 text-sm">{employeeErrors.mobile}</p>
              )}
            </div>

            {/* Employee Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleEmployeeChange}
                className="border p-2 w-full rounded"
              // disabled={formData.employeeAssociation.length > 0}
              />
            </div>

            {/* Employee Status */}
            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={employeeData.status}
                onChange={handleEmployeeChange}
                className="border p-2 w-full rounded"
              // disabled={formData.employeeAssociation.length > 0}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Add Employee Button (allow multiple) */}
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Employee
              </button>
            </div>

            {/* Employee List */}
            {formData.employeeAssociation.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Added Employee</h3>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                  {formData.employeeAssociation.map((employee, index) => {
                    const empKey = employee._id || employee.employeeUserName || index;
                    return (
                      <div
                        key={empKey}
                        className="flex justify-between items-center p-2 border-b"
                      >
                        <div>
                          <p>
                            <strong>{employee.employeeName}</strong> ({employee.employeeUserName})
                          </p>
                          <p>{employee.mobile} | {employee.email || "—"} | {employee.status}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmployee(employee._id || employee.employeeUserName || index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Form Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/retailer/list")}
            // onClick={() => navigate("/lco/list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          {activeTab === "general" && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {activeTab === "associated" && (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          )}
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