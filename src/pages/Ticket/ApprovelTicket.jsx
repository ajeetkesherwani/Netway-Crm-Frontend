// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList, updateTicket } from "../../service/ticket";
// import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

//   // ✅ Fetch all Fixed tickets
//   useEffect(() => {
//     const loadTickets = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllTicketList(page, limit, "", "Fixed");
//         console.log("✅ Fixed Tickets API Response:", res);

//         const ticketData =
//           res?.data?.data?.fixedTickets ||
//           res?.data?.fixedTickets ||
//           res?.fixedTickets ||
//           [];

//         setTickets(ticketData);
//         setTotalPages(res?.totalPages || 1);
//       } catch (err) {
//         console.error("❌ Error fetching Fixed tickets:", err);
//         setError("Failed to load Fixed tickets.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTickets();
//   }, [page]);

//   // ✅ Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Approve Ticket (Update status → Closed)
//   const handleApprove = async (id) => {
//     try {
//       const formData = new FormData();
//       formData.append("status", "Closed");

//       await updateTicket(id, formData);
//       alert("✅ Ticket approved successfully (status updated to Closed).");

//       setTickets((prev) =>
//         prev.map((t) => (t._id === id ? { ...t, status: "Closed" } : t))
//       );
//       setOpenMenuId(null);
//     } catch (err) {
//       console.error("❌ Error approving ticket:", err);
//       alert("Failed to approve ticket.");
//     }
//   };

//   // ✅ Disapprove Ticket (placeholder)
//   const handleDisapprove = (id) => {
//     alert(`❌ Disapprove clicked for Ticket ID: ${id}`);
//     setOpenMenuId(null);
//   };

//   // ✅ Navigate to Ticket View
//   const handleTicketClick = (id) => {
//     navigate(`/ticket/view/${id}`);
//   };

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
//         <div className="hidden md:grid grid-cols-8 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>Name</div>
//           <div>Phone</div>
//           <div>Email</div>
//           <div>Severity</div>
//           <div>Created</div>
//           <div className="text-center">Status / Actions</div>
//         </div>

//         {tickets.length > 0 ? (
//           tickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
//             >
//               {/* ✅ S.No */}
//               <div>{(page - 1) * limit + index + 1}</div>

//               {/* ✅ Ticket number clickable */}
//               <div
//                 onClick={() => handleTicketClick(ticket._id)}
//                 className="text-blue-600 font-medium truncate cursor-pointer hover:underline"
//               >
//                 {ticket._id?.slice(-6)}
//               </div>

//               <div>{ticket.personName || "—"}</div>
//               <div>{ticket.personNumber || "—"}</div>
//               <div>{ticket.email || "—"}</div>
//               <div>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold ${
//                     ticket.severity === "High"
//                       ? "bg-red-100 text-red-700"
//                       : ticket.severity === "Medium"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-green-100 text-green-700"
//                   }`}
//                 >
//                   {ticket.severity || "—"}
//                 </span>
//               </div>
//               <div>
//                 {ticket.createdAt
//                   ? new Date(ticket.createdAt).toLocaleDateString()
//                   : "—"}
//               </div>

//               {/* ✅ Status + Action */}
//               <div className="flex justify-center relative" ref={menuRef}>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${
//                     ticket.status === "Fixed"
//                       ? "bg-yellow-200 text-yellow-800"
//                       : ticket.status === "Closed"
//                       ? "bg-green-200 text-green-800"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
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
//                     <button
//                       onClick={() => handleApprove(ticket._id)}
//                       className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
//                     >
//                       <FaCheckCircle className="text-green-500" /> Approve
//                     </button>
//                     <button
//                       onClick={() => handleDisapprove(ticket._id)}
//                       className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
//                     >
//                       <FaTimesCircle className="text-red-500" /> Disapprove
//                     </button>
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

export default function ApprovalTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const limit = 10;

  // ✅ Fetch Fixed tickets for approval
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

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Approve Ticket → Move to Closed
  const handleApprove = async (id) => {
    try {
      await updateTicket(id, { status: "Closed" });
      toast.success("✅ Ticket approved successfully (moved to Closed).");

      // remove from current list
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("❌ Error approving ticket:", err);
      toast.error("Failed to approve ticket.");
    }
  };

  // ✅ Disapprove Ticket → Move to Assigned
  const handleDisapprove = async (id) => {
    try {
      await updateTicket(id, { status: "Assigned" });
      toast.success("❌ Ticket disapproved (moved to Assigned).");

      // remove from current list
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("❌ Error disapproving ticket:", err);
      toast.error("Failed to disapprove ticket.");
    }
  };

  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

  // ✅ Pagination
  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  // ✅ Loading & Error UI
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          🎫 Approval Tickets (Fixed)
        </h1>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-8 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div>S.No</div>
          <div>Ticket No</div>
          <div>Name</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Severity</div>
          <div>Created</div>
          <div className="text-center">Status / Actions</div>
        </div>

        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
            >
              {/* S.No */}
              <div>{(page - 1) * limit + index + 1}</div>

              {/* Ticket No */}
              <div
                onClick={() => handleTicketClick(ticket._id)}
                className="text-blue-600 font-medium truncate cursor-pointer hover:underline"
              >
                {ticket._id?.slice(-6)}
              </div>

              <div>{ticket.personName || "—"}</div>
              <div>{ticket.personNumber || "—"}</div>
              <div>{ticket.email || "—"}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    ticket.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : ticket.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.severity || "—"}
                </span>
              </div>
              <div>
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : "—"}
              </div>

              {/* Status + Actions */}
              <div className="flex justify-center relative" ref={menuRef}>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${
                    ticket.status === "Fixed"
                      ? "bg-yellow-200 text-yellow-800"
                      : ticket.status === "Closed"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {ticket.status}
                </span>

                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)
                  }
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FaEllipsisV />
                </button>

                {openMenuId === ticket._id && (
                  <div className="absolute right-0 mt-8 w-44 bg-white border rounded-lg shadow-lg z-30">
                    <button
                      onClick={() => handleApprove(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
                    >
                      <FaCheckCircle className="text-green-500" /> Approve
                    </button>
                    <button
                      onClick={() => handleDisapprove(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
                    >
                      <FaTimesCircle className="text-red-500" /> Disapprove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No Fixed tickets found
          </div>
        )}
      </div>

      {/* ✅ Pagination */}
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
