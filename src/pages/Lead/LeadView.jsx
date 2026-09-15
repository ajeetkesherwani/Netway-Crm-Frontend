import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeadDetails, deleteLead } from "../../service/lead";
import { FaLongArrowAltLeft, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const BASE_FILE_URL = import.meta.env.VITE_FILE_URL || "http://localhost:5004/public/";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${dd}-${mm}-${yyyy} ${hours}:${minutes} ${ampm}`;
}

const stageBadge = (stage) => {
  const map = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-yellow-100 text-yellow-700",
    Qualified: "bg-purple-100 text-purple-700",
    Converted: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-700",
  };
  return `px-3 py-1 rounded-full text-xs font-bold ${map[stage] || "bg-gray-100 text-gray-600"}`;
};

const severityBadge = (sev) => {
  const map = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  };
  return `px-3 py-1 rounded-full text-xs font-bold ${map[sev] || "bg-gray-100 text-gray-600"}`;
};

function Row({ label, value }) {
  return (
    <div className="flex border-b last:border-b-0 text-[13px]">
      <div className="w-1/3 bg-gray-50 px-3 py-2 font-semibold text-gray-600">{label}</div>
      <div className="w-2/3 px-3 py-2 text-gray-800">{value || "—"}</div>
    </div>
  );
}

export default function LeadView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState(null);

  useEffect(() => {
    getLeadDetails(id)
      .then((res) => setLead(res.data))
      .catch(() => toast.error("Failed to load lead details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
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
        navigate("/sales/lead/manage");
      } catch (err) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      setDownloadingFile(filename);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Download failed");
    } finally {
      setDownloadingFile(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;
  if (!lead) return <div className="p-10 text-center text-red-500">Lead not found.</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <FaLongArrowAltLeft /> Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Lead Details</h1>
            <p className="text-xs text-gray-500 font-mono">{lead.leadNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={severityBadge(lead.severity)}>{lead.severity}</span>
          <ProtectedAction module="lead" action="Edit">
            <button
              onClick={() => navigate(`/sales/lead/edit/${lead._id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
            >
              <FaEdit size={13} /> Edit
            </button>
          </ProtectedAction>
          <ProtectedAction module="lead" action="Delete">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              <FaTrash size={13} /> Delete
            </button>
          </ProtectedAction>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Contact Info ─────────────────────────────────────────────── */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5">
            <h2 className="text-white font-semibold text-sm">Contact Information</h2>
          </div>
          <Row label="Contact Name" value={lead.contactName} />
          <Row label="Mobile" value={lead.contactNumber} />
          <Row label="Email" value={lead.email} />
          <Row label="Company" value={lead.company} />
          <Row label="Service Required" value={lead.serviceRequired} />
        </div>

        {/* ── Address ──────────────────────────────────────────────────── */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5">
            <h2 className="text-white font-semibold text-sm">Address</h2>
          </div>
          <Row label="State" value={lead.state} />
          <Row label="District" value={lead.district} />
          <Row label="Area" value={lead.area?.zoneName || lead.area} />
          <Row label="Zone" value={lead.zone?.name || lead.zone?.subZoneName || lead.zone} />
          <Row label="Full Address" value={lead.address} />
        </div>

        {/* ── Lead Details ─────────────────────────────────────────────── */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5">
            <h2 className="text-white font-semibold text-sm">Lead Details</h2>
          </div>
          <Row label="Severity" value={<span className={severityBadge(lead.severity)}>{lead.severity}</span>} />
          <Row label="Category" value={lead.category} />
          <Row label="Call Source" value={lead.callSource} />
          <Row label="Assigned To" value={lead.assignedTo || "Unassigned"} />
          <Row label="Description" value={lead.description} />
        </div>

        {/* ── Timestamps ───────────────────────────────────────────────── */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5">
            <h2 className="text-white font-semibold text-sm">Audit Info</h2>
          </div>
          <Row label="Lead Number" value={lead.leadNumber} />
          <Row label="Created On" value={formatDate(lead.createdAt)} />
          <Row label="Last Updated" value={formatDate(lead.updatedAt)} />
        </div>
      </div>

      {/* ── Documents ────────────────────────────────────────────────────── */}
      {lead.documents && lead.documents.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden mt-5">
          <div className="bg-blue-600 px-4 py-2.5">
            <h2 className="text-white font-semibold text-sm">Documents</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lead.documents.map((doc, di) => {
              if (!doc.files || doc.files.length === 0) return null;
              return (
                <div key={di} className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                    {doc.documentType}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doc.files.map((filePath, fi) => {
                      const cleanPath = filePath.replace(/\\/g, "/");
                      const fullUrl = `${BASE_FILE_URL}${cleanPath.replace(/^public\//i, "")}`;
                      const fileName = cleanPath.split("/").pop() || `${doc.documentType}-${fi + 1}`;
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                      return (
                        <div key={fi} className="flex items-center gap-2 bg-white border rounded p-1.5">
                          {isImage ? (
                            <img
                              src={fullUrl}
                              alt={doc.documentType}
                              className="w-12 h-12 object-cover rounded cursor-pointer border hover:scale-105 transition-transform"
                              onClick={() => window.open(fullUrl, "_blank")}
                              onError={(e) => { e.target.src = "https://via.placeholder.com/48?text=?"; }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-[10px] text-center">
                              File
                            </div>
                          )}
                          <button
                            onClick={() => downloadFile(fullUrl, fileName)}
                            disabled={downloadingFile === fileName}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Download"
                          >
                            <FaDownload size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
