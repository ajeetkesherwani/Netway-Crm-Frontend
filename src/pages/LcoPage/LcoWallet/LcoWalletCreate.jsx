import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createLcoWalletTransaction, reverseLcoWalletBalance } from "../../../service/retailer";

export default function LcoWalletCreate() {
  const { id } = useParams(); // LCO member ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("add"); 
  const [formData, setFormData] = useState({
    lcoId: id,
    amount: "",
    transferDate: "",
    remark: "",
    mode: ""
  });
  const location = useLocation();
  const { data } = location.state || {};
  console.log("Received data:", data);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "amount" ? Number(value) : value
  }));
};
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (transactionType === "add") {
        await createLcoWalletTransaction(formData);
      } else {
        formData.mode = "Reverse"; 
        response = await reverseLcoWalletBalance(formData);
      }
      toast.success(`${transactionType === "add" ? "Transaction added" : "Balance reversed"} successfully ✅`);
      navigate(`/lco/list/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Failed to ${transactionType === "add" ? "add transaction" : "reverse balance"} ❌`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      lcoId: id,
      amount: "",
      transferDate: "",
      remark: "",
      mode: ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">LCO Wallet Transaction</h2>
      {data && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Raw Transaction Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium capitalize"></label>
              <p className="border p-2 rounded bg-white">
                LCO Wallet Balance: {data?.lcoWalletBalance || 0}
              </p>
            </div>
            <div>
              <label className="block font-medium capitalize"></label>
              <p className="border p-2 rounded bg-white">
                Reseller Name: {data?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Buttons to choose Add or Reverse */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTransactionType("add")}
          className={`px-4 py-2 rounded ${transactionType === "add" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"} hover:bg-blue-700`}
        >
          Add Amount
        </button>
        <button
          onClick={() => setTransactionType("reverse")}
          className={`px-4 py-2 rounded ${transactionType === "reverse" ? "bg-red-600 text-white" : "bg-gray-300 text-black"} hover:bg-red-700`}
        >
          Reverse Amount
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block font-medium">Payment Date</label>
          <input
            type="datetime-local"
            name="transferDate"
            value={formData.transferDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        {transactionType === "add" && (
          <div>
            <label className="block font-medium">Payment Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="DD">DD</option>
              <option value="Cheque">Cheque</option>
              <option value="Credit">Credit</option>
              <option value="Online">Online</option>
            </select>
          </div>
        )}
        <div>
          <label className="block font-medium">Remark</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            rows={2}
          />
        </div>
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(`/lco/wallet/list/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : transactionType === "add" ? "Add" : "Reverse"}
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