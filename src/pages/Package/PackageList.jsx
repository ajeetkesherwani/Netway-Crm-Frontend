import { useEffect, useState, useRef } from "react";
import { getAllPackageList } from "../../service/package"; 
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  console.log("pkg", packages)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // fetch packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getAllPackageList();
        setPackages(res.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers
  const handleView = (id) => {
    navigate(`/package/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/package/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      // TODO: Call delete API here
      setPackages(packages.filter((p) => p._id !== id));
      setOpenMenuId(null);
    }
  };

  if (loading) return <p className="p-4">Loading packages...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Package List</h1>
        <ProtectedAction module="package" action="create">
          <button
            onClick={() => navigate("/package/create")}
            className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
            aria-label="Add Package"
          >
            Add Package
          </button>
        </ProtectedAction>
      </div>

      {packages.length === 0 ? (
        <p className="text-gray-500">No packages found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto text-[12px]">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Package Name</th>
                  <th className="px-[2px] py-[2px] text-left">Validity</th>
                  <th className="px-[2px] py-[2px] text-left">Category</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.map((pkg, index) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px] hover:underline hover:cursor-pointer"  onClick={() => handleView(pkg._id)} >{pkg.name}</td>
                    <td className="px-[2px] py-[2px]">
                      {pkg.validity?.number} {pkg.validity?.unit}
                    </td>
                    <td className="px-[2px] py-[2px]">{pkg.categoryOfPlan}</td>
                    <td className="px-[2px] py-[2px]">{pkg.status}</td>
                    <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex items-center justify-start space-x-2">
                        <ProtectedAction module="package" action="view">
                          <button
                            onClick={() => handleView(pkg._id)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                            aria-label="View"
                          >
                            <FaEye size={14} />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="package" action="edit">
                          <button
                            onClick={() => handleEdit(pkg._id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                        </ProtectedAction>

                        <ProtectedAction module="package" action="delete">
                          <button
                            onClick={() => handleDelete(pkg._id)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </ProtectedAction>
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
                key={pkg._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">{index + 1}</p>
                <h2 className="text-lg font-medium">{pkg.name}</h2>
                <p className="text-sm">
                  Validity: {pkg.validity?.number} {pkg.validity?.unit}
                </p>
                <p className="text-sm">Type: {pkg.typeOfPlan}</p>
                <p className="text-sm">Category: {pkg.categoryOfPlan}</p>
                <p className="text-sm">Status: {pkg.status}</p>

                <div className="flex justify-end space-x-3 mt-3">
                  <ProtectedAction module="package" action="view">
                    <button
                      onClick={() => handleView(pkg._id)}
                      className="text-blue-600 flex items-center text-sm"
                      aria-label="View"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="package" action="edit">
                    <button
                      onClick={() => handleEdit(pkg._id)}
                      className="text-green-600 flex items-center text-sm"
                      aria-label="Edit"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="package" action="delete">
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 flex items-center text-sm"
                      aria-label="Delete"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
