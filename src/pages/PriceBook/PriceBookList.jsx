// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaEllipsisV,
//   FaSearch,
// } from "react-icons/fa";
// import ProtectedAction from "../../components/ProtectedAction";
// import { getPriceBookList, deletePriceBook } from "../../service/pricebook";
// import toast from "react-hot-toast"; // Using react-hot-toast for consistency
// import * as XLSX from "xlsx";

// export default function PriceBookList() {
//   const navigate = useNavigate();
//   const [priceBooks, setPriceBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedSearch, setAppliedSearch] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);

//   // Pagination (optional - keep if backend supports it)
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;

//   // Fetch price books
//   const fetchPriceBooks = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getPriceBookList(page, limit, appliedSearch);
//       if (res?.data) {
//         setPriceBooks(res.data);
//         setTotalPages(res.totalPages || 1);
//       } else {
//         throw new Error("Invalid response");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load price books");
//       toast.error("Failed to load price books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPriceBooks();
//   }, [page, appliedSearch]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => setOpenMenuId(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const toggleMenu = (id) => {
//     setOpenMenuId((prev) => (prev === id ? null : id));
//   };

//   const handleView = (id) => {
//     navigate(`/pricebook/view/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleEdit = (id) => {
//     navigate(`/pricebook/update/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleDelete = async (id, name) => {
//     if (!window.confirm(`Delete price book "${name}" permanently?`)) {
//       setOpenMenuId(null);
//       return;
//     }

//     try {
//       const res = await deletePriceBook(id);
//       if (res?.success || res?.status) {
//         setPriceBooks((prev) => prev.filter((pb) => pb._id !== id));
//         toast.success("Price book deleted successfully");
//       } else {
//         toast.error(res?.message || "Delete failed");
//       }
//     } catch (err) {
//       toast.error("Failed to delete price book");
//     }
//     setOpenMenuId(null);
//   };

//   const handleSearch = () => {
//     setAppliedSearch(searchTerm.trim().toLowerCase());
//     setPage(1);
//   };

//   const exportToExcel = () => {
//     if (priceBooks.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const data = priceBooks.map((pb, i) => ({
//       "S.No": (page - 1) * limit + i + 1,
//       "Price Book Name": pb.priceBookName,
//       "From Date": new Date(pb.fromDate).toLocaleDateString(),
//       "To Date": new Date(pb.toDate).toLocaleDateString(),
//       Status: pb.status,
//       Description: pb.description || "-",
//       "Price Book For": pb.priceBookFor?.join(", ") || "-",
//       Packages: pb.package?.map((p) => p.name).join(", ") || "-",
//       "Assigned Resellers": pb.assignedTo?.length || 0,
//       "Created At": new Date(pb.createdAt).toLocaleString(),
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Price Books");
//     XLSX.writeFile(wb, "price_books.xlsx");
//     toast.success("Exported successfully!");
//   };

//   // Filtered data (client-side fallback if backend doesn't filter)
//   const displayedBooks = priceBooks.filter((pb) =>
//     pb.priceBookName.toLowerCase().includes(appliedSearch)
//   );

//   if (loading) return <p className="p-6 text-gray-600">Loading price books...</p>;
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-800 leading-tight">
//             Price Book

//           </h1>
//         </div>

//         {/* Search + Buttons */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//           <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//               placeholder="Search price books..."
//               className="px-4 py-2 text-sm outline-none min-w-64"
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
//             >
//               <FaSearch />
//             </button>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={exportToExcel}
//               className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
//             >
//               Download as Excel
//             </button>

//             <ProtectedAction module="pricebook" action="create">
//               <button
//                 onClick={() => navigate("/pricebook/create")}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
//               >
//                 Add Price Book
//               </button>
//             </ProtectedAction>
//           </div>
//         </div>
//       </div>

//       {/* Table View - Desktop */}
//       {displayedBooks.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           <p className="text-lg">
//             {appliedSearch ? "No matching price books found." : "No price books available."}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[1000px] text-sm">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">S.No</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Price Book Name</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">From Date</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">To Date</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Description</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Price Book For</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Packages</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Assigned To</th>
//                     <th className="px-6 py-4 text-left font-medium text-gray-700">Created At</th>
//                     <th className="px-6 py-4 text-center font-medium text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {displayedBooks.map((pb, index) => (
//                     <tr key={pb._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 text-gray-600">
//                         {(page - 1) * limit + index + 1}
//                       </td>
//                       <td
//                         className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer"
//                         onClick={() => handleView(pb._id)}
//                       >
//                         {pb.priceBookName}
//                       </td>
//                       <td className="px-6 py-4">{new Date(pb.fromDate).toLocaleDateString()}</td>
//                       <td className="px-6 py-4">{new Date(pb.toDate).toLocaleDateString()}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             pb.status === "Active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {pb.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 max-w-xs truncate">{pb.description || "-"}</td>
//                       <td className="px-6 py-4">{pb.priceBookFor?.join(", ") || "-"}</td>
//                       <td className="px-6 py-4">{pb.package?.map((p) => p.name).join(", ") || "-"}</td>
//                       <td className="px-6 py-4">{pb.assignedTo?.length || 0} reseller(s)</td>
//                       <td className="px-6 py-4 text-xs">
//                         {new Date(pb.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 text-center relative">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleMenu(pb._id);
//                           }}
//                           className="p-2.5 hover:bg-gray-200 rounded-full transition"
//                         >
//                           <FaEllipsisV className="text-gray-600" />
//                         </button>

//                         {openMenuId === pb._id && (
//                           <div
//                             className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <ProtectedAction module="pricebook" action="view">
//                               <button
//                                 onClick={() => handleView(pb._id)}
//                                 className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
//                               >
//                                 <FaEye className="text-blue-600" /> View
//                               </button>
//                             </ProtectedAction>

//                             <ProtectedAction module="pricebook" action="edit">
//                               <button
//                                 onClick={() => handleEdit(pb._id)}
//                                 className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
//                               >
//                                 <FaEdit className="text-green-600" /> Edit
//                               </button>
//                             </ProtectedAction>

//                             <ProtectedAction module="pricebook" action="delete">
//                               <button
//                                 onClick={() => handleDelete(pb._id, pb.priceBookName)}
//                                 className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
//                               >
//                                 <FaTrash /> Delete
//                               </button>
//                             </ProtectedAction>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile Card View */}
//           <div className="md:hidden space-y-4 mt-6">
//             {displayedBooks.map((pb, index) => (
//               <div
//                 key={pb._id}
//                 className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-500">
//                       #{(page - 1) * limit + index + 1}
//                     </p>
//                     <h3
//                       className="font-medium text-lg mt-1 text-blue-600 cursor-pointer"
//                       onClick={() => handleView(pb._id)}
//                     >
//                       {pb.priceBookName}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {new Date(pb.fromDate).toLocaleDateString()} –{" "}
//                       {new Date(pb.toDate).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm">
//                       <strong>Status:</strong> {pb.status}
//                     </p>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleMenu(pb._id);
//                     }}
//                     className="p-2 hover:bg-gray-100 rounded-full"
//                   >
//                     <FaEllipsisV className="text-gray-600" />
//                   </button>
//                 </div>

//                 {openMenuId === pb._id && (
//                   <div className="mt-4 border-t pt-4">
//                     <ProtectedAction module="pricebook" action="view">
//                       <button
//                         onClick={() => handleView(pb._id)}
//                         className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                       >
//                         <FaEye /> View
//                       </button>
//                     </ProtectedAction>

//                     <ProtectedAction module="pricebook" action="edit">
//                       <button
//                         onClick={() => handleEdit(pb._id)}
//                         className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                       >
//                         <FaEdit /> Edit
//                       </button>
//                     </ProtectedAction>

//                     <ProtectedAction module="pricebook" action="delete">
//                       <button
//                         onClick={() => handleDelete(pb._id, pb.priceBookName)}
//                         className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </ProtectedAction>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Optional Pagination (uncomment if needed) */}
//       {/* {totalPages > 1 && (
//         <div className="flex justify-center mt-8 gap-3">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )} */}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getPriceBookList, deletePriceBook, updatePriceBook } from "../../service/pricebook";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function PriceBookList() {
  const navigate = useNavigate();
  const [priceBooks, setPriceBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // Empty by default
  const [appliedType, setAppliedType] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch price books
  const fetchPriceBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPriceBookList();
      if (res?.data) {
        setPriceBooks(res.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load price books");
      toast.error("Failed to load price books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceBooks();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleView = (id) => {
    navigate(`/pricebook/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/pricebook/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete price book "${name}" permanently?`)) {
      setOpenMenuId(null);
      return;
    }

    try {
      const res = await deletePriceBook(id);
      if (res?.success || res?.status) {
        setPriceBooks((prev) => prev.filter((pb) => pb._id !== id));
        toast.success("Price book deleted successfully");
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete price book");
    }
    setOpenMenuId(null);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inActive" : "active";
    try {
      await updatePriceBook(id, { status: newStatus });
      setPriceBooks((prev) =>
        prev.map((pb) => (pb._id === id ? { ...pb, status: newStatus } : pb))
      );
      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
    setOpenMenuId(null);
  };

  const handleSearch = () => {
    setAppliedType(selectedType); // Apply selected type (or empty)
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  const exportToExcel = () => {
    if (displayedBooks.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = displayedBooks.map((pb, i) => ({
      "S.No": i + 1,
      "Price Book Name": pb.priceBookName,
      "From Date": new Date(pb.fromDate).toLocaleDateString("en-GB"), // DD/MM/YYYY
      "To Date": new Date(pb.toDate).toLocaleDateString("en-GB"),
      Status: pb.status,
      Description: pb.description || "-",
      "Price Book For": pb.priceBookFor?.join(", ") || "-",
      Packages: pb.package?.map((p) => p.name).join(", ") || "-",
      "Assigned Count": pb.assignedTo?.length || 0,
      "Created At": new Date(pb.createdAt).toLocaleDateString("en-GB"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Price Books");
    XLSX.writeFile(wb, "price_books.xlsx");
    toast.success("Exported successfully!");
  };

  // Correct filtering logic
  const displayedBooks = priceBooks.filter((pb) => {
    // Filter by type (Reseller or LCO) if selected
    const typeMatch = appliedType ? pb.priceBookFor.includes(appliedType) : true;

    // Search by assigned name (resellerName or lcoName)
    const nameMatch = appliedSearch
      ? pb.assignedTo?.some((assign) => {
        // Handle both cases: string ID or object with name
        if (typeof assign === "string") return false; // Skip raw IDs
        const name = assign.resellerName || assign.lcoName || "";
        return name.toLowerCase().includes(appliedSearch);
      })
      : true;

    return typeMatch && nameMatch;
  });

  if (loading) return <p className="p-6 text-gray-600 text-center">Loading price books...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Price Books</h1>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 text-sm bg-gray-50 border-r border-gray-300 outline-none"
            >
              <option value="">All Types</option>
              <option value="Reseller">Reseller</option>
              <option value="Lco">LCO</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                selectedType
                  ? `Search ${selectedType === "Lco" ? "LCO" : "Reseller"} name...`
                  : "First select type to search by name"
              }
              disabled={!selectedType} // Disable until type is selected
              className="px-4 py-3 text-sm outline-none min-w-72 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FaSearch className="text-lg" />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              Download Excel
            </button>

            <ProtectedAction module="pricebook" action="create">
              <button
                onClick={() => navigate("/pricebook/create")}
                className="px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Add Price Book
              </button>
            </ProtectedAction>
          </div>
        </div>
      </div>

      {/* Table */}
      {displayedBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-500">
            {appliedSearch || appliedType
              ? "No price books found matching your search."
              : "No price books available yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">S.No</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Price Book Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">From Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">To Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Packages</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Assigned</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Modified By</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Modified Date</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedBooks.map((pb, index) => (
                    <tr key={pb._id} className="hover:bg-blue-50 transition duration-200">
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td
                        className="px-6 py-4 font-medium text-black hover:text-blue-600 hover:underline cursor-pointer transition"
                        onClick={() => handleView(pb._id)}
                      >
                        {pb.priceBookName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(pb.fromDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(pb.toDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${pb.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {pb.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 text-gray-700">
                        {pb.priceBookFor?.join(", ") || "-"}
                      </td> */}
                      <td className="px-6 py-4 text-gray-700">
                        {pb.package?.map((p) => p.name).join(", ") || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {(() => {
                          if (!pb.assignedTo || pb.assignedTo.length === 0) return "-";

                          const resellerCount = pb.assignedTo.filter(a => a.resellerName).length;
                          const lcoCount = pb.assignedTo.filter(a => a.lcoName).length;

                          const parts = [];
                          if (resellerCount) parts.push(`Reseller (${resellerCount})`);
                          if (lcoCount) parts.push(`Lco (${lcoCount})`);

                          return parts.join(", ");
                        })()}
                      </td>
                      {/* <td className="px-6 py-4 text-gray-700">
                        {pb.assignedTo?.length || 0}
                      </td> */}
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {new Date(pb.createdAt).toLocaleDateString("en-GB")}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {pb.modifiedBy || pb.modifiedById?.name || "-"}
                      </td>


                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {pb.updatedAt ? new Date(pb.updatedAt).toLocaleDateString("en-GB") : "-"}
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(pb._id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full transition"
                        >
                          <FaEllipsisV className="text-gray-600" />
                        </button>

                        {openMenuId === pb._id && (
                          <div
                            className="absolute right-4 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ProtectedAction module="pricebook" action="view">
                              <button
                                onClick={() => handleView(pb._id)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEye className="text-blue-600" /> View
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="pricebook" action="edit">
                              <button
                                onClick={() => handleEdit(pb._id)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-green-600" /> Edit
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="pricebook" action="edit">
                              <button
                                onClick={() => handleToggleStatus(pb._id, pb.status)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-yellow-600" />
                                {pb.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="pricebook" action="delete">
                              <button
                                onClick={() => handleDelete(pb._id, pb.priceBookName)}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                              >
                                <FaTrash /> Delete
                              </button>
                            </ProtectedAction>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {displayedBooks.map((pb, index) => (
              <div
                key={pb._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                    <h3
                      className="text-lg font-semibold text-black hover:text-blue-600 cursor-pointer"
                      onClick={() => handleView(pb._id)}
                    >
                      {pb.priceBookName}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(pb._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaEllipsisV />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Dates:</strong>{" "}
                    {new Date(pb.fromDate).toLocaleDateString("en-GB")} →{" "}
                    {new Date(pb.toDate).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${pb.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {pb.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p>
                    <strong>Type:</strong> {pb.priceBookFor?.join(", ")}
                  </p>
                  <p>
                    <strong>Assigned:</strong> {pb.assignedTo?.length || 0}
                  </p>
                </div>

                {openMenuId === pb._id && (
                  <div className="mt-4 pt-4 border-t space-y-1">
                    <ProtectedAction module="pricebook" action="view">
                      <button
                        onClick={() => handleView(pb._id)}
                        className="w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaEye /> View
                      </button>
                    </ProtectedAction>
                    <ProtectedAction module="pricebook" action="edit">
                      <button
                        onClick={() => handleEdit(pb._id)}
                        className="w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                    </ProtectedAction>
                    <ProtectedAction module="pricebook" action="edit">
                      <button
                        onClick={() => handleToggleStatus(pb._id, pb.status)}
                        className="w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaEdit /> {pb.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </ProtectedAction>
                    <ProtectedAction module="pricebook" action="delete">
                      <button
                        onClick={() => handleDelete(pb._id, pb.priceBookName)}
                        className="w-full text-left py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </ProtectedAction>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}