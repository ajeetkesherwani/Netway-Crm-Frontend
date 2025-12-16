// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { updateStaff } from "../../service/staffService";
// import { getAllRolesList } from "../../service/ticket";
// import { getAllZoneList } from "../../service/staffService";
// import { getStaffDetails } from "../../service/staffService";

// export default function StaffCreate() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [roles, setRoles] = useState([]);
//     const [zoneList, setZoneList] = useState([]);
//     const initialFormData = {
//         name: "",
//         email: "",
//         phoneNo: "",
//         password: "",
//         address: "",
//         bio: "",
//         role: "",
//         logId: "",
//         staffName: "",
//         salary: "",
//         comment: "",
//         area: "",
//         staffIp: "",
//         status: "true",
//         resetOtpExpires: "",
//     };
//     const [formData, setFormData] = useState(initialFormData);

//     useEffect(() => {
//         const fetchAll = async () => {
//             try {
//                 const [rolesData, zoneData, staffData] =
//                     await Promise.allSettled([
//                         getAllRolesList(),
//                         getAllZoneList(),
//                         getStaffDetails(id)
//                     ]);

//                 console.log("rolesData", rolesData);
//                 console.log("zoneData", zoneData);
//                 console.log("staffData", staffData);
//                 if (rolesData.status === "fulfilled" && rolesData.value?.status)
//                     setRoles(rolesData.value.data);
//                 if (zoneData.status === "fulfilled" && zoneData.value?.status)
//                     setZoneList(zoneData.value.data);
//                 if (staffData.status === "fulfilled" && staffData.value?.status)
//                     setFormData({
//                         name: staffData.value.data.name ?? "",
//                         email: staffData.value.data.email ?? "",
//                         phoneNo: staffData.value.data.phoneNo ?? "",
//                         password: "",
//                         address: staffData.value.data.address ?? "",
//                         bio: staffData.value.data.bio ?? "",
//                         role: staffData.value.data.role ?? "",
//                         logId: staffData.value.data.logId ?? "",
//                         staffName: staffData.value.data.staffName ?? "",
//                         salary: staffData.value.data.salary ?? "",
//                         comment: staffData.value.data.comment ?? "",
//                         area: staffData.value.data.area?._id ?? staffData.value.data.area ?? "",
//                         staffIp: staffData.value.data.staffIp ?? "",
//                         status: staffData.value.data.status ?? "true",
//                         resetOtpExpires: staffData.value.data.resetOtpExpires ?? "",
//                     });
//                 setLoading(false);
//             } catch (err) {
//                 console.error("fetch error", err);
//             }
//         };
//         fetchAll();
//     }, []);

//     // Handle form input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     console.log("formData", formData);
//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Validate phoneNo format
//         const phoneRegex = /^[0-9]{10}$/;
//         if (!phoneRegex.test(formData.phoneNo)) {
//             toast.error("Phone number must be 10 digits ❌");
//             setLoading(false);
//             return;
//         }

//         // Construct payload
//         const payload = {
//             ...formData,
//             // Only include resetOtpExpires if provided
//             ...(formData.resetOtpExpires && {
//                 resetOtpExpires: new Date(formData.resetOtpExpires).toISOString(),
//             }),
//         };
//         try {
//             await updateStaff(id, payload);
//             toast.success("Staff updated successfully ✅");
//             navigate("/staff/list");
//         } catch (err) {
//             console.error("Create Staff Error:", err);
//             toast.error(err.message || "Failed to create staff ❌");
//         } finally {
//             setLoading(false);
//         }
//     };
//     console.log("roles", roles);

//     // Handle form clear
//     const handleClear = () => {
//         setFormData(initialFormData);
//         // Reset role to "Staff" if available
//         const staffRole = roles.find((role) => role.roleName === "Staff");
//         if (staffRole) {
//             setFormData((prev) => ({ ...prev, role: staffRole._id }));
//         }
//     };
//     console.log("formData.role", formData.role);

//     return (
//         <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//             <h2 className="text-2xl font-bold mb-6">Update Staff</h2>
//             <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-4"
//             >
//                 {/* Name */}
//                 <div>
//                     <label className="block font-medium">Name *</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     />
//                 </div>

//                 {/* Email */}
//                 <div>
//                     <label className="block font-medium">Email *</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     />
//                 </div>

//                 {/* Phone Number */}
//                 <div>
//                     <label className="block font-medium">Phone Number *</label>
//                     <input
//                         type="tel"
//                         name="phoneNo"
//                         value={formData.phoneNo}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                         placeholder="10-digit number"
//                         maxLength={10} // max 10 digits
//                         pattern="\d{10}" // exactly 10 digits only
//                         title="Phone number must be 10 digits"
//                     />
//                 </div>

//                 {/* Password */}
//                 <div>
//                     <label className="block font-medium">Password *</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                     />
//                 </div>

//                 {/* Staff Name */}
//                 {/* <div>
//                     <label className="block font-medium">Staff Name *</label>
//                     <input
//                         type="text"
//                         name="staffName"
//                         value={formData.staffName}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     />
//                 </div> */}

//                 {/* Log ID */}
//                 <div>
//                     <label className="block font-medium">User ID *</label>
//                     <input
//                         type="text"
//                         name="logId"
//                         value={formData.logId}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     />
//                 </div>
//                 {/* Role */}
//                 {/* <div>
//           <label className="block font-medium">Role *</label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full rounded"
//           >
//             <option value="">Select Role</option>
//             <option key={roles._id} value={roles._id}>
//               {roles.roleName}
//             </option>
//           </select>
//         </div> */}

//                 <div>
//                     <label className="block font-medium">Role *</label>
//                     {/* <select
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     >
//                         <option value="" disabled selected>
//                             Select Role
//                         </option>
//                         {roles.map((role) => (
//                             <option key={role._id} value={role._id} selected={role._id == formData.role ? "selected" : ""}>
//                                 {role.roleName}
//                             </option>
//                         ))}
//                     </select> */}

//                     <select
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     >
//                         <option value="" disabled>
//                             Select Role
//                         </option>

//                         {roles.map((role) => (
//                             <option key={role._id} value={role._id} selected={role._id === formData.role}>
//                                 {role.roleName}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Status */}
//                 <div>
//                     <label className="block font-medium">Status</label>
//                     <select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                     >
//                         <option value="true">Active</option>
//                         <option value="false">Inactive</option>
//                     </select>
//                 </div>

//                 {/* Address */}
//                 {/* <div>
//                     <label className="block font-medium">Address</label>
//                     <input
//                         type="text"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                     />
//                 </div> */}

//                 {/* Area */}
//                 {/* <div>
//                     <label className="block font-medium">Area</label>
//                 <select
//                         name="area"
//                         value={formData.area}
//                         onChange={handleChange}
//                         required
//                         className="border p-2 w-full rounded"
//                     >
//                         <option value="" disabled selected>
//                             Select Area
//                         </option>
//                         {zoneList.map((zone) => (
//                             <option key={zone._id} value={zone._id}>
//                                 {zone.zoneName}
//                             </option>
//                         ))}
//                     </select>
//                 </div> */}

//                 {/* Salary */}
//                 <div>
//                     <label className="block font-medium">Salary</label>
//                     <input
//                         type="number"
//                         name="salary"
//                         value={formData.salary}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                         min="0"
//                     />
//                 </div>

//                 {/* Staff IP */}
//                 {/* <div>
//                     <label className="block font-medium">Staff IP</label>
//                     <input
//                         type="text"
//                         name="staffIp"
//                         value={formData.staffIp}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                         placeholder="e.g., 192.168.1.1"
//                     />
//                 </div> */}

//                 {/* Reset OTP Expires */}
//                 {/* <div>
//                     <label className="block font-medium">Reset OTP Expires</label>
//                     <input
//                         type="datetime-local"
//                         name="resetOtpExpires"
//                         value={formData.resetOtpExpires}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded"
//                     />
//                 </div> */}

//                 {/* Bio */}
//                 {/* <div className="col-span-2">
//                     <label className="block font-medium">Bio</label>
//                     <textarea
//                         name="bio"
//                         value={formData.bio}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded h-24"
//                     />
//                 </div> */}

//                 {/* Comment */}
//                 <div className="col-span-2">
//                     <label className="block font-medium">Comment</label>
//                     <textarea
//                         name="comment"
//                         value={formData.comment}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded h-24"
//                     />
//                 </div>

//                 {/* Buttons */}
//                 <div className="col-span-2 flex justify-end gap-3 mt-4">
//                     <button
//                         type="button"
//                         onClick={() => navigate("/staff/list")}
//                         className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//                     >
//                         Back
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                     >
//                         {loading ? "Saving..." : "Submit"}
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleClear}
//                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
//                     >
//                         Clear
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { updateStaff } from "../../service/staffService";
// import { getAllRolesList } from "../../service/ticket";
// import { getAllZoneList } from "../../service/staffService";
// import { getStaffDetails } from "../../service/staffService";

// const ActivityLogs = () => {
//   // Static data for activity logs
//   const logs = [
//     {
//       date: "13-09-2025 11:52:14 am",
//       description: "Logout IP: 104.23.216.176",
//       addedBy: "Admin",
//     },
//     {
//       date: "13-09-2025 11:17 am",
//       description: "User: SRISAIPLAST Package Updated successfully ClientId:SRISAIPLAST, Package: ,Amount: , Start Date: 2024-12-12 , End Date: 2025-09-08 IP: 104.23.216.177",
//       addedBy: "System",
//     },
//     {
//       date: "09-07-2025 03:46:49 pm",
//       description: "Logout IP: 172.69.94.186",
//       addedBy: "Admin",
//     },
//     {
//       date: "05-06-2025 09:15:22 am",
//       description: "Staff details edited: Name changed to John Doe",
//       addedBy: "Manager",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium">Date</th>
//               <th className="px-4 py-2 text-left font-medium">Description</th>
//               <th className="px-4 py-2 text-left font-medium">Added By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {logs.map((log, index) => (
//               <tr key={index} className="border-t">
//                 <td className="px-4 py-2">{log.date}</td>
//                 <td className="px-4 py-2">{log.description}</td>
//                 <td className="px-4 py-2">{log.addedBy}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   updateStaff,
//   getAllZoneList,
//   getStaffDetails,
//   getActivityLogs, // ← new import
// } from "../../service/staffService";
// import { getAllRolesList } from "../../service/ticket";

// export default function StaffUpdate() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [logsLoading, setLogsLoading] = useState(true);
//   const [logs, setLogs] = useState([]);

//   const [roles, setRoles] = useState([]);
//   const [zoneList, setZoneList] = useState([]);

//   const initialFormData = {
//     name: "",
//     email: "",
//     phoneNo: "",
//     password: "",
//     address: "",
//     bio: "",
//     role: "",
//     logId: "",
//     staffName: "",
//     salary: "",
//     comment: "",
//     area: "",
//     staffIp: "",
//     status: "true",
//     resetOtpExpires: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [activeTab, setActiveTab] = useState("edit");

//   // Fetch staff details, roles, zones
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [rolesData, zoneData, staffData] = await Promise.allSettled([
//           getAllRolesList(),
//           getAllZoneList(),
//           getStaffDetails(id),
//         ]);

//         if (rolesData.status === "fulfilled" && rolesData.value?.status)
//           setRoles(rolesData.value.data || []);

//         if (zoneData.status === "fulfilled" && zoneData.value?.status)
//           setZoneList(zoneData.value.data || []);

//         if (staffData.status === "fulfilled" && staffData.value?.status) {
//           const staff = staffData.value.data;
//           setFormData({
//             name: staff.name ?? "",
//             email: staff.email ?? "",
//             phoneNo: staff.phoneNo ?? "",
//             password: "",
//             address: staff.address ?? "",
//             bio: staff.bio ?? "",
//             role: staff.role ?? "",
//             logId: staff.logId ?? "",
//             staffName: staff.staffName ?? "",
//             salary: staff.salary ?? "",
//             comment: staff.comment ?? "",
//             area: staff.area?._id ?? staff.area ?? "",
//             staffIp: staff.staffIp ?? "",
//             status: staff.status ?? "true",
//             resetOtpExpires: staff.resetOtpExpires ?? "",
//           });
//         }
//       } catch (err) {
//         toast.error("Failed to load staff data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchAll();
//   }, [id]);

//   // Fetch Activity Logs for this Staff
//   // Fetch Activity Logs for this Staff
// useEffect(() => {
//   const fetchLogs = async () => {
//     if (!id) return;
//     setLogsLoading(true);
//     try {
//       const res = await getActivityLogs("Staff", id);   // ← add "Staff" here
//       if (res.status && res.data?.data?.length > 0) {
//         setLogs(res.data.data);
//       } else {
//         setLogs([]);
//       }
//     } catch (err) {
//       console.error("Failed to load logs:", err);
//       setLogs([]);
//       // toast.error("Could not load activity logs");
//     } finally {
//       setLogsLoading(false);
//     }
//   };

//   if (activeTab === "logs") {
//     fetchLogs();
//   }
// }, [id, activeTab]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const phoneRegex = /^[0-9]{10}$/;
//     if (formData.phoneNo && !phoneRegex.test(formData.phoneNo)) {
//       toast.error("Phone number must be exactly 10 digits");
//       setSaving(false);
//       return;
//     }

//     const payload = {
//       ...formData,
//       ...(formData.resetOtpExpires && {
//         resetOtpExpires: new Date(formData.resetOtpExpires).toISOString(),
//       }),
//     };

//     try {
//       await updateStaff(id, payload);
//       toast.success("Staff updated successfully!");
//       navigate("/staff/list");
//     } catch (err) {
//       toast.error(err.message || "Failed to update staff");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleClear = () => {
//     if (window.confirm("Clear all fields?")) {
//       setFormData(initialFormData);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   // Extract name from populated createdById
//   const getCreatedByName = (log) => {
//     if (!log.createdById) return "Deleted User";

//     switch (log.createdByRole) {
//       case "Staff":
//         return log.createdById.staffName || "Unknown Staff";
//       case "Admin":
//         return log.createdById.adminName || "Unknown Admin";
//       case "Reseller":
//         return log.createdById.resellerName || "Unknown Reseller";
//       case "Lco":
//         return log.createdById.lcoName || "Unknown LCO";
//       case "User":
//         return log.createdById.userName || "Unknown User";
//       default:
//         return "System";
//     }
//   };

//   if (loading) {
//     return <div className="p-10 text-center text-xl">Loading staff details...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8">
//       {/* Tabs */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="flex border-b">
//           <button
//             onClick={() => setActiveTab("edit")}
//             className={`px-6 py-3 font-medium rounded-t-lg transition ${
//               activeTab === "edit"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             Edit Staff
//           </button>
//           <button
//             onClick={() => setActiveTab("logs")}
//             className={`px-6 py-3 font-medium rounded-t-lg transition ${
//               activeTab === "logs"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             Activity Logs
//           </button>
//         </div>

//         <div className="p-6">
//           {activeTab === "edit" ? (
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Your existing form fields */}
//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Email *</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="phoneNo"
//                   value={formData.phoneNo}
//                   onChange={handleChange}
//                   required
//                   maxLength={10}
//                   pattern="\d{10}"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">User ID *</label>
//                 <input
//                   type="text"
//                   name="logId"
//                   value={formData.logId}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Role *</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="" disabled>Select Role</option>
//                   {roles.map((role) => (
//                     <option key={role._id} value={role._id}>
//                       {role.roleName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Salary</label>
//                 <input
//                   type="number"
//                   name="salary"
//                   value={formData.salary}
//                   onChange={handleChange}
//                   min="0"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block font-medium text-gray-700 mb-1">Comment</label>
//                 <textarea
//                   name="comment"
//                   value={formData.comment}
//                   onChange={handleChange}
//                   rows="4"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="md:col-span-2 flex justify-end gap-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/staff/list")}
//                   className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                 >
//                   Clear Form
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70"
//                 >
//                   {saving ? "Saving..." : "Update Staff"}
//                 </button>
//               </div>
//             </form>
//           ) : (
//             // Activity Logs Tab
//             <div>
//               <h3 className="text-2xl font-bold mb-6 text-gray-800">Activity Logs</h3>

//               {logsLoading ? (
//                 <div className="text-center py-10 text-gray-500">Loading logs...</div>
//               ) : logs.length === 0 ? (
//                 <div className="text-center py-10 text-gray-600 text-lg">
//                   No activity logs found for this staff member.
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
//                         <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Description</th>
//                         <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Added By</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {logs.map((log, index) => (
//                         <tr key={log._id || index} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 text-sm text-gray-800">
//                             {formatDate(log.createdAt)}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
//                             <strong>{log.action}</strong><br></br>
//                             {log.description || "-"}
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-gray-600">
//                             {getCreatedByName(log)} 
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateStaff,
  getAllZoneList,
  getStaffDetails,
  getActivityLogs,
} from "../../service/staffService";
import { getAllRolesList } from "../../service/ticket";

export default function StaffUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const [roles, setRoles] = useState([]);
  const [zoneList, setZoneList] = useState([]);

  const initialFormData = {
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    address: "",
    bio: "",
    role: "",
    logId: "",
    staffName: "",
    salary: "",
    comment: "",
    area: "",
    staffIp: "",
    status: "true",
    resetOtpExpires: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("edit");

  // Fetch staff details, roles, zones
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rolesData, zoneData, staffData] = await Promise.allSettled([
          getAllRolesList(),
          getAllZoneList(),
          getStaffDetails(id),
        ]);

        if (rolesData.status === "fulfilled" && rolesData.value?.status)
          setRoles(rolesData.value.data || []);

        if (zoneData.status === "fulfilled" && zoneData.value?.status)
          setZoneList(zoneData.value.data || []);

        if (staffData.status === "fulfilled" && staffData.value?.status) {
          const staff = staffData.value.data;
          setFormData({
            name: staff.name ?? "",
            email: staff.email ?? "",
            phoneNo: staff.phoneNo ?? "",
            password: "",
            address: staff.address ?? "",
            bio: staff.bio ?? "",
            role: staff.role ?? "",
            logId: staff.logId ?? "",
            staffName: staff.staffName ?? "",
            salary: staff.salary ?? "",
            comment: staff.comment ?? "",
            area: staff.area?._id ?? staff.area ?? "",
            staffIp: staff.staffIp ?? "",
            status: staff.status ?? "true",
            resetOtpExpires: staff.resetOtpExpires ?? "",
          });
        }
      } catch (err) {
        toast.error("Failed to load staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

  // Fetch Activity Logs
  useEffect(() => {
    const fetchLogs = async () => {
      if (!id) return;
      setLogsLoading(true);
      try {
        const res = await getActivityLogs("Staff", id);
        if (res.status && res.data?.data?.length > 0) {
          setLogs(res.data.data);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
        setLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };

    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [id, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phoneNo && !phoneRegex.test(formData.phoneNo)) {
      toast.error("Phone number must be exactly 10 digits");
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      ...(formData.resetOtpExpires && {
        resetOtpExpires: new Date(formData.resetOtpExpires).toISOString(),
      }),
    };

    try {
      await updateStaff(id, payload);
      toast.success("Staff updated successfully!");
      navigate("/staff/list");
    } catch (err) {
      toast.error(err.message || "Failed to update staff");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all fields?")) {
      setFormData(initialFormData);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Extract name from populated createdById
  const getCreatedByName = (log) => {
    if (!log.createdById) return "Deleted User";

    switch (log.createdByRole) {
      case "Staff":
        return log.createdById.staffName || "Unknown Staff";
      case "Admin":
        return log.createdById.adminName || "Unknown Admin";
      case "Reseller":
        return log.createdById.resellerName || "Unknown Reseller";
      case "Lco":
        return log.createdById.lcoName || "Unknown LCO";
      case "User":
        return log.createdById.userName || "Unknown User";
      default:
        return "System";
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading staff details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Tabs */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-8 py-4 font-semibold text-sm transition-all ${
              activeTab === "edit"
                ? "bg-blue-600 text-white shadow-inner"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Edit Staff
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-8 py-4 font-semibold text-sm transition-all ${
              activeTab === "logs"
                ? "bg-blue-600 text-white shadow-inner"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Activity Logs
          </button>
        </div>

        <div className="p-8">
          {activeTab === "edit" ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All your existing form fields - unchanged */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="\d{10}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">User ID *</label>
                <input
                  type="text"
                  name="logId"
                  value={formData.logId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/staff/list")}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 transition"
                >
                  {saving ? "Saving..." : "Update Staff"}
                </button>
              </div>
            </form>
          ) : (
            /* ==================== PROFESSIONAL ACTIVITY LOGS SECTION ==================== */
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">Activity Logs</h3>

              {logsLoading ? (
                <div className="text-center py-16 text-gray-500 text-lg">Loading activity logs...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 text-lg">
                  No activity logs found for this staff member.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                          Activity Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Added By
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log, index) => (
                        <tr
                          key={log._id || index}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <td className="px-6 py-5 text-sm text-gray-700 font-medium whitespace-nowrap border-r border-gray-200">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-6 py-5 text-sm border-r border-gray-200">
                            <div className="font-semibold text-gray-900">
                              {log.action || "Unknown Action"}
                            </div>
                            {log.description && (
                              <div className="mt-2 text-gray-600 text-xs leading-relaxed max-w-2xl">
                                {log.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5 text-sm">
                            <div className="font-semibold text-blue-700">
                              {getCreatedByName(log)}
                            </div>
                            {/* <div className="text-xs text-gray-500 mt-1">
                              ({log.createdByRole || "System"})
                            </div> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}