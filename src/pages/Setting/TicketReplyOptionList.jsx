// src/pages/Setting/TicketReplyOptionList.jsx

import React, { useEffect, useState } from "react";
import {
  getTicketReplyOptions,
  deleteTicketReplyOption,
} from "../../service/ticketReplyOption";
import { FaEye, FaTrash, FaEllipsisV, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function TicketReplyOptionList() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  const fetchOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTicketReplyOptions();
      if (res?.status || res?.success) {
        setOptions(res.data || []);
      } else {
        throw new Error(res?.message || "Failed to load options");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load ticket reply options");
      toast.error("Failed to load options");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (id) => {
    navigate(`/setting/ticketReplyOption/view/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id, text) => {
    if (!window.confirm(`Delete "${text}" permanently?`)) {
      setOpenMenuId(null);
      return;
    }

    try {
      const res = await deleteTicketReplyOption(id);
      if (res?.status || res?.success) {
        setOptions((prev) => prev.filter((opt) => opt._id !== id));
        toast.success("Reply option deleted");
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
    setOpenMenuId(null);
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  const exportToExcel = () => {
    if (options.length === 0) {
      toast.error("No data to export");
      return;
    }
    const data = options.map((opt, i) => ({
      "S.No": i + 1,
      "Reply Option Text": opt.optionText,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reply Options");
    XLSX.writeFile(wb, "ticket_reply_options.xlsx");
    toast.success("Exported successfully!");
  };

  const displayedOptions = options.filter((opt) =>
    opt.optionText.toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-gray-600">Loading reply options...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Title in Two Lines */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Ticket Reply Options
            
          </h1>
        </div>

        {/* Search + Buttons - Always Horizontal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search reply options..."
              className="px-4 py-2 text-sm outline-none min-w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
            >
              Download as Excel
            </button>

            <ProtectedAction module="setting" action="ticketReplyCreate">
              <button
                onClick={() => navigate("/setting/ticketReplyOption/create")}
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
          <button onClick={() => setError("")} className="font-bold text-xl">×</button>
        </div>
      )}

      {/* Table */}
      {displayedOptions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching options found." : "No reply options available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">S.No</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Reply Option Text</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedOptions.map((opt, index) => (
                  <tr key={opt._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td
                      className="px-6 py-4 font-medium text-gray-600 hover:underline cursor-pointer"
                      onClick={() => handleView(opt._id)}
                    >
                      {opt.optionText}
                    </td>
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

                          <ProtectedAction module="setting" action="ticketReplyRemove">
                            <button
                              onClick={() => handleDelete(opt._id, opt.optionText)}
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

      {/* Optional: Mobile Card View with 3-dot menu */}
      <div className="md:hidden space-y-4 mt-6">
        {displayedOptions.map((opt, index) => (
          <div key={opt._id} className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <p className="font-medium text-lg mt-1">{opt.optionText}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(opt._id);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaEllipsisV className="text-gray-600" />
              </button>
            </div>

            {openMenuId === opt._id && (
              <div className="mt-4 border-t pt-4">
                <button
                  onClick={() => handleView(opt._id)}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaEye /> View
                </button>
                <ProtectedAction module="setting" action="ticketReplyRemove">
                  <button
                    onClick={() => handleDelete(opt._id, opt.optionText)}
                    className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </ProtectedAction>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}