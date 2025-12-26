// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList, deleteTicket } from "../../service/ticket"; // ✅ added deleteTicket import
// import {
//   FaTrash,
//   FaClipboardList,
//   FaCheckCircle,
//   FaEllipsisV,
// } from "react-icons/fa";

// export default function ClosedTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 10;
//   const navigate = useNavigate();

//   // ✅ Fetch Closed Tickets
//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllTicketList(page, limit, "", "Closed");
//       console.log("✅ API Response:", res);

//       const ticketData =
//         res?.data?.data?.closedTickets ||
//         res?.data?.closedTickets ||
//         res?.closedTickets ||
//         [];

//       const cleaned = ticketData.map((t) => ({
//         _id: t._id,
//           ticketNumber: t.ticketNumber,
//         personName: t.personName || "N/A",
//         email: t.email || "N/A",
//         personNumber: t.personNumber || "N/A",
//         status: t.status || "Closed",
//         severity: t.severity || "Low",
//         createdAt: t.createdAt || "",
//       }));

//       setTickets(cleaned);
//       setTotalPages(Math.ceil(cleaned.length / limit));
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

//   // ✅ Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         !e.target.closest(".action-menu") &&
//         !e.target.closest(".action-toggle")
//       ) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // ✅ Action handlers
//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);
//   const handleMenuToggle = (id) => setMenuOpen(menuOpen === id ? null : id);

//   // ✅ Fully working DELETE function
//   const handleRemove = async (id) => {
//     if (window.confirm("Are you sure you want to delete this ticket?")) {
//       try {
//         console.log("🗑 Deleting ticket:", id);
//         const res = await deleteTicket(id);
//         console.log("✅ Delete Response:", res);

//         if (res.status || res.success) {
//           alert("✅ Ticket deleted successfully!");
//           await loadTickets(); // refresh list
//         } else {
//           alert("❌ Failed to delete: " + (res.message || "Unknown error"));
//         }
//       } catch (err) {
//         console.error("❌ Error deleting ticket:", err);
//         alert(err.message || "Error deleting ticket");
//       } finally {
//         setMenuOpen(null);
//       }
//     }
//   };

//   // ✅ Pagination
//   const handlePrevPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

//   // ✅ Loading & Error
//   if (loading)
//     return (
//       <p className="text-center py-10 text-gray-500 animate-pulse">
//         Loading closed tickets...
//       </p>
//     );

//   if (error)
//     return (
//       <p className="text-center py-10 text-red-500 font-medium">{error}</p>
//     );

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen transition-all duration-300">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           🗂️ Closed Tickets
//         </h1>
//       </div>

//       {/* ✅ Table */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
//         <div className="hidden md:grid grid-cols-8 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>Name</div>
//           <div>Email</div>
//           <div>Phone</div>
//           <div>Severity</div>
//           <div>Created At</div>
//           <div className="text-center">Status / Action</div>
//         </div>

//         {tickets.length > 0 ? (
//           tickets
//             .slice((page - 1) * limit, page * limit)
//             .map((ticket, index) => (
//               <div
//                 key={ticket._id}
//                 className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
//               >
//                 <div>{(page - 1) * limit + index + 1}</div>

//                 {/* ✅ Ticket number clickable */}
//                 <button
//                   onClick={() => handleViewTicket(ticket._id)}
//                   className="text-green-600 font-medium hover:underline text-left truncate"
//                 >
//                   {/* {ticket._id?.slice(-6)} */}
//                     {ticket.ticketNumber || "—"}
//                 </button>

//                 <div>{ticket.personName}</div>
//                 <div className="truncate">{ticket.email}</div>
//                 <div>{ticket.personNumber}</div>

//                 <div>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-semibold ${
//                       ticket.severity === "High"
//                         ? "bg-red-100 text-red-700"
//                         : ticket.severity === "Medium"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-green-100 text-green-700"
//                     }`}
//                   >
//                     {ticket.severity}
//                   </span>
//                 </div>

//                 <div>
//                   {ticket.createdAt
//                     ? new Date(ticket.createdAt).toLocaleDateString()
//                     : "—"}
//                 </div>

//                 {/* ✅ Status + Action Menu */}
//                 <div className="flex justify-between md:justify-center items-center gap-2 relative">
//                   <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-700">
//                     {ticket.status}
//                   </span>

//                   <button
//                     onClick={() => handleMenuToggle(ticket._id)}
//                     className="p-2 hover:bg-gray-100 rounded-full action-toggle"
//                     title="Actions"
//                   >
//                     <FaEllipsisV />
//                   </button>

//                   {menuOpen === ticket._id && (
//                     <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-lg w-32 z-30 text-sm action-menu">

//                       <button
//                         onClick={() => handleRemove(ticket._id)} // ✅ DELETE connected
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
//                       >
//                         <FaTrash /> Remove
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//         ) : (
//           <div className="text-center py-8 text-gray-500 font-medium">
//             No closed tickets found
//           </div>
//         )}
//       </div>

//       {/* ✅ Pagination */}
//       <div className="flex justify-center items-center gap-4 mt-6">
//         <button
//           onClick={handlePrevPage}
//           disabled={page === 1}
//           className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50 transition duration-200"
//         >
//           Prev
//         </button>
//         <span className="font-medium text-gray-700">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50 transition duration-200"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEllipsisV, FaTrash } from "react-icons/fa";
import { deleteTicket, getAllTicketListWithFilter } from "../../service/ticket";
import { getSearchParamsVal } from "./getSearchParamsVal";
import TicketFilter from "./TicketFilter";

export default function ClosedTicket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit } = getSearchParamsVal(searchParams);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Format date/time
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

  // Fetch Closed Tickets
  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const searchParamsVal = getSearchParamsVal(searchParams);
      const queryParams = new URLSearchParams(searchParamsVal);
      queryParams.set("filter", "Closed");
      const res = await getAllTicketListWithFilter(queryParams.toString());

      const ticketData =
        res?.data?.data?.closedTickets ||
        res?.data?.closedTickets ||
        res?.closedTickets ||
        [];

      const cleaned = ticketData.map((t) => ({
        _id: t._id,
        ticketNumber: t.ticketNumber || "—",
        personName: t.personName || "N/A",
        category: t.category || "—",
        createdAt: t.createdAt || "",
        callSource: t.callSource || "—",
        assignToName: t.assignToId?.staffName || "—",
        assignedAt: t.assignedAt || "—",
        fixedBy: t.fixedBy || "—",
        fixedAt: t.fixedAt || "—",
        status: t.status || "Closed",
      }));

      setTickets(cleaned);
      setTotalPages(Math.ceil(cleaned.length / searchParams.limit));
    } catch (err) {
      console.error("Error fetching closed tickets:", err);
      setError("Failed to load closed tickets");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Close menu when clicking outside
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
          loadTickets(); // Refresh list
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

  if (error) {
    return (
      <p className="text-center py-16 text-red-600 font-medium">{error}</p>
    );
  }

  const paginatedTickets = tickets.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Closed Tickets</h1>
      </div>

      <TicketFilter setSearchParams={setSearchParams} />

      {loading ? (
        <p className="text-center py-16 text-gray-500 text-lg animate-pulse">
          Loading closed tickets...
        </p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white shadow-lg rounded-lg border overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-11 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
              <div>S.No</div>
              <div>Ticket No</div>
              <div>User ID</div>
              <div>Category</div>
              <div>Ticket Date/Time</div>
              <div>Resolution</div>
              <div>Call Source</div>
              <div>Assigned Date/Time</div>
              <div>Resolved By</div>
              <div>Resolved Date/Time</div>
              <div className="text-center">Status / Action</div>
            </div>

            {/* Rows */}
            {paginatedTickets.length > 0 ? (
              paginatedTickets.map((ticket, index) => (
                <div
                  key={ticket._id}
                  className="grid grid-cols-2 md:grid-cols-11 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition"
                >
                  {/* S.No */}
                  <div className="font-medium">
                    {(page - 1) * limit + index + 1}
                  </div>

                  {/* Ticket No - Clickable */}
                  <button
                    onClick={() => handleViewTicket(ticket._id)}
                    className="text-blue-600 font-semibold hover:underline truncate"
                  >
                    {ticket.ticketNumber}
                  </button>

                  {/* User ID */}
                  <div className="truncate">{ticket.personName}</div>

                  {/* Category */}
                  <div>{ticket.category}</div>

                  {/* Ticket Date/Time */}
                  <div className="text-xs">
                    {formatDateTime(ticket.createdAt)}
                  </div>

                  {/* Resolution */}
                  <div className="text-gray-500">—</div>

                  {/* Call Source */}
                  <div>{ticket.callSource}</div>

                  {/* Assigned*/}
                  {/* <div className="text-gray-500">{ticket.assignToId.staffName}</div> */}

                  {/* Assigned Date/Time */}
                  <div className="text-gray-500">—</div>

                  {/* Resolved By */}
                  <div>{ticket.fixedBy}</div>

                  {/* Resolved Date/Time */}
                  <div className="text-xs">
                    {ticket.fixedAt ? formatDateTime(ticket.fixedAt) : "—"}
                  </div>

                  {/* Status + Action */}
                  <div className="flex justify-between md:justify-center items-center gap-3">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                      {ticket.status}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() => handleMenuToggle(ticket._id)}
                        className="p-2 hover:bg-gray-200 rounded-full action-toggle transition"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>

                      {menuOpen === ticket._id && (
                        <div className="absolute -top-8 right-0 bg-white border rounded-lg shadow-xl w-36 z-50 action-menu">
                          <button
                            onClick={() => handleRemove(ticket._id)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 text-sm transition"
                          >
                            <FaTrash className="text-sm" />
                            Delete Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500 text-lg">
                No closed tickets found
              </div>
            )}
          </div>
          {/* Pagination - Only show if more than 1 page */}
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
