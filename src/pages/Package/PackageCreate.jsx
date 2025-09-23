import { useState } from "react";
import { createPackage } from "../../service/package"; // your API call
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
    categoryOfPlan: "",
    description: "",
  });
  const navigate = useNavigate();

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        status: formData.status,
        typeOfPlan: formData.typeOfPlan,
        categoryOfPlan: formData.categoryOfPlan,
        description: formData.description,
      };

      await createPackage(payload);
      toast.success("Package created successfully!");
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
      });
    } catch (error) {
      toast.error(error.message || "Failed to create package");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name *</label>
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
          <label className="block font-medium">Status *</label>
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
          <label className="block font-medium">Validity *</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="validityNumber"
              value={formData.validityNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <select
              name="validityUnit"
              value={formData.validityUnit}
              onChange={handleChange}
              className="border p-2 rounded"
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
          <label className="block font-medium">Type of Plan</label>
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
          <label className="block font-medium">Category of Plan *</label>
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
          <label className="block font-medium">SAC Code</label>
          <input
            type="text"
            name="sacCode"
            value={formData.sacCode}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block font-medium">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block font-medium">To Date</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() =>
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
            })
          }
        >
          Clear
        </button>
         <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/package/list")}
        >
          Back
        </button>
      </div>

    </form>
  );
}
