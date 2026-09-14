import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaFileExcel,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  getStockCategories,
  deleteStockCategory,
  reassignStockToEngineer,
  reassignStockToUser,
} from "../../service/stockCategory";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Select from "react-select";

export default function TotalAssignedStock() {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  
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

  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignItem, setReassignItem] = useState(null);
  const [reassignValue, setReassignValue] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [users, setUsers] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [fetchingDropdown, setFetchingDropdown] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

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
      const assignedList = list.filter(item => item.assignedToEngineer || item.assignedToUser);
      setStock(assignedList);
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

  const openReassign = async (item) => {
    setReassignItem(item);
    setReassignValue(null);
    setOpenMenuId(null);
    setFetchingDropdown(true);
    setReassignOpen(true);
    
    try {
      if (item.assignedToEngineer) {
        const engRes = await fetch(`${BASE_URL}/staff/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const engData = await engRes.json();
        const engList = Array.isArray(engData) ? engData : (engData?.data?.staffs || engData?.staffs || (Array.isArray(engData?.data) ? engData.data : []));
        // Filter out the currently assigned engineer
        const filteredEngs = engList.filter(e => (e._id || e.id) !== item.assignedToEngineer._id);
        setEngineers(filteredEngs);
      } else if (item.assignedToUser) {
        const usrRes = await fetch(`${BASE_URL}/user/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const usrData = await usrRes.json();
        const usrList = Array.isArray(usrData) ? usrData : (usrData?.data?.users || usrData?.users || (Array.isArray(usrData?.data) ? usrData.data : []));
        // Filter out the currently assigned user
        const filteredUsers = usrList.filter(u => (u._id || u.id) !== item.assignedToUser._id);
        setUsers(filteredUsers);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load options");
    } finally {
      setFetchingDropdown(false);
    }
  };

  const handleReassign = async () => {
    if (!reassignValue) {
      toast.error("Please select a user or engineer to reassign to");
      return;
    }
    
    try {
      if (reassignItem.assignedToEngineer) {
        await reassignStockToEngineer(reassignItem._id, { staffId: reassignValue.value });
        toast.success("Stock reassigned to new engineer successfully");
      } else if (reassignItem.assignedToUser) {
        await reassignStockToUser(reassignItem._id, { userId: reassignValue.value });
        toast.success("Stock reassigned to new user successfully");
      }
      
      setReassignOpen(false);
      setReassignItem(null);
      fetchStock();
    } catch (err) {
      toast.error(err.message || "Failed to reassign stock");
    }
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
      "Assigned To": hw.assignedToEngineer ? `Engg: ${hw.assignedToEngineer.name}` : (hw.assignedToUser ? `User: ${hw.assignedToUser.generalInformation?.name || "Unknown"}` : "-"),
      "Assigned Date": formatDate(hw.assignDate || hw.updatedAt),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AssignedStock");
    XLSX.writeFile(wb, "assigned_stock.xlsx");
    toast.success("Exported successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">Total Assigned Stock</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all assigned stock items</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition shadow-sm"
          >
            <FaFileExcel /> Export to Excel
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
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Assigned Date</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {stock.length > 0 ? (
                  stock.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.productName || "-"}
                      </td>
                      <td className="px-6 py-4">{item.vendor || "-"}</td>
                      <td className="px-6 py-4">{item.serialNo || "-"}</td>
                      <td className="px-6 py-4">{item.macAddress || "-"}</td>
                      <td className="px-6 py-4">{item.quantity ?? "-"}</td>
                      <td className="px-6 py-4">
                        {item.assignedToEngineer ? (
                          <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            Engg: {item.assignedToEngineer.name}
                          </span>
                        ) : item.assignedToUser ? (
                          <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                            User: {item.assignedToUser.generalInformation?.name || "Unknown"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {formatDate(item.assignDate || item.updatedAt)}
                      </td>
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
                              onClick={() => openReassign(item)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-sm"
                            >
                              <FaExchangeAlt className="text-gray-400" /> Reassign
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
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                      No assigned stock found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Reassign Modal */}
      {reassignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reassign {reassignItem?.assignedToEngineer ? "Engineer" : "User"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a new {reassignItem?.assignedToEngineer ? "engineer" : "user"} for <span className="font-semibold">{reassignItem?.productName}</span>.
            </p>
            
            <div className="mb-6">
              {fetchingDropdown ? (
                <div className="text-sm text-gray-500 py-2">Loading options...</div>
              ) : reassignItem?.assignedToEngineer ? (
                <Select
                  value={reassignValue}
                  onChange={setReassignValue}
                  options={engineers.map(e => {
                    const name = e.name || e.staffName || "Unknown";
                    const username = e.userName ? ` (${e.userName})` : "";
                    const phone = e.phoneNo ? ` - ${e.phoneNo}` : "";
                    return {
                      value: e._id || e.id,
                      label: `${name}${username}${phone}`
                    };
                  })}
                  placeholder="Search and select an engineer..."
                  isClearable
                  autoFocus={true}
                  defaultMenuIsOpen={true}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                />
              ) : (
                <Select
                  value={reassignValue}
                  onChange={setReassignValue}
                  options={users.map(u => {
                    const name = u.generalInformation?.name || u.name || "Unknown";
                    const username = u.generalInformation?.username ? ` (${u.generalInformation.username})` : "";
                    const phone = u.generalInformation?.phone ? ` - ${u.generalInformation.phone}` : "";
                    return {
                      value: u._id || u.id,
                      label: `${name}${username}${phone}`
                    };
                  })}
                  placeholder="Search and select a user..."
                  isClearable
                  autoFocus={true}
                  defaultMenuIsOpen={true}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReassignOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                disabled={fetchingDropdown}
                onClick={handleReassign}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium shadow-sm disabled:opacity-50"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
