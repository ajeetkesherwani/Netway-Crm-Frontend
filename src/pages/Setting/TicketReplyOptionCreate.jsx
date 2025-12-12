import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicketReplyOption } from "../../service/ticketReplyOption";

export default function TicketReplyOptionCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    optionText: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.optionText.trim()) {
      toast.error("Option text is required ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await createTicketReplyOption(formData);
      if (res.status || res.success) {
        toast.success("Ticket Reply Option created successfully ✅");
        navigate("/setting/ticketReplyOption/list");
      } else {
        toast.error(res.message || "Failed to create Ticket Reply Option ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ optionText: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Ticket Reply Option</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium">Option Text
            <span className="text-black-900 ml-1">*</span>
          </label>
          <input
            type="text"
            name="optionText"
            value={formData.optionText}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter reply option text"
            required
          />
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/setting/ticketReplyOption/list")}
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
