import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStockCategories, updateStockCategory } from "../../service/stockCategory";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UpdateStockCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    productName: "",
    vendor: "",
    serialNo: "",
    macAddress: "",
    quantity: 0,
    stockAlertQuantity: 0,
    description: "",
    assignedToEngineer: "",
    assignedToUser: "",
    status: "",
  });

  const [engineers, setEngineers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const engRes = await fetch(`${BASE_URL}/staff/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const engData = await engRes.json();
        const engList = Array.isArray(engData) ? engData : (engData?.data?.staffs || engData?.staffs || []);
        setEngineers(Array.isArray(engList) ? engList : []);

        const usrRes = await fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const usrData = await usrRes.json();
        const usrList = Array.isArray(usrData) ? usrData : (usrData?.data?.users || usrData?.users || []);
        setUsers(Array.isArray(usrList) ? usrList : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdowns();
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
            assignedToEngineer: item.assignedToEngineer?._id || item.assignedToEngineer || "",
            assignedToUser: item.assignedToUser?._id || item.assignedToUser || "",
            status: item.status || "",
          });
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
    // If they change assignee, we need to clear the other one
    if (name === "assignedToEngineer" && value) {
      setFormData({ ...formData, [name]: value, assignedToUser: "", status: "Assigned to Engineer" });
    } else if (name === "assignedToUser" && value) {
      setFormData({ ...formData, [name]: value, assignedToEngineer: "", status: "Assigned to User" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStockCategory(id, formData);
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
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vendor <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
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

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assign to Engineer</label>
              <select
                name="assignedToEngineer"
                value={formData.assignedToEngineer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              >
                <option value="">-- None --</option>
                {engineers.map((eng) => (
                  <option key={eng._id || eng.id} value={eng._id || eng.id}>
                    {eng.name || eng.firstName || "Engineer"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assign to User</label>
              <select
                name="assignedToUser"
                value={formData.assignedToUser}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              >
                <option value="">-- None --</option>
                {users.map((usr) => (
                  <option key={usr._id || usr.id} value={usr._id || usr.id}>
                    {usr.generalInformation?.name || usr.name || "User"}
                  </option>
                ))}
              </select>
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
