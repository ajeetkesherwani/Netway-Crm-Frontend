import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSubzone, getZones } from "../../service/apiClient";

export default function SubZoneCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [zoneLoading, setZoneLoading] = useState(true);

  const [formData, setFormData] = useState({
    zoneId: "",
    name: "",
  });

  /* ───────── FETCH ZONES ───────── */
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await getZones();
        // adjust according to your API response structure
        setZones(res?.data || res || []);
      } catch (err) {
        toast.error(err.message || "Failed to load zones");
      } finally {
        setZoneLoading(false);
      }
    };

    fetchZones();
  }, []);

  /* ───────── HANDLE CHANGE ───────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ───────── SUBMIT ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.zoneId) {
      toast.error("Please select a zone");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("SubZone name is required");
      return;
    }

    setLoading(true);
    try {
      await createSubzone({
        zoneId: formData.zoneId,
        name: formData.name,
      });

      toast.success("SubZone created successfully ✅");
      navigate("/setting/subZone/list");
    } catch (err) {
      toast.error(err.message || "Failed to create subzone ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ───────── CLEAR ───────── */
  const handleClear = () => {
    setFormData({
      zoneId: "",
      name: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create SubZone</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Zone Dropdown */}
        <div>
          <label className="block font-medium">
            Zone <span className="text-black-900 ml-1">*</span>
          </label>
          <select
            name="zoneId"
            value={formData.zoneId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            disabled={zoneLoading}
            required
          >
            <option value="">Select Zone</option>
            {zones.map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.zoneName}
              </option>
            ))}
          </select>
        </div>

        {/* SubZone Name */}
        <div>
          <label className="block font-medium">
            SubZone Name <span className="text-black-900 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter subzone name"
            required
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/setting/subZone/list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Add"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
