import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { getLeads, deleteLead } from "../../service/lead";
import { usePermission } from "../../context/PermissionContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${dd}-${mm}-${yyyy} ${hours}:${minutes} ${ampm}`;
}

function ActionMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { permissions } = usePermission();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasAnyAction =
    permissions?.lead?.View ||
    permissions?.lead?.Edit ||
    permissions?.lead?.Delete;

  if (!hasAnyAction) return null;

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
      >
        <FaEllipsisV size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[130px]">
          {permissions?.lead?.View && (
            <button
              onClick={() => { setOpen(false); onView(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaEye size={12} className="text-blue-500" /> View
            </button>
          )}
          {permissions?.lead?.Edit && (
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaEdit size={12} className="text-yellow-500" /> Edit
            </button>
          )}
          {permissions?.lead?.Delete && (
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <FaTrash size={12} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConvertedLead() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit, stage: "Converted" };
      if (name) params.name = name;
      if (mobile) params.mobile = mobile;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      const res = await getLeads(params);
      setLeads(res.data?.leads || []);
      setTotalCount(res.data?.totalCount || 0);
    } catch (err) {
      toast.error("Failed to fetch converted leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchLeads(1);
    }, 400);
    return () => clearTimeout(t);
  }, [name, mobile, fromDate, toDate]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Lead?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteLead(id);
        toast.success("Lead deleted");
        fetchLeads(currentPage);
      } catch (err) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Converted Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Showing leads with stage:{" "}
            <span className="font-semibold text-green-600">Converted</span> &nbsp;·&nbsp;
            Total: <strong>{totalCount}</strong>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSearch size={11} />
              </span>
              <input
                type="text"
                placeholder="Search name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile</label>
            <input
              type="text"
              placeholder="Search mobile..."
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {(name || mobile || fromDate || toDate) && (
          <button
            onClick={() => { setName(""); setMobile(""); setFromDate(""); setToDate(""); }}
            className="mt-3 text-xs text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm flex-1 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No converted leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-green-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Lead No.</th>
                  <th className="py-3 px-4 border-b">Contact</th>
                  <th className="py-3 px-4 border-b">Mobile</th>
                  <th className="py-3 px-4 border-b">Assigned To</th>
                  <th className="py-3 px-4 border-b">Source</th>
                  <th className="py-3 px-4 border-b">Area</th>
                  <th className="py-3 px-4 border-b">Severity</th>
                  <th className="py-3 px-4 border-b">Converted On</th>
                  <th className="py-3 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2.5 px-4 text-gray-500">
                      {(currentPage - 1) * limit + idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-green-700 font-semibold">
                      {lead.leadNumber}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-gray-800">
                      <div>{lead.contactName}</div>
                      {lead.company && (
                        <div className="text-xs text-gray-400">{lead.company}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600">{lead.contactNumber}</td>
                    <td className="py-2.5 px-4 text-gray-600">
                      {lead.assignedTo || <span className="text-gray-400 italic text-xs">Unassigned</span>}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600">{lead.callSource}</td>
                    <td className="py-2.5 px-4 text-gray-600">{lead.area || "-"}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        lead.severity === "Critical" ? "bg-red-100 text-red-700" :
                        lead.severity === "High" ? "bg-orange-100 text-orange-700" :
                        lead.severity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {lead.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-500 text-xs">
                      {formatDate(lead.updatedAt)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <ActionMenu
                        onView={() => navigate(`/sales/lead/view/${lead._id}`)}
                        onEdit={() => navigate(`/sales/lead/edit/${lead._id}`)}
                        onDelete={() => handleDelete(lead._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); fetchLeads(currentPage - 1); }}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); fetchLeads(currentPage + 1); }}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
