import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getBannerById, updateBanner } from "../../../service/banner";
import { getRetailer } from "../../../service/retailer";
import { getLcosByResellerId } from "../../../service/lco";
import toast from "react-hot-toast";

export default function BannerUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bannerName: "",
    bannerType: "main",
    reseller: "",
    fromDate: "",
    toDate: "",
    short: 1,
    status: "active",
    file: null
  });

  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const res = await getRetailer();
      if (res?.status) setRetailers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResellerChange = async (e) => {
    const resellerId = e.target.value;
    setFormData((prev) => ({ ...prev, reseller: resellerId, lco: "" }));
    setLcos([]);
    if (resellerId) {
      try {
        const res = await getLcosByResellerId(resellerId);
        if (res?.status) setLcos(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await getBannerById(id);
        if (res?.status && res?.data) {
          const banner = res.data;
          
          const resellerId = banner.reseller?._id || banner.reseller || "";
          const lcoId = banner.lco?._id || banner.lco || "";

          setFormData({
            bannerName: banner.bannerName || "",
            bannerType: banner.bannerType || "main",
            reseller: resellerId,
            lco: lcoId,
            fromDate: banner.fromDate ? new Date(banner.fromDate).toISOString().split("T")[0] : "",
            toDate: banner.toDate ? new Date(banner.toDate).toISOString().split("T")[0] : "",
            short: banner.short || 1,
            status: banner.status || "active",
            file: banner.file || ""
          });

          if (resellerId) {
            try {
              const lcoRes = await getLcosByResellerId(resellerId);
              if (lcoRes?.status) setLcos(lcoRes.data);
            } catch (err) {
              console.error(err);
            }
          }
        } else {
          toast.error(res?.message || "Failed to load banner");
          navigate("/setting/banner/list");
        }
      } catch (err) {
        toast.error("Network error");
        navigate("/setting/banner/list");
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "file" ? files[0] : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bannerName) {
      toast.error("Banner Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        // If file is empty string or null in update, maybe don't append it so backend doesn't overwrite.
        if (formData[key] !== null && formData[key] !== "") {
          payload.append(key, formData[key]);
        }
      });

      const res = await updateBanner(id, payload);
      if (res?.status) {
        toast.success("Banner updated successfully");
        navigate("/setting/banner/list");
      } else {
        toast.error(res?.message || "Failed to update banner");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Update Banner</h1>
        <button
          onClick={() => navigate("/setting/banner/list")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Name *</label>
              <input
                type="text"
                name="bannerName"
                value={formData.bannerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter banner name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
              <select
                name="bannerType"
                value={formData.bannerType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="main">Main</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reseller</label>
              <Select
                value={retailers.map((r) => ({ value: r._id, label: r.resellerName })).find(opt => opt.value === formData.reseller) || null}
                onChange={(selectedOption) => {
                  const val = selectedOption ? selectedOption.value : "";
                  handleResellerChange({ target: { value: val } });
                }}
                options={retailers.map((r) => ({ value: r._id, label: r.resellerName }))}
                isClearable
                placeholder="Select Reseller"
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LCO</label>
              <Select
                value={lcos.map((l) => ({ value: l._id, label: l.lcoName || l.name || l.username })).find(opt => opt.value === formData.lco) || null}
                onChange={(selectedOption) => {
                  const val = selectedOption ? selectedOption.value : "";
                  handleChange({ target: { name: "lco", value: val } });
                }}
                options={lcos.map((l) => ({ value: l._id, label: l.lcoName || l.name || l.username }))}
                isDisabled={!formData.reseller}
                isClearable
                placeholder="Select LCO"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order (Short)</label>
              <input
                type="number"
                name="short"
                value={formData.short}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Image)</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.file instanceof File ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">New Image Preview:</p>
                <img src={URL.createObjectURL(formData.file)} alt="Preview" className="h-40 w-auto object-cover rounded border" />
              </div>
            ) : typeof formData.file === "string" && formData.file ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                <img src={formData.file} alt="Current" className="h-40 w-auto object-cover rounded border" />
              </div>
            ) : null}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
            >
              {submitting ? "Updating..." : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
