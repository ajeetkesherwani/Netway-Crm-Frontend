
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPackageDetails, updatePackage } from "../../service/package";
// import toast from "react-hot-toast";

// export default function PackageUpdate() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

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
//     isIptv: false,
//     iptvPlanName: "",
//     isOtt: false,
//     ottPlanName: "",
//   });

//   // Load package details
//   useEffect(() => {
//     const loadPackage = async () => {
//       try {
//         const res = await getPackageDetails(id);
//         const pkg = res.data;

//         setFormData({
//           name: pkg.name || "",
//           description: pkg.description || "",
//           typeOfPlan: pkg.typeOfPlan || "Renew",
//           categoryOfPlan: pkg.categoryOfPlan || "Unlimited",
//           validityNumber: pkg.validity?.number ? String(pkg.validity.number) : "",
//           validityUnit: pkg.validity?.unit || "Day",
//           status: pkg.status || "active",
//           sacCode: pkg.sacCode || "",
//           fromDate: pkg.fromDate ? pkg.fromDate.split("T")[0] : "",
//           toDate: pkg.toDate ? pkg.toDate.split("T")[0] : "",
//           basePrice: pkg.basePrice ? String(pkg.basePrice) : "",
//           offerPrice: pkg.offerPrice ? String(pkg.offerPrice) : "",
//           billType: pkg.billType || "Monthly",
//           isIptv: !!pkg.isIptv,
//           iptvPlanName: pkg.iptvPlanName || "",
//           isOtt: !!pkg.isOtt,
//           ottPlanName: pkg.ottPlanName || "",
//         });
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load package details");
//         toast.error("Failed to load package");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPackage();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const payload = {};

//     // Only add fields that have values (backend updates only if provided)
//     if (formData.name.trim()) payload.name = formData.name.trim();
//     if (formData.description.trim()) payload.description = formData.description.trim();
//     if (formData.typeOfPlan) payload.typeOfPlan = formData.typeOfPlan;
//     if (formData.categoryOfPlan) payload.categoryOfPlan = formData.categoryOfPlan;
//     if (formData.validityNumber.trim()) {
//       payload.validity = {
//         number: Number(formData.validityNumber),
//         unit: formData.validityUnit,
//       };
//     }
//     if (formData.status) payload.status = formData.status;
//     if (formData.sacCode.trim()) payload.sacCode = formData.sacCode.trim();
//     if (formData.fromDate) payload.fromDate = formData.fromDate;
//     if (formData.toDate) payload.toDate = formData.toDate;
//     if (formData.basePrice.trim()) payload.basePrice = Number(formData.basePrice);
//     if (formData.offerPrice.trim()) payload.offerPrice = Number(formData.offerPrice);
//     if (formData.billType) payload.billType = formData.billType;
//     if (formData.isIptv !== undefined) payload.isIptv = formData.isIptv;
//     if (formData.isIptv && formData.iptvPlanName.trim()) payload.iptvPlanName = formData.iptvPlanName.trim();
//     if (formData.isOtt !== undefined) payload.isOtt = formData.isOtt;
//     if (formData.isOtt && formData.ottPlanName.trim()) payload.ottPlanName = formData.ottPlanName.trim();

//     try {
//       await updatePackage(id, payload);
//       toast.success("Package updated successfully!");
//       navigate("/package/list");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to update package");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6 text-center text-lg">Loading package details...</p>;
//   if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

//   const InputRow = ({ label, children }) => (
//     <div className="flex flex-col md:flex-row border-b border-gray-200 last:border-b-0">
//       <label className="md:w-1/3 bg-gray-50 p-4 font-medium text-gray-700 flex items-center">
//         {label}
//       </label>
//       <div className="md:w-2/3 p-4">{children}</div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center gap-2"
//         >
//           ← Back
//         </button>
//         <h3 className="text-2xl font-bold text-gray-800">Update Package</h3>
//         <div className="w-32" />
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="border border-gray-200 rounded-lg overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2">
//             {/* Left Column */}
//             <div>
//               <InputRow label="Package Name">
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter package name"
//                 />
//               </InputRow>

//               <InputRow label="Type of Plan">
//                 <select
//                   name="typeOfPlan"
//                   value={formData.typeOfPlan}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="New">New</option>
//                   <option value="Renew">Renew</option>
//                 </select>
//               </InputRow>

//               <InputRow label="Category of Plan">
//                 <select
//                   name="categoryOfPlan"
//                   value={formData.categoryOfPlan}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Unlimited">Unlimited</option>
//                   <option value="Limited">Limited</option>
//                 </select>
//               </InputRow>

//               <InputRow label="Validity">
//                 <div className="flex gap-3">
//                   <input
//                     type="number"
//                     name="validityNumber"
//                     value={formData.validityNumber}
//                     onChange={handleChange}
//                     placeholder="e.g. 28"
//                     min="1"
//                     className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <select
//                     name="validityUnit"
//                     value={formData.validityUnit}
//                     onChange={handleChange}
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Day">Day(s)</option>
//                     <option value="Month">Month(s)</option>
//                     <option value="Year">Year(s)</option>
//                   </select>
//                 </div>
//               </InputRow>

//               <InputRow label="Status">
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </InputRow>

//               <InputRow label="SAC Code">
//                 <input
//                   type="text"
//                   name="sacCode"
//                   value={formData.sacCode}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Optional"
//                 />
//               </InputRow>

//               <InputRow label="From Date">
//                 <input
//                   type="date"
//                   name="fromDate"
//                   value={formData.fromDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </InputRow>

//               <InputRow label="To Date">
//                 <input
//                   type="date"
//                   name="toDate"
//                   value={formData.toDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </InputRow>
//             </div>

//             {/* Right Column */}
//             <div>
//               <InputRow label="Base Price">
//                 <input
//                   type="number"
//                   name="basePrice"
//                   value={formData.basePrice}
//                   onChange={handleChange}
//                   min="0"
//                   step="0.01"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g. 699"
//                 />
//               </InputRow>

//               <InputRow label="Offer Price">
//                 <input
//                   type="number"
//                   name="offerPrice"
//                   value={formData.offerPrice}
//                   onChange={handleChange}
//                   min="0"
//                   step="0.01"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g. 599"
//                 />
//               </InputRow>

//               <InputRow label="Bill Type">
//                 <select
//                   name="billType"
//                   value={formData.billType}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Monthly">Monthly</option>
//                   <option value="One Time">One Time</option>
//                   <option value="Yearly">Yearly</option>
//                 </select>
//               </InputRow>

//               <InputRow label="IPTV Included">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="isIptv"
//                     checked={formData.isIptv}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <span>Include IPTV</span>
//                 </label>
//               </InputRow>

//               {formData.isIptv && (
//                 <InputRow label="IPTV Plan Name">
//                   <input
//                     type="text"
//                     name="iptvPlanName"
//                     value={formData.iptvPlanName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g. Premium IPTV"
//                   />
//                 </InputRow>
//               )}

//               <InputRow label="OTT Included">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="isOtt"
//                     checked={formData.isOtt}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <span>Include OTT</span>
//                 </label>
//               </InputRow>

//               {formData.isOtt && (
//                 <InputRow label="OTT Plan Name">
//                   <input
//                     type="text"
//                     name="ottPlanName"
//                     value={formData.ottPlanName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g. Netflix Bundle"
//                   />
//                 </InputRow>
//               )}
//             </div>
//           </div>

//           {/* Description - Full Width at Bottom */}
//           <div className="border-t border-gray-200">
//             <InputRow label="Description">
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="5"
//                 placeholder="Enter package description (optional)..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               />
//             </InputRow>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="mt-8 flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
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
import { getPackageDetails, updatePackage } from "../../service/package";
import toast from "react-hot-toast";

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
    isIptv: false,
    iptvPlanName: "",
    isOtt: false,
    ottPlanName: "",
  });

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const res = await getPackageDetails(id);
        const pkg = res.data;

        setFormData({
          name: pkg.name || "",
          description: pkg.description || "",
          typeOfPlan: pkg.typeOfPlan || "Renew",
          categoryOfPlan: pkg.categoryOfPlan || "Unlimited",
          validityNumber: pkg.validity?.number ? String(pkg.validity.number) : "",
          validityUnit: pkg.validity?.unit || "Day",
          status: pkg.status || "active",
          sacCode: pkg.sacCode || "",
          fromDate: pkg.fromDate ? pkg.fromDate.split("T")[0] : "",
          toDate: pkg.toDate ? pkg.toDate.split("T")[0] : "",
          basePrice: pkg.basePrice ? String(pkg.basePrice) : "",
          offerPrice: pkg.offerPrice ? String(pkg.offerPrice) : "",
          billType: pkg.billType || "Monthly",
          isIptv: !!pkg.isIptv,
          iptvPlanName: pkg.iptvPlanName || "",
          isOtt: !!pkg.isOtt,
          ottPlanName: pkg.ottPlanName || "",
        });
      } catch (err) {
        toast.error("Failed to load package");
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {};

    if (formData.name.trim()) payload.name = formData.name.trim();
    if (formData.description.trim()) payload.description = formData.description.trim();
    if (formData.typeOfPlan) payload.typeOfPlan = formData.typeOfPlan;
    if (formData.categoryOfPlan) payload.categoryOfPlan = formData.categoryOfPlan;
    if (formData.validityNumber.trim()) {
      payload.validity = {
        number: Number(formData.validityNumber),
        unit: formData.validityUnit,
      };
    }
    if (formData.status) payload.status = formData.status;
    if (formData.sacCode.trim()) payload.sacCode = formData.sacCode.trim();
    if (formData.fromDate) payload.fromDate = formData.fromDate;
    if (formData.toDate) payload.toDate = formData.toDate;
    if (formData.basePrice.trim()) payload.basePrice = Number(formData.basePrice);
    if (formData.offerPrice.trim()) payload.offerPrice = Number(formData.offerPrice);
    if (formData.billType) payload.billType = formData.billType;
    payload.isIptv = formData.isIptv;
    if (formData.isIptv && formData.iptvPlanName.trim()) payload.iptvPlanName = formData.iptvPlanName.trim();
    payload.isOtt = formData.isOtt;
    if (formData.isOtt && formData.ottPlanName.trim()) payload.ottPlanName = formData.ottPlanName.trim();

    try {
      await updatePackage(id, payload);
      toast.success("Package updated successfully!");
      navigate("/package/list");
    } catch (err) {
      toast.error(err.message || "Failed to update package");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all fields?")) {
      setFormData((prev) => ({
        ...prev,
        name: "",
        description: "",
        sacCode: "",
        validityNumber: "",
        basePrice: "",
        offerPrice: "",
        iptvPlanName: "",
        ottPlanName: "",
      }));
    }
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Package</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Package Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              class301 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            placeholder="699"
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
            placeholder="599"
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

        {/* IPTV */}
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
            <input
              type="text"
              name="iptvPlanName"
              value={formData.iptvPlanName}
              onChange={handleChange}
              placeholder="IPTV Plan Name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* OTT */}
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
            <input
              type="text"
              name="ottPlanName"
              value={formData.ottPlanName}
              onChange={handleChange}
              placeholder="OTT Plan Name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Description - Full Width */}
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