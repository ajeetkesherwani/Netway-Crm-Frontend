import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageDetails, updatePackage } from "../../service/package";
import toast from "react-hot-toast";

export default function PackageUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    typeOfPlan: "Renew",
    categoryOfPlan: "Unlimited",
    validityNumber: "",
    validityUnit: "Day",
    status: "active",
    sacCode: "",
    fromDate: "",
    toDate: "",
    basePrice: "",
    offerPrice: "",
    billType: "Monthly",
    packageAvailable: true,
    offerPackage: false,
    isIptv: false,
    iptvType: "",
    iptvPackageId: "",
    isOtt: false,
    ottType: "",
    ottPackageId: "",
  });

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const res = await getPackageDetails(id);
        const pkg = res.data;

        setFormData({
          name: pkg.name || "",
          description: pkg.description || "",
          typeOfPlan: pkg.typeOfPlan || "Renew",
          categoryOfPlan: pkg.categoryOfPlan || "Unlimited",
          validityNumber: pkg.validity?.number ? String(pkg.validity.number) : "",
          validityUnit: pkg.validity?.unit || "Day",
          status: pkg.status || "active",
          sacCode: pkg.sacCode || "",
          fromDate: pkg.fromDate ? pkg.fromDate.split("T")[0] : "",
          toDate: pkg.toDate ? pkg.toDate.split("T")[0] : "",
          basePrice: pkg.basePrice ? String(pkg.basePrice) : "",
          offerPrice: pkg.offerPrice ? String(pkg.offerPrice) : "",
          billType: pkg.billType || "Monthly",
          packageAvailable: pkg.packageAvailable ?? true,
          offerPackage: pkg.offerPackage ?? false,
          isIptv: !!pkg.isIptv,
          iptvType: pkg.iptvType || "",
          iptvPackageId: pkg.iptvPackageId || "",
          isOtt: !!pkg.isOtt,
          ottType: pkg.ottType || "",
          ottPackageId: pkg.ottPackageId || "",
        });
      } catch (err) {
        toast.error("Failed to load package");
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {};

    if (formData.name.trim()) payload.name = formData.name.trim();
    if (formData.description.trim()) payload.description = formData.description.trim();
    if (formData.typeOfPlan) payload.typeOfPlan = formData.typeOfPlan;
    if (formData.categoryOfPlan) payload.categoryOfPlan = formData.categoryOfPlan;

    if (formData.validityNumber.trim()) {
      payload.validity = {
        number: Number(formData.validityNumber),
        unit: formData.validityUnit,
      };
    }

    if (formData.status) payload.status = formData.status;
    if (formData.sacCode.trim()) payload.sacCode = formData.sacCode.trim();
    if (formData.fromDate) payload.fromDate = formData.fromDate;
    if (formData.toDate) payload.toDate = formData.toDate;
    if (formData.basePrice.trim()) payload.basePrice = Number(formData.basePrice);
    if (formData.offerPrice.trim()) payload.offerPrice = Number(formData.offerPrice);
    if (formData.billType) payload.billType = formData.billType;

    payload.packageAvailable = formData.packageAvailable;
    payload.offerPackage = formData.offerPackage;

    payload.isIptv = formData.isIptv;
    if (formData.isIptv) {
      if (formData.iptvType.trim()) payload.iptvType = formData.iptvType.trim();
      if (formData.iptvPackageId.trim()) payload.iptvPackageId = formData.iptvPackageId.trim();
    }

    payload.isOtt = formData.isOtt;
    if (formData.isOtt) {
      if (formData.ottType.trim()) payload.ottType = formData.ottType.trim();
      if (formData.ottPackageId.trim()) payload.ottPackageId = formData.ottPackageId.trim();
    }

    try {
      await updatePackage(id, payload);
      toast.success("Package updated successfully!");
      navigate("/package/list");
    } catch (err) {
      toast.error(err.message || "Failed to update package");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all fields?")) {
      setFormData((prev) => ({
        ...prev,
        name: "",
        description: "",
        sacCode: "",
        validityNumber: "",
        basePrice: "",
        offerPrice: "",
        iptvType: "",
        iptvPackageId: "",
        ottType: "",
        ottPackageId: "",
      }));
    }
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Package</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Package Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter package name"
          />
        </div>

        {/* Type of Plan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Type of Plan</label>
          <select
            name="typeOfPlan"
            value={formData.typeOfPlan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Renew">Renew</option>
            <option value="Speed Booster Plan">Speed Booster Plan</option>
          </select>
        </div>

        {/* Category of Plan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Category of Plan</label>
          <select
            name="categoryOfPlan"
            value={formData.categoryOfPlan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Unlimited">Unlimited</option>
            <option value="Limited">Limited</option>
            <option value="Fup">FUP</option>
          </select>
        </div>

        {/* Validity */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Validity</label>
          <div className="flex gap-3">
            <input
              type="number"
              name="validityNumber"
              value={formData.validityNumber}
              onChange={handleChange}
              placeholder="28"
              min="1"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="validityUnit"
              value={formData.validityUnit}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Day">Day(s)</option>
              <option value="Month">Month(s)</option>
              <option value="Year">Year(s)</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* SAC Code */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">SAC Code</label>
          <input
            type="text"
            name="sacCode"
            value={formData.sacCode}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Offer Price */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Offer Price</label>
          <input
            type="number"
            name="offerPrice"
            value={formData.offerPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bill Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Bill Type</label>
          <select
            name="billType"
            value={formData.billType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Monthly">Monthly</option>
            <option value="One Time">One Time</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Package Available */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="packageAvailable"
              checked={formData.packageAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Package Available</span>
          </label>
        </div>

        {/* Offer Package */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="offerPackage"
              checked={formData.offerPackage}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Offer Package</span>
          </label>
        </div>

        {/* IPTV Section */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isIptv"
              checked={formData.isIptv}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Include IPTV</span>
          </label>
          {formData.isIptv && (
            <>
              <input
                type="text"
                name="iptvType"
                value={formData.iptvType}
                onChange={handleChange}
                placeholder="IPTV Type (e.g., ziggTv)"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="iptvPackageId"
                value={formData.iptvPackageId}
                onChange={handleChange}
                placeholder="IPTV Package ID"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>

        {/* OTT Section */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isOtt"
              checked={formData.isOtt}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Include OTT</span>
          </label>
          {formData.isOtt && (
            <>
              <input
                type="text"
                name="ottType"
                value={formData.ottType}
                onChange={handleChange}
                placeholder="OTT Type (e.g., playBox)"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="ottPackageId"
                value={formData.ottPackageId}
                onChange={handleChange}
                placeholder="OTT Package ID"
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>

        {/* Description - Full Width */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Enter package description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {saving ? "Updating..." : "Update Package"}
          </button>
        </div>
      </form>
    </div>
  );
}