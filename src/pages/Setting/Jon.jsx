
import { useState, useEffect } from "react";
import { createZone } from "../../service/apiClient";

export default function CreateZoneForm() {
  const [zoneName, setZoneName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!zoneName.trim()) {
      setError("⚠️ Zone name is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await createZone({ zoneName: zoneName.trim() }, token);

      if (res?.status) {
        setMessage(res.message || "✅ Zone created successfully!");
        setZoneName("");
      } else {
        setError(res?.message || "❌ Failed to create zone");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
         Create New Zone
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Zone Name
          </label>
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter zone name (e.g., North Delhi Zone)"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold shadow-md disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "⏳ Creating..." : "➕ Create Zone"}
        </button>
      </form>

      {/* ✅ Popup for success/error */}
      {(message || error) && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            message
              ? "bg-green-600 animate-fade-in-out"
              : "bg-red-600 animate-fade-in-out"
          }`}
        >
          {message || error}
        </div>
      )}
    </div>
  );
}
