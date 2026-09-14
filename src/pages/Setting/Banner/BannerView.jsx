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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return `${day}-${month}-${year} ${strTime}`;
  };

  const formatStatus = (status) => {
    if (status === "active" || status === "true" || status === true) return "Active";
    if (status === "inactive" || status === "false" || status === false) return "Inactive";
    return status || "—";
  };

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
      <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
      <div className="w-2/3 p-[2px] break-words">{value || "—"}</div>
    </div>
  );

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2 p-4">Banner Details</h3>

      <div className="flex justify-between mb-4 px-4">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/setting/banner/list")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        >
          Back
        </button>

        {/* ACTION BUTTONS (RIGHT SIDE) */}
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <button
            onClick={() => navigate(`/setting/banner/update/${banner?._id || id}`)}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="mx-4 border rounded-lg overflow-hidden shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Banner Name" value={banner.bannerName} />
          <Row label="Banner Type" value={<span className="capitalize">{banner.bannerType}</span>} />
          <Row label="Reseller" value={banner.reseller?.resellerName || banner.reseller?.name || "—"} />
          <Row label="LCO" value={banner.lco?.lcoName || banner.lco?.name || "—"} />
          <Row label="From Date" value={formatDateTime(banner.fromDate)} />
          <Row label="To Date" value={formatDateTime(banner.toDate)} />
          <Row label="Short" value={banner.short} />
          <Row label="Status" value={formatStatus(banner.status)} />
          <Row label="Created At" value={formatDateTime(banner.createdAt)} />
          <Row label="Updated At" value={formatDateTime(banner.updatedAt)} />
        </div>
      </div>

      {banner.file && (
        <div className="mx-4 mt-6 p-4 border rounded-lg shadow bg-white">
          <h4 className="text-lg font-semibold mb-4 border-b pb-2">Banner Image</h4>
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
        </div>
      )}
    </>
  );
}
