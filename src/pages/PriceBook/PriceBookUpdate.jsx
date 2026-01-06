// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   updatePriceBook,
//   getPriceBookDetails,
//   getPackageList,
//   getRetailerList,
//   getLcoList,
//   getLcoListByReseller,
// } from "../../service/pricebook";
// import { getAssignedPackageList } from "../../service/rolePermission";
// import { toast } from "react-toastify";

// export default function PriceBookUpdate() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     priceBookName: "",
//     fromDate: "",
//     toDate: "",
//     status: "active",
//     description: "",
//     priceBookFor: "Reseller",
//     package: {}, 
//     assignedTo: [],
//   });

//   const [packages, setPackages] = useState([]);
//   const [retailers, setRetailers] = useState([]);
//   const [lcos, setLcos] = useState([]);
//   const [selectedResellerForLco, setSelectedResellerForLco] = useState(null);
//   const [lcosForSelectedReseller, setLcosForSelectedReseller] = useState([]);
//   const [selectedLcos, setSelectedLcos] = useState([]);
//   const [selectedResellers, setSelectedResellers] = useState([]);

//   // Fetch price book details + dropdown data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [priceBookRes, packageRes, retailerRes, lcoRes] = await Promise.all([
//           getPriceBookDetails(id),
//           getPackageList(),
//           getRetailerList(),
//           getLcoList(),
//         ]);

//         const priceBook = priceBookRes.data;
//         if (!priceBook) {
//           toast.error("Price book not found");
//           navigate("/pricebook/list");
//           return;
//         }

//         // Format dates for datetime-local (YYYY-MM-DDTHH:mm)
//         const formatDateTime = (dateString) => {
//           if (!dateString) return "";
//           return new Date(dateString).toISOString().slice(0, 16);
//         };

//         // Set form data
//         setFormData({
//           priceBookName: priceBook.priceBookName || "",
//           fromDate: formatDateTime(priceBook.fromDate),
//           toDate: formatDateTime(priceBook.toDate),
//           status: priceBook.status || "active",
//           description: priceBook.description || "",
//           priceBookFor: priceBook.priceBookFor?.[0] || "Reseller", // API sends array
//           package: (priceBook.package || []).reduce((acc, pkg) => {
//             acc[pkg.packageId] = {
//               packageId: pkg.packageId,
//               name: pkg.name,
//               basePrice: pkg.basePrice,
//               price: pkg.price || pkg.basePrice,
//               retailerPrice: pkg.retailerPrice || pkg.basePrice,
//               offerPrice: pkg.offerPrice || pkg.basePrice,
//             };
//             return acc;
//           }, {}),
//           assignedTo: priceBook.assignedTo || [],
//         });

//         // Set packages
//         setPackages(packageRes.data || []);
//         setRetailers(retailerRes.data || []);
//         setLcos(lcoRes.data || []);

//         // Handle pre-selection of assignees
//         if (priceBook.priceBookFor?.includes("Reseller")) {
//           setSelectedResellers(priceBook.assignedTo || []);
//         } else if (priceBook.priceBookFor?.includes("Lco")) {
//           // For LCO: assignedTo contains LCO IDs only (reseller is separate logic)
//           setSelectedLcos(priceBook.assignedTo || []);

//           // Try to detect reseller from packages or fallback
//           if (priceBook.package?.length > 0) {
//             const samplePkg = priceBook.package[0];
//             // If package has assigned reseller info (you might need to adjust)
//             // Otherwise, we can't auto-select reseller in update — user must reselect
//           }
//         }
//       } catch (err) {
//         console.error("Error loading data:", err);
//         toast.error("Failed to load price book details ❌");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, navigate]);

//   // Fetch packages when priceBookFor changes
//   useEffect(() => {
//     const loadPackages = async () => {
//       if (formData.priceBookFor === "Lco" && selectedResellerForLco) {
//         try {
//           const res = await getAssignedPackageList(selectedResellerForLco);
//           setPackages(res.data?.packages || []);
//         } catch (err) {
//           toast.error("Failed to load packages for this reseller ❌");
//           setPackages([]);
//         }
//       } else if (formData.priceBookFor === "Reseller") {
//         try {
//           const res = await getPackageList();
//           setPackages(res.data || []);
//         } catch (err) {
//           toast.error("Failed to load packages ❌");
//         }
//       }
//     };
//     loadPackages();
//   }, [formData.priceBookFor, selectedResellerForLco]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Package toggle
//   const handlePackageToggle = (pkg) => {
//     setFormData((prev) => {
//       const newPackages = { ...prev.package };
//       if (newPackages[pkg._id]) {
//         delete newPackages[pkg._id];
//       } else {
//         newPackages[pkg._id] = {
//           packageId: pkg._id,
//           name: pkg.name,
//           basePrice: pkg.basePrice,
//           price: pkg.basePrice || "",
//           retailerPrice: pkg.basePrice || "",
//           offerPrice: pkg.basePrice || "",
//         };
//       }
//       return { ...prev, package: newPackages };
//     });
//   };

//   // Package price change
//   const handlePackagePriceChange = (packageId, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       package: {
//         ...prev.package,
//         [packageId]: {
//           ...prev.package[packageId],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // Reseller selection (multiple)
//   const handleResellerToggle = (resellerId) => {
//     setSelectedResellers((prev) =>
//       prev.includes(resellerId)
//         ? prev.filter((id) => id !== resellerId)
//         : [...prev, resellerId]
//     );
//   };

//   // Reseller for LCO (single)
//   const handleResellerToggleForLco = async (resellerId) => {
//     if (selectedResellerForLco === resellerId) {
//       setSelectedResellerForLco(null);
//       setLcosForSelectedReseller([]);
//       setSelectedLcos([]);
//       setPackages([]);
//       return;
//     }
//     setSelectedResellerForLco(resellerId);
//     try {
//       const res = await getLcoListByReseller(resellerId);
//       setLcosForSelectedReseller(res.data || []);
//       setSelectedLcos([]); // reset LCO selection
//     } catch (err) {
//       toast.error("Failed to load LCOs ❌");
//       setLcosForSelectedReseller([]);
//     }
//   };

//   // LCO selection
//   const handleLcoToggle = (lcoId) => {
//     setSelectedLcos((prev) =>
//       prev.includes(lcoId) ? prev.filter((id) => id !== lcoId) : [...prev, lcoId]
//     );
//   };

//   // Submit update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       ...formData,
//       package: Object.values(formData.package),
//       assignedTo:
//         formData.priceBookFor === "Lco" ? selectedLcos : selectedResellers,
//     };

//     if (!payload.priceBookName || !payload.fromDate || !payload.toDate) {
//       toast.error("Please fill all required fields ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.package.length === 0) {
//       toast.error("Please select at least one package ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.package.some((p) => !p.price)) {
//       toast.error("Please set price for all selected packages ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.assignedTo.length === 0) {
//       toast.error("Please assign to at least one Reseller/LCO ❌");
//       setLoading(false);
//       return;
//     }

//     try {
//       await updatePriceBook(id, payload);
//       toast.success("Price book updated successfully ✅");
//       navigate("/pricebook/list");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to update price book ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear form
//   const handleClear = () => {
//     setFormData((prev) => ({
//       ...prev,
//       priceBookName: "",
//       fromDate: "",
//       toDate: "",
//       description: "",
//       package: {},
//     }));
//     setSelectedResellers([]);
//     setSelectedLcos([]);
//     setSelectedResellerForLco(null);
//     setLcosForSelectedReseller([]);
//   };

//   if (loading) {
//     return <div className="p-6 text-center">Loading price book details...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Price Book</h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block font-medium text-gray-700">Price Book Name *</label>
//           <input
//             type="text"
//             name="priceBookName"
//             value={formData.priceBookName}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700">From Date *</label>
//           <input
//             type="datetime-local"
//             name="fromDate"
//             value={formData.fromDate}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700">To Date *</label>
//           <input
//             type="datetime-local"
//             name="toDate"
//             value={formData.toDate}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700">Status *</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="active">Active</option>
//             <option value="inActive">Inactive</option>
//           </select>
//         </div>

//         <div className="col-span-2">
//           <label className="block font-medium text-gray-700">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//             rows={3}
//           />
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700">Price Book For *</label>
//           <select
//             name="priceBookFor"
//             value={formData.priceBookFor}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="Reseller">Reseller</option>
//             <option value="Lco">LCO</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700">Assigned To *</label>
//           <div className="border border-gray-300 p-4 rounded-lg max-h-40 overflow-y-auto bg-white shadow-inner">
//             {formData.priceBookFor === "Reseller" ? (
//               <div>
//                 <label className="block font-medium text-gray-700 mb-2">Select Resellers</label>
//                 {retailers
//                   .filter((r) => r.status === "true" || r.status === "Active")
//                   .map((retailer) => (
//                     <div key={retailer._id} className="flex items-center mb-3">
//                       <input
//                         type="checkbox"
//                         checked={selectedResellers.includes(retailer._id)}
//                         onChange={() => handleResellerToggle(retailer._id)}
//                         className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-3 text-gray-900">{retailer.resellerName}</span>
//                     </div>
//                   ))}
//               </div>
//             ) : (
//               <div>
//                 <label className="block font-medium text-gray-700 mb-2">Select Reseller</label>
//                 {retailers
//                   .filter((r) => r.status === "true" || r.status === "Active")
//                   .map((retailer) => (
//                     <div key={retailer._id} className="flex items-center mb-3">
//                       <input
//                         type="radio"
//                         checked={selectedResellerForLco === retailer._id}
//                         onChange={() => handleResellerToggleForLco(retailer._id)}
//                         className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-3 text-gray-900">{retailer.resellerName}</span>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>

//           {formData.priceBookFor === "Lco" && selectedResellerForLco && (
//             <div className="mt-4">
//               <label className="block font-medium text-gray-700 mb-2">Select LCOs</label>
//               <div className="border border-gray-300 p-4 rounded-lg max-h-40 overflow-y-auto bg-white shadow-inner">
//                 {lcosForSelectedReseller.length > 0 ? (
//                   lcosForSelectedReseller.map((lco) => (
//                     <div key={lco._id} className="flex items-center mb-3">
//                       <input
//                         type="checkbox"
//                         checked={selectedLcos.includes(lco._id)}
//                         onChange={() => handleLcoToggle(lco._id)}
//                         className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-3 text-gray-900">{lco.lcoName}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <div>No LCO found in this Reseller</div>
//                 )}
//               </div>
//             </div>
//           )}

//           {(selectedResellers.length > 0 || selectedLcos.length > 0) && (
//             <div className="mt-4">
//               <p className="font-medium text-gray-700">Selected:</p>
//               <ul className="list-disc pl-5 text-gray-900">
//                 {(formData.priceBookFor === "Reseller" ? selectedResellers : selectedLcos).map(
//                   (assignedId) => {
//                     const entity =
//                       formData.priceBookFor === "Reseller"
//                         ? retailers.find((r) => r._id === assignedId)
//                         : lcosForSelectedReseller.find((l) => l._id === assignedId);
//                     return (
//                       <li key={assignedId} className="mt-1">
//                         {entity?.resellerName || entity?.lcoName || "Unknown"}
//                       </li>
//                     );
//                   }
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>

//         <div className="col-span-2">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800">Packages</h3>
//           {packages.length === 0 ? (
//             <p className="text-gray-500">No packages available.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-300 rounded-lg">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-gray-700">Select</th>
//                     <th className="px-4 py-3 text-left text-gray-700">Package Name</th>
//                     <th className="px-4 py-3 text-left text-gray-700">Base Price</th>
//                     <th className="px-4 py-3 text-left text-gray-700">Price *</th>
//                     <th className="px-4 py-3 text-left text-gray-700">Retailer Price</th>
//                     <th className="px-4 py-3 text-left text-gray-700">Offer Price</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {packages.map((pkg) => (
//                     <tr key={pkg._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3">
//                         <input
//                           type="checkbox"
//                           checked={!!formData.package[pkg._id]}
//                           onChange={() => handlePackageToggle(pkg)}
//                           className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="px-4 py-3 text-gray-900">{pkg.name}</td>
//                       <td className="px-4 py-3 text-gray-900">{pkg.basePrice || "N/A"}</td>
//                       <td className="px-4 py-3">
//                         <input
//                           type="number"
//                           value={formData.package[pkg._id]?.price || ""}
//                           onChange={(e) =>
//                             handlePackagePriceChange(pkg._id, "price", e.target.value)
//                           }
//                           disabled={!formData.package[pkg._id]}
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//                           min="0"
//                           required={!!formData.package[pkg._id]}
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <input
//                           type="number"
//                           value={formData.package[pkg._id]?.retailerPrice || ""}
//                           onChange={(e) =>
//                             handlePackagePriceChange(pkg._id, "retailerPrice", e.target.value)
//                           }
//                           disabled={!formData.package[pkg._id]}
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <input
//                           type="number"
//                           value={formData.package[pkg._id]?.offerPrice || ""}
//                           onChange={(e) =>
//                             handlePackagePriceChange(pkg._id, "offerPrice", e.target.value)
//                           }
//                           disabled={!formData.package[pkg._id]}
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
//                           min="0"
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="col-span-2 flex justify-end gap-4 mt-6">
//           <button
//             type="button"
//             onClick={() => navigate("/pricebook/list")}
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updatePriceBook,
  getPriceBookDetails,
  getPackageList,
  getRetailerList,
  getLcoList,
  getLcoListByReseller,
} from "../../service/pricebook";
import { getAssignedPackageList } from "../../service/rolePermission";
import { toast } from "react-toastify";

export default function PriceBookUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    priceBookName: "",
    fromDate: "",
    toDate: "",
    status: "active",
    description: "",
    priceBookFor: "Reseller",
    package: {}, 
    assignedTo: [],
  });

  const [packages, setPackages] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [selectedResellerForLco, setSelectedResellerForLco] = useState(null);
  const [lcosForSelectedReseller, setLcosForSelectedReseller] = useState([]);
  const [selectedLcos, setSelectedLcos] = useState([]);
  const [selectedResellers, setSelectedResellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch price book details + dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceBookRes, packageRes, retailerRes, lcoRes] = await Promise.all([
          getPriceBookDetails(id),
          getPackageList(),
          getRetailerList(),
          getLcoList(),
        ]);

        const priceBook = priceBookRes.data;
        if (!priceBook) {
          toast.error("Price book not found");
          navigate("/pricebook/list");
          return;
        }

        // Format dates for datetime-local (YYYY-MM-DDTHH:mm)
        const formatDateTime = (dateString) => {
          if (!dateString) return "";
          return new Date(dateString).toISOString().slice(0, 16);
        };

        // Set form data
        setFormData({
          priceBookName: priceBook.priceBookName || "",
          fromDate: formatDateTime(priceBook.fromDate),
          toDate: formatDateTime(priceBook.toDate),
          status: priceBook.status || "active",
          description: priceBook.description || "",
          priceBookFor: priceBook.priceBookFor?.[0] || "Reseller", // API sends array
          package: (priceBook.package || []).reduce((acc, pkg) => {
            acc[pkg.packageId] = {
              packageId: pkg.packageId,
              name: pkg.name,
              basePrice: pkg.basePrice,
              price: pkg.price || pkg.basePrice,
              retailerPrice: pkg.retailerPrice || pkg.basePrice,
              offerPrice: pkg.offerPrice || pkg.basePrice,
            };
            return acc;
          }, {}),
          assignedTo: priceBook.assignedTo || [],
        });

        // Set packages
        setPackages(packageRes.data || []);
        setRetailers(retailerRes.data || []);
        setLcos(lcoRes.data || []);

        // Handle pre-selection of assignees
        if (priceBook.priceBookFor?.includes("Reseller")) {
          setSelectedResellers(priceBook.assignedTo || []);
        } else if (priceBook.priceBookFor?.includes("Lco")) {
          // For LCO: assignedTo contains LCO IDs only (reseller is separate logic)
          setSelectedLcos(priceBook.assignedTo || []);

          // Try to detect reseller from packages or fallback
          if (priceBook.package?.length > 0) {
            const samplePkg = priceBook.package[0];
            // If package has assigned reseller info (you might need to adjust)
            // Otherwise, we can't auto-select reseller in update — user must reselect
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load price book details ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Fetch packages when priceBookFor changes
  useEffect(() => {
    const loadPackages = async () => {
      if (formData.priceBookFor === "Lco" && selectedResellerForLco) {
        try {
          const res = await getAssignedPackageList(selectedResellerForLco);
          setPackages(res.data?.packages || []);
        } catch (err) {
          toast.error("Failed to load packages for this reseller ❌");
          setPackages([]);
        }
      } else if (formData.priceBookFor === "Reseller") {
        try {
          const res = await getPackageList();
          setPackages(res.data || []);
        } catch (err) {
          toast.error("Failed to load packages ❌");
        }
      }
    };
    loadPackages();
  }, [formData.priceBookFor, selectedResellerForLco]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Package toggle
  const handlePackageToggle = (pkg) => {
    setFormData((prev) => {
      const newPackages = { ...prev.package };
      if (newPackages[pkg._id]) {
        delete newPackages[pkg._id];
      } else {
        newPackages[pkg._id] = {
          packageId: pkg._id,
          name: pkg.name,
          basePrice: pkg.basePrice,
          price: pkg.basePrice || "",
          retailerPrice: pkg.basePrice || "",
          offerPrice: pkg.basePrice || "",
        };
      }
      return { ...prev, package: newPackages };
    });
  };

  // Package price change
  const handlePackagePriceChange = (packageId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      package: {
        ...prev.package,
        [packageId]: {
          ...prev.package[packageId],
          [field]: value,
        },
      },
    }));
  };

  // Reseller selection (multiple)
  const handleResellerToggle = (resellerId) => {
    setSelectedResellers((prev) =>
      prev.includes(resellerId)
        ? prev.filter((id) => id !== resellerId)
        : [...prev, resellerId]
    );
  };

  // Reseller for LCO (single)
  const handleResellerToggleForLco = async (resellerId) => {
    if (selectedResellerForLco === resellerId) {
      setSelectedResellerForLco(null);
      setLcosForSelectedReseller([]);
      setSelectedLcos([]);
      setPackages([]);
      return;
    }
    setSelectedResellerForLco(resellerId);
    try {
      const res = await getLcoListByReseller(resellerId);
      setLcosForSelectedReseller(res.data || []);
      setSelectedLcos([]); // reset LCO selection
    } catch (err) {
      toast.error("Failed to load LCOs ❌");
      setLcosForSelectedReseller([]);
    }
  };

  // LCO selection
  const handleLcoToggle = (lcoId) => {
    setSelectedLcos((prev) =>
      prev.includes(lcoId) ? prev.filter((id) => id !== lcoId) : [...prev, lcoId]
    );
  };

  // Select all packages
  const handleSelectAll = () => {
    const filteredPackages = packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const allSelected = filteredPackages.every((pkg) => !!formData.package[pkg._id]);

    setFormData((prev) => {
      const newPackages = { ...prev.package };
      if (allSelected) {
        filteredPackages.forEach((pkg) => delete newPackages[pkg._id]);
      } else {
        filteredPackages.forEach((pkg) => {
          if (!newPackages[pkg._id]) {
            newPackages[pkg._id] = {
              packageId: pkg._id,
              name: pkg.name,
              basePrice: pkg.basePrice,
              price: pkg.basePrice || "",
              retailerPrice: pkg.basePrice || "",
              offerPrice: pkg.basePrice || "",
            };
          }
        });
      }
      return { ...prev, package: newPackages };
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      package: Object.values(formData.package),
      assignedTo:
        formData.priceBookFor === "Lco" ? selectedLcos : selectedResellers,
    };

    if (!payload.priceBookName || !payload.fromDate || !payload.toDate) {
      toast.error("Please fill all required fields ❌");
      setLoading(false);
      return;
    }
    if (payload.package.length === 0) {
      toast.error("Please select at least one package ❌");
      setLoading(false);
      return;
    }
    if (payload.package.some((p) => !p.price)) {
      toast.error("Please set price for all selected packages ❌");
      setLoading(false);
      return;
    }
    if (payload.assignedTo.length === 0) {
      toast.error("Please assign to at least one Reseller/LCO ❌");
      setLoading(false);
      return;
    }

    try {
      await updatePriceBook(id, payload);
      toast.success("Price book updated successfully ✅");
      navigate("/pricebook/list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update price book ❌");
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      priceBookName: "",
      fromDate: "",
      toDate: "",
      description: "",
      package: {},
    }));
    setSelectedResellers([]);
    setSelectedLcos([]);
    setSelectedResellerForLco(null);
    setLcosForSelectedReseller([]);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading price book details...</div>;
  }

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const allSelected = filteredPackages.every((pkg) => !!formData.package[pkg._id]);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const displayedPackages = filteredPackages.slice(start, start + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Price Book</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700">Price Book Name *</label>
          <input
            type="text"
            name="priceBookName"
            value={formData.priceBookName}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">From Date *</label>
          <input
            type="datetime-local"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">To Date *</label>
          <input
            type="datetime-local"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Price Book For *</label>
          <select
            name="priceBookFor"
            value={formData.priceBookFor}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Reseller">Reseller</option>
            <option value="Lco">LCO</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Assigned To *</label>
          <div className="border border-gray-300 p-4 rounded-lg max-h-40 overflow-y-auto bg-white shadow-inner">
            {formData.priceBookFor === "Reseller" ? (
              <div>
                <label className="block font-medium text-gray-700 mb-2">Select Resellers</label>
                {retailers
                  .filter((r) => r.status === "true" || r.status === "Active")
                  .map((retailer) => (
                    <div key={retailer._id} className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={selectedResellers.includes(retailer._id)}
                        onChange={() => handleResellerToggle(retailer._id)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{retailer.resellerName}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <label className="block font-medium text-gray-700 mb-2">Select Reseller</label>
                {retailers
                  .filter((r) => r.status === "true" || r.status === "Active")
                  .map((retailer) => (
                    <div key={retailer._id} className="flex items-center mb-3">
                      <input
                        type="radio"
                        checked={selectedResellerForLco === retailer._id}
                        onChange={() => handleResellerToggleForLco(retailer._id)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{retailer.resellerName}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {formData.priceBookFor === "Lco" && selectedResellerForLco && (
            <div className="mt-4">
              <label className="block font-medium text-gray-700 mb-2">Select LCOs</label>
              <div className="border border-gray-300 p-4 rounded-lg max-h-40 overflow-y-auto bg-white shadow-inner">
                {lcosForSelectedReseller.length > 0 ? (
                  lcosForSelectedReseller.map((lco) => (
                    <div key={lco._id} className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={selectedLcos.includes(lco._id)}
                        onChange={() => handleLcoToggle(lco._id)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{lco.lcoName}</span>
                    </div>
                  ))
                ) : (
                  <div>No LCO found in this Reseller</div>
                )}
              </div>
            </div>
          )}

          {(selectedResellers.length > 0 || selectedLcos.length > 0) && (
            <div className="mt-4">
              <p className="font-medium text-gray-700">Selected:</p>
              <ul className="list-disc pl-5 text-gray-900">
                {(formData.priceBookFor === "Reseller" ? selectedResellers : selectedLcos).map(
                  (assignedId) => {
                    const entity =
                      formData.priceBookFor === "Reseller"
                        ? retailers.find((r) => r._id === assignedId)
                        : lcosForSelectedReseller.find((l) => l._id === assignedId);
                    return (
                      <li key={assignedId} className="mt-1">
                        {entity?.resellerName || entity?.lcoName || "Unknown"}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Packages</h3>
          {packages.length === 0 ? (
            <p className="text-gray-500">No packages available.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-4 w-1/3">
                <input
                  type="text"
                  placeholder="Search by package name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700">Package Name</th>
                    <th className="px-4 py-3 text-left text-gray-700">Base Price</th>
                    <th className="px-4 py-3 text-left text-gray-700">Price *</th>
                    <th className="px-4 py-3 text-left text-gray-700">Retailer Price</th>
                    <th className="px-4 py-3 text-left text-gray-700">Offer Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedPackages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!!formData.package[pkg._id]}
                          onChange={() => handlePackageToggle(pkg)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-900">{pkg.name}</td>
                      <td className="px-4 py-3 text-gray-900">{pkg.basePrice || "N/A"}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={formData.package[pkg._id]?.price || ""}
                          onChange={(e) =>
                            handlePackagePriceChange(pkg._id, "price", e.target.value)
                          }
                          disabled={!formData.package[pkg._id]}
                          className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          required={!!formData.package[pkg._id]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={formData.package[pkg._id]?.retailerPrice || ""}
                          onChange={(e) =>
                            handlePackagePriceChange(pkg._id, "retailerPrice", e.target.value)
                          }
                          disabled={!formData.package[pkg._id]}
                          className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={formData.package[pkg._id]?.offerPrice || ""}
                          onChange={(e) =>
                            handlePackagePriceChange(pkg._id, "offerPrice", e.target.value)
                          }
                          disabled={!formData.package[pkg._id]}
                          className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/pricebook/list")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}