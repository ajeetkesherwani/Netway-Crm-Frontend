import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  createStockProductCategory,
  deleteStockProductCategory,
  getStockProductCategories,
  updateStockProductCategory,
} from "../../service/stockProductCategory";

export default function StockProductCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ productName: "", vendor: "" });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getStockProductCategories();
      setCategories(response);
    } catch (error) {
      toast.error(error.message || "Failed to load product categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [category.productName, category.vendor].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [categories, search]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setFormData({ productName: "", vendor: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setFormData({
      productName: category.productName || "",
      vendor: category.vendor || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      productName: formData.productName.trim(),
      vendor: formData.vendor.trim(),
    };

    try {
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        if (!id) throw new Error("Cannot update a category without an ID");
        await updateStockProductCategory(id, payload);
        toast.success("Product category updated");
      } else {
        await createStockProductCategory(payload);
        toast.success("Product category created");
      }
      setIsFormOpen(false);
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to save product category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const id = category._id || category.id;
    if (!id) {
      toast.error("Cannot delete a category without an ID");
      return;
    }
    if (!window.confirm(`Delete "${category.productName || "this category"}"?`)) {
      return;
    }

    try {
      await deleteStockProductCategory(id);
      toast.success("Product category deleted");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to delete product category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Stock Product Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product names and vendors.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm sm:w-64"
            />
          </label>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            {search ? "No matching categories found." : "No product categories yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3">S. N</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr
                    key={category._id || category.id || `${category.productName}-${index}`}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {category.productName || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{category.vendor || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          aria-label={`Edit ${category.productName || "category"}`}
                          className="rounded p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          aria-label={`Delete ${category.productName || "category"}`}
                          className="rounded p-2 text-red-600 hover:bg-red-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              {editingCategory ? "Update Category" : "Add Category"}
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Name
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(event) =>
                    setFormData({ ...formData, productName: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Vendor
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(event) =>
                    setFormData({ ...formData, vendor: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
