import { useState } from "react";
import { createPackage } from "../../service/package";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PackageCreate() {
  const [formData, setFormData] = useState({
    name: "",
    validityNumber: "",
    validityUnit: "Month",
    sacCode: "",
    fromDate: "",
    toDate: "",
    status: "active",
    typeOfPlan: "Renew",
    categoryOfPlan: "Unlimited",
    description: "",
    isIptv: false,
    iptvPlanName: "",
    isOtt: false,
    ottPlanName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan || !formData.status) {
      toast.error("Please fill all required fields!");
      return;
    }
    try {
      const payload = {
        name: formData.name,
        validity: {
          number: Number(formData.validityNumber),
          unit: formData.validityUnit,
        },
        sacCode: formData.sacCode,
        fromDate: formData.fromDate || undefined,
        toDate: formData.toDate || undefined,
        status: formData.status,
        typeOfPlan: formData.typeOfPlan,
        categoryOfPlan: formData.categoryOfPlan,
        description: formData.description,
        // Only include if checked
        ...(formData.isIptv && {
          isIptv: true,
          iptvPlanName: formData.iptvPlanName,
        }),
        ...(formData.isOtt && {
          isOtt: true,
          ottPlanName: formData.ottPlanName,
        }),
      };

      await createPackage(payload);
      toast.success("Package created successfully!");
      navigate("/package/list");  
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to create package");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      validityNumber: "",
      validityUnit: "Month",
      sacCode: "",
      fromDate: "",
      toDate: "",
      status: "active",
      typeOfPlan: "Renew",
      categoryOfPlan: "",
      description: "",
      isIptv: false,
      iptvPlanName: "",
      isOtt: false,
      ottPlanName: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6  mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Package</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>

        {/* Validity */}
        <div>
          <label className="block font-medium mb-1">Validity *</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="validityNumber"
              value={formData.validityNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g. 30"
              required
            />
            <select
              name="validityUnit"
              value={formData.validityUnit}
              onChange={handleChange}
              className="border p-2 rounded w-32"
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>

        {/* Type of Plan */}
        <div>
          <label className="block font-medium mb-1">Type of Plan</label>
          <select
            name="typeOfPlan"
            value={formData.typeOfPlan}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="Renew">Renew</option>
            <option value="Speed Booster Plan">Speed Booster Plan</option>
            <option value="Valume Booster">Volume Booster</option>
          </select>
        </div>

        {/* Category of Plan */}
        <div>
          <label className="block font-medium mb-1">Category of Plans *</label>
          <select
            name="categoryOfPlan"
            value={formData.categoryOfPlan}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Plan Category</option>
            <option value="Unlimited">Unlimited</option>
            <option value="Limited">Limited</option>
            <option value="Fup">FUP</option>
            <option value="DayNight">Day/Night</option>
          </select>
        </div>

        {/* SAC Code */}
        <div>
          <label className="block font-medium mb-1">SAC Code</label>
          <input
            type="text"
            name="sacCode"
            value={formData.sacCode}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="e.g. 998431"
          />
        </div>
        {/* From Date */}
        <div>
          <label className="block font-medium mb-1">From Date</label>
          <input
            type="datetime-local"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        {/* To Date */}
        <div>
          <label className="block font-medium mb-1">To Date</label>
          <input
            type="datetime-local"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* IPTV Checkbox + Conditional Input */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isIptv"
              checked={formData.isIptv}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="font-medium"> IPTV</span>
          </label>

          {formData.isIptv && (
            <div className="mt-3 ml-6">
              <label className="block font-medium mb-1">IPTV Plan Name</label>
              <input
                type="text"
                name="iptvPlanName"
                value={formData.iptvPlanName}
                onChange={handleChange}
                className="border p-2 w-full md:w-1/2 rounded"
                placeholder="e.g. Premium IPTV"
              />
            </div>
          )}
        </div>

        {/* OTT Checkbox + Conditional Input */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isOtt"
              checked={formData.isOtt}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="font-medium"> OTT</span>
          </label>

          {formData.isOtt && (
            <div className="mt-3 ml-6">
              <label className="block font-medium mb-1">OTT Plan Name</label>
              <input
                type="text"
                name="ottPlanName"
                value={formData.ottPlanName}
                onChange={handleChange}
                className="border p-2 w-full md:w-1/2 rounded"
                placeholder="e.g. Netflix Bundle"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows={3}
            placeholder="Enter package description..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => navigate("/package/list")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
        >
          Back
        </button>
      </div>
    </form>
  );
}