import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLco } from "../../service/lco";
import { getRoles } from "../../service/role";
import { getRetailer } from "../../service/retailer";
import { toast } from "react-toastify";

export default function CreateLco() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formErrors, setFormErrors] = useState({});
  const [employeeErrors, setEmployeeErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [retailers, setRetailers] = useState([]);

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
    telephone: "",
    fax: "",
    email: "",
    website: "",
    messengerId: "",
    dob: "",
    anniversaryDate: "",
    latitude: "",
    longitude: "",
    gst: "",
    panNo: "",
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
    documents: []
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

  const validateLco = () => {
    const errors = {};
    if (!formData.lcoName) errors.lcoName = "LCO Name is required";
    if (!formData.email) errors.email = "LCO Email is required";
    // if (!formData.password) errors.password = "Password is required";
    if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
    if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
      errors.mobileNo = "Mobile Number must be 10 digits";
    if (formData.telephone && !/^[0-9]{10}$/.test(formData.telephone))
      errors.telephone = "Phone Number must be 10 digits";
    if (formData.contactPersonNumber && !/^[0-9]{10}$/.test(formData.contactPersonNumber))
      errors.contactPersonNumber = "Contact Person Number must be 10 digits";
    if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
      errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
    if (!formData.retailerId) errors.retailerId = "Please select a Reseller";
    return errors;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    setEmployeeErrors((prev) => ({ ...prev, [name]: "" }));
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

  // const handleFileChange = (e, field) => {
  //   const file = e.target.files[0];
  //   setFormData((prev) => ({ ...prev, [field]: file }));
  // };

  // New – with preview
  const handleDocumentChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : null;

    setFormData((prev) => {
      const existing = prev.documents.filter(d => d.fieldName !== fieldName);
      return {
        ...prev,
        documents: [
          ...existing,
          { fieldName, file, preview, name: file.name }
        ]
      };
    });
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
    if (formData.employeeAssociation.length === 0) {
      toast.error("Please add at least one employee");
      return;
    }
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

    setLoading(true);
    try {
      const submitData = new FormData();

      for (const key in formData) {
        if (key === "documents") continue; 

        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      }

      // Now append document files with their original field names
      formData.documents.forEach((doc) => {
        if (doc.file) {
          submitData.append(doc.fieldName, doc.file);
        }
      });

      await createLco(submitData);
      // const submitData = new FormData();
      // for (const key in formData) {
      //   if (formData[key] !== null && formData[key] !== undefined) {
      //     if (Array.isArray(formData[key])) {
      //       submitData.append(key, JSON.stringify(formData[key]));
      //     } else {
      //       submitData.append(key, formData[key]);
      //     }
      //   }
      // }

      // await createLco(submitData);
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
            <div><label className="block font-medium">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            {/* <div><label className="block font-medium">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
            <div><label className="block font-medium">District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="border p-2 w-full rounded" /></div>

            <div>
              <label className="block font-medium">State</label>
              <select name="state" value={formData.state} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select State</option>
                {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div><label className="block font-medium">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            {/* <div><label className="block font-medium">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}

            <div>
              <label className="block font-medium">Mobile No *</label>
              <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required
                className={`border p-2 w-full rounded ${formErrors.mobileNo ? "border-red-500" : ""}`} />
              {formErrors.mobileNo && <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>}
            </div>

            {/* <div><label className="block font-medium">Phone No</label><input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
            <div><label className="block font-medium">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">GST No</label><input type="text" name="gst" value={formData.gst} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-medium">PAN Number</label><input type="text" name="panNo" value={formData.panNo} onChange={handleChange} className="border p-2 w-full rounded" /></div>
            {/* <div><label className="block font-medium">LCO Code</label><input type="text" name="lcoCode" value={formData.lcoCode} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}
            {/* <div><label className="block font-medium">Balance</label><input type="number" name="balance" value={formData.balance} onChange={handleChange} className="border p-2 w-full rounded" /></div> */}

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
              <label className="block font-medium">description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded h-24"></textarea>
            </div>
          </div>
        )}

        {/* Associated Employee Tab - EXACT SAME */}
        {activeTab === "associated" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Username *</label>
              <input type="text" name="employeeUserName" value={employeeData.employeeUserName} onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeUserName ? "border-red-500" : ""}`} />
              {employeeErrors.employeeUserName && <p className="text-red-500 text-sm">{employeeErrors.employeeUserName}</p>}
            </div>
            <div>
              <label className="block font-medium">Password *</label>
              <input type="password" name="password" value={employeeData.password} onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.password ? "border-red-500" : ""}`} />
              {employeeErrors.password && <p className="text-red-500 text-sm">{employeeErrors.password}</p>}
            </div>
            <div>
              <label className="block font-medium">Employee Name *</label>
              <input type="text" name="employeeName" value={employeeData.employeeName} onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.employeeName ? "border-red-500" : ""}`} />
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
              <input type="text" name="mobile" value={employeeData.mobile} onChange={handleEmployeeChange}
                className={`border p-2 w-full rounded ${employeeErrors.mobile ? "border-red-500" : ""}`} />
              {employeeErrors.mobile && <p className="text-red-500 text-sm">{employeeErrors.mobile}</p>}
            </div>
            <div><label className="block font-medium">Email</label><input type="email" name="email" value={employeeData.email} onChange={handleEmployeeChange} className="border p-2 w-full rounded" /></div>

            <div className="col-span-2">
              <button type="button" onClick={handleAddEmployee} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                Add Employee
              </button>
            </div>

            {formData.employeeAssociation.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Added Employee</h3>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                  {formData.employeeAssociation.map((emp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p><strong>{emp.employeeName}</strong> ({emp.employeeUserName})</p>
                        <p>{emp.mobile} | {emp.email || "—"} | {emp.type}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveEmployee(i)} className="text-red-500 hover:text-red-700">
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
        {/* {activeTab === "lcoDocument" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Aadhaar Card</label>
              <input type="file" onChange={(e) => handleFileChange(e, "aadhaarCard")} className="w-full border border-gray-300 rounded-md p-2" />
              {formData.aadhaarCard && <p className="text-sm text-gray-600 mt-1">{formData.aadhaarCard.name}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">PAN Card</label>
              <input type="file" onChange={(e) => handleFileChange(e, "panCard")} className="w-full border border-gray-300 rounded-md p-2" />
              {formData.panCard && <p className="text-sm text-gray-600 mt-1">{formData.panCard.name}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">License</label>
              <input type="file" onChange={(e) => handleFileChange(e, "license")} className="w-full border border-gray-300 rounded-md p-2" />
              {formData.license && <p className="text-sm text-gray-600 mt-1">{formData.license.name}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Other Document</label>
              <input type="file" onChange={(e) => handleFileChange(e, "other")} className="w-full border border-gray-300 rounded-md p-2" />
              {formData.other && <p className="text-sm text-gray-600 mt-1">{formData.other.name}</p>}
            </div>
          </div>
        )} */}
        {activeTab === "lcoDocument" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Aadhaar Card", field: "aadhaarCard" },
              { label: "PAN Card", field: "panCard" },
              { label: "License", field: "license" },
              { label: "Other Document", field: "other" },
            ].map(({ label, field }) => {
              const doc = formData.documents.find(d => d.fieldName === field);

              return (
                <div key={field} className="border rounded-lg p-4 bg-gray-50">
                  <label className="block font-medium mb-2">{label}</label>

                  <input
                    type="file"
                    onChange={(e) => handleDocumentChange(e, field)}
                    className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
                    accept="image/*,.pdf"
                  />

                  {doc && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        Selected: <strong>{doc.name}</strong>
                      </p>

                      {doc.preview ? (
                        <div className="mt-3">
                          <img
                            src={doc.preview}
                            alt={`${label} preview`}
                            className="max-w-full h-32 object-contain border rounded shadow-sm"
                          />
                        </div>
                      ) : doc.file ? (
                        <p className="mt-2 text-sm text-gray-500 italic">
                          Preview not available (PDF or unsupported format)
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
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