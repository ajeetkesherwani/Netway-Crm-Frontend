import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBanners, updateBanner, deleteBanner } from "../../../service/banner";
import { FaEdit, FaTrash, FaEllipsisV, FaSearch, FaPlus, FaCheckCircle, FaTimesCircle, FaFileExcel, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  
  // Menu toggle
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/setting/banner/view/${id}`);
    setOpenMenuId(null);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      
      const res = await getBanners(params);
      if (res?.status) {
        setBanners(res.data || []);
      } else {
        setError(res?.message || "Failed to load banners");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEdit = (id) => {
    navigate(`/setting/banner/update/${id}`);
    setOpenMenuId(null);
  };

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === "active" ? "inactive" : "active";
    try {
      const res = await updateBanner(banner._id, { status: newStatus });
      if (res?.status) {
        toast.success(`Banner status changed to ${newStatus}`);
        fetchBanners();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      setOpenMenuId(null);
      return;
    }
    try {
      const res = await deleteBanner(id);
      if (res?.status) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      } else {
        toast.error(res?.message || "Failed to delete banner");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleDownloadExcel = () => {
    if (banners.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const exportData = banners.map((item, index) => {
      const { _id, updatedAt, __v, file, ...rest } = item;
      
      const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
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

      return {
        "S.No": index + 1,
        ...rest,
        fromDate: item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "",
        toDate: item.toDate ? new Date(item.toDate).toLocaleDateString() : "",
        createdAt: formatDateTime(item.createdAt)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banners");
    XLSX.writeFile(workbook, "Banner List.xlsx");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Banner List</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-green-700 shadow-sm whitespace-nowrap"
          >
            <FaFileExcel /> Download Excel
          </button>
          <button
            onClick={() => navigate("/setting/banner/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-blue-700 shadow-sm whitespace-nowrap"
          >
            <FaPlus /> Create
          </button>
        </div>
      </div>


      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading banners...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 border-b text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Banner Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Short</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.length > 0 ? (
                banners.map((banner, index) => (
                  <tr key={banner._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {banner.file ? (
                        <img src={banner.file} alt={banner.bannerName || "banner"} className="h-10 w-16 object-cover rounded border" />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{banner.bannerName}</td>
                    <td className="px-4 py-3 capitalize">{banner.bannerType}</td>
                    <td className="px-4 py-3">{banner.short}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === banner._id ? null : banner._id);
                        }}
                        className="p-2 rounded-full hover:bg-gray-200 transition action-toggle"
                      >
                        <FaEllipsisV />
                      </button>
                      
                      {openMenuId === banner._id && (
                        <div className="absolute right-8 top-8 w-40 bg-white border rounded-lg shadow-lg z-10 action-menu">
                          <button
                            onClick={() => handleView(banner._id)}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-700"
                          >
                            <FaEye className="text-gray-500" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(banner._id)}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-700"
                          >
                            <FaEdit className="text-blue-500" /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(banner)}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-700"
                          >
                            {banner.status === "active" ? (
                              <><FaTimesCircle className="text-orange-500" /> Deactivate</>
                            ) : (
                              <><FaCheckCircle className="text-green-500" /> Activate</>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-red-600"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
