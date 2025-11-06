import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssignedPackageDetails } from "../../../service/rolePermission";

export default function ViewAssignedPackage() {
  const { resellerId, packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getAssignedPackageDetails(resellerId, packageId);
        // ✅ API response ke andar data hai
        setPackageData(res?.data || null);
      } catch (err) {
        console.error("Error fetching assigned package details:", err);
        setError("Failed to load assigned package details");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [resellerId, packageId]);

  if (loading) return <p className="p-4">Loading assigned package details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!packageData) return <p className="p-4">Assigned package not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Assigned Package Details</h2>
        <button
          onClick={() => navigate(`/retailer/assignPackage/list/${resellerId}`)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Package Name</label>
          <p className="border p-2 rounded bg-gray-100">{packageData.name}</p>
        </div>

     

        <div>
          <label className="block font-medium">Category</label>
          <p className="border p-2 rounded bg-gray-100">{packageData.categoryOfPlan}</p>
        </div>

       
        <div>
          <label className="block font-medium">Validity</label>
          <p className="border p-2 rounded bg-gray-100">
            {packageData.validity?.number} {packageData.validity?.unit}
          </p>
        </div>

        <div>
          <label className="block font-medium">Base Price</label>
          <p className="border p-2 rounded bg-gray-100">{packageData.basePrice}</p>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <p className="border p-2 rounded bg-gray-100">{packageData.status}</p>
        </div>
      </div>
    </div>
  );
}
