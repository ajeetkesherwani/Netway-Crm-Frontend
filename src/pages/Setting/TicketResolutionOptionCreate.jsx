import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicketResolutionOption } from "../../service/ticketResolutionOption";

export default function TicketResolutionOptionCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Option text is required ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await createTicketResolutionOption({
        name: formData.name.trim(),
      });

      if (res.status || res.success) {
        toast.success("Ticket Resolution Option created successfully ✅");
        navigate("/setting/resolution/List"); // ✅ redirect after create
      } else {
        toast.error(
          res.message || "Failed to create Ticket Resolution Option ❌"
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle clear form
  const handleClear = () => {
    setFormData({ name: "" });
  };

  // ✅ Handle back navigation
  const handleBack = () => {
    navigate("/setting/resolution/List"); // ✅ go back to list page
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        Create Ticket Resolution Option
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Option Text */}
        <div>
          <label className="block font-medium mb-1">Option Text
            <span className="text-black-900 ml-1">*</span>
          </label>
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
            onClick={handleBack} // ✅ working back button
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
            {loading ? "Saving..." : "Add"}
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
