import { useEffect, useState } from "react";
import { getCategoryList, createCategory, updateCategory, deleteCategory } from "../../service/category";
import ProtectedAction from "../../components/ProtectedAction";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // handle multiple response shapes: array, { status: true, data: [...] }, { data: [...] }
      if (Array.isArray(res)) {
        setCategories(res);
      } else if (Array.isArray(res?.data)) {
        setCategories(res.data);
      } else if (res?.status) {
        setCategories(res.data || []);
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else if (res && res.message) {
        setError(res.message);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const openUpdateModal = (id = null, currentName = "") => {
    setEditingId(id);
    setNewName(currentName);
    setActionError(null);
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    if (!newName.trim()) return setActionError("Name is required");
    setActionError(null);
    setActionLoading(true);
    try {
      let res;
      if (editingId) {
        res = await updateCategory(editingId, { name: newName.trim() });
      } else {
        res = await createCategory({ name: newName.trim() });
      }
      // handle common success shapes
      if (res && (res.status === true || res.status === "success" || res.success || (res.data && (Array.isArray(res.data) || res.data._id)))) {
        await fetchCategories();
        setShowUpdateModal(false);
        setNewName("");
      } else if (res && res.message) {
        setActionError(res.message);
      } else {
        setActionError("Failed to save category");
      }
    } catch (err) {
      setActionError(err?.message || "Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setActionError(null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setActionError(null);
    setActionLoading(true);
    try {
      const res = await deleteCategory(deletingId);
      if (res && (res.status === true || res.success || res.status === "deleted")) {
        await fetchCategories();
        setShowDeleteModal(false);
      } else if (res && res.message) {
        setActionError(res.message);
      } else {
        setActionError("Failed to delete category");
      }
    } catch (err) {
      setActionError(err?.message || "Network error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="mt-6 text-center">⏳ Loading categories...</p>;
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Ticket Categories</h2>
          <div className="flex items-center space-x-3">
            <ProtectedAction module="setting" action="ticketCategoryCreate">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => openUpdateModal(null, "")}
            >
              Create Category
            </button>
            </ProtectedAction>
            <button className="px-3 py-2 bg-gray-100 rounded-md" onClick={fetchCategories}>Refresh</button>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((cat, i) => {
                  const date = cat?.createdAt ? new Date(cat.createdAt) : null;
                  const dateStr = date ? date.toLocaleString() : "";
                  return (
                    <tr key={cat._id || cat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.createdBy || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={dateStr}>
                        {date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <ProtectedAction module="setting" action="ticketCategoryUpdate">
                          <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                            onClick={() => openUpdateModal(cat._id || cat.id, cat.name)}
                          >
                            Update
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="setting" action="ticketCategoryRemove">
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            onClick={() => openDeleteModal(cat._id || cat.id)}
                          >
                            Delete
                          </button>
                        </ProtectedAction>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update/Create Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Update Category" : "Create Category"}</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter category name"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => { setShowUpdateModal(false); setNewName(""); }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                onClick={handleSubmitUpdate}
                disabled={actionLoading}
              >
                {actionLoading ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Save" : "Create")}
              </button>
            </div>
            {actionError && <p className="text-sm text-red-600 mt-3">{actionError}</p>}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => { setShowDeleteModal(false); }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
            {actionError && <p className="text-sm text-red-600 mt-3">{actionError}</p>}
          </div>
        </div>
      )}
    </>
  );
}
