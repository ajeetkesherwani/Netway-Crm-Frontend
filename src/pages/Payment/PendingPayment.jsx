import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import PaymentFilter from "./PaymentFilter";
import { getFilteredPayments } from "../../service/payment";
import * as XLSX from "xlsx";

export default function PendingPaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  const itemsPerPage = 15;

  const fetchPayments = useCallback(async (params) => {
    setLoading(true);
    try {
      // Always force paymentStatus=Pending, no matter what user tries
      const finalParams = new URLSearchParams(params);
      finalParams.set("paymentStatus", "Pending");

      const res = await getFilteredPayments(finalParams.toString());
      const data = res.data || [];
      const count = res.total || data.length;

      setPayments(data);
      setTotal(count);
      setCurrentPage(1);
    } catch (err) {
      toast.error(err.message || "Failed to fetch pending payments");
      setPayments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // On first load: set default to Pending
  useEffect(() => {
    if (searchParams.toString() === "") {
      const defaultParams = new URLSearchParams();
      defaultParams.set("paymentStatus", "Pending");
      setSearchParams(defaultParams);
    }
  }, []);

  // Re-fetch whenever searchParams change (from filter)
  useEffect(() => {
    fetchPayments(searchParams);
  }, [searchParams, fetchPayments]);

  // Pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Excel Download - Only Pending
  const handleDownloadExcel = () => {
    if (payments.length === 0) {
      toast.info("No data to export");
      return;
    }

    const exportData = payments.map((item, index) => {
      const user = item.userId?.generalInformation || {};
      return {
        "S.No": index + 1,
        "Username": user.username || "—",
        "Name": user.name || "N/A",
        "Invoice No": item.ReceiptNo || "—",
        "Total Amount": item.totalAmount || 0,
        "Due Amount": item.dueAmount || 0,
        "Payment Mode": item.paymentMode || "Online",
        "Payment Date": new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN"),
        "Payment Time": new Date(item.createdAt || item.PaymentDate).toLocaleTimeString("en-IN"),
        // "Recharge Date": new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN"),
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pending Payments");

    ws["!cols"] = [
      { wch: 8 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 },
    ];

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Pending_Payments_${today}.xlsx`);

    toast.success("Excel downloaded successfully!");
  };

  if (loading && payments.length === 0) {
    return <p className="p-6 text-gray-600">Loading pending payments...</p>;
  }

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Advanced Filter Panel - Works only on Pending payments */}
      <PaymentFilter setSearchParams={setSearchParams} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Payment List
        </h2>

        <button
          onClick={handleDownloadExcel}
          disabled={loading || payments.length === 0}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Excel
        </button>
      </div>

      {/* Count Info */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {payments.length > 0 ? startIndex + 1 : 0}–
        {Math.min(startIndex + itemsPerPage, payments.length)} of {total} pending payments
      </div>

      {/* Table - Yellow Theme */}
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
              {/* <th className="px-3 py-2 border text-center">RECHARGE DATE</th> */}
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((item, index) => {
                const user = item.userId?.generalInformation || {};
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-center font-medium">
                      {startIndex + index + 1}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      <div className="font-semibold text-blue-700">
                        {user.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {user.name || "N/A"}
                      </div>
                    </td>

                    <td className="border px-3 py-2 text-center text-blue-600">
                      {item.ReceiptNo || "—"}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      ₹{item.totalAmount || 0}
                    </td>

                    <td className="border px-3 py-2 text-center text-red-600 font-semibold">
                      ₹{item.dueAmount || 0}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {item.paymentMode || "Online"}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN")}{" "}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt || item.PaymentDate).toLocaleTimeString("en-IN")}
                      </span>
                    </td>
{/* 
                    <td className="border px-3 py-2 text-center">
                      {new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN")}
                    </td> */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No pending payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Yellow Buttons */}
      {total > itemsPerPage && (
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