// const AssignedStock = () => {
//     return <div>Assigned Stock Page</div>;
// };

// export default AssignedStock;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssignedHardwareByUserId } from "../../service/hardware";
import * as XLSX from "xlsx";

const UserAssignedHardware = () => {
  const { id } = useParams();
  const [hardware, setHardware] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedHardware = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getAssignedHardwareByUserId(id);
        if (res.status === true && res.data) {
          setHardware(res.data.hardware || []);
          setUserInfo(res.data.user || null);
        }
      } catch (err) {
        console.error("Error fetching assigned hardware:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedHardware();
  }, [id]);

  // Download Excel function
  const downloadExcel = () => {
    const data = hardware.map((item, index) => ({
      "S.No": index + 1,
      "User Name": userInfo?.name || "—",
      "Username": userInfo?.userName || "—",
      "Hardware Name": item.hardwareName || "—",
      "Type": item.hardwareType || "—",
      "Brand": item.brand || "—",
      "Model": item.model || "—",
      "Serial Number": item.serialNumber || "—",
      "Purchase Date": item.purchaseDate
        ? new Date(item.purchaseDate).toLocaleDateString("en-GB")
        : "—",
      "Warranty Expiry": item.warrantyExpiry
        ? new Date(item.warrantyExpiry).toLocaleDateString("en-GB")
        : "—",
      "Price (₹)": item.price?.toLocaleString() || "0",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assigned Hardware");
    XLSX.writeFile(wb, `${userInfo?.userName || "user"}_assigned_hardware.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl bg-gray-50 min-h-screen">
        Loading assigned hardware...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Assigned Hardware</h2>
          {userInfo && (
            <p className="text-sm text-gray-600 mt-1">
              For user: <span className="font-medium">{userInfo.name || "—"}</span> (
              {userInfo.userName || "—"})
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Total: <span className="font-medium">{hardware.length}</span> items
          </p>
          {hardware.length > 0 && (
            <button
              onClick={downloadExcel}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
            >
              Download Excel
            </button>
          )}
        </div>
      </div>

      {/* Hardware Table */}
      {hardware.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">S.No</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Username</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Hardware Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Type</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Brand</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Model</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Serial Number</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Purchase Date</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Warranty Expiry</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {hardware.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`hover:bg-gray-50 border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-800 border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {userInfo?.name || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {userInfo?.userName || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.hardwareName || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 capitalize">
                      {item.hardwareType || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.brand || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.model || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      {item.serialNumber || "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-600">
                      {item.purchaseDate
                        ? new Date(item.purchaseDate).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-600">
                      {item.warrantyExpiry
                        ? new Date(item.warrantyExpiry).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      ₹{item.price?.toLocaleString() || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No hardware assigned to this user.
        </div>
      )}
    </div>
  );
};

export default UserAssignedHardware;