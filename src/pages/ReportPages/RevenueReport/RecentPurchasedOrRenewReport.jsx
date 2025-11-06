import React, { useEffect, useState } from "react";
import { getRecentPurchasedOrRenewReport } from "../../../service/revenueReport";

export default function RecentPurchasedOrRenewReport() {
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
      const res = await getRecentPurchasedOrRenewReport(p, limit, search);
      // response shape: { status, message, data: { total, page, limit, data: [ ... ] } }
      const payload = res?.data ?? res;
      const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setItems(list);
      const total = payload?.total ?? 0;
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
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Recent Purchased / Renew Report</h1>
      </div>
      <div className="mb-4 flex gap-2 items-center">
         <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Back"
        >
          Back
        </button>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username/customer/phone/email/plan..."
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
            <table className="min-w-full border divide-y text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Username</th>
                  <th className="p-2 text-left">Customer Name</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Plan</th>
                  <th className="p-2 text-left">Plan Amount</th>
                  <th className="p-2 text-left">Tax</th>
                  <th className="p-2 text-left">Total Amount</th>
                  <th className="p-2 text-left">Reseller</th>
                  <th className="p-2 text-left">LCO</th>
                  <th className="p-2 text-left">Registration Date</th>
                  <th className="p-2 text-left">Renewal Date</th>
                  <th className="p-2 text-left">Address</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id || it._id || idx} className="hover:bg-gray-50">
                    <td className="p-2">{(page - 1) * limit + idx + 1}</td>
                    <td className="p-2">{it.username ?? "-"}</td>
                    <td className="p-2">{it.customerName ?? "-"}</td>
                    <td className="p-2">{it.phone ?? "-"}</td>
                    <td className="p-2">{it.email ?? "-"}</td>
                    <td className="p-2">{it.plan ?? it.planName ?? "-"}</td>
                    <td className="p-2">{it.planAmount ?? "-"}</td>
                    <td className="p-2">{it.tax ?? "-"}</td>
                    <td className="p-2">{it.totalAmount ?? "-"}</td>
                    <td className="p-2">{it.reseller ?? "-"}</td>
                    <td className="p-2">{it.lco ?? "-"}</td>
                    <td className="p-2">{formatDate(it.registrationDate)}</td>
                    <td className="p-2">{formatDate(it.renewalDate)}</td>
                    <td className="p-2">{it.address ?? "-"}</td>
                    <td className="p-2">{it.status ?? "-"}</td>
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