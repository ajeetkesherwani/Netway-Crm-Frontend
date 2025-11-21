// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getRetailerDetails, updateRetailer } from "../../service/retailer";
// import { getRoles } from "../../service/role";
// import { toast } from "react-toastify";

// export default function RetailerUpdate() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
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
//     dashboard: "Admin",
//     status: "true",
//     contactPersonName: "",
//     contactPersonNumber: "",
//     supportEmail: "",
//     whatsAppNumber: "",
//     description: "",
//     roleId: "",
//     nas: [],
//   });
//   const [roles, setRoles] = useState([]);
//   const [formErrors, setFormErrors] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [rolesRes, retailerRes] = await Promise.all([
//           getRoles(),
//           getRetailerDetails(id),
//         ]);
//         if (rolesRes.status && rolesRes.data) {
//           setRoles(rolesRes.data);
//         }
//         if (retailerRes.data) {
//           setFormData({
//             ...formData,
//             ...retailerRes.data,
//             password: "", // Do not prefill password for security
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load data:", err);
//         toast.error("Failed to load retailer details ❌");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   // Validate form data
//   const validate = () => {
//     const errors = {};
//     if (!formData.resellerName)
//       errors.resellerName = "Reseller Name is required";
//     if (!formData.mobileNo) errors.mobileNo = "Mobile Number is required";
//     if (formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo))
//       errors.mobileNo = "Mobile Number must be 10 digits";
//     if (formData.phoneNo && !/^[0-9]{10}$/.test(formData.phoneNo))
//       errors.phoneNo = "Phone Number must be 10 digits";
//     if (
//       formData.contactPersonNumber &&
//       !/^[0-9]{10}$/.test(formData.contactPersonNumber)
//     )
//       errors.contactPersonNumber = "Contact Person Number must be 10 digits";
//     if (formData.whatsAppNumber && !/^[0-9]{10}$/.test(formData.whatsAppNumber))
//       errors.whatsAppNumber = "WhatsApp Number must be 10 digits";
//     return errors;
//   };

//   // Handle form input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Handle NAS checkboxes
//   // const handleNasChange = (e) => {
//   //   const { value, checked } = e.target;
//   //   setFormData((prev) => {
//   //     let updatedNas = [...prev.nas];
//   //     if (checked) {
//   //       updatedNas.push(value);
//   //     } else {
//   //       updatedNas = updatedNas.filter((item) => item !== value);
//   //     }
//   //     return { ...prev, nas: updatedNas };
//   //   });
//   // };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setFormErrors(validationErrors);
//       return;
//     }
//     setLoading(true);
//     try {
//       await updateRetailer(id, formData);
//       toast.success("Retailer updated successfully ✅");
//       navigate("/retailer/list");
//     } catch (err) {
//       console.error("Update Retailer Error:", err);
//       toast.error(err.message || "Failed to update retailer ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle clear form
//   const handleClear = () => {
//     setFormData({
//       title: "M/s",
//       resellerName: "",
//       password: "",
//       houseNo: "",
//       address: "",
//       taluka: "",
//       district: "",
//       state: "",
//       country: "India",
//       pincode: "",
//       area: "",
//       subArea: "",
//       mobileNo: "",
//       phoneNo: "",
//       fax: "",
//       email: "",
//       website: "",
//       messengerId: "",
//       dob: "",
//       anniversaryDate: "",
//       latitude: "",
//       longitude: "",
//       gstNo: "",
//       panNumber: "",
//       resellerCode: "",
//       balance: "",
//       dashboard: "Admin",
//       status: "true",
//       contactPersonName: "",
//       contactPersonNumber: "",
//       supportEmail: "",
//       whatsAppNumber: "",
//       description: "",
//       roleId: "",
//       nas: [],
//     });
//     setFormErrors({});
//   };

//   if (loading) return <p className="p-4">Loading retailer details...</p>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-6">Update Retailer</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//         {/* Title */}
//         <div>
//           <label className="block font-medium">Title</label>
//           <select
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="Mr.">Mr.</option>
//             <option value="Ms">Ms</option>
//             <option value="M/s">M/s</option>
//             <option value="Mrs">Mrs</option>
//             <option value="Miss">Miss</option>
//           </select>
//         </div>

//         {/* Reseller Name */}
//         <div>
//           <label className="block font-medium">Reseller Name *</label>
//           <input
//             type="text"
//             name="resellerName"
//             value={formData.resellerName}
//             onChange={handleChange}
//             className={`border p-2 w-full rounded ${
//               formErrors.resellerName ? "border-red-500" : ""
//             }`}
//           />
//           {formErrors.resellerName && (
//             <p className="text-red-500 text-sm">{formErrors.resellerName}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block font-medium">
//             Password (leave blank to keep current)
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Address */}
//         <div>
//           <label className="block font-medium">Address</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* House No */}
//         <div>
//           <label className="block font-medium">House No.</label>
//           <input
//             type="text"
//             name="houseNo"
//             value={formData.houseNo}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Taluka */}
//         <div>
//           <label className="block font-medium">Taluka</label>
//           <input
//             type="text"
//             name="taluka"
//             value={formData.taluka}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* District */}
//         <div>
//           <label className="block font-medium">District</label>
//           <input
//             type="text"
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* State */}
//         <div>
//           <label className="block font-medium">State</label>
//           <select
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="">Select State</option>
//             <option value="Uttar Pradesh">Uttar Pradesh</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Haryana">Haryana</option>
//             <option value="Maharashtra">Maharashtra</option>
//           </select>
//         </div>

//         {/* Country */}
//         <div>
//           <label className="block font-medium">Country</label>
//           <input
//             type="text"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Pincode */}
//         <div>
//           <label className="block font-medium">Pincode</label>
//           <input
//             type="text"
//             name="pincode"
//             value={formData.pincode}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Area */}
//         <div>
//           <label className="block font-medium">Area</label>
//           <input
//             type="text"
//             name="area"
//             value={formData.area}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Sub Area */}
//         <div>
//           <label className="block font-medium">Sub Area</label>
//           <input
//             type="text"
//             name="subArea"
//             value={formData.subArea}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Mobile No */}
//         <div>
//           <label className="block font-medium">Mobile No *</label>
//           <input
//             type="number"
//             name="mobileNo"
//             value={formData.mobileNo}
//             onChange={handleChange}
//             className={`border p-2 w-full rounded ${
//               formErrors.mobileNo ? "border-red-500" : ""
//             }`}
//             pattern="[0-9]{10}"
//           />
//           {formErrors.mobileNo && (
//             <p className="text-red-500 text-sm">{formErrors.mobileNo}</p>
//           )}
//         </div>

//         {/* Phone No */}
//         <div>
//           <label className="block font-medium">Phone No</label>
//           <input
//             type="number"
//             name="phoneNo"
//             value={formData.phoneNo}
//             onChange={handleChange}
//             className={`border p-2 w-full rounded ${
//               formErrors.phoneNo ? "border-red-500" : ""
//             }`}
//             pattern="[0-9]{10}"
//           />
//           {formErrors.phoneNo && (
//             <p className="text-red-500 text-sm">{formErrors.phoneNo}</p>
//           )}
//         </div>

//         {/* Fax */}
//         <div>
//           <label className="block font-medium">Fax</label>
//           <input
//             type="text"
//             name="fax"
//             value={formData.fax}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Website */}
//         <div>
//           <label className="block font-medium">Website</label>
//           <input
//             type="text"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Messenger ID */}
//         <div>
//           <label className="block font-medium">Messenger ID</label>
//           <input
//             type="text"
//             name="messengerId"
//             value={formData.messengerId}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* DOB */}
//         {/* <div>
//           <label className="block font-medium">Birth Date</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div> */}

//         {/* Anniversary Date */}
//         {/* <div>
//           <label className="block font-medium">Anniversary Date</label>
//           <input
//             type="date"
//             name="anniversaryDate"
//             value={formData.anniversaryDate}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div> */}

//         {/* Latitude */}
//         <div>
//           <label className="block font-medium">Latitude</label>
//           <input
//             type="text"
//             name="latitude"
//             value={formData.latitude}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Longitude */}
//         <div>
//           <label className="block font-medium">Longitude</label>
//           <input
//             type="text"
//             name="longitude"
//             value={formData.longitude}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* GST No */}
//         <div>
//           <label className="block font-medium">GST No</label>
//           <input
//             type="text"
//             name="gstNo"
//             value={formData.gstNo}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* PAN Number */}
//         <div>
//           <label className="block font-medium">PAN Number</label>
//           <input
//             type="text"
//             name="panNumber"
//             value={formData.panNumber}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Reseller Code */}
//         <div>
//           <label className="block font-medium">Reseller Code</label>
//           <input
//             type="text"
//             name="resellerCode"
//             value={formData.resellerCode}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Balance */}
//         <div>
//           <label className="block font-medium">Balance</label>
//           <input
//             type="number"
//             name="balance"
//             value={formData.balance}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Dashboard */}
//         <div>
//           <label className="block font-medium">Dashboard</label>
//           <select
//             name="dashboard"
//             value={formData.dashboard}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="Admin">Admin</option>
//             <option value="Reseller">Reseller</option>
//             <option value="Manager">Manager</option>
//           </select>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block font-medium">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//         </div>

//         {/* Contact Person Name */}
//         <div>
//           <label className="block font-medium">Contact Person Name</label>
//           <input
//             type="text"
//             name="contactPersonName"
//             value={formData.contactPersonName}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Contact Person Number */}
//         <div>
//           <label className="block font-medium">Contact Person Number</label>
//           <input
//             type="number"
//             name="contactPersonNumber"
//             value={formData.contactPersonNumber}
//             onChange={handleChange}
//             className={`border p-2 w-full rounded ${
//               formErrors.contactPersonNumber ? "border-red-500" : ""
//             }`}
//             pattern="[0-9]{10}"
//           />
//           {formErrors.contactPersonNumber && (
//             <p className="text-red-500 text-sm">
//               {formErrors.contactPersonNumber}
//             </p>
//           )}
//         </div>

//         {/* Support Email */}
//         <div>
//           <label className="block font-medium">Support Email</label>
//           <input
//             type="email"
//             name="supportEmail"
//             value={formData.supportEmail}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* WhatsApp Number */}
//         <div>
//           <label className="block font-medium">WhatsApp Number</label>
//           <input
//             type="number"
//             name="whatsAppNumber"
//             value={formData.whatsAppNumber}
//             onChange={handleChange}
//             className={`border p-2 w-full rounded ${
//               formErrors.whatsAppNumber ? "border-red-500" : ""
//             }`}
//             pattern="[0-9]{10}"
//           />
//           {formErrors.whatsAppNumber && (
//             <p className="text-red-500 text-sm">{formErrors.whatsAppNumber}</p>
//           )}
//         </div>

//         {/* Role */}
//         {/* <div>
//           <label className="block font-medium">Role</label>
//           <select
//             name="roleId"
//             value={formData.roleId}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="">Select Role</option>
//             {roles.map((role) => (
//               <option key={role._id} value={role._id}>
//                 {role.roleName}
//               </option>
//             ))}
//           </select>
//         </div> */}

//         {/* NAS Checkboxes */}
//         {/* <div className="col-span-2">
//           <label className="block font-medium mb-2">NAS</label>
//           <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
//             {[
//               "Feature1",
//               "Feature2",
//               "Feature3",
//               "Netway-103.255.235.3",
//               "Netway-Tyagjibroadband",
//               "Netway-Shivamnet",
//               "Netway-Netwayinternet",
//             ].map((nasOption) => (
//               <label key={nasOption} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={nasOption}
//                   checked={formData.nas.includes(nasOption)}
//                   onChange={handleNasChange}
//                   className="h-4 w-4"
//                 />
//                 <span>{nasOption}</span>
//               </label>
//             ))}
//           </div>
//         </div> */}

//         {/* Description */}
//         <div className="col-span-2">
//           <label className="block font-medium">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border p-2 w-full rounded h-24"
//           ></textarea>
//         </div>
//         {/* Buttons */}
//         <div className="col-span-2 flex justify-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={() => navigate("/retailer/list")}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
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

// src/pages/retailer/RetailerUpdate.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRetailerDetails, updateRetailer } from "../../service/retailer";
import { toast } from "react-toastify";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu and Kashmir", "Ladakh"
];

export default function RetailerUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchRetailer = async () => {
      try {
        setLoading(true);
        const res = await getRetailerDetails(id);

        if (res.data) {
          const retailer = res.data;

          setFormData({
            // EXACT FIELD NAMES FROM BACKEND RESPONSE
            title: retailer.title || "Mr.",
            resellerName: retailer.resellerName || "",
            plainPassword: "", // Password change ke liye
            mobileNo: retailer.mobileNo?.toString() || "",
            phoneNo: retailer.phoneNo?.toString() || "",
            email: retailer.email || "",
            houseNo: retailer.houseNo || "",
            address: retailer.address || "",
            taluka: retailer.taluka || "",
            district: retailer.district || "",
            state: retailer.state || "",
            country: retailer.country || "India",
            pincode: retailer.pincode || "",
            area: retailer.area || "",
            subArea: retailer.subArea || "",
            website: retailer.website || "",
            gstNo: retailer.gstNo || "",
            panNumber: retailer.panNumber || "",
            resellerCode: retailer.resellerCode || "",
            balance: retailer.balance || retailer.walletBalance || "",
            contactPersonName: retailer.contactPersonName || "",
            contactPersonNumber: retailer.contactPersonNumber?.toString() || "",
            supportEmail: retailer.supportEmail || "",
            whatsAppNumber: retailer.whatsAppNumber?.toString() || "",
            description: retailer.description || "",
            status: retailer.status || "active",

            // Documents - sirf display ke liye
            existingAadhaar: retailer.document?.aadhaarCard || [],
            existingPan: retailer.document?.panCard || [],
            existingLicense: retailer.document?.license || [],
            existingOther: retailer.document?.other || [],

            // New files
            aadhaarCard: null,
            panCard: null,
            license: null,
            other: null,
          });
        }
      } catch (err) {
        toast.error("Failed to load retailer details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRetailer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key.startsWith("existing")) return;

        const value = formData[key];
        if (value === null || value === undefined) return;
        if (typeof value === "string" && value.trim() === "") return;

        submitData.append(key, value);
      });

      if ([...submitData.entries()].length === 0) {
        toast.warning("No changes made!");
        setLoading(false);
        return;
      }

      await updateRetailer(id, submitData);
      toast.success("Retailer updated successfully!");
      navigate("/retailer/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading retailer details...</div>;
  if (!formData) return <div className="p-10 text-center text-red-600 text-xl">Retailer not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Update Retailer</h2>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-8 py-3 text-lg font-semibold ${activeTab === "general" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`px-8 py-3 text-lg font-semibold ${activeTab === "document" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("document")}
        >
          Documents
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* GENERAL TAB */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <select name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-3">
                <option value="Mr.">Mr.</option>
                <option value="Ms">Ms</option>
                <option value="M/s">M/s</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Reseller Name *</label>
              <input type="text" name="resellerName" value={formData.resellerName} onChange={handleChange} required className="w-full border rounded p-3" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input type="password" name="plainPassword" value={formData.plainPassword} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full border rounded p-3" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mobile No *</label>
              <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required className="w-full border rounded p-3" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-3" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone No</label>
              <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full border rounded p-3" />
            </div>

            <div><label className="block font-semibold mb-1">House No.</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded p-3" /></div>

            <div>
              <label className="block font-semibold mb-1">State *</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full border rounded p-3">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div><label className="block font-semibold mb-1">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">GST No</label><input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">PAN Number</label><input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Reseller Code</label><input type="text" name="resellerCode" value={formData.resellerCode} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Balance</label><input type="text" name="balance" value={formData.balance} onChange={handleChange} className="w-full border rounded p-3" /></div>

            <div><label className="block font-semibold mb-1">Contact Person Name</label><input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Contact Person Number</label><input type="text" name="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Support Email</label><input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">WhatsApp Number</label><input type="text" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange} className="w-full border rounded p-3" /></div>

            <div>
              <label className="block font-semibold mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-3">
                <option value="active">Active</option>
                <option value="inActive">Inactive</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border rounded p-3"></textarea>
            </div>
          </div>
        )}

        {/* DOCUMENT TAB - 2 COLUMN */}
        {activeTab === "document" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Aadhaar Card</label>
              {formData.existingAadhaar?.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700">
                  {formData.existingAadhaar.map((path, i) => (
                    <div key={i} className="mb-1">{path.split('/').pop()}</div>
                  ))}
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "aadhaarCard")} className="w-full p-3 border rounded" />
              <small className="text-gray-600">Upload new to replace</small>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">PAN Card</label>
              {formData.existingPan?.length > 0 && formData.existingPan.map((path, i) => (
                <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
              ))}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "panCard")} className="w-full p-3 border rounded" />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">License</label>
              {formData.existingLicense?.length > 0 && formData.existingLicense.map((path, i) => (
                <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
              ))}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "license")} className="w-full p-3 border rounded" />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Other Document</label>
              {formData.existingOther?.length > 0 && formData.existingOther.map((path, i) => (
                <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
              ))}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "other")} className="w-full p-3 border rounded" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
          <button type="button" onClick={() => navigate("/retailer/list")} className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back
          </button>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Updating..." : "Update Retailer"}
          </button>
        </div>
      </form>
    </div>
  );
}