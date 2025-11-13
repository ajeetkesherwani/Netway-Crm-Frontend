import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getTicketReplyOptions,
  updateTicketReplyOption,
} from "../../service/ticketReplyOption";

export default function TicketReplyOptionUpdate() {
  const navigate = useNavigate();
  const { id } = useParams(); // e.g. /setting/ticketReplyOption/update/:id
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    optionText: "",
  });

  // ✅ Fetch the current reply option by ID
  useEffect(() => {
    const fetchOption = async () => {
      setLoading(true);
      try {
        const res = await getTicketReplyOptions(); // Get all options
        if (res.status && res.data) {
          const found = res.data.find((opt) => opt._id === id);
          if (found) {
            setFormData({ optionText: found.optionText });
          } else {
            toast.error("Option not found ❌");
            navigate("/setting/ticketReplyOption/list");
          }
        } else {
          toast.error(res.message || "Failed to load option ❌");
        }
      } catch (err) {
        toast.error(err.message || "Network error ❌");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOption();
  }, [id, navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.optionText.trim()) {
      toast.error("Option text is required ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await updateTicketReplyOption(id, {
        optionText: formData.optionText.trim(),
      });

      if (res.status || res.success) {
        toast.success("Ticket Reply Option updated successfully ✅");
        navigate("/setting/ticketReplyOption/list");
      } else {
        toast.error(res.message || "Failed to update option ❌");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear form
  const handleClear = () => {
    setFormData({ optionText: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Ticket Reply Option</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium">Option Text</label>
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
            {loading ? "Updating..." : "Update"}
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
