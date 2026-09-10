import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getAssignedHardwareByUserId,
  getHardwareList,
  assignHardware,
} from "../../service/hardware";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheck,
  FaBoxes,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";

const UserAssignedHardware = () => {
  const { id } = useParams();
  const [hardware, setHardware] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assign Stock Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [availableHardware, setAvailableHardware] = useState([]);
  const [fetchingAvailable, setFetchingAvailable] = useState(false);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch assigned hardware for the current user
  const fetchAssignedHardware = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getAssignedHardwareByUserId(id);
      if (res.status === true && res.data) {
        setHardware(res.data.hardware || []);
        setUserInfo(res.data.user || null);
      }
    } catch (err) {
      console.error("Error fetching assigned hardware:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignedHardware();
  }, [fetchAssignedHardware]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unassigned hardware from the system
  const fetchAvailableHardware = async () => {
    setFetchingAvailable(true);
    try {
      const res = await getHardwareList();
      const list = Array.isArray(res)
        ? res
        : res?.data ?? res?.result ?? res?.hardware ?? [];

      // Filter: Show ONLY hardware that is NOT assigned to anyone
      const unassigned = list.filter((hw) => {
        // 1. Check assignedTo (if populated object with id/name, or string user id)
        if (hw.assignedTo) {
          if (typeof hw.assignedTo === "object") {
            if (
              hw.assignedTo._id ||
              hw.assignedTo.id ||
              hw.assignedTo.userName ||
              hw.assignedTo.name
            ) {
              return false;
            }
          } else if (
            typeof hw.assignedTo === "string" &&
            hw.assignedTo.trim() !== "" &&
            hw.assignedTo !== "null" &&
            hw.assignedTo !== "undefined"
          ) {
            return false;
          }
        }

        // 2. Check status (assigned / in-use)
        if (hw.status) {
          const st = String(hw.status).toLowerCase().trim();
          if (st === "assigned" || st === "in-use" || st === "in use") {
            return false;
          }
        }

        // 3. Check isAssigned boolean flag
        if (hw.isAssigned === true) {
          return false;
        }

        // 4. Exclude hardware already assigned to this user
        const alreadyInUserHardware = hardware.some(
          (h) => (h._id || h.id) === (hw._id || hw.id)
        );
        if (alreadyInUserHardware) {
          return false;
        }

        return true;
      });

      setAvailableHardware(unassigned);
    } catch (err) {
      console.error("Error fetching available hardware:", err);
      toast.error("Failed to load available stock");
    } finally {
      setFetchingAvailable(false);
    }
  };

  // Open modal and fetch available unassigned stock
  const handleOpenModal = () => {
    setSelectedHardware([]);
    setSearchTerm("");
    setIsDropdownOpen(true);
    setIsAssignModalOpen(true);
    fetchAvailableHardware();
  };

  // Close modal
  const handleCloseModal = () => {
    if (assignLoading) return;
    setIsAssignModalOpen(false);
    setSelectedHardware([]);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Search filter across hardware name, brand, model, serial number, and type
  const filteredHardware = availableHardware.filter((hw) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    const name = (hw.hardwareName || hw.name || "").toLowerCase();
    const brand = (hw.brand || "").toLowerCase();
    const model = (hw.model || "").toLowerCase();
    const serial = (hw.serialNumber || hw.serialNo || "").toLowerCase();
    const type = (hw.hardwareType || hw.type || "").toLowerCase();
    return (
      name.includes(q) ||
      brand.includes(q) ||
      model.includes(q) ||
      serial.includes(q) ||
      type.includes(q)
    );
  });

  // Toggle selection of a hardware item
  const toggleSelectHardware = (hw) => {
    const hwId = hw._id || hw.id;
    const exists = selectedHardware.some((item) => (item._id || item.id) === hwId);
    if (exists) {
      setSelectedHardware((prev) =>
        prev.filter((item) => (item._id || item.id) !== hwId)
      );
    } else {
      setSelectedHardware((prev) => [...prev, hw]);
    }
  };

  // Remove a selected item
  const removeSelectedHardware = (hwId) => {
    setSelectedHardware((prev) =>
      prev.filter((item) => (item._id || item.id) !== hwId)
    );
  };

  // Select all items currently shown in the filtered dropdown
  const selectAllFiltered = () => {
    const newItems = [...selectedHardware];
    filteredHardware.forEach((hw) => {
      const hwId = hw._id || hw.id;
      if (!newItems.some((item) => (item._id || item.id) === hwId)) {
        newItems.push(hw);
      }
    });
    setSelectedHardware(newItems);
  };

  // Clear all selections
  const clearAllSelected = () => {
    setSelectedHardware([]);
  };

  // Assign selected multiple hardware items to this user
  const handleAssignSubmit = async () => {
    if (selectedHardware.length === 0) {
      toast.error("Please select at least one stock item to assign");
      return;
    }

    setAssignLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const hw of selectedHardware) {
        const hardwareId = hw._id || hw.id;
        try {
          await assignHardware({ hardwareId, userId: id });
          successCount++;
        } catch (err) {
          console.error(
            `Failed to assign hardware ${hw.hardwareName || hw.name}:`,
            err
          );
          failCount++;
        }
      }

      if (successCount > 0) {
        if (failCount === 0) {
          toast.success(
            `Successfully assigned ${successCount} stock item${
              successCount > 1 ? "s" : ""
            }!`
          );
        } else {
          toast.warn(
            `Assigned ${successCount} item(s), but ${failCount} failed.`
          );
        }
        setIsAssignModalOpen(false);
        setSelectedHardware([]);
        setSearchTerm("");
        await fetchAssignedHardware();
      } else {
        toast.error("Failed to assign selected stock items");
      }
    } catch (err) {
      console.error("Assign error:", err);
      toast.error(err?.message || "Failed to assign hardware");
    } finally {
      setAssignLoading(false);
    }
  };

  // Download Excel function
  const downloadExcel = () => {
    const data = hardware.map((item, index) => ({
      "S.No": index + 1,
      "User Name": userInfo?.name || "—",
      "Username": userInfo?.userName || "—",
      "Hardware Name": item.hardwareName || "—",
      "Type": item.hardwareType || "—",
      "Brand": item.brand || "—",
      "Model": item.model || "—",
      "Serial Number": item.serialNumber || "—",
      "Purchase Date": item.purchaseDate
        ? new Date(item.purchaseDate).toLocaleDateString("en-GB")
        : "—",
      "Warranty Expiry": item.warrantyExpiry
        ? new Date(item.warrantyExpiry).toLocaleDateString("en-GB")
        : "—",
      "Price (₹)": item.price?.toLocaleString() || "0",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assigned Hardware");
    XLSX.writeFile(wb, `${userInfo?.userName || "user"}_assigned_hardware.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl bg-gray-50 min-h-screen">
        Loading assigned hardware...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Assigned Hardware</h2>
          {userInfo && (
            <p className="text-sm text-gray-600 mt-1">
              For user: <span className="font-medium">{userInfo.name || "—"}</span> (
              {userInfo.userName || "—"})
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600 mr-2">
            Total: <span className="font-medium">{hardware.length}</span> items
          </p>
          {hardware.length > 0 && (
            <button
              onClick={downloadExcel}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
            >
              Download Excel
            </button>
          )}
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
          >
            <FaPlus className="text-xs" />
            Assign Stock
          </button>
        </div>
      </div>

      {/* Hardware Table */}
      {hardware.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">S.No</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Username</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Hardware Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Type</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Brand</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Model</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Serial Number</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Purchase Date</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Warranty Expiry</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {hardware.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className={`hover:bg-gray-50 border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-800 border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {userInfo?.name || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {userInfo?.userName || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.hardwareName || item.name || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 capitalize">
                      {item.hardwareType || item.type || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.brand || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.model || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.serialNumber || item.serialNo || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-600">
                      {item.purchaseDate
                        ? new Date(item.purchaseDate).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-600">
                      {item.warrantyExpiry
                        ? new Date(item.warrantyExpiry).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      ₹{item.price?.toLocaleString() || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No hardware assigned to this user.
        </div>
      )}

      {/* Assign Stock Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaBoxes className="text-blue-600" />
                  Assign Stock to User
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assigning to:{" "}
                  <span className="font-semibold text-gray-700">
                    {userInfo?.name || "Customer"}
                  </span>{" "}
                  ({userInfo?.userName || "ID: " + id})
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={assignLoading}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Searchable Multi-Select Dropdown Container */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Available Hardware / Stock
                  </label>
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    {fetchingAvailable
                      ? "Loading stock..."
                      : `${availableHardware.length} available (unassigned)`}
                  </span>
                </div>

                {/* Search Input Box */}
                <div
                  onClick={() => setIsDropdownOpen(true)}
                  className="w-full flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-text shadow-sm"
                >
                  <FaSearch className="text-gray-400 mr-2 text-sm flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search by hardware name, brand, model, serial no..."
                    className="w-full outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm("");
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-1.5 p-1"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen((prev) => !prev);
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    {isDropdownOpen ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </button>
                </div>

                {/* Dropdown Options List */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Header bar within dropdown */}
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs text-gray-600">
                      <span>
                        Showing {filteredHardware.length} matching unassigned item(s)
                      </span>
                      <div className="flex gap-2">
                        {filteredHardware.length > 0 && (
                          <button
                            type="button"
                            onClick={selectAllFiltered}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Select All
                          </button>
                        )}
                        {selectedHardware.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllSelected}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                      {fetchingAvailable ? (
                        <div className="p-6 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin text-blue-600" />
                          Loading unassigned hardware...
                        </div>
                      ) : filteredHardware.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          {searchTerm
                            ? `No unassigned hardware found matching "${searchTerm}".`
                            : "No unassigned hardware available in inventory."}
                        </div>
                      ) : (
                        filteredHardware.map((hw) => {
                          const hwId = hw._id || hw.id;
                          const isSelected = selectedHardware.some(
                            (item) => (item._id || item.id) === hwId
                          );
                          const hwName = hw.hardwareName || hw.name || "Unnamed Hardware";
                          const brandModel = `${hw.brand || ""} ${hw.model || ""}`.trim();
                          const serial = hw.serialNumber || hw.serialNo;

                          return (
                            <div
                              key={hwId}
                              onClick={() => toggleSelectHardware(hw)}
                              className={`p-3 cursor-pointer flex items-center justify-between transition ${
                                isSelected
                                  ? "bg-blue-50/70 hover:bg-blue-100/70"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // handled by parent onClick
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
                                />
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-gray-800 text-sm">
                                      {hwName}
                                    </span>
                                    {brandModel && (
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium">
                                        {brandModel}
                                      </span>
                                    )}
                                    {hw.hardwareType && (
                                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded capitalize">
                                        {hw.hardwareType}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                                    {serial && (
                                      <span>
                                        Serial: <span className="font-mono">{serial}</span>
                                      </span>
                                    )}
                                    {hw.macAddress && (
                                      <span>
                                        MAC: <span className="font-mono">{hw.macAddress}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0 ml-3">
                                {hw.price !== undefined && hw.price !== null && (
                                  <span className="text-sm font-semibold text-gray-800">
                                    ₹{Number(hw.price).toLocaleString()}
                                  </span>
                                )}
                                <div>
                                  <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Available
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Hardware Items Summary */}
              {selectedHardware.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  <div className="bg-blue-50/60 px-4 py-2.5 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Selected Stock To Assign ({selectedHardware.length})
                    </span>
                    <button
                      type="button"
                      onClick={clearAllSelected}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear Selection
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Hardware Name</th>
                          <th className="py-2 px-3">Brand / Model</th>
                          <th className="py-2 px-3">Serial No</th>
                          <th className="py-2 px-3">Price</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedHardware.map((hw, idx) => {
                          const hwId = hw._id || hw.id;
                          return (
                            <tr key={hwId} className="hover:bg-gray-50">
                              <td className="py-2.5 px-3 font-medium text-gray-500">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-gray-800">
                                {hw.hardwareName || hw.name || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-gray-600">
                                {`${hw.brand || ""} ${hw.model || ""}`.trim() || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 font-mono">
                                {hw.serialNumber || hw.serialNo || "—"}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-gray-800">
                                {hw.price !== undefined && hw.price !== null
                                  ? `₹${Number(hw.price).toLocaleString()}`
                                  : "—"}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeSelectedHardware(hwId)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                  title="Remove from selection"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
                  <FaBoxes className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">
                    No stock items selected yet.
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Use the searchable dropdown above to choose one or multiple hardware
                    items to assign.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-600">
                {selectedHardware.length > 0 ? (
                  <span>
                    <strong>{selectedHardware.length}</strong> item
                    {selectedHardware.length > 1 ? "s" : ""} selected
                    {selectedHardware.some((h) => h.price) && (
                      <span className="ml-2 font-medium text-gray-800">
                        (Total: ₹
                        {selectedHardware
                          .reduce((sum, h) => sum + (Number(h.price) || 0), 0)
                          .toLocaleString()}
                        )
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Select stock from dropdown to assign
                  </span>
                )}
              </div>

              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={assignLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignSubmit}
                  disabled={assignLoading || selectedHardware.length === 0}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  {assignLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Assigning ({selectedHardware.length})...
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-xs" />
                      Assign Selected Stock ({selectedHardware.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAssignedHardware;