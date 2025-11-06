import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import { getHardwareById, updateHardware } from "../../service/hardware";

export default function HardwareUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hardwareName: "",
    hardwareType: "",
    brand: "",
    model: "",
    serialNumber: "",
    ipAddress: "",
    macAddress: "",
    portCount: "",
    cableLength: "",
    location: "",
    purchaseDate: "",
    warrantyExpiry: "",
    price: "",
    notes: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true); // fetch loading
  const [saving, setSaving] = useState(false); // submit loading
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getHardwareById(id);
        const data = res?.data ?? res ?? null;
        if (!data) throw new Error("No hardware data returned");
        // normalize to form fields
        setForm({
          hardwareName: data.hardwareName ?? data.name ?? "",
          hardwareType: data.hardwareType ?? data.type ?? "",
          brand: data.brand ?? "",
          model: data.model ?? "",
          serialNumber: data.serialNumber ?? data.serialNo ?? data.serial ?? "",
          ipAddress: data.ipAddress ?? "",
          macAddress: data.macAddress ?? "",
          portCount: data.portCount ?? "",
          cableLength: data.cableLength ?? "",
          location: data.location ?? "",
          purchaseDate: data.purchaseDate ? formatDateForInput(data.purchaseDate) : "",
          warrantyExpiry: data.warrantyExpiry ? formatDateForInput(data.warrantyExpiry) : "",
          price: data.price ?? "",
          notes: data.notes ?? "",
          status: data.status ?? "active",
        });
      } catch (err) {
        setError(err?.message || "Failed to load hardware");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const formatDateForInput = (d) => {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return dt.toISOString().split("T")[0];
    } catch {
      return d;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.hardwareName?.trim()) {
      setError("Hardware name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        hardwareName: form.hardwareName,
        hardwareType: form.hardwareType,
        brand: form.brand,
        model: form.model,
        serialNumber: form.serialNumber,
        ipAddress: form.ipAddress,
        macAddress: form.macAddress,
        portCount: form.portCount ? Number(form.portCount) : undefined,
        cableLength: form.cableLength,
        location: form.location,
        purchaseDate: form.purchaseDate || undefined,
        warrantyExpiry: form.warrantyExpiry || undefined,
        price: form.price ? Number(form.price) : undefined,
        notes: form.notes,
        status: form.status,
      };
      await updateHardware(id, payload);
      navigate("/setting/hardware/list");
    } catch (err) {
      setError(err?.message || "Failed to update hardware");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading hardware...</p>;
  if (error && !saving)
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6  mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Update Hardware</h1>
          <button onClick={() => navigate("/setting/hardware/list")} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
            Back
          </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Hardware Name</label>
            <input name="hardwareName" value={form.hardwareName} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          <div>
            <label className="text-sm block mb-1">Hardware Type</label>
            <input name="hardwareType" value={form.hardwareType} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">Model</label>
            <input name="model" value={form.model} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">Serial Number</label>
            <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">IP Address</label>
            <input name="ipAddress" value={form.ipAddress} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">MAC Address</label>
            <input name="macAddress" value={form.macAddress} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">Port Count</label>
            <input name="portCount" value={form.portCount} onChange={handleChange} type="number" min="0" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Cable Length</label>
            <input name="cableLength" value={form.cableLength} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. 100m" />
          </div>

          <div>
            <label className="text-sm block mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Purchase Date</label>
            <input name="purchaseDate" value={form.purchaseDate} onChange={handleChange} type="date" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Warranty Expiry</label>
            <input name="warrantyExpiry" value={form.warrantyExpiry} onChange={handleChange} type="date" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Price</label>
            <input name="price" value={form.price} onChange={handleChange} type="number" min="0" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="text-sm block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/setting/hardware/list")} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          {/* <ProtectedAction module="hardware" action="edit"> */}
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Updating..." : "Update Hardware"}
            </button>
          {/* </ProtectedAction> */}
        </div>
      </form>
    </div>
  );
}