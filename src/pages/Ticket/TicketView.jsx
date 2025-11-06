// // import { useEffect, useState } from "react";
// // import {
// //   getTicketReplies,
// //   createTicketReply,
// //   getTicketTimeline,
// // } from "../../service/ticket";
// // import { FaUserCircle } from "react-icons/fa";

// // export default function TicketDetails() {
// //   const [activeTab, setActiveTab] = useState("reply");
// //   const [replies, setReplies] = useState([]);
// //   const [timeline, setTimeline] = useState([]);
// //   const [replyText, setReplyText] = useState("");
// //   const [selectedType, setSelectedType] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const ticketId = "68e0f84a836cb20be5d0a21b"; // dummy ticketId (will be dynamic later)

// //   // Dummy Ticket Info
// //   const ticketDetails = {
// //     ticketNumber: "WEB8061125",
// //     category: "Speed Slow",
// //     description:
// //       "The customer said that the internet keeps disconnecting frequently and doesn’t work properly.",
// //     callSource: "Phone",
// //     severity: "Low",
// //     createdBy: "Ishika",
// //     createdAt: "2025-11-06T12:14:07Z",
// //     status: "Open",
// //   };

// //   // Dummy Customer Info
// //   const customer = {
// //     clientId: "IKLAQMALIK",
// //     name: "Mr. IKLAQ MALIK",
// //     email: "sm0728060@gmail.com",
// //     mobile: "8860986550",
// //     address: "45 FUTTA ROAD AYESHA MASZID HINDON VIHAR GZB",
// //     area: "",
// //     customerType: "Individual",
// //   };

// //   // Dummy Dropdown master values
// //   const replyTypes = [
// //     "Select",
// //     "Need Technician Visit",
// //     "Internet Stable",
// //     "Power Issue",
// //     "Fiber Cut",
// //   ];

// //   // Fetch replies & timeline
// //   useEffect(() => {
// //     fetchReplies();
// //     fetchTimeline();
// //   }, []);

// //   const fetchReplies = async () => {
// //     try {
// //       const res = await getTicketReplies(ticketId);
// //       if (res.status) setReplies(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching replies:", err);
// //     }
// //   };

// //   const fetchTimeline = async () => {
// //     try {
// //       const res = await getTicketTimeline(ticketId);
// //       if (res.status) setTimeline(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching timeline:", err);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (!selectedType || selectedType === "Select") {
// //       alert("Please select a reply type");
// //       return;
// //     }
// //     if (!replyText.trim()) {
// //       alert("Reply message cannot be empty");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await createTicketReply(ticketId, {
// //         replyType: selectedType,
// //         message: replyText,
// //       });
// //       if (res.status) {
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

// //   return (
// //     <div className="flex flex-col lg:flex-row bg-[#edf2f7] min-h-screen p-5 gap-5">
// //       {/* LEFT: Ticket Info */}
// //       <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md">
// //         {/* Ticket Info */}
// //         <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
// //           Ticket Information
// //         </div>
// //         <div className="p-3 text-sm text-gray-700 space-y-2">
// //           <p>
// //             <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
// //           </p>
// //           <p>
// //             <strong>Category:</strong> {ticketDetails.category}
// //           </p>
// //           <p>
// //             <strong>Description:</strong> {ticketDetails.description}
// //           </p>
// //           <p>
// //             <strong>Call Source:</strong> {ticketDetails.callSource}
// //           </p>
// //           <p>
// //             <strong>Severity:</strong> {ticketDetails.severity}
// //           </p>
// //           <p>
// //             <strong>Created By:</strong> {ticketDetails.createdBy}
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
// //         </div>

// //         {/* Customer Info */}
// //         <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
// //           Customer Information
// //         </div>
// //         <div className="p-3 text-sm text-gray-700 space-y-2">
// //           <p>
// //             <strong>Client Id:</strong>{" "}
// //             <span className="text-blue-700 font-semibold">
// //               {customer.clientId}
// //             </span>
// //           </p>
// //           <p>
// //             <strong>Name:</strong> {customer.name}
// //           </p>
// //           <p>
// //             <strong>Email:</strong> {customer.email}
// //           </p>
// //           <p>
// //             <strong>Mobile:</strong> {customer.mobile}
// //           </p>
// //           <p>
// //             <strong>Address:</strong> {customer.address}
// //           </p>
// //           <p>
// //             <strong>Area:</strong> {customer.area || "—"}
// //           </p>
// //           <p>
// //             <strong>Customer Type:</strong> {customer.customerType}
// //           </p>
// //           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2">
// //             Fix the Ticket
// //           </button>
// //         </div>
// //       </div>

// //       {/* RIGHT: Reply / Timeline Tabs */}
// //       <div className="w-full lg:w-2/3 bg-white border shadow-md rounded-md">
// //         {/* Tabs */}
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
// //               Reply of Ticket No. {ticketDetails.ticketNumber}
// //             </h2>

// //             {/* Dropdown */}
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

// //             {/* Textarea */}
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

// //             {/* Existing Replies */}
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
// //                         {r.userName || "KHUSHNUMA KHAN"}
// //                       </p>
// //                       <p className="text-gray-700 text-sm">{r.message}</p>
// //                       <p className="text-xs text-gray-500">
// //                         {new Date(r.createdAt || new Date()).toLocaleString()}
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
// //                       {new Date(t.createdAt || new Date()).toLocaleString()}
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
// } from "../../service/ticket";
// import { FaUserCircle } from "react-icons/fa";

// export default function TicketDetails() {
//   const { id: ticketId } = useParams(); // ✅ Ticket ID from URL
//   const [activeTab, setActiveTab] = useState("reply");
//   const [replies, setReplies] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [replyText, setReplyText] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [ticketDetails, setTicketDetails] = useState(null); // ✅ fixed invalid TS syntax
//   const [staffRoles, setStaffRoles] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Dropdown options for reply type
//   const replyTypes = [
//     "Select",
//     "Need Technician Visit",
//     "Internet Stable",
//     "Power Issue",
//     "Fiber Cut",
//   ];

//   // ✅ Fetch all data on mount
//   useEffect(() => {
//     if (ticketId) {
//       fetchTicketDetails();
//       fetchReplies();
//       fetchTimeline();
//       fetchStaffRoles();
//     }
//   }, [ticketId]);

//   // ✅ Fetch Ticket Details
//   const fetchTicketDetails = async () => {
//     try {
//       const res = await getTicketDetails(ticketId);
//       if (res.status) setTicketDetails(res.data);
//     } catch (err) {
//       console.error("Error fetching ticket details:", err);
//     }
//   };

//   // ✅ Fetch Replies
//   const fetchReplies = async () => {
//     try {
//       const res = await getTicketReplies(ticketId);
//       if (res.status) setReplies(res.data || []);
//     } catch (err) {
//       console.error("Error fetching replies:", err);
//     }
//   };

//   // ✅ Fetch Timeline
//   const fetchTimeline = async () => {
//     try {
//       const res = await getTicketTimeline(ticketId);
//       if (res.status) setTimeline(res.data || []);
//     } catch (err) {
//       console.error("Error fetching timeline:", err);
//     }
//   };

//   // ✅ Fetch Staff Role List for "Assign To" dropdown
//   const fetchStaffRoles = async () => {
//     try {
//       const res = await getStaffRoleList();
//       if (res.status) setStaffRoles(res.data || []);
//     } catch (err) {
//       console.error("Error fetching staff roles:", err);
//     }
//   };

//   // ✅ Submit Reply
//   const handleSubmit = async () => {
//     if (!selectedType || selectedType === "Select") {
//       alert("Please select a reply type");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await createTicketReply(ticketId, {
//         replyType: selectedType,
//         description: replyText || selectedType, // ✅ message optional
//       });
//       if (res.status) {
//         alert("Reply submitted successfully!");
//         setReplyText("");
//         setSelectedType("Select");
//         fetchReplies();
//       }
//     } catch (err) {
//       console.error("Error submitting reply:", err);
//       alert("Failed to submit reply");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!ticketDetails)
//     return (
//       <div className="p-10 text-center text-gray-600">
//         Loading ticket details...
//       </div>
//     );

//   return (
//     <div className="flex flex-col lg:flex-row bg-[#edf2f7] min-h-screen p-5 gap-5">
//       {/* LEFT: Ticket Info */}
//       <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md">
//         <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
//           Ticket Information
//         </div>
//         <div className="p-3 text-sm text-gray-700 space-y-2">
//           <p>
//             <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
//           </p>
//           <p>
//             <strong>Category:</strong> {ticketDetails.categoryName || "N/A"}
//           </p>
//           <p>
//             <strong>Call Source:</strong> {ticketDetails.callSource}
//           </p>
//           <p>
//             <strong>Severity:</strong> {ticketDetails.severity}
//           </p>
//           <p>
//             <strong>Created By:</strong> {ticketDetails.createdByType}
//           </p>
//           <p>
//             <strong>Created At:</strong>{" "}
//             {new Date(ticketDetails.createdAt).toLocaleString()}
//           </p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
//               {ticketDetails.status}
//             </span>
//           </p>

//           {/* ✅ Assign To Dropdown */}
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

//           <p>
//             <strong>Price:</strong> ₹{ticketDetails.price || "—"}
//           </p>
//           <p>
//             <strong>Chargeable:</strong>{" "}
//             {ticketDetails.isChargeable ? "Yes" : "No"}
//           </p>
//         </div>

//         {/* ✅ Customer Info */}
//         <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
//           Customer Information
//         </div>
//         <div className="p-3 text-sm text-gray-700 space-y-2">
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
//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2">
//             Fix the Ticket
//           </button>
//         </div>
//       </div>

//       {/* RIGHT: Reply / Timeline */}
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

//         {/* ✅ Reply Tab */}
//         {activeTab === "reply" && (
//           <div className="p-4 space-y-4">
//             <h2 className="text-md font-semibold text-teal-700 mb-2">
//               Reply of Ticket No. {ticketDetails.ticketNumber}
//             </h2>

//             {/* Dropdown */}
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

//             {/* Textarea */}
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
//                         {r.createdByName || r.userName || "Unknown User"}
//                       </p>
//                       <p className="text-gray-700 text-sm">
//                         {r.description || r.message}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(r.createdAt || new Date()).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}

//         {/* ✅ Timeline Tab */}
//         {activeTab === "timeline" && (
//           <div className="p-4">
//             <h2 className="text-md font-semibold text-teal-700 mb-2">
//               Ticket History
//             </h2>
//             <div className="space-y-4">
//               {timeline.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No timeline found</p>
//               ) : (
//                 timeline.map((t, i) => (
//                   <div
//                     key={i}
//                     className="border-l-4 border-teal-500 pl-3 pb-2 ml-2"
//                   >
//                     <p className="text-gray-800 text-sm">
//                       <strong>{t.actionType}</strong> — {t.message}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(t.createdAt || new Date()).toLocaleString()}
//                     </p>
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
import { useParams } from "react-router-dom";
import {
  getTicketReplies,
  createTicketReply,
  getTicketTimeline,
  getTicketDetails,
  getStaffRoleList,
  assignTicketToStaff,
  updateTicketDetails,
} from "../../service/ticket";
import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function TicketDetails() {
  const { id: ticketId } = useParams();
  const [activeTab, setActiveTab] = useState("reply");
  const [replies, setReplies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [selectedType, setSelectedType] = useState("Select");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [staffRoles, setStaffRoles] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableDetails, setEditableDetails] = useState({});

  const replyTypes = [
    "Select",
    "Need Technician Visit",
    "Internet Stable",
    "Power Issue",
    "Fiber Cut",
  ];

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
      fetchReplies();
      fetchTimeline();
      fetchStaffRoles();
    }
  }, [ticketId]);

  // ✅ Fetch Ticket Details
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

  // ✅ Fetch Replies
  const fetchReplies = async () => {
    try {
      const res = await getTicketReplies(ticketId);
      if (res?.status) setReplies(res.data || []);
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  // ✅ Fetch Timeline
  const fetchTimeline = async () => {
    try {
      const res = await getTicketTimeline(ticketId);
      if (res?.status) setTimeline(res.data || []);
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
  };

  // ✅ Fetch Staff Role List
  const fetchStaffRoles = async () => {
    try {
      const res = await getStaffRoleList();
      if (res?.status) setStaffRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching staff roles:", err);
    }
  };

  // ✅ Handle Ticket Assignment
  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      alert("Please select a staff to assign");
      return;
    }
    const confirmAssign = window.confirm(
      "Are you sure you want to assign this ticket?"
    );
    if (!confirmAssign) return;

    try {
      const res = await assignTicketToStaff({
        ticketId,
        assignToId: selectedStaff,
      });
      if (res?.status) {
        alert("Ticket successfully assigned!");
        fetchTicketDetails();
      } else {
        alert(res?.message || "Assignment failed");
      }
    } catch (err) {
      console.error("Error assigning ticket:", err);
      alert("Failed to assign ticket");
    }
  };

  // ✅ Handle Reply Submission
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
      alert("Failed to submit reply");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit Save
  const handleUpdateTicket = async () => {
    try {
      const res = await updateTicketDetails(ticketId, editableDetails);
      if (res?.status) {
        alert("Ticket updated successfully!");
        setEditMode(false);
        fetchTicketDetails();
      } else {
        alert(res?.message || "Failed to update ticket");
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  if (!ticketDetails)
    return (
      <div className="p-10 text-center text-gray-600">
        Loading ticket details...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row bg-[#edf2f7] min-h-screen p-5 gap-5">
      {/* LEFT: Ticket Info */}
      <div className="w-full lg:w-1/3 bg-white border shadow-md rounded-md relative">
        {/* Edit Icon */}
        <div className="absolute top-3 right-3 text-gray-600 hover:text-teal-700 cursor-pointer">
          {editMode ? (
            <FaTimes onClick={() => setEditMode(false)} />
          ) : (
            <FaEdit onClick={() => setEditMode(true)} />
          )}
        </div>

        <div className="border-b bg-[#003865] text-white px-3 py-2 font-semibold rounded-t-md">
          Ticket Information
        </div>
        <div className="p-3 text-sm text-gray-700 space-y-2">
          <p>
            <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
          </p>

          {/* Editable Fields */}
          <div className="space-y-2">
            <p>
              <strong>Category:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  value={editableDetails.categoryName || ""}
                  onChange={(e) =>
                    setEditableDetails({
                      ...editableDetails,
                      categoryName: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              ) : (
                ticketDetails.categoryName || "N/A"
              )}
            </p>

            <p>
              <strong>Call Source:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  value={editableDetails.callSource || ""}
                  onChange={(e) =>
                    setEditableDetails({
                      ...editableDetails,
                      callSource: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              ) : (
                ticketDetails.callSource
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
          </div>

          <p>
            <strong>Created By:</strong> {ticketDetails.createdByType}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(ticketDetails.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
              {ticketDetails.status}
            </span>
          </p>

          {/* Assign To Dropdown */}
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
            <button
              onClick={handleAssignStaff}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md w-full"
            >
              Assign Ticket
            </button>
          </div>

          <p>
            <strong>Price:</strong> ₹{ticketDetails.price || "—"}
          </p>
          <p>
            <strong>Chargeable:</strong>{" "}
            {ticketDetails.isChargeable ? "Yes" : "No"}
          </p>
        </div>

        {/* Save Button (Edit Mode) */}
        {editMode && (
          <div className="p-3">
            <button
              onClick={handleUpdateTicket}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md w-full"
            >
              <FaSave className="inline mr-1" /> Save Changes
            </button>
          </div>
        )}

        {/* Customer Info */}
        <div className="border-t bg-[#003865] text-white px-3 py-2 font-semibold">
          Customer Information
        </div>
        <div className="p-3 text-sm text-gray-700 space-y-2">
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
      </div>

      {/* RIGHT: Reply / Timeline */}
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

        {/* Reply Section */}
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

        {/* Timeline Section */}
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
  );
}
