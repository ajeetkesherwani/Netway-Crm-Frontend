import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { getExpensesCategories, deleteExpensesCategory } from "../../service/expensesCategory";
import ExpensesCategoryModal from "./ExpensesCategoryModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ExpensesCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getExpensesCategories(search);
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleAdd = () => {
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setModalData(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteExpensesCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        toast.error(err.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Expenses Category List</h1>
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center gap-2 flex-shrink-0"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white border rounded shadow flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-10 text-center text-gray-500 flex-1">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex-1">No categories found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Category Name</th>
                  <th className="py-3 px-4 border-b">Added By</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{cat.categoryName}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {cat.addedByName} <span className="text-xs text-gray-400">({cat.addedByModel})</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(cat.createdAt || cat.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExpensesCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        onUpdate={fetchCategories}
      />
    </div>
  );
}
