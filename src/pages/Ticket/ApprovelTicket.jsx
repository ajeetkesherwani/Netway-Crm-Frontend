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


import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketList, updateTicket } from "../../service/ticket";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ProtectedAction from "../../components/ProtectedAction";

export default function ApprovalTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Single ref for all dropdowns (click outside handler)
  const menuRef = useRef(null);
  
  const navigate = useNavigate();
  const limit = 10;

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await getAllTicketList(page, limit, "", "Fixed");
      const ticketData =
        res?.data?.data?.fixedTickets ||
        res?.data?.fixedTickets ||
        res?.fixedTickets ||
        [];

      setTickets(ticketData);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching Fixed tickets:", err);
      setError("Failed to load Fixed tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateTicket(id, { status: "Closed" });
      toast.success("✅ Ticket approved successfully (moved to Closed).");
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("❌ Error approving ticket:", err);
      toast.error("Failed to approve ticket.");
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await updateTicket(id, { status: "Assigned" });
      toast.success("❌ Ticket disapproved (moved to Assigned).");
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("❌ Error disapproving ticket:", err);
      toast.error("Failed to disapprove ticket.");
    }
  };

  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Loading Fixed Tickets...
      </p>
    );
  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          🎫 Approval Tickets (Fixed)
        </h1>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div className="col-span-1">S No</div>
          <div className="col-span-1">Ticket No</div>
          <div className="col-span-1">User ID</div>
          {/* <div className="col-span-1">Category</div> */}
          <div className="col-span-2">Ticket Date/Time</div>
          <div className="col-span-1">Resolution</div>
          <div className="col-span-1">Call Source</div>
          <div className="col-span-1">Assigned</div>
          <div className="col-span-1">Resolved By</div>
          <div className="col-span-1">Resolved Date/Time</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="grid grid-cols-2 md:grid-cols-12 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-4 transition duration-200 relative"
            >
              {/* S No */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">S No: </span>
                {(page - 1) * limit + index + 1}
              </div>

              {/* Ticket No */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Ticket No: </span>
                <span
                  // onClick={() => handleTicketClick(ticket.ticketNumber)}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  {ticket.ticketNumber}
                  {/* {ticket._id?.slice(-6)} */}
                </span>
              </div>

              {/* User ID */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">User ID: </span>
                {ticket.userId || ticket.personName || "—"}
              </div>

              {/* Category */}
              {/* <div className="md:col-span-1">
                <span className="md:hidden font-medium">Category: </span>
                {ticket.category || "—"}
              </div> */}

              {/* Ticket Date/Time */}
              <div className="md:col-span-2">
                <span className="md:hidden font-medium">Ticket Date/Time: </span>
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : "—"}
              </div>

              {/* Resolution */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Resolution: </span>
                {(ticket.resolution || ticket.description || "—")
                  .toString()
                  .slice(0, 30)}
                {(ticket.resolution || ticket.description)?.length > 30
                  ? "..."
                  : ""}
              </div>

              {/* Call Source */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Call Source: </span>
                {ticket.callSource || "—"}
              </div>

              {/* Assigned Date/Time */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Assigned </span>
                { ticket.assignedTo?.name || "—"}
              </div>

              {/* Resolved By */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Resolved By: </span>
                {ticket.fixedBy || ticket.fixedBy?.name || "—"}
              </div>

              {/* Resolved Date/Time */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Resolved Date/Time: </span>
                { ticket.fixedAt || "—"}
              </div>

              {/* Status */}
              <div className="md:col-span-1">
                <span className="md:hidden font-medium">Status: </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    ticket.status === "Fixed"
                      ? "bg-yellow-200 text-yellow-800"
                      : ticket.status === "Closed"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* Action - Fixed positioning */}
              <div className="md:col-span-1 relative">
                <span className="md:hidden font-medium block mb-1">Action: </span>
                <div ref={menuRef} className="relative inline-block">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)
                    }
                    className="p-2 rounded-full hover:bg-gray-200 transition mx-auto block"
                  >
                    <FaEllipsisV />
                  </button>

                  {/* Dropdown Menu - Properly positioned */}
                  {openMenuId === ticket._id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                      <ProtectedAction module="tickets" action="approvalTicketApprove">
                        <button
                          onClick={() => handleApprove(ticket._id)}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
                        >
                          <FaCheckCircle className="text-green-500" /> Approve
                        </button>
                      </ProtectedAction>
                      <ProtectedAction module="tickets" action="approvalTicketDisapprove">
                        <button
                          onClick={() => handleDisapprove(ticket._id)}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
                        >
                          <FaTimesCircle className="text-red-500" /> Disapprove
                        </button>
                      </ProtectedAction>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No Fixed tickets found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50 transition duration-200"
        >
          Prev
        </button>
        <span className="font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}