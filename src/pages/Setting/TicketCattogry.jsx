import { useEffect, useState } from "react";
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../service/category";
import { FaEye, FaEdit, FaTrash, FaEllipsisV, FaSearch, FaPlus, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategoryList();
      let data = [];
      if (Array.isArray(res)) data = res;
      else if (res?.data) data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (id) => {
    navigate(`/setting/category/view/${id}`);
    setOpenMenuId(null);
  };

  const openUpdateModal = (id = null, currentName = "") => {
    setEditingId(id);
    setNewName(currentName);
    setActionError(null);
    setShowUpdateModal(true);
    setOpenMenuId(null);
  };

  const handleSubmitUpdate = async () => {
    if (!newName.trim()) return setActionError("Category name is required");
    setActionLoading(true);
    setActionError(null);
    try {
      let res;
      if (editingId) {
        res = await updateCategory(editingId, { name: newName.trim() });
      } else {
        res = await createCategory({ name: newName.trim() });
      }
      if (res?.status || res?.success || res?.data) {
        toast.success(editingId ? "Category updated" : "Category created");
        await fetchCategories();
        setShowUpdateModal(false);
        setNewName("");
      } else {
        throw new Error(res?.message || "Operation failed");
      }
    } catch (err) {
      setActionError(err.message || "Network error");
      toast.error("Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      const res = await deleteCategory(deletingId);
      if (res?.status || res?.success) {
        toast.success("Category deleted");
        await fetchCategories();
        setShowDeleteModal(false);
      } else {
        throw new Error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };

  const exportToExcel = () => {
    if (categories.length === 0) {
      toast.error("No categories to export");
      return;
    }
    const data = categories.map((cat, i) => ({
      "S.No": i + 1,
      "Category Name": cat.name || "-",
      "Created By": cat.createdBy || "-",
      "Created At": cat.createdAt ? new Date(cat.createdAt).toLocaleString() : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "ticket_categories.xlsx");
    toast.success("Exported successfully!");
  };

  const displayedCategories = categories.filter((cat) =>
    (cat.name || "").toLowerCase().includes(appliedSearch)
  );

  if (loading) return <p className="p-6 text-gray-600">Loading categories...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Title + All Controls in One Horizontal Line */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Title */}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 leading-tight">
            Ticket Categories
            {/* <br className="sm:hidden" />
            <span className="text-lg">Categories</span> */}
          </h1>
        </div>

        {/* Search + All Buttons - Always Horizontal on Large Screens */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search categories..."
              className="px-4 py-2 text-sm outline-none w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>

          {/* Action Buttons - Horizontal */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
            >
              Download Excel
            </button>

            <ProtectedAction module="setting" action="ticketCategoryCreate">
              <button
                onClick={() => openUpdateModal(null, "")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus /> Create Category
              </button>
            </ProtectedAction>

            <button
              onClick={fetchCategories}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center gap-2 whitespace-nowrap"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-xl">×</button>
        </div>
      )}

      {/* Table */}
      {displayedCategories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching categories found." : "No categories available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">S.no</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Category Name</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Created By</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Created At</th>
                  <th className="px-4 py-2 text-center font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedCategories.map((cat, i) => {
                  const date = cat.createdAt ? new Date(cat.createdAt) : null;
                  const id = cat._id || cat.id;

                  return (
                    <tr key={id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 text-gray-600">{i + 1}</td>
                      <td
                        className="px-4 py-2 font-medium text-gray-600 hover:underline cursor-pointer"
                        onClick={() => handleView(id)}
                      >
                        {cat.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{cat.createdBy || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {date
                          ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "—"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(id);
                          }}
                          className="p-2.5 hover:bg-gray-200 rounded-full transition"
                        >
                          <FaEllipsisV className="text-gray-600" />
                        </button>

                        {openMenuId === id && (
                          <div
                            className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleView(id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                            >
                              <FaEye className="text-blue-600" /> View
                            </button>

                            <ProtectedAction module="setting" action="ticketCategoryUpdate">
                              <button
                                onClick={() => openUpdateModal(id, cat.name)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <FaEdit className="text-green-600" /> Edit
                              </button>
                            </ProtectedAction>

                            <ProtectedAction module="setting" action="ticketCategoryRemove">
                              <button
                                onClick={() => openDeleteModal(id)}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                              >
                                <FaTrash /> Delete
                              </button>
                            </ProtectedAction>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden space-y-4 mt-6">
        {displayedCategories.map((cat, i) => {
          const id = cat._id || cat.id;
          return (
            <div key={id} className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">#{i + 1}</p>
                  <p
                    className="font-medium text-lg mt-1 text-blue-600 cursor-pointer"
                    onClick={() => handleView(id)}
                  >
                    {cat.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">By: {cat.createdBy || "—"}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaEllipsisV className="text-gray-600" />
                </button>
              </div>

              {openMenuId === id && (
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => handleView(id)}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaEye /> View
                  </button>
                  <ProtectedAction module="setting" action="ticketCategoryUpdate">
                    <button
                      onClick={() => openUpdateModal(id, cat.name)}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="setting" action="ticketCategoryRemove">
                    <button
                      onClick={() => openDeleteModal(id)}
                      className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </ProtectedAction>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create/Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Update Category" : "Create Category"}
            </h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {actionError && <p className="text-red-600 text-sm mb-3">{actionError}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setNewName("");
                  setActionError(null);
                }}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                disabled={actionLoading || !newName.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
              >
                {actionLoading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-red-600 mb-3">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">Delete this category permanently?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}