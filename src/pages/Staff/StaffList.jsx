// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEdit, FaTrash, FaSignInAlt, FaToggleOn, FaToggleOff, FaEllipsisV, FaSearch } from "react-icons/fa";
// import ProtectedAction from "../../components/ProtectedAction";
// import { getStaff } from "../../service/staffService";
// import toast from "react-hot-toast";
// import { useLogin } from "../../service/login";
// export default function StaffPage() {
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedSearch, setAppliedSearch] = useState("");
//   const navigate = useNavigate();
//   const { login } = useLogin();
//   useEffect(() => {
//     const loadStaff = async () => {
//       try {
//         const res = await getStaff();
//         const normalized = (res.data || []).map((staff) => ({
//           ...staff,
//           status:
//             staff.status === "true" || staff.status === true
//               ? "active"
//               : staff.status || "inactive",
//         }));
//         setStaffList(normalized);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load staff");
//         toast.error("Failed to load staff");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadStaff();
//   }, []);
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
//     navigate(`/staff/view/${id}`);
//     setOpenMenuId(null);
//   };
//   const handleEdit = (id) => {
//     navigate(`/staff/update/${id}`);
//     setOpenMenuId(null);
//   };
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this staff?")) {
//       setStaffList((prev) => prev.filter((s) => s._id !== id));
//       toast.success("Staff deleted");
//       setOpenMenuId(null);
//     }
//   };
//   const handleToggleStatus = (staff) => {
//     const newStatus = staff.status === "active" ? "inactive" : "active";
//     if (window.confirm(`Make ${staff.name} ${newStatus.toUpperCase()}?`)) {
//       setStaffList((prev) =>
//         prev.map((s) =>
//           s._id === staff._id ? { ...s, status: newStatus } : s
//         )
//       );
//       toast.success(`Staff is now ${newStatus}`);
//       setOpenMenuId(null);
//     }
//   };
//   const handleLoginAsStaff = async (staff) => {
//     if (!staff?.userName || !staff?.plainPassword) {
//       toast.error("No login credentials");
//       return;
//     }
//     if (!window.confirm(`Login as ${staff.name}?`)) return;
//     try {
//       toast.loading("Logging in...");
//       const res = await login({
//         userName: staff.userName,
//         password: staff.plainPassword,
//       });
//       toast.dismiss();
//       if (res?.token || res?.success) {
//         toast.success(`Logged in as ${staff.name}`);
//         navigate("/");
//       } else {
//         toast.error(res?.message || "Login failed");
//       }
//     } catch (err) {
//       toast.dismiss();
//       toast.error("Login failed");
//     }
//     setOpenMenuId(null);
//   };
//   const handleSearch = () => {
//     setAppliedSearch(searchTerm);
//   };
//   const displayedStaff = staffList.filter((staff) =>
//     staff.name.toLowerCase().includes(appliedSearch.toLowerCase())
//   );
//   if (loading) return <p className="p-4">Loading Staff...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <h1 className="text-lg font-medium">Staff List</h1>
//           <div className="ml-4 flex items-center">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name"
//               className="px-2 py-1 border border-gray-300 rounded text-sm"
//             />
//             <button
//               onClick={handleSearch}
//               className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//         <ProtectedAction module="staff" action="create">
//           <button
//             onClick={() => navigate("/staff/create")}
//             className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
//           >
//             Add Staff
//           </button>
//         </ProtectedAction>
//       </div>
//       {displayedStaff.length === 0 ? (
//         <p className="text-gray-500">No Staff Found.</p>
//       ) : (
//         <div className="hidden md:block overflow-x-auto">
//           <table className="min-w-[900px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-[2px] py-[2px] text-left">S.No</th>
//                 <th className="px-[2px] py-[2px] text-left">Name</th>
//                 <th className="px-[2px] py-[2px] text-left">Phone No</th>
//                 <th className="px-[2px] py-[2px] text-left">Email</th>
//                 <th className="px-[2px] py-[2px] text-left">Role</th>
//                 <th className="px-[2px] py-[2px] text-left">Status</th>
//                 <th className="px-[2px] py-[2px] text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {displayedStaff.map((staff, index) => (
//                 <tr key={staff._id} className="hover:bg-gray-50">
//                   <td className="px-[2px] py-[2px]">{index + 1}</td>
//                   <td
//                     className="px-[2px] py-[2px] text-black hover:text-blue-600 hover:underline cursor-pointer"
//                     onClick={() => handleView(staff._id)}
//                   >
//                     {staff.name}
//                   </td>
//                   <td className="px-[2px] py-[2px]">{staff.phoneNo}</td>
//                   <td className="px-[2px] py-[2px]">{staff.email || "—"}</td>
//                   <td className="px-[2px] py-[2px]">{staff.role?.roleName || "—"}</td>
//                   <td className="px-[2px] py-[2px]">
//                     <span
//                       className={`px-2 py-0.5 rounded text-xs ${
//                         staff.status === "active"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {staff.status}
//                     </span>
//                   </td>
//                   {/* 3-Dot Menu */}
//                   <td className="px-[2px] py-[2px] text-center relative">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleMenu(staff._id);
//                       }}
//                       className="p-1 hover:bg-gray-200 rounded"
//                     >
//                       <FaEllipsisV className="text-gray-600" />
//                     </button>
//                     {/* Dropdown Menu */}
//                     {openMenuId === staff._id && (
//                       <div
//                         className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="py-1">
//                           <button
//                             onClick={() => handleView(staff._id)}
//                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                           >
//                             <FaEye /> View
//                           </button>
// {/*
//                           <ProtectedAction module="staff" action="update">
//                             <button
//                               onClick={() => handleEdit(staff._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                             >
//                               <FaEdit /> Edit
//                             </button>
//                           </ProtectedAction> */}
                      
//                             <button
//                               onClick={() => handleEdit(staff._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                             >
//                               <FaEdit /> Edit
//                             </button>
               
//                           <button
//                             onClick={() => handleToggleStatus(staff)}
//                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                           >
//                             {staff.status === "active" ? (
//                               <>
//                                 <FaToggleOn className="text-green-600" /> Deactivate
//                               </>
//                             ) : (
//                               <>
//                                 <FaToggleOff className="text-red-600" /> Activate
//                               </>
//                             )}
//                           </button>
//                           <button
//                             onClick={() => handleLoginAsStaff(staff)}
//                             className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
//                           >
//                             <FaSignInAlt /> Login as Staff
//                           </button>
//                           <ProtectedAction module="staff" action="delete">
//                             <button
//                               onClick={() => handleDelete(staff._id)}
//                               className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                             >
//                               <FaTrash /> Delete
//                             </button>
//                           </ProtectedAction>
//                         </div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaSignInAlt, FaToggleOn, FaToggleOff, FaEllipsisV, FaSearch } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getStaff } from "../../service/staffService";
import toast from "react-hot-toast";
import { useLogin } from "../../service/login";
import * as XLSX from 'xlsx'; 

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]); // ← Full list (all staff)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const navigate = useNavigate();
  const { login } = useLogin();

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await getStaff();
        const normalized = (res.data || []).map((staff) => ({
          ...staff,
          status:
            staff.status === "true" || staff.status === true
              ? "active"
              : staff.status || "inactive",
        }));
        setStaffList(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load staff");
        toast.error("Failed to load staff");
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

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
    navigate(`/staff/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/staff/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaffList((prev) => prev.filter((s) => s._id !== id));
      toast.success("Staff deleted");
      setOpenMenuId(null);
    }
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    if (window.confirm(`Make ${staff.name} ${newStatus.toUpperCase()}?`)) {
      setStaffList((prev) =>
        prev.map((s) =>
          s._id === staff._id ? { ...s, status: newStatus } : s
        )
      );
      toast.success(`Staff is now ${newStatus}`);
      setOpenMenuId(null);
    }
  };

  const handleLoginAsStaff = async (staff) => {
    if (!staff?.userName || !staff?.plainPassword) {
      toast.error("No login credentials");
      return;
    }
    if (!window.confirm(`Login as ${staff.name}?`)) return;
    try {
      toast.loading("Logging in...");
      const res = await login({
        userName: staff.userName,
        password: staff.plainPassword,
      });
      toast.dismiss();
      if (res?.token || res?.success) {
        toast.success(`Logged in as ${staff.name}`);
        navigate("/");
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Login failed");
    }
    setOpenMenuId(null);
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  // ← Export ALL staff (not filtered)
  const exportToExcel = () => {
    if (staffList.length === 0) {
      toast.error("No staff data to export");
      return;
    }

    const exportData = staffList.map((staff, index) => ({
      "S.No": index + 1,
      Name: staff.name,
      "Phone No": staff.phoneNo,
      Email: staff.email || "—",
      Role: staff.role?.roleName || "—",
      Status: staff.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff List");

    XLSX.writeFile(workbook, "all_staff_list.xlsx");
    toast.success("All staff exported successfully!");
  };

  // Filtered list for display only
  const displayedStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  if (loading) return <p className="p-4">Loading Staff...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">Staff List</h1>
          <div className="ml-4 flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-2"
          >
            Download as Excel
          </button>
          <ProtectedAction module="staff" action="Create">
            <button
              onClick={() => navigate("/staff/create")}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add Staff
            </button>
          </ProtectedAction>
        </div>
      </div>

      {displayedStaff.length === 0 ? (
        <p className="text-gray-500">No Staff Found.</p>
      ) : (
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[900px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-[2px] py-[2px] text-left">S.No</th>
                <th className="px-[2px] py-[2px] text-left">Name</th>
                <th className="px-[2px] py-[2px] text-left">Phone No</th>
                <th className="px-[2px] py-[2px] text-left">Email</th>
                <th className="px-[2px] py-[2px] text-left">Role</th>
                <th className="px-[2px] py-[2px] text-left">Status</th>
                <th className="px-[2px] py-[2px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedStaff.map((staff, index) => (
                <tr key={staff._id} className="hover:bg-gray-50">
                  <td className="px-[2px] py-[2px]">{index + 1}</td>
                  <td
                    className="px-[2px] py-[2px] text-black hover:text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleView(staff._id)}
                  >
                    {staff.name}
                  </td>
                  <td className="px-[2px] py-[2px]">{staff.phoneNo}</td>
                  <td className="px-[2px] py-[2px]">{staff.email || "—"}</td>
                  <td className="px-[2px] py-[2px]">{staff.role?.roleName || "—"}</td>
                  <td className="px-[2px] py-[2px]">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        staff.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-[2px] py-[2px] text-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(staff._id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <FaEllipsisV className="text-gray-600" />
                    </button>
                    {openMenuId === staff._id && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleView(staff._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <FaEye /> View
                          </button>
                          <button
                            onClick={() => handleEdit(staff._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(staff)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            {staff.status === "active" ? (
                              <>
                                <FaToggleOn className="text-green-600" /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaToggleOff className="text-red-600" /> Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleLoginAsStaff(staff)}
                            className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <FaSignInAlt /> Login as Staff
                          </button>
                          <ProtectedAction module="staff" action="Delete">
                            <button
                              onClick={() => handleDelete(staff._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <FaTrash /> Delete
                            </button>
                          </ProtectedAction>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}