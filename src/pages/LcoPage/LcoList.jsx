// import { useEffect, useState, useRef } from "react";
// import { deleteLco, getAllLco } from "../../service/lco";
// import { useNavigate } from "react-router-dom";
// import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import { MdOutlineAccountBalanceWallet, MdOutlineAssignment } from "react-icons/md";
// import { MdOutlineSupportAgent } from "react-icons/md";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function LcoList() {
//   const [lco, setLco] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   // fetch lco
//   useEffect(() => {
//     const loadLco = async () => {
//       try {
//         const res = await getAllLco();
//         setLco(res.data || []);
//       } catch (err) {
//         console.error("Error fetching LCO:", err);
//         setError("Failed to load LCO list");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadLco();
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
//     navigate(`/lco/list/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleEdit = (id) => {
//     navigate(`/lco/update/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this LCO?")) {
//       try {
//         await deleteLco(id)
//         setLco(lco.filter((l) => l._id !== id));
//         setOpenMenuId(null);
//       } catch (err) {
//         console.error("Error deleting retailer:", err);
//         setError("Failed to delete retailer");
//       }
//     }
//   };
//   // asssign package to the retailer
//   const handleAssignPackage = (id) => {
//     navigate(`/lco/assignPackage/list/${id}`)
//   }
//   // this is for handle the wallet of the retailer
//   const handleWallet = (id) => {
//     navigate(`/lco/wallet/list/${id}`)
//   }
//   const handleEmployee = (id) => {
//     navigate(`/lco/employee/list/${id}`)
//   }
//   if (loading) return <p className="p-4">Loading LCOs...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold tracking-tight">Lco List</h1>
//         <ProtectedAction module="lco" action="create">
//           <button
//             onClick={() => navigate("/lco/create")}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             aria-label="Add Lco"
//           >
//             Add Lco
//           </button>
//         </ProtectedAction>
//       </div>
//       {lco.length === 0 ? (
//         <p className="text-gray-500">No LCOs found.</p>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-[2px] py-[2px] text-left">S.No</th>
//                   <th className="px-[2px] py-[2px] text-left">LCO Name</th>
//                   <th className="px-[2px] py-[2px] text-left">Mobile No</th>
//                   <th className="px-[2px] py-[2px] text-left">State</th>
//                   <th className="px-[2px] py-[2px] text-left">Email</th>
//                   <th className="px-[2px] py-[2px] text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {lco.map((item, index) => (
//                   <tr key={item._id} className="hover:bg-gray-50 relative">
//                     <td className="px-[2px] py-[2px]">{index + 1}</td>
//                     <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline" onClick={() => handleView(item._id)}>{item.lcoName}</td>
//                     <td className="px-[2px] py-[2px]">{item.mobileNo}</td>
//                     <td className="px-[2px] py-[2px]">{item.state}</td>
//                     <td className="px-[2px] py-[2px]">{item.email || "—"}</td>
//                     <td className="px-[2px] py-[2px] text-right relative">
//                       <div className="flex justify-start space-x-3">
//                      <ProtectedAction module="lco" action="view">
//                           <button
//                             onClick={() => handleView(item._id)}
//                             className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
//                             title="View"
//                           >
//                             <FaEye size={16} />
//                           </button>
//                         </ProtectedAction>
//                         <ProtectedAction module="lco" action="edit">
//                           <button
//                             onClick={() => handleEdit(item._id)}
//                             className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
//                             title="Edit"
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                         </ProtectedAction>
//                         <ProtectedAction module="lco" action="delete">
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
//                             title="Delete"
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </ProtectedAction>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* Mobile Card View */}
//           <div className="space-y-4 md:hidden">
//              {lco.map((item, index) => (
//                <div
//                  key={item._id}
//                  className="p-4 border rounded-lg shadow-sm bg-white"
//                >
//                  <p className="text-sm text-gray-500">#{index + 1}</p>
//                  <h2 className="text-lg font-medium hover:cursor-pointer hover:underline" onClick={() => handleView(item._id)}>{item.lcoName}</h2>
//                  <p className="text-sm">{item.mobileNo}</p>
//                  <p className="text-sm">{item.state}</p>
//                  <p className="text-sm">{item.email || "—"}</p>
//                  <div className="flex justify-end space-x-3 mt-3">
//                    <button
//                      onClick={() => handleEmployee(retailer._id)}
//                      className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
//                      title="Employee"
//                    >
//                      <MdOutlineAccountBalanceWallet size={20} />
//                    </button>
//                   <ProtectedAction module="lco" action="view">
//                     <button
//                       onClick={() => handleView(item._id)}
//                       className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
//                       title="View"
//                     >
//                       <FaEye size={16} />
//                     </button>
//                   </ProtectedAction>
//                   <ProtectedAction module="lco" action="edit">
//                     <button
//                       onClick={() => handleEdit(item._id)}
//                       className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
//                       title="Edit"
//                     >
//                       <FaEdit size={16} />
//                     </button>
//                   </ProtectedAction>
//                   <ProtectedAction module="lco" action="delete">
//                     <button
//                       onClick={() => handleDelete(item._id)}
//                       className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
//                       title="Delete"
//                     >
//                       <FaTrash size={16} />
//                     </button>
//                   </ProtectedAction>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaSearch, FaWallet } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { deleteLco, getAllLco } from "../../service/lco";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function LcoList() {
  const [lcos, setLcos] = useState([]); // Full list
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

  // Fetch LCOs
  useEffect(() => {
    const loadLcos = async () => {
      try {
        const res = await getAllLco();
        setLcos(res.data || []);
      } catch (err) {
        console.error("Error fetching LCOs:", err);
        setError("Failed to load LCOs");
        toast.error("Failed to load LCOs");
      } finally {
        setLoading(false);
      }
    };
    loadLcos();
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
    navigate(`/lco/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/lco/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this LCO?")) {
      try {
        await deleteLco(id);
        setLcos((prev) => prev.filter((l) => l._id !== id));
        toast.success("LCO deleted successfully");
      } catch (err) {
        toast.error("Failed to delete LCO");
      }
      setOpenMenuId(null);
    }
  };

  // const handleWallet = (id) => {
  //   navigate(`/lco/wallet/list/${id}`);
  //   setOpenMenuId(null);
  // };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setAppliedSearch(name);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Filter full list
  const filteredLcos = lcos.filter((lco) =>
    lco.lcoName?.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLcos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedLcos = filteredLcos.slice(startIndex, endIndex);

  // Suggestions
  const suggestions = [...new Set(
    lcos
      .map((l) => l.lcoName)
      .filter((name) => name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )].slice(0, 5);

  // Export ALL LCOs
  const exportToExcel = () => {
    if (lcos.length === 0) {
      toast.error("No LCO data to export");
      return;
    }

    const exportData = lcos.map((lco, index) => ({
      "S.No": index + 1,
      Name: lco.lcoName || "—",
      Email: lco.email || "—",
      "Phone No": lco.mobileNo || "—",
      Address: lco.address || "—",
      Balance: lco.walletBalance || 0,
      Status: lco.status === "active" ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LCOs");
    XLSX.writeFile(workbook, "all_lcos.xlsx");
    toast.success("All LCOs exported successfully!");
  };

  if (loading) return <p className="p-4">Loading LCOs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">LCO List</h1>
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
          <ProtectedAction module="lco" action="create">
            <button
              onClick={() => navigate("/lco/create")}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add LCO
            </button>
          </ProtectedAction>
        </div>
      </div>

      {displayedLcos.length === 0 ? (
        <p className="text-gray-500">No LCOs found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[1000px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">S.No</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Reseller Name</th>
                  <th className="px-2 py-2 text-left">Email</th>
                  <th className="px-2 py-2 text-left">Phone No</th>
                  <th className="px-2 py-2 text-left">Address</th>
                  <th className="px-2 py-2 text-left">Balance</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedLcos.map((lco, index) => (
                  <tr key={lco._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{startIndex + index + 1}</td>
                    <td className="px-2 py-2">
                      <span
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleView(lco._id)}
                      >
                        {lco.lcoName}
                      </span>
                    </td>
                    <td className="px-2 py-2">{lco.retailerId.resellerName ||  "—"}</td>
                    <td className="px-2 py-2">{lco.email || "—"}</td>
                    <td className="px-2 py-2">{lco.mobileNo}</td>
                    <td className="px-2 py-2">{lco.address || "—"}</td>
                    <td className="px-2 py-2">{lco.walletBalance || 0}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${lco.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {lco.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(lco._id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>
                      {openMenuId === lco._id && (
                        <div className="menu-dropdown absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <ul className="py-2 text-sm">
                            <li>
                              <button
                                onClick={() => handleView(lco._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-blue-600"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <ProtectedAction module="lco" action="edit">
                              <li>
                                <button
                                  onClick={() => handleEdit(lco._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-green-600"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </li>
                            </ProtectedAction>
                            <ProtectedAction module="lco" action="delete">
                              <li>
                                <button
                                  onClick={() => handleDelete(lco._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </li>
                            </ProtectedAction>

                            <ProtectedAction module="lco" action="addTransaction">
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(`/lco/wallet/create/${lco?._id}`, {
                                      state: {
                                        data: {
                                          lcoWalletBalance: lco?.walletBalance || "0",
                                          creditBalance: lco?.creditBalance || {},
                                          name: lco?.retailerId?.resellerName || "",
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
            {displayedLcos.map((lco, index) => (
              <div key={lco._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">#{startIndex + index + 1}</p>
                    <h2 className="text-lg font-medium">{lco.lcoName}</h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(lco._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaEllipsisV className="text-gray-600" />
                  </button>
                </div>
                <p className="text-sm">{lco.email || "—"}</p>
                <p className="text-sm">{lco.mobileNo}</p>
                <p className="text-sm">{lco.address || "—"}</p>
                <p className="text-sm">Balance: {lco.walletBalance || 0}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${lco.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {lco.status === "active" ? "Active" : "Inactive"}
                  </span>
                </p>

                {openMenuId === lco._id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <button
                        onClick={() => handleView(lco._id)}
                        className="w-full text-left flex items-center gap-3 text-blue-600"
                      >
                        <FaEye /> View
                      </button>
                      <ProtectedAction module="lco" action="edit">
                        <button
                          onClick={() => handleEdit(lco._id)}
                          className="w-full text-left flex items-center gap-3 text-green-600"
                        >
                          <FaEdit /> Edit
                        </button>
                      </ProtectedAction>
                      <ProtectedAction module="lco" action="delete">
                        <button
                          onClick={() => handleDelete(lco._id)}
                          className="w-full text-left flex items-center gap-3 text-red-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </ProtectedAction>

                      <ProtectedAction module="lco" action="addTransaction">
                        <li>
                          <button
                            onClick={() =>
                              navigate(`/lco/wallet/create/${lco?._id}`, {
                                state: {
                                  data: {
                                    lcoWalletBalance: lco?.walletBalance || "0",
                                    creditBalance: lco?.creditBalance || {},
                                    name: lco?.retailerId?.resellerName || "",
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