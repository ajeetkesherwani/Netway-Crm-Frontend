import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLco } from "../../service/lco";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { toast } from "react-toastify";
// Import validation functions
import { characterValidate } from "../../validations/characterValidate";
import { mobileValidate } from "../../validations/mobileValidate";
import { pincodeValidate } from "../../validations/pincodeValidate";
import { emailValidate } from "../../validations/emailValidate";
import { panCardValidate } from "../../validations/panCardValidate";

export default function CreateLco() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formErrors, setFormErrors] = useState({});
  const [employeeErrors, setEmployeeErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [documentErrors, setDocumentErrors] = useState({});

  const initialFormData = {
    title: "Mr.",
    retailerId: "",
    role: "",
    lcoName: "",
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
    lcoCode: "",
    balance: "",
    dashboard: "Lco",
    status: "active",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, retailerRes] = await Promise.all([
          getRoles(),
          getRetailer(),
        ]);

        if (roleRes.status && roleRes.data) {
          const lcoRole = roleRes.data.find((r) => r.roleName === "Lco");
          if (lcoRole) {
            setRoles([lcoRole]);
            setFormData((prev) => ({ ...prev, role: lcoRole._id }));
          }
        }

        if (retailerRes.status && retailerRes.data) {
          setRetailers(retailerRes.data);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);



  const validateDocuments = () => {
    const errors = {};

    if (!formData.aadhaarCard) {
      errors.aadhaarCard = "Aadhaar Card is required";
    }
    if (!formData.panCard) {
      errors.panCard = "PAN Card is required";
    }
    if (!formData.license) {
      errors.license = "License is required";
    }
    if (!formData.other) {
      errors.other = "Other Document is required";
    }

    return errors;
  };


  const validateLco = () => {
    const errors = {};
    // if (!formData.lcoName) errors.lcoName = "LCO Name is required";
    //  if (!formData.email) errors.email = "LCO Email is required";
    // if (!formData.password) errors.password = "Password is required";
    // if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
    // if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
    //   errors.mobileNo = "Mobile Number must be 10 digits";
    // if (formData.phoneNo && !/^[0-9]{10}$/.test(formData.phoneNo))
    //   errors.phoneNo = "Phone Number must be 10 digits";


    // LCO Name
    if (!formData.lcoName.trim()) {
      errors.lcoName = "LCO Name is required";
    } else {
      const nameError = characterValidate(formData.lcoName);
      if (nameError) errors.lcoName = nameError;
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
    // NEW: Required fields - Address, District, State, Country
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.district.trim()) {
      errors.district = "District is required";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    // Pincode (already required as per previous update)
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else {
      const pinError = pincodeValidate(formData.pincode);
      if (pinError) errors.pincode = pinError;
    }

    // PAN Number - REQUIRED
    if (!formData.panNumber.trim()) {
      errors.panNumber = "PAN Number is required";
    } else {
      const panError = panCardValidate(formData.panNumber);
      if (panError) errors.panNumber = panError;
    }




    if (formData.contactPersonNumber && !/^[0-9]{10}$/.test(formData.contactPersonNumber))
      errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
      errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
    if (!formData.retailerId) errors.retailerId = "Please select a Reseller";
    return errors;
  };

  const validateEmployee = () => {
    const errors = {};
    // if (!employeeData.employeeUserName) errors.employeeUserName = "Username is required";
    // if (!employeeData.password) errors.password = "Password is required";
    // if (!employeeData.employeeName) errors.employeeName = "Name is required";
    // if (!employeeData.mobile) errors.mobile = "Mobile number is required";
    // if (employeeData.mobile && !/^[0-9]{10}$/.test(employeeData.mobile))
    //   errors.mobile = "Mobile Number must be 10 digits";
    // Username
    if (!employeeData.employeeUserName.trim()) {
      errors.employeeUserName = "Username is required";
    } else {
      const nameError = characterValidate(employeeData.employeeUserName);
      if (nameError) errors.employeeUserName = nameError;
    }

    // Employee Name
    if (!employeeData.employeeName.trim()) {
      errors.employeeName = "Name is required";
    } else {
      const nameError = characterValidate(employeeData.employeeName);
      if (nameError) errors.employeeName = nameError;
    }

    // Mobile
    if (!employeeData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else {
      const mobileError = mobileValidate(employeeData.mobile);
      if (mobileError) errors.mobile = mobileError;
    }

    // Email (optional but validate if filled)
    if (!employeeData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailError = emailValidate(employeeData.email);
      if (emailError) errors.email = emailError;
    }

    // Password (keep your existing check)
    if (!employeeData.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Real-time validation for specific fields
    if (name === "lcoName") {
      error = characterValidate(value);
    } else if (name === "email") {
      error = emailValidate(value);
    } else if (name === "mobileNo") {
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
      const upperValue = value.toUpperCase(); // auto uppercase for better UX
      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      error = panCardValidate(upperValue);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
      return;
    }
    // NEW: Real-time required field validation
    else if (["address", "district", "state", "country"].includes(name)) {
      if (!value.trim()) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
    }

    // Default case: just update the value and clear any previous error
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
    const emp = { ...employeeData };
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: [...prev.employeeAssociation, emp],
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
    const errors = validateLco();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setActiveTab("associated");
  };

  const handleNextToDocument = () => {
    // const errors = validateEmployee();
    // if (Object.keys(errors).length > 1) {
    //   setEmployeeErrors(errors);
    //   toast.error("Please fix the errors in employee details");
    //   return;
    // }

    // If no errors, proceed to next tab
    if (formData.employeeAssociation.length === 0) {
      toast.error("Please add at least one employee");
      return;
    }

    // const docErrors = validateDocuments();
    // if (Object.keys(docErrors).length > 0) {
    //   setDocumentErrors(docErrors);
    //   toast.error("Please upload all required documents");
    //   return;
    // }

    setActiveTab("lcoDocument");
  };


  const handleBack = () => {
    if (activeTab === "lcoDocument") setActiveTab("associated");
    else if (activeTab === "associated") setActiveTab("general");
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setEmployeeData(initialEmployeeData);
    setFormErrors({});
    setEmployeeErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLco();
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
      setActiveTab("lcoDocument");
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

      await createLco(submitData);
      toast.success("LCO created successfully");
      navigate("/lco/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create LCO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create LCO</h2>

      {/* Tabs - Same as Retailer */}
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
          className={`px-4 py-2 font-medium ${activeTab === "lcoDocument" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("lcoDocument")}
        >
          LCO Document
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Information Tab - EXACT SAME UI */}
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
              <label className="block font-medium">LCO Name *</label>
              <input type="text" name="lcoName" value={formData.lcoName} onChange={handleChange} required
                className={`border p-2 w-full rounded ${formErrors.lcoName ? "border-red-500" : ""}`} />
              {formErrors.lcoName && <p className="text-red-500 text-sm">{formErrors.lcoName}</p>}
            </div>
            {/* 
            <div>
              <label className="block font-medium">Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required
                className={`border p-2 w-full rounded ${formErrors.password ? "border-red-500" : ""}`} />
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div> */}

            {/* <div><label className="block font-medium">House No.</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
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
            {/* <div><label className="block font-medium">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
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
                required
                className={`border p-2 w-full rounded ${formErrors.pincode ? "border-red-500" : ""}`}
              />
              {formErrors.pincode && <p className="text-red-500 text-sm">{formErrors.pincode}</p>}
            </div>
            <div><label className="block font-medium">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            {/* <div><label className="block font-medium">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}

            <div>
              <label className="block font-medium">Mobile No *</label>
              <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required
                className={`border p-2 w-full rounded ${formErrors.mobileNo ? "border-red-500" : ""}`} />
              {formErrors.mobileNo && <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>}
            </div>

            <div><label className="block font-medium">Phone No</label><input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            {/* <div><label className="block font-medium">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
            <div>
              <label className="block font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${formErrors.email ? "border-red-500" : ""}`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div><label className="block font-medium">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">GST No</label><input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div>
              <label className="block font-medium">PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                required
                className={`border p-2 w-full rounded ${formErrors.panNumber ? "border-red-500" : ""}`}
                maxLength={10}
              />
              {formErrors.panNumber && <p className="text-red-500 text-sm">{formErrors.panNumber}</p>}
            </div>
            {/* <div><label className="block font-medium">LCO Code</label><input type="text" name="lcoCode" value={formData.lcoCode} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
            <div><label className="block font-medium">Balance</label><input type="number" name="balance" value={formData.balance} onChange={handleChange} className="border p-2 w-full rounded" /></div>

            <div>
              <label className="block font-medium">Reseller *</label>
              <select name="retailerId" value={formData.retailerId} onChange={handleChange} required
                className={`border p-2 w-full rounded ${formErrors.retailerId ? "border-red-500" : ""}`}>
                <option value="">Select Reseller</option>
                {retailers.map((r) => (
                  <option key={r._id} value={r._id}>{r.resellerName}</option>
                ))}
              </select>
              {formErrors.retailerId && <p className="text-red-500 text-sm">{formErrors.retailerId}</p>}
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded h-24"></textarea>
            </div>
          </div>
        )}

        {/* Associated Employee Tab - EXACT SAME */}
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
              {employeeErrors.employeeUserName && (
                <p className="text-red-500 text-sm mt-1">{employeeErrors.employeeUserName}</p>
              )}
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
              {employeeErrors.password && (
                <p className="text-red-500 text-sm mt-1">{employeeErrors.password}</p>
              )}
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
              {employeeErrors.employeeName && (
                <p className="text-red-500 text-sm mt-1">{employeeErrors.employeeName}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Type</label>
              <select
                name="type"
                value={employeeData.type}
                onChange={handleEmployeeChange}
                className="border p-2 w-full rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                value={employeeData.mobile}
                onChange={handleEmployeeChange}
                placeholder="10-digit number"
                maxLength={10}
                className={`border p-2 w-full rounded ${employeeErrors.mobile ? "border-red-500" : ""}`}
              />
              {employeeErrors.mobile && (
                <p className="text-red-500 text-sm mt-1">{employeeErrors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.email ? "border-red-500" : ""}`}
              />
              {employeeErrors.email && (
                <p className="text-red-500 text-sm mt-1">{employeeErrors.email}</p>
              )}
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

        {/* Document Tab - EXACT SAME */}
        {activeTab === "lcoDocument" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Aadhaar Card *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "aadhaarCard")}
                className={`w-full border rounded-md p-2 ${documentErrors.aadhaarCard ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formData.aadhaarCard && (
                <p className="text-sm text-gray-600 mt-1">{formData.aadhaarCard.name}</p>
              )}
              {documentErrors.aadhaarCard && (
                <p className="text-red-500 text-sm mt-1">{documentErrors.aadhaarCard}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">PAN Card *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "panCard")}
                className={`w-full border rounded-md p-2 ${documentErrors.panCard ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formData.panCard && (
                <p className="text-sm text-gray-600 mt-1">{formData.panCard.name}</p>
              )}
              {documentErrors.panCard && (
                <p className="text-red-500 text-sm mt-1">{documentErrors.panCard}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">License *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "license")}
                className={`w-full border rounded-md p-2 ${documentErrors.license ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formData.license && (
                <p className="text-sm text-gray-600 mt-1">{formData.license.name}</p>
              )}
              {documentErrors.license && (
                <p className="text-red-500 text-sm mt-1">{documentErrors.license}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Other Document *</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "other")}
                className={`w-full border rounded-md p-2 ${documentErrors.other ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formData.other && (
                <p className="text-sm text-gray-600 mt-1">{formData.other.name}</p>
              )}
              {documentErrors.other && (
                <p className="text-red-500 text-sm mt-1">{documentErrors.other}</p>
              )}
            </div>
          </div>
        )}

        {/* Buttons - EXACT SAME */}
        <div className="col-span-2 flex justify-end gap-3 mt-6">
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
          {activeTab === "lcoDocument" && (
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

