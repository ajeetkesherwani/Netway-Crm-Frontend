import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
} from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getAllPackageList, updatePackage, syncPackageIds } from "../../service/package";
import { getPackagesByRole } from "../../service/user";
import { getRetailer } from "../../service/retailer";
import { getLcosByResellerId } from "../../service/lco";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Select from "react-select";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [serverTypeSearch, setServerTypeSearch] = useState("");
  const [appliedServerType, setAppliedServerType] = useState("");

  // Reseller / LCO filter state
  const [retailers, setRetailers] = useState([]);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [lcoOptions, setLcoOptions] = useState([]);
  const [selectedLco, setSelectedLco] = useState(null);
  const [lcoLoading, setLcoLoading] = useState(false);
  // Applied reseller/lco for fetch
  const [appliedResellerId, setAppliedResellerId] = useState("");
  const [appliedLcoId, setAppliedLcoId] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch retailers on mount
  useEffect(() => {
    getRetailer().then(res => {
      if (res?.data) setRetailers(res.data);
    }).catch(() => { });
  }, []);

  // When reseller changes, load their LCOs
  useEffect(() => {
    if (!selectedReseller) {
      setLcoOptions([]);
      setSelectedLco(null);
      return;
    }
    setLcoLoading(true);
    setSelectedLco(null);
    getLcosByResellerId(selectedReseller.value)
      .then(res => setLcoOptions((res?.data || []).map(l => ({ value: l._id, label: l.lcoName }))))
      .catch(() => setLcoOptions([]))
      .finally(() => setLcoLoading(false));
  }, [selectedReseller]);

  // Fetch packages — uses assigned-package API when reseller/LCO filter is active
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        let rawList = [];

        if (appliedLcoId) {
          // Fetch packages assigned to this specific LCO
          const res = await getPackagesByRole({ targetRole: "Lco", targetId: appliedLcoId });
          rawList = res?.data?.packages || [];
        } else if (appliedResellerId) {
          // Fetch packages assigned to this reseller
          const res = await getPackagesByRole({ targetRole: "Reseller", targetId: appliedResellerId });
          rawList = res?.data?.packages || [];
        } else {
          // No role filter — fetch all packages (with optional servertype)
          const res = await getAllPackageList(appliedServerType);
          rawList = res?.data || [];
        }

        const normalized = rawList.map((pkg) => ({
          ...pkg,
          status:
            pkg.status === "active" || pkg.status === true ? "active" : "inActive",
        }));
        setPackages(normalized);
        setCurrentPage(1); // Reset to page 1 on new fetch
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, [appliedServerType, appliedResellerId, appliedLcoId]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
    navigate(`/package/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/package/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages((prev) => prev.filter((p) => p._id !== id));
      toast.success("Package deleted successfully");
      setOpenMenuId(null);
    }
  };

  // Real API call to toggle status
  const handleToggleStatus = async (pkg) => {
    const newStatus = pkg.status === "active" ? "inActive" : "active";
    if (!window.confirm(`Make "${pkg.name}" ${newStatus.toUpperCase()}?`)) return;

    try {
      await updatePackage(pkg._id, { status: newStatus });
      setPackages((prev) =>
        prev.map((p) => (p._id === pkg._id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Package is now ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
    setOpenMenuId(null);
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.toLowerCase());
    setAppliedServerType(serverTypeSearch);
    setAppliedResellerId(selectedReseller?.value || "");
    setAppliedLcoId(selectedLco?.value || "");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // const handleSyncIds = async () => {
  //   try {
  //     const res = await syncPackageIds();

  //     toast.success(res.message);

  //     const updated = await getAllPackageList();
  //     setPackages(updated.data);

  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const handleSyncIds = async () => {
    try {
      const res = await syncPackageIds();

      // 🔥 Always show success message
      toast.success("Package IDs updated successfully");

      // 🔥 Reload latest data
      const updated = await getAllPackageList();

      const normalized = (updated.data || []).map((pkg) => ({
        ...pkg,
        status:
          pkg.status === "active" || pkg.status === true
            ? "active"
            : "inActive",
      }));

      setPackages(normalized);

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update package IDs");
    }
  };

  const exportToExcel = () => {
    if (packages.length === 0) {
      toast.error("No package data to export");
      return;
    }

    const exportData = packages.map((pkg, index) => ({
      "S.No": index + 1,
      "Package Name": pkg.name || "",
      Validity: `${pkg.validity?.number || ""} ${pkg.validity?.unit || ""}`,
      Category: pkg.categoryOfPlan || "—",
      Status: pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");
    XLSX.writeFile(workbook, "all_packages.xlsx");
    toast.success("All packages exported successfully!");
  };

  const displayedPackages = packages.filter((pkg) =>
    pkg.name?.toLowerCase().includes(appliedSearch)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedPackages.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p className="p-4">Loading packages...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">

      {/* ── Header: Title left, controls right ── */}
      <div className="flex items-start justify-between gap-4 mb-4">

        {/* Left: Title */}
        <h1 className="text-xl font-semibold pt-1 whitespace-nowrap">Package List</h1>

        {/* Right: Two rows of controls */}
        <div className="flex flex-col items-end gap-2">

          {/* Row 1: Search inputs + action buttons */}
          <div className="flex items-center gap-2">

            {/* Server Type */}
            <input
              type="text"
              value={serverTypeSearch}
              onChange={(e) => setServerTypeSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Server Type..."
              className="h-9 px-3 border border-gray-300 rounded text-sm w-32 focus:outline-none focus:border-blue-400"
            />

            {/* Name search */}
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by name..."
                className="h-9 px-3 border border-gray-300 rounded-l text-sm w-44 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSearch}
                className="h-9 px-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 flex items-center"
              >
                <FaSearch size={13} />
              </button>
            </div>

            {/* Clear all */}
            <button
              onClick={() => {
                setSelectedReseller(null);
                setSelectedLco(null);
                setAppliedResellerId("");
                setAppliedLcoId("");
                setServerTypeSearch("");
                setAppliedServerType("");
                setSearchTerm("");
                setAppliedSearch("");
              }}
              className="h-9 px-3 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
            >
              Clear
            </button>

            {/* Divider */}
            <span className="h-7 w-px bg-gray-300" />

            {/* Sync IDs */}
            <button
              onClick={handleSyncIds}
              className="h-9 px-3 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              Upd. IDs
            </button>

            {/* Export */}
            <button
              onClick={exportToExcel}
              className="h-9 px-3 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              Excel
            </button>

            {/* Add Package */}
            <ProtectedAction module="package" action="Create">
              <button
                onClick={() => navigate("/package/create")}
                className="h-9 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm font-medium"
              >
                + Add Package
              </button>
            </ProtectedAction>
          </div>

          {/* Row 2: Reseller / LCO filter */}
          <div className="flex items-center gap-2">
            <Select
              options={retailers.map(r => ({ value: r._id, label: r.resellerName }))}
              value={selectedReseller}
              onChange={(opt) => { setSelectedReseller(opt); setSelectedLco(null); }}
              placeholder="Select Reseller..."
              className="w-52 text-sm"
              isClearable
              styles={{
                control: (base) => ({ ...base, minHeight: "36px", height: "36px", fontSize: "13px" }),
                valueContainer: (base) => ({ ...base, padding: "0 8px" }),
                indicatorsContainer: (base) => ({ ...base, height: "36px" }),
              }}
            />
            <Select
              options={lcoOptions}
              value={selectedLco}
              onChange={(opt) => setSelectedLco(opt)}
              placeholder={selectedReseller ? "Select LCO..." : "Select Reseller first"}
              className="w-48 text-sm"
              isDisabled={!selectedReseller || lcoLoading}
              isLoading={lcoLoading}
              isClearable
              styles={{
                control: (base) => ({ ...base, minHeight: "36px", height: "36px", fontSize: "13px" }),
                valueContainer: (base) => ({ ...base, padding: "0 8px" }),
                indicatorsContainer: (base) => ({ ...base, height: "36px" }),
              }}
            />
            <button
              onClick={handleSearch}
              className="h-9 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <FaSearch size={13} /> Search
            </button>
          </div>

        </div>
      </div>

      {displayedPackages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {appliedSearch ? "No packages match your search." : "No packages found."}
        </p>
      ) : (
        <>
          {/* Desktop Table View - Compact Old Style */}
          <div className="hidden md:block overflow-x-auto text-[12px]">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">S.No</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Package Name</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Package ID</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Server Type</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Base Price</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">No. of User</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Validity</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((pkg, index) => (
                  <tr key={pkg._id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5">{indexOfFirstItem + index + 1}</td>
                    <td
                      className="px-3 py-1.5 text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleView(pkg._id)}
                    >
                      {pkg.name}
                    </td>

                    <td className="px-3 py-1.5">
                      {pkg.IppactId || "0"}
                    </td>
                    <td className="px-3 py-1.5">
                      {pkg.servertype || "—"}
                    </td>

                    <td className="px-3 py-1.5">
                      {pkg.basePrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-3 py-1.5">
                      {pkg.totalUser || "—"}
                    </td>
                    <td className="px-3 py-1.5">
                      {pkg.validity?.number} {pkg.validity?.unit}
                    </td>
                    <td className="px-3 py-1.5">{pkg.categoryOfPlan || "—"}</td>
                    <td className="px-3 py-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${pkg.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-[2px] py-[2px] text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(pkg._id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>

                      {openMenuId === pkg._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleView(pkg._id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FaEye /> View
                            </button>

                            <ProtectedAction module="package" action="Edit">
                              <button
                                onClick={() => handleEdit(pkg._id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FaEdit /> Edit
                              </button>
                            </ProtectedAction>

                            <button
                              onClick={() => handleToggleStatus(pkg)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              {pkg.status === "active" ? (
                                <>
                                  <FaToggleOn className="text-green-600" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <FaToggleOff className="text-red-600" /> Activate
                                </>
                              )}
                            </button>

                            <ProtectedAction module="package" action="Delete">
                              <button
                                onClick={() => handleDelete(pkg._id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <FaTrash /> Delete
                              </button>
                            </ProtectedAction>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {currentItems.map((pkg, index) => (
              <div key={pkg._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="text-sm text-gray-500">#{indexOfFirstItem + index + 1}</p>
                <h3 className="text-lg font-medium text-blue-600">{pkg.name}</h3>
                <p className="text-sm">
                  Validity: {pkg.validity?.number} {pkg.validity?.unit}
                </p>
                <p className="text-sm">Category: {pkg.categoryOfPlan || "—"}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${pkg.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {pkg.status}
                  </span>
                </p>

                <div className="flex justify-end gap-3 mt-3 text-sm">
                  <button
                    onClick={() => handleView(pkg._id)}
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <FaEye /> View
                  </button>

                  <ProtectedAction module="package" action="Edit">
                    <button
                      onClick={() => handleEdit(pkg._id)}
                      className="text-green-600 flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                  </ProtectedAction>

                  <ProtectedAction module="package" action="Delete">
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 border-t pt-4">
              <span className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayedPackages.length)} of {displayedPackages.length} packages
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}