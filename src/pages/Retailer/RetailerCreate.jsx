// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createRetailer } from "../../service/retailer";
// import { getRoles } from "../../service/role";
// import { toast } from "react-toastify";

// export default function RetailerCreate() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("general"); // State for active tab
//   const [formErrors, setFormErrors] = useState({}); // State for form validation errors

//   const initialFormData = {
//     title: "M/s",
//     resellerName: "",
//     password: "",
//     houseNo: "",
//     address: "",
//     taluka: "",
//     district: "",
//     state: "",
//     country: "India",
//     pincode: "",
//     area: "",
//     subArea: "",
//     mobileNo: "",
//     phoneNo: "",
//     fax: "",
//     email: "",
//     website: "",
//     messengerId: "",
//     dob: "",
//     anniversaryDate: "",
//     latitude: "",
//     longitude: "",
//     gstNo: "",
//     panNumber: "",
//     resellerCode: "",
//     balance: "",
//     dashboard: "Reseller",
//     status: "true",
//     contactPersonName: "",
//     contactPersonNumber: "",
//     supportEmail: "",
//     whatsAppNumber: "",
//     description: "",
//     // role:"Retailer",
//     nas: [],
//     employeeAssociation: [],
//     aadhaarCard: null, // NEW
//     panCard: null, // NEW
//     license: null, // NEW
//     other: null, // NEW
//   };

//   const initialEmployeeData = {
//     employeeUserName: "",
//     password: "",
//     employeeName: "",
//     type: "Manager",
//     mobile: "",
//     email: "",
//     status: "active",
//   };

//   const indianStates = [
//     "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//     "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//     "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//     "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
//     "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
//     "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
//   ];

//   const [formData, setFormData] = useState(initialFormData);
//   const [roles, setRoles] = useState([]);
//   const [employeeData, setEmployeeData] = useState(initialEmployeeData);
//   const [employeeErrors, setEmployeeErrors] = useState({});

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await getRoles();
//         if (res.status && res.data) {
//           const retailerRole = res.data.find(
//             (role) => role.roleName === "Retailer"
//           );
//           if (retailerRole) {
//             setRoles([retailerRole]);
//             setFormData((prev) => ({ ...prev, role: retailerRole._id }));
//           } else {
//             setRoles([]);
//           }
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error("Failed to load roles:", err);
//       }
//     };
//     fetchRoles();
//   }, []);

//   // Validate retailer form data
//   const validateRetailer = () => {
//     const errors = {};
//     if (!formData.resellerName) errors.resellerName = "Reseller Name is required";
//     if (!formData.password) errors.password = "Password is required";
//     if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
//     if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
//       errors.mobileNo = "Mobile Number must be 10 digits";
//     if (formData.phoneNo && !/^[0-9]{10}$/.test(formData.phoneNo))
//       errors.phoneNo = "Phone Number must be 10 digits";
//     if (formData.contactPersonNumber && !/^[0-9]{10}$/.test(formData.contactPersonNumber))
//       errors.contactPersonNumber = "Contact Person Number must be 10 digits";
//     if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
//       errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
//     return errors;
//   };

//   // Handle form input for retailer
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error for the field being edited
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Handle form input for employee
//   const handleEmployeeChange = (e) => {
//     const { name, value } = e.target;
//     setEmployeeData((prev) => ({ ...prev, [name]: value }));
//     // Clear error for the field being edited
//     setEmployeeErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Validate employee data
//   const validateEmployee = () => {
//     const errors = {};
//     if (!employeeData.employeeUserName)
//       errors.employeeUserName = "Username is required";
//     if (!employeeData.password) errors.password = "Password is required";
//     if (!employeeData.employeeName) errors.employeeName = "Name is required";
//     if (!employeeData.mobile) errors.mobile = "Mobile number is required";
//     if (employeeData.mobile && !/^[0-9]{10}$/.test(employeeData.mobile))
//       errors.mobile = "Mobile Number must be 10 digits";
//     return errors;
//   };

//   // Add employee to the list (only one allowed)
//   const handleAddEmployee = () => {
//     const errors = validateEmployee();
//     if (Object.keys(errors).length > 0) {
//       setEmployeeErrors(errors);
//       return;
//     }
//     const emp = { ...employeeData };
//     setFormData((prev) => ({
//       ...prev,
//       employeeAssociation: [...prev.employeeAssociation, emp],
//     }));
//     setEmployeeData(initialEmployeeData); // Reset employee form
//     setEmployeeErrors({});
//   };

//   // Remove employee from the list
//   const handleRemoveEmployee = (empId) => {
//     setFormData((prev) => ({
//       ...prev,
//       employeeAssociation: prev.employeeAssociation.filter((e) => e._id !== empId),
//     }));
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const retailerErrors = validateRetailer();
//     if (Object.keys(retailerErrors).length > 0) {
//       setFormErrors(retailerErrors);
//       setActiveTab("general"); // Switch to general tab to show errors
//       return;
//     }
//     setLoading(true);
//     try {
//       await createRetailer(formData);
//       toast.success("Retailer created successfully ✅");
//       navigate("/retailer/list");
//     } catch (err) {
//       console.error("Create Retailer Error:", err);
//       toast.error(err.message || "Failed to create retailer ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle clear form
//   const handleClear = () => {
//     setFormData(initialFormData);
//     setEmployeeData(initialEmployeeData);
//     setFormErrors({});
//     setEmployeeErrors({});
//   };

//   // Handle next button to switch to Associated Employee tab
//   const handleNext = () => {
//     const retailerErrors = validateRetailer();
//     if (Object.keys(retailerErrors).length > 0) {
//       setFormErrors(retailerErrors);
//       return;
//     }
//     setActiveTab("associated");
//   };

//   // Handle next button to switch to Reseller Document tab
//   const handleNextToDocument = () => {
//     setActiveTab("resellerDocument");
//   };

//   // Handle back button
//   const handleBack = () => {
//     if (activeTab === "resellerDocument") {
//       setActiveTab("associated");
//     } else if (activeTab === "associated") {
//       setActiveTab("general");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-6">Create Reseller</h2>

//       {/* Tabs */}
//       <div className="flex border-b mb-4">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === "general" ? "border-b-2 border-blue-500" : ""}`}
//           onClick={() => setActiveTab("general")}
//         >
//           General Information
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === "associated" ? "border-b-2 border-blue-500" : ""}`}
//           onClick={() => setActiveTab("associated")}
//         >
//           Associated Employee
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === "resellerDocument" ? "border-b-2 border-blue-500" : ""}`}
//           onClick={() => setActiveTab("resellerDocument")}
//         >
//           Reseller Document
//         </button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* General Information Tab */}
//         {activeTab === "general" && (
//           <div className="grid grid-cols-2 gap-4">
//             {/* Title */}
//             <div>
//               <label className="block font-medium">Title</label>
//               <select
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="Mr.">Mr.</option>
//                 <option value="Ms">Ms</option>
//                 <option value="M/s">M/s</option>
//                 <option value="Mrs">Mrs</option>
//                 <option value="Miss">Miss</option>
//               </select>
//             </div>
//             {/* Reseller Name */}
//             <div>
//               <label className="block font-medium">Reseller Name *</label>
//               <input
//                 type="text"
//                 name="resellerName"
//                 value={formData.resellerName}
//                 onChange={handleChange}
//                 required
//                 className={`border p-2 w-full rounded ${formErrors.resellerName ? "border-red-500" : ""}`}
//               />
//               {formErrors.resellerName && (
//                 <p className="text-red-500 text-sm">{formErrors.resellerName}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block font-medium">Password *</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className={`border p-2 w-full rounded ${formErrors.password ? "border-red-500" : ""}`}
//               />
//               {formErrors.password && (
//                 <p className="text-red-500 text-sm">{formErrors.password}</p>
//               )}
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block font-medium">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* House No */}
//             <div>
//               <label className="block font-medium">House No.</label>
//               <input
//                 type="text"
//                 name="houseNo"
//                 value={formData.houseNo}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Taluka */}
//             <div>
//               <label className="block font-medium">Taluka</label>
//               <input
//                 type="text"
//                 name="taluka"
//                 value={formData.taluka}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* District */}
//             <div>
//               <label className="block font-medium">District</label>
//               <input
//                 type="text"
//                 name="district"
//                 value={formData.district}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* State */}
//             <div>
//               <label className="block font-medium">State</label>
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="">Select State</option>
//                 {indianStates.map((state) => (
//                   <option key={state} value={state}>
//                     {state}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Country */}
//             <div>
//               <label className="block font-medium">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Pincode */}
//             <div>
//               <label className="block font-medium">Pincode</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Area */}
//             <div>
//               <label className="block font-medium">Area</label>
//               <input
//                 type="text"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Sub Area */}
//             <div>
//               <label className="block font-medium">Sub Area</label>
//               <input
//                 type="text"
//                 name="subArea"
//                 value={formData.subArea}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Mobile No */}
//             <div>
//               <label className="block font-medium">Mobile No *</label>
//               <input
//                 type="number"
//                 name="mobileNo"
//                 value={formData.mobileNo}
//                 onChange={handleChange}
//                 required
//                 className={`border p-2 w-full rounded ${formErrors.mobileNo ? "border-red-500" : ""}`}
//                 pattern="[0-9]{10}"
//               />
//               {formErrors.mobileNo && (
//                 <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>
//               )}
//             </div>

//             {/* Phone No */}
//             <div>
//               <label className="block font-medium">Phone No</label>
//               <input
//                 type="number"
//                 name="phoneNo"
//                 value={formData.phoneNo}
//                 onChange={handleChange}
//                 className={`border p-2 w-full rounded ${formErrors.phoneNo ? "border-red-500" : ""}`}
//                 pattern="[0-9]{10}"
//               />
//               {formErrors.phoneNo && (
//                 <p className="text-red-500 text-sm">{formErrors.phoneNo}</p>
//               )}
//             </div>

//             {/* Fax */}
//             {/* <div>
//               <label className="block font-medium">Fax</label>
//               <input
//                 type="text"
//                 name="fax"
//                 value={formData.fax}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div> */}

//             {/* Email */}
//             <div>
//               <label className="block font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Website */}
//             <div>
//               <label className="block font-medium">Website</label>
//               <input
//                 type="text"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Messenger ID */}
//             <div>
//               <label className="block font-medium">Messenger ID</label>
//               <input
//                 type="text"
//                 name="messengerId"
//                 value={formData.messengerId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* DOB */}
//             {/* <div>
//               <label className="block font-medium">Birth Date</label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div> */}

//             {/* Anniversary Date */}
//             {/* <div>
//               <label className="block font-medium">Anniversary Date</label>
//               <input
//                 type="date"
//                 name="anniversaryDate"
//                 value={formData.anniversaryDate}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div> */}

//             {/* Latitude */}
//             <div>
//               <label className="block font-medium">Latitude</label>
//               <input
//                 type="text"
//                 name="latitude"
//                 value={formData.latitude}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Longitude */}
//             <div>
//               <label className="block font-medium">Longitude</label>
//               <input
//                 type="text"
//                 name="longitude"
//                 value={formData.longitude}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* GST No */}
//             <div>
//               <label className="block font-medium">GST No</label>
//               <input
//                 type="text"
//                 name="gstNo"
//                 value={formData.gstNo}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* PAN Number */}
//             <div>
//               <label className="block font-medium">PAN Number</label>
//               <input
//                 type="text"
//                 name="panNumber"
//                 value={formData.panNumber}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Reseller Code */}
//             <div>
//               <label className="block font-medium">Reseller Code</label>
//               <input
//                 type="text"
//                 name="resellerCode"
//                 value={formData.resellerCode}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Balance */}
//             <div>
//               <label className="block font-medium">Balance</label>
//               <input
//                 type="number"
//                 name="balance"
//                 value={formData.balance}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Dashboard */}
//             {/* <div>
//               <label className="block font-medium">Dashboard</label>
//               <select
//                 name="dashboard"
//                 value={formData.dashboard}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="Reseller">Reseller</option>
//               </select>
//             </div> */}

//             {/* Status */}
//             <div>
//               <label className="block font-medium">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               >
//                 <option value="active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>

//             {/* Contact Person Name */}
//             <div>
//               <label className="block font-medium">Contact Person Name</label>
//               <input
//                 type="text"
//                 name="contactPersonName"
//                 value={formData.contactPersonName}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* Contact Person Number */}
//             <div>
//               <label className="block font-medium">Contact Person Number</label>
//               <input
//                 type="number"
//                 name="contactPersonNumber"
//                 value={formData.contactPersonNumber}
//                 onChange={handleChange}
//                 className={`border p-2 w-full rounded ${formErrors.contactPersonNumber ? "border-red-500" : ""}`}
//                 pattern="[0-9]{10}"
//               />
//               {formErrors.contactPersonNumber && (
//                 <p className="text-red-500 text-sm">{formErrors.contactPersonNumber}</p>
//               )}
//             </div>

//             {/* Support Email */}
//             <div>
//               <label className="block font-medium">Support Email</label>
//               <input
//                 type="email"
//                 name="supportEmail"
//                 value={formData.supportEmail}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//               />
//             </div>

//             {/* WhatsApp Number */}
//             <div>
//               <label className="block font-medium">WhatsApp Number</label>
//               <input
//                 type="number"
//                 name="whatsAppNumber"
//                 value={formData.whatsAppNumber}
//                 onChange={handleChange}
//                 className={`border p-2 w-full rounded ${formErrors.whatsAppNumber ? "border-red-500" : ""}`}
//                 pattern="[0-9]{10}"
//               />
//               {formErrors.whatsAppNumber && (
//                 <p className="text-red-500 text-sm">{formErrors.whatsAppNumber}</p>
//               )}
//             </div>

//             {/* Role */}
//             {/* <div>
//               <label className="block font-medium">Role</label>
//               <select
//                 name="roleId"
//                 value={formData.roleId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role._id} value={role._id}>
//                     {role.roleName}
//                   </option>
//                 ))}
//               </select>
//             </div> */}

//             {/* nas Checkboxes */}
//             {/* <div className="col-span-2">
//               <label className="block font-medium mb-2">NAS</label>
//               <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
//                 {[
//                   "Feature1",
//                   "Feature2",
//                   "Feature3",
//                   "Netway-103.255.235.3",
//                   "Netway-Tyagjibroadband",
//                   "Netway-Shivamnet",
//                   "Netway-Netwayinternet",
//                 ].map((nasOption) => (
//                   <label key={nasOption} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="nas"
//                       value={nasOption}
//                       checked={formData.nas.includes(nasOption)}
//                       onChange={(e) => {
//                         const { value, checked } = e.target;
//                         setFormData((prev) => {
//                           let updatedNas = [...prev.nas];
//                           if (checked) {
//                             updatedNas.push(value);
//                           } else {
//                             updatedNas = updatedNas.filter(
//                               (item) => item !== value
//                             );
//                           }
//                           return { ...prev, nas: updatedNas };
//                         });
//                       }}
//                       className="h-4 w-4"
//                     />
//                     <span>{nasOption}</span>
//                   </label>
//                 ))}
//               </div>
//             </div> */}
//             {/* Description */}
//             <div className="col-span-2">
//               <label className="block font-medium">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded h-24"
//               ></textarea>
//             </div>
//           </div>
//         )}
//         {/* Associated Employee Tab */}
//         {activeTab === "associated" && (
//           <div className="grid grid-cols-2 gap-4">
//             {/* Employee Username */}
//             <div>
//               <label className="block font-medium">Username *</label>
//               <input
//                 type="text"
//                 name="employeeUserName"
//                 value={employeeData.employeeUserName}
//                 onChange={handleEmployeeChange}
//                 className={`border p-2 w-full rounded ${employeeErrors.employeeUserName ? "border-red-500" : ""}`}
//                 // disabled={formData.employeeAssociation.length > 0}
//               />
//               {employeeErrors.employeeUserName && (
//                 <p className="text-red-500 text-sm">{employeeErrors.employeeUserName}</p>
//               )}
//             </div>
//             {/* Employee Password */}
//             <div>
//               <label className="block font-medium">Password *</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={employeeData.password}
//                 onChange={handleEmployeeChange}
//                 className={`border p-2 w-full rounded ${employeeErrors.password ? "border-red-500" : ""}`}
//                 // disabled={formData.employeeAssociation.length > 0}
//               />
//               {employeeErrors.password && (
//                 <p className="text-red-500 text-sm">{employeeErrors.password}</p>
//               )}
//             </div>
//             {/* Employee Name */}
//             <div>
//               <label className="block font-medium">Employee Name *</label>
//               <input
//                 type="text"
//                 name="employeeName"
//                 value={employeeData.employeeName}
//                 onChange={handleEmployeeChange}
//                 className={`border p-2 w-full rounded ${employeeErrors.employeeName ? "border-red-500" : ""}`}
//                 // disabled={formData.employeeAssociation.length > 0}
//               />
//               {employeeErrors.employeeName && (
//                 <p className="text-red-500 text-sm">{employeeErrors.employeeName}</p>
//               )}
//             </div>
//             {/* Employee Type */}
//             <div>
//               <label className="block font-medium">Type</label>
//               <select
//                 name="type"
//                 value={employeeData.type}
//                 onChange={handleEmployeeChange}
//                 className="border p-2 w-full rounded"
//                 // disabled={formData.employeeAssociation.length > 0}
//               >
//                 <option value="Admin">Admin</option>
//                 <option value="Manager">Manager</option>
//                 <option value="Operator">Operator</option>
//               </select>
//             </div>
//             {/* Employee Mobile */}
//             <div>
//               <label className="block font-medium">Mobile *</label>
//               <input
//                 type="number"
//                 name="mobile"
//                 value={employeeData.mobile}
//                 onChange={handleEmployeeChange}
//                 className={`border p-2 w-full rounded ${employeeErrors.mobile ? "border-red-500" : ""}`}
//                 pattern="[0-9]{10}"
//                 // disabled={formData.employeeAssociation.length > 0}
//               />
//               {employeeErrors.mobile && (
//                 <p className="text-red-500 text-sm">{employeeErrors.mobile}</p>
//               )}
//             </div>
//             {/* Employee Email */}
//             <div>
//               <label className="block font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={employeeData.email}
//                 onChange={handleEmployeeChange}
//                 className="border p-2 w-full rounded"
//                 // disabled={formData.employeeAssociation.length > 0}
//               />
//             </div>
//             {/* Employee Status */}
//             <div>
//               <label className="block font-medium">Status</label>
//               <select
//                 name="status"
//                 value={employeeData.status}
//                 onChange={handleEmployeeChange}
//                 className="border p-2 w-full rounded"
//                 // disabled={formData.employeeAssociation.length > 0}
//               >
//                 <option value="active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//             {/* Add Employee Button */}
//             {/* {formData.employeeAssociation.length === 0 && ( */}
//               <div className="col-span-2">
//                 <button
//                   type="button"
//                   onClick={handleAddEmployee}
//                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
//                 >
//                   Add Employee
//                 </button>
//               </div>
//             {/* )} */}
//             {/* Employee List */}
//             {formData.employeeAssociation.length > 0 && (
//               <div className="col-span-2">
//                 <h3 className="font-medium mb-2">Added Employee</h3>
//                 <div className="border rounded p-2 max-h-40 overflow-y-auto">
//                   {formData.employeeAssociation.map((employee, index) => (
//                     <div
//                       key={employee._id || index}
//                        className="flex justify-between items-center p-2 border-b"
//                      >
//                        <div>
//                          <p>
//                            <strong>{employee.employeeName}</strong> ({employee.employeeUserName})
//                          </p>
//                          <p>{employee.mobile} | {employee.email || "—"} | {employee.status}</p>
//                        </div>
//                        <button
//                          type="button"
//                          onClick={() => handleRemoveEmployee(employee._id || index)}
//                          className="text-red-500 hover:text-red-700"
//                        >
//                          Remove
//                        </button>
//                      </div>
//                    ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         {/* Form Buttons */}
//         <div className="col-span-2 flex justify-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={() => setActiveTab("general")}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//           >
//             Back
//           </button>
//           {activeTab === "general" && (
//             <button
//               type="button"
//               onClick={handleNext}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             >
//               Next
//             </button>
//           )}
//           {activeTab === "associated" && (
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             >
//               {loading ? "Saving..." : "Submit"}
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRetailer } from "../../service/retailer";
import { getRoles } from "../../service/role";
import { toast } from "react-toastify";

export default function RetailerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formErrors, setFormErrors] = useState({});

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
    status: "true",
    contactPersonName: "",
    contactPersonNumber: "",
    supportEmail: "",
    whatsAppNumber: "",
    description: "",
    // role:"Retailer",
    nas: [],
    employeeAssociation: [],
    aadhaarCard: null, // NEW - File object
    panCard: null, // NEW - File object
    license: null, // NEW - File object
    other: null, // NEW - File object
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
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [roles, setRoles] = useState([]);
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [employeeErrors, setEmployeeErrors] = useState({});

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
            setFormData((prev) => ({ ...prev, role: retailerRole._id }));
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

  // Validate retailer form data
  const validateRetailer = () => {
    const errors = {};
    if (!formData.resellerName)
      errors.resellerName = "Reseller Name is required";
    if (!formData.password) errors.password = "Password is required";
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

  // Handle form input for retailer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form input for employee
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setEmployeeErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate employee data
  const validateEmployee = () => {
    const errors = {};
    if (!employeeData.employeeUserName)
      errors.employeeUserName = "Username is required";
    if (!employeeData.password) errors.password = "Password is required";
    if (!employeeData.employeeName) errors.employeeName = "Name is required";
    if (!employeeData.mobile) errors.mobile = "Mobile number is required";
    if (employeeData.mobile && !/^[0-9]{10}$/.test(employeeData.mobile))
      errors.mobile = "Mobile Number must be 10 digits";
    return errors;
  };
  // Add employee to the list (only one allowed)
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
    setEmployeeData(initialEmployeeData); // Reset employee form
    setEmployeeErrors({});
  };
  // Remove employee from the list
  const handleRemoveEmployee = (empId) => {
    setFormData((prev) => ({
      ...prev,
      employeeAssociation: prev.employeeAssociation.filter(
        (e) => e._id !== empId
      ),
    }));
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const retailerErrors = validateRetailer();
    if (Object.keys(retailerErrors).length > 0) {
      setFormErrors(retailerErrors);
      setActiveTab("general"); // Switch to general tab to show errors
      return;
    }
    setLoading(true);
    try {
      // await createRetailer(formData);
      const submitData = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            // Convert arrays/objects to JSON strings
            // submitData.append(key, JSON.stringify(formData[key]));
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            // Append normal fields & files directly
            submitData.append(key, formData[key]);
          }
        }
      }

      // 🟢 Send it to API — no need to stringify
      await createRetailer(submitData);
      toast.success("Retailer created successfully ✅");
      navigate("/retailer/list");
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
    setEmployeeData(initialEmployeeData);
    setFormErrors({});
    setEmployeeErrors({});
  };

  // Handle next button to switch to Associated Employee tab
  const handleNext = () => {
    const retailerErrors = validateRetailer();
    if (Object.keys(retailerErrors).length > 0) {
      setFormErrors(retailerErrors);
      return;
    }
    setActiveTab("associated");
  };

  // Handle next button to switch to Reseller Document tab
  const handleNextToDocument = () => {
    setActiveTab("resellerDocument");
  };

  // Handle back button
  const handleBack = () => {
    if (activeTab === "resellerDocument") {
      setActiveTab("associated");
    } else if (activeTab === "associated") {
      setActiveTab("general");
    }
  };

  // Handle file change for documents
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Reseller</h2>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "general" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "associated" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("associated")}
        >
          Associated Employee
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "resellerDocument" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("resellerDocument")}
        >
          Reseller Document
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
                required
                className={`border p-2 w-full rounded ${
                  formErrors.resellerName ? "border-red-500" : ""
                }`}
              />
              {formErrors.resellerName && (
                <p className="text-red-500 text-sm">
                  {formErrors.resellerName}
                </p>
              )}
            </div>
            {/* Password */}
            {/* <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`border p-2 w-full rounded ${
                  formErrors.password ? "border-red-500" : ""
                }`}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
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
            {/* <div>
              <label className="block font-medium">House No.</label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

            {/* Taluka */}
            {/* <div>
              <label className="block font-medium">Taluka</label>
              <input
                type="text"
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

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
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
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
            {/* <div>
              <label className="block font-medium">Sub Area</label>
              <input
                type="text"
                name="subArea"
                value={formData.subArea}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

            {/* Mobile No */}
            <div>
              <label className="block font-medium">Mobile No *</label>
              <input
                type="number"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
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
            {/* <div>
              <label className="block font-medium">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
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
            {/* <div>
              <label className="block font-medium">Messenger ID</label>
              <input
                type="text"
                name="messengerId"
                value={formData.messengerId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

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
            {/* <div>
              <label className="block font-medium">Reseller Code</label>
              <input
                type="text"
                name="resellerCode"
                value={formData.resellerCode}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div> */}

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
            {/* <div>
              <label className="block font-medium">Dashboard</label>
              <select
                name="dashboard"
                value={formData.dashboard}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="Reseller">Reseller</option>
              </select>
            </div> */}

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
                <p className="text-red-500 text-sm">
                  {formErrors.whatsAppNumber}
                </p>
              )}
            </div>

            {/* Role */}
            {/* <div>
              <label className="block font-medium">Role</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div> */}

            {/* nas Checkboxes */}
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
                      name="nas"
                      value={nasOption}
                      checked={formData.nas.includes(nasOption)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setFormData((prev) => {
                          let updatedNas = [...prev.nas];
                          if (checked) {
                            updatedNas.push(value);
                          } else {
                            updatedNas = updatedNas.filter(
                              (item) => item !== value
                            );
                          }
                          return { ...prev, nas: updatedNas };
                        });
                      }}
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
                className={`border p-2 w-full rounded ${
                  employeeErrors.employeeUserName ? "border-red-500" : ""
                }`}
                // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.employeeUserName && (
                <p className="text-red-500 text-sm">
                  {employeeErrors.employeeUserName}
                </p>
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
                className={`border p-2 w-full rounded ${
                  employeeErrors.password ? "border-red-500" : ""
                }`}
                // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.password && (
                <p className="text-red-500 text-sm">
                  {employeeErrors.password}
                </p>
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
                className={`border p-2 w-full rounded ${
                  employeeErrors.employeeName ? "border-red-500" : ""
                }`}
                // disabled={formData.employeeAssociation.length > 0}
              />
              {employeeErrors.employeeName && (
                <p className="text-red-500 text-sm">
                  {employeeErrors.employeeName}
                </p>
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
                className={`border p-2 w-full rounded ${
                  employeeErrors.mobile ? "border-red-500" : ""
                }`}
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
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {/* Add Employee Button */}
            {/* {formData.employeeAssociation.length === 0 && ( */}
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Employee
              </button>
            </div>
            {/* )} */}
            {/* Employee List */}
            {formData.employeeAssociation.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Added Employee</h3>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                  {formData.employeeAssociation.map((employee, index) => (
                    <div
                      key={employee._id || index}
                      className="flex justify-between items-center p-2 border-b"
                    >
                      <div>
                        <p>
                          <strong>{employee.employeeName}</strong> (
                          {employee.employeeUserName})
                        </p>
                        <p>
                          {employee.mobile} | {employee.email || "—"} |{" "}
                          {employee.status}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveEmployee(employee._id || index)
                        }
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
              <label className="block font-medium mb-1">Aadhaar Card</label>
              <input
                type="file"
                name="aadhaarCard"
                onChange={(e) => handleFileChange(e, "aadhaarCard")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {formData.aadhaarCard && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.aadhaarCard.name}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">PAN Card</label>
              <input
                type="file"
                name="panCard"
                onChange={(e) => handleFileChange(e, "panCard")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {formData.panCard && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.panCard.name}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">License</label>
              <input
                type="file"
                name="license"
                onChange={(e) => handleFileChange(e, "license")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {formData.license && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.license.name}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Other Document</label>
              <input
                type="file"
                name="other"
                onChange={(e) => handleFileChange(e, "other")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {formData.other && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.other.name}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Form Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-6">
          {activeTab !== "general" && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Back
            </button>
          )}
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
              type="button"
              onClick={handleNextToDocument}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {activeTab === "resellerDocument" && (
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
