import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getStockCategories, updateStockCategory } from "../../service/stockCategory";
import { getStockProductCategories } from "../../service/stockProductCategory";
import toast from "react-hot-toast";

const LEGACY_CATEGORY_VALUE = "__current_stock_product__";
const getCategoryOptionValue = (category, index) =>
  String(category._id || category.id || `category-${index}`);

export default function UpdateStockCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingProductCategories, setLoadingProductCategories] = useState(true);
  const [productCategories, setProductCategories] = useState([]);
  const [assignedQuantity, setAssignedQuantity] = useState(0);
  
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

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await getStockCategories();
        const list = res?.data?.stockCategories || [];
        const item = list.find((s) => s._id === id);
        if (item) {
          setFormData({
            productName: item.productName || "",
            vendor: item.vendor || "",
            serialNo: item.serialNo || "",
            macAddress: item.macAddress || "",
            quantity: item.quantity || 0,
            stockAlertQuantity: item.stockAlertQuantity || 0,
            description: item.description || "",
          });
          setAssignedQuantity(
            Math.max(
              0,
              Number(item.quantity || 0) -
                Number(item.availableQuantity ?? item.quantity ?? 0)
            )
          );
        } else {
          toast.error("Stock item not found");
          navigate("/stock-category/total-available");
        }
      } catch (err) {
        toast.error("Failed to load stock details");
      } finally {
        setFetching(false);
      }
    };
    fetchStock();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (e) => {
    const category = productCategories.find(
      (item, index) => getCategoryOptionValue(item, index) === e.target.value
    );
    if (!category) return;

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
  const availableQuantityPreview = Math.max(
    0,
    Number(formData.quantity || 0) - assignedQuantity
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        stockAlertQuantity: Number(formData.stockAlertQuantity || 0),
      };
      delete payload.availableQuantity;
      delete payload.restockQuantity;

      await updateStockCategory(id, payload);
      toast.success("Stock category updated successfully!");
      navigate(-1); // go back
    } catch (err) {
      toast.error(err.message || "Failed to update stock category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-center text-gray-500">Loading data...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Update Stock Category</h2>
        <p className="text-sm text-gray-500 mb-6">Modify details for this stock item.</p>

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
                    : formData.productName
                      ? LEGACY_CATEGORY_VALUE
                      : ""
                }
                onChange={handleProductChange}
                required
                disabled={loadingProductCategories}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              >
                <option value="">
                  {loadingProductCategories ? "Loading product categories..." : "Select a product"}
                </option>
                {selectedProductCategoryIndex < 0 && formData.productName && (
                  <option value={LEGACY_CATEGORY_VALUE}>
                    {formData.productName} (current item)
                  </option>
                )}
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
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Total Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Available Quantity</label>
              <input
                type="number"
                value={availableQuantityPreview}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Assigned quantity ({assignedQuantity}) stays unchanged. Increasing total stock adds only the increase to available stock.
              </p>
            </div>

            {/* <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock Alert Quantity</label>
              <input
                type="number"
                name="stockAlertQuantity"
                value={formData.stockAlertQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              />
            </div> */}

          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
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
              {loading ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
