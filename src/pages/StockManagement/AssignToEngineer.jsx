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
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStock();
    fetchEngineers();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await getStockCategories("?availableOnly=true");
      const list = res?.data?.stockCategories || [];
      setStock(list.filter((item) => Number(item.availableQuantity) > 0));
    } catch (err) {
      toast.error(err.message || "Failed to load available stock");
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
    if (selectedStocks.some((item) =>
      !Number.isInteger(Number(item.quantity)) ||
      Number(item.quantity) < 1 ||
      Number(item.quantity) > item.availableQuantity
    )) {
      toast.error("Each quantity must be a whole number within the available stock");
      return;
    }

    setLoading(true);
    try {
      const results = await Promise.allSettled(
        selectedStocks.map((stockOpt) =>
          assignStockToEngineer(stockOpt.value, {
            staffId: selectedEngineer.value,
            quantity: Number(stockOpt.quantity),
            comment,
          })
        )
      );
      const failedCount = results.filter((result) => result.status === "rejected").length;
      if (failedCount) {
        const assignedCount = results.length - failedCount;
        const failureMessage = results.find(
          (result) => result.status === "rejected"
        )?.reason?.message;
        setSelectedStocks([]);
        await fetchStock();
        toast.error(
          `${assignedCount} item(s) assigned; ${failedCount} failed. ${
            failureMessage || "Stock was refreshed."
          }`
        );
        return;
      }

      toast.success("Stock assigned to engineer successfully");
      setSelectedStocks([]);
      setSelectedEngineer(null);
      setComment("");
      navigate("/stock-category/total-available");
    } catch (err) {
      toast.error(err.message || "Failed to assign stock");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    if (!currentStock) return;

    if (
      !Number.isInteger(currentQuantity) ||
      currentQuantity < 1 ||
      currentQuantity > currentStock.availableQuantity
    ) {
      toast.error("Choose a whole number within the available stock quantity");
      return;
    }
    
    // Check if already added
    if (selectedStocks.find(s => s.value === currentStock.value)) {
      toast.error("Product is already added to the list");
      return;
    }
    
    setSelectedStocks([
      ...selectedStocks,
      { ...currentStock, quantity: currentQuantity },
    ]);
    setCurrentStock(null);
    setCurrentQuantity(1);
  };

  const handleQuantityChange = (id, value) => {
    setSelectedStocks((current) =>
      current.map((item) =>
        item.value === id
          ? { ...item, quantity: value === "" ? "" : Number(value) }
          : item
      )
    );
  };

  const handleRemoveStock = (id) => {
    setSelectedStocks(selectedStocks.filter(s => s.value !== id));
  };

  const selectedStockIds = new Set(selectedStocks.map((item) => item.value));
  const stockOptions = stock.map((item) => {
    const productLabel = `${item.productName} (${item.vendor}) — ${
      item.serialNo || item.macAddress || "No serial number"
    }`;
    return {
      value: item._id,
      label: `${productLabel} — available: ${item.availableQuantity}`,
      productLabel,
      availableQuantity: Number(item.availableQuantity),
      isDisabled: selectedStockIds.has(item._id),
    };
  });

  const engineerOptions = engineers.map(eng => ({
    value: eng._id || eng.id,
    label: eng.staffName || eng.name || eng.firstName || "Engineer"
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Assign Stock to Engineer</h2>
            <p className="text-sm text-gray-500">Select available stock, choose a quantity for each item, and assign it to an engineer.</p>
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
                  onChange={(option) => {
                    setCurrentStock(option);
                    setCurrentQuantity(1);
                  }}
                  placeholder="Select available product / stock..."
                  isClearable
                  noOptionsMessage={() => "No available stock"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <label className="text-xs text-gray-600">
                Quantity
                <input
                  type="number"
                  min="1"
                  max={currentStock?.availableQuantity || 0}
                  step="1"
                  value={currentQuantity}
                  disabled={!currentStock}
                  onChange={(event) =>
                    setCurrentQuantity(
                      event.target.value === "" ? "" : Number(event.target.value)
                    )
                  }
                  className="mt-1 block w-24 rounded border border-gray-300 px-2 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={handleAddStock}
                disabled={
                  !currentStock ||
                  !Number.isInteger(currentQuantity) ||
                  currentQuantity < 1 ||
                  currentQuantity > currentStock.availableQuantity
                }
                className="bg-gray-800 text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-900 transition disabled:cursor-not-allowed disabled:opacity-50"
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
                  <li key={s.value} className="flex flex-wrap justify-between items-center gap-3 bg-white p-3 rounded border border-gray-100 shadow-sm">
                    <div className="text-sm font-medium text-gray-700">
                      {idx + 1}. {s.productLabel}
                      <span className="ml-2 text-xs text-gray-500">of {s.availableQuantity} available</span>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      Assign quantity
                      <input
                        type="number"
                        min="1"
                        max={s.availableQuantity}
                        step="1"
                        required
                        value={s.quantity}
                        onChange={(event) => handleQuantityChange(s.value, event.target.value)}
                        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </label>
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
