// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPackageDetails, updatePackage, getIptvPackageListFromThirdParty, getOttPackageListFromThirdParty } from "../../service/package";
// import { toast } from "react-toastify";
// import Select from "react-select";

// export default function PackageUpdate() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     typeOfPlan: "Renew",
//     categoryOfPlan: "Unlimited",
//     validityNumber: "",
//     validityUnit: "Day",
//     status: "active",
//     sacCode: "",
//     fromDate: "",
//     toDate: "",
//     basePrice: "",
//     offerPrice: "",
//     billType: "Monthly",
//     packageAvailable: true,
//     offerPackage: false,
//     isIptv: false,
//     iptvType: "",
//     iptvPackageId: "",
//     isOtt: false,
//     ottType: "",
//     ottPackageId: "",
//   });

//   const [iptvPackages, setIptvPackages] = useState([]);
//   const [ottPackages, setOttPackages] = useState([]);

//   // Load package data + extract only IDs
//   useEffect(() => {
//     const loadPackage = async () => {
//       try {
//         const res = await getPackageDetails(id);
//         const pkg = res.data || {};

//         setFormData({
//           name: pkg.name || "",
//           description: pkg.description || "",
//           typeOfPlan: pkg.typeOfPlan || "Renew",
//           categoryOfPlan: pkg.categoryOfPlan || "Unlimited",
//           validityNumber: pkg.validity?.number ? String(pkg.validity.number) : "",
//           validityUnit: pkg.validity?.unit || "Day",
//           status: pkg.status || "active",
//           sacCode: pkg.sacCode || "",
//           fromDate: pkg.fromDate ? pkg.fromDate.slice(0, 16) : "",
//           toDate: pkg.toDate ? pkg.toDate.slice(0, 16) : "",
//           basePrice: pkg.basePrice != null ? String(pkg.basePrice) : "",
//           offerPrice: pkg.offerPrice != null ? String(pkg.offerPrice) : "",
//           billType: pkg.billType || "Monthly",
//           packageAvailable: pkg.packageAvailable ?? true,
//           offerPackage: pkg.offerPackage ?? false,
//           isOtt: !!pkg.isOtt,
//           ottType: pkg.ottType || "",
//           // Extract only the ID string
//           ottPackageId: pkg.ottPackageId?.packId || "",
//           isIptv: !!pkg.isIptv,
//           iptvType: pkg.iptvType || "",
//           // Extract only the ID (plan_id or plan_Id - adjust if needed)
//           iptvPackageId: pkg.iptvPackageId?.plan_id || pkg.iptvPackageId?.plan_Id || "",
//         });
//       } catch (err) {
//         toast.error("Failed to load package details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPackage();
//   }, [id]);

//   // Fetch IPTV packages when needed
//   useEffect(() => {
//     if (formData.isIptv && iptvPackages.length === 0) {
//       const fetchIptv = async () => {
//         try {
//           const packages = await getIptvPackageListFromThirdParty();
//           setIptvPackages(packages || []);
//         } catch (error) {
//           toast.error(error.message || "Failed to load IPTV packages");
//         }
//       };
//       fetchIptv();
//     }
//   }, [formData.isIptv]);

//   // Fetch OTT packages when needed
//   useEffect(() => {
//     if (formData.isOtt && ottPackages.length === 0) {
//       const fetchOtt = async () => {
//         try {
//           const packages = await getOttPackageListFromThirdParty();
//           setOttPackages(packages || []);
//         } catch (error) {
//           toast.error(error.message || "Failed to load OTT packages");
//         }
//       };
//       fetchOtt();
//     }
//   }, [formData.isOtt]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

  
//     const handleClear = () => {
//   setFormData({
//     name: "",
//     description: "",
//     typeOfPlan: "Renew",
//     categoryOfPlan: "Unlimited",
//     validityNumber: "",
//     validityUnit: "Day",
//     status: "active",
//     sacCode: "",
//     fromDate: "",
//     toDate: "",
//     basePrice: "",
//     offerPrice: "",
//     billType: "Monthly",
//     packageAvailable: true,
//     offerPackage: false,
//     isIptv: false,
//     iptvType: "",
//     iptvPackageId: "",
//     isOtt: false,
//     ottType: "",
//     ottPackageId: "",
//   });
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     // Validation (same as create)
//     if (!formData.name.trim() || !formData.validityNumber || !formData.categoryOfPlan.trim()) {
//       toast.error("Please fill all required fields: Name, Validity Number, and Category!");
//       setSaving(false);
//       return;
//     }

//     if (formData.isOtt) {
//       if (!formData.ottType?.trim()) {
//         toast.error("Please select OTT Type");
//         setSaving(false);
//         return;
//       }
//       if (!formData.ottPackageId?.trim()) {
//         toast.error("Please select an OTT Package");
//         setSaving(false);
//         return;
//       }
//     }

//     if (formData.isIptv) {
//       if (!formData.iptvType?.trim()) {
//         toast.error("Please select IPTV Type");
//         setSaving(false);
//         return;
//       }
//       if (!formData.iptvPackageId?.trim()) {
//         toast.error("Please select an IPTV Package");
//         setSaving(false);
//         return;
//       }
//     }

//     try {
//       const payload = {
//         name: formData.name.trim(),
//         description: formData.description?.trim() || undefined,
//         typeOfPlan: formData.typeOfPlan,
//         categoryOfPlan: formData.categoryOfPlan,
//         validity: formData.validityNumber
//           ? { number: Number(formData.validityNumber), unit: formData.validityUnit }
//           : undefined,
//         status: formData.status,
//         sacCode: formData.sacCode?.trim() || undefined,
//         fromDate: formData.fromDate || undefined,
//         toDate: formData.toDate || undefined,
//         basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
//         offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
//         billType: formData.billType,
//         packageAvailable: formData.packageAvailable,
//         offerPackage: formData.offerPackage,
//       };

//       if (formData.isOtt) {
//         payload.isOtt = true;
//         payload.ottType = formData.ottType.trim();
//         payload.ottPackageId = formData.ottPackageId.trim(); // sending ID only
//       } else {
//         payload.isOtt = false;
//       }

//       if (formData.isIptv) {
//         payload.isIptv = true;
//         payload.iptvType = formData.iptvType.trim();
//         payload.iptvPackageId = formData.iptvPackageId.trim(); // sending ID only
//       } else {
//         payload.isIptv = false;
//       }

//       await updatePackage(id, payload);
//       toast.success("Package updated successfully!");
//       navigate("/package/list");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update package");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const selectedOttOption = ottPackages
//     .map((pkg) => ({
//       value: String(pkg.packId), // make sure it's string
//       label: pkg.name || "Unnamed Package",
//     }))
//     .find((opt) => opt.value === formData.ottPackageId) || null;

//   const selectedIptvOption = iptvPackages
//     .map((pkg) => ({
//       value: String(pkg.plan_Id || pkg.plan_id), // handle both cases
//       label: pkg.plan_name || "Unnamed Plan",
//     }))
//     .find((opt) => opt.value === formData.iptvPackageId) || null;

//   if (loading) return <div className="p-6 text-center text-lg">Loading package data...</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Package</h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Package Name */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Package Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter package name"
//           />
//         </div>

//         {/* Type of Plan */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Type of Plan</label>
//           <select
//             name="typeOfPlan"
//             value={formData.typeOfPlan}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="New">New</option>
//             <option value="Renew">Renew</option>
//             <option value="Speed Booster Plan">Speed Booster Plan</option>
//           </select>
//         </div>

//         {/* Category of Plan */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Category of Plan</label>
//           <select
//             name="categoryOfPlan"
//             value={formData.categoryOfPlan}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="Unlimited">Unlimited</option>
//             <option value="Limited">Limited</option>
//             <option value="Fup">FUP</option>
//           </select>
//         </div>

//         {/* Validity */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Validity</label>
//           <div className="flex gap-3">
//             <input
//               type="number"
//               name="validityNumber"
//               value={formData.validityNumber}
//               onChange={handleChange}
//               placeholder="28"
//               min="1"
//               className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <select
//               name="validityUnit"
//               value={formData.validityUnit}
//               onChange={handleChange}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Day">Day(s)</option>
//               <option value="Month">Month(s)</option>
//               <option value="Year">Year(s)</option>
//             </select>
//           </div>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {/* SAC Code */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">SAC Code</label>
//           <input
//             type="text"
//             name="sacCode"
//             value={formData.sacCode}
//             onChange={handleChange}
//             placeholder="Optional"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* From Date */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">From Date</label>
//           <input
//             type="date"
//             name="fromDate"
//             value={formData.fromDate}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* To Date */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">To Date</label>
//           <input
//             type="date"
//             name="toDate"
//             value={formData.toDate}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Base Price */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Base Price</label>
//           <input
//             type="number"
//             name="basePrice"
//             value={formData.basePrice}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Offer Price */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Offer Price</label>
//           <input
//             type="number"
//             name="offerPrice"
//             value={formData.offerPrice}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Bill Type */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Bill Type</label>
//           <select
//             name="billType"
//             value={formData.billType}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="Monthly">Monthly</option>
//             <option value="One Time">One Time</option>
//             <option value="Yearly">Yearly</option>
//           </select>
//         </div>

//         {/* Package Available */}
//         <div>
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="packageAvailable"
//               checked={formData.packageAvailable}
//               onChange={handleChange}
//               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <span className="font-medium text-gray-700">Package Available</span>
//           </label>
//         </div>

//         {/* Offer Package */}
//         <div>
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="offerPackage"
//               checked={formData.offerPackage}
//               onChange={handleChange}
//               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <span className="font-medium text-gray-700">Offer Package</span>
//           </label>
//         </div>

//         {/* IPTV Section */}
//         <div>
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isIptv"
//               checked={formData.isIptv}
//               onChange={handleChange}
//               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <span className="font-medium text-gray-700">Include IPTV</span>
//           </label>
//           {formData.isIptv && (
//             <>
//               <input
//                 type="text"
//                 name="iptvType"
//                 value={formData.iptvType}
//                 onChange={handleChange}
//                 placeholder="IPTV Type (e.g., ziggTv)"
//                 className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="mt-3">
//                 <label className="block font-medium text-gray-700 mb-1">IPTV Package</label>
//                 <Select
//                   value={selectedIptvOption}
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       iptvPackageId: selected ? String(selected.value) : "",
//                     }))
//                   }
//                   options={iptvPackages.map((pkg) => ({
//                     value: String(pkg.plan_Id || pkg.plan_id),
//                     label: pkg.plan_name || "Unnamed Plan",
//                   }))}
//                   placeholder="-- Search or select IPTV package --"
//                   isSearchable
//                   isClearable
//                   className="basic-single"
//                   classNamePrefix="select"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderColor: "#d1d5db",
//                       borderRadius: "0.375rem",
//                       padding: "0.25rem",
//                       minHeight: "38px",
//                     }),
//                     menu: (base) => ({ ...base, zIndex: 9999 }),
//                   }}
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         {/* OTT Section */}
//         <div>
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isOtt"
//               checked={formData.isOtt}
//               onChange={handleChange}
//               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <span className="font-medium text-gray-700">Include OTT</span>
//           </label>
//           {formData.isOtt && (
//             <>
//               <input
//                 type="text"
//                 name="ottType"
//                 value={formData.ottType}
//                 onChange={handleChange}
//                 placeholder="OTT Type (e.g., playBox)"
//                 className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="mt-3">
//                 <label className="block font-medium text-gray-700 mb-1">OTT Package</label>
//                 <Select
//                   value={selectedOttOption}
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       ottPackageId: selected ? String(selected.value) : "",
//                     }))
//                   }
//                   options={ottPackages.map((pkg) => ({
//                     value: String(pkg.packId),
//                     label: pkg.name || "Unnamed Package",
//                   }))}
//                   placeholder="-- Search or select OTT package --"
//                   isSearchable
//                   isClearable
//                   className="basic-single"
//                   classNamePrefix="select"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderColor: "#d1d5db",
//                       borderRadius: "0.375rem",
//                       padding: "0.25rem",
//                       minHeight: "38px",
//                     }),
//                     menu: (base) => ({ ...base, zIndex: 9999 }),
//                   }}
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Description */}
//         <div className="md:col-span-2">
//           <label className="block font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="5"
//             placeholder="Enter package description..."
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="md:col-span-2 flex justify-end gap-4 mt-6">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//           >
//             Clear Form
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
//           >
//             {saving ? "Updating..." : "Update Package"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageDetails, updatePackage, getIptvPackageListFromThirdParty, getOttPackageListFromThirdParty } from "../../service/package";
import { toast } from "react-toastify";
import Select from "react-select";

export default function PackageUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    typeOfPlan: "Renew",
    categoryOfPlan: "Unlimited",
    validityNumber: "",
    validityUnit: "Day",
    status: "active",
    sacCode: "",
    fromDate: "",
    toDate: "",
    basePrice: "",
    offerPrice: "",
    billType: "Monthly",
    packageAvailable: true,
    offerPackage: false,
    isIptv: false,
    iptvType: "",
    iptvPackageId: "",
    isOtt: false,
    ottType: "",
    ottPackageId: "",
  });

  const [iptvPackages, setIptvPackages] = useState([]);
  const [ottPackages, setOttPackages] = useState([]);

  // Load package data
  useEffect(() => {
    const loadPackage = async () => {
      try {
        const res = await getPackageDetails(id);
        const pkg = res.data || {};

        setFormData({
          name: pkg.name || "",
          description: pkg.description || "",
          typeOfPlan: pkg.typeOfPlan || "Renew",
          categoryOfPlan: pkg.categoryOfPlan || "Unlimited",
          validityNumber: pkg.validity?.number ? String(pkg.validity.number) : "",
          validityUnit: pkg.validity?.unit || "Day",
          status: pkg.status || "active",
          sacCode: pkg.sacCode || "",
          fromDate: pkg.fromDate ? new Date(pkg.fromDate).toISOString().slice(0, 16) : "",
          toDate: pkg.toDate ? new Date(pkg.toDate).toISOString().slice(0, 16) : "",
          basePrice: pkg.basePrice != null ? String(pkg.basePrice) : "",
          offerPrice: pkg.offerPrice != null ? String(pkg.offerPrice) : "",
          billType: pkg.billType || "Monthly",
          packageAvailable: pkg.packageAvailable ?? true,
          offerPackage: pkg.offerPackage ?? false,
          isOtt: !!pkg.isOtt,
          ottType: pkg.ottType || "",
          ottPackageId: pkg.ottPackageId?.packId || "",
          isIptv: !!pkg.isIptv,
          iptvType: pkg.iptvType || "",
          iptvPackageId: pkg.iptvPackageId?.plan_name || pkg.iptvPackageId?.plan_id || "",
        });
      } catch (err) {
        toast.error("Failed to load package details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, [id]);

  // Fetch IPTV packages only when checkbox is checked
  useEffect(() => {
    if (formData.isIptv && iptvPackages.length === 0) {
      const fetchIptv = async () => {
        try {
          const packages = await getIptvPackageListFromThirdParty();
          setIptvPackages(packages || []);
        } catch (error) {
          toast.error(error.message || "Failed to load IPTV packages");
        }
      };
      fetchIptv();
    }
  }, [formData.isIptv, iptvPackages.length]);

  // Fetch OTT packages only when checkbox is checked
  useEffect(() => {
    if (formData.isOtt && ottPackages.length === 0) {
      const fetchOtt = async () => {
        try {
          const packages = await getOttPackageListFromThirdParty();
          setOttPackages(packages || []);
        } catch (error) {
          toast.error(error.message || "Failed to load OTT packages");
        }
      };
      fetchOtt();
    }
  }, [formData.isOtt, ottPackages.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      typeOfPlan: "Renew",
      categoryOfPlan: "Unlimited",
      validityNumber: "",
      validityUnit: "Day",
      status: "active",
      sacCode: "",
      fromDate: "",
      toDate: "",
      basePrice: "",
      offerPrice: "",
      billType: "Monthly",
      packageAvailable: true,
      offerPackage: false,
      isIptv: false,
      iptvType: "",
      iptvPackageId: "",
      isOtt: false,
      ottType: "",
      ottPackageId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validation
    if (!formData.name.trim() || !formData.validityNumber || !formData.categoryOfPlan.trim()) {
      toast.error("Please fill all required fields: Name, Validity Number, and Category!");
      setSaving(false);
      return;
    }

    if (formData.isOtt) {
      if (!formData.ottType.trim()) {
        toast.error("Please select OTT Type");
        setSaving(false);
        return;
      }
      if (!formData.ottPackageId.trim()) {
        toast.error("Please select an OTT Package");
        setSaving(false);
        return;
      }
    }

    if (formData.isIptv) {
      if (!formData.iptvType.trim()) {
        toast.error("Please select IPTV Type");
        setSaving(false);
        return;
      }
      if (!formData.iptvPackageId.trim()) {
        toast.error("Please select an IPTV Package");
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        typeOfPlan: formData.typeOfPlan,
        categoryOfPlan: formData.categoryOfPlan,
        validity: formData.validityNumber
          ? { number: Number(formData.validityNumber), unit: formData.validityUnit }
          : undefined,
        status: formData.status,
        sacCode: formData.sacCode?.trim() || undefined,
        fromDate: formData.fromDate || undefined,
        toDate: formData.toDate || undefined,
        basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
        billType: formData.billType,
        packageAvailable: formData.packageAvailable,
        offerPackage: formData.offerPackage,
      };

      if (formData.isOtt) {
        payload.isOtt = true;
        payload.ottType = formData.ottType.trim();
        payload.ottPackageId = formData.ottPackageId.trim(); // sending ID string
      } else {
        payload.isOtt = false;
      }

      if (formData.isIptv) {
        payload.isIptv = true;
        payload.iptvType = formData.iptvType.trim();
        payload.iptvPackageId = formData.iptvPackageId.trim(); // sending ID string
      } else {
        payload.isIptv = false;
      }

      await updatePackage(id, payload);
      toast.success("Package updated successfully!");
      navigate("/package/list");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update package");
      console.error("Update error:", err?.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  // Improved selected value for react-select (shows pre-filled value even if list not loaded)
  const selectedOttOption = formData.ottPackageId
    ? {
        value: formData.ottPackageId,
        label:
          ottPackages.find((p) => String(p.packId) === formData.ottPackageId)?.name ||
          `(${formData.ottPackageId})`,
      }
    : null;

  const selectedIptvOption = formData.iptvPackageId
    ? {
        value: formData.iptvPackageId,
        label:
          iptvPackages.find((p) => String(p.plan_id || p.plan_Id) === formData.iptvPackageId)?.plan_name ||
          `(${formData.iptvPackageId})`,
      }
    : null;

  if (loading) return <div className="p-6 text-center text-lg">Loading package data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Package</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Package Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter package name"
          />
        </div>

        {/* Type of Plan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Type of Plan</label>
          <select
            name="typeOfPlan"
            value={formData.typeOfPlan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Renew">Renew</option>
            <option value="Speed Booster Plan">Speed Booster Plan</option>
          </select>
        </div>

        {/* Category of Plan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Category of Plan</label>
          <select
            name="categoryOfPlan"
            value={formData.categoryOfPlan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Unlimited">Unlimited</option>
            <option value="Limited">Limited</option>
            <option value="Fup">FUP</option>
          </select>
        </div>

        {/* Validity */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Validity</label>
          <div className="flex gap-3">
            <input
              type="number"
              name="validityNumber"
              value={formData.validityNumber}
              onChange={handleChange}
              placeholder="28"
              min="1"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="validityUnit"
              value={formData.validityUnit}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Day">Day(s)</option>
              <option value="Month">Month(s)</option>
              <option value="Year">Year(s)</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* SAC Code */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">SAC Code</label>
          <input
            type="text"
            name="sacCode"
            value={formData.sacCode}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Offer Price */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Offer Price</label>
          <input
            type="number"
            name="offerPrice"
            value={formData.offerPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bill Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Bill Type</label>
          <select
            name="billType"
            value={formData.billType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Monthly">Monthly</option>
            <option value="One Time">One Time</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Package Available */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="packageAvailable"
              checked={formData.packageAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Package Available</span>
          </label>
        </div>

        {/* Offer Package */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="offerPackage"
              checked={formData.offerPackage}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Offer Package</span>
          </label>
        </div>

        {/* IPTV Section */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isIptv"
              checked={formData.isIptv}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Include IPTV</span>
          </label>
          {formData.isIptv && (
            <>
              <input
                type="text"
                name="iptvType"
                value={formData.iptvType}
                onChange={handleChange}
                placeholder="IPTV Type (e.g., ziggTv)"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-3">
                <label className="block font-medium text-gray-700 mb-1">IPTV Package</label>
                <Select
                  value={selectedIptvOption}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      iptvPackageId: selected ? String(selected.value) : "",
                    }))
                  }
                  options={iptvPackages.map((pkg) => ({
                    value: String(pkg.plan_Id || pkg.plan_id),
                    label: pkg.plan_name || "Unnamed Plan",
                  }))}
                  placeholder="-- Search or select IPTV package --"
                  isSearchable
                  isClearable
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#d1d5db",
                      borderRadius: "0.375rem",
                      padding: "0.25rem",
                      minHeight: "38px",
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* OTT Section */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isOtt"
              checked={formData.isOtt}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Include OTT</span>
          </label>
          {formData.isOtt && (
            <>
              <input
                type="text"
                name="ottType"
                value={formData.ottType}
                onChange={handleChange}
                placeholder="OTT Type (e.g., playBox)"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-3">
                <label className="block font-medium text-gray-700 mb-1">OTT Package</label>
                <Select
                  value={selectedOttOption}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      ottPackageId: selected ? String(selected.value) : "",
                    }))
                  }
                  options={ottPackages.map((pkg) => ({
                    value: String(pkg.packId),
                    label: pkg.name || "Unnamed Package",
                  }))}
                  placeholder="-- Search or select OTT package --"
                  isSearchable
                  isClearable
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#d1d5db",
                      borderRadius: "0.375rem",
                      padding: "0.25rem",
                      minHeight: "38px",
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Enter package description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {saving ? "Updating..." : "Update Package"}
          </button>
        </div>
      </form>
    </div>
  );
}