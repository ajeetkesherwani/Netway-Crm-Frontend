// import { useEffect, useState, useRef } from "react";
// import { deleteRetailer, getRetailer } from "../../service/retailer";
// import { useNavigate } from "react-router-dom";
// import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import {
//   MdOutlineAccountBalanceWallet,
//   MdOutlineAssignment,
//   MdOutlineSupportAgent,
// } from "react-icons/md";
// import LcoList from "../LcoPage/LcoList";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function RetailerList() {
//   const [retailers, setRetailers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   // fetch retailers
//   useEffect(() => {
//     const loadRetailers = async () => {
//       try {
//         const res = await getRetailer();
//         setRetailers(res.data || []);
//       } catch (err) {
//         console.error("Error fetching retailers:", err);
//         setError("Failed to load retailers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadRetailers();
//   }, []);

//   // close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Handlers
//   const handleView = (id) => {
//     navigate(`/retailer/list/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleEdit = (id) => {
//     navigate(`/retailer/update/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this retailer?")) {
//       // TODO: Call delete API here
//       try {
//         await deleteRetailer(id);
//         setRetailers(retailers.filter((r) => r._id !== id));
//         setOpenMenuId(null);
//       } catch (err) {
//         console.error("Error deleting retailer:", err);
//         setError("Failed to delete retailer");
//       }
//     }
//   };
//   // asssign package to the retailer
//   const handleAssignPackage = (id) => {
//     navigate(`/retailer/assignPackage/list/${id}`);
//   };
//   // this is for handle the wallet of the retailer
//   const handleWallet = (id) => {
//     navigate(`/retailer/wallet/list/${id}`);
//   };
//   const handleEmployee = (id) => {
//     navigate(`/retailer/employee/list/${id}`);
//   };
//   if (loading) return <p className="p-4">Loading retailers...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   return (
//     <>
//       <div className="p-6">
//         <ProtectedAction module="reseller" action="create">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-xl font-semibold">Reseller List</h1>
//             <button
//               onClick={() => navigate("/retailer/create")}
//               className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
//             >
//               Add Reseller
//             </button>
//           </div>
//         </ProtectedAction>
//         {retailers.length === 0 ? (
//           <p className="text-gray-500">No retailers found.</p>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-[2px] py-[0px] text-left">S.No</th>
//                     <th className="px-[2px] py-[0px] text-left ">
//                       Reseller Name
//                     </th>
//                     <th className="px-[2px] py-[0px] text-left">Mobile No</th>
//                     <th className="px-[2px] py-[0px] text-left">State</th>
//                     <th className="px-[2px] py-[0px] text-left">Email</th>
//                     <th className="px-[2px] py-[0px] text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {retailers.map((retailer, index) => (
//                     <tr
//                       key={retailer._id}
//                       className="hover:bg-gray-50 relative"
//                     >
//                       <td className="px-[2px] py-[0px]">{index + 1}</td>
//                       <td
//                         className="px-[2px] py-[0px] hover:cursor-pointer hover:underline"
//                         onClick={() => handleView(retailer._id)}
//                       >
//                         {retailer.resellerName}
//                       </td>
//                       <td className="px-[2px] py-[0px]">{retailer.mobileNo}</td>
//                       <td className="px-[2px] py-[0px]">{retailer.state}</td>
//                       <td className="px-[2px] py-[0px]">
//                         {retailer.email || "—"}
//                       </td>
//                       <td className="px-[2px] py-[0px] text-left relative">
//                         <div className="flex items-center  gap-1">
//                           <ProtectedAction module="reseller" action="view">
//                             <button
//                               onClick={() => handleView(retailer._id)}
//                               className="p-1 text-gray-600 hover:text-blue-600 rounded"
//                               title="View"
//                             >
//                               <FaEye />
//                             </button>
//                           </ProtectedAction>

//                           <ProtectedAction module="reseller" action="edit">
//                             <button
//                               onClick={() => handleEdit(retailer._id)}
//                               className="p-1 text-gray-600 hover:text-green-600 rounded"
//                               title="Edit"
//                             >
//                               <FaEdit />
//                             </button>
//                           </ProtectedAction>
//                           <ProtectedAction module="reseller" action="delete">
//                             <button
//                               onClick={() => handleDelete(retailer._id)}
//                               className="p-1 text-red-600 hover:text-red-700 rounded"
//                               title="Delete"
//                             >
//                               <FaTrash />
//                             </button>
//                           </ProtectedAction>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* Mobile Card View */}
//             <div className="space-y-4 md:hidden">
//               {retailers.map((retailer, index) => (
//                 <div
//                   key={retailer._id}
//                   className="p-4 border rounded-lg shadow-sm bg-white"
//                 >
//                   <p className="text-sm text-gray-500">{index + 1}</p>
//                   <h2 className="text-lg font-medium">
//                     {retailer.resellerName}
//                   </h2>
//                   <p className="text-sm">{retailer.mobileNo}</p>
//                   <p className="text-sm">{retailer.state}</p>
//                   <p className="text-sm">{retailer.email || "—"}</p>
//                   <div className="flex justify-end space-x-3 mt-3">
//                     <button
//                       onClick={() => handleView(retailer._id)}
//                       className="text-blue-600 flex items-center text-sm"
//                     >
//                       <FaEye className="mr-1" /> View
//                     </button>
//                     <button
//                       onClick={() => handleEdit(retailer._id)}
//                       className="text-green-600 flex items-center text-sm"
//                     >
//                       <FaEdit className="mr-1" /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(retailer._id)}
//                       className="text-red-600 flex items-center text-sm"
//                     >
//                       <FaTrash className="mr-1" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       {/* <div>
//       <LcoList/>
//     </div> */}
//     </>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaSearch, FaWallet } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { deleteRetailer, getRetailer } from "../../service/retailer";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function RetailerList() {
  const [retailers, setRetailers] = useState([]); // Full list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Fetch retailers
  useEffect(() => {
    const loadRetailers = async () => {
      try {
        const res = await getRetailer();
        setRetailers(res.data || []);
      } catch (err) {
        console.error("Error fetching retailers:", err);
        setError("Failed to load retailers");
        toast.error("Failed to load retailers");
      } finally {
        setLoading(false);
      }
    };
    loadRetailers();
  }, []);

  // Close menu & suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (!event.target.closest(".menu-dropdown")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (id) => {
    navigate(`/retailer/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/retailer/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reseller?")) {
      try {
        await deleteRetailer(id);
        setRetailers((prev) => prev.filter((r) => r._id !== id));
        toast.success("Reseller deleted successfully");
      } catch (err) {
        toast.error("Failed to delete reseller");
      }
      setOpenMenuId(null);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1); // Reset to first page on search
    setShowSuggestions(false);
  };

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setAppliedSearch(name);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Filter full list
  const filteredRetailers = retailers.filter((retailer) =>
    retailer.resellerName?.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRetailers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRetailers = filteredRetailers.slice(startIndex, endIndex);

  // Suggestions
  const suggestions = [...new Set(
    retailers
      .map((r) => r.resellerName)
      .filter((name) => name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )].slice(0, 5);

  // Export ALL retailers
  const exportToExcel = () => {
    if (retailers.length === 0) {
      toast.error("No reseller data to export");
      return;
    }

    const exportData = retailers.map((retailer, index) => ({
      "S.No": index + 1,
      Name: retailer.resellerName || "—",
      Email: retailer.email || "—",
      "Phone No": retailer.mobileNo || "—",
      Address: retailer.address || "—",
      Balance: retailer.walletBalance || 0,
      Status: retailer.status === "active" ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resellers");
    XLSX.writeFile(workbook, "all_resellers.xlsx");
    toast.success("All resellers exported successfully!");
  };

  if (loading) return <p className="p-4">Loading resellers...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">Reseller List</h1>
          <div className="ml-4 relative" ref={searchRef}>
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by name..."
                className="px-3 py-1 border border-gray-300 rounded text-sm w-64"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FaSearch />
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {suggestions.map((name) => (
                  <div
                    key={name}
                    onClick={() => selectSuggestion(name)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            Download as Excel
          </button>
          <ProtectedAction module="reseller" action="create">
            <button
              onClick={() => navigate("/retailer/create")}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add Reseller
            </button>
          </ProtectedAction>
        </div>
      </div>

      {displayedRetailers.length === 0 ? (
        <p className="text-gray-500">No resellers found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[1000px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">S.No</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Email</th>
                  <th className="px-2 py-2 text-left">Phone No</th>
                  <th className="px-2 py-2 text-left">Address</th>
                  <th className="px-2 py-2 text-left">Balance</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedRetailers.map((retailer, index) => (
                  <tr key={retailer._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{startIndex + index + 1}</td>
                    <td className="px-2 py-2">
                      <span
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleView(retailer._id)}
                      >
                        {retailer.resellerName}
                      </span>
                    </td>
                    <td className="px-2 py-2">{retailer.email || "—"}</td>
                    <td className="px-2 py-2">{retailer.mobileNo}</td>
                    <td className="px-2 py-2">{retailer.address || "—"}</td>
                    <td className="px-2 py-2">{retailer.walletBalance || 0}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${retailer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {retailer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(retailer._id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>
                      {openMenuId === retailer._id && (
                        <div className="menu-dropdown absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <ul className="py-2 text-sm">
                            <li>
                              <button
                                onClick={() => handleView(retailer._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <ProtectedAction module="reseller" action="edit">
                              <li>
                                <button
                                  onClick={() => handleEdit(retailer._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-green-600"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </li>
                            </ProtectedAction>
                            <ProtectedAction module="reseller" action="delete">
                              <li>
                                <button
                                  onClick={() => handleDelete(retailer._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </li>
                            </ProtectedAction>

                            <ProtectedAction module="reseller" action="addTransaction">
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(`/retailer/wallet/create/${retailer?._id}`, {
                                      state: {
                                        data: {
                                          rsellerWalletBalance: retailer?.walletBalance || "",
                                          creditBalance: retailer?.creditBalance || {},
                                          resellerName: retailer?.resellerName || "",
                                        },
                                      },
                                    })
                                  }
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                                >
                                  <FaWallet /> Add Transaction
                                </button>
                              </li>
                            </ProtectedAction>

                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Mobile View */}
          <div className="space-y-4 md:hidden">
            {displayedRetailers.map((retailer, index) => (
              <div key={retailer._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">#{startIndex + index + 1}</p>
                    <h2 className="text-lg font-medium">{retailer.resellerName}</h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(retailer._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaEllipsisV className="text-gray-600" />
                  </button>
                </div>
                <p className="text-sm">{retailer.email || "—"}</p>
                <p className="text-sm">{retailer.mobileNo}</p>
                <p className="text-sm">{retailer.address || "—"}</p>
                <p className="text-sm">Balance: {retailer.walletBalance || 0}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${retailer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {retailer.status === "active" ? "Active" : "Inactive"}
                  </span>
                </p>

                {openMenuId === retailer._id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <button
                        onClick={() => handleView(retailer._id)}
                        className="w-full text-left flex items-center gap-3 text-blue-600"
                      >
                        <FaEye /> View
                      </button>
                      <ProtectedAction module="reseller" action="edit">
                        <button
                          onClick={() => handleEdit(retailer._id)}
                          className="w-full text-left flex items-center gap-3 text-green-600"
                        >
                          <FaEdit /> Edit
                        </button>
                      </ProtectedAction>
                      <ProtectedAction module="reseller" action="delete">
                        <button
                          onClick={() => handleDelete(retailer._id)}
                          className="w-full text-left flex items-center gap-3 text-red-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </ProtectedAction>

                      <ProtectedAction module="reseller" action="addTransaction">
                        <li>
                          <button
                            onClick={() =>
                              navigate(`/retailer/wallet/create/${retailer?._id}`, {
                                state: {
                                  data: {
                                    rsellerWalletBalance: retailer?.walletBalance || "",
                                    creditBalance: retailer?.creditBalance || {},
                                    resellerName: retailer?.resellerName || "",
                                  },
                                },
                              })
                            }
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                          >
                            <FaWallet /> Add Transaction
                          </button>
                        </li>
                      </ProtectedAction>
                    </div>
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