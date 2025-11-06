import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateLcoWalletTransaction, getLcoWalletDetails, getAllResellers } from "../../../service/lco";
import { toast } from "react-toastify";
export default function LcoWalletUpdate() {
  const { id, transactionId } = useParams(); // LCO member ID and transaction ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resellers, setResellers] = useState([]);
  const [formData, setFormData] = useState({
    lco: id,
    reseller: "",
    amount: "",
    transferDate: "",
    remark: "",
    createdBy: "Reseller",
    createdById: "",
  });

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const res = await getAllResellers();
        setResellers(res.data || []);
      } catch (err) {
        console.error("Failed to load resellers:", err);
        toast.error("Failed to load resellers ❌");
      }
    };

    const fetchTransaction = async () => {
      try {
        const res = await getLcoWalletDetails(id, transactionId);
        const transaction = res.data || res;
        setFormData({
          lco: id,
          reseller: transaction.reseller._id || "",
          amount: transaction.amount || "",
          transferDate: transaction.transferDate ? new Date(transaction.transferDate).toISOString().slice(0, 16) : "",
          remark: transaction.remark || "",
          createdBy: transaction.createdBy || "Reseller",
          createdById: transaction.createdById || "",
        });
      } catch (err) {
        console.error("Failed to load transaction:", err);
        toast.error("Failed to load transaction details ❌");
      }
    };

    fetchResellers();
    fetchTransaction();
  }, [id, transactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "reseller" && { createdById: value }), // Sync createdById with reseller
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLcoWalletTransaction(transactionId, formData);
      toast.success("Transaction updated successfully ✅");
      navigate(`/lco-wallet/list/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update transaction ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      lco: id,
      reseller: "",
      amount: "",
      transferDate: "",
      remark: "",
      createdBy: "Reseller",
      createdById: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update LCO Wallet Transaction</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Reseller</label>
          <select
            name="reseller"
            value={formData.reseller}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Reseller</option>
            {resellers.map((reseller) => (
              <option key={reseller._id} value={reseller._id}>
                {reseller.resellerName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block font-medium">Transfer Date</label>
          <input
            type="datetime-local"
            name="transferDate"
            value={formData.transferDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Remark</label>
          <input
            type="text"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Created By</label>
          <select
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="Reseller">Reseller</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(`/lco-wallet/list/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Update"}
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