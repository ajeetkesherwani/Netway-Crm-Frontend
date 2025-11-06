import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { getAssignedPackageList, updateAssignedPackageStatus } from "../../../service/rolePermission";
import { IoMdArrowBack } from "react-icons/io";

export default function LcoAssignPackageList() {
  const { id } = useParams(); // Reseller ID from URL params
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch assigned packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getAssignedPackageList(id);
        setPackages(res.data?.packages || []);
      } catch (err) {
        console.error("Error fetching assigned packages:", err);
        setError("Failed to load assigned packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, [id]);

  // Handlers
  const handleView = (packageId) => {
    navigate(`/retailer/assignPackage/view/${id}/${packageId}`);
  };

  const handleEdit = async (packageId, currentStatus) => {
    const confirmChange = window.confirm(
      `Are you sure you want to change the status to ${
        currentStatus === "active" ? "inActive" : "active"
      }?`
    );
    if (!confirmChange) return;
    const newStatus = currentStatus === "active" ? "inActive" : "active";
    try {
      const response = await updateAssignedPackageStatus(packageId, newStatus);
      console.log("Status updated successfully:", response);
      // Optionally refresh your data or show a toast message
      // await fetchPackageList();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update package status.");
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm("Are you sure you want to delete this assigned package?")) {
      // TODO: Call delete API
      setPackages(packages.filter((p) => p.packageId !== packageId));
    }
  };

  if (loading) return <p className="p-4">Loading assigned packages...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="">
      <div className="flex items-center justify-end h-0 mb-4">
        {/* <h1 className="text-xl font-semibold">Assigned Package List</h1> */}
        <div className="space-x-2 flex ">
          {/* <button
            onClick={() => navigate(`/lco/list`)}
            className="px-[2px] py-[2px] text-white bg-gray-600 rounded hover:bg-gray-700 text-[12px]"
          >
            <span className="flex items-center">
              <IoMdArrowBack className="mr-1" /> Back
            </span>
          </button> */}
          <button
            onClick={() => navigate(`/lco/assignPackage/${id}`)}
            className="px-1 py-[1px] text-white bg-blue-600 rounded hover:bg-blue-700 relative -top-3 right-6 text-[12px]"
          >
            Assign New Package
          </button>
        </div>
      </div>
      {packages.length === 0 ? (
        <p className="text-gray-500 text-center">No packages assigned.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Package Name</th>
                  <th className="px-[2px] py-[2px] text-left">Base Price</th>
                  <th className="px-[2px] py-[2px] text-left">Offer Price</th>
                  <th className="px-[2px] py-[2px] text-left">Retailer Price</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.map((pkg, index) => (
                  <tr key={pkg.packageId} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px]">{pkg.name}</td>
                    <td className="px-[2px] py-[2px]">{pkg.basePrice}</td>
                    <td className="px-[2px] py-[2px]">{pkg.offerPrice}</td>
                    <td className="px-[2px] py-[2px]">{pkg.retailerPrice}</td>
                    <td className={`px-[2px] py-[2px] ${pkg.status === "active" ? "text-green-700" : "text-red-700"}`}>{pkg.status}</td>
                    <td className="px-[2px] py-[2px] text-right">
                      <div className="flex items-center justify-start gap-1">
                        <button
                          onClick={() => handleView(pkg.packageId)}
                          className="p-1 text-gray-600 hover:text-blue-600 rounded"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(pkg.packageId, pkg.status)}
                          className="p-1 text-gray-600 hover:text-green-600 rounded"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.packageId)}
                          className="p-1 text-red-600 hover:text-red-700 rounded"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {packages.map((pkg, index) => (
              <div
                key={pkg.packageId}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">{pkg.name}</h2>
                <p className="text-sm">Base Price: {pkg.basePrice}</p>
                <p className="text-sm">Offer Price: {pkg.offerPrice}</p>
                <p className="text-sm">Retailer Price: {pkg.retailerPrice}</p>
                <p className={`text-sm ${pkg.status === "active" ? "text-green-700" : "text-red-700"}`}>Status: {pkg.status}</p>
                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(pkg.packageId)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(pkg.packageId, pkg.status)}
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.packageId)}
                    className="text-red-600 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}