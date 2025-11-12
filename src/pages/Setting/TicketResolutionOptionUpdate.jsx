import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateTicketResolutionOption,
  getTicketResolutionOptions,
} from "../../service/ticketResolutionOption";

export default function TicketResolutionOptionUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
  });

  // ✅ Fetch single option data (from list)
  const fetchOptionData = async () => {
    try {
      const res = await getTicketResolutionOptions();
      if (res.status && Array.isArray(res.data)) {
        const found = res.data.find((item) => item._id === id);
        if (found) {
          setFormData({ name: found.name || found.optionText || "" });
        } else {
          toast.error("Resolution option not found ❌");
          navigate("/setting/resolution/List");
        }
      } else {
        toast.error(res.message || "Failed to fetch option data ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error ❌");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionData();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Option text is required ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await updateTicketResolutionOption(id, {
        name: formData.name.trim(),
      });

      if (res.status || res.success) {
        toast.success("Ticket Resolution Option updated successfully ✅");
        navigate("/setting/resolution/List"); // ✅ redirect to new list path
      } else {
        toast.error(res.message || "Failed to update option ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle clear
  const handleClear = () => {
    setFormData({ name: "" });
  };

  // ✅ Handle back
  const handleBack = () => {
    navigate("/setting/resolution/List");
  };

  if (initialLoading)
    return <p className="p-6 text-gray-600">Loading option details...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        Update Ticket Resolution Option
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Option Name */}
        <div>
          <label className="block font-medium mb-1">Option Text</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter resolution option text"
            required
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            disabled={loading}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
