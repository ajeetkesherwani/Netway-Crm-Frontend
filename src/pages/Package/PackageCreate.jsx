// import { useState } from "react";
// import { createPackage, getIptvPackageListFromThirdParty } from "../../service/package";
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

//   const navigate = useNavigate();

//   // === STATIC VALID MONGODB OBJECTIDs (24 hex characters) ===
//   const staticOttPackages = [
//     { _id: "67a1b2c3d4e5f67890123456", name: "Netflix Premium Bundle" },
//     { _id: "67a1b2c3d4e5f67890123457", name: "Disney+ Hotstar VIP" },
//     { _id: "67a1b2c3d4e5f67890123458", name: "Amazon Prime Video" },
//   ];

//   const staticIptvPackages = [
//     { _id: "67a1b2c3d4e5f67890123459", name: "Zigg TV Premium 4K" },
//     { _id: "67a1b2c3d4e5f6789012345a", name: "Zigg TV Sports Pack" },
//     { _id: "67a1b2c3d4e5f6789012345b", name: "Zigg TV Family Plan" },
//   ];
//   // ========================================================

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Required fields
//     if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
//       toast.error("Please fill all required fields: Name, Validity Number, and Category!");
//       return;
//     }

//     // Bundle validation (only if bundle is enabled)
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
//         name: formData.name.trim(),
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

//       // Add OTT bundle
//       if (formData.isOtt) {
//         payload.isOtt = true;
//         payload.ottType = formData.ottType;
//         payload.ottPackageId = formData.ottPackageId;
//       }

//       // Add IPTV bundle
//       if (formData.isIptv) {
//         payload.isIptv = true;
//         payload.iptvType = formData.iptvType;
//         payload.iptvPackageId = formData.iptvPackageId;
//       }

//       console.log("Sending Payload:", payload);

//       await createPackage(payload);
//       toast.success("Package created successfully!");
//       navigate("/package/list");
//     } catch (error) {
//       const msg = error?.response?.data?.message || error.message || "Failed to create package";
//       toast.error(msg);
//       console.error("Create Package Error:", error);
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
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-5xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

//       {/* Main Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
//             <input type="number" name="validityNumber" value={formData.validityNumber} onChange={handleChange} required className="border p-2 w-full rounded" placeholder="e.g. 30" />
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
//           <select name="categoryOfPlan" value={formData.categoryOfPlan} onChange={handleChange} required className="border p-2 w-full rounded">
//             <option value="">Select Category</option>
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
//           <label className="block font-medium mb-1">Base Price</label>
//           <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="border p-2 w-full rounded" />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Offer Price</label>
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
//               <input type="radio" checked={formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: true }))} className="w-5 h-5 text-blue-600" />
//               <span>Yes</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" checked={!formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: false }))} className="w-5 h-5 text-blue-600" />
//               <span>No</span>
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
//               <input type="radio" checked={formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: true }))} className="w-5 h-5 text-blue-600" />
//               <span>Yes</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" checked={!formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: false }))} className="w-5 h-5 text-blue-600" />
//               <span>No</span>
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
//               <label className="block font-medium mb-1">Select OTT Type</label>
//               <select name="ottType" value={formData.ottType} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select OTT Type</option>
//                 <option value="playBox">Play Box</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Select OTT Package</label>
//               {/* TODO: Replace with real API data later */}
//               <select name="ottPackageId" value={formData.ottPackageId} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select Package</option>
//                 {staticOttPackages.map((pkg) => (
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
//               <label className="block font-medium mb-1">Select IPTV Package</label>
//               {/* TODO: Replace with real API data later */}
//               <select name="iptvPackageId" value={formData.iptvPackageId} onChange={handleChange} className="border p-2 w-full rounded">
//                 <option value="">Select Package</option>
//                 {staticIptvPackages.map((pkg) => (
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
//         <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" rows={4} placeholder="Enter package description..." />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4">
//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded transition">
//           Submit
//         </button>
//         <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded transition">
//           Clear
//         </button>
//         <button type="button" onClick={() => navigate("/package/list")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded transition">
//           Back
//         </button>
//       </div>
//     </form>
//   );
// }

import { useState, useEffect } from "react";
import { createPackage, getIptvPackageListFromThirdParty } from "../../service/package";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function PackageCreate() {
  const navigate = useNavigate();

  // Default fromDate = today at current time
  const today = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  const [formData, setFormData] = useState({
    name: "",
    validityNumber: "",
    validityUnit: "Month",
    sacCode: "",
    fromDate: today,           // ← default to today
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

  const [iptvPackages, setIptvPackages] = useState([]);

    // === STATIC VALID MONGODB OBJECTIDs (24 hex characters) ===
  const staticOttPackages = [
    { _id: "67a1b2c3d4e5f67890123456", name: "Netflix Premium Bundle" },
    { _id: "67a1b2c3d4e5f67890123457", name: "Disney+ Hotstar VIP" },
    { _id: "67a1b2c3d4e5f67890123458", name: "Amazon Prime Video" },
  ];


  // Fetch IPTV packages when checkbox is checked
  useEffect(() => {
    if (formData.isIptv) {
      const fetchIptv = async () => {
        try {
          const packages = await getIptvPackageListFromThirdParty();
          setIptvPackages(packages || []);
        } catch (error) {
          toast.error(error.message || "Failed to load IPTV packages");
          console.error("IPTV fetch error:", error);
        }
      };
      fetchIptv();
    } else {
      setIptvPackages([]);
    }
  }, [formData.isIptv]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
      toast.error("Please fill all required fields: Name, Validity Number, and Category!");
      return;
    }

    if (formData.isOtt) {
      if (!formData.ottType || !formData.ottPackageId) {
        toast.error("Please select OTT Type and OTT Package");
        return;
      }
    }

    if (formData.isIptv) {
      if (!formData.iptvType || !formData.iptvPackageId) {
        toast.error("Please select IPTV Type and IPTV Package");
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

      if (formData.isOtt) {
        payload.isOtt = true;
        payload.ottType = formData.ottType;
        payload.ottPackageId = formData.ottPackageId;
      }

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
      fromDate: today,
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
    setIptvPackages([]);
  };

  // Find selected IPTV option for react-select value prop
  const selectedIptvOption = iptvPackages
    .map((pkg) => ({
      value: pkg.plan_Id,
      label: pkg.plan_name,
    }))
    .find((opt) => opt.value === formData.iptvPackageId) || null;

  return (
    <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-5xl">
      {/* Moved to left */}
      <h2 className="text-2xl font-bold mb-6 text-left">Create Package</h2>

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
                {/* <option value="">Select IPTV Type</option> */}
                <option value="ziggTv">Zigg TV</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Select IPTV Package *</label>
              <Select
                value={selectedIptvOption}                      // ← fixed: now shows selected name
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    iptvPackageId: selected ? selected.value : "",
                  }))
                }
                options={iptvPackages.map((pkg) => ({
                  value: pkg.plan_Id,
                  label: pkg.plan_name,
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
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
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