import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createStockCategory } from "../../service/stockCategory";
import { getStockProductCategories } from "../../service/stockProductCategory";
import toast from "react-hot-toast";

const getCategoryOptionValue = (category, index) =>
  String(category._id || category.id || `category-${index}`);

export default function CreateStockCategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProductCategories, setLoadingProductCategories] = useState(true);
  const [productCategories, setProductCategories] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    vendor: "",
    serialNo: "",
    macAddress: "",
    quantity: 0,
    stockAlertQuantity: 0,
    description: "",
  });

  useEffect(() => {
    let isMounted = true;
    getStockProductCategories()
      .then((categories) => {
        if (isMounted) setProductCategories(categories);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load product categories");
      })
      .finally(() => {
        if (isMounted) setLoadingProductCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const category = productCategories.find(
      (item, index) => getCategoryOptionValue(item, index) === e.target.value
    );
    if (!category) {
      setFormData((current) => ({ ...current, productName: "", vendor: "" }));
      return;
    }

    setFormData((current) => ({
      ...current,
      productName: category.productName || "",
      vendor: category.vendor || "",
    }));
  };

  const selectedProductCategoryIndex = productCategories.findIndex(
    (category) =>
      category.productName === formData.productName &&
      category.vendor === formData.vendor
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStockCategory(formData);
      toast.success("Stock category created successfully!");
      navigate("/stock-category/total-available");
    } catch (err) {
      toast.error(err.message || "Failed to create stock category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Create Stock Category</h2>
        <p className="text-sm text-gray-500 mb-6">Add a new item to your available stock.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
              <select
                value={
                  selectedProductCategoryIndex >= 0
                    ? getCategoryOptionValue(
                        productCategories[selectedProductCategoryIndex],
                        selectedProductCategoryIndex
                      )
                    : ""
                }
                onChange={handleProductChange}
                required
                disabled={loadingProductCategories || productCategories.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              >
                <option value="">
                  {loadingProductCategories
                    ? "Loading product categories..."
                    : productCategories.length
                      ? "Select a product"
                      : "No product categories available"}
                </option>
                {productCategories.map((category, index) => (
                  <option
                    key={getCategoryOptionValue(category, index)}
                    value={getCategoryOptionValue(category, index)}
                  >
                    {category.productName}
                  </option>
                ))}
              </select>
              {!loadingProductCategories && productCategories.length === 0 && (
                <Link
                  to="/stock-category/categories"
                  className="mt-1 inline-block text-xs text-indigo-600 hover:underline"
                >
                  Add a product category
                </Link>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vendor <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                required
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="Select a product first"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Serial No <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="e.g. SN12345678"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">MAC Address</label>
              <input
                type="text"
                name="macAddress"
                value={formData.macAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="e.g. 00:1B:44:11:3A:B7"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock Alert Quantity</label>
              <input
                type="number"
                name="stockAlertQuantity"
                value={formData.stockAlertQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              placeholder="Additional details..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded text-sm hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
