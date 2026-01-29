// import React, { useEffect, useState } from "react";
// import {
//   FaSearch,
// } from "react-icons/fa";
// import { getOttPackageList } from "../../service/package";
// import toast from "react-hot-toast";
// import * as XLSX from "xlsx";

// export default function OttList() {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedSearch, setAppliedSearch] = useState("");

//   // Fetch OTT packages
//   useEffect(() => {
//     const loadPackages = async () => {
//       try {
//         const res = await getOttPackageList();
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
//         console.error("Error fetching OTT packages:", err);
//         setError("Failed to load OTT packages");
//         toast.error(err.message || "Failed to load OTT packages");
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

//   const displayedPackages = packages.filter(
//     (pkg) =>
//       pkg.name?.toLowerCase().includes(appliedSearch) ||
//       pkg.ottPlanName?.toLowerCase().includes(appliedSearch)
//   );

//   if (loading) return <p className="p-6 text-center">Loading OTT packages...</p>;
//   if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">OTT Package List</h1>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
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
//           Showing {displayedPackages.length} OTT package{displayedPackages.length !== 1 ? "s" : ""}
//         </p>
//       )} */}

//       {displayedPackages.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-lg text-gray-500">
//             {appliedSearch ? "No OTT packages match your search." : "No OTT packages found."}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table - Hidden on small screens */}
//           <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">S.No</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Package Name</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">OTT Plan</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Validity</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Category of Plan</th>
//                     <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {displayedPackages.map((pkg, index) => (
//                     <tr key={pkg._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-2">{index + 1}</td>
//                       <td className="px-4 py-2 font-medium text-gray-900">{pkg.name}</td>
//                       <td className="px-4 py-2 text-gray-700">{pkg.ottPlanName || "—"}</td>
//                       <td className="px-4 py-2 text-gray-700">
//                         {pkg.validity?.number} {pkg.validity?.unit}
//                       </td>
//                       <td className="px-4 py-2 text-gray-700">{pkg.categoryOfPlan || "—"}</td>
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

//           {/* Responsive Grid View - Visible on all screens, optimized for mobile/tablet */}
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
//                     <span className="font-medium">OTT Plan:</span>
//                     <span>{pkg.ottPlanName || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Validity:</span>
//                     <span>{pkg.validity?.number} {pkg.validity?.unit}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Base Price:</span>
//                     <span>₹{pkg.basePrice || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Offer Price:</span>
//                     <span>₹{pkg.offerPrice || pkg.basePrice || "—"}</span>
//                   </div>
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
import { getOttPackageList } from "../../service/package"; // adjust if needed
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function OttList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editOfferPrice, setEditOfferPrice] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getOttPackageList();
        if (res?.status && res?.data) {
          setPackages(res.data);
        }
      } catch (err) {
        toast.error("Failed to load packages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const handleSearch = () => {
    setAppliedSearch(searchTerm.toLowerCase().trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Open edit modal with current prices
  const openEdit = (pkg) => {
    setEditingPkg(pkg);
    setEditBasePrice(pkg.ottPackageId?.marketPrice || "");
    setEditOfferPrice("");
    setEditModalOpen(true);
  };

  // Save updated prices (demo - connect real API later)
  const savePrice = () => {
    if (!editingPkg) return;

    // Update local state (simulation)
    setPackages((prev) =>
      prev.map((p) =>
        p._id === editingPkg._id
          ? {
              ...p,
              basePrice: Number(editBasePrice) || p.basePrice,
              offerPrice: Number(editOfferPrice) || p.offerPrice,
            }
          : p
      )
    );

    toast.success("Price updated successfully (demo mode)");
    setEditModalOpen(false);
    setEditingPkg(null);
  };

  const filtered = packages.filter((pkg) =>
    appliedSearch
      ? pkg.ottPackageId?.name?.toLowerCase().includes(appliedSearch) ||
        pkg.ottType?.toLowerCase().includes(appliedSearch)
      : true
  );

  const exportExcel = () => {
    if (!filtered.length) return toast.error("No data to export");

    const data = filtered.map((pkg, i) => ({
      "S.NO": i + 1,
      "PACKAGE NAME": pkg.ottPackageId?.name || pkg.name || "—",
      AMOUNT: pkg.ottPackageId?.marketPrice ? `₹${pkg.ottPackageId.marketPrice}` : "—",
      VALIDITY: pkg.ottPackageId?.validity
        ? `${pkg.ottPackageId.validity.number} ${pkg.ottPackageId.validity.unit}`
        : "—",
      PROVIDER: pkg.ottType || "—",
      "PACKAGES INCLUDED": pkg.ottPackageId?.ottProviders
        ?.map((p) => p.name)
        .join(", ") || "—",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OTT Packages");
    XLSX.writeFile(wb, "ott_packages.xlsx");
    toast.success("Exported successfully!");
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading packages...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">OTT Package List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by package or provider..."
              className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </div>
          <button
            onClick={exportExcel}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left">S.NO</th>
                <th className="px-6 py-4 text-left">PACKAGE NAME</th>
                <th className="px-6 py-4 text-left">AMOUNT</th>
                <th className="px-6 py-4 text-left">VALIDITY</th>
                <th className="px-6 py-4 text-left">PROVIDER</th>
                <th className="px-6 py-4 text-left">PACKAGES INCLUDED</th>
                <th className="px-6 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((pkg, index) => (
                <tr key={pkg._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">
                    {pkg.ottPackageId?.name || pkg.name || "—"}
                  </td>
                  <td className="px-6 py-4">
                    ₹{pkg.ottPackageId?.marketPrice || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {pkg.ottPackageId?.validity?.number || "—"}{" "}
                    {pkg.ottPackageId?.validity?.unit || ""}
                  </td>
                  <td className="px-6 py-4">{pkg.ottType || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="max-h-32 overflow-auto whitespace-normal break-words">
                      {pkg.ottPackageId?.ottProviders
                        ?.map((p) => p.name)
                        .join(", ") || "No providers listed"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="text-gray-600 hover:text-blue-600 focus:outline-none"
                      >
                        <FaEllipsisV className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((pkg, index) => (
          <div key={pkg._id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
              <button
                onClick={() => openEdit(pkg)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-3">
              {pkg.ottPackageId?.name || pkg.name || "Unnamed"}
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Amount:</span>{" "}
                ₹{pkg.ottPackageId?.marketPrice || "—"}
              </div>
              <div>
                <span className="font-medium">Validity:</span>{" "}
                {pkg.ottPackageId?.validity?.number || "—"}{" "}
                {pkg.ottPackageId?.validity?.unit || ""}
              </div>
              <div>
                <span className="font-medium">Provider:</span> {pkg.ottType || "—"}
              </div>
              <div>
                <span className="font-medium block mb-1">Packages Included:</span>
                <div className="max-h-32 overflow-auto text-gray-700 whitespace-normal break-words">
                  {pkg.ottPackageId?.ottProviders
                    ?.map((p) => p.name)
                    .join(", ") || "No providers listed"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Price Modal */}
      {editModalOpen && editingPkg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-5">
              Edit Price - {editingPkg.ottPackageId?.name || editingPkg.name}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price (₹) - optional
                </label>
                <input
                  type="number"
                  value={editOfferPrice}
                  onChange={(e) => setEditOfferPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={savePrice}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {!filtered.length && !loading && (
        <div className="text-center py-16 text-gray-600 bg-white rounded-lg shadow mt-8">
          No packages found matching your search.
        </div>
      )}
    </div>
  );
}