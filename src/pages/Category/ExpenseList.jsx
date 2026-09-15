import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import { getExpenses, deleteExpense } from "../../service/expense";
import ExpenseModal from "./ExpenseModal";
import { usePermission } from "../../context/PermissionContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

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

  const hasAnyAction = permissions?.expense?.Edit || permissions?.expense?.Delete;
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
          {permissions?.expense?.Edit && (
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
            >
              <FaEdit size={13} /> Edit
            </button>
          )}
          {permissions?.expense?.Delete && (
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

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { permissions } = usePermission();

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (paymentMode) params.paymentMode = paymentMode;

      const res = await getExpenses(params);
      setExpenses(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExpenses();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fromDate, toDate, paymentMode]);

  const handleAdd = () => {
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setModalData(expense);
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
        await deleteExpense(id);
        toast.success("Expense deleted successfully");
        fetchExpenses();
      } catch (err) {
        toast.error(err.message || "Failed to delete expense");
      }
    }
  };

  const exportExcel = () => {
    if (expenses.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = expenses.map((exp, idx) => ({
      "S.No": idx + 1,
      "Category": exp.expensesCategory?.categoryName || "Unknown",
      "Expense Date": formatDateTime(exp.expenseDate),
      "Amount": exp.amount,
      "Payment Mode": exp.paymentMode,
      "Description": exp.description || "-",
      "Added By": exp.addedByName || "Unknown",
      "Created At": formatDateTime(exp.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "Expense_Report.xlsx");
  };

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setPaymentMode("");
  };

  const showActionCol = permissions?.expense?.Edit || permissions?.expense?.Delete;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Expense List</h1>
        <div className="flex gap-2 items-center flex-wrap">
          {permissions?.expense?.Export && (
            <button
              onClick={exportExcel}
              className="px-4 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 flex items-center gap-2 h-[38px]"
            >
              <FaFileExcel /> EXPORT
            </button>
          )}
          {permissions?.expense?.Create && (
            <button
              onClick={handleAdd}
              className="px-4 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 flex items-center gap-2 h-[38px]"
            >
              <FaPlus /> Add Expense
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Search Category</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaSearch size={12} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Modes</option>
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <button
              onClick={clearFilters}
              className="w-full md:w-auto px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded shadow flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-10 text-center text-gray-500 flex-1">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex-1">No expenses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs">
                <tr>
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Category</th>
                  <th className="py-3 px-4 border-b">Amount</th>
                  <th className="py-3 px-4 border-b">Pay Mode</th>
                  <th className="py-3 px-4 border-b">Description</th>
                  <th className="py-3 px-4 border-b">Added By</th>
                  {showActionCol && (
                    <th className="py-3 px-4 border-b text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, idx) => (
                  <tr key={exp._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4 text-gray-800">
                      {formatDateTime(exp.expenseDate)}
                    </td>
                    <td className="py-2 px-4 font-medium text-blue-800">
                      {exp.expensesCategory?.categoryName || "Unknown"}
                    </td>
                    <td className="py-2 px-4 font-semibold text-gray-800">
                      ₹{exp.amount}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${exp.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                          exp.paymentMode === 'Online' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {exp.paymentMode}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-600 truncate max-w-[150px]" title={exp.description}>
                      {exp.description || "-"}
                    </td>
                    <td className="py-2 px-4 text-gray-800 font-semibold">
                      {exp.addedByName || "-"}
                    </td>
                    {showActionCol && (
                      <td className="py-2 px-4 text-center">
                        <ActionMenu
                          onEdit={() => handleEdit(exp)}
                          onDelete={() => handleDelete(exp._id)}
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

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        onUpdate={fetchExpenses}
      />
    </div>
  );
}
