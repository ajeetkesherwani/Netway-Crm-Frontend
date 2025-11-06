// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import { getAllRoleList } from "../../service/rolePermission"; 

// export default function RoleList() {
//   const [roles, setRoles] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

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

//   // Close dropdown when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handlers
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
//       // TODO: Call delete API
//       setRoles(roles.filter((r) => r._id !== id));
//       setOpenMenuId(null);
//     }
//   };
//   if (loading) return <p className="p-4">Loading roles...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">Role List</h1>
//         <button
//           onClick={() => navigate("/role/create")}
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Add Role
//         </button>
//       </div>
//       {roles.length === 0 ? (
//         <p className="text-gray-500">No roles found.</p>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">S.No</th>
//                   <th className="px-4 py-2 text-left">Role Name</th>
//                   <th className="px-4 py-2 text-left">Active</th>
//                   <th className="px-4 py-2 text-left">Created At</th>
//                   <th className="px-4 py-2 text-left">Updated At</th>
//                   <th className="px-4 py-2 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {roles.map((role, index) => (
//                   <tr key={role._id} className="hover:bg-gray-50 relative">
//                     <td className="px-4 py-2">{index + 1}</td>
//                     <td className="px-4 py-2">{role.roleName}</td>
//                     <td className="px-4 py-2">{role.isActive ? "Yes" : "No"}</td>
//                     <td className="px-4 py-2">{new Date(role.createdAt).toLocaleString()}</td>
//                     <td className="px-4 py-2">{new Date(role.updatedAt).toLocaleString()}</td>
//                     <td className="px-4 py-2 text-right relative">
//                       <button
//                         onClick={() =>
//                           setOpenMenuId(
//                             openMenuId === role._id ? null : role._id
//                           )
//                         }
//                         className="p-2 rounded hover:bg-gray-200"
//                       >
//                         <FaEllipsisV />
//                       </button>

//                       {openMenuId === role._id && (
//                         <div
//                           ref={menuRef}
//                           className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
//                         >
//                           <button
//                             onClick={() => handleView(role._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
//                           >
//                             <FaEye className="mr-2" /> View
//                           </button>
//                           <button
//                             onClick={() => handleEdit(role._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
//                           >
//                             <FaEdit className="mr-2" /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(role._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <FaTrash className="mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="space-y-4 md:hidden">
//             {roles.map((role, index) => (
//               <div
//                 key={role._id}
//                 className="p-4 border rounded-lg shadow-sm bg-white"
//               >
//                 <p className="text-sm text-gray-500">#{index + 1}</p>
//                 <h2 className="text-lg font-medium">
//                   {role.roleName}
//                 </h2>
//                 <p className="text-sm">Active: {role.isActive ? "Yes" : "No"}</p>
//                 <p className="text-sm">Created: {new Date(role.createdAt).toLocaleString()}</p>
//                 <p className="text-sm">Updated: {new Date(role.updatedAt).toLocaleString()}</p>

//                 <div className="flex justify-end space-x-3 mt-3">
//                   <button
//                     onClick={() => handleView(role._id)}
//                     className="text-blue-600 flex items-center text-sm"
//                   >
//                     <FaEye className="mr-1" /> View
//                   </button>
//                   <button
//                     onClick={() => handleEdit(role._id)}
//                     className="text-green-600 flex items-center text-sm"
//                   >
//                     <FaEdit className="mr-1" /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(role._id)}
//                     className="text-red-600 flex items-center text-sm"
//                   >
//                     <FaTrash className="mr-1" /> Delete
//                   </button>
//                 </div>
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
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { deleteRoleById, getAllRoleList } from "../../service/rolePermission";
import ProtectedAction from "../../components/ProtectedAction";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const handleView = (id) => {
    navigate(`/role/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/role/update/${id}`);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRoleById(id)
        setRoles(roles.filter((r) => r._id !== id));
      } catch (err) {
        console.error("This is the error",err)
      }
    }
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
                  <th className="px-2 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roles.map((role, index) => (
                  <tr key={role._id} className="hover:bg-gray-50 relative">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2 hover:cursor-pointer hover:underline" onClick={() => handleView(role._id)}>
                      {role.roleName || "—"}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs font-semibold ${role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                      >
                        {role.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2">{role.createdAt.slice(0, 10)}</td>
                    <td className="px-2 py-2 text-right relative">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(role._id)}
                          className="text-gray-600 hover:text-blue-600"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(role._id)}
                          className="text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(role._id)}
                          className="text-red-600 hover:text-red-700"
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
          {/* Mobile Card */}
          <div className="space-y-2 md:hidden">
            {roles.map((role, index) => (
              <div key={role._id} className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-base font-semibold text-gray-800 hover:cursor-pointer hover:underline" onClick={() => handleView(role._id)}>
                    {role.roleName || "—"}
                  </h2>
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs font-semibold ${role.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {role.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Created: {role.createdAt.slice(0, 10)}</p>
                <div className="flex justify-end space-x-2 mt-1">
                   <ProtectedAction module="rolepermission" action="create">
                  <button onClick={() => handleView(role._id)} className="text-gray-600 hover:text-blue-600">
                    <FaEye />
                  </button>
                  </ProtectedAction>
                  <button onClick={() => handleEdit(role._id)} className="text-gray-600 hover:text-green-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(role._id)} className="text-red-600 hover:text-red-700">
                    <FaTrash />
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