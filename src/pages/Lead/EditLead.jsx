import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadDetails, updateLead } from "../../service/lead";
import { getZones, getSubzonesWithZoneId } from "../../service/apiClient";
import { getStaff } from "../../service/staffService";
import { usePermission } from "../../context/PermissionContext";
import Select from "react-select";
import toast from "react-hot-toast";
import { FaLongArrowAltLeft, FaPlus, FaTrash } from "react-icons/fa";

const DOCUMENT_TYPES = [
  "Profile Photo", "Addhar Card", "Pan Card", "Address Proof",
  "GST", "Driving Licence", "Passport", "Signature", "Other",
];
const CALL_SOURCES = ["Phone", "Email", "Web", "Walk-in", "Other", "MobileApp"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = usePermission();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [zones, setZones] = useState([]);

  const [form, setForm] = useState({
    contactName: "", contactNumber: "", email: "", company: "",
    state: "", district: "", address: "", serviceRequired: "",
    callSource: "Phone", severity: "Medium", description: "",
    category: "", area: "", zone: "", assignToId: [],
  });

  const [docRows, setDocRows] = useState([]);

  useEffect(() => {
    Promise.all([
      getLeadDetails(id),
      getStaff().catch(() => ({ data: [] })),
      getZones().catch(() => ({ data: [] })),
    ]).then(([leadRes, staffRes, zoneRes]) => {
      const lead = leadRes.data;
      const staffData = staffRes.data?.map(s => ({ value: s._id, label: s.name })) || [];
      setStaffList(staffData);
      setAreas(zoneRes.data || []);
      
      let initialAssignTo = [];
      if (lead.assignToId) {
        try {
          const parsed = typeof lead.assignToId === 'string' && lead.assignToId.startsWith('[') 
            ? JSON.parse(lead.assignToId) 
            : Array.isArray(lead.assignToId) ? lead.assignToId : [lead.assignToId];
          initialAssignTo = staffData.filter(s => parsed.includes(s.value));
        } catch (e) {
          initialAssignTo = staffData.filter(s => s.value === lead.assignToId);
        }
      }
      setForm({
        contactName: lead.contactName || "",
        contactNumber: lead.contactNumber || "",
        email: lead.email || "",
        company: lead.company || "",
        state: lead.state || "",
        district: lead.district || "",
        address: lead.address || "",
        serviceRequired: lead.serviceRequired || "",
        callSource: lead.callSource || "Phone",
        severity: lead.severity || "Medium",
        description: lead.description || "",
        category: lead.category || "",
        area: lead.area || "",
        zone: lead.zone || "",
        assignToId: initialAssignTo,
      });
      if (lead.documents) {
        setDocRows(lead.documents.map((d) => ({ documentType: d.documentType, files: [], existingFiles: d.files || [] })));
      }
    }).catch(() => toast.error("Failed to load lead"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (form.area) {
      getSubzonesWithZoneId(form.area)
        .then((res) => setZones(res.data || []))
        .catch(() => setZones([]));
    } else {
      setZones([]);
    }
  }, [form.area]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addDocRow = () => setDocRows((prev) => [...prev, { documentType: DOCUMENT_TYPES[0], files: [], existingFiles: [] }]);
  const removeDocRow = (idx) => setDocRows((prev) => prev.filter((_, i) => i !== idx));
  const updateDocType = (idx, value) => setDocRows((prev) => prev.map((row, i) => i === idx ? { ...row, documentType: value } : row));
  const updateDocFiles = (idx, files) => setDocRows((prev) => prev.map((row, i) => i === idx ? { ...row, files: Array.from(files) } : row));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactName || !form.contactNumber) {
      toast.error("Contact Name and Mobile are required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => { 
        if (key === 'assignToId') {
          if (val && val.length > 0) fd.append(key, JSON.stringify(val.map(v => v.value)));
        } else if (val) {
          fd.append(key, val); 
        }
      });

      const documentsJson = docRows.map((row) => ({
        documentType: row.documentType,
        files: row.existingFiles || [],
      }));
      fd.append("documents", JSON.stringify(documentsJson));

      docRows.forEach((row) => {
        row.files.forEach((file) => fd.append(row.documentType, file));
      });

      await updateLead(id, fd);
      toast.success("Lead updated successfully!");
      navigate(`/sales/lead/view/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to update lead");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  if (loading) return <div className="p-10 text-center text-gray-400">Loading lead...</div>;

  if (permissions && permissions.lead && !permissions.lead.Edit) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        You don't have permission to edit leads.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 text-sm">
          <FaLongArrowAltLeft /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Lead</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4 border-b pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Contact Name *</label><input name="contactName" value={form.contactName} onChange={handleChange} className={inputCls} required /></div>
            <div><label className={labelCls}>Mobile Number *</label><input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={inputCls} required /></div>
            <div><label className={labelCls}>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>Company</label><input name="company" value={form.company} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>Service Required</label><input name="serviceRequired" value={form.serviceRequired} onChange={handleChange} className={inputCls} /></div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4 border-b pb-2">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>State</label><input name="state" value={form.state} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>District</label><input name="district" value={form.district} onChange={handleChange} className={inputCls} /></div>
            <div className="lg:col-span-3"><label className={labelCls}>Full Address</label><textarea name="address" value={form.address} onChange={handleChange} rows={2} className={inputCls} /></div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4 border-b pb-2">Lead Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Call Source</label><select name="callSource" value={form.callSource} onChange={handleChange} className={inputCls}>{CALL_SOURCES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className={labelCls}>Severity</label><select name="severity" value={form.severity} onChange={handleChange} className={inputCls}>{SEVERITIES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                <option value="">Select Category</option>
                <option value="New Connection Request">New Connection Request</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Area</label>
              <select name="area" value={form.area} onChange={handleChange} className={inputCls}>
                <option value="">Select Area</option>
                {areas.map((a) => <option key={a._id} value={a._id}>{a.zoneName}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Zone</label>
              <select name="zone" value={form.zone} onChange={handleChange} className={inputCls}>
                <option value="">Select Zone</option>
                {zones.map((z) => <option key={z._id} value={z._id}>{z.name || z.subZoneName}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3"><label className={labelCls}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} /></div>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4 border-b pb-2">Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className={labelCls}>Assign To Staff</label>
              <Select
                isMulti
                options={staffList}
                value={form.assignToId}
                onChange={(selected) => setForm(p => ({ ...p, assignToId: selected || [] }))}
                placeholder="Search and select staff..."
                className="text-sm"
                classNamePrefix="select"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Documents</h2>
            <button type="button" onClick={addDocRow} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
              <FaPlus size={10} /> Add Document
            </button>
          </div>
          {docRows.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">No documents. Click "Add Document" to attach files.</p>
          )}
          <div className="space-y-3">
            {docRows.map((row, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 border rounded-lg p-3">
                <select value={row.documentType} onChange={(e) => updateDocType(idx, e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full md:w-48">
                  {DOCUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {row.existingFiles?.length > 0 && (
                  <span className="text-xs text-gray-500">{row.existingFiles.length} existing file(s)</span>
                )}
                <input type="file" multiple accept="image/*,.pdf" onChange={(e) => updateDocFiles(idx, e.target.files)} className="text-sm text-gray-600 flex-1" />
                {row.files.length > 0 && <span className="text-xs text-green-600 font-medium">+{row.files.length} new</span>}
                <button type="button" onClick={() => removeDocRow(idx)} className="text-red-500 hover:text-red-700 p-1">
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">Cancel</button>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-60">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
