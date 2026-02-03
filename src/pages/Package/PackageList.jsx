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
import { getAllPackageList, updatePackage } from "../../service/package";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getAllPackageList();
        const normalized = (res.data || []).map((pkg) => ({
          ...pkg,
          status:
            pkg.status === "active" || pkg.status === true ? "active" : "inActive",
        }));
        setPackages(normalized);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

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
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
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

  if (loading) return <p className="p-4">Loading packages...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Package List</h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name..."
              className="px-2 py-1 border border-gray-300 rounded-l text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-2 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </div>

          <button
            onClick={exportToExcel}
            className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            Excel
          </button>

          <ProtectedAction module="package" action="Create">
            <button
              onClick={() => navigate("/package/create")}
              className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm"
            >
              Add Package
            </button>
          </ProtectedAction>
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
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Package Name</th>
                  <th className="px-[2px] py-[2px] text-left">Validity</th>
                  <th className="px-[2px] py-[2px] text-left">Category</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedPackages.map((pkg, index) => (
                  <tr key={pkg._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td
                      className="px-[2px] py-[2px] text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleView(pkg._id)}
                    >
                      {pkg.name}
                    </td>
                    <td className="px-[2px] py-[2px]">
                      {pkg.validity?.number} {pkg.validity?.unit}
                    </td>
                    <td className="px-[2px] py-[2px]">{pkg.categoryOfPlan || "—"}</td>
                    <td className="px-[2px] py-[2px]">
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
            {displayedPackages.map((pkg, index) => (
              <div key={pkg._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="text-sm text-gray-500">#{index + 1}</p>
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
        </>
      )}
    </div>
  );
}