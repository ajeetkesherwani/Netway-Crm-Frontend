import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentReport } from "../../../service/revenueReport";

export default function PaymentReport() {
  const navigate = useNavigate();
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
      const res = await getPaymentReport(p, limit, search);
      // API shape: { status:true, message, data: { total, page, limit, data: [ ... ] } }
      const payload = res?.data ?? res;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : payload?.docs ?? payload?.rows ?? payload?.items ?? [];
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

  const formatDateTime = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payment Report</h1>
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
          placeholder="Search by receipt/user/txn..."
          className="border p-2 rounded w-full max-w-lg"
        />

        <button onClick={() => load(1)} className="px-3 py-2 bg-blue-600 text-white rounded">
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
                  <th className="p-2 text-left">Receipt No</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Paid</th>
                  <th className="p-2 text-left">Due</th>
                  <th className="p-2 text-left">Mode</th>
                  <th className="p-2 text-left">Transaction No</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const user =
                    it.userId?.generalInformation?.name ||
                    it.userId?.generalInformation?.username ||
                    it.userId?.username ||
                    it.userId?.customerName ||
                    it.userId?.email ||
                    (it.userId?._id ? it.userId._id : "-");
                  return (
                    <tr key={it._id || it.id || idx} className="hover:bg-gray-50">
                      <td className="p-2">{(page - 1) * limit + idx + 1}</td>
                      <td className="p-2">{it.ReceiptNo ?? "-"}</td>
                      <td className="p-2">{user}</td>
                      <td className="p-2">{it.totalAmount != null ? it.totalAmount : "-"}</td>
                      <td className="p-2">{it.amountToBePaid != null ? it.amountToBePaid : "-"}</td>
                      <td className="p-2">{it.dueAmount != null ? it.dueAmount : "-"}</td>
                      <td className="p-2">{it.PaymentMode ?? "-"}</td>
                      <td className="p-2">{it.transactionNo ?? "-"}</td>
                      <td className="p-2">{it.paymentStatus ?? "-"}</td>
                      <td className="p-2">{formatDateTime(it.PaymentDate ?? it.createdAt)}</td>
                    </tr>
                  );
                })}
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