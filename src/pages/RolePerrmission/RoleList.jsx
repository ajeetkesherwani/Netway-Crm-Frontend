// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
// import { deleteRoleById, getAllRoleList } from "../../service/rolePermission";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function RoleList() {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null); // For 3-dot menu
//   const navigate = useNavigate();

//   // Fetch roles
//   useEffect(() => {
//     const loadRoles = async () => {
//       try {
//         const res = await getAllRoleList();
//         setRoles(res.data || []);
//       } catch (err) {
//         console.error("Error fetching roles:", err);
//         setError("Failed to load roles");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadRoles();
//   }, []);

//   // Toggle 3-dot menu
//   const toggleMenu = (id) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => setOpenMenuId(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleView = (id) => {
//     navigate(`/role/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleEdit = (id) => {
//     navigate(`/role/update/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this role?")) {
//       try {
//         await deleteRoleById(id);
//         setRoles(roles.filter((r) => r._id !== id));
//       } catch (err) {
//         console.error("Error deleting role:", err);
//       }
//     }
//     setOpenMenuId(null);
//   };

//   if (loading) return <p className="p-4">Loading roles...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold text-gray-800">Role List</h1>
//         <button
//           onClick={() => navigate("/role/create")}
//           className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
//         >
//           Add Role
//         </button>
//       </div>

//       {roles.length === 0 ? (
//         <p className="text-gray-500">No roles found.</p>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-[600px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-2 py-2 text-left">S.No</th>
//                   <th className="px-2 py-2 text-left">Role Name</th>
//                   <th className="px-2 py-2 text-left">Status</th>
//                   <th className="px-2 py-2 text-left">Created At</th>
//                   <th className="px-2 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {roles.map((role, index) => (
//                   <tr key={role._id} className="hover:bg-gray-50">
//                     <td className="px-2 py-2">{index + 1}</td>
//                     <td
//                       className="px-2 py-2 text-black hover:text-blue-600 hover:underline cursor-pointer"
//                       onClick={() => handleView(role._id)}
//                     >
//                       {role.roleName || "—"}
//                     </td>
//                     <td className="px-2 py-2">
//                       <span
//                         className={`px-1 py-0.5 rounded-full text-xs font-semibold ${role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                           }`}
//                       >
//                         {role.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-2 py-2">{role.createdAt.slice(0, 10)}</td>
//                     <td className="px-2 py-2 text-center relative">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleMenu(role._id);
//                         }}
//                         className="p-1 hover:bg-gray-200 rounded"
//                       >
//                         <FaEllipsisV className="text-gray-600" />
//                       </button>

//                       {/* Dropdown Menu */}
//                       {openMenuId === role._id && (
//                         <div
//                           className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <div className="py-1">
//                             <button
//                               onClick={() => handleView(role._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                             >
//                               <FaEye /> View
//                             </button>
//                             <button
//                               onClick={() => handleEdit(role._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                             >
//                               <FaEdit /> Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(role._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                             >
//                               <FaTrash /> Delete
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View - Also using 3-dot menu */}
//           <div className="space-y-2 md:hidden">
//             {roles.map((role, index) => (
//               <div key={role._id} className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition relative">
//                 <div className="flex justify-between items-start mb-1">
//                   <div>
//                     <h2
//                       className="text-base font-semibold text-gray-800 hover:cursor-pointer hover:underline"
//                       onClick={() => handleView(role._id)}
//                     >
//                       {role.roleName || "—"}
//                     </h2>
//                     <p className="text-xs text-gray-500">Created: {role.createdAt.slice(0, 10)}</p>
//                   </div>
//                   <span
//                     className={`px-1 py-0.5 rounded-full text-xs font-semibold ${role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                       }`}
//                   >
//                     {role.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleMenu(role._id);
//                     }}
//                     className="p-1 hover:bg-gray-200 rounded"
//                   >
//                     <FaEllipsisV className="text-gray-600" />
//                   </button>
//                 </div>

//                 {/* Mobile Dropdown */}
//                 {openMenuId === role._id && (
//                   <div
//                     className="absolute right-4 top-12 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <div className="py-1">
//                       <button
//                         onClick={() => handleView(role._id)}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                       >
//                         <FaEye /> View
//                       </button>
//                       <button
//                         onClick={() => handleEdit(role._id)}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                       >
//                         <FaEdit /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(role._id)}
//                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { deleteRoleById, getAllRoleList } from "../../service/rolePermission";
import ProtectedAction from "../../components/ProtectedAction";

import { updateRoleStatus } from "../../service/role"; // ← adjust path if needed

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null); // For 3-dot menu

  const navigate = useNavigate();

  // Fetch roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await getAllRoleList();
        setRoles(res.data || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  // Toggle 3-dot menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleView = (id) => {
    navigate(`/role/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/role/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRoleById(id);
        setRoles(roles.filter((r) => r._id !== id));
      } catch (err) {
        console.error("Error deleting role:", err);
      }
    }
    setOpenMenuId(null);
  };

  // Direct toggle status (no confirmation popup)
  const handleToggleStatus = async (roleId, currentStatus) => {
    const nextStatus = !currentStatus;

    try {
      await updateRoleStatus(roleId, nextStatus);

      // Refresh list
      const res = await getAllRoleList();
      setRoles(res.data || []);

      alert(`Role status changed to ${nextStatus ? "Active" : "Inactive"}`);
    } catch (err) {
      console.error("Toggle failed:", err);
      alert("Failed to update role status");
    }

    setOpenMenuId(null); // close menu after action
  };

  if (loading) return <p className="p-4">Loading roles...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Role List</h1>
        <button
          onClick={() => navigate("/role/create")}
          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Add Role
        </button>
      </div>

      {roles.length === 0 ? (
        <p className="text-gray-500">No roles found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[600px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">S.No</th>
                  <th className="px-2 py-2 text-left">Role Name</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Created At</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roles.map((role, index) => (
                  <tr key={role._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td
                      className="px-2 py-2 text-black hover:text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleView(role._id)}
                    >
                      {role.roleName || "—"}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs font-semibold ${
                          role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {role.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2">{role.createdAt.slice(0, 10)}</td>
                    <td className="px-2 py-2 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(role._id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === role._id && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleView(role._id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FaEye /> View
                            </button>
                            <button
                              onClick={() => handleEdit(role._id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FaEdit /> Edit
                            </button>

                            {/* Toggle Status Button - Direct action */}
                            <button
                              onClick={() => handleToggleStatus(role._id, role.isActive)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              {role.isActive ? (
                                <span className="text-red-600">Deactivate</span>
                              ) : (
                                <span className="text-green-600">Activate</span>
                              )}
                            </button>

                            <button
                              onClick={() => handleDelete(role._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-2 md:hidden">
            {roles.map((role, index) => (
              <div
                key={role._id}
                className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h2
                      className="text-base font-semibold text-gray-800 hover:cursor-pointer hover:underline"
                      onClick={() => handleView(role._id)}
                    >
                      {role.roleName || "—"}
                    </h2>
                    <p className="text-xs text-gray-500">Created: {role.createdAt.slice(0, 10)}</p>
                  </div>
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs font-semibold ${
                      role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {role.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(role._id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <FaEllipsisV className="text-gray-600" />
                  </button>
                </div>

                {/* Mobile Dropdown */}
                {openMenuId === role._id && (
                  <div
                    className="absolute right-4 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleView(role._id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleEdit(role._id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>

                      {/* Toggle Status Button - Direct action */}
                      <button
                        onClick={() => handleToggleStatus(role._id, role.isActive)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        {role.isActive ? (
                          <span className="text-red-600">Deactivate</span>
                        ) : (
                          <span className="text-green-600">Activate</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(role._id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}