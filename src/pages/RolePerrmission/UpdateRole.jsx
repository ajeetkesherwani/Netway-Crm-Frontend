// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { updateRole, getRoleDetails } from "../../service/rolePermission";
// import { toast } from "react-toastify";
// import { IoMdArrowBack } from "react-icons/io";
// import { permissionsConfig } from "../../config/permissionsConfig";

// export default function UpdateRole() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [roleName, setRoleName] = useState("");
//   const [permissionGroups, setPermissionGroups] = useState([]);
//   const [expandedGroups, setExpandedGroups] = useState([]);
//   const [allExpanded, setAllExpanded] = useState(false);

//   // ✅ Fetch and merge role permissions
//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const res = await getRoleDetails(id);
//         const role = res.data || res;
//         setRoleName(role.roleName);

//         // ✅ Step 1: Initialize groups based on config
//         const groups = permissionsConfig.map((item) => ({
//           category: item.category,
//           label: item.label,
//           permissions: item.permissions.map((perm) => ({
//             name: perm,
//             allowed: false,
//           })),
//         }));

//         // ✅ Step 2: Merge valid backend permissions
//         Object.entries(role.permissions || {}).forEach(([category, perms]) => {
//           const groupIndex = groups.findIndex((g) => g.category === category);
//           if (groupIndex !== -1) {
//             const validPerms =
//               permissionsConfig.find((c) => c.category === category)
//                 ?.permissions || [];

//             Object.entries(perms).forEach(([permName, allowed]) => {
//               // Only merge if permission exists in config
//               if (!validPerms.includes(permName)) return;

//               const permIndex = groups[groupIndex].permissions.findIndex(
//                 (p) => p.name === permName
//               );
//               if (permIndex !== -1) {
//                 groups[groupIndex].permissions[permIndex].allowed = allowed;
//               }
//             });
//           }
//         });

//         // ✅ Step 3: Apply only config-defined categories (skip old ones)
//         const cleanedGroups = groups.filter((group) =>
//           permissionsConfig.some((cfg) => cfg.category === group.category)
//         );

//         setPermissionGroups(cleanedGroups);
//         setExpandedGroups(Array(cleanedGroups.length).fill(true));
//         setAllExpanded(true);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load role details ❌");
//       }
//     };

//     fetchRole();
//   }, [id]);

//   // ✅ Update single permission toggle
//   const updatePerm = (groupIndex, permIndex, checked) => {
//     const newGroups = [...permissionGroups];
//     newGroups[groupIndex].permissions[permIndex].allowed = checked;
//     setPermissionGroups(newGroups);
//   };

//   // ✅ Expand / collapse one category
//   const toggleCategory = (groupIndex) => {
//     const newExpanded = [...expandedGroups];
//     newExpanded[groupIndex] = !newExpanded[groupIndex];
//     setExpandedGroups(newExpanded);
//   };

//   // ✅ Expand / collapse all
//   const toggleAll = () => {
//     const newExpanded = expandedGroups.map(() => !allExpanded);
//     setExpandedGroups(newExpanded);
//     setAllExpanded(!allExpanded);
//   };

//   // ✅ Select / deselect all in category
//   const toggleAllInCategory = (groupIndex) => {
//     const newGroups = [...permissionGroups];
//     const group = newGroups[groupIndex];
//     const allChecked = group.permissions.every((perm) => perm.allowed);
//     group.permissions = group.permissions.map((perm) => ({
//       ...perm,
//       allowed: !allChecked,
//     }));
//     setPermissionGroups(newGroups);
//   };

//   // ✅ Handle submit (frontend-only cleanup logic)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const permissions = {};

//       permissionGroups.forEach((group) => {
//         const configCategory = permissionsConfig.find(
//           (c) => c.category === group.category
//         );

//         // ✅ Skip if category doesn't exist in config
//         if (!configCategory) return;

//         const permObj = {};
//         group.permissions.forEach((perm) => {
//           // ✅ Only send valid permission names
//           if (configCategory.permissions.includes(perm.name)) {
//             permObj[perm.name] = perm.allowed;
//           }
//         });

//         // ✅ Add category only if it has valid permissions
//         if (Object.keys(permObj).length > 0) {
//           permissions[group.category] = permObj;
//         }
//       });

//       // ✅ Debug: log what’s being sent (optional)
//       if (import.meta.env.MODE === "development") {
//         console.log("🧹 Clean permissions being sent:", permissions);
//       }

//       // ✅ Send only clean permissions (old keys/categories excluded)
//       await updateRole(id, { roleName, permissions });

//       toast.success("Role updated successfully ✅");
//       navigate("/role/list");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to update role ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ UI (same as before)
//   return (
//     <div className="max-w-8xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-6">Update Role</h2>

//       <button
//         onClick={() => navigate("/role/list")}
//         className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center mb-1"
//       >
//         <IoMdArrowBack /> Back
//       </button>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-6">
//           <label className="block font-medium mb-1">Role Name</label>
//           <input
//             type="text"
//             value={roleName}
//             onChange={(e) => setRoleName(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         <div className="flex justify-end mb-4">
//           <button
//             type="button"
//             onClick={toggleAll}
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//           >
//             {allExpanded ? "Collapse All" : "Expand All"}
//           </button>
//         </div>

//         {permissionGroups.map((group, groupIndex) => {
//           const allChecked = group.permissions.every((perm) => perm.allowed);
//           return (
//             <div key={group.category} className="mb-2 border p-2 rounded">
//               <div
//                 className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
//                 onClick={() => toggleCategory(groupIndex)}
//               >
//                 <h4 className="text-sm font-semibold">
//                   {group.label.toUpperCase()}
//                 </h4>
//                 <span>{expandedGroups[groupIndex] ? "−" : "+"}</span>
//               </div>

//               {expandedGroups[groupIndex] && (
//                 <div className="p-2">
//                   <table className="w-full border-collapse text-xs">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="border px-1 py-0.5 text-left">
//                           Permission
//                         </th>
//                         <th className="border px-1 py-0.5 text-center">
//                           Allowed
//                           <input
//                             type="checkbox"
//                             checked={allChecked}
//                             onChange={() => toggleAllInCategory(groupIndex)}
//                             className="ml-1"
//                           />
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {group.permissions.map((perm, permIndex) => (
//                         <tr key={permIndex}>
//                           <td className="border px-1 py-0.5">{perm.name}</td>
//                           <td className="border px-1 py-0.5 text-center">
//                             <input
//                               type="checkbox"
//                               checked={perm.allowed}
//                               onChange={(e) =>
//                                 updatePerm(
//                                   groupIndex,
//                                   permIndex,
//                                   e.target.checked
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={() => navigate("/role/list")}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//           >
//             {loading ? "Saving..." : "Update"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateRole, getRoleDetails } from "../../service/rolePermission";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
} from "react-icons/md";
import { FaAngleDoubleRight } from "react-icons/fa";
import { permissionsConfig } from "../../config/permissionsConfig";

export default function UpdateRole() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getRoleDetails(id);
        const role = res.data || res;
        setRoleName(role.roleName || "");

        // Initialize groups from config
        const groups = permissionsConfig.map((item) => ({
          category: item.category,
          label: item.label,
          permissions: item.permissions.map((perm) => ({
            name: perm,
            allowed: false,
          })),
        }));

        // Merge existing permissions from backend (only valid ones)
        if (role.permissions) {
          Object.entries(role.permissions).forEach(([category, perms]) => {
            const groupIndex = groups.findIndex((g) => g.category === category);
            if (groupIndex !== -1) {
              const validPerms = permissionsConfig.find(c => c.category === category)?.permissions || [];
              Object.entries(perms).forEach(([permName, allowed]) => {
                if (validPerms.includes(permName)) {
                  const permIndex = groups[groupIndex].permissions.findIndex(p => p.name === permName);
                  if (permIndex !== -1) {
                    groups[groupIndex].permissions[permIndex].allowed = allowed;
                  }
                }
              });
            }
          });
        }

        setPermissionGroups(groups);
        setExpandedGroups(Array(groups.length).fill(true));
        setAllExpanded(true);
      } catch (err) {
        toast.error("Failed to load role details ❌");
        console.error(err);
      }
    };

    fetchRole();
  }, [id]);

  /* ---------------- TOGGLES ---------------- */
  const updatePerm = (groupIndex, permIndex, checked) => {
    const newGroups = [...permissionGroups];
    newGroups[groupIndex].permissions[permIndex].allowed = checked;
    setPermissionGroups(newGroups);
  };

  const toggleCategory = (groupIndex) => {
    const newExpanded = [...expandedGroups];
    newExpanded[groupIndex] = !newExpanded[groupIndex];
    setExpandedGroups(newExpanded);
    setAllExpanded(newExpanded.every(Boolean));
  };

  const toggleAllCategories = () => {
    const newState = !allExpanded;
    setExpandedGroups(Array(permissionGroups.length).fill(newState));
    setAllExpanded(newState);
  };

  const toggleAllInCategory = (groupIndex) => {
    const newGroups = [...permissionGroups];
    const group = newGroups[groupIndex];
    const allChecked = group.permissions.every((p) => p.allowed);

    group.permissions = group.permissions.map((p) => ({
      ...p,
      allowed: !allChecked,
    }));

    setPermissionGroups(newGroups);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const permissions = {};

      permissionGroups.forEach((group) => {
        const permObj = {};
        group.permissions.forEach((perm) => {
          permObj[perm.name] = perm.allowed;
        });
        permissions[group.category] = permObj;
      });

      await updateRole(id, { roleName, permissions });
      toast.success("Role updated successfully ✅");
      navigate("/role/list");
    } catch (err) {
      toast.error(err.message || "Failed to update role ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Role</h2>

      {/* Back */}
      <button
        onClick={() => navigate("/role/list")}
        className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-4"
      >
        <IoMdArrowBack size={16} />
        Back
      </button>

      <form onSubmit={handleSubmit}>
        {/* Role Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Enter role name"
          />
        </div>

        {/* Expand / Collapse All */}
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={toggleAllCategories}
            className="text-xs px-4 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Permission Groups */}
        <div className="space-y-3">
          {permissionGroups.map((group, groupIndex) => {
            const isExpanded = expandedGroups[groupIndex];
            const allChecked = group.permissions.every((p) => p.allowed);

            return (
              <div key={group.category} className="border rounded">
                {/* HEADER — ALL LEFT ALIGNED */}
                <div className="flex items-center gap-6 bg-gray-100 px-4 py-2">
                  {/* Arrow */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(groupIndex)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {isExpanded ? (
                      <FaAngleDoubleRight size={20} />
                    ) : (
                      <MdKeyboardDoubleArrowDown size={20} />
                    )}
                  </button>

                  {/* Heading */}
                  <h3 className="text-sm font-bold uppercase">
                    {group.label}
                  </h3>

                  {/* Check All */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => toggleAllInCategory(groupIndex)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-semibold">CHECK ALL</span>
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {group.permissions.map((perm, permIndex) => (
                      <label
                        key={permIndex}
                        className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={perm.allowed}
                          onChange={(e) =>
                            updatePerm(
                              groupIndex,
                              permIndex,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-medium">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}