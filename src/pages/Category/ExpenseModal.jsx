import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createExpense, updateExpense } from "../../service/expense";
import { getExpensesCategories } from "../../service/expensesCategory";
import toast from "react-hot-toast";

export default function ExpenseModal({ isOpen, onClose, data, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    expensesCategory: "",
    expenseDate: "",
    description: "",
    amount: "",
    paymentMode: "Online"
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch categories for dropdown
      getExpensesCategories().then(res => setCategories(res.data || [])).catch(() => {});

      if (data) {
        setFormData({
          expensesCategory: data.expensesCategory?._id || data.expensesCategory || "",
          expenseDate: data.expenseDate ? new Date(data.expenseDate).toISOString().split('T')[0] : "",
          description: data.description || "",
          amount: data.amount || "",
          paymentMode: data.paymentMode || "Online"
        });
      } else {
        setFormData({
          expensesCategory: "",
          expenseDate: new Date().toISOString().split('T')[0], // default to today
          description: "",
          amount: "",
          paymentMode: "Online"
        });
      }
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expensesCategory || !formData.expenseDate || !formData.amount || !formData.paymentMode) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (data) {
        await updateExpense(data._id, formData);
        toast.success("Expense updated successfully");
      } else {
        await createExpense(formData);
        toast.success("Expense created successfully");
      }
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">
            {data ? "Update Expense" : "Add Expense"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="expensesCategory"
                value={formData.expensesCategory}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="amount"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter details..."
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : data ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
