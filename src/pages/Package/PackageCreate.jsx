// import { useState } from "react";
// import { createPackage } from "../../service/package";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function PackageCreate() {
//   const [formData, setFormData] = useState({
//     name: "",
//     validityNumber: "",
//     validityUnit: "Month",
//     sacCode: "",
//     fromDate: "",
//     toDate: "",
//     status: "active",
//     typeOfPlan: "Renew",
//     categoryOfPlan: "Unlimited",
//     description: "",
//     isIptv: false,
//     iptvPlanName: "",
//     isOtt: false,
//     ottPlanName: "",
//     basePrice: "",
//     offerPrice: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan || !formData.status) {
//       toast.error("Please fill all required fields!");
//       return;
//     }
//     try {
//       const payload = {
//         name: formData.name,
//         validity: {
//           number: Number(formData.validityNumber),
//           unit: formData.validityUnit,
//         },
//         sacCode: formData.sacCode,
//         fromDate: formData.fromDate || undefined,
//         toDate: formData.toDate || undefined,
//         status: formData.status,
//         typeOfPlan: formData.typeOfPlan,
//         categoryOfPlan: formData.categoryOfPlan,
//         description: formData.description,
//         basePrice: formData.basePrice,
//         offerPrice: formData.offerPrice,
//         // Only include if checked
//         ...(formData.isIptv && {
//           isIptv: true,
//           iptvPlanName: formData.iptvPlanName,
//         }),
//         ...(formData.isOtt && {
//           isOtt: true,
//           ottPlanName: formData.ottPlanName,
//         }),
//       };

//       await createPackage(payload);
//       toast.success("Package created successfully!");
//       navigate("/package/list");  
//       resetForm();
//     } catch (error) {
//       toast.error(error.message || "Failed to create package");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       validityNumber: "",
//       validityUnit: "Month",
//       sacCode: "",
//       fromDate: "",
//       toDate: "",
//       status: "active",
//       typeOfPlan: "Renew",
//       categoryOfPlan: "",
//       description: "",
//       isIptv: false,
//       iptvPlanName: "",
//       isOtt: false,
//       ottPlanName: "",
//       basePrice: "",
//       offerPrice:""
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6  mx-auto bg-white shadow rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Name */}
//         <div>
//           <label className="block font-medium mb-1">Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block font-medium mb-1">Status *</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="active">Active</option>
//             <option value="inActive">Inactive</option>
//           </select>
//         </div>

//         {/* Validity */}
//         <div>
//           <label className="block font-medium mb-1">Validity *</label>
//           <div className="flex gap-2">
//             <input
//               type="number"
//               name="validityNumber"
//               value={formData.validityNumber}
//               onChange={handleChange}
//               className="border p-2 w-full rounded"
//               placeholder="e.g. 30"
//               required
//             />
//             <select
//               name="validityUnit"
//               value={formData.validityUnit}
//               onChange={handleChange}
//               className="border p-2 rounded w-32"
//             >
//               <option value="Day">Day</option>
//               <option value="Week">Week</option>
//               <option value="Month">Month</option>
//               <option value="Year">Year</option>
//             </select>
//           </div>
//         </div>

//         {/* Type of Plan */}
//         <div>
//           <label className="block font-medium mb-1">Type of Plan</label>
//           <select
//             name="typeOfPlan"
//             value={formData.typeOfPlan}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="Renew">Renew</option>
//             <option value="Speed Booster Plan">Speed Booster Plan</option>
//             <option value="Valume Booster">Volume Booster</option>
//           </select>
//         </div>

//         {/* Category of Plan */}
//         <div>
//           <label className="block font-medium mb-1">Category of Plans *</label>
//           <select
//             name="categoryOfPlan"
//             value={formData.categoryOfPlan}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select Plan Category</option>
//             <option value="Unlimited">Unlimited</option>
//             <option value="Limited">Limited</option>
//             <option value="Fup">FUP</option>
//             <option value="DayNight">Day/Night</option>
//           </select>
//         </div>

//         {/* SAC Code */}
//         <div>
//           <label className="block font-medium mb-1">SAC Code</label>
//           <input
//             type="text"
//             name="sacCode"
//             value={formData.sacCode}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             placeholder="e.g. 998431"
//           />
//         </div>
//         {/* From Date */}
//         <div>
//           <label className="block font-medium mb-1">From Date</label>
//           <input
//             type="datetime-local"
//             name="fromDate"
//             value={formData.fromDate}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>
//         {/* To Date */}
//         <div>
//           <label className="block font-medium mb-1">To Date</label>
//           <input
//             type="datetime-local"
//             name="toDate"
//             value={formData.toDate}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* basePrice */}
//         <div>
//           <label className="block font-medium mb-1">BasePrice</label>
//           <input
//             type="number"
//             name="basePrice"
//             value={formData.basePrice}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* offerPrice */}
//         <div>
//           <label className="block font-medium mb-1">OfferPrice</label>
//           <input
//             type="number"
//             name="offerPrice"
//             value={formData.offerPrice}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* IPTV Checkbox + Conditional Input */}
//         <div className="md:col-span-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isIptv"
//               checked={formData.isIptv}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600"
//             />
//             <span className="font-medium"> IPTV</span>
//           </label>

//           {formData.isIptv && (
//             <div className="mt-3 ml-6">
//               <label className="block font-medium mb-1">IPTV Plan Name</label>
//               <input
//                 type="text"
//                 name="iptvPlanName"
//                 value={formData.iptvPlanName}
//                 onChange={handleChange}
//                 className="border p-2 w-full md:w-1/2 rounded"
//                 placeholder="e.g. Premium IPTV"
//               />
//             </div>
//           )}
//         </div>

//         {/* OTT Checkbox + Conditional Input */}
//         <div className="md:col-span-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isOtt"
//               checked={formData.isOtt}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600"
//             />
//             <span className="font-medium"> OTT</span>
//           </label>

//           {formData.isOtt && (
//             <div className="mt-3 ml-6">
//               <label className="block font-medium mb-1">OTT Plan Name</label>
//               <input
//                 type="text"
//                 name="ottPlanName"
//                 value={formData.ottPlanName}
//                 onChange={handleChange}
//                 className="border p-2 w-full md:w-1/2 rounded"
//                 placeholder="e.g. Netflix Bundle"
//               />
//             </div>
//           )}
//         </div>

//         {/* Description */}
//         <div className="md:col-span-2">
//           <label className="block font-medium mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             rows={3}
//             placeholder="Enter package description..."
//           />
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-3 mt-8">
//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
//         >
//           Submit
//         </button>
//         <button
//           type="button"
//           onClick={resetForm}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition"
//         >
//           Clear
//         </button>
//         <button
//           type="button"
//           onClick={() => navigate("/package/list")}
//           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
//         >
//           Back
//         </button>
//       </div>
//     </form>
//   );
// }

// import { useState, useEffect } from "react";
// import { createPackage } from "../../service/package";
// import { getPurchasedPlans } from "../../service/purchasedPlan";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function PackageCreate() {
//   const [formData, setFormData] = useState({
//     name: "",
//     validityNumber: "",
//     validityUnit: "Month",
//     sacCode: "",
//     fromDate: "",
//     toDate: "",
//     status: "active",
//     typeOfPlan: "Renew",
//     categoryOfPlan: "Unlimited",
//     description: "",
//     basePrice: "",
//     offerPrice: "",
//     packageAvailable: false,
//     offerPackage: false,
//     isOtt: false,
//     ottType: "",
//     ottPackageId: "",
//     isIptv: false,
//     iptvType: "",
//     iptvPackageId: "",
//   });

//   const [ottPackages, setOttPackages] = useState([]);
//   const [iptvPackages, setIptvPackages] = useState([]);
//   const [loadingOtt, setLoadingOtt] = useState(false);
//   const [loadingIptv, setLoadingIptv] = useState(false);

//   const navigate = useNavigate();

//   // Fetch OTT packages
//   useEffect(() => {
//     if (formData.isOtt && formData.ottType) {
//       fetchPackages("ott", setLoadingOtt, setOttPackages);
//       setFormData(prev => ({ ...prev, ottPackageId: "" }));
//     } else if (!formData.isOtt) {
//       setOttPackages([]);
//       setFormData(prev => ({ ...prev, ottType: "", ottPackageId: "" }));
//     }
//   }, [formData.isOtt, formData.ottType]);

//   // Fetch IPTV packages
//   useEffect(() => {
//     if (formData.isIptv && formData.iptvType) {
//       fetchPackages("iptv", setLoadingIptv, setIptvPackages);
//       setFormData(prev => ({ ...prev, iptvPackageId: "" }));
//     } else if (!formData.isIptv) {
//       setIptvPackages([]);
//       setFormData(prev => ({ ...prev, iptvType: "", iptvPackageId: "" }));
//     }
//   }, [formData.isIptv, formData.iptvType]);

//   const fetchPackages = async (type, setLoading, setPackages) => {
//     setLoading(true);
//     try {
//       const res = await getPurchasedPlans(type);
//       const packages = (res.data || []).map(item => item.package).filter(Boolean);
//       setPackages(packages);
//     } catch (err) {
//       toast.error(`Failed to load ${type.toUpperCase()} packages`);
//       setPackages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic required fields
//     if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
//       toast.error("Please fill all required fields (Name, Validity, Category)!");
//       return;
//     }

//     // Frontend validation for bundles
//     if (formData.isOtt) {
//       if (!formData.ottType) {
//         toast.error("Please select OTT Type");
//         return;
//       }
//       if (!formData.ottPackageId) {
//         toast.error("Please select an OTT Package");
//         return;
//       }
//     }

//     if (formData.isIptv) {
//       if (!formData.iptvType) {
//         toast.error("Please select IPTV Type");
//         return;
//       }
//       if (!formData.iptvPackageId) {
//         toast.error("Please select an IPTV Package");
//         return;
//       }
//     }

//     try {
//       const payload = {
//         name: formData.name,
//         validity: {
//           number: Number(formData.validityNumber),
//           unit: formData.validityUnit,
//         },
//         sacCode: formData.sacCode || undefined,
//         fromDate: formData.fromDate || undefined,
//         toDate: formData.toDate || undefined,
//         status: formData.status,
//         typeOfPlan: formData.typeOfPlan,
//         categoryOfPlan: formData.categoryOfPlan,
//         description: formData.description || undefined,
//         basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
//         offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
//         packageAvailable: formData.packageAvailable,
//         offerPackage: formData.offerPackage,
//       };

//       // Conditionally add bundle fields
//       if (formData.isOtt) {
//         payload.isOtt = true;
//         payload.ottType = formData.ottType;
//         payload.ottPackageId = formData.ottPackageId;
//       }

//       if (formData.isIptv) {
//         payload.isIptv = true;
//         payload.iptvType = formData.iptvType;
//         payload.iptvPackageId = formData.iptvPackageId;
//       }

//       await createPackage(payload);
//       toast.success("Package created successfully!");
//       navigate("/package/list");
//     } catch (error) {
//       // Show backend error message if available
//       const msg = error?.response?.data?.message || error.message || "Failed to create package";
//       toast.error(msg);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       validityNumber: "",
//       validityUnit: "Month",
//       sacCode: "",
//       fromDate: "",
//       toDate: "",
//       status: "active",
//       typeOfPlan: "Renew",
//       categoryOfPlan: "Unlimited",
//       description: "",
//       basePrice: "",
//       offerPrice: "",
//       packageAvailable: false,
//       offerPackage: false,
//       isOtt: false,
//       ottType: "",
//       ottPackageId: "",
//       isIptv: false,
//       iptvType: "",
//       iptvPackageId: "",
//     });
//     setOttPackages([]);
//     setIptvPackages([]);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-5xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

//       {/* Main Fields Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* All your existing fields (unchanged) */}
//         <div>
//           <label className="block font-medium mb-1">Name *</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Status *</label>
//           <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded">
//             <option value="active">Active</option>
//             <option value="inActive">Inactive</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Validity *</label>
//           <div className="flex gap-2">
//             <input type="number" name="validityNumber" value={formData.validityNumber} onChange={handleChange} className="border p-2 w-full rounded" required />
//             <select name="validityUnit" value={formData.validityUnit} onChange={handleChange} className="border p-2 rounded w-32">
//               <option value="Day">Day</option>
//               <option value="Week">Week</option>
//               <option value="Month">Month</option>
//               <option value="Year">Year</option>
//             </select>
//           </div>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Type of Plan</label>
//           <select name="typeOfPlan" value={formData.typeOfPlan} onChange={handleChange} className="border p-2 w-full rounded">
//             <option value="Renew">Renew</option>
//             <option value="Speed Booster Plan">Speed Booster Plan</option>
//             <option value="Valume Booster">Volume Booster</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Category of Plans *</label>
//           <select name="categoryOfPlan" value={formData.categoryOfPlan} onChange={handleChange} className="border p-2 w-full rounded" required>
//             <option value="">Select Plan Category</option>
//             <option value="Unlimited">Unlimited</option>
//             <option value="Limited">Limited</option>
//             <option value="Fup">FUP</option>
//             <option value="DayNight">Day/Night</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">SAC Code</label>
//           <input type="text" name="sacCode" value={formData.sacCode} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">From Date</label>
//           <input type="datetime-local" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">To Date</label>
//           <input type="datetime-local" name="toDate" value={formData.toDate} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">BasePrice</label>
//           <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">OfferPrice</label>
//           <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//       </div>

//       {/* Package Available & Offer Package */}
//       <div className="space-y-6 mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <label className="block font-medium text-gray-600">Package available *</label>
//             <p className="text-xs text-gray-500 mt-1">(This package not available for new account)</p>
//           </div>
//           <div className="flex gap-10">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="packageAvailable" checked={formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: true }))} className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-700">Yes</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="packageAvailable" checked={!formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: false }))} className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-700">No</span>
//             </label>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <label className="block font-medium text-gray-600">Offer Package *</label>
//             <p className="text-xs text-gray-500 mt-1">(This package will applicable only once)</p>
//           </div>
//           <div className="flex gap-10">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="offerPackage" checked={formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: true }))} className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-700">Yes</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="offerPackage" checked={!formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: false }))} className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-700">No</span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Bundle with OTT */}
//       <div className="mb-8">
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input type="checkbox" name="isOtt" checked={formData.isOtt} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
//           <span className="font-medium text-lg">Bundle with OTT</span>
//         </label>

//         {formData.isOtt && (
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
//             <div>
//               <label className="block font-medium mb-1">Select Ott Type</label>
//               <select name="ottType" value={formData.ottType} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select Ott Type</option>
//                 <option value="playBox">Play Box</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Select Package</label>
//               <select
//                 name="ottPackageId"
//                 value={formData.ottPackageId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//                 disabled={loadingOtt || !formData.ottType}
//               >
//                 <option value="">{loadingOtt ? "Loading..." : "Select Package"}</option>
//                 {ottPackages.map((pkg) => (
//                   <option key={pkg._id} value={pkg._id}>
//                     {pkg.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bundle with IPTV */}
//       <div className="mb-8">
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input type="checkbox" name="isIptv" checked={formData.isIptv} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
//           <span className="font-medium text-lg">Bundle with IPTV</span>
//         </label>

//         {formData.isIptv && (
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
//             <div>
//               <label className="block font-medium mb-1">Select IPTV Type</label>
//               <select name="iptvType" value={formData.iptvType} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select IPTV Type</option>
//                 <option value="ziggTv">Zigg TV</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Select Package</label>
//               <select
//                 name="iptvPackageId"
//                 value={formData.iptvPackageId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//                 disabled={loadingIptv || !formData.iptvType}
//               >
//                 <option value="">{loadingIptv ? "Loading..." : "Select Package"}</option>
//                 {iptvPackages.map((pkg) => (
//                   <option key={pkg._id} value={pkg._id}>
//                     {pkg.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Description */}
//       <div className="mb-8">
//         <label className="block font-medium mb-1">Description</label>
//         <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" rows={4} />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4">
//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded">
//           Submit
//         </button>
//         <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded">
//           Clear
//         </button>
//         <button type="button" onClick={() => navigate("/package/list")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded">
//           Back
//         </button>
//       </div>
//     </form>
//   );
// }

// import { useState, useEffect } from "react";
// import { createPackage } from "../../service/package";
// import { getPurchasedPlans } from "../../service/purchasedPlan";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function PackageCreate() {
//   const [formData, setFormData] = useState({
//     name: "",
//     validityNumber: "",
//     validityUnit: "Month",
//     sacCode: "",
//     fromDate: "",
//     toDate: "",
//     status: "active",
//     typeOfPlan: "Renew",
//     categoryOfPlan: "Unlimited",
//     description: "",
//     basePrice: "",
//     offerPrice: "",
//     packageAvailable: false,
//     offerPackage: false,
//     isOtt: false,
//     ottType: "",
//     ottPackageId: "",
//     isIptv: false,
//     iptvType: "",
//     iptvPackageId: "",
//   });

//   const [ottPackages, setOttPackages] = useState([]);
//   const [iptvPackages, setIptvPackages] = useState([]);
//   const [loadingOtt, setLoadingOtt] = useState(false);
//   const [loadingIptv, setLoadingIptv] = useState(false);

//   const navigate = useNavigate();

//   // Fetch packages safely
//   const fetchPackages = async (type, setLoading, setPackages) => {
//     setLoading(true);
//     try {
//       const res = await getPurchasedPlans(type);
//       const rawPlans = res.data || [];

//       // Extract only valid packages with _id and name
//       const validPackages = rawPlans
//         .map(item => item.package)
//         .filter(pkg => pkg && pkg._id && pkg.name && typeof pkg._id === "string");

//       console.log(`${type.toUpperCase()} Valid Packages:`, validPackages); // Debug log

//       setPackages(validPackages);
//     } catch (err) {
//       toast.error(`Failed to load ${type.toUpperCase()} packages`);
//       setPackages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTT fetch
//   useEffect(() => {
//     if (formData.isOtt && formData.ottType) {
//       fetchPackages("ott", setLoadingOtt, setOttPackages);
//       setFormData(prev => ({ ...prev, ottPackageId: "" }));
//     } else if (!formData.isOtt) {
//       setOttPackages([]);
//       setFormData(prev => ({ ...prev, ottType: "", ottPackageId: "" }));
//     }
//   }, [formData.isOtt, formData.ottType]);

//   // IPTV fetch
//   useEffect(() => {
//     if (formData.isIptv && formData.iptvType) {
//       fetchPackages("iptv", setLoadingIptv, setIptvPackages);
//       setFormData(prev => ({ ...prev, iptvPackageId: "" }));
//     } else if (!formData.isIptv) {
//       setIptvPackages([]);
//       setFormData(prev => ({ ...prev, iptvType: "", iptvPackageId: "" }));
//     }
//   }, [formData.isIptv, formData.iptvType]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
//       toast.error("Please fill all required fields (Name, Validity, Category)!");
//       return;
//     }

//     // Validate OTT
//     if (formData.isOtt) {
//       if (!formData.ottType) {
//         toast.error("Please select OTT Type");
//         return;
//       }
//       if (!formData.ottPackageId) {
//         toast.error("Please select a valid OTT Package");
//         return;
//       }
//     }

//     // Validate IPTV
//     if (formData.isIptv) {
//       if (!formData.iptvType) {
//         toast.error("Please select IPTV Type");
//         return;
//       }
//       if (!formData.iptvPackageId) {
//         toast.error("Please select a valid IPTV Package");
//         return;
//       }
//     }

//     try {
//       const payload = {
//         name: formData.name,
//         validity: {
//           number: Number(formData.validityNumber),
//           unit: formData.validityUnit,
//         },
//         sacCode: formData.sacCode || undefined,
//         fromDate: formData.fromDate || undefined,
//         toDate: formData.toDate || undefined,
//         status: formData.status,
//         typeOfPlan: formData.typeOfPlan,
//         categoryOfPlan: formData.categoryOfPlan,
//         description: formData.description || undefined,
//         basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
//         offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
//         packageAvailable: formData.packageAvailable,
//         offerPackage: formData.offerPackage,
//       };

//       if (formData.isOtt) {
//         payload.isOtt = true;
//         payload.ottType = formData.ottType;
//         payload.ottPackageId = formData.ottPackageId;
//       }

//       if (formData.isIptv) {
//         payload.isIptv = true;
//         payload.iptvType = formData.iptvType;
//         payload.iptvPackageId = formData.iptvPackageId;
//       }

//       console.log("Final Payload:", payload); // Debug before submit

//       await createPackage(payload);
//       toast.success("Package created successfully!");
//       navigate("/package/list");
//     } catch (error) {
//       const msg = error?.response?.data?.message || error.message || "Failed to create package";
//       toast.error(msg);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       validityNumber: "",
//       validityUnit: "Month",
//       sacCode: "",
//       fromDate: "",
//       toDate: "",
//       status: "active",
//       typeOfPlan: "Renew",
//       categoryOfPlan: "Unlimited",
//       description: "",
//       basePrice: "",
//       offerPrice: "",
//       packageAvailable: false,
//       offerPackage: false,
//       isOtt: false,
//       ottType: "",
//       ottPackageId: "",
//       isIptv: false,
//       iptvType: "",
//       iptvPackageId: "",
//     });
//     setOttPackages([]);
//     setIptvPackages([]);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-5xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

//       {/* Main Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div><label className="block font-medium mb-1">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="border p-2 w-full rounded" /></div>
//         <div><label className="block font-medium mb-1">Status *</label><select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded"><option value="active">Active</option><option value="inActive">Inactive</option></select></div>
//         <div><label className="block font-medium mb-1">Validity *</label><div className="flex gap-2"><input type="number" name="validityNumber" value={formData.validityNumber} onChange={handleChange} required className="border p-2 w-full rounded" /><select name="validityUnit" value={formData.validityUnit} onChange={handleChange} className="border p-2 rounded w-32"><option value="Day">Day</option><option value="Week">Week</option><option value="Month">Month</option><option value="Year">Year</option></select></div></div>
//         <div><label className="block font-medium mb-1">Type of Plan</label><select name="typeOfPlan" value={formData.typeOfPlan} onChange={handleChange} className="border p-2 w-full rounded"><option value="Renew">Renew</option><option value="Speed Booster Plan">Speed Booster Plan</option><option value="Valume Booster">Volume Booster</option></select></div>
//         <div><label className="block font-medium mb-1">Category of Plans *</label><select name="categoryOfPlan" value={formData.categoryOfPlan} onChange={handleChange} required className="border p-2 w-full rounded"><option value="">Select Plan Category</option><option value="Unlimited">Unlimited</option><option value="Limited">Limited</option><option value="Fup">FUP</option><option value="DayNight">Day/Night</option></select></div>
//         <div><label className="block font-medium mb-1">SAC Code</label><input type="text" name="sacCode" value={formData.sacCode} onChange={handleChange} className="border p-2 w-full rounded" /></div>
//         <div><label className="block font-medium mb-1">From Date</label><input type="datetime-local" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border p-2 w-full rounded" /></div>
//         <div><label className="block font-medium mb-1">To Date</label><input type="datetime-local" name="toDate" value={formData.toDate} onChange={handleChange} className="border p-2 w-full rounded" /></div>
//         <div><label className="block font-medium mb-1">BasePrice</label><input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="border p-2 w-full rounded" /></div>
//         <div><label className="block font-medium mb-1">OfferPrice</label><input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="border p-2 w-full rounded" /></div>
//       </div>

//       {/* Package Available & Offer Package */}
//       <div className="space-y-6 mb-8">
//         <div className="flex items-center justify-between">
//           <div><label className="block font-medium text-gray-600">Package available *</label><p className="text-xs text-gray-500 mt-1">(This package not available for new account)</p></div>
//           <div className="flex gap-10">
//             <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: true }))} className="w-5 h-5 text-blue-600" /><span className="text-gray-700">Yes</span></label>
//             <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={!formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: false }))} className="w-5 h-5 text-blue-600" /><span className="text-gray-700">No</span></label>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div><label className="block font-medium text-gray-600">Offer Package *</label><p className="text-xs text-gray-500 mt-1">(This package will applicable only once)</p></div>
//           <div className="flex gap-10">
//             <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: true }))} className="w-5 h-5 text-blue-600" /><span className="text-gray-700">Yes</span></label>
//             <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={!formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: false }))} className="w-5 h-5 text-blue-600" /><span className="text-gray-700">No</span></label>
//           </div>
//         </div>
//       </div>

//       {/* Bundle with OTT */}
//       <div className="mb-8">
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input type="checkbox" name="isOtt" checked={formData.isOtt} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
//           <span className="font-medium text-lg">Bundle with OTT</span>
//         </label>

//         {formData.isOtt && (
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
//             <div>
//               <label className="block font-medium mb-1">Select Ott Type</label>
//               <select name="ottType" value={formData.ottType} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select Ott Type</option>
//                 <option value="playBox">Play Box</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Select Package</label>
//               <select
//                 name="ottPackageId"
//                 value={formData.ottPackageId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//                 disabled={loadingOtt || !formData.ottType}
//               >
//                 <option value="">
//                   {loadingOtt ? "Loading..." : ottPackages.length === 0 ? "No OTT packages available" : "Select Package"}
//                 </option>
//                 {ottPackages.map((pkg) => (
//                   <option key={pkg._id.toString()} value={pkg._id}>
//                     {pkg.name}
//                   </option>
//                 ))}
//               </select>
//               {formData.isOtt && formData.ottType && ottPackages.length === 0 && !loadingOtt && (
//                 <p className="text-red-500 text-sm mt-2">No valid OTT packages found. Please create an OTT package first.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bundle with IPTV */}
//       <div className="mb-8">
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input type="checkbox" name="isIptv" checked={formData.isIptv} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
//           <span className="font-medium text-lg">Bundle with IPTV</span>
//         </label>

//         {formData.isIptv && (
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
//             <div>
//               <label className="block font-medium mb-1">Select IPTV Type</label>
//               <select name="iptvType" value={formData.iptvType} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select IPTV Type</option>
//                 <option value="ziggTv">Zigg TV</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Select Package</label>
//               <select
//                 name="iptvPackageId"
//                 value={formData.iptvPackageId}
//                 onChange={handleChange}
//                 className="border p-2 w-full rounded"
//                 disabled={loadingIptv || !formData.iptvType}
//               >
//                 <option value="">
//                   {loadingIptv ? "Loading..." : iptvPackages.length === 0 ? "No IPTV packages available" : "Select Package"}
//                 </option>
//                 {iptvPackages.map((pkg) => (
//                   <option key={pkg._id.toString()} value={pkg._id}>
//                     {pkg.name}
//                   </option>
//                 ))}
//               </select>
//               {formData.isIptv && formData.iptvType && iptvPackages.length === 0 && !loadingIptv && (
//                 <p className="text-red-500 text-sm mt-2">No valid IPTV packages found. Please create an IPTV package first.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Description */}
//       <div className="mb-8">
//         <label className="block font-medium mb-1">Description</label>
//         <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" rows={4} />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4">
//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded">Submit</button>
//         <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded">Clear</button>
//         <button type="button" onClick={() => navigate("/package/list")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded">Back</button>
//       </div>
//     </form>
//   );
// }
import { useState } from "react";
import { createPackage } from "../../service/package";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PackageCreate() {
  const [formData, setFormData] = useState({
    name: "",
    validityNumber: "",
    validityUnit: "Month",
    sacCode: "",
    fromDate: "",
    toDate: "",
    status: "active",
    typeOfPlan: "Renew",
    categoryOfPlan: "Unlimited",
    description: "",
    basePrice: "",
    offerPrice: "",
    packageAvailable: false,
    offerPackage: false,
    isOtt: false,
    ottType: "",
    ottPackageId: "",
    isIptv: false,
    iptvType: "",
    iptvPackageId: "",
  });

  const navigate = useNavigate();

  // === STATIC VALID MONGODB OBJECTIDs (24 hex characters) ===
  const staticOttPackages = [
    { _id: "67a1b2c3d4e5f67890123456", name: "Netflix Premium Bundle" },
    { _id: "67a1b2c3d4e5f67890123457", name: "Disney+ Hotstar VIP" },
    { _id: "67a1b2c3d4e5f67890123458", name: "Amazon Prime Video" },
  ];

  const staticIptvPackages = [
    { _id: "67a1b2c3d4e5f67890123459", name: "Zigg TV Premium 4K" },
    { _id: "67a1b2c3d4e5f6789012345a", name: "Zigg TV Sports Pack" },
    { _id: "67a1b2c3d4e5f6789012345b", name: "Zigg TV Family Plan" },
  ];
  // ========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
      toast.error("Please fill all required fields: Name, Validity Number, and Category!");
      return;
    }

    // Bundle validation (only if bundle is enabled)
    if (formData.isOtt) {
      if (!formData.ottType) {
        toast.error("Please select OTT Type");
        return;
      }
      if (!formData.ottPackageId) {
        toast.error("Please select an OTT Package");
        return;
      }
    }

    if (formData.isIptv) {
      if (!formData.iptvType) {
        toast.error("Please select IPTV Type");
        return;
      }
      if (!formData.iptvPackageId) {
        toast.error("Please select an IPTV Package");
        return;
      }
    }

    try {
      const payload = {
        name: formData.name.trim(),
        validity: {
          number: Number(formData.validityNumber),
          unit: formData.validityUnit,
        },
        sacCode: formData.sacCode || undefined,
        fromDate: formData.fromDate || undefined,
        toDate: formData.toDate || undefined,
        status: formData.status,
        typeOfPlan: formData.typeOfPlan,
        categoryOfPlan: formData.categoryOfPlan,
        description: formData.description || undefined,
        basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
        packageAvailable: formData.packageAvailable,
        offerPackage: formData.offerPackage,
      };

      // Add OTT bundle
      if (formData.isOtt) {
        payload.isOtt = true;
        payload.ottType = formData.ottType;
        payload.ottPackageId = formData.ottPackageId;
      }

      // Add IPTV bundle
      if (formData.isIptv) {
        payload.isIptv = true;
        payload.iptvType = formData.iptvType;
        payload.iptvPackageId = formData.iptvPackageId;
      }

      console.log("Sending Payload:", payload);

      await createPackage(payload);
      toast.success("Package created successfully!");
      navigate("/package/list");
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Failed to create package";
      toast.error(msg);
      console.error("Create Package Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      validityNumber: "",
      validityUnit: "Month",
      sacCode: "",
      fromDate: "",
      toDate: "",
      status: "active",
      typeOfPlan: "Renew",
      categoryOfPlan: "Unlimited",
      description: "",
      basePrice: "",
      offerPrice: "",
      packageAvailable: false,
      offerPackage: false,
      isOtt: false,
      ottType: "",
      ottPackageId: "",
      isIptv: false,
      iptvType: "",
      iptvPackageId: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

      {/* Main Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Validity *</label>
          <div className="flex gap-2">
            <input type="number" name="validityNumber" value={formData.validityNumber} onChange={handleChange} required className="border p-2 w-full rounded" placeholder="e.g. 30" />
            <select name="validityUnit" value={formData.validityUnit} onChange={handleChange} className="border p-2 rounded w-32">
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Type of Plan</label>
          <select name="typeOfPlan" value={formData.typeOfPlan} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="Renew">Renew</option>
            <option value="Speed Booster Plan">Speed Booster Plan</option>
            <option value="Valume Booster">Volume Booster</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Category of Plans *</label>
          <select name="categoryOfPlan" value={formData.categoryOfPlan} onChange={handleChange} required className="border p-2 w-full rounded">
            <option value="">Select Category</option>
            <option value="Unlimited">Unlimited</option>
            <option value="Limited">Limited</option>
            <option value="Fup">FUP</option>
            <option value="DayNight">Day/Night</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">SAC Code</label>
          <input type="text" name="sacCode" value={formData.sacCode} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">From Date</label>
          <input type="datetime-local" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">To Date</label>
          <input type="datetime-local" name="toDate" value={formData.toDate} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Base Price</label>
          <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Offer Price</label>
          <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
      </div>

      {/* Package Available & Offer Package */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-medium text-gray-600">Package available *</label>
            <p className="text-xs text-gray-500 mt-1">(This package not available for new account)</p>
          </div>
          <div className="flex gap-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: true }))} className="w-5 h-5 text-blue-600" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={!formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: false }))} className="w-5 h-5 text-blue-600" />
              <span>No</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-medium text-gray-600">Offer Package *</label>
            <p className="text-xs text-gray-500 mt-1">(This package will applicable only once)</p>
          </div>
          <div className="flex gap-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: true }))} className="w-5 h-5 text-blue-600" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={!formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: false }))} className="w-5 h-5 text-blue-600" />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bundle with OTT */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="isOtt" checked={formData.isOtt} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
          <span className="font-medium text-lg">Bundle with OTT</span>
        </label>

        {formData.isOtt && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
            <div>
              <label className="block font-medium mb-1">Select OTT Type</label>
              <select name="ottType" value={formData.ottType} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select OTT Type</option>
                <option value="playBox">Play Box</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Select OTT Package</label>
              {/* TODO: Replace with real API data later */}
              <select name="ottPackageId" value={formData.ottPackageId} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select Package</option>
                {staticOttPackages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bundle with IPTV */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="isIptv" checked={formData.isIptv} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
          <span className="font-medium text-lg">Bundle with IPTV</span>
        </label>

        {formData.isIptv && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
            <div>
              <label className="block font-medium mb-1">Select IPTV Type</label>
              <select name="iptvType" value={formData.iptvType} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select IPTV Type</option>
                <option value="ziggTv">Zigg TV</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Select IPTV Package</label>
              {/* TODO: Replace with real API data later */}
              <select name="iptvPackageId" value={formData.iptvPackageId} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select Package</option>
                {staticIptvPackages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" rows={4} placeholder="Enter package description..." />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded transition">
          Submit
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded transition">
          Clear
        </button>
        <button type="button" onClick={() => navigate("/package/list")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded transition">
          Back
        </button>
      </div>
    </form>
  );
}