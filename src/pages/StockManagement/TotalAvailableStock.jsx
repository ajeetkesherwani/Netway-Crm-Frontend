import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaUpload,
  FaPlus,
  FaFileExcel,
} from "react-icons/fa";
import {
  getStockCategories,
  deleteStockCategory,
  bulkUploadStockCategory,
} from "../../service/stockCategory";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function TotalAvailableStock() {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filters
  const [filters, setFilters] = useState({
    productName: "",
    vendor: "",
    serialNo: "",
    macAddress: ""
  });
  const [appliedFilters, setAppliedFilters] = useState({
    productName: "",
    vendor: "",
    serialNo: "",
    macAddress: ""
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  const fileInputRef = useRef(null);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (appliedFilters.productName) queryParams.append("productName", appliedFilters.productName);
      if (appliedFilters.vendor) queryParams.append("vendor", appliedFilters.vendor);
      if (appliedFilters.serialNo) queryParams.append("serialNo", appliedFilters.serialNo);
      if (appliedFilters.macAddress) queryParams.append("macAddress", appliedFilters.macAddress);

      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
      
      const res = await getStockCategories(queryStr);
      const list = res?.data?.stockCategories || [];
      const availableList = list.filter(item => !item.assignedToEngineer && !item.assignedToUser);
      setStock(availableList);
      setCurrentPage(1); // Reset to first page on new data
    } catch (err) {
      toast.error("Failed to load stock categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [appliedFilters]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = (id, name) => {
    setConfirmItem({ id, name: name || "Item" });
    setConfirmOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!confirmItem) return;
    try {
      await deleteStockCategory(confirmItem.id);
      toast.success("Stock category deleted successfully");
      await fetchStock();
    } catch (err) {
      toast.error("Failed to delete stock category");
    } finally {
      setConfirmOpen(false);
      setConfirmItem(null);
    }
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Uploading...", { id: "upload" });
      await bulkUploadStockCategory(formData);
      toast.success("Bulk upload successful", { id: "upload" });
      fetchStock();
    } catch (err) {
      toast.error("Bulk upload failed", { id: "upload" });
    }
    
    // Reset input
    e.target.value = null;
  };

  const exportToExcel = () => {
    if (stock.length === 0) {
      toast.error("No stock to export");
      return;
    }
    const data = stock.map((hw, i) => ({
      "S.No": i + 1,
      "Product Name": hw.productName || "-",
      "Vendor": hw.vendor || "-",
      "Serial No": hw.serialNo || "-",
      "MAC Address": hw.macAddress || "-",
      "Quantity": hw.quantity || 0,
      "Stock Alert Quantity": hw.stockAlertQuantity || 0,
      "Description": hw.description || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AvailableStock");
    XLSX.writeFile(wb, "available_stock.xlsx");
    toast.success("Exported successfully!");
  };

  const totalPages = Math.ceil(stock.length / itemsPerPage);
  const paginatedStock = stock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">Total Available Stock</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all available stock items</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
          <button
            onClick={() => navigate("/stock-category/create")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-sm"
          >
            <FaPlus /> Create
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition shadow-sm"
          >
            <FaFileExcel /> Export to Excel
          </button>
          <button
            onClick={handleBulkUploadClick}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm"
          >
            <FaUpload /> Bulk Upload
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Product Name</label>
          <input
            type="text"
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by product..."
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Vendor</label>
          <input
            type="text"
            name="vendor"
            value={filters.vendor}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by vendor..."
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Serial No</label>
          <input
            type="text"
            name="serialNo"
            value={filters.serialNo}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by serial..."
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">MAC Address</label>
          <input
            type="text"
            name="macAddress"
            value={filters.macAddress}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by MAC..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
          <button
            onClick={() => {
              const emptyFilters = { productName: "", vendor: "", serialNo: "", macAddress: "" };
              setFilters(emptyFilters);
              setAppliedFilters(emptyFilters);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-600 text-center">Loading stock...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100/70 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-4">S.No</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Serial No</th>
                  <th className="px-6 py-4">MAC Address</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {paginatedStock.length > 0 ? (
                  paginatedStock.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.productName || "-"}
                      </td>
                      <td className="px-6 py-4">{item.vendor || "-"}</td>
                      <td className="px-6 py-4">{item.serialNo || "-"}</td>
                      <td className="px-6 py-4">{item.macAddress || "-"}</td>
                      <td className="px-6 py-4">{item.quantity ?? "-"}</td>
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(item._id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-800 focus:outline-none rounded-full hover:bg-gray-200 transition"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuId === item._id && (
                          <div className="absolute right-8 top-10 bg-white border border-gray-200 shadow-xl rounded-md w-36 z-50 overflow-hidden">
                            <button
                              onClick={() => navigate(`/stock-category/view/${item._id}`)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-sm"
                            >
                              <FaEye className="text-gray-400" /> View
                            </button>
                            <button
                              onClick={() => navigate(`/stock-category/update/${item._id}`)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-sm"
                            >
                              <FaEdit className="text-gray-400" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, item.productName)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No stock found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 gap-4">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, stock.length)} of {stock.length} entries
            </span>
            <div className="flex gap-1 overflow-x-auto max-w-full">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 text-sm transition"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show a small window around current page to avoid huge pagination
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded border text-sm transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                
                // Show ellipsis if there is a gap
                if (
                  (page === 2 && currentPage > 4) ||
                  (page === totalPages - 1 && currentPage < totalPages - 3)
                ) {
                  return <span key={page} className="px-2 py-1 text-gray-400">...</span>;
                }
                
                return null;
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 text-sm transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Item</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{confirmItem?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
