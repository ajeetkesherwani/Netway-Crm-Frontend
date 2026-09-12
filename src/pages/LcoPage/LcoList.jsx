
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaSearch, FaWallet, FaSignInAlt } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { deleteLco, getAllLco, getLcosByResellerId } from "../../service/lco";
import { getRetailer } from "../../service/retailer";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Select from "react-select";

export default function LcoList() {
  const [lcos, setLcos] = useState([]); // Full list
  const [retailers, setRetailers] = useState([]);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedLco, setSelectedLco] = useState(null);
  const [appliedLco, setAppliedLco] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Fetch Retailers once
  useEffect(() => {
    getRetailer().then(res => {
      if (res.data) setRetailers(res.data);
    }).catch(err => console.error(err));
  }, []);

  // Fetch LCOs
  useEffect(() => {
    const loadLcos = async () => {
      try {
        setLoading(true);
        setError(""); // clear past errors
        let res;
        if (selectedReseller) {
          try {
            res = await getLcosByResellerId(selectedReseller.value);
            setLcos(res.data || []);
          } catch (err) {
            // API throws error when no LCOs exist for reseller
            setLcos([]);
          }
        } else {
          res = await getAllLco();
          setLcos(res.data || []);
        }
        setSelectedLco(null);
        setAppliedLco(null);
      } catch (err) {
        console.error("Error fetching LCOs:", err);
        setError("Failed to load LCOs");
        toast.error("Failed to load LCOs");
      } finally {
        setLoading(false);
      }
    };
    loadLcos();
  }, [selectedReseller]);

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
    setAppliedLco(selectedLco);
    setCurrentPage(1);
  };

  // Filter full list
  const filteredLcos = lcos.filter((lco) => {
    if (!appliedLco) return true;
    return lco._id === appliedLco.value;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLcos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedLcos = filteredLcos.slice(startIndex, endIndex);

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
          <div className="ml-4 flex items-center gap-2">
            <Select
              options={retailers.map((r) => ({ value: r._id, label: r.resellerName }))}
              value={selectedReseller}
              onChange={(option) => setSelectedReseller(option)}
              placeholder="Select Reseller..."
              className="w-48 text-sm text-black"
              isClearable
            />
            <Select
              options={lcos.map((l) => ({ value: l._id, label: l.lcoName }))}
              value={selectedLco}
              onChange={(option) => setSelectedLco(option)}
              placeholder="First Select Reseller."
              className="w-48 text-sm text-black"
              isDisabled={!selectedReseller}
              isClearable
            />
            <button
              onClick={handleSearch}
              className="px-3 py-[9px] bg-blue-600 text-white rounded hover:bg-blue-700 h-[38px] flex items-center justify-center"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            Download as Excel
          </button>
          <ProtectedAction module="lco" action="Create">
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
                    <td className="px-2 py-2">{lco.retailerId.resellerName || "—"}</td>
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
                            <li>
                              <button
                                onClick={() => window.open("/lco", "_blank")}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-purple-600"
                              >
                                <FaSignInAlt /> Login as LCO
                              </button>
                            </li>
                            <ProtectedAction module="lco" action="Edit">
                              <li>
                                <button
                                  onClick={() => handleEdit(lco._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-green-600"
                                >
                                  <FaEdit /> Edit
                                </button>
                              </li>
                            </ProtectedAction>
                            <ProtectedAction module="lco" action="Delete">
                              <li>
                                <button
                                  onClick={() => handleDelete(lco._id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </li>
                            </ProtectedAction>

                            <ProtectedAction module="lco" action="AddTransaction">
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
                      <ProtectedAction module="lco" action="Edit">
                        <button
                          onClick={() => handleEdit(lco._id)}
                          className="w-full text-left flex items-center gap-3 text-green-600"
                        >
                          <FaEdit /> Edit
                        </button>
                      </ProtectedAction>
                      <ProtectedAction module="lco" action="Delete">
                        <button
                          onClick={() => handleDelete(lco._id)}
                          className="w-full text-left flex items-center gap-3 text-red-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </ProtectedAction>

                      <ProtectedAction module="lco" action="AddTransaction">
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