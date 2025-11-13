import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getPendingPayments } from "../../service/payment"; // ✅ New service call

export default function PendingPaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // ✅ Fetch pending payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getPendingPayments();
      setPayments(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch pending payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading pending payments...</p>;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Payment List
        </h2>
        <span className="text-sm text-gray-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, payments.length)} of{" "}
          {payments.length}
        </span>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-yellow-50 text-gray-700 border-b">
            <tr>
              <th className="px-3 py-2 border text-center">S.NO</th>
              <th className="px-3 py-2 border text-center">USER / LINK ID</th>
              <th className="px-3 py-2 border text-center">INVOICE NO</th>
              <th className="px-3 py-2 border text-center">TOTAL</th>
              <th className="px-3 py-2 border text-center">DUE</th>
              <th className="px-3 py-2 border text-center">MODE</th>
              <th className="px-3 py-2 border text-center">PAYMENT DATE</th>
              <th className="px-3 py-2 border text-center">RECHARGE DATE</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((item, index) => {
                const user = item.userId?.generalInformation || {};
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {/* S.NO */}
                    <td className="border px-3 py-2 text-center font-medium">
                      {startIndex + index + 1}
                    </td>

                    {/* ✅ USER / LINK ID */}
                    <td className="border px-3 py-2 text-center">
                      <div className="font-semibold text-blue-700">
                        {user.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {user.name || "N/A"}
                      </div>
                    </td>

                    {/* INVOICE NO */}
                    <td className="border px-3 py-2 text-center text-blue-600">
                      {item.ReceiptNo || "—"}
                    </td>

                    {/* TOTAL */}
                    <td className="border px-3 py-2 text-center">
                      ₹{item.totalAmount || 0}
                    </td>

                    {/* DUE */}
                    <td className="border px-3 py-2 text-center text-red-600 font-semibold">
                      ₹{item.dueAmount || 0}
                    </td>

                    {/* MODE */}
                    <td className="border px-3 py-2 text-center">
                      {item.paymentMode || "Online"}
                    </td>

                    {/* PAYMENT DATE */}
                    <td className="border px-3 py-2 text-center">
                      {new Date(item.PaymentDate).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(item.PaymentDate).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* RECHARGE DATE */}
                    <td className="border px-3 py-2 text-center">
                      {new Date(item.PaymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No pending payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {payments.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
