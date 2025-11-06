import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRetailer } from "../../service/retailer";
import { getAllLco } from "../../service/lco";
import { toast } from "react-toastify";
import { getRoleConfigDetail, updateRoleConfig } from "../../service/roleConfig";

export default function RoleConfigUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [type, setType] = useState("reseller"); // Default to reseller
  const [typeId, setTypeId] = useState("");

  const basePermissions = [
    { name: "list", admin: false, manager: false, operator: false },
    { name: "add", admin: false, manager: false, operator: false },
    { name: "view", admin: false, manager: false, operator: false },
    { name: "delete", admin: false, manager: false, operator: false },
    { name: "update", admin: false, manager: false, operator: false },
  ];

  const categoryPermissions = {
    dashboard: [
      ...basePermissions,
      { name: "account", admin: false, manager: false, operator: false },
    ],
    users: [...basePermissions],
    staff: [...basePermissions],
    reseller: [...basePermissions],
    lco: [...basePermissions],
    package: [...basePermissions],
    customer: [...basePermissions],
    rolepermission: [...basePermissions],
    tickets: [...basePermissions],
    pricebook: [...basePermissions],
    setting: [...basePermissions],
  };
  const [permissionGroups, setPermissionGroups] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const configData = await getRoleConfigDetail(id);
        setType(configData.type.toLowerCase());
        setTypeId(configData.typeId);

        const groups = Object.keys(categoryPermissions).map((cat) => ({
          category: cat,
          permissions: categoryPermissions[cat].map((basePerm) => {
            const rolePerms = configData.admin?.[cat]?.[basePerm.name] ?? basePerm.admin;
            return {
              name: basePerm.name,
              admin: configData.admin?.[cat]?.[basePerm.name] ?? basePerm.admin,
              manager: configData.manager?.[cat]?.[basePerm.name] ?? basePerm.manager,
              operator: configData.operator?.[cat]?.[basePerm.name] ?? basePerm.operator,
            };
          }),
        }));
        setPermissionGroups(groups);
      } catch (err) {
        console.error("Error fetching role config:", err);
        toast.error("Failed to load role config ❌");
      }
    };
    fetchData();

    // Fetch retailers
    const loadRetailers = async () => {
      try {
        const res = await getRetailer();
        setRetailers(res.data || []);
      } catch (err) {
        console.error("Error fetching retailers:", err);
        toast.error("Failed to load retailers");
      }
    };
    loadRetailers();

    // Fetch LCO list
    const loadLcos = async () => {
      try {
        const res = await getAllLco();
        setLcos(res.data || []);
      } catch (err) {
        console.error("Error fetching LCO list:", err);
        toast.error("Failed to load LCO list");
      }
    };
    loadLcos();
  }, [id]);

  const updatePerm = (groupIndex, permIndex, roleType, checked) => {
    const newGroups = [...permissionGroups];
    newGroups[groupIndex].permissions[permIndex][roleType] = checked;
    setPermissionGroups(newGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const permissions = {};
      ["admin", "manager", "operator"].forEach((roleType) => {
        const rolePerms = {};
        permissionGroups.forEach((group) => {
          if (group.category.trim() && group.permissions.length > 0) {
            const permObj = {};
            group.permissions.forEach((perm) => {
              permObj[perm.name] = perm[roleType];
            });
            rolePerms[group.category.trim()] = permObj;
          }
        });
        permissions[roleType] = rolePerms;
      });

      const payload = {
        type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize type (reseller -> Reseller, lco -> Lco)
        typeId,
        ...permissions,
      };
      await updateRoleConfig(id, payload);
      toast.success("Role config updated successfully ✅");
      navigate("/config/list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update role config ❌");
    } finally {
      setLoading(false);
    }
  };
  const typeList = type === "reseller" ? retailers : lcos;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Role Config</h2>
      <form onSubmit={handleSubmit}>
        {/* Type Select */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex-1">
            <label className="block font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setTypeId(""); // Reset typeId when type changes
              }}
              className="border p-2 w-full rounded"
              required
            >
              <option value="reseller">Reseller</option>
              <option value="lco">LCO</option>
            </select>
          </div>
        </div>

        {/* Type ID Select */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex-1">
            <label className="block font-medium mb-1">{type.toUpperCase()} ID</label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select {type.toUpperCase()}</option>
              {typeList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.resellerName || item.lcoName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Permission Groups */}
        {permissionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2 border p-2 rounded">
            <h4 className="text-sm font-semibold mb-1">{group.category.toUpperCase()}</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-1 py-0.5 text-left">Link Name</th>
                    <th className="border px-1 py-0.5 text-center">Admin</th>
                    <th className="border px-1 py-0.5 text-center">Manager</th>
                    <th className="border px-1 py-0.5 text-center">Operator</th>
                  </tr>
                </thead>
                <tbody>
                  {group.permissions.map((perm, permIndex) => (
                    <tr key={permIndex}>
                      <td className="border px-1 py-0.5">{perm.name}</td>
                      <td className="border px-1 py-0.5 text-center">
                        <input
                          type="checkbox"
                          checked={perm.admin}
                          onChange={(e) => updatePerm(groupIndex, permIndex, "admin", e.target.checked)}
                        />
                      </td>
                      <td className="border px-1 py-0.5 text-center">
                        <input
                          type="checkbox"
                          checked={perm.manager}
                          onChange={(e) => updatePerm(groupIndex, permIndex, "manager", e.target.checked)}
                        />
                      </td>
                      <td className="border px-1 py-0.5 text-center">
                        <input
                          type="checkbox"
                          checked={perm.operator}
                          onChange={(e) => updatePerm(groupIndex, permIndex, "operator", e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/config/list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}