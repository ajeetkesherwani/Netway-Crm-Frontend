import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRetailer } from "../../service/retailer";
import { getAllLco } from "../../service/lco";
import { toast } from "react-toastify";
import { createConfig } from "../../service/roleConfig";

export default function RoleConfigCreate() {
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
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    // Initialize permission groups for each category with base + custom permissions
    const initializeGroups = () => {
      const groups = Object.keys(categoryPermissions).map((cat) => ({
        category: cat,
        permissions: categoryPermissions[cat],
      }));
      setPermissionGroups(groups);
      // Initialize all categories as collapsed
      const initialExpanded = {};
      Object.keys(categoryPermissions).forEach((cat) => {
        initialExpanded[cat] = false;
      });
      setExpandedCategories(initialExpanded);
    };
    initializeGroups();
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
  }, []);
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  const toggleAll = () => {
    const newExpanded = {};
    Object.keys(categoryPermissions).forEach((cat) => {
      newExpanded[cat] = !allExpanded;
    });
    setExpandedCategories(newExpanded);
    setAllExpanded(!allExpanded);
  };

  const toggleRoleAll = (roleType, groupIndex) => {
    const newGroups = [...permissionGroups];
    const allChecked = newGroups[groupIndex].permissions.every((p) => p[roleType]);
    newGroups[groupIndex].permissions = newGroups[groupIndex].permissions.map((p) => ({
      ...p,
      [roleType]: !allChecked,
    }));
    setPermissionGroups(newGroups);
  };
  // const updatePerm = (groupIndex, permIndex, roleType, checked) => {
  //   console.log(groupIndex,permIndex,roleType,checked," this is the data inside the update perm")
  //   const newGroups = [...permissionGroups];
  //   newGroups[groupIndex].permissions[permIndex][roleType] = checked;
  //   console.log(newGroups[groupIndex].permissions[permIndex][roleType],"updated permission");
  //   console.log(newGroups,"updated permission groups");
  //   setPermissionGroups(newGroups);
  // };

 const updatePerm = (groupIndex, permIndex, roleType, checked) => {
  console.log(groupIndex, permIndex, roleType, checked, "this is the data inside the updatePerm");
  const newGroups = [...permissionGroups];
  const updatedPermission = { ...newGroups[groupIndex].permissions[permIndex] };
  updatedPermission[roleType] = checked;
  newGroups[groupIndex].permissions[permIndex] = updatedPermission;
  console.log(newGroups[groupIndex].permissions[permIndex][roleType], "updated permission");
  console.log(newGroups, "updated permission groups");
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
      await createConfig(payload);
      toast.success("Role config created successfully");
      navigate("/config/list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create role config");
    } finally {
      setLoading(false);
    }
  };
  const typeList = type === "reseller" ? retailers : lcos;
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Role Config</h2>
      <form onSubmit={handleSubmit}>
        {/* Type Select */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex-1">
            <label className="block font-medium mb-1">Type
              <span className="text-black-900 ml-1">*</span>
            </label>
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
            <label className="block font-medium mb-1">{type.toUpperCase()} ID
              <span className="text-black-900 ml-1">*</span>
            </label>
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
        {/* Expand/Collapse All Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={toggleAll}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
        {/* Permission Groups with Accordion */}
        {permissionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2 border p-2 rounded">
            <div
              className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
              onClick={() => toggleCategory(group.category)}
            >
              <h4 className="text-sm font-semibold">{group.category.toUpperCase()}</h4>
              <span>{expandedCategories[group.category] ? "−" : "+"}</span>
            </div>
            {expandedCategories[group.category] && (
              <div className="p-2">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-1 py-0.5 text-left">Link Name</th>
                      <th className="border px-1 py-0.5 text-center">
                        Admin
                        <input
                          type="checkbox"
                          className="ml-1"
                          onChange={() => toggleRoleAll("admin", groupIndex)}
                        />
                      </th>
                      <th className="border px-1 py-0.5 text-center">
                        Manager
                        <input
                          type="checkbox"
                          className="ml-1"
                          onChange={() => toggleRoleAll("manager", groupIndex)}
                        />
                      </th>
                      <th className="border px-1 py-0.5 text-center">
                        Operator
                        <input
                          type="checkbox"
                          className="ml-1"
                          onChange={() => toggleRoleAll("operator", groupIndex)}
                        />
                      </th>
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
            )}
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
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}