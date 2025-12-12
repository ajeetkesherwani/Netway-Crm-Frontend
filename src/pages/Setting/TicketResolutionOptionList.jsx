import React, { useEffect, useState } from "react";
import {
  getTicketResolutionOptions,
  deleteTicketResolutionOption,
} from "../../service/ticketResolutionOption";
import { FaEye, FaTrash, FaEllipsisV, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function TicketResolutionOptionList() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOption, setConfirmOption] = useState(null);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await getTicketResolutionOptions();
      if (res.status) setOptions(res.data || []);
      else setError(res.message || "Failed to load options");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOptions(); }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const handleView = (id) => {
    navigate(`/setting/resolution/view/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = (id, name) => {
    setConfirmOption({ id, name });
    setConfirmOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!confirmOption) return;
    try {
      const res = await deleteTicketResolutionOption(confirmOption.id);
      if (res?.status || res?.success) {
        toast.success("Option deleted successfully");
        await fetchOptions();
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setConfirmOpen(false);
      setConfirmOption(null);
    }
  };

  const handleSearch = () => setAppliedSearch(searchTerm.trim().toLowerCase());

  const exportToExcel = () => {
    if (options.length === 0) {
      toast.error("No data to export");
      return;
    }
    const data = options.map((opt, i) => ({
      "S.No": i + 1,
      "Option Text": opt.name,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resolution Options");
    XLSX.writeFile(wb, "ticket_resolution_options.xlsx");
    toast.success("Exported successfully!");
  };

  const displayedOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Title in TWO LINES + Buttons in ONE LINE */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        {/* Title in Two Lines */}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Ticket Resolution Option List
           
            
          </h1>
        </div>

        {/* Search + Buttons - Always Horizontal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search options..."
              className="px-4 py-2 text-sm outline-none min-w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>

          {/* Action Buttons - Horizontal */}
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Download as Excel
            </button>

            <ProtectedAction module="setting" action="ticketResolutionCreate">
              <button
                onClick={() => navigate("/setting/resolution/create")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
              >
                Add Option
              </button>
            </ProtectedAction>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-xl">×</button>
        </div>
      )}

      {/* Table */}
      {displayedOptions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching options found." : "No resolution options available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">S.No</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Option Text</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedOptions.map((opt, index) => (
                  <tr key={opt._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{opt.name}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(opt._id);
                        }}
                        className="p-2.5 hover:bg-gray-200 rounded-full transition"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>

                      {openMenuId === opt._id && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleView(opt._id)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                          >
                            <FaEye className="text-blue-600" /> View
                          </button>
                          <ProtectedAction module="setting" action="ticketResolutionRemove">
                            <button
                              onClick={() => handleDelete(opt._id, opt.name)}
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
      )}

      {/* Delete Modal */}
      {confirmOpen && confirmOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Delete "<strong>{confirmOption.name}</strong>" permanently?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
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