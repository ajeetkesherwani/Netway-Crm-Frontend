// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import {
// //   getTicketReplies,
// //   createTicketReply,
// //   getTicketTimeline,
// //   getTicketDetails,
// //   getStaffRoleList,
// //   assignTicketToStaff,
// //   updateTicketDetails,
// // } from "../../service/ticket";
// // import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

// // export default function TicketDetails() {
// //   const { id: ticketId } = useParams();
// //   const [activeTab, setActiveTab] = useState("reply");
// //   const [replies, setReplies] = useState([]);
// //   const [timeline, setTimeline] = useState([]);
// //   const [replyText, setReplyText] = useState("");
// //   const [selectedType, setSelectedType] = useState("Select");
// //   const [ticketDetails, setTicketDetails] = useState(null);
// //   const [staffRoles, setStaffRoles] = useState([]);
// //   const [selectedStaff, setSelectedStaff] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [editableDetails, setEditableDetails] = useState({});

// //   const replyTypes = [
// //     "Select",
// //     "Need Technician Visit",
// //     "Internet Stable",
// //     "Power Issue",
// //     "Fiber Cut",
// //   ];

// //   useEffect(() => {
// //     if (ticketId) {
// //       fetchTicketDetails();
// //       fetchReplies();
// //       fetchTimeline();
// //       fetchStaffRoles();
// //     }
// //   }, [ticketId]);

// //   // ✅ Fetch Ticket Details
// //   const fetchTicketDetails = async () => {
// //     try {
// //       const res = await getTicketDetails(ticketId);
// //       if (res?.status) {
// //         setTicketDetails(res.data);
// //         setEditableDetails(res.data);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching ticket details:", err);
// //     }
// //   };

// //   // ✅ Fetch Replies
// //   const fetchReplies = async () => {
// //     try {
// //       const res = await getTicketReplies(ticketId);
// //       if (res?.status) setReplies(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching replies:", err);
// //     }
// //   };

// //   // ✅ Fetch Timeline
// //   const fetchTimeline = async () => {
// //     try {
// //       const res = await getTicketTimeline(ticketId);
// //       if (res?.status) setTimeline(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching timeline:", err);
// //     }
// //   };

// //   // ✅ Fetch Staff Role List
// //   const fetchStaffRoles = async () => {
// //     try {
// //       const res = await getStaffRoleList();
// //       if (res?.status) setStaffRoles(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching staff roles:", err);
// //     }
// //   };

// //   // ✅ Handle Ticket Assignment
// //   const handleAssignStaff = async () => {
// //     if (!selectedStaff) {
// //       alert("Please select a staff to assign");
// //       return;
// //     }
// //     const confirmAssign = window.confirm(
// //       "Are you sure you want to assign this ticket?"
// //     );
// //     if (!confirmAssign) return;

// //     try {
// //       const res = await assignTicketToStaff({
// //         ticketId,
// //         assignToId: selectedStaff,
// //       });
// //       if (res?.status) {
// //         alert("Ticket successfully assigned!");
// //         fetchTicketDetails();
// //       } else {
// //         alert(res?.message || "Assignment failed");
// //       }
// //     } catch (err) {
// //       console.error("Error assigning ticket:", err);
// //       alert("Failed to assign ticket");
// //     }
// //   };

// //   // ✅ Handle Reply Submission
// //   const handleSubmit = async () => {
// //     if (!selectedType || selectedType === "Select") {
// //       alert("Please select a reply type");
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       const res = await createTicketReply(ticketId, {
// //         replyType: selectedType,
// //         description: replyText || selectedType,
// //       });
// //       if (res?.status) {
// //         alert("Reply submitted successfully!");
// //         setReplyText("");
// //         setSelectedType("Select");
// //         fetchReplies();
// //       }
// //     } catch (err) {
// //       console.error("Error submitting reply:", err);
// //       alert("Failed to submit reply");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Handle Edit Save
// //   const handleUpdateTicket = async () => {
// //     try {
// //       const res = await updateTicketDetails(ticketId, editableDetails);
// //       if (res?.status) {
// //         alert("Ticket updated successfully!");
// //         setEditMode(false);
// //         fetchTicketDetails();
// //       } else {
// //         alert(res?.message || "Failed to update ticket");
// //       }
// //     } catch (err) {
// //       console.error("Error updating ticket:", err);
// //     }
// //   };

// //   if (!ticketDetails)
// //     return (
// //       <div className="p-10 text-center text-gray-600">
// //         Loading ticket details...
// //       </div>
// //     );

// //   return (
// //     <div className="flex flex-col lg:flex-row bg-[#edf2f7] min-h-screen p-5 gap-5">
// //       {/* LEFT: Ticket Info */}
// //       <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md relative">
// //         {/* Edit Icon */}
// //         <div className="absolute top-3 right-3 text-gray-600 hover:text-teal-700 cursor-pointer">
// //           {editMode ? (
// //             <FaTimes onClick={() => setEditMode(false)} />
// //           ) : (
// //             <FaEdit onClick={() => setEditMode(true)} />
// //           )}
// //         </div>

// //         <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
// //           Ticket Information
// //         </div>
// //         <div className="p-3 text-sm text-gray-700 space-y-2">
// //           <p>
// //             <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
// //           </p>

// //           {/* Editable Fields */}
// //           <div className="space-y-2">
// //             <p>
// //               <strong>Category:</strong>{" "}
// //               {editMode ? (
// //                 <input
// //                   type="text"
// //                   value={editableDetails.categoryName || ""}
// //                   onChange={(e) =>
// //                     setEditableDetails({
// //                       ...editableDetails,
// //                       categoryName: e.target.value,
// //                     })
// //                   }
// //                   className="border px-2 py-1 rounded w-full text-sm"
// //                 />
// //               ) : (
// //                 ticketDetails.categoryName || "N/A"
// //               )}
// //             </p>

// //             <p>
// //               <strong>Call Source:</strong>{" "}
// //               {editMode ? (
// //                 <input
// //                   type="text"
// //                   value={editableDetails.callSource || ""}
// //                   onChange={(e) =>
// //                     setEditableDetails({
// //                       ...editableDetails,
// //                       callSource: e.target.value,
// //                     })
// //                   }
// //                   className="border px-2 py-1 rounded w-full text-sm"
// //                 />
// //               ) : (
// //                 ticketDetails.callSource
// //               )}
// //             </p>

// //             <p>
// //               <strong>Severity:</strong>{" "}
// //               {editMode ? (
// //                 <select
// //                   value={editableDetails.severity || ""}
// //                   onChange={(e) =>
// //                     setEditableDetails({
// //                       ...editableDetails,
// //                       severity: e.target.value,
// //                     })
// //                   }
// //                   className="border rounded w-full py-1 px-2 text-sm"
// //                 >
// //                   <option value="Low">Low</option>
// //                   <option value="Medium">Medium</option>
// //                   <option value="High">High</option>
// //                 </select>
// //               ) : (
// //                 ticketDetails.severity
// //               )}
// //             </p>
// //           </div>

// //           <p>
// //             <strong>Created By:</strong> {ticketDetails.createdByType}
// //           </p>
// //           <p>
// //             <strong>Created At:</strong>{" "}
// //             {new Date(ticketDetails.createdAt).toLocaleString()}
// //           </p>
// //           <p>
// //             <strong>Status:</strong>{" "}
// //             <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
// //               {ticketDetails.status}
// //             </span>
// //           </p>

// //           {/* Assign To Dropdown */}
// //           <div className="mt-3">
// //             <strong>Assign To:</strong>
// //             <select
// //               value={selectedStaff}
// //               onChange={(e) => setSelectedStaff(e.target.value)}
// //               className="border border-gray-300 w-full mt-1 rounded-md py-1 px-2 text-sm"
// //             >
// //               <option value="">Select Staff</option>
// //               {staffRoles.map((role) => (
// //                 <option key={role._id} value={role._id}>
// //                   {role.roleName}
// //                 </option>
// //               ))}
// //             </select>
// //             <button
// //               onClick={handleAssignStaff}
// //               className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md w-full"
// //             >
// //               Assign Ticket
// //             </button>
// //           </div>

// //           <p>
// //             <strong>Price:</strong> ₹{ticketDetails.price || "—"}
// //           </p>
// //           <p>
// //             <strong>Chargeable:</strong>{" "}
// //             {ticketDetails.isChargeable ? "Yes" : "No"}
// //           </p>
// //         </div>

// //         {/* Save Button (Edit Mode) */}
// //         {editMode && (
// //           <div className="p-3">
// //             <button
// //               onClick={handleUpdateTicket}
// //               className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md w-full"
// //             >
// //               <FaSave className="inline mr-1" /> Save Changes
// //             </button>
// //           </div>
// //         )}

// //         {/* Customer Info */}
// //         <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
// //           Customer Information
// //         </div>
// //         <div className="p-3 text-sm text-gray-700 space-y-2">
// //           <p>
// //             <strong>Name:</strong> {ticketDetails.personName}
// //           </p>
// //           <p>
// //             <strong>Email:</strong> {ticketDetails.email}
// //           </p>
// //           <p>
// //             <strong>Mobile:</strong> {ticketDetails.personNumber}
// //           </p>
// //           <p>
// //             <strong>Address:</strong> {ticketDetails.address}
// //           </p>
// //         </div>
// //       </div>

// //       {/* RIGHT: Reply / Timeline */}
// //       <div className="w-full lg:w-2/3 bg-white border shadow-md rounded-md">
// //         <div className="flex border-b">
// //           <button
// //             className={`flex-1 py-2 font-semibold ${
// //               activeTab === "reply"
// //                 ? "border-b-2 border-teal-600 text-teal-700"
// //                 : "text-gray-600"
// //             }`}
// //             onClick={() => setActiveTab("reply")}
// //           >
// //             Reply
// //           </button>
// //           <button
// //             className={`flex-1 py-2 font-semibold ${
// //               activeTab === "timeline"
// //                 ? "border-b-2 border-teal-600 text-teal-700"
// //                 : "text-gray-600"
// //             }`}
// //             onClick={() => setActiveTab("timeline")}
// //           >
// //             Timeline
// //           </button>
// //         </div>

// //         {/* Reply Section */}
// //         {activeTab === "reply" && (
// //           <div className="p-4 space-y-4">
// //             <h2 className="text-md font-semibold text-teal-700 mb-2">
// //               Reply for Ticket #{ticketDetails.ticketNumber}
// //             </h2>

// //             <select
// //               value={selectedType}
// //               onChange={(e) => setSelectedType(e.target.value)}
// //               className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
// //             >
// //               {replyTypes.map((type, i) => (
// //                 <option key={i} value={type}>
// //                   {type}
// //                 </option>
// //               ))}
// //             </select>

// //             <textarea
// //               value={replyText}
// //               onChange={(e) => setReplyText(e.target.value)}
// //               rows={3}
// //               placeholder="Type your reply here..."
// //               className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
// //             />

// //             <button
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md"
// //             >
// //               {loading ? "Submitting..." : "Submit"}
// //             </button>

// //             <div className="mt-5 border-t pt-3 space-y-3">
// //               {replies.length === 0 ? (
// //                 <p className="text-gray-500 text-sm">No replies yet</p>
// //               ) : (
// //                 replies.map((r, i) => (
// //                   <div
// //                     key={i}
// //                     className="flex items-start gap-3 bg-gray-50 border rounded-md p-2"
// //                   >
// //                     <FaUserCircle className="text-3xl text-gray-600" />
// //                     <div className="flex-1">
// //                       <p className="font-semibold text-teal-700">
// //                         {r.createdByName || "Unknown User"}
// //                       </p>
// //                       <p className="text-gray-700 text-sm">{r.description}</p>
// //                       <p className="text-xs text-gray-500">
// //                         {new Date(r.createdAt).toLocaleString()}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* Timeline Section */}
// //         {activeTab === "timeline" && (
// //           <div className="p-4">
// //             <h2 className="text-md font-semibold text-teal-700 mb-2">
// //               Ticket History
// //             </h2>
// //             <div className="space-y-4">
// //               {timeline.length === 0 ? (
// //                 <p className="text-gray-500 text-sm">No timeline found</p>
// //               ) : (
// //                 timeline.map((t, i) => (
// //                   <div
// //                     key={i}
// //                     className="border-l-4 border-teal-500 pl-3 pb-2 ml-2"
// //                   >
// //                     <p className="text-gray-800 text-sm">
// //                       <strong>{t.actionType}</strong> — {t.message}
// //                     </p>
// //                     <p className="text-xs text-gray-500">
// //                       {new Date(t.createdAt).toLocaleString()}
// //                     </p>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getTicketReplies,
//   createTicketReply,
//   getTicketTimeline,
//   getTicketDetails,
//   getStaffRoleList,
//   assignTicketToStaff,
//   updateTicketDetails,
//   getCategoryList, // ✅ imported category service
// } from "../../service/ticket";
// import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

// export default function TicketDetails() {
//   const { id: ticketId } = useParams();
//   const [activeTab, setActiveTab] = useState("reply");
//   const [replies, setReplies] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [replyText, setReplyText] = useState("");
//   const [selectedType, setSelectedType] = useState("Select");
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [staffRoles, setStaffRoles] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editableDetails, setEditableDetails] = useState({});

//   const replyTypes = [
//     "Select",
//     "Need Technician Visit",
//     "Internet Stable",
//     "Power Issue",
//     "Fiber Cut",
//   ];

//   // ✅ Fetch all on mount
//   useEffect(() => {
//     if (ticketId) {
//       fetchTicketDetails();
//       fetchReplies();
//       fetchTimeline();
//       fetchStaffRoles();
//     }
//   }, [ticketId]);

//   // ✅ Ticket details
//   const fetchTicketDetails = async () => {
//     try {
//       const res = await getTicketDetails(ticketId);
//       if (res?.status) {
//         setTicketDetails(res.data);
//         setEditableDetails(res.data);
//       }
//     } catch (err) {
//       console.error("Error fetching ticket details:", err);
//     }
//   };

//   // ✅ Replies
//   const fetchReplies = async () => {
//     try {
//       const res = await getTicketReplies(ticketId);
//       if (res?.status) setReplies(res.data || []);
//     } catch (err) {
//       console.error("Error fetching replies:", err);
//     }
//   };

//   // ✅ Timeline
//   const fetchTimeline = async () => {
//     try {
//       const res = await getTicketTimeline(ticketId);
//       if (res?.status) setTimeline(res.data || []);
//     } catch (err) {
//       console.error("Error fetching timeline:", err);
//     }
//   };

//   // ✅ Staff Roles
//   const fetchStaffRoles = async () => {
//     try {
//       const res = await getStaffRoleList();
//       if (res?.status) setStaffRoles(res.data || []);
//     } catch (err) {
//       console.error("Error fetching staff roles:", err);
//     }
//   };

//   // ✅ Categories
//   const fetchCategoryList = async () => {
//     try {
//       const res = await getCategoryList();
//       if (res?.status) setCategories(res.data || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // ✅ Assignment (via prompt)
//   const handleAssignPrompt = async () => {
//     const staffId = prompt("Enter Staff ID to assign this ticket:");
//     if (!staffId) return alert("Assignment cancelled.");

//     const confirmAssign = window.confirm(
//       `Are you sure you want to assign this ticket to ID: ${staffId}?`
//     );
//     if (!confirmAssign) return;

//     try {
//       const res = await assignTicketToStaff({ ticketId, assignToId: staffId });
//       if (res?.status) {
//         alert("Ticket assigned successfully!");
//         fetchTicketDetails();
//       } else alert(res?.message || "Assignment failed");
//     } catch (err) {
//       console.error("Error assigning ticket:", err);
//     }
//   };

//   // ✅ Edit toggle — fetch categories on edit
//   const handleEditToggle = async () => {
//     if (!editMode) await fetchCategoryList();
//     setEditMode(!editMode);
//   };

//   // ✅ Update ticket
//   const handleUpdateTicket = async () => {
//     try {
//       const res = await updateTicketDetails(ticketId, editableDetails);
//       if (res?.status) {
//         alert("✅ Ticket updated successfully!");
//         setEditMode(false); // hide Save button
//         fetchTicketDetails(); // refresh details
//       } else {
//         alert(res?.message || "Failed to update ticket");
//       }
//     } catch (err) {
//       console.error("Error updating ticket:", err);
//       alert("Failed to update ticket.");
//     }
//   };

//   // ✅ Submit reply
//   const handleSubmit = async () => {
//     if (!selectedType || selectedType === "Select") {
//       alert("Please select a reply type");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await createTicketReply(ticketId, {
//         replyType: selectedType,
//         description: replyText || selectedType,
//       });
//       if (res?.status) {
//         alert("Reply submitted successfully!");
//         setReplyText("");
//         setSelectedType("Select");
//         fetchReplies();
//       }
//     } catch (err) {
//       console.error("Error submitting reply:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!ticketDetails)
//     return <div className="p-10 text-center text-gray-600">Loading...</div>;

//   return (
//     <div className="flex flex-col lg:flex-row bg-[#edf2f7] min-h-screen p-5 gap-5">
//       {/* LEFT SIDE */}
//       <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md relative">
//         {/* Edit Icon */}
//         <div className="absolute top-3 right-3 text-gray-600 hover:text-teal-700 cursor-pointer">
//           {editMode ? (
//             <FaTimes onClick={handleEditToggle} />
//           ) : (
//             <FaEdit onClick={handleEditToggle} />
//           )}
//         </div>

//         <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
//           Ticket Information
//         </div>

//         <div className="p-3 text-sm text-gray-700 space-y-2">
//           <p>
//             <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
//           </p>

//           {/* Category Dropdown */}
//           <p>
//             <strong>Category:</strong>{" "}
//             {editMode ? (
//               <select
//                 value={editableDetails.categoryName || ""}
//                 onChange={(e) =>
//                   setEditableDetails({
//                     ...editableDetails,
//                     categoryName: e.target.value,
//                   })
//                 }
//                 className="border px-2 py-1 rounded w-full text-sm"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat.categoryName}>
//                     {cat.categoryName}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               ticketDetails.categoryName || "N/A"
//             )}
//           </p>

//           <p>
//             <strong>Call Source:</strong>{" "}
//             {editMode ? (
//               <input
//                 type="text"
//                 value={editableDetails.callSource || ""}
//                 onChange={(e) =>
//                   setEditableDetails({
//                     ...editableDetails,
//                     callSource: e.target.value,
//                   })
//                 }
//                 className="border px-2 py-1 rounded w-full text-sm"
//               />
//             ) : (
//               ticketDetails.callSource
//             )}
//           </p>

//           <p>
//             <strong>Severity:</strong>{" "}
//             {editMode ? (
//               <select
//                 value={editableDetails.severity || ""}
//                 onChange={(e) =>
//                   setEditableDetails({
//                     ...editableDetails,
//                     severity: e.target.value,
//                   })
//                 }
//                 className="border rounded w-full py-1 px-2 text-sm"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>
//             ) : (
//               ticketDetails.severity
//             )}
//           </p>

//           <p>
//             <strong>Status:</strong>{" "}
//             <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
//               {ticketDetails.status}
//             </span>
//           </p>

//           {/* Role Dropdown */}
//           <div className="mt-3">
//             <strong>Assign To:</strong>
//             <select
//               value={selectedStaff}
//               onChange={(e) => setSelectedStaff(e.target.value)}
//               className="border border-gray-300 w-full mt-1 rounded-md py-1 px-2 text-sm"
//             >
//               <option value="">Select Staff</option>
//               {staffRoles.map((role) => (
//                 <option key={role._id} value={role._id}>
//                   {role.roleName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Save Changes Button */}
//           {editMode && (
//             <button
//               onClick={handleUpdateTicket}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full font-semibold mt-3 shadow"
//             >
//               <FaSave className="inline mr-1" /> Save Changes
//             </button>
//           )}
//         </div>

//         {/* Customer Info */}
//         <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
//           Customer Information
//         </div>
//         <div className="p-3 text-sm text-gray-700 space-y-2 pb-16">
//           <p>
//             <strong>Name:</strong> {ticketDetails.personName}
//           </p>
//           <p>
//             <strong>Email:</strong> {ticketDetails.email}
//           </p>
//           <p>
//             <strong>Mobile:</strong> {ticketDetails.personNumber}
//           </p>
//           <p>
//             <strong>Address:</strong> {ticketDetails.address}
//           </p>
//         </div>

//         {/* Fixed Assign Prompt Button */}
//         <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
//           <button
//             onClick={handleAssignPrompt}
//             className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md font-semibold shadow"
//           >
//             Fix the Ticket
//           </button>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="w-full lg:w-2/3 bg-white border shadow-md rounded-md">
//         <div className="flex border-b">
//           <button
//             className={`flex-1 py-2 font-semibold ${
//               activeTab === "reply"
//                 ? "border-b-2 border-teal-600 text-teal-700"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("reply")}
//           >
//             Reply
//           </button>
//           <button
//             className={`flex-1 py-2 font-semibold ${
//               activeTab === "timeline"
//                 ? "border-b-2 border-teal-600 text-teal-700"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("timeline")}
//           >
//             Timeline
//           </button>
//         </div>

//         {/* Reply Section */}
//         {activeTab === "reply" && (
//           <div className="p-4 space-y-4">
//             <h2 className="text-md font-semibold text-teal-700 mb-2">
//               Reply for Ticket #{ticketDetails.ticketNumber}
//             </h2>

//             <select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
//             >
//               {replyTypes.map((type, i) => (
//                 <option key={i} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>

//             <textarea
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               rows={3}
//               placeholder="Type your reply here..."
//               className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
//             />

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md"
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>

//             {/* Replies */}
//             <div className="mt-5 border-t pt-3 space-y-3">
//               {replies.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No replies yet</p>
//               ) : (
//                 replies.map((r, i) => (
//                   <div
//                     key={i}
//                     className="flex items-start gap-3 bg-gray-50 border rounded-md p-2"
//                   >
//                     <FaUserCircle className="text-3xl text-gray-600" />
//                     <div className="flex-1">
//                       <p className="font-semibold text-teal-700">
//                         {r.createdByName || "Unknown User"}
//                       </p>
//                       <p className="text-gray-700 text-sm">{r.description}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(r.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketReplies,
  createTicketReply,
  getTicketTimeline,
  getTicketDetails,
  getStaffRoleList,
  assignTicketToStaff,
  updateTicketDetails,
  getCategoryList,
  getAllTicketList, // ✅ reused to get user list for search
} from "../../service/ticket";
import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function TicketDetails() {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();

  // Core ticket states
  const [activeTab, setActiveTab] = useState("reply");
  const [replies, setReplies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [selectedType, setSelectedType] = useState("Select");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [staffRoles, setStaffRoles] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableDetails, setEditableDetails] = useState({});

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const replyTypes = [
    "Select",
    "Need Technician Visit",
    "Internet Stable",
    "Power Issue",
    "Fiber Cut",
  ];

  // ✅ Fetch all data on mount
  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
      fetchReplies();
      fetchTimeline();
      fetchStaffRoles();
      fetchUsersForSearch();
    }
  }, [ticketId]);

  // ✅ Ticket details
  const fetchTicketDetails = async () => {
    try {
      const res = await getTicketDetails(ticketId);
      if (res?.status) {
        setTicketDetails(res.data);
        setEditableDetails(res.data);
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    }
  };

  // ✅ Replies
  const fetchReplies = async () => {
    try {
      const res = await getTicketReplies(ticketId);
      if (res?.status) setReplies(res.data || []);
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  // ✅ Timeline
  const fetchTimeline = async () => {
    try {
      const res = await getTicketTimeline(ticketId);
      if (res?.status) setTimeline(res.data || []);
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
  };

  // ✅ Staff Roles
  const fetchStaffRoles = async () => {
    try {
      const res = await getStaffRoleList();
      if (res?.status) setStaffRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching staff roles:", err);
    }
  };

  // ✅ Categories
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      if (res?.status) setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Fetch Users for Search
  const fetchUsersForSearch = async () => {
    try {
      const res = await getAllTicketList(1, 100, "");
      const ticketData =
        res?.data?.data?.allTickets ||
        res?.data?.allTickets ||
        res?.allTickets ||
        [];
      setAllUsers(ticketData);
    } catch (err) {
      console.error("Error fetching users for search:", err);
    }
  };

  // ✅ Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matched = allUsers
      .filter((u) =>
        u.personName.toLowerCase().includes(value.trim().toLowerCase())
      )
      .map((u) => ({ id: u._id, name: u.personName }))
      .slice(0, 5);

    setSuggestions(matched);
  };

  // ✅ Suggestion click
  const handleSuggestionClick = (id, name) => {
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/user/details/${id}`);
  };

  // ✅ Assignment (prompt)
  const handleAssignPrompt = async () => {
    const staffId = prompt("Enter Staff ID to assign this ticket:");
    if (!staffId) return alert("Assignment cancelled.");

    const confirmAssign = window.confirm(
      `Are you sure you want to assign this ticket to ID: ${staffId}?`
    );
    if (!confirmAssign) return;

    try {
      const res = await assignTicketToStaff({ ticketId, assignToId: staffId });
      if (res?.status) {
        alert("Ticket assigned successfully!");
        fetchTicketDetails();
      } else alert(res?.message || "Assignment failed");
    } catch (err) {
      console.error("Error assigning ticket:", err);
    }
  };

  // ✅ Edit toggle (load categories)
  const handleEditToggle = async () => {
    if (!editMode) await fetchCategoryList();
    setEditMode(!editMode);
  };

  // ✅ Update ticket
  const handleUpdateTicket = async () => {
    try {
      const res = await updateTicketDetails(ticketId, editableDetails);
      if (res?.status) {
        alert("✅ Ticket updated successfully!");
        setEditMode(false);
        fetchTicketDetails();
      } else {
        alert(res?.message || "Failed to update ticket");
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  // ✅ Submit reply
  const handleSubmit = async () => {
    if (!selectedType || selectedType === "Select") {
      alert("Please select a reply type");
      return;
    }
    setLoading(true);
    try {
      const res = await createTicketReply(ticketId, {
        replyType: selectedType,
        description: replyText || selectedType,
      });
      if (res?.status) {
        alert("Reply submitted successfully!");
        setReplyText("");
        setSelectedType("Select");
        fetchReplies();
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!ticketDetails)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="flex flex-col bg-[#edf2f7] min-h-screen p-5 gap-5">
      {/* 🔍 Search Bar at Top */}
      <div className="relative w-full md:w-1/3 mb-3">
        <input
          type="text"
          placeholder="Search user by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full border rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-200 rounded-lg mt-1 w-full shadow-md z-20 max-h-56 overflow-y-auto transition-all">
            {suggestions.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSuggestionClick(user.id, user.name)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md relative">
          <div className="absolute top-3 right-3 text-gray-600 hover:text-teal-700 cursor-pointer">
            {editMode ? (
              <FaTimes onClick={handleEditToggle} />
            ) : (
              <FaEdit onClick={handleEditToggle} />
            )}
          </div>

          <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
            Ticket Information
          </div>

          <div className="p-3 text-sm text-gray-700 space-y-2">
            <p>
              <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {editMode ? (
                <select
                  value={editableDetails.categoryName || ""}
                  onChange={(e) =>
                    setEditableDetails({
                      ...editableDetails,
                      categoryName: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                ticketDetails.categoryName || "N/A"
              )}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {editMode ? (
                <select
                  value={editableDetails.severity || ""}
                  onChange={(e) =>
                    setEditableDetails({
                      ...editableDetails,
                      severity: e.target.value,
                    })
                  }
                  className="border rounded w-full py-1 px-2 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                ticketDetails.severity
              )}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                {ticketDetails.status}
              </span>
            </p>

            <div className="mt-3">
              <strong>Assign To:</strong>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="border border-gray-300 w-full mt-1 rounded-md py-1 px-2 text-sm"
              >
                <option value="">Select Staff</option>
                {staffRoles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            {editMode && (
              <button
                onClick={handleUpdateTicket}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full font-semibold mt-3 shadow"
              >
                <FaSave className="inline mr-1" /> Save Changes
              </button>
            )}
          </div>

          <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
            Customer Information
          </div>
          <div className="p-3 text-sm text-gray-700 space-y-2 pb-16">
            <p>
              <strong>Name:</strong> {ticketDetails.personName}
            </p>
            <p>
              <strong>Email:</strong> {ticketDetails.email}
            </p>
            <p>
              <strong>Mobile:</strong> {ticketDetails.personNumber}
            </p>
            <p>
              <strong>Address:</strong> {ticketDetails.address}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
            <button
              onClick={handleAssignPrompt}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md font-semibold shadow"
            >
              Fix the Ticket
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-2/3 bg-white border shadow-md rounded-md">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 font-semibold ${
                activeTab === "reply"
                  ? "border-b-2 border-teal-600 text-teal-700"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reply")}
            >
              Reply
            </button>
            <button
              className={`flex-1 py-2 font-semibold ${
                activeTab === "timeline"
                  ? "border-b-2 border-teal-600 text-teal-700"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
          </div>

          {activeTab === "reply" && (
            <div className="p-4 space-y-4">
              <h2 className="text-md font-semibold text-teal-700 mb-2">
                Reply for Ticket #{ticketDetails.ticketNumber}
              </h2>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
              >
                {replyTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder="Type your reply here..."
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <div className="mt-5 border-t pt-3 space-y-3">
                {replies.length === 0 ? (
                  <p className="text-gray-500 text-sm">No replies yet</p>
                ) : (
                  replies.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-gray-50 border rounded-md p-2"
                    >
                      <FaUserCircle className="text-3xl text-gray-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-teal-700">
                          {r.createdByName || "Unknown User"}
                        </p>
                        <p className="text-gray-700 text-sm">{r.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="p-4">
              <h2 className="text-md font-semibold text-teal-700 mb-2">
                Ticket History
              </h2>
              <div className="space-y-4">
                {timeline.length === 0 ? (
                  <p className="text-gray-500 text-sm">No timeline found</p>
                ) : (
                  timeline.map((t, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-teal-500 pl-3 pb-2 ml-2"
                    >
                      <p className="text-gray-800 text-sm">
                        <strong>{t.actionType}</strong> — {t.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
