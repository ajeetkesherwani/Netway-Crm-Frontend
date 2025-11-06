import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLcoWalletDetails } from "../../../service/lco";

export default function LcoWalletView() {
  const { id, transactionId } = useParams(); // LCO member ID and transaction ID
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await getLcoWalletDetails(id, transactionId);
        setTransaction(res.data?.history || res);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, transactionId]);

  if (loading) return <p className="p-4">Loading transaction details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!transaction) return <p className="p-4">Transaction not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">LCO Wallet Transaction Details</h2>
        <button
          onClick={() => navigate(`/lco/list/${id}`)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Transaction ID</label>
          <p className="border p-2 rounded bg-gray-100">{transaction._id}</p>
        </div>
        <div>
          <label className="block font-medium">Reseller</label>
          <p className="border p-2 rounded bg-gray-100">{transaction.reseller.resellerName}</p>
        </div>
        <div>
          <label className="block font-medium">Amount</label>
          <p className="border p-2 rounded bg-gray-100">{transaction.amount}</p>
        </div>
        <div>
          <label className="block font-medium">Transfer Date</label>
          <p className="border p-2 rounded bg-gray-100">{new Date(transaction.transferDate).toLocaleString()}</p>
        </div>
        <div>
          <label className="block font-medium">Remark</label>
          <p className="border p-2 rounded bg-gray-100">{transaction.remark}</p>
        </div>
        <div>
          <label className="block font-medium">Created By</label>
          <p className="border p-2 rounded bg-gray-100">{transaction.createdBy}</p>
        </div>
        <div>
          <label className="block font-medium">Created By ID</label>
          <p className="border p-2 rounded bg-gray-100">{transaction.createdById}</p>
        </div>
        <div>
          <label className="block font-medium">Created At</label>
          <p className="border p-2 rounded bg-gray-100">{new Date(transaction.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <label className="block font-medium">Updated At</label>
          <p className="border p-2 rounded bg-gray-100">{new Date(transaction.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}