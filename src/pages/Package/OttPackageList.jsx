// import React, { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import toast from "react-hot-toast";
// import * as XLSX from "xlsx";

// import { getOttPackageList } from "../../service/package";

// const ITEMS_PER_PAGE = 10;

// export default function OttList() {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedSearch, setAppliedSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch OTT packages
//   useEffect(() => {
//     const fetchOttPackages = async () => {
//       try {
//         const res = await getOttPackageList();

//         if (res.status && res.data) {
//           setPackages(res.data);
//         } else {
//           throw new Error(res.message || "Invalid response");
//         }
//       } catch (err) {
//         console.error("Error fetching OTT packages:", err);
//         toast.error(err.message || "Failed to load OTT packages");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOttPackages();
//   }, []);

//   const handleSearch = () => {
//     setAppliedSearch(searchTerm.toLowerCase());
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const exportToExcel = () => {
//     if (packages.length === 0) {
//       toast.error("No OTT package data to export");
//       return;
//     }

//     const exportData = packages.map((pkg, index) => ({
//       "S.No": index + 1,
//       "Package Name": pkg.name || "",
//       "OTT Plan": pkg.ottPlanName || "—",
//       Validity: `${pkg.validity?.number || ""} ${pkg.validity?.unit || ""}`,
//       "Base Price": pkg.basePrice || "—",
//       "Offer Price": pkg.offerPrice || pkg.basePrice || "—",
//       Status: pkg.status === "active" ? "Active" : "Inactive",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "OTT Packages");
//     XLSX.writeFile(workbook, "ott_packages.xlsx");
//     toast.success("OTT packages exported successfully!");
//   };

//   // Filter packages based on search
//   const filteredPackages = packages.filter(
//     (pkg) =>
//       pkg.name?.toLowerCase().includes(appliedSearch) ||
//       pkg.ottPlanName?.toLowerCase().includes(appliedSearch)
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   if (loading) {
//     return <p className="p-6 text-center text-gray-600">Loading OTT packages...</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">OTT Package List</h1>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
//           {/* Search */}
//           <div className="flex">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Search by name or OTT plan..."
//               className="px-4 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
//             >
//               <FaSearch />
//             </button>
//           </div>

//           {/* Export Button */}
//           <button
//             onClick={exportToExcel}
//             className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
//           >
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Results Info */}
//       {filteredPackages.length > 0 && (
//         <p className="text-sm text-gray-600 mb-4">
//           Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPackages.length)} of{" "}
//           {filteredPackages.length} OTT packages
//         </p>
//       )}

//       {/* Empty State */}
//       {filteredPackages.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-lg text-gray-500">
//             {appliedSearch
//               ? "No OTT packages match your search."
//               : "No OTT packages found."}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">S.No</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Package Name</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">OTT Plan</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Validity</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Base Price</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Offer Price</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {paginatedPackages.map((pkg, index) => (
//                     <tr key={pkg._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">{startIndex + index + 1}</td>
//                       <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
//                       <td className="px-6 py-4 text-gray-700">{pkg.ottPlanName || "—"}</td>
//                       <td className="px-6 py-4 text-gray-700">
//                         {pkg.validity?.number} {pkg.validity?.unit}
//                       </td>
//                       <td className="px-6 py-4 text-gray-700">₹{pkg.basePrice || "—"}</td>
//                       <td className="px-6 py-4 text-gray-700">
//                         ₹{pkg.offerPrice || pkg.basePrice || "—"}
//                       </td>
//                       <td className="px-6 py-4">
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

//             {/* Pagination - Desktop */}
//             {totalPages > 1 && (
//               <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                   Previous
//                 </button>
//                 <span className="text-sm text-gray-700">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Cards */}
//           <div className="md:hidden space-y-4">
//             {paginatedPackages.map((pkg, index) => (
//               <div
//                 key={pkg._id}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <span className="text-sm text-gray-500">#{startIndex + index + 1}</span>
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

//                 <h3 className="text-lg font-bold text-blue-700 mb-3">{pkg.name}</h3>

//                 <div className="space-y-2 text-sm text-gray-600">
//                   <p>
//                     <strong>OTT Plan:</strong> {pkg.ottPlanName || "—"}
//                   </p>
//                   <p>
//                     <strong>Validity:</strong> {pkg.validity?.number} {pkg.validity?.unit}
//                   </p>
//                   <p>
//                     <strong>Base Price:</strong> ₹{pkg.basePrice || "—"}
//                   </p>
//                   <p>
//                     <strong>Offer Price:</strong> ₹{pkg.offerPrice || pkg.basePrice || "—"}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {/* Pagination - Mobile */}
//             {totalPages > 1 && (
//               <div className="flex justify-center gap-3 mt-6">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 >
//                   Prev
//                 </button>
//                 <span className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded font-medium">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  FaSearch,
} from "react-icons/fa";
import { getOttPackageList } from "../../service/package";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function OttList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Fetch OTT packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getOttPackageList();
        if (res.status && res.data) {
          const normalized = res.data.map((pkg) => ({
            ...pkg,
            status: pkg.status === "active" || pkg.status === true ? "active" : "inActive",
          }));
          setPackages(normalized);
        } else {
          throw new Error(res.message || "Invalid response");
        }
      } catch (err) {
        console.error("Error fetching OTT packages:", err);
        setError("Failed to load OTT packages");
        toast.error(err.message || "Failed to load OTT packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const handleSearch = () => {
    setAppliedSearch(searchTerm.toLowerCase());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const exportToExcel = () => {
    if (packages.length === 0) {
      toast.error("No OTT package data to export");
      return;
    }

    const exportData = packages.map((pkg, index) => ({
      "S.No": index + 1,
      "Package Name": pkg.name || "",
      "OTT Plan": pkg.ottPlanName || "—",
      Validity: `${pkg.validity?.number || ""} ${pkg.validity?.unit || ""}`,
      "Base Price": pkg.basePrice || "—",
      "Offer Price": pkg.offerPrice || pkg.basePrice || "—",
      Status: pkg.status === "active" ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OTT Packages");
    XLSX.writeFile(workbook, "ott_packages.xlsx");
    toast.success("OTT packages exported successfully!");
  };

  const displayedPackages = packages.filter(
    (pkg) =>
      pkg.name?.toLowerCase().includes(appliedSearch) ||
      pkg.ottPlanName?.toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-center">Loading OTT packages...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">OTT Package List</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name or OTT plan..."
              className="px-4 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </div>

          {/* Export Excel */}
          <button
            onClick={exportToExcel}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Results Info */}
      {/* {displayedPackages.length > 0 && (
        <p className="text-sm text-gray-600 mb-6">
          Showing {displayedPackages.length} OTT package{displayedPackages.length !== 1 ? "s" : ""}
        </p>
      )} */}

      {displayedPackages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-500">
            {appliedSearch ? "No OTT packages match your search." : "No OTT packages found."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table - Hidden on small screens */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Package Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">OTT Plan</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Validity</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Category of Plan</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedPackages.map((pkg, index) => (
                    <tr key={pkg._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{pkg.name}</td>
                      <td className="px-4 py-2 text-gray-700">{pkg.ottPlanName || "—"}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {pkg.validity?.number} {pkg.validity?.unit}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{pkg.categoryOfPlan || "—"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            pkg.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pkg.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responsive Grid View - Visible on all screens, optimized for mobile/tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
            {displayedPackages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pkg.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pkg.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">OTT Plan:</span>
                    <span>{pkg.ottPlanName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Validity:</span>
                    <span>{pkg.validity?.number} {pkg.validity?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Base Price:</span>
                    <span>₹{pkg.basePrice || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Offer Price:</span>
                    <span>₹{pkg.offerPrice || pkg.basePrice || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}