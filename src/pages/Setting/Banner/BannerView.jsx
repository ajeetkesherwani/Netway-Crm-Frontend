import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBannerById } from "../../../service/banner";
import toast from "react-hot-toast";

export default function BannerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await getBannerById(id);
        if (res?.status && res?.data) {
          setBanner(res.data);
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

  const handleDownloadImage = async () => {
    if (!banner?.file) return;
    try {
      const response = await fetch(banner.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = banner.bannerName || "banner_image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading banner details...</div>;
  }

  if (!banner) {
    return null; // or an error state
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">View Banner</h1>
        <button
          onClick={() => navigate("/setting/banner/list")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Banner Information</h2>
            <div>
              <p className="text-sm text-gray-500">Banner Name</p>
              <p className="font-medium text-gray-800">{banner.bannerName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Banner Type</p>
              <p className="font-medium text-gray-800 capitalize">{banner.bannerType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">From Date</p>
              <p className="font-medium text-gray-800">
                {banner.fromDate ? new Date(banner.fromDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To Date</p>
              <p className="font-medium text-gray-800">
                {banner.toDate ? new Date(banner.toDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sort Order (Short)</p>
              <p className="font-medium text-gray-800">{banner.short || 1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold ${banner.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {banner.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium text-gray-800">
                {banner.createdAt ? new Date(banner.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Banner Image</h2>
            {banner.file ? (
              <div className="flex flex-col items-start gap-4">
                <a href={banner.file} target="_blank" rel="noopener noreferrer" className="block w-full max-w-sm rounded border shadow-sm hover:shadow-md transition">
                  <img src={banner.file} alt={banner.bannerName} className="w-full h-auto object-cover rounded" />
                </a>
                <p className="text-xs text-gray-500 italic">Click image to view full size in new tab</p>
                <button
                  onClick={handleDownloadImage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  Download Image
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">No image available for this banner.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
