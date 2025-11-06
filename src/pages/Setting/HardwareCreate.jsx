import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import { createHardware } from "../../service/hardware";

export default function HardwareCreate() {
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.hardwareName.trim()) {
            setError("Hardware name is required");
            return;
        }
        setLoading(true);
        try {
            // normalize numeric fields
            const payload = {
                ...form,
                portCount: form.portCount ? Number(form.portCount) : undefined,
                price: form.price ? Number(form.price) : undefined,
            };
            await createHardware(payload);
            navigate("/setting/hardware/list");
        } catch (err) {
            setError(err?.message || "Failed to create hardware");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6  mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Add Hardware</h1>
                <button
                    onClick={() => navigate("/setting/hardware/list")}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Back to list"
                >
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
                    {/* <div>
            <label className="text-sm block mb-1">Hardware Type</label>
            <input name="hardwareType" value={form.hardwareType} onChange={handleChange} className="w-full border p-2 rounded" />
          </div> */}
                    <div>
                        <label className="text-sm block mb-1">Hardware Type</label>
                        <select
                            name="hardwareType"
                            value={form.hardwareType}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Hardware</option>
                            <option value="router">Router</option>
                            <option value="cable">Cable</option>
                            <option value="switch">Switch</option>
                        </select>
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
                        <input name="purchaseDate" value={form.purchaseDate} onChange={handleChange} type="datetime-local" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="text-sm block mb-1">Warranty Expiry</label>
                        <input name="warrantyExpiry" value={form.warrantyExpiry} onChange={handleChange} type="datetime-local" className="w-full border p-2 rounded" />
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
                    <button type="button" onClick={() => navigate("/setting/hardware/list")} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
                    {/* <ProtectedAction module="hardware" action="create"> */}
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                        {loading ? "Saving..." : "Add Hardware"}
                    </button>
                    {/* </ProtectedAction> */}
                </div>
            </form>
        </div>
    );
}