import { useState, useEffect } from "react";
import { createPackage, getIptvPackageListFromThirdParty, getOttPackageListFromThirdParty } from "../../service/package";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function PackageCreate() {
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    name: "",
    validityNumber: "",
    validityUnit: "Month",
    sacCode: "",
    fromDate: today,
    toDate: "",
    status: "active",
    typeOfPlan: "Renew",
    categoryOfPlan: "Unlimited",
    description: "",
    basePrice: "",
    offerPrice: "",
    packageAvailable: false,
    offerPackage: false,
    isOtt: false,
    ottType: "",
    ottPackageId: "",
    isIptv: false,
    iptvType: "",
    iptvPackageId: "",
  });

  const [iptvPackages, setIptvPackages] = useState([]);
  const [ottPackages, setOttPackages] = useState([]);

  // Fetch IPTV packages
  useEffect(() => {
    if (formData.isIptv) {
      const fetchIptv = async () => {
        try {
          const packages = await getIptvPackageListFromThirdParty();
          setIptvPackages(packages || []);
        } catch (error) {
          toast.error(error.message || "Failed to load IPTV packages");
          console.error("IPTV fetch error:", error);
        }
      };
      fetchIptv();
    } else {
      setIptvPackages([]);
    }
  }, [formData.isIptv]);

  // Fetch OTT packages dynamically
  useEffect(() => {
    if (formData.isOtt) {
      const fetchOtt = async () => {
        try {
          const packages = await getOttPackageListFromThirdParty();
          setOttPackages(packages || []);
        } catch (error) {
          toast.error(error.message || "Failed to load OTT packages");
          console.error("OTT fetch error:", error);
          setOttPackages([]);
        }
      };
      fetchOtt();
    } else {
      setOttPackages([]);
    }
  }, [formData.isOtt]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic fields
    if (!formData.name || !formData.validityNumber || !formData.categoryOfPlan) {
      toast.error("Please fill all required fields: Name, Validity Number, and Category!");
      return;
    }

    // OTT validation – only if checkbox is checked
    if (formData.isOtt) {
      if (!formData.ottType || !formData.ottType.trim()) {
        toast.error("Please select OTT Type");
        return;
      }
      if (!formData.ottPackageId || !String(formData.ottPackageId).trim()) {
        toast.error("Please select an OTT Package");
        return;
      }
    }

    // IPTV validation – only if checkbox is checked
    if (formData.isIptv) {
      if (!formData.iptvType || !formData.iptvType.trim()) {
        toast.error("Please select IPTV Type");
        return;
      }
      if (!formData.iptvPackageId || !String(formData.iptvPackageId).trim()) {
        toast.error("Please select an IPTV Package");
        return;
      }
    }

    try {
      const payload = {
        name: formData.name.trim(),
        validity: {
          number: Number(formData.validityNumber),
          unit: formData.validityUnit,
        },
        sacCode: formData.sacCode || undefined,
        fromDate: formData.fromDate || undefined,
        toDate: formData.toDate || undefined,
        status: formData.status,
        typeOfPlan: formData.typeOfPlan,
        categoryOfPlan: formData.categoryOfPlan,
        description: formData.description || undefined,
        basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
        packageAvailable: formData.packageAvailable,
        offerPackage: formData.offerPackage,
      };

      if (formData.isOtt) {
        payload.isOtt = true;
        payload.ottType = formData.ottType.trim();
        payload.ottPackageId = String(formData.ottPackageId).trim(); // safe string conversion
      }

      if (formData.isIptv) {
        payload.isIptv = true;
        payload.iptvType = formData.iptvType.trim();
        payload.iptvPackageId = String(formData.iptvPackageId).trim(); // safe string conversion
      }

      console.log("Sending Payload:", payload);

      await createPackage(payload);
      toast.success("Package created successfully!");
      navigate("/package/list");
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Failed to create package";
      toast.error(msg);
      console.error("Create Package Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      validityNumber: "",
      validityUnit: "Month",
      sacCode: "",
      fromDate: today,
      toDate: "",
      status: "active",
      typeOfPlan: "Renew",
      categoryOfPlan: "Unlimited",
      description: "",
      basePrice: "",
      offerPrice: "",
      packageAvailable: false,
      offerPackage: false,
      isOtt: false,
      ottType: "",
      ottPackageId: "",
      isIptv: false,
      iptvType: "ziggTv",
      iptvPackageId: "",
    });
    setIptvPackages([]);
    setOttPackages([]);
  };

  // Selected IPTV option
  const selectedIptvOption = iptvPackages
    .map((pkg) => ({
      value: pkg.plan_Id,
      label: pkg.plan_name,
    }))
    .find((opt) => opt.value === formData.iptvPackageId) || null;

  // Selected OTT option (shows name in dropdown)
  const selectedOttOption = ottPackages
    .map((pkg) => ({
      value: pkg.packId,
      label: pkg.name,
    }))
    .find((opt) => opt.value === formData.ottPackageId) || null;

  return (
    <form onSubmit={handleSubmit} className="p-6 mx-auto bg-white shadow rounded-lg max-w-8xl">
      <h2 className="text-2xl font-bold mb-6 text-left">Create Package</h2>

      {/* Main Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Validity *</label>
          <div className="flex gap-2">
            <input type="number" name="validityNumber" value={formData.validityNumber} onChange={handleChange} required className="border p-2 w-full rounded" placeholder="e.g. 30" />
            <select name="validityUnit" value={formData.validityUnit} onChange={handleChange} className="border p-2 rounded w-32">
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Type of Plan</label>
          <select name="typeOfPlan" value={formData.typeOfPlan} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="Renew">Renew</option>
            <option value="Speed Booster Plan">Speed Booster Plan</option>
            <option value="Valume Booster">Volume Booster</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Category of Plans *</label>
          <select name="categoryOfPlan" value={formData.categoryOfPlan} onChange={handleChange} required className="border p-2 w-full rounded">
            <option value="">Select Category</option>
            <option value="Unlimited">Unlimited</option>
            <option value="Limited">Limited</option>
            <option value="Fup">FUP</option>
            <option value="DayNight">Day/Night</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">SAC Code</label>
          <input type="text" name="sacCode" value={formData.sacCode} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">From Date</label>
          <input type="datetime-local" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">To Date</label>
          <input type="datetime-local" name="toDate" value={formData.toDate} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Base Price</label>
          <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Offer Price</label>
          <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
      </div>

      {/* Package Available & Offer Package */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-medium text-gray-600">Package available *</label>
            <p className="text-xs text-gray-500 mt-1">(This package not available for new account)</p>
          </div>
          <div className="flex gap-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: true }))} className="w-5 h-5 text-blue-600" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={!formData.packageAvailable} onChange={() => setFormData(prev => ({ ...prev, packageAvailable: false }))} className="w-5 h-5 text-blue-600" />
              <span>No</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-medium text-gray-600">Offer Package *</label>
            <p className="text-xs text-gray-500 mt-1">(This package will applicable only once)</p>
          </div>
          <div className="flex gap-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: true }))} className="w-5 h-5 text-blue-600" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={!formData.offerPackage} onChange={() => setFormData(prev => ({ ...prev, offerPackage: false }))} className="w-5 h-5 text-blue-600" />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bundle with OTT - Dynamic */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="isOtt" checked={formData.isOtt} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
          <span className="font-medium text-lg">Bundle with OTT</span>
        </label>

        {formData.isOtt && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
            <div>
              <label className="block font-medium mb-1">Select OTT Type</label>
              <select name="ottType" value={formData.ottType} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select OTT Type</option>
                <option value="playBox">Play Box</option>
                {/* You can add more options later if needed */}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Select OTT Package *</label>
              <Select
                value={selectedOttOption}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    ottPackageId: selected ? selected.value : "",
                  }))
                }
                options={ottPackages.map((pkg) => ({
                  value: pkg.packId,      // what gets sent to backend
                  label: pkg.name,        // what user sees in dropdown
                }))}
                placeholder="-- Search or select OTT package --"
                isSearchable
                isClearable
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    borderRadius: "0.375rem",
                    padding: "0.25rem",
                    minHeight: "38px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bundle with IPTV */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="isIptv" checked={formData.isIptv} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
          <span className="font-medium text-lg">Bundle with IPTV</span>
        </label>

        {formData.isIptv && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
            <div>
              <label className="block font-medium mb-1">Select IPTV Type</label>
              <select name="iptvType" value={formData.iptvType} onChange={handleChange} className="border p-2 w-full rounded">
                <option value="">Select IPTV Type</option>
                <option value="ziggTv">Zigg TV</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Select IPTV Package *</label>
              <Select
                value={selectedIptvOption}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    iptvPackageId: selected ? selected.value : "",
                  }))
                }
                options={iptvPackages.map((pkg) => ({
                  value: pkg.plan_Id,
                  label: pkg.plan_name,
                }))}
                placeholder="-- Search or select IPTV package --"
                isSearchable
                isClearable
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    borderRadius: "0.375rem",
                    padding: "0.25rem",
                    minHeight: "38px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" rows={4} placeholder="Enter package description..." />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded transition">
          Submit
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded transition">
          Clear
        </button>
        <button type="button" onClick={() => navigate("/package/list")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded transition">
          Back
        </button>
      </div>
    </form>
  );
}