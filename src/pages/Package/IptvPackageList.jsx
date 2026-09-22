// import React, { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import { getIptvPackageList } from "../../service/package"; 
// import toast from "react-hot-toast";
// import * as XLSX from "xlsx";

// export default function IptvList() {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedSearch, setAppliedSearch] = useState("");

//   // Fetch IPTV packages
//   useEffect(() => {
//     const loadPackages = async () => {
//       try {
//         const res = await getIptvPackageList();
//         if (res.status && res.data) {
//           const normalized = res.data.map((pkg) => ({
//             ...pkg,
//             status: pkg.status === "active" || pkg.status === true ? "active" : "inActive",
//           }));
//           setPackages(normalized);
//         } else {
//           throw new Error(res.message || "Invalid response");
//         }
//       } catch (err) {
//         console.error("Error fetching IPTV packages:", err);
//         setError("Failed to load IPTV packages");
//         toast.error(err.message || "Failed to load IPTV packages");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPackages();
//   }, []);

//   const handleSearch = () => {
//     setAppliedSearch(searchTerm.toLowerCase());
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const exportToExcel = () => {
//     if (packages.length === 0) {
//       toast.error("No IPTV package data to export");
//       return;
//     }

//     const exportData = packages.map((pkg, index) => ({
//       "S.No": index + 1,
//       "Package Name": pkg.name || "",
//       "IPTV Plan": pkg.iptvPlanName || pkg.planName || "—", // Adjust field name if different
//       Validity: `${pkg.validity?.number || ""} ${pkg.validity?.unit || ""}`,
//       "Base Price": pkg.basePrice || "—",
//       "Offer Price": pkg.offerPrice || pkg.basePrice || "—",
//       Status: pkg.status === "active" ? "Active" : "Inactive",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "IPTV Packages");
//     XLSX.writeFile(workbook, "iptv_packages.xlsx");
//     toast.success("IPTV packages exported successfully!");
//   };

//   const displayedPackages = packages.filter((pkg) =>
//     pkg.name?.toLowerCase().includes(appliedSearch) ||
//     pkg.iptvPlanName?.toLowerCase().includes(appliedSearch) ||
//     pkg.planName?.toLowerCase().includes(appliedSearch)
//   );

//   if (loading) return <p className="p-6 text-center">Loading IPTV packages...</p>;
//   if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">IPTV Package List</h1>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
//           {/* Search */}
//           <div className="flex">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Search by name or plan..."
//               className="px-4 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
//             >
//               <FaSearch />
//             </button>
//           </div>

//           {/* Export Excel */}
//           <button
//             onClick={exportToExcel}
//             className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
//           >
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Results Info */}
//       {/* {displayedPackages.length > 0 && (
//         <p className="text-sm text-gray-600 mb-6">
//           Showing {displayedPackages.length} IPTV package{displayedPackages.length !== 1 ? "s" : ""}
//         </p>
//       )} */}

//       {displayedPackages.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-lg text-gray-500">
//             {appliedSearch ? "No IPTV packages match your search." : "No IPTV packages found."}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table - Compact with reduced row height */}
//           <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">S.No</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Package Name</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">IPTV Plan</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Validity</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Category of plan</th>
//                     {/* <th className="px-6 py-3 text-left font-medium text-gray-700">Offer Price</th> */}
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {displayedPackages.map((pkg, index) => (
//                     <tr key={pkg._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-2 text-gray-600">{index + 1}</td>
//                       <td className="px-4 py-2 font-medium text-gray-900">{pkg.name}</td>
//                       <td className="px-4 py-2 text-gray-700">{pkg.iptvPlanName || pkg.planName || "—"}</td>
//                       <td className="px-4 py-2 text-gray-700">
//                         {pkg.validity?.number} {pkg.validity?.unit}
//                       </td>
//                     <td className="px-4 py-2 text-gray-700">{pkg.categoryOfPlan || "—"}</td>
//                       <td className="px-4 py-2">
//                         <span
//                           className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
//                             pkg.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {pkg.status === "active" ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Responsive Grid View - Mobile & Tablet */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
//             {displayedPackages.map((pkg, index) => (
//               <div
//                 key={pkg._id}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       pkg.status === "active"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {pkg.status === "active" ? "Active" : "Inactive"}
//                   </span>
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>

//                 <div className="space-y-3 text-sm text-gray-700">
//                   <div className="flex justify-between">
//                     <span className="font-medium">IPTV Plan:</span>
//                     <span>{pkg.iptvPlanName || pkg.planName || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Validity:</span>
//                     <span>{pkg.validity?.number} {pkg.validity?.unit}</span>
//                   </div>
//                   {/* <div className="flex justify-between">
//                     <span className="font-medium">Base Price:</span>
//                     <span>₹{pkg.basePrice || "—"}</span>
//                   </div> */}
//                   {/* <div className="flex justify-between">
//                     <span className="font-medium">Offer Price:</span>
//                     <span>₹{pkg.offerPrice || pkg.basePrice || "—"}</span>
//                   </div> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getIptvPackageListFromThirdParty } from "../../service/package";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function IptvList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const res = await getIptvPackageListFromThirdParty();
        if (res && Array.isArray(res)) {
          setPackages(res);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Error fetching IPTV packages:", err);
        setError("Failed to load IPTV packages");
        toast.error(err.message || "Failed to load IPTV packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const handleSearch = () => {
    setAppliedSearch(searchTerm.toLowerCase().trim());
    setCurrentPage(1); // Reset pagination on search
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const exportToExcel = () => {
    if (packages.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = packages.map((pkg, index) => ({
      "S.No": index + 1,
      "Name": pkg.plan_name || "—",
      "Validity": pkg.plan_period ? `${pkg.plan_period} Days` : "—",
      "Price": pkg.customer_price ? `₹${pkg.customer_price}` : "—",
      "Code": pkg.plan_code || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IPTV Packages");
    XLSX.writeFile(workbook, "iptv_packages.xlsx");
    toast.success("Exported successfully!");
  };

  // Filter Data
  const displayedPackages = packages.filter((pkg) =>
    pkg.plan_name?.toLowerCase().includes(appliedSearch) ||
    pkg.plan_code?.toLowerCase().includes(appliedSearch) ||
    pkg.plan_cat?.toLowerCase().includes(appliedSearch)
  );

  // Pagination Logic
  const totalPages = Math.ceil(displayedPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = displayedPackages.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p className="p-6 text-center text-lg">Loading IPTV packages...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" onClick={() => setOpenMenuId(null)}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">IPTV Packages List</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name, code, or category..."
              className="px-4 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[280px]"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </div>

            <button
              onClick={exportToExcel}
              className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Export Excel
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap flex items-center gap-2"
            >
              <span>+</span> Add IPTV Packages
            </button>
            <button
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
            >
              Upd. Package
            </button>
          </div>
        </div>

      {displayedPackages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-500">
            {appliedSearch ? "No matching IPTV packages found." : "No IPTV packages available."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Validity</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Code</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((pkg, index) => (
                    <tr key={pkg.plan_Id || index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-600">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{pkg.plan_name || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{pkg.plan_period ? `${pkg.plan_period} Days` : "—"}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {pkg.customer_price ? `₹${pkg.customer_price}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{pkg.plan_code || "—"}</td>
                      <td className="px-4 py-3 text-center relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(pkg.plan_Id);
                          }}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-full focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openMenuId === pkg.plan_Id && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 mt-0 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 flex items-center gap-2">
                              <span>✏️</span> Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
            {currentItems.map((pkg, index) => (
              <div key={pkg.plan_Id || index} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-500">#{startIndex + index + 1}</span>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(`mobile-${pkg.plan_Id}`);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {openMenuId === `mobile-${pkg.plan_Id}` && (
                      <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 flex items-center gap-2">
                          <span>✏️</span> Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={pkg.plan_name}>
                  {pkg.plan_name || "Unnamed Plan"}
                </h3>
                <div className="text-xs font-mono text-gray-500 mb-4 truncate">{pkg.plan_code || "—"}</div>

                <div className="space-y-2.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Validity:</span>
                    <span>{pkg.plan_period ? `${pkg.plan_period} Days` : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Price:</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.customer_price ? `₹${pkg.customer_price}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
            <span className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(startIndex + itemsPerPage, displayedPackages.length)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{displayedPackages.length}</span> entries
            </span>

            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add IPTV Packages Modal (Static UI) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add IPTV Package</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Type</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter Provider Type" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter Provider Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter API Key" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login ID</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter Login ID" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}