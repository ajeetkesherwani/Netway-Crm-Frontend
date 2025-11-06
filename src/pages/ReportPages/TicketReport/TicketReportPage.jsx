import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketsReportPage({ fetcher, title }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("customerName");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetcher(p, limit, searchField, searchValue);
      // API shape examples:
      // { status:true, message, data: [ ... ] }  OR { status:true, message, data: { data:[...], total, page, limit } }
      const raw = res?.data ?? res;
      let list = [];
      if (Array.isArray(raw)) list = raw;
      else if (Array.isArray(raw?.data)) list = raw.data;
      else if (Array.isArray(res?.data)) list = res.data;
      else list = raw?.items ?? raw?.docs ?? raw?.result ?? [];

      setItems(list);

      const total = raw?.total ?? raw?.length ?? (Array.isArray(list) ? list.length : 0);
      const lp = raw?.limit ?? limit;
      const tp = total && lp ? Math.max(1, Math.ceil(total / lp)) : 1;
      setTotalPages(tp);
      setPage(p);
    } catch (err) {
      setError(err?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => load(1);

  const formatDesc = (d) => {
    if (!d) return "-";
    if (typeof d === "string") return d;
    if (typeof d === "object") return d.description ?? JSON.stringify(d);
    return String(d);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="mb-4 flex gap-2 items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Back"
        >
          Back
        </button>

        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="customerName">Customer Name</option>
          <option value="username">Username</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="ticketId">Ticket ID</option>
        </select>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search value..."
          className="border p-2 rounded w-full max-w-lg"
        />

        <button onClick={handleSearch} className="px-3 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No records.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Ticket ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Belongs To</th>
                  <th className="p-2 text-left">Assigned To</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created By</th>
                  <th className="p-2 text-left">Last Modified By</th>
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.ticketId ?? it._id ?? idx} className="hover:bg-gray-50">
                    <td className="p-2">{(page - 1) * limit + idx + 1}</td>
                    <td className="p-2">{it.ticketId ?? "-"}</td>
                    <td className="p-2">{it.date ?? "-"}</td>
                    <td className="p-2">{formatDesc(it.description)}</td>
                    <td className="p-2">{it.userName ?? "-"}</td>
                    <td className="p-2">{it.userBelongsTo ?? "-"}</td>
                    <td className="p-2">{it.assignTo ?? "-"}</td>
                    <td className="p-2">{it.status ?? "-"}</td>
                    <td className="p-2">{it.createdByName ?? "-"}</td>
                    <td className="p-2">{it.lastModifiedByName ?? "-"}</td>
                    <td className="p-2">{it.createdAt ?? "-"}</td>
                    <td className="p-2">{it.updatedAt ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="space-x-2">
              <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
              <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}