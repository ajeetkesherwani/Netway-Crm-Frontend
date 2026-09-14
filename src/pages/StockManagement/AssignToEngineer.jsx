import React, { useEffect, useState } from "react";
import { assignStockToEngineer, getStockCategories } from "../../service/stockCategory";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AssignToEngineer() {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [engineers, setEngineers] = useState([]);
  
  const [selectedStocks, setSelectedStocks] = useState([]); // List of added products
  const [currentStock, setCurrentStock] = useState(null); // Currently selected in dropdown
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStock();
    fetchEngineers();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await getStockCategories();
      const list = res?.data?.stockCategories || [];
      const available = list.filter(item => !item.assignedToEngineer && !item.assignedToUser);
      setStock(available);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/staff/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await res.json();
      const staffList = Array.isArray(data) ? data : (data?.data?.staffs || data?.staffs || data?.data || []);
      setEngineers(Array.isArray(staffList) ? staffList : []);
    } catch (err) {
      console.error("Failed to load engineers", err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStocks.length || !selectedEngineer) {
      toast.error("Please select at least one stock item and an engineer");
      return;
    }

    setLoading(true);
    try {
      const promises = selectedStocks.map(stockOpt => 
        assignStockToEngineer(stockOpt.value, { staffId: selectedEngineer.value, comment })
      );
      
      await Promise.all(promises);
      toast.success("Stock assigned to engineer successfully");
      setSelectedStocks([]);
      setSelectedEngineer(null);
      setComment("");
      navigate("/stock-category/total-available");
    } catch (err) {
      toast.error("Failed to assign one or more stock items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    if (!currentStock) return;
    
    // Check if already added
    if (selectedStocks.find(s => s.value === currentStock.value)) {
      toast.error("Product is already added to the list");
      return;
    }
    
    setSelectedStocks([...selectedStocks, currentStock]);
    setCurrentStock(null);
  };

  const handleRemoveStock = (id) => {
    setSelectedStocks(selectedStocks.filter(s => s.value !== id));
  };

  const stockOptions = stock.map(s => ({
    value: s._id,
    label: `${s.productName} (${s.serialNo || s.macAddress})`
  }));

  const engineerOptions = engineers.map(eng => ({
    value: eng._id || eng.id,
    label: eng.name || eng.firstName || "Engineer"
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Assign Stock to Engineer</h2>
            <p className="text-sm text-gray-500">Select multiple available stock items and assign them to an engineer.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded text-sm hover:bg-gray-50 transition flex items-center gap-2"
          >
            &larr; Back
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Engineer</label>
            <Select
              options={engineerOptions}
              value={selectedEngineer}
              onChange={setSelectedEngineer}
              placeholder="Search and select engineer..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Assign Products</label>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Select
                  options={stockOptions}
                  value={currentStock}
                  onChange={setCurrentStock}
                  placeholder="Search and select a product..."
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <button
                type="button"
                onClick={handleAddStock}
                className="bg-gray-800 text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-900 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Products List */}
          {selectedStocks.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-3 text-sm">Products to Assign ({selectedStocks.length})</h4>
              <ul className="space-y-2">
                {selectedStocks.map((s, idx) => (
                  <li key={s.value} className="flex justify-between items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                    <span className="text-sm font-medium text-gray-700">{idx + 1}. {s.label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStock(s.value)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold transition px-2 py-1 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add an optional comment..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm bg-gray-50"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded text-sm hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Assigning..." : "Assign Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
