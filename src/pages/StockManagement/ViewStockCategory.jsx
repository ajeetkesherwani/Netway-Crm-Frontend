import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStockCategories } from "../../service/stockCategory";
import toast from "react-hot-toast";

export default function ViewStockCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fetching, setFetching] = useState(true);
  
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await getStockCategories();
        const list = res?.data?.stockCategories || [];
        const found = list.find((s) => s._id === id);
        if (found) {
          setItem(found);
        } else {
          toast.error("Stock item not found");
          navigate(-1);
        }
      } catch (err) {
        toast.error("Failed to load stock details");
      } finally {
        setFetching(false);
      }
    };
    fetchStock();
  }, [id, navigate]);

  if (fetching) {
    return <div className="p-6 text-center text-gray-500">Loading data...</div>;
  }

  if (!item) {
    return null;
  }

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
      <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
      <div className="w-2/3 p-[2px] break-words">{value || "—"}</div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d)) return "—";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <h3 className="text-2xl font-semibold mb-4">Stock Details</h3>

      <div className="flex justify-between mb-4">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm font-medium"
        >
          Back
        </button>

        {/* ACTION BUTTONS (RIGHT SIDE) */}
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <button
            onClick={() => navigate(`/stock-category/update/${item._id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Product Name" value={item.productName} />
          <Row label="Vendor" value={item.vendor} />
          <Row label="Serial No" value={item.serialNo} />
          <Row label="MAC Address" value={item.macAddress} />
          <Row label="Quantity" value={item.quantity} />
          <Row label="Alert Quantity" value={item.stockAlertQuantity} />
          <Row label="Status" value={item.status || "In Stock"} />
          <Row label="Created At" value={formatDate(item.createdAt)} />
          {item.assignedToEngineer && (
            <Row label="Assigned Engineer" value={item.assignedToEngineer.name} />
          )}
          {item.assignedToUser && (
            <Row label="Assigned User" value={item.assignedToUser.generalInformation?.name || "Unknown"} />
          )}
          {(item.assignedToEngineer || item.assignedToUser) && (
             <Row label="Assign Date" value={formatDate(item.assignDate)} />
          )}
          {(item.assignedToEngineer || item.assignedToUser) && (
             <Row label="Assign Comment" value={item.assignComment} />
          )}
          <Row label="Description" value={item.description} />
        </div>
      </div>
    </>
  );
}
