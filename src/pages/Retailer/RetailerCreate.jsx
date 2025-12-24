import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRetailer } from "../../service/retailer";
import { getRoles } from "../../service/role";
import { toast } from "react-toastify";

// Import validation functions (same as LCO)
import { characterValidate } from "../../validations/characterValidate";
import { mobileValidate } from "../../validations/mobileValidate";
import { pincodeValidate } from "../../validations/pincodeValidate";
import { emailValidate } from "../../validations/emailValidate";
import { panCardValidate } from "../../validations/panCardValidate";

export default function RetailerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formErrors, setFormErrors] = useState({});
  const [employeeErrors, setEmployeeErrors] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});

  const initialFormData = {
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
    dashboard: "Reseller",
    status: "active", // Changed to "active" to match LCO style
    contactPersonName: "",
    contactPersonNumber: "",
    supportEmail: "",
    whatsAppNumber: "",
    description: "",
    nas: [],
    employeeAssociation: [],
    aadhaarCard: null,
    panCard: null,
    license: null,
    other: null,
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

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
    "Jammu and Kashmir", "Ladakh"
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        if (res.status && res.data) {
          const retailerRole = res.data.find((r) => r.roleName === "Retailer");
          if (retailerRole) {
            setRoles([retailerRole]);
            setFormData((prev) => ({ ...prev, role: retailerRole._id }));
          }
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };
    fetchRoles();
  }, []);



  const validateRetailer = () => {
    const errors = {};

    // Reseller Name
    if (!formData.resellerName.trim()) {
      errors.resellerName = "Reseller Name is required";
    } else {
      const nameError = characterValidate(formData.resellerName);
      if (nameError) errors.resellerName = nameError;
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailError = emailValidate(formData.email);
      if (emailError) errors.email = emailError;
    }

    // Mobile No
    if (!formData.mobileNo.trim()) {
      errors.mobileNo = "Mobile Number is required";
    } else {
      const mobileError = mobileValidate(formData.mobileNo);
      if (mobileError) errors.mobileNo = mobileError;
    }
    if (!formData.whatsAppNumber.trim()) {
      errors.whatsAppNumber = "WhatsApp Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.whatsAppNumber)) {
      errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
    }

    // Required Address Fields
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.district.trim()) errors.district = "District is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.country.trim()) errors.country = "Country is required";

    // Pincode
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else {
      const pinError = pincodeValidate(formData.pincode);
      if (pinError) errors.pincode = pinError;
    }

    // PAN Number (required)
    if (!formData.panNumber.trim()) {
      errors.panNumber = "PAN Number is required";
    } else {
      const panError = panCardValidate(formData.panNumber);
      if (panError) errors.panNumber = panError;
    }

    // Optional validations
    // if (formData.contactPersonNumber && !/^[0-9]{10}$/.test(formData.contactPersonNumber))
    //   errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    // if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
    //   errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
    if (!formData.gstNo.trim()) {
      errors.gstNo = "GST Number is required";
    }

    if (!formData.balance.trim()) {
      errors.balance = "Balance is required";
    } else if (isNaN(formData.balance) || formData.balance < 0) {
      errors.balance = "Balance must be a valid non-negative number";
    }

    if (!formData.contactPersonName.trim()) {
      errors.contactPersonName = "Contact Person Name is required";
    } else {
      const nameError = characterValidate(formData.contactPersonName);
      if (nameError) errors.contactPersonName = nameError;
    }

    if (!formData.contactPersonNumber.trim()) {
      errors.contactPersonNumber = "Contact Person Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contactPersonNumber)) {
      errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    }

    if (!formData.supportEmail.trim()) {
      errors.supportEmail = "Support Email is required";
    } else {
      const emailError = emailValidate(formData.supportEmail);
      if (emailError) errors.supportEmail = emailError;
    }
    return errors;
  };

  const validateEmployee = () => {
    const errors = {};

    if (!employeeData.employeeUserName.trim()) {
      errors.employeeUserName = "Username is required";
    } else {
      const nameError = characterValidate(employeeData.employeeUserName);
      if (nameError) errors.employeeUserName = nameError;
    }

    if (!employeeData.employeeName.trim()) {
      errors.employeeName = "Name is required";
    } else {
      const nameError = characterValidate(employeeData.employeeName);
      if (nameError) errors.employeeName = nameError;
    }

    if (!employeeData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else {
      const mobileError = mobileValidate(employeeData.mobile);
      if (mobileError) errors.mobile = mobileError;
    }

    if (!employeeData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailError = emailValidate(employeeData.email);
      if (emailError) errors.email = emailError;
    }

    if (!employeeData.password.trim()) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const validateDocuments = () => {
    const errors = {};

    if (!formData.aadhaarCard) errors.aadhaarCard = "Aadhaar Card is required";
    if (!formData.panCard) errors.panCard = "PAN Card is required";
    if (!formData.license) errors.license = "License is required";
    if (!formData.other) errors.other = "Other Document is required";

    return errors;
  };

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "resellerName") {
      error = characterValidate(value);
    } else if (name === "email") {
      error = emailValidate(value);
    } else if (name === "mobileNo" || name === "contactPersonNumber" || name === "whatsAppNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      error = mobileValidate(cleaned);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
      return;
    } else if (name === "pincode") {
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      error = pincodeValidate(cleaned);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
      return;
    } else if (name === "panNumber") {
      const upperValue = value.toUpperCase();
      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      error = panCardValidate(upperValue);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
      return;
    } else if (["address", "district", "state", "country"].includes(name)) {
      if (!value.trim()) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
    } else if (name === "balance") {
      if (!value.trim()) {
        error = "Balance is required";
      } else if (isNaN(value) || value < 0) {
        error = "Balance must be a valid non-negative number";
      }
    } else if (name === "gstNo") {
      if (!value.trim()) {
        error = "GST Number is required";
      }
    } else if (name === "resellerName" || name === "contactPersonName") {
      // Now also validates contactPersonName
      error = characterValidate(value);
    } else if (name === "email" || name === "supportEmail") {
      // Now also validates supportEmail
      error = emailValidate(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "employeeUserName" || name === "employeeName") {
      error = characterValidate(value);
    } else if (name === "mobile") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setEmployeeData((prev) => ({ ...prev, [name]: cleaned }));
      error = mobileValidate(cleaned);
      setEmployeeErrors((prev) => ({ ...prev, [name]: error }));
      return;
    } else if (name === "email") {
      error = emailValidate(value);
    }

    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    setEmployeeErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAddEmployee = () => {
    const errors = validateEmployee();
    if (Object.keys(errors).length > 0) {
      setEmployeeErrors(errors);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: [...prev.employeeAssociation, { ...employeeData }],
    }));
    setEmployeeData(initialEmployeeData);
    setEmployeeErrors({});
    toast.success("Employee added successfully");
  };

  const handleRemoveEmployee = (index) => {
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: prev.employeeAssociation.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    const errors = validateRetailer();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setActiveTab("associated");
  };

  const handleNextToDocument = () => {
    if (formData.employeeAssociation.length === 0) {
      toast.error("Please add at least one employee");
      return;
    }
    setActiveTab("resellerDocument");
  };

  const handleBack = () => {
    if (activeTab === "resellerDocument") setActiveTab("associated");
    else if (activeTab === "associated") setActiveTab("general");
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setEmployeeData(initialEmployeeData);
    setFormErrors({});
    setEmployeeErrors({});
    setDocumentErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRetailer();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setActiveTab("general");
      return;
    }

    if (formData.employeeAssociation.length === 0) {
      toast.error("At least one employee is required");
      setActiveTab("associated");
      return;
    }

    const docErrors = validateDocuments();
    if (Object.keys(docErrors).length > 0) {
      setDocumentErrors(docErrors);
      setActiveTab("resellerDocument");
      toast.error("Please upload all required documents");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            submitData.append(key, formData[key]);
          }
        }
      }

      await createRetailer(submitData);
      toast.success("Retailer created successfully");
      navigate("/retailer/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create Retailer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Reseller</h2>

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
        <button
          className={`px-4 py-2 font-medium ${activeTab === "resellerDocument" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("resellerDocument")}
        >
          Reseller Document
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Information Tab */}
        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Title</label>
              <select name="title" value={formData.title} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="Mr.">Mr.</option>
                <option value="Ms">Ms</option>
                <option value="M/s">M/s</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Reseller Name *</label>
              <input
                type="text"
                name="resellerName"
                value={formData.resellerName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.resellerName ? "border-red-500" : ""}`}
              />
              {formErrors.resellerName && <p className="text-red-500 text-sm">{formErrors.resellerName}</p>}
            </div>

            {/* <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.password ? "border-red-500" : ""}`}
              />
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div> */}

            <div>
              <label className="block font-medium">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.address ? "border-red-500" : ""}`}
              />
              {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
            </div>

            {/* <div>
              <label className="block font-medium">House No.</label>
              <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            {/* <div>
              <label className="block font-medium">Taluka</label>
              <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            <div>
              <label className="block font-medium">District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.district ? "border-red-500" : ""}`}
              />
              {formErrors.district && <p className="text-red-500 text-sm">{formErrors.district}</p>}
            </div>

            <div>
              <label className="block font-medium">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.state ? "border-red-500" : ""}`}
              >
                <option value="">Select State</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
            </div>

            <div>
              <label className="block font-medium">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.country ? "border-red-500" : ""}`}
              />
              {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
            </div>

            <div>
              <label className="block font-medium">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.pincode ? "border-red-500" : ""}`}
              />
              {formErrors.pincode && <p className="text-red-500 text-sm">{formErrors.pincode}</p>}
            </div>

            <div>
              <label className="block font-medium">Area</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            {/* <div>
              <label className="block font-medium">Sub Area</label>
              <input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            <div>
              <label className="block font-medium">Mobile No *</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.mobileNo ? "border-red-500" : ""}`}
              />
              {formErrors.mobileNo && <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>}
            </div>

            <div>
              <label className="block font-medium">Phone No</label>
              <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            {/* <div>
              <label className="block font-medium">Fax</label>
              <input type="text" name="fax" value={formData.fax} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            <div>
              <label className="block font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.email ? "border-red-500" : ""}`}
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block font-medium">Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            {/* <div>
              <label className="block font-medium">Messenger ID</label>
              <input type="text" name="messengerId" value={formData.messengerId} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            {/* <div>
              <label className="block font-medium">Birth Date</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            {/* <div>
              <label className="block font-medium">Anniversary Date</label>
              <input type="date" name="anniversaryDate" value={formData.anniversaryDate} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            {/* <div>
              <label className="block font-medium">Latitude</label>
              <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            {/* <div>
              <label className="block font-medium">Longitude</label>
              <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            <div>
              <label className="block font-medium">GST No *</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.gstNo ? "border-red-500" : ""}`}
              />
              {formErrors.gstNo && <p className="text-red-500 text-sm">{formErrors.gstNo}</p>}
            </div>
            <div>
              <label className="block font-medium">PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.panNumber ? "border-red-500" : ""}`}
                maxLength={10}
              />
              {formErrors.panNumber && <p className="text-red-500 text-sm">{formErrors.panNumber}</p>}
            </div>

            {/* <div>
              <label className="block font-medium">Reseller Code</label>
              <input type="text" name="resellerCode" value={formData.resellerCode} onChange={handleChange} className="border p-2 w-full rounded" />
            </div> */}

            <div>
              <label className="block font-medium">Balance *</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.balance ? "border-red-500" : ""}`}
                min="0"
                step="0.01"
              />
              {formErrors.balance && <p className="text-red-500 text-sm">{formErrors.balance}</p>}
            </div>

            {/* <div>
              <label className="block font-medium">Dashboard</label>
              <select name="dashboard" value={formData.dashboard} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="Reseller">Reseller</option>
              </select>
            </div> */}

            <div>
              <label className="block font-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Contact Person Name *</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.contactPersonName ? "border-red-500" : ""}`}
              />
              {formErrors.contactPersonName && <p className="text-red-500 text-sm">{formErrors.contactPersonName}</p>}
            </div>

            <div>
              <label className="block font-medium">Contact Person Number *</label>
              <input
                type="text"
                name="contactPersonNumber"
                value={formData.contactPersonNumber}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.contactPersonNumber ? "border-red-500" : ""}`}
                maxLength={10}
              />
              {formErrors.contactPersonNumber && <p className="text-red-500 text-sm">{formErrors.contactPersonNumber}</p>}
            </div>

            <div>
              <label className="block font-medium">Support Email *</label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.supportEmail ? "border-red-500" : ""}`}
              />
              {formErrors.supportEmail && <p className="text-red-500 text-sm">{formErrors.supportEmail}</p>}
            </div>
            <div>
              <label className="block font-medium">WhatsApp Number</label>
              <input
                type="text"
                name="whatsAppNumber"
                value={formData.whatsAppNumber}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.whatsAppNumber ? "border-red-500" : ""}`}
                maxLength={10}
                placeholder="Enter 10-digit number"
              />
              {formErrors.whatsAppNumber && <p className="text-red-500 text-sm">{formErrors.whatsAppNumber}</p>}
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded h-24"></textarea>
            </div>
          </div>
        )}

        {/* Associated Employee Tab */}
        {activeTab === "associated" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Username *</label>
              <input
                type="text"
                name="employeeUserName"
                value={employeeData.employeeUserName}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeUserName ? "border-red-500" : ""}`}
              />
              {employeeErrors.employeeUserName && <p className="text-red-500 text-sm">{employeeErrors.employeeUserName}</p>}
            </div>

            <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={employeeData.password}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.password ? "border-red-500" : ""}`}
              />
              {employeeErrors.password && <p className="text-red-500 text-sm">{employeeErrors.password}</p>}
            </div>

            <div>
              <label className="block font-medium">Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={employeeData.employeeName}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeName ? "border-red-500" : ""}`}
              />
              {employeeErrors.employeeName && <p className="text-red-500 text-sm">{employeeErrors.employeeName}</p>}
            </div>

            <div>
              <label className="block font-medium">Type</label>
              <select name="type" value={employeeData.type} onChange={handleEmployeeChange} className="border p-2 w-full rounded">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Mobile *</label>
              <input
                type="text"
                name="mobile"
                value={employeeData.mobile}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.mobile ? "border-red-500" : ""}`}
              />
              {employeeErrors.mobile && <p className="text-red-500 text-sm">{employeeErrors.mobile}</p>}
            </div>

            <div>
              <label className="block font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.email ? "border-red-500" : ""}`}
              />
              {employeeErrors.email && <p className="text-red-500 text-sm">{employeeErrors.email}</p>}
            </div>

            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Employee
              </button>
            </div>

            {formData.employeeAssociation.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Added Employees</h3>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                  {formData.employeeAssociation.map((emp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-b last:border-b-0">
                      <div>
                        <p><strong>{emp.employeeName}</strong> ({emp.employeeUserName})</p>
                        <p>{emp.mobile} | {emp.email || "—"} | {emp.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmployee(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reseller Document Tab */}
        {activeTab === "resellerDocument" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Aadhaar Card *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "aadhaarCard")}
                className={`w-full border rounded-md p-2 ${documentErrors.aadhaarCard ? "border-red-500" : "border-gray-300"}`}
              />
              {formData.aadhaarCard && <p className="text-sm text-gray-600 mt-1">{formData.aadhaarCard.name}</p>}
              {documentErrors.aadhaarCard && <p className="text-red-500 text-sm mt-1">{documentErrors.aadhaarCard}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">PAN Card *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "panCard")}
                className={`w-full border rounded-md p-2 ${documentErrors.panCard ? "border-red-500" : "border-gray-300"}`}
              />
              {formData.panCard && <p className="text-sm text-gray-600 mt-1">{formData.panCard.name}</p>}
              {documentErrors.panCard && <p className="text-red-500 text-sm mt-1">{documentErrors.panCard}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">License *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "license")}
                className={`w-full border rounded-md p-2 ${documentErrors.license ? "border-red-500" : "border-gray-300"}`}
              />
              {formData.license && <p className="text-sm text-gray-600 mt-1">{formData.license.name}</p>}
              {documentErrors.license && <p className="text-red-500 text-sm mt-1">{documentErrors.license}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Other Document *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "other")}
                className={`w-full border rounded-md p-2 ${documentErrors.other ? "border-red-500" : "border-gray-300"}`}
              />
              {formData.other && <p className="text-sm text-gray-600 mt-1">{formData.other.name}</p>}
              {documentErrors.other && <p className="text-red-500 text-sm mt-1">{documentErrors.other}</p>}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {activeTab !== "general" && (
            <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
              Back
            </button>
          )}
          {activeTab === "general" && (
            <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Next
            </button>
          )}
          {activeTab === "associated" && (
            <button type="button" onClick={handleNextToDocument} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Next
            </button>
          )}
          {activeTab === "resellerDocument" && (
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              {loading ? "Saving..." : "Submit"}
            </button>
          )}
          <button type="button" onClick={handleClear} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}