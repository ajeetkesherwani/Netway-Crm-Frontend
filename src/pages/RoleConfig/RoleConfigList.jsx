import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { deleteConfig, getAllConfigList, updateConfigStatus } from "../../service/roleConfig";
import { toast } from "react-toastify";
import ProtectedAction from "../../components/ProtectedAction";

export default function RoleConfigList() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openStatusModalId, setOpenStatusModalId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); 
  // Fetch configs
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const res = await getAllConfigList();
        setConfigs(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching configs:", err);
        setError("Failed to load configs");
      } finally {
        setLoading(false);
      }
    };
    loadConfigs();
  }, []);
  // Handlers
  const handleView = (id) => {
    navigate(`/config/view/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/config/update/${id}`);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this config?")) {
      try {
        await deleteConfig(id);
        setConfigs(configs.filter((c) => c._id !== id));
        toast.success("Config deleted successfully ✅");
      } catch (err) {
        console.error("Error deleting config:", err);
        setError("Failed to delete config");
        toast.error(err.message || "Failed to delete config ❌");
      }
    }
  };
  const handleUpdateStatus = async (id, status) => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    setIsUpdating(true);
    try {
      await updateConfigStatus(id, status);
      toast.success("Config status updated successfully ✅");
      const res = await getAllConfigList();
      setConfigs(res.data || []);
      setOpenStatusModalId(null);
      setNewStatus("");
    } catch (err) {
      console.error("Error updating config status:", err);
      toast.error(err.message || "Failed to update config status ❌");
    } finally {
      setIsUpdating(false);
    }
  };
  if (loading) return <p className="p-4">Loading configs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Config List</h1>
        <ProtectedAction module="configlist" action="create">
        <button
          onClick={() => navigate("/config/create")}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Config
        </button>
        </ProtectedAction>
      </div>
      {configs.length === 0 ? (
        <p className="text-gray-500">No configs found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">S.No</th>
                  <th className="px-2 py-2 text-left">Type</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Created At</th>
                  <th className="px-2 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {configs.map((config, index) => (
                  console.log(config," this is the data inside the config"),
                  <tr key={config._id} className="hover:bg-gray-50 relative">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2 hover:cursor-pointer hover:underline" onClick={() => handleView(config._id)}>
                      {config?.type || "—"}
                    </td>
                     <td className="px-2 py-2">{config?.type, "->", config?.typeId?.resellerName || "-----" }</td>
                     <td className="px-2 py-2">{config?.createdAt.slice(0,10)}</td>
                    <td className="px-2 py-2 text-right relative">
                      <div className="flex items-center gap-3">
                        <ProtectedAction module="configlist" action="view">
                          <button
                              onClick={() => handleView(config._id)}
                              className="text-gray-600 hover:text-blue-600"
                              title="View"
                            >
                              <FaEye />
                            </button>
                        </ProtectedAction>
                         <ProtectedAction module="configlist" action="edit">
                        <button
                          onClick={() => handleEdit(config._id)}
                          className="text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        </ProtectedAction>
                        <ProtectedAction module="configlist" action="delete">
                        <button
                          onClick={() => handleDelete(config._id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
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
            {configs.map((config, index) => (
              <div
                key={config._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">{config.generalInformation?.name || "—"}</h2>
                <p className="text-sm">{config.generalInformation?.description || "—"}</p>
                <p className="text-sm">{config.generalInformation?.type || "—"}</p>
                <p className="text-sm">{config.networkInformation?.networkType || "—"}</p>
                <p className="text-sm font-medium">
                  Status: 
                  <span className={`inline-block ml-1 px-2 py-1 rounded ${config.status === "active" ? "bg-green-100 text-green-800" : config.status === "suspend" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                    {config.status || "inactive"}
                  </span>
                  <button
                    onClick={() => {
                      setOpenStatusModalId(config._id);
                      setNewStatus(config.status || "inactive");
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Update
                  </button>
                </p>
                <div className="flex justify-end space-x-3 mt-3">
                  <ProtectedAction module="configlist" action="view">
                  <button
                    onClick={() => handleView(config._id)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  </ProtectedAction>
                  <ProtectedAction module="configlist" action="edit">
                  <button
                    onClick={() => handleEdit(config._id)}
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  </ProtectedAction>
                  <ProtectedAction module="configlist" action="delete">
                  <button
                    onClick={() => handleDelete(config._id)}
                    className="text-red-600 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>

          {/* Status Update Modal */}
          {openStatusModalId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Update Config Status</h3>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspend">Suspend</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setOpenStatusModalId(null);
                      setNewStatus("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(openStatusModalId, newStatus)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    disabled={!newStatus || isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}