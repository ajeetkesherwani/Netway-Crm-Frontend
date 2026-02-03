// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList, deleteTicket } from "../../service/ticket";
// import { FaEllipsisV, FaTrash } from "react-icons/fa";
// import TicketFilter from "../Ticket/TicketFilter";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function AllTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [menuOpen, setMenuOpen] = useState(null);

//   const limit = 10;
//   const navigate = useNavigate();

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllTicketList(page, limit, "");

//       console.log("Raw API Response:", res); // ← Keep this for debugging

//       let ticketData =
//         res?.data?.data?.allTickets ||
//         res?.data?.allTickets ||
//         res?.allTickets ||
//         [];

//       const totalCount =
//         res?.data?.data?.totalCount ||
//         res?.data?.totalCount ||
//         ticketData.length; // fallback

//       // CRITICAL FIX: If backend ignores pagination, force client-side limit
//       // But prefer server-side (only slice if more than limit returned)
//       if (ticketData.length > limit) {
//         console.warn("Backend sent more than limit tickets! Forcing client-side pagination.");
//         ticketData = ticketData.slice(0, limit);
//       }

//       const cleaned = ticketData.map((t) => ({
//         _id: t._id,
//         ticketNumber: t.ticketNumber || "—",
//         personName: t.personName || "N/A",
//         category: t.category?.name || "—",
//         createdAt: t.createdAt || "",
//         callSource: t.callSource || "—",
//         assignToName: t.assignToId?.staffName || "—",
//         assignedAt: t.assignedAt || t.createdAt || "—",
//         fixedBy:
//   typeof t.fixedBy === "object" && t.fixedBy !== null
//     ? (
//         t.fixedBy.staffName ||
//         t.fixedBy.resellerName ||
//         t.fixedBy.lcoName ||
//         t.fixedBy.name || // Admin
//         t.fixedBy._id
//       )
//     : t.fixedBy || "—",
//         // fixedBy:
//         //   typeof t.fixedBy === "object"
//         //     ? t.fixedBy?.staffName || t.fixedBy?._id || "—"
//         //     : t.fixedBy || "—",
//         fixedAt: t.fixedAt || "—",
//         status: t.status || "Open",
//       }));

//       setTickets(cleaned); // Now guaranteed ≤ 10 items
//       setTotalPages(Math.ceil(totalCount / limit));
//     } catch (err) {
//       console.error("Error fetching tickets:", err);
//       setError("Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTickets();
//   }, [page]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".action-menu") && !e.target.closest(".action-toggle")) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

//   const handleMenuToggle = (id) => {
//     setMenuOpen(menuOpen === id ? null : id);
//   };

//   const handleRemove = async (id) => {
//     if (window.confirm("Are you sure you want to permanently delete this ticket?")) {
//       try {
//         const res = await deleteTicket(id);
//         if (res.status || res.success) {
//           alert("Ticket deleted successfully!");
//           loadTickets();
//         } else {
//           alert("Failed to delete: " + (res.message || "Unknown error"));
//         }
//       } catch (err) {
//         alert(err.message || "Error deleting ticket");
//       } finally {
//         setMenuOpen(null);
//       }
//     }
//   };

//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading) {
//     return (
//       <p className="text-center py-16 text-gray-500 text-lg animate-pulse">
//         Loading tickets...
//       </p>
//     );
//   }

//   if (error) {
//     return <p className="text-center py-16 text-red-600 font-medium">{error}</p>;
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Tickets</h1>
//       </div>

//       <TicketFilter
//   filters={filters}
//   onFilterChange={handleFilterChange}
//   onSearch={handleSearch}
//   onReset={handleReset}
// />

//       <div className="bg-white shadow-lg rounded-lg border overflow-hidden">
//         {/* Desktop Header */}
//         <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>User Name</div>
//           <div>Category</div>
//           <div className="col-span-2">Ticket Date/Time</div>
//           <div>Resolution</div>
//           <div>Call Source</div>
//           <div>Assigned To</div>
//           <div>Resolved By</div>
//           <div>Resolved Date/Time</div>
//           <div className="text-center">Status / Action</div>
//         </div>

//         {/* Rows */}
//         {tickets.length > 0 ? (
//           tickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-12 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition"
//             >
//               <div className="font-medium">
//                 {(page - 1) * limit + index + 1}
//               </div>

//               <button
//                 onClick={() => handleViewTicket(ticket._id)}
//                 className="text-blue-600 font-semibold hover:underline truncate"
//               >
//                 {ticket.ticketNumber}
//               </button>

//               <div className="truncate">{ticket.personName}</div>
//               <div>{ticket.category}</div>
//               <div className="text-xs col-span-2">
//                 {formatDateTime(ticket.createdAt)}
//               </div>
//               <div className="text-gray-500">—</div>
//               <div>{ticket.callSource}</div>
//               <div>{ticket.assignToName}</div>
//               <div>{ticket.fixedBy}</div>
//               <div className="text-xs">{formatDateTime(ticket.fixedAt)}</div>

//               <div className="flex justify-between md:justify-center items-center gap-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     ticket.status === "Closed"
//                       ? "bg-green-100 text-green-800"
//                       : ticket.status === "Fixed"
//                       ? "bg-blue-100 text-blue-800"
//                       : ticket.status === "Assigned"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {ticket.status}
//                 </span>

//                 <div className="relative">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMenuToggle(ticket._id);
//                     }}
//                     className="p-2 hover:bg-gray-200 rounded-full action-toggle transition"
//                   >
//                     <FaEllipsisV className="text-gray-600" />
//                   </button>

//                   {menuOpen === ticket._id && (
//                     <div className="action-menu absolute -top-8 right-0 bg-white border rounded-lg shadow-xl w-40 z-50">
//                       <ProtectedAction module="tickets" action="allTicketReomve">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemove(ticket._id);
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 text-sm transition"
//                         >
//                           <FaTrash className="text-sm" />
//                           Delete Ticket
//                         </button>
//                       </ProtectedAction>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-16 text-gray-500 text-lg">
//             No tickets found
//           </div>
//         )}
//       </div>

//       {/* Pagination - Only show if more than one page */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-6 mt-8">
//           <button
//             onClick={handlePrevPage}
//             disabled={page === 1}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
//           >
//             Previous
//           </button>

//           <span className="text-lg font-semibold text-gray-700">
//             Page {page} of {totalPages}
//           </span>

//           <button
//             onClick={handleNextPage}
//             disabled={page === totalPages}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // 2.
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList, deleteTicket } from "../../service/ticket";
// import { FaEllipsisV, FaTrash } from "react-icons/fa";
// import TicketFilter from "../Ticket/TicketFilter";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function AllTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [menuOpen, setMenuOpen] = useState(null);

//   // ADD THIS: Filter state
//   const [filters, setFilters] = useState({
//     userMobile: "",
//     ticketNo: "",
//     fromDate: "",
//     toDate: "",
//     area: "",
//     closeBy: "",
//     resolvedBy: "",
//     category: "",
//     assignedTo: "",
//     priority: "",
//     status: "",
//     serverZone: "",
//     callSource: "",
//     reseller: "",
//     type: "",
//     role: "",
//     ticketLevel: "",
//   });

//   const limit = 10;
//   const navigate = useNavigate();

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // ADD THESE: Filter handlers
//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSearch = () => {
//     setPage(1); // Reset to first page on new search
//     loadTickets(); // Will use current filters
//   };

//   const handleReset = () => {
//     setFilters({
//       userMobile: "",
//       ticketNo: "",
//       fromDate: "",
//       toDate: "",
//       area: "",
//       closeBy: "",
//       resolvedBy: "",
//       category: "",
//       assignedTo: "",
//       priority: "",
//       status: "",
//       serverZone: "",
//       callSource: "",
//       reseller: "",
//       type: "",
//       role: "",
//       ticketLevel: "",
//     });
//     setPage(1);
//     loadTickets(); // Reload with cleared filters
//   };

//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       // Pass filters as query params (you'll need to update your API service to accept them)
//       const queryParams = new URLSearchParams({
//         page,
//         limit,
//         ...filters,
//         // Remove empty filters to avoid sending unnecessary params
//         ...(Object.fromEntries(
//           Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
//         )),
//       }).toString();

//       const res = await getAllTicketList(page, limit, queryParams); // Adjust service to accept query string

//       console.log("Raw API Response:", res);

//       let ticketData =
//         res?.data?.data?.allTickets ||
//         res?.data?.allTickets ||
//         res?.allTickets ||
//         [];

//       const totalCount =
//         res?.data?.data?.totalCount ||
//         res?.data?.totalCount ||
//         res?.total ||
//         ticketData.length;

//       if (ticketData.length > limit) {
//         console.warn("Backend sent more than limit tickets! Forcing client-side pagination.");
//         ticketData = ticketData.slice(0, limit);
//       }

//       const cleaned = ticketData.map((t) => ({
//         _id: t._id,
//         ticketNumber: t.ticketNumber || "—",
//         personName: t.personName || "N/A",
//         category: t.category?.name || "—",
//         createdAt: t.createdAt || "",
//         callSource: t.callSource || "—",
//         assignToName: t.assignToId?.staffName || "—",
//         assignedAt: t.assignedAt || t.createdAt || "—",
//         fixedBy:
//           typeof t.fixedBy === "object" && t.fixedBy !== null
//             ? t.fixedBy.staffName ||
//               t.fixedBy.resellerName ||
//               t.fixedBy.lcoName ||
//               t.fixedBy.name ||
//               t.fixedBy._id ||
//               "—"
//             : t.fixedBy || "—",
//         fixedAt: t.fixedAt || "—",
//         status: t.status || "Open",
//       }));

//       setTickets(cleaned);
//       setTotalPages(Math.ceil(totalCount / limit));
//     } catch (err) {
//       console.error("Error fetching tickets:", err);
//       setError("Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTickets();
//   }, [page]);

//   // Optional: Reload when filters change + search is clicked (handled via handleSearch)

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".action-menu") && !e.target.closest(".action-toggle")) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

//   const handleMenuToggle = (id) => {
//     setMenuOpen(menuOpen === id ? null : id);
//   };

//   const handleRemove = async (id) => {
//     if (window.confirm("Are you sure you want to permanently delete this ticket?")) {
//       try {
//         const res = await deleteTicket(id);
//         if (res.status || res.success) {
//           alert("Ticket deleted successfully!");
//           loadTickets();
//         } else {
//           alert("Failed to delete: " + (res.message || "Unknown error"));
//         }
//       } catch (err) {
//         alert(err.message || "Error deleting ticket");
//       } finally {
//         setMenuOpen(null);
//       }
//     }
//   };

//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading) {
//     return (
//       <p className="text-center py-16 text-gray-500 text-lg animate-pulse">
//         Loading tickets...
//       </p>
//     );
//   }

//   if (error) {
//     return <p className="text-center py-16 text-red-600 font-medium">{error}</p>;
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Tickets</h1>
//       </div>

//       {/* NOW THIS WORKS */}
//       <TicketFilter
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onSearch={handleSearch}
//         onReset={handleReset}
//       />

//       <div className="bg-white shadow-lg rounded-lg border overflow-hidden">
//         {/* Desktop Header */}
//         <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>User Name</div>
//           <div>Category</div>
//           <div className="col-span-2">Ticket Date/Time</div>
//           <div>Resolution</div>
//           <div>Call Source</div>
//           <div>Assigned To</div>
//           <div>Resolved By</div>
//           <div>Resolved Date/Time</div>
//           <div className="text-center">Status / Action</div>
//         </div>

//         {/* Rows */}
//         {tickets.length > 0 ? (
//           tickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-12 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition"
//             >
//               <div className="font-medium">
//                 {(page - 1) * limit + index + 1}
//               </div>

//               <button
//                 onClick={() => handleViewTicket(ticket._id)}
//                 className="text-blue-600 font-semibold hover:underline truncate"
//               >
//                 {ticket.ticketNumber}
//               </button>

//               <div className="truncate">{ticket.personName}</div>
//               <div>{ticket.category}</div>
//               <div className="text-xs col-span-2">
//                 {formatDateTime(ticket.createdAt)}
//               </div>
//               <div className="text-gray-500">—</div>
//               <div>{ticket.callSource}</div>
//               <div>{ticket.assignToName}</div>
//               <div>{ticket.fixedBy}</div>
//               <div className="text-xs">{formatDateTime(ticket.fixedAt)}</div>

//               <div className="flex justify-between md:justify-center items-center gap-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     ticket.status === "Closed"
//                       ? "bg-green-100 text-green-800"
//                       : ticket.status === "Fixed"
//                       ? "bg-blue-100 text-blue-800"
//                       : ticket.status === "Assigned"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {ticket.status}
//                 </span>

//                 <div className="relative">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMenuToggle(ticket._id);
//                     }}
//                     className="p-2 hover:bg-gray-200 rounded-full action-toggle transition"
//                   >
//                     <FaEllipsisV className="text-gray-600" />
//                   </button>

//                   {menuOpen === ticket._id && (
//                     <div className="action-menu absolute -top-8 right-0 bg-white border rounded-lg shadow-xl w-40 z-50">
//                       <ProtectedAction module="tickets" action="allTicketReomve">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemove(ticket._id);
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 text-sm transition"
//                         >
//                           <FaTrash className="text-sm" />
//                           Delete Ticket
//                         </button>
//                       </ProtectedAction>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-16 text-gray-500 text-lg">
//             No tickets found
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-6 mt-8">
//           <button
//             onClick={handlePrevPage}
//             disabled={page === 1}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
//           >
//             Previous
//           </button>

//           <span className="text-lg font-semibold text-gray-700">
//             Page {page} of {totalPages}
//           </span>

//           <button
//             onClick={handleNextPage}
//             disabled={page === totalPages}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketListWithFilter, deleteTicket } from "../../service/ticket";
// import { FaEllipsisV, FaTrash } from "react-icons/fa";
// import TicketFilter from "../Ticket/TicketFilter";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function AllTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [menuOpen, setMenuOpen] = useState(null);

//   // Updated filters — using userSearch for unified search
//   const [filters, setFilters] = useState({
//     userSearch: "",           // ← unified: name / mobile / email
//     ticketNo: "",
//     fromDate: "",
//     toDate: "",
//     area: "",
//     closeBy: "",
//     resolvedBy: "",
//     category: "",
//     assignedTo: "",
//     priority: "",
//     status: "",
//     serverZone: "",
//     callSource: "",
//     reseller: "",
//     type: "",
//     role: "",
//     ticketLevel: "",
//     lcoId: "",
//     resellerId: "",
//   });

//   const limit = 10;
//   const navigate = useNavigate();

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSearch = () => {
//     setPage(1);
//     loadTickets();
//   };

//   const handleReset = () => {
//     setFilters({
//       userSearch: "",
//       ticketNo: "",
//       fromDate: "",
//       toDate: "",
//       area: "",
//       closeBy: "",
//       resolvedBy: "",
//       category: "",
//       assignedTo: "",
//       priority: "",
//       status: "",
//       serverZone: "",
//       callSource: "",
//       reseller: "",
//       type: "",
//       role: "",
//       ticketLevel: "",
//       lcoId: "",
//       resellerId: "",
//     });
//     setPage(1);
//     loadTickets();
//   };

//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page,
//         limit,
//         ...(filters.userSearch && { userSearch: filters.userSearch }),     // ← unified search
//         ...(filters.ticketNo && { ticketNumber: filters.ticketNo }),
//         ...(filters.fromDate && { createdFrom: filters.fromDate }),
//         ...(filters.toDate && { createdTo: filters.toDate }),
//         ...(filters.area && { zoneName: filters.area }),
//         ...(filters.resolvedBy && { fixedBy: filters.resolvedBy }),
//         ...(filters.category && { category: filters.category }),
//         ...(filters.assignedTo && { assignTo: filters.assignedTo }),
//         ...(filters.callSource && { callSource: filters.callSource }),
//         ...(filters.lcoId && { lcoId: filters.lcoId }),
//         ...(filters.resellerId && { resellerId: filters.resellerId }),
//         ...(filters.status && { filter: filters.status }),
//       }).toString();

//       const res = await getAllTicketListWithFilter(queryParams);

//       console.log("Raw API Response:", res);

//       let ticketData = res?.data?.data?.allTickets || res?.data?.allTickets || res?.allTickets || [];

//       const totalCount = res?.data?.data?.totalCount || res?.data?.totalCount || res?.total || ticketData.length;

//       const cleaned = ticketData.map((t) => ({
//         _id: t._id,
//         ticketNumber: t.ticketNumber || "—",
//         personName: t.personName || "N/A",
//         category: t.category?.name || "—",
//         createdAt: t.createdAt || "",
//         callSource: t.callSource || "—",
//         assignToName: t.assignToId || "—",
//         assignedAt: t.assignedAt || t.createdAt || "—",
//         fixedBy: t.fixedBy || "—",
//         fixedAt: t.fixedAt || "—",
//         status: t.status || "Open",
//       }));

//       setTickets(cleaned);
//       setTotalPages(Math.ceil(totalCount / limit));
//     } catch (err) {
//       console.error("Error fetching tickets:", err);
//       setError("Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTickets();
//   }, [page]);

//   // Clear filters on page refresh
//   useEffect(() => {
//     const clearOnRefresh = () => {
//       handleReset();
//     };
//     window.addEventListener("beforeunload", clearOnRefresh);
//     return () => window.removeEventListener("beforeunload", clearOnRefresh);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".action-menu") && !e.target.closest(".action-toggle")) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

//   const handleMenuToggle = (id) => {
//     setMenuOpen(menuOpen === id ? null : id);
//   };

//   const handleRemove = async (id) => {
//     if (window.confirm("Are you sure you want to permanently delete this ticket?")) {
//       try {
//         const res = await deleteTicket(id);
//         if (res.status || res.success) {
//           alert("Ticket deleted successfully!");
//           loadTickets();
//         } else {
//           alert("Failed to delete: " + (res.message || "Unknown error"));
//         }
//       } catch (err) {
//         alert(err.message || "Error deleting ticket");
//       } finally {
//         setMenuOpen(null);
//       }
//     }
//   };

//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading) return <p className="text-center py-16 text-gray-500 text-lg animate-pulse">Loading tickets...</p>;
//   if (error) return <p className="text-center py-16 text-red-600 font-medium">{error}</p>;

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Tickets</h1>
//       </div>

//       <TicketFilter
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onSearch={handleSearch}
//         onReset={handleReset}
//       />

//       <div className="bg-white shadow-lg rounded-lg border overflow-hidden">
//         <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>User Name</div>
//           <div>Category</div>
//           <div className="col-span-2">Ticket Date/Time</div>
//           <div>Resolution</div>
//           <div>Call Source</div>
//           <div>Assigned To</div>
//           <div>Resolved By</div>
//           <div>Resolved Date/Time</div>
//           <div className="text-center">Status / Action</div>
//         </div>

//         {tickets.length > 0 ? (
//           tickets.map((ticket, index) => (
//             <div key={ticket._id} className="grid grid-cols-2 md:grid-cols-12 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition">
//               <div className="font-medium">{(page - 1) * limit + index + 1}</div>
//               <button onClick={() => handleViewTicket(ticket._id)} className="text-blue-600 font-semibold hover:underline truncate">{ticket.ticketNumber}</button>
//               <div className="truncate">{ticket.personName}</div>
//               <div>{ticket.category}</div>
//               <div className="text-xs col-span-2">{formatDateTime(ticket.createdAt)}</div>
//               <div className="text-gray-500">—</div>
//               <div>{ticket.callSource}</div>
//               <div>{ticket.assignToName}</div>
//               <div>{ticket.fixedBy}</div>
//               <div className="text-xs">{formatDateTime(ticket.fixedAt)}</div>
//               <div className="flex justify-between md:justify-center items-center gap-3">
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === "Closed" ? "bg-green-100 text-green-800" : ticket.status === "Fixed" ? "bg-blue-100 text-blue-800" : ticket.status === "Assigned" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>{ticket.status}</span>
//                 <div className="relative">
//                   <button onClick={(e) => { e.stopPropagation(); handleMenuToggle(ticket._id); }} className="p-2 hover:bg-gray-200 rounded-full action-toggle transition">
//                     <FaEllipsisV className="text-gray-600" />
//                   </button>
//                   {menuOpen === ticket._id && (
//                     <div className="action-menu absolute -top-8 right-0 bg-white border rounded-lg shadow-xl w-40 z-50">
//                       <ProtectedAction module="tickets" action="allTicketReomve">
//                         <button onClick={(e) => { e.stopPropagation(); handleRemove(ticket._id); }} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 text-sm transition">
//                           <FaTrash className="text-sm" /> Delete Ticket
//                         </button>
//                       </ProtectedAction>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-16 text-gray-500 text-lg">No tickets found</div>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-6 mt-8">
//           <button onClick={handlePrevPage} disabled={page === 1} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium">Previous</button>
//           <span className="text-lg font-semibold text-gray-700">Page {page} of {totalPages}</span>
//           <button onClick={handleNextPage} disabled={page === totalPages} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium">Next</button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllTicketListWithFilter, deleteTicket } from "../../service/ticket";
import { FaEllipsisV, FaTrash, FaDownload } from "react-icons/fa";
import TicketFilter from "../Ticket/TicketFilter";
import ProtectedAction from "../../components/ProtectedAction";
import { getSearchParamsVal } from "./getSearchParamsVal";

export default function AllTicket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit } = getSearchParamsVal(searchParams);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);

  // Unified search input at the top
  // const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const searchParamsVal = getSearchParamsVal(searchParams);
      const queryParamsString = new URLSearchParams(searchParamsVal).toString();

      const res = await getAllTicketListWithFilter(queryParamsString);

      const ticketData =
        res?.data?.data?.allTickets ||
        res?.data?.allTickets ||
        res?.allTickets ||
        [];

      const totalCount =
        res?.data?.data?.totalCount ||
        res?.data?.totalCount ||
        res?.total ||
        ticketData.length;

      const cleaned = ticketData.map((t) => ({
        _id: t._id,
        ticketNumber: t.ticketNumber || "—",
        personName: t.personName || "N/A",
        category: t.category || "—",
        createdAt: t.createdAt || "",
        callSource: t.callSource || "—",
        assignToName: t.assignToId || "—",
        assignedAt: t.assignedAt || t.createdAt || "—",
        fixedBy: t.fixedBy || "—",
        fixedAt: formatDateTime(t.fixedAt) || "—",
        status: t.status || "Open",
      }));

      setTickets(cleaned);
      setTotalPages(Math.ceil(totalCount / searchParamsVal.limit));
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Clear filters on page refresh
  // useEffect(() => {
  //   window.addEventListener("beforeunload", clearOnRefresh);
  //   return () => window.removeEventListener("beforeunload", clearOnRefresh);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".action-menu") &&
        !e.target.closest(".action-toggle")
      ) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

  const handleMenuToggle = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleRemove = async (id) => {
    if (
      window.confirm("Are you sure you want to permanently delete this ticket?")
    ) {
      try {
        const res = await deleteTicket(id);
        if (res.status || res.success) {
          alert("Ticket deleted successfully!");
          loadTickets();
        } else {
          alert("Failed to delete: " + (res.message || "Unknown error"));
        }
      } catch (err) {
        alert(err.message || "Error deleting ticket");
      } finally {
        setMenuOpen(null);
      }
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const sp = new URLSearchParams(searchParams);
      sp.set("page", page - 1);
      setSearchParams(sp);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const sp = new URLSearchParams(searchParams);
      sp.set("page", page + 1);
      setSearchParams(sp);
    }
  };

  // Function to download current tickets as Excel (CSV format)
  const downloadExcel = () => {
    if (tickets.length === 0) {
      alert("No tickets to download");
      return;
    }

    // Define CSV headers
    const headers = [
      "S.No",
      "Ticket No",
      "User Name",
      "Category",
      "Ticket Date/Time",
      "Call Source",
      "Assigned To",
      "Resolved By",
      "Resolved Date/Time",
      "Status",
    ];

    // Map tickets to rows
    const rows = tickets.map((ticket, index) => [
      (page - 1) * limit + index + 1,
      ticket.ticketNumber,
      ticket.personName,
      ticket.category,
      formatDateTime(ticket.createdAt),
      ticket.callSource,
      ticket.assignToName,
      ticket.fixedBy,
      formatDateTime(ticket.fixedAt),
      ticket.status,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `tickets_page_${page}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error)
    return (
      <p className="text-center py-16 text-red-600 font-medium">{error}</p>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Tickets</h1>

        {/* Quick Search + Download Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* <div className="relative flex-grow">
            <input
              type="text"
              value={quickSearch}
              onChange={handleQuickSearchChange}
              placeholder="Search by name, mobile, email, ticket no..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div> */}

          {/* <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <FaSearch /> Search
          </button> */}

          <button
            onClick={downloadExcel}
            disabled={tickets.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaDownload /> Download
          </button>
        </div>
      </div>

      <TicketFilter setSearchParams={setSearchParams} />

      {loading ? (
        <p className="text-center py-16 text-gray-500 text-lg animate-pulse">
          Loading tickets...
        </p>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-lg border overflow-hidden">
            <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
              <div>S.No</div>
              <div>Ticket No</div>
              <div>User ID (userName)</div>
              <div>Category</div>
              <div className="col-span-2">Ticket Date/Time</div>
              <div>Resolution</div>
              <div>Call Source</div>
              <div>Assigned To</div>
              <div>Resolved By</div>
              <div>Resolved Date/Time</div>
              <div className="text-center">Status / Action</div>
            </div>

            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <div
                  key={ticket._id}
                  className="grid grid-cols-2 md:grid-cols-12 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition"
                >
                  <div className="font-medium">
                    {(page - 1) * limit + index + 1}
                  </div>
                  <button
                    onClick={() => handleViewTicket(ticket._id)}
                    className="text-blue-600 font-semibold hover:underline truncate"
                  >
                    {ticket.ticketNumber}
                  </button>
                  <div className="truncate">{ticket.personName}</div>
                  <div>{ticket.category}</div>
                  <div className="text-xs col-span-2">
                    {formatDateTime(ticket.createdAt)}
                  </div>
                  <div className="text-gray-500">—</div>
                  <div>{ticket.callSource}</div>
                  <div>{ticket.assignToName}</div>
                  <div>{ticket.fixedBy}</div>
                  <div className="text-xs">{ticket.fixedAt}</div>
                  <div className="flex justify-between md:justify-center items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : ticket.status === "Fixed"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "Assigned"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuToggle(ticket._id);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full action-toggle transition"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>
                      {menuOpen === ticket._id && (
                        <div className="action-menu absolute -top-8 right-0 bg-white border rounded-lg shadow-xl w-40 z-50">
                          <ProtectedAction
                            module="tickets"
                            action="AllTicketRemove"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(ticket._id);
                              }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 text-sm transition"
                            >
                              <FaTrash className="text-sm" /> Delete Ticket
                            </button>
                          </ProtectedAction>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500 text-lg">
                No tickets found
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
              >
                Previous
              </button>
              <span className="text-lg font-semibold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
