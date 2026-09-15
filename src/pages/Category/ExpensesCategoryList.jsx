import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEllipsisV } from "react-icons/fa";
import { getExpensesCategories, deleteExpensesCategory } from "../../service/expensesCategory";
import ExpensesCategoryModal from "./ExpensesCategoryModal";
import { usePermission } from "../../context/PermissionContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${dd}-${mm}-${yyyy} ${hours}:${minutes} ${ampm}`;
}

function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { permissions } = usePermission();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAnyAction = permissions?.expenseCategory?.Edit || permissions?.expenseCategory?.Delete;
  if (!hasAnyAction) return null;

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
        title="Actions"
      >
        <FaEllipsisV size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
          {permissions?.expenseCategory?.Edit && (
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
            >
              <FaEdit size={13} /> Edit
            </button>
          )}
          {permissions?.expenseCategory?.Delete && (
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
            >
              <FaTrash size={13} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpensesCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { permissions } = usePermission();

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
          {permissions?.expenseCategory?.Create && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center gap-2 flex-shrink-0"
            >
              <FaPlus /> Add Category
            </button>
          )}
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
                  {(permissions?.expenseCategory?.Edit || permissions?.expenseCategory?.Delete) && (
                    <th className="py-3 px-4 border-b text-center w-24">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{cat.categoryName}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {cat.addedByName || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDateTime(cat.createdAt || cat.date)}
                    </td>
                    {(permissions?.expenseCategory?.Edit || permissions?.expenseCategory?.Delete) && (
                      <td className="py-3 px-4 text-center">
                        <ActionMenu
                          onEdit={() => handleEdit(cat)}
                          onDelete={() => handleDelete(cat._id)}
                        />
                      </td>
                    )}
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
