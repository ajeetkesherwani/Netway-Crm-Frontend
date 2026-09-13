// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList, updateTicket } from "../../service/ticket";
// import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { toast } from "react-hot-toast";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function ApprovalTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const menuRef = useRef(null);
//   const navigate = useNavigate();

//   const limit = 10;

//   // ✅ Fetch Fixed tickets for approval
//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllTicketList(page, limit, "", "Fixed");
//       const ticketData =
//         res?.data?.data?.fixedTickets ||
//         res?.data?.fixedTickets ||
//         res?.fixedTickets ||
//         [];

//       setTickets(ticketData);
//       setTotalPages(res?.totalPages || 1);
//     } catch (err) {
//       console.error("❌ Error fetching Fixed tickets:", err);
//       setError("Failed to load Fixed tickets.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTickets();
//   }, [page]);

//   // ✅ Close dropdown when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Approve Ticket → Move to Closed
//   const handleApprove = async (id) => {
//     try {
//       await updateTicket(id, { status: "Closed" });
//       toast.success("✅ Ticket approved successfully (moved to Closed).");

//       // remove from current list
//       setTickets((prev) => prev.filter((t) => t._id !== id));
//       setOpenMenuId(null);
//     } catch (err) {
//       console.error("❌ Error approving ticket:", err);
//       toast.error("Failed to approve ticket.");
//     }
//   };

//   // ✅ Disapprove Ticket → Move to Assigned
//   const handleDisapprove = async (id) => {
//     try {
//       await updateTicket(id, { status: "Assigned" });
//       toast.success("❌ Ticket disapproved (moved to Assigned).");

//       // remove from current list
//       setTickets((prev) => prev.filter((t) => t._id !== id));
//       setOpenMenuId(null);
//     } catch (err) {
//       console.error("❌ Error disapproving ticket:", err);
//       toast.error("Failed to disapprove ticket.");
//     }
//   };

//   const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

//   // ✅ Pagination
//   const handlePrevPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

//   // ✅ Loading & Error UI
//   if (loading)
//     return (
//       <p className="text-center py-10 text-gray-500 animate-pulse">
//         Loading Fixed Tickets...
//       </p>
//     );
//   if (error)
//     return (
//       <p className="text-center py-10 text-red-500 font-medium">{error}</p>
//     );

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">
//           🎫 Approval Tickets (Fixed)
//         </h1>
//       </div>

//       {/* ✅ Table */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
//         {/* Table Header */}
//         <div className="hidden md:grid grid-cols-9 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
//           <div>S No</div>
//           <div>Ticket No</div>
//           <div>Category</div>
//           {/* <div>Name</div>
//           <div>Phone</div>
//           <div>Email</div>
//           <div>Severity</div> */}
//           <div>Ticket Date/Time</div>
//           <div>Call Source</div>
//           <div>Assigned Date/Time</div>
//           <div>Resolve By</div>
//           <div>Resolve Date/Time</div>
//           <div>Status</div>
//           <div>Actions</div>
//         </div>

//         {tickets.length > 0 ? (
//           tickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-9 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
//             >
//               {/* S.No */}
//               <div>{(page - 1) * limit + index + 1}</div>

//               {/* Ticket No */}
//               <div
//                 onClick={() => handleTicketClick(ticket._id)}
//                 className="text-blue-600 font-medium truncate cursor-pointer hover:underline"
//               >
//                 {ticket._id?.slice(-6)}
//               </div>
//               <div>--</div>
//               <div>{ticket.personName || "—"}</div>
//               <div>{ticket.personNumber || "—"}</div>
//               <div>{ticket.email || "—"}</div>
//               <div>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold ${ticket.severity === "High"
//                       ? "bg-red-100 text-red-700"
//                       : ticket.severity === "Medium"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-green-100 text-green-700"
//                     }`}
//                 >
//                   {ticket.severity || "—"}
//                 </span>
//               </div>
//               <div>
//                 {ticket.createdAt
//                   ? new Date(ticket.createdAt).toLocaleDateString()
//                   : "—"}
//               </div>

//               {/* Status + Actions */}
//               <div className="flex justify-center relative" ref={menuRef}>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${ticket.status === "Fixed"
//                       ? "bg-yellow-200 text-yellow-800"
//                       : ticket.status === "Closed"
//                         ? "bg-green-200 text-green-800"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                 >
//                   {ticket.status}
//                 </span>

//                 <button
//                   onClick={() =>
//                     setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)
//                   }
//                   className="p-2 rounded-full hover:bg-gray-200 transition"
//                 >
//                   <FaEllipsisV />
//                 </button>

//                 {openMenuId === ticket._id && (
//                   <div className="absolute right-0 mt-8 w-44 bg-white border rounded-lg shadow-lg z-30">
//                     <ProtectedAction module="tickets" action="approvalTicketApprove">
//                       <button
//                         onClick={() => handleApprove(ticket._id)}
//                         className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
//                       >
//                         <FaCheckCircle className="text-green-500" /> Approve
//                       </button>
//                     </ProtectedAction>
//                     <ProtectedAction module="tickets" action="approvalTicketDisapprove">
//                       <button
//                         onClick={() => handleDisapprove(ticket._id)}
//                         className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
//                       >
//                         <FaTimesCircle className="text-red-500" /> Disapprove
//                     </button>
//                     </ProtectedAction>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500 font-medium">
//             No Fixed tickets found
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

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllTicketListWithFilter, updateTicket } from "../../service/ticket";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ProtectedAction from "../../components/ProtectedAction";
import { getSearchParamsVal } from "./getSearchParamsVal";
import TicketFilter from "./TicketFilter";

export default function ApprovalTicket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit } = getSearchParamsVal(searchParams);
  const [tickets, setTickets] = useState([]);
  const [rawTickets, setRawTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();
  const menuRefs = useRef({});

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-IN", {
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
      const queryParams = new URLSearchParams(searchParamsVal);
      queryParams.set("filter", "Fixed");
      const res = await getAllTicketListWithFilter(queryParams.toString());

      const ticketData =
        res?.data?.data?.fixedTickets ||
        res?.data?.fixedTickets ||
        res?.fixedTickets ||
        [];
      
      setRawTickets(ticketData);

      const totalCount =
        res?.data?.data?.totalCount ||
        res?.data?.totalCount ||
        ticketData.length;

      const cleaned = ticketData.map((t) => ({
        _id: t._id,
        ticketNumber: t.ticketNumber || "—",
        personName: t.personName || "N/A",
        category: t.category?.name || "—",
        createdAt: t.createdAt || "",
        callSource: t.callSource || "—",
        assignToName:
          t.assignToId?.staffName ||
          t.assignToId?.resellerName ||
          t.assignToId?.lcoName ||
          t.assignToId?.name ||
          "—",
        fixedBy:
          typeof t.fixedBy === "object" && t.fixedBy !== null
            ? t.fixedBy.staffName ||
              t.fixedBy.resellerName ||
              t.fixedBy.lcoName ||
              t.fixedBy.name ||
              t.fixedBy._id ||
              "—"
            : t.fixedBy || "—",
        fixedAt: t.fixedAt || "—",
        status: t.status || "Fixed",
      }));

      setTickets(cleaned);
      setTotalPages(Math.ceil(totalCount / searchParamsVal.limit));
    } catch (err) {
      console.error("Error fetching Fixed tickets:", err);
      setError("Failed to load Fixed tickets.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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

  const handleApprove = async (id) => {
    try {
      await updateTicket(id, { status: "Closed" });
      toast.success("Ticket approved and moved to Closed.");
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error("Failed to approve ticket.");
    } finally {
      setMenuOpen(null);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await updateTicket(id, { status: "Assigned" });
      toast.success("Ticket disapproved and sent back to Assigned.");
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error("Failed to disapprove ticket.");
    } finally {
      setMenuOpen(null);
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

  const handleDownloadExcel = async () => {
    if (!rawTickets || rawTickets.length === 0) {
      alert("No tickets to download");
      return;
    }

    const formatDateForExcel = (dateString) => {
      if (!dateString) return dateString;
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      return `${day}-${month}-${year} ${strTime}`;
    };

    try {
      const { utils, writeFile } = await import("xlsx");
      const exportData = rawTickets.map(({ _id, ...rest }) => {
        const dateFields = ["createdAt", "updatedAt", "fixedAt", "assignedAt"];
        dateFields.forEach(field => {
          if (rest[field]) {
            rest[field] = formatDateForExcel(rest[field]);
          }
        });
        return rest;
      });
      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Tickets");
      writeFile(wb, `ApprovalTickets_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) {
      console.error("Error downloading excel", err);
      alert("Error downloading excel");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Approval Tickets (Fixed)
        </h1>
        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>

      <TicketFilter setSearchParams={setSearchParams} />

      {loading ? (
        <p className="text-center py-16 text-gray-500 text-lg animate-pulse">
          Loading Approval Tickets (Fixed)...
        </p>
      ) : (
        <>
          <div className="bg-white-500 shadow-lg rounded-lg border relative z-1">
            {/* Header */}
            <div className="hidden md:grid grid-cols-11 bg-gradient-to-r from-blue-50 to-blue-100 border-b font-semibold text-sm text-gray-800 py-4 px-6 gap-4">
              <div>S.No</div>
              <div>Ticket No</div>
              <div>User ID</div>
              <div>Category</div>
              <div>Ticket Date/Time</div>
              <div>Resolution</div>
              <div>Call Source</div>
              <div>Assigned To</div>
              <div>Resolved By</div>
              <div>Resolved Date/Time</div>
              <div className="text-center">Status / Action</div>
            </div>

            {/* Rows */}
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <div
                  key={ticket._id}
                  className="grid grid-cols-2 md:grid-cols-11 items-center text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 px-4 md:px-6 py-4 gap-4 transition relative"
                >
                  {/* S.No */}
                  <div className="font-medium">
                    {(page - 1) * limit + index + 1}
                  </div>

                  {/* Ticket No */}
                  <button
                    onClick={() => handleViewTicket(ticket._id)}
                    className="text-blue-600 font-semibold hover:underline truncate"
                  >
                    {ticket.ticketNumber}
                  </button>

                  {/* User Name */}
                  <div className="truncate">{ticket.personName}</div>

                  {/* Category */}
                  <div>{ticket.category}</div>

                  {/* Ticket Date */}
                  <div className="text-xs">
                    {formatDateTime(ticket.createdAt)}
                  </div>

                  {/* Resolution */}
                  <div className="text-gray-500">—</div>

                  {/* Call Source */}
                  <div>{ticket.callSource}</div>

                  {/* Assigned To */}
                  <div>{ticket.assignToName}</div>

                  {/* Resolved By */}
                  <div>{ticket.fixedBy}</div>

                  {/* Resolved Date */}
                  <div className="text-xs">
                    {formatDateTime(ticket.fixedAt)}
                  </div>

                  {/* Status + Action */}
                  <div className="flex justify-between md:justify-center items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Fixed
                    </span>

                    <div className="relative">
                      <button
                        ref={(el) => (menuRefs.current[ticket._id] = el)}
                        onClick={() => handleMenuToggle(ticket._id)}
                        className="p-2 hover:bg-gray-200 rounded-full action-toggle transition"
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>

                      {menuOpen === ticket._id && (
                        <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-xl w-56 z-50 action-menu">
                          <ProtectedAction
                            module="tickets"
                            action="ApprovalTicketApprove"
                          >
                            <button
                              onClick={() => handleApprove(ticket._id)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 w-full text-left text-green-700 text-sm transition"
                            >
                              <FaCheckCircle />
                              Approve (Close Ticket)
                            </button>
                          </ProtectedAction>

                          <ProtectedAction
                            module="tickets"
                            action="ApprovalTicketDisapprove"
                          >
                            <button
                              onClick={() => handleDisapprove(ticket._id)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-700 text-sm transition"
                            >
                              <FaTimesCircle />
                              Disapprove (Reopen)
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
                No Fixed tickets pending approval
              </div>
            )}
          </div>
          {/* Pagination */}
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
