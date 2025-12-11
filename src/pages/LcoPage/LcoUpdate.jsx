// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getLcoDetails, updateLco } from "../../service/lco";
// import { getRetailer } from "../../service/retailer";
// import { toast } from "react-toastify";

// const indianStates = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
//   "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
//   "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
//   "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
//   "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
//   "Jammu and Kashmir", "Ladakh"
// ];

// export default function UpdateLco() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("general");
//   const [formData, setFormData] = useState(null);
//   const [retailers, setRetailers] = useState([]);

//   useEffect(() => {
//     const fetchLco = async () => {
//       try {
//         setLoading(true);
//         const [lcoRes, retailerRes] = await Promise.all([
//           getLcoDetails(id),
//           getRetailer()
//         ]);

//         if (retailerRes.status && retailerRes.data) {
//           setRetailers(retailerRes.data);
//         }

//         if (lcoRes.data) {
//           const lco = lcoRes.data;

//           setFormData({
//             // EXACT FIELD NAMES FROM BACKEND RESPONSE
//             title: lco.title || "Mr.",
//             retailerId: lco.retailerId?._id || lco.retailerId || "",
//             lcoName: lco.lcoName || "",
//             plainPassword: "", // Yeh bhejna hai password change ke liye
//             mobileNo: lco.mobileNo?.toString() || "",
//             houseNo: lco.houseNo || "",
//             address: lco.address || "",
//             taluka: lco.taluka || "",
//             district: lco.district || "",
//             state: lco.state || "",
//             pincode: lco.pincode || "",
//             area: lco.area || "",
//             subArea: lco.subArea || "",
//             email: lco.email || "",
//             website: lco.website || "",
//             lcoCode: lco.lcoCode || "",
//             status: lco.status || "active",

//             // Optional fields (jo backend accept karta hai)
//             supportWhatsApp: lco.supportWhatsApp || "",
//             supportEmail: lco.supportEmail || "",
//             contactPersonName: lco.contactPersonName || "",
//             contactPersonNumber: lco.contactPersonNumber || "",

//             // Documents - sirf display ke liye
//             existingAadhaar: lco.document?.aadhaarCard || [],
//             existingPan: lco.document?.panCard || [],
//             existingLicense: lco.document?.license || [],
//             existingOther: lco.document?.other || [],

//             // New files upload
//             aadhaarCard: null,
//             panCard: null,
//             license: null,
//             other: null,
//           });
//         }
//       } catch (err) {
//         toast.error("Failed to load LCO details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchLco();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, [field]: file }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData) return;

//     setLoading(true);
//     try {
//       const submitData = new FormData();

//       // Sirf changed ya filled fields bhejo
//       Object.keys(formData).forEach(key => {
//         if (key.startsWith("existing")) return;

//         const value = formData[key];

//         // Skip empty strings & null (except files)
//         if (value === null || value === undefined) return;
//         if (typeof value === "string" && value.trim() === "") return;

//         submitData.append(key, value);
//       });

//       // Agar kuch bhi nahi bheja toh warning
//       if ([...submitData.entries()].length === 0) {
//         toast.warning("No changes made!");
//         setLoading(false);
//         return;
//       }

//       await updateLco(id, submitData);
//       toast.success("LCO updated successfully!");
//       navigate("/lco/list");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-xl">Loading...</div>;
//   if (!formData) return <div className="p-10 text-center text-red-600 text-xl">LCO not found</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       {/* Heading Left Mein */}
//       <h2 className="text-3xl font-bold mb-8 text-blue-700">Update LCO</h2>

//       {/* Tabs */}
//       <div className="flex border-b mb-8">
//         <button
//           className={`px-8 py-3 text-lg font-semibold ${activeTab === "general" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
//           onClick={() => setActiveTab("general")}
//         >
//           General Information
//         </button>
//         <button
//           className={`px-8 py-3 text-lg font-semibold ${activeTab === "document" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
//           onClick={() => setActiveTab("document")}
//         >
//           Documents
//         </button>
//       </div>

//       <form onSubmit={handleSubmit}>

//         {/* GENERAL TAB */}
//         {activeTab === "general" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block font-semibold mb-1">Title</label>
//               <select name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-3">
//                 <option value="Mr.">Mr.</option>
//                 <option value="Ms">Ms</option>
//                 <option value="M/s">M/s</option>
//                 <option value="Mrs">Mrs</option>
//                 <option value="Miss">Miss</option>
//               </select>
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">LCO Name *</label>
//               <input type="text" name="lcoName" value={formData.lcoName} onChange={handleChange} required className="w-full border rounded p-3" />
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">Password</label>
//               <input type="password" name="plainPassword" value={formData.plainPassword} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full border rounded p-3" />
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">Mobile No *</label>
//               <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required className="w-full border rounded p-3" />
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-3" />
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">Reseller *</label>
//               <select name="retailerId" value={formData.retailerId} onChange={handleChange} required className="w-full border rounded p-3">
//                 <option value="">Select Reseller</option>
//                 {retailers.map(r => (
//                   <option key={r._id} value={r._id}>{r.resellerName || r.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div><label className="block font-semibold mb-1">House No.</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded p-3" /></div>

//             <div>
//               <label className="block font-semibold mb-1">State *</label>
//               <select name="state" value={formData.state} onChange={handleChange} required className="w-full border rounded p-3">
//                 <option value="">Select State</option>
//                 {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>

//             <div><label className="block font-semibold mb-1">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full border rounded p-3" /></div>
//             <div><label className="block font-semibold mb-1">LCO Code</label><input type="text" name="lcoCode" value={formData.lcoCode} onChange={handleChange} className="w-full border rounded p-3" /></div>

//             <div>
//               <label className="block font-semibold mb-1">Status</label>
//               <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-3">
//                 <option value="active">Active</option>
//                 <option value="inActive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {/* DOCUMENT TAB - 2 COLUMN + ONLY FILE NAME */}
//         {activeTab === "document" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-gray-50 p-6 rounded-lg border">
//               <label className="block font-bold text-lg mb-3">Aadhaar Card</label>
//               {formData.existingAadhaar?.length > 0 && (
//                 <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700">
//                   {formData.existingAadhaar.map((path, i) => (
//                     <div key={i} className="mb-1">{path.split('/').pop()}</div>
//                   ))}
//                 </div>
//               )}
//               <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "aadhaarCard")} className="w-full p-3 border rounded" />
//               <small className="text-gray-600">Upload new to replace</small>
//             </div>

//             <div className="bg-gray-50 p-6 rounded-lg border">
//               <label className="block font-bold text-lg mb-3">PAN Card</label>
//               {formData.existingPan?.length > 0 && formData.existingPan.map((path, i) => (
//                 <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
//               ))}
//               <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "panCard")} className="w-full p-3 border rounded" />
//             </div>

//             <div className="bg-gray-50 p-6 rounded-lg border">
//               <label className="block font-bold text-lg mb-3">License</label>
//               {formData.existingLicense?.length > 0 && formData.existingLicense.map((path, i) => (
//                 <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
//               ))}
//               <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "license")} className="w-full p-3 border rounded" />
//             </div>

//             <div className="bg-gray-50 p-6 rounded-lg border">
//               <label className="block font-bold text-lg mb-3">Other Document</label>
//               {formData.existingOther?.length > 0 && formData.existingOther.map((path, i) => (
//                 <div key={i} className="mb-1 text-sm text-gray-700">{path.split('/').pop()}</div>
//               ))}
//               <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "other")} className="w-full p-3 border rounded" />
//             </div>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
//           <button type="button" onClick={() => navigate("/lco/list")} className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
//             Back
//           </button>
//           <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60">
//             {loading ? "Updating..." : "Update LCO"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLcoDetails, updateLco } from "../../service/lco";
import { getRetailer } from "../../service/retailer";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu and Kashmir", "Ladakh"
];

export default function UpdateLco() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(null);
  const [retailers, setRetailers] = useState([]);

  useEffect(() => {
    const fetchLco = async () => {
      try {
        setLoading(true);
        const [lcoRes, retailerRes] = await Promise.all([
          getLcoDetails(id),
          getRetailer()
        ]);

        if (retailerRes.status && retailerRes.data) {
          setRetailers(retailerRes.data);
        }

        if (lcoRes.data) {
          const lco = lcoRes.data;

          setFormData({
            title: lco.title || "Mr.",
            retailerId: lco.retailerId?._id || lco.retailerId || "",
            lcoName: lco.lcoName || "",
            plainPassword: "",
            mobileNo: lco.mobileNo?.toString() || "",
            houseNo: lco.houseNo || "",
            address: lco.address || "",
            taluka: lco.taluka || "",
            district: lco.district || "",
            state: lco.state || "",
            pincode: lco.pincode || "",
            area: lco.area || "",
            subArea: lco.subArea || "",
            email: lco.email || "",
            website: lco.website || "",
            lcoCode: lco.lcoCode || "",
            status: lco.status || "active",

            supportWhatsApp: lco.supportWhatsApp || "",
            supportEmail: lco.supportEmail || "",
            contactPersonName: lco.contactPersonName || "",
            contactPersonNumber: lco.contactPersonNumber || "",

            // Documents - string/array dono handle
            existingAadhaar: lco.document?.aadhaarCard ? [lco.document.aadhaarCard].flat() : [],
            existingPan: lco.document?.panCard ? [lco.document.panCard].flat() : [],
            existingLicense: lco.document?.license ? [lco.document.license].flat() : [],
            existingOther: lco.document?.other ? [lco.document.other].flat() : [],

            // New file upload
            aadhaarCard: null,
            panCard: null,
            license: null,
            other: null,

            // Remove flags
            remove_aadhaarCard: false,
            remove_panCard: false,
            remove_license: false,
            remove_other: false,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLco();
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

  // Remove document - instantly hide, no popup
  const removeDocument = (field) => {
    setFormData(prev => ({
      ...prev,
      [`existing${field.charAt(0).toUpperCase() + field.slice(1)}`]: [],
      [`remove_${field}`]: true,
      [field]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      if (key.startsWith("existing") || key.startsWith("remove_")) return;
      const value = formData[key];
      if (value === null || value === undefined || value === "") return;
      submitData.append(key, value);
    });

    // Send remove flags
    if (formData.remove_aadhaarCard) submitData.append("remove_aadhaarCard", "true");
    if (formData.remove_panCard) submitData.append("remove_panCard", "true");
    if (formData.remove_license) submitData.append("remove_license", "true");
    if (formData.remove_other) submitData.append("remove_other", "true");

    try {
      await updateLco(id, submitData);
      // navigate("/lco/list");
       navigate(-1, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading...</div>;
  if (!formData) return <div className="p-10 text-center text-red-600 text-xl">LCO not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Update LCO</h2>

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

        {/* GENERAL TAB - All Fields Same */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block font-semibold mb-1">Title</label>
              <select name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-3">
                <option>Mr.</option><option>Ms</option><option>M/s</option><option>Mrs</option><option>Miss</option>
              </select>
            </div>
            <div><label className="block font-semibold mb-1">LCO Name *</label>
              <input type="text" name="lcoName" value={formData.lcoName} onChange={handleChange} required className="w-full border rounded p-3" />
            </div>
            <div><label className="block font-semibold mb-1">Password</label>
              <input type="password" name="plainPassword" value={formData.plainPassword} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full border rounded p-3" />
            </div>
            <div><label className="block font-semibold mb-1">Mobile No *</label>
              <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required className="w-full border rounded p-3" />
            </div>
            <div><label className="block font-semibold mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-3" />
            </div>
            <div><label className="block font-semibold mb-1">Reseller *</label>
              <select name="retailerId" value={formData.retailerId} onChange={handleChange} required className="w-full border rounded p-3">
                <option value="">Select Reseller</option>
                {retailers.map(r => (
                  <option key={r._id} value={r._id}>{r.resellerName || r.name}</option>
                ))}
              </select>
            </div>
            {/* <div><label className="block font-semibold mb-1">House No.</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">Taluka</label><input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">State *</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full border rounded p-3">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block font-semibold mb-1">Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded p-3" /></div>
            <div><label className="block font-semibold mb-1">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">Sub Area</label><input type="text" name="subArea" value={formData.subArea} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full border rounded p-3" /></div>
            {/* <div><label className="block font-semibold mb-1">LCO Code</label><input type="text" name="lcoCode" value={formData.lcoCode} onChange={handleChange} className="w-full border rounded p-3" /></div> */}
            <div><label className="block font-semibold mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-3">
                <option value="active">Active</option>
                <option value="inActive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* DOCUMENT TAB - Same UI + Remove Button */}
        {activeTab === "document" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Aadhaar Card */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Aadhaar Card</label>
              {formData.existingAadhaar.length > 0 && !formData.remove_aadhaarCard && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingAadhaar[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("aadhaarCard")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "aadhaarCard")} className="w-full p-3 border rounded" />
              <small className="text-gray-600">Upload new to replace</small>
            </div>

            {/* PAN Card */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">PAN Card</label>
              {formData.existingPan.length > 0 && !formData.remove_panCard && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingPan[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("panCard")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "panCard")} className="w-full p-3 border rounded" />
            </div>

            {/* License */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">License</label>
              {formData.existingLicense.length > 0 && !formData.remove_license && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingLicense[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("license")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "license")} className="w-full p-3 border rounded" />
            </div>

            {/* Other Document */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block font-bold text-lg mb-3">Other Document</label>
              {formData.existingOther.length > 0 && !formData.remove_other && (
                <div className="mb-4 p-3 bg-white rounded border text-sm text-gray-700 flex justify-between items-center">
                  <span>{formData.existingOther[0].split('/').pop()}</span>
                  <button type="button" onClick={() => removeDocument("other")} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "other")} className="w-full p-3 border rounded" />
            </div>

          </div>
        )}

        <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
          <button type="button" onClick={() => navigate("/lco/list")} className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back
          </button>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Updating..." : "Update LCO"}
          </button>
        </div>
      </form>
    </div>
  );
}