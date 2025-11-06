import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoleConfigDetail } from "../../service/roleConfig";
import { IoMdArrowBack } from "react-icons/io";

export default function RoleConfigDetail() {
  const { id } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const data = await getRoleConfigDetail(id);
        setConfig(data);
      } catch (err) {
        console.error("Error fetching role config details:", err);
        setError("Failed to load role config details");
        toast.error("Failed to load role config details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!config) return <p className="p-4 text-gray-500">No data available</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Role Configuration Details</h1>
        <button
                        onClick={() => navigate("/config/list")}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center mb-1"
                      >
                        <IoMdArrowBack /> Back
                      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">General Info</h2>
          <p><strong>Type:</strong> {config.type}</p>
          <p><strong>Type ID:</strong> {config.typeId}</p>
          <p><strong>Created By:</strong> {config.createdBy}</p>
          <p><strong>Created At:</strong> {new Date(config.createdAt).toLocaleString()}</p>
          <p><strong>Payment Received:</strong> {config.isPaymentRecived ? "Yes" : "No"}</p>
        </div>
        {["admin", "manager", "operator"].map((role) => (
          <div key={role} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-2">{role.charAt(0).toUpperCase() + role.slice(1)} Permissions</h2>
            {Object.entries(config[role]).map(([module, perms]) => (
              <div key={module} className="mb-2">
                <h3 className="text-md font-semibold">{module.charAt(0).toUpperCase() + module.slice(1)}</h3>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(perms).map(([perm, enabled]) => (
                    <li key={perm} className={enabled ? "text-green-600" : "text-red-600"}>
                      {perm}: {enabled ? "Enabled" : "Disabled"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}