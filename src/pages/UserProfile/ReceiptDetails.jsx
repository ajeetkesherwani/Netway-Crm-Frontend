import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaFileInvoiceDollar } from "react-icons/fa";

// Service function (we'll create it next)
import { getPaymentReceiptDetails } from "../../service/payment";

const ReceiptDetails = () => {
  const { userId, receiptId } = useParams();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!userId || !receiptId) {
        setError("Invalid receipt or user ID");
        setLoading(false);
        return;
      }

      try {
        const res = await getPaymentReceiptDetails(userId, receiptId);
        if (res.status === true) {
          setReceipt(res.data);
        } else {
          throw new Error(res.message || "Failed to load receipt");
        }
      } catch (err) {
        console.error("Receipt fetch error:", err);
        setError(err.message || "Something went wrong");
        toast.error(err.message || "Failed to load receipt details");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [userId, receiptId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading receipt details...</div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Receipt not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <FaArrowLeft className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFileInvoiceDollar className="text-blue-600" />
              Payment Receipt
            </h1>
          </div>
          <span className="text-sm text-gray-500">Receipt No: {receipt.ReceiptNo}</span>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Top Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Receipt #{receipt.ReceiptNo}</h2>
                <p className="mt-1 opacity-90">{formatDate(receipt.PaymentDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Status</p>
                <span
                  className={`inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    receipt.paymentStatus
                  )}`}
                >
                  {receipt.paymentStatus || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Payment Information
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Total Amount</dt>
                    <dd className="font-semibold text-gray-900">
                      ₹{receipt.totalAmount?.toLocaleString() || "0"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Amount Paid</dt>
                    <dd className="font-semibold text-green-700">
                      ₹{receipt.amountToBePaid?.toLocaleString() || "0"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Due Amount</dt>
                    <dd className={`font-semibold ${receipt.dueAmount < 0 ? "text-green-600" : "text-red-600"}`}>
                      ₹{receipt.dueAmount?.toLocaleString() || "0"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Transaction Details
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Payment Mode</dt>
                    <dd className="font-medium">{receipt.PaymentMode || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Transaction/Cheque No</dt>
                    <dd className="font-medium">{receipt.transactionNo || "—"}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Additional Information
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-gray-600">Comment</dt>
                    <dd className="mt-1 text-gray-800">{receipt.comment || "No comment provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Created At</dt>
                    <dd className="text-gray-800">{formatDate(receipt.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Last Updated</dt>
                    <dd className="text-gray-800">{formatDate(receipt.updatedAt)}</dd>
                  </div>
                </dl>
              </div>

              {receipt.paymentProof && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Proof</h3>
                  <a
                    href={receipt.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Uploaded Proof
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 border-t text-center text-sm text-gray-500">
            Receipt ID: {receipt._id} • Generated on {formatDate(new Date())}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;