// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getRoleDetails } from "../../service/rolePermission";

// export default function ViewRoleDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const res = await getRoleDetails(id);
//         setRole(res.data || res);
//       } catch (err) {
//         console.error("Error fetching role:", err);
//         setError("Failed to load role details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRole();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading role details...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   if (!role) return <p className="p-4">Role not found.</p>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">Role Details</h2>
//         <button
//           onClick={() => navigate("/role/list")}
//           className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//         >
//           Back
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Role Name</label>
//           <p className="border p-2 rounded bg-gray-100">{role.roleName}</p>
//         </div>
//         <div>
//           <label className="block font-medium">Active</label>
//           <p className="border p-2 rounded bg-gray-100">{role.isActive ? "Yes" : "No"}</p>
//         </div>
//         <div>
//           <label className="block font-medium">Created At</label>
//           <p className="border p-2 rounded bg-gray-100">{new Date(role.createdAt).toLocaleString()}</p>
//         </div>
//         <div>
//           <label className="block font-medium">Updated At</label>
//           <p className="border p-2 rounded bg-gray-100">{new Date(role.updatedAt).toLocaleString()}</p>
//         </div>
//       </div>

//       <h3 className="text-xl font-semibold mt-6 mb-2">Permissions</h3>
//       {Object.keys(role.permissions).length === 0 ? (
//         <p className="text-gray-500">No permissions defined.</p>
//       ) : (
//         <div className="space-y-4">
//           {Object.entries(role.permissions).map(([category, perms]) => (
//             <div key={category} className="border p-4 rounded">
//               <h4 className="font-medium mb-2">{category}</h4>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                 {Object.entries(perms).map(([permName, allowed]) => (
//                   <div key={permName} className="flex items-center gap-2">
//                     <input type="checkbox" checked={allowed} disabled />
//                     <span>{permName}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoleDetails } from "../../service/rolePermission";
import { IoMdArrowBack } from "react-icons/io";

export default function ViewRoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getRoleDetails(id);
        setRole(res.data || res);
      } catch (err) {
        console.error("Error fetching role:", err);
        setError("Failed to load role details");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!role) return <p className="p-4 text-gray-500">No data available</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Role Details</h1>
      <button
        onClick={() => navigate("/role/list")}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center mb-4"
      >
        <IoMdArrowBack /> Back
      </button>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">General Info</h2>
          <p><strong>Role Name:</strong> {role.roleName}</p>
          <p><strong>Status:</strong> {role.isActive ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(role.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(role.updatedAt).toLocaleString()}</p>
        </div>
          <h2 className="text-lg font-medium mb-2">Permissions</h2>
        <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3">
          {Object.keys(role.permissions).length === 0 ? (
            <p className="text-gray-500">No permissions defined.</p>
          ) : (
            Object.entries(role.permissions).map(([category, perms]) => (
              <div key={category} className="mb-2 ">
                <h3 className="text-md font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(perms).map(([perm, enabled]) => (
                    <li key={perm} className={enabled ? "text-green-600" : "text-red-600"}>
                      {perm}: {enabled ? "Enabled" : "Disabled"}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}