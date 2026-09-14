import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createExpensesCategory, updateExpensesCategory } from "../../service/expensesCategory";
import toast from "react-hot-toast";

export default function ExpensesCategoryModal({ isOpen, onClose, data, onUpdate }) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setCategoryName(data.categoryName || "");
      } else {
        setCategoryName("");
      }
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      if (data) {
        await updateExpensesCategory(data._id, { categoryName });
        toast.success("Category updated successfully");
      } else {
        await createExpensesCategory({ categoryName });
        toast.success("Category created successfully");
      }
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">
            {data ? "Update Expenses Category" : "Add Expenses Category"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
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
