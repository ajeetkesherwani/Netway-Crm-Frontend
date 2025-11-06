import React, { useEffect, useState } from "react";
import { getNewRegistrationPlanReport } from "../../../service/revenueReport";

export default function NewRegistrationPlanReport() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await getNewRegistrationPlanReport(p, limit, search);
      // API shape (from your sample): { status:true, message, data: { total, page, limit, data: [ ... ] } }
      const payload = res?.data ?? res;
      const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setItems(list);

      const total = payload?.total ?? payload?.totalDocs ?? 0;
      const currentPage = payload?.page ?? p;
      const lp = payload?.limit ?? limit;
      const tp = total && lp ? Math.max(1, Math.ceil(total / lp)) : 1;
      setTotalPages(tp);
      setPage(currentPage);
    } catch (err) {
      setError(err?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => load(1);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">New Registration Plan Report</h1>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username/customer/phone/email..."
          className="border p-2 rounded w-full max-w-lg"
        />
        <button onClick={handleSearch} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No records found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Username</th>
                  <th className="p-2 text-left">Customer Name</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Plan</th>
                  <th className="p-2 text-left">Final Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id || it._id || idx} className="hover:bg-gray-50 text-sm">
                    <td className="p-2">{(page - 1) * limit + idx + 1}</td>
                    <td className="p-2">{it.username ?? "-"}</td>
                    <td className="p-2">{it.customerName ?? "-"}</td>
                    <td className="p-2">{it.phone ?? "-"}</td>
                    <td className="p-2">{it.email ?? "-"}</td>
                    <td className="p-2">{it.planName ?? "-"}</td>
                    <td className="p-2">{it.finalAmount != null ? it.finalAmount : (it.planPrice != null ? it.planPrice : "-")}</td>
                    <td className="p-2">{it.status ?? "-"}</td>
                    <td className="p-2">{it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}</td>
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