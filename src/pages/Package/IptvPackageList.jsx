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
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { getIptvPackageList } from "../../service/package";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function IptvList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getIptvPackageList();
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
    setAppliedSearch(searchTerm.toLowerCase());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const exportToExcel = () => {
    if (packages.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = packages.map((pkg, index) => ({
      "S.No": index + 1,
      "IPTV Plan": pkg.iptvPackageId?.plan_name || "—",
      "Provider": pkg.iptvType || "—",
      "Plan Code": pkg.iptvPackageId?.plan_code || "—",
      "Customer Price": pkg.iptvPackageId?.customer_price
        ? `₹${Number(pkg.iptvPackageId.customer_price).toFixed(2)}`
        : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IPTV Packages");
    XLSX.writeFile(workbook, "iptv_packages.xlsx");
    toast.success("Exported successfully!");
  };

  const displayedPackages = packages.filter((pkg) =>
    pkg.iptvPackageId?.plan_name?.toLowerCase().includes(appliedSearch) ||
    pkg.iptvType?.toLowerCase().includes(appliedSearch) ||
    pkg.iptvPackageId?.plan_code?.toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-center">Loading IPTV packages...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">IPTV Packages</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by plan name, provider, code..."
              className="px-4 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </div>

          <button
            onClick={exportToExcel}
            className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Export Excel
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
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Package Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Package Included</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedPackages.map((pkg, index) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {pkg.iptvPackageId?.plan_name || "—"}
                      </td>
                       <td className="px-4 py-3 text-gray-700 font-medium">
                        {pkg.iptvPackageId?.customer_price
                          ? `₹${Number(pkg.iptvPackageId.customer_price).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{pkg.iptvType || "—"}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">
                        {pkg.iptvPackageId?.plan_code || "—"}
                      </td>
                     
                      <td className="px-4 py-3 text-center">
                        <button className="text-gray-600 hover:text-blue-600 transition">
                          <FaEllipsisV />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
            {displayedPackages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <button className="text-gray-600 hover:text-blue-600">
                    <FaEllipsisV />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-4 truncate">
                  {pkg.iptvPackageId?.plan_name || "Unnamed Plan"}
                </h3>

                <div className="space-y-2.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Provider:</span>
                    <span>{pkg.iptvType || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Plan Code:</span>
                    <span className="text-right font-mono">{pkg.iptvPackageId?.plan_code || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Customer Price:</span>
                    <span className="font-semibold">
                      {pkg.iptvPackageId?.customer_price
                        ? `₹${Number(pkg.iptvPackageId.customer_price).toFixed(2)}`
                        : "—"}
                    </span>
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