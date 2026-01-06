// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createPriceBook, getPackageList, getRetailerList, getLcoList, getLcoListByReseller } from "../../service/pricebook";
// import { toast } from "react-toastify";
// import { getAssignedPackageList } from "../../service/rolePermission";

// export default function PriceBookCreate() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     priceBookName: "",
//     // fromDate: "",
//     fromDate: new Date().toISOString().slice(0, 16),
//     toDate: "",
//     status: "active",
//     description: "",
//     priceBookFor: "Reseller",
//     package: [],
//     assignedTo: [],
//   });
//   const [packages, setPackages] = useState([]);
//   const [retailers, setRetailers] = useState([]);
//   const [lcos, setLcos] = useState([]);
//   const [selectedResellerForLco, setSelectedResellerForLco] = useState(null);
//   const [lcosForSelectedReseller, setLcosForSelectedReseller] = useState([]);
//   const [selectedLcos, setSelectedLcos] = useState([]);
//   const [selectedResellers, setSelectedResellers] = useState([]);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [packageRes, retailerRes, lcoRes] = await Promise.all([
//           getPackageList(),
//           getRetailerList(),
//           getLcoList(),
//         ]);
//         setPackages(packageRes.data || []); // Load all packages initially
//         setRetailers(retailerRes.data || []);
//         setLcos(lcoRes.data || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         toast.error("Failed to load data ❌");
//       }
//     };
//     fetchData();
//   }, []);

//   // Fetch packages for LCO when reseller is selected
//   useEffect(() => {
//     const fetchPackagesForLCO = async () => {
//       if (formData.priceBookFor === "Lco" && selectedResellerForLco) {
//         try {
//           const res = await getAssignedPackageList(selectedResellerForLco);
//           setPackages(res.data?.packages || []);
//         } catch (err) {
//           console.error("Error fetching packages for reseller:", err);
//           toast.error("Failed to load packages for this reseller ❌");
//           setPackages([]);
//         }
//       } else if (formData.priceBookFor === "Reseller") {
//         // Fetch all packages when switching to Reseller
//         fetchInitialPackages();
//       } else {
//         setPackages([]); // Clear packages if no reseller selected in LCO
//       }
//     };
//     fetchPackagesForLCO();
//   }, [selectedResellerForLco, formData.priceBookFor]);

//   // Clear states when priceBookFor changes
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       assignedTo: [],
//     }));
//     setSelectedResellerForLco(null);
//     setLcosForSelectedReseller([]);
//     setSelectedLcos([]);
//     setSelectedResellers([]);
//     setPackages([]); // Clear packages initially
//     if (formData.priceBookFor === "Reseller") {
//       fetchInitialPackages(); // Reload all packages for Reseller
//     }
//   }, [formData.priceBookFor]);

//   // Fetch all packages initially for Reseller
//   const fetchInitialPackages = async () => {
//     try {
//       const res = await getPackageList();
//       setPackages(res.data || []);
//     } catch (err) {
//       console.error("Error fetching initial packages:", err);
//       toast.error("Failed to load packages ❌");
//       setPackages([]);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle package checkbox toggle
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

//   // Handle package price input changes
//   const handlePackagePriceChange = (packageId, field, value) => {
//     setFormData((prev) => {
//       const newPackages = { ...prev.package };
//       if (newPackages[packageId]) {
//         newPackages[packageId] = {
//           ...newPackages[packageId],
//           [field]: value,
//         };
//       }
//       return { ...prev, package: newPackages };
//     });
//   };

//   // Handle reseller selection for Reseller mode (multiple)
//   const handleResellerToggle = (resellerId) => {
//     setSelectedResellers((prev) =>
//       prev.includes(resellerId) ? prev.filter((id) => id !== resellerId) : [...prev, resellerId]
//     );
//     setFormData((prev) => ({
//       ...prev,
//       assignedTo: [...new Set([...prev.assignedTo, ...selectedResellers, resellerId])],
//     }));
//   };

//   // Handle reseller selection for LCO (single)
//   const handleResellerToggleForLco = async (resellerId) => {
//     if (selectedResellerForLco === resellerId) {
//       setSelectedResellerForLco(null);
//       setLcosForSelectedReseller([]);
//       setSelectedLcos([]);
//       setPackages([]); // Clear packages when reseller is deselected for LCO
//       return;
//     }
//     setSelectedResellerForLco(resellerId);
//     try {
//       const res = await getLcoListByReseller(resellerId);
//       setLcosForSelectedReseller(res.data || []);
//       setSelectedLcos([]); // Reset selected LCOs when changing reseller
//     } catch (err) {
//       console.error("Error fetching LCOs for reseller:", err);
//       toast.error("Failed to load LCOs for this reseller ❌");
//       setLcosForSelectedReseller([]);
//       setSelectedLcos([]);
//     }
//   };

//   // Handle LCO selection
//   const handleLcoToggle = (lcoId) => {
//     setSelectedLcos((prev) =>
//       prev.includes(lcoId) ? prev.filter((id) => id !== lcoId) : [...prev, lcoId]
//     );
//     setFormData((prev) => ({
//       ...prev,
//       assignedTo: [...new Set([...prev.assignedTo, ...selectedLcos, lcoId])],
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       ...formData,
//       package: Object.values(formData.package),
//       assignedTo: formData.priceBookFor === "Lco" ? selectedLcos : selectedResellers,
//     };
//     // Validate required fields
//     if (!payload.priceBookName ||  !payload.status || !payload.priceBookFor) {
//       toast.error("Please fill all required fields ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.package.length === 0) {
//       toast.error("Please select at least one package ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.package.some((pkg) => !pkg.price)) {
//       toast.error("Please provide a price for all selected packages ❌");
//       setLoading(false);
//       return;
//     }
//     if (payload.assignedTo.length === 0) {
//       toast.error("Please select at least one assignee ❌");
//       setLoading(false);
//       return;
//     }
//     try {
//       await createPriceBook(payload);
//       toast.success("Price book created successfully ✅");
//       navigate("/pricebook/list");
//     } catch (err) {
//       console.error("Error creating price book:", err);
//       toast.error(err.message || "Failed to create price book ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form clear
//   const handleClear = () => {
//     setFormData({
//       priceBookName: "",
//       fromDate: "",
//       toDate: "",
//       status: "active",
//       description: "",
//       priceBookFor: "Reseller",
//       package: [],
//       assignedTo: [],
//     });
//     setSelectedPackages({});
//     setSelectedResellerForLco(null);
//     setLcosForSelectedReseller([]);
//     setSelectedLcos([]);
//     setSelectedResellers([]);
//     setPackages([]);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Price Book</h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block font-medium text-gray-700">Price Book Name *</label>
//           <input
//             type="text"
//             name="priceBookName"
//             value={formData.priceBookName}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium text-gray-700">Status *</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
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
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             rows={3}
//           />
//         </div>
//         <div>
//           <label className="block font-medium text-gray-700">Price Book For *</label>
//           <select
//             name="priceBookFor"
//             value={formData.priceBookFor}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
//                         className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
//                         className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
//                 {lcosForSelectedReseller.length > 0 && lcosForSelectedReseller.map((lco) => (
//                   <div key={lco._id} className="flex items-center mb-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedLcos.includes(lco._id)}
//                       onChange={() => handleLcoToggle(lco._id)}
//                       className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <span className="ml-3 text-gray-900">{lco.lcoName}</span>
//                   </div>
//                 ))}
//                 {lcosForSelectedReseller.length < 1 && <div>No LCO found in this Reseller</div>}
//               </div>
//             </div>
//           )}
//           {formData.assignedTo.length > 0 && (
//             <div className="mt-4">
//               <p className="font-medium text-gray-700">Selected:</p>
//               <ul className="list-disc pl-5 text-gray-900">
//                 {formData.assignedTo.map((id) => {
//                   const entity = formData.priceBookFor === "Reseller"
//                     ? retailers.find((r) => r._id === id)
//                     : lcos.find((l) => l._id === id);
//                   return (
//                     <li key={id} className="mt-1">
//                       {entity?.resellerName || entity?.lcoName || "Unknown"}
//                     </li>
//                   );
//                 })}
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
//                           className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           disabled={!formData.package[pkg._id]}
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
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           disabled={!formData.package[pkg._id]}
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
//                           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           disabled={!formData.package[pkg._id]}
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
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
//           >
//             {loading ? "Saving..." : "Submit"}
//           </button>
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPriceBook, getPackageList, getRetailerList, getLcoList, getLcoListByReseller } from "../../service/pricebook";
import { toast } from "react-toastify";
import { getAssignedPackageList } from "../../service/rolePermission";

export default function PriceBookCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    priceBookName: "",
    fromDate: new Date().toISOString().slice(0, 16),
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
  const selectAllRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageRes, retailerRes, lcoRes] = await Promise.all([
          getPackageList(),
          getRetailerList(),
          getLcoList(),
        ]);
        setPackages(packageRes.data || []); // Load all packages initially
        setRetailers(retailerRes.data || []);
        setLcos(lcoRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data ❌");
      }
    };
    fetchData();
  }, []);

  // Fetch packages for LCO when reseller is selected
  useEffect(() => {
    const fetchPackagesForLCO = async () => {
      if (formData.priceBookFor === "Lco" && selectedResellerForLco) {
        try {
          const res = await getAssignedPackageList(selectedResellerForLco);
          setPackages(res.data?.packages || []);
        } catch (err) {
          console.error("Error fetching packages for reseller:", err);
          toast.error("Failed to load packages for this reseller ❌");
          setPackages([]);
        }
      } else if (formData.priceBookFor === "Reseller") {
        // Fetch all packages when switching to Reseller
        fetchInitialPackages();
      } else {
        setPackages([]); // Clear packages if no reseller selected in LCO
      }
    };
    fetchPackagesForLCO();
  }, [selectedResellerForLco, formData.priceBookFor]);

  // Clear states when priceBookFor changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: [],
      package: {},
    }));
    setSelectedResellerForLco(null);
    setLcosForSelectedReseller([]);
    setSelectedLcos([]);
    setSelectedResellers([]);
    setPackages([]); // Clear packages initially
    if (formData.priceBookFor === "Reseller") {
      fetchInitialPackages(); // Reload all packages for Reseller
    }
  }, [formData.priceBookFor]);

  // Update select all checkbox state
  useEffect(() => {
    if (selectAllRef.current) {
      const filteredPackages = packages.filter((pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const selectedCount = filteredPackages.filter((pkg) => !!formData.package[pkg._id]).length;
      if (selectedCount === 0) {
        selectAllRef.current.checked = false;
        selectAllRef.current.indeterminate = false;
      } else if (selectedCount === filteredPackages.length) {
        selectAllRef.current.checked = true;
        selectAllRef.current.indeterminate = false;
      } else {
        selectAllRef.current.checked = false;
        selectAllRef.current.indeterminate = true;
      }
    }
  }, [formData.package, packages, searchTerm]);

  // Fetch all packages initially for Reseller
  const fetchInitialPackages = async () => {
    try {
      const res = await getPackageList();
      setPackages(res.data || []);
    } catch (err) {
      console.error("Error fetching initial packages:", err);
      toast.error("Failed to load packages ❌");
      setPackages([]);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select all for packages
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const filteredPackages = packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFormData((prev) => {
      const newPackages = { ...prev.package };
      if (checked) {
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
      } else {
        filteredPackages.forEach((pkg) => {
          delete newPackages[pkg._id];
        });
      }
      return { ...prev, package: newPackages };
    });
  };

  // Handle package checkbox toggle
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

  // Handle package price input changes
  const handlePackagePriceChange = (packageId, field, value) => {
    setFormData((prev) => {
      const newPackages = { ...prev.package };
      if (newPackages[packageId]) {
        newPackages[packageId] = {
          ...newPackages[packageId],
          [field]: value,
        };
      }
      return { ...prev, package: newPackages };
    });
  };

  // Handle reseller selection for Reseller mode (multiple)
  const handleResellerToggle = (resellerId) => {
    setSelectedResellers((prev) => {
      const isSelected = prev.includes(resellerId);
      const newSelected = isSelected
        ? prev.filter((id) => id !== resellerId)
        : [...prev, resellerId];
      setFormData((prevForm) => ({
        ...prevForm,
        assignedTo: newSelected,
      }));
      return newSelected;
    });
  };

  // Handle reseller selection for LCO (single)
  const handleResellerToggleForLco = async (resellerId) => {
    if (selectedResellerForLco === resellerId) {
      setSelectedResellerForLco(null);
      setLcosForSelectedReseller([]);
      setSelectedLcos([]);
      setPackages([]); // Clear packages when reseller is deselected for LCO
      return;
    }
    setSelectedResellerForLco(resellerId);
    try {
      const res = await getLcoListByReseller(resellerId);
      setLcosForSelectedReseller(res.data || []);
      setSelectedLcos([]); // Reset selected LCOs when changing reseller
    } catch (err) {
      console.error("Error fetching LCOs for reseller:", err);
      toast.error("Failed to load LCOs for this reseller ❌");
      setLcosForSelectedReseller([]);
      setSelectedLcos([]);
    }
  };

  // Handle LCO selection
  const handleLcoToggle = (lcoId) => {
    setSelectedLcos((prev) => {
      const isSelected = prev.includes(lcoId);
      const newSelected = isSelected
        ? prev.filter((id) => id !== lcoId)
        : [...prev, lcoId];
      setFormData((prevForm) => ({
        ...prevForm,
        assignedTo: newSelected,
      }));
      return newSelected;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      package: Object.values(formData.package),
      assignedTo: formData.priceBookFor === "Lco" ? selectedLcos : selectedResellers,
    };
    // Validate required fields
    if (!payload.priceBookName || !payload.status || !payload.priceBookFor) {
      toast.error("Please fill all required fields ❌");
      setLoading(false);
      return;
    }
    if (payload.package.length === 0) {
      toast.error("Please select at least one package ❌");
      setLoading(false);
      return;
    }
    if (payload.package.some((pkg) => !pkg.price)) {
      toast.error("Please provide a price for all selected packages ❌");
      setLoading(false);
      return;
    }
    if (payload.assignedTo.length === 0) {
      toast.error("Please select at least one assignee ❌");
      setLoading(false);
      return;
    }
    try {
      await createPriceBook(payload);
      toast.success("Price book created successfully ✅");
      navigate("/pricebook/list");
    } catch (err) {
      console.error("Error creating price book:", err);
      toast.error(err.message || "Failed to create price book ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle form clear
  const handleClear = () => {
    setFormData({
      priceBookName: "",
      fromDate: "",
      toDate: "",
      status: "active",
      description: "",
      priceBookFor: "Reseller",
      package: {},
      assignedTo: [],
    });
    setSelectedResellerForLco(null);
    setLcosForSelectedReseller([]);
    setSelectedLcos([]);
    setSelectedResellers([]);
    setPackages([]);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const currentPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Price Book</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700">Price Book Name *</label>
          <input
            type="text"
            name="priceBookName"
            value={formData.priceBookName}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
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
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Price Book For *</label>
          <select
            name="priceBookFor"
            value={formData.priceBookFor}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                {lcosForSelectedReseller.length > 0 && lcosForSelectedReseller.map((lco) => (
                  <div key={lco._id} className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={selectedLcos.includes(lco._id)}
                      onChange={() => handleLcoToggle(lco._id)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900">{lco.lcoName}</span>
                  </div>
                ))}
                {lcosForSelectedReseller.length < 1 && <div>No LCO found in this Reseller</div>}
              </div>
            </div>
          )}
          {formData.assignedTo.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-gray-700">Selected:</p>
              <ul className="list-disc pl-5 text-gray-900">
                {formData.assignedTo.map((id) => {
                  const entity = formData.priceBookFor === "Reseller"
                    ? retailers.find((r) => r._id === id)
                    : lcos.find((l) => l._id === id);
                  return (
                    <li key={id} className="mt-1">
                      {entity?.resellerName || entity?.lcoName || "Unknown"}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Packages</h3>

            {packages.length > 0 && (
              <input
                type="text"
                placeholder="Search by package name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 p-2 w-1/3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {packages.length === 0 ? (
            <p className="text-gray-500">No packages available.</p>
          ) : filteredPackages.length === 0 ? (
            <p className="text-gray-500">No matching packages found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          ref={selectAllRef}
                          onChange={handleSelectAll}
                          className="h-5 w-5 text-blue-600 rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left">Package Name</th>
                      <th className="px-4 py-3 text-left">Base Price</th>
                      <th className="px-4 py-3 text-left">Price *</th>
                      <th className="px-4 py-3 text-left">Retailer Price</th>
                      <th className="px-4 py-3 text-left">Offer Price</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {currentPackages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={!!formData.package[pkg._id]}
                            onChange={() => handlePackageToggle(pkg)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </td>

                        <td className="px-4 py-3">{pkg.name}</td>
                        <td className="px-4 py-3">{pkg.basePrice ?? "N/A"}</td>

                        {["price", "retailerPrice", "offerPrice"].map((field) => (
                          <td key={field} className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              value={formData.package[pkg._id]?.[field] || ""}
                              onChange={(e) =>
                                handlePackagePriceChange(pkg._id, field, e.target.value)
                              }
                              disabled={!formData.package[pkg._id]}
                              required={field === "price" && !!formData.package[pkg._id]}
                              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/pricebook/list")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}