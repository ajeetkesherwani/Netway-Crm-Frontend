// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList } from "../../service/ticket";
// import { FaEllipsisV, FaTrash, FaHistory, FaCheckCircle } from "react-icons/fa";

// export default function AllTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const menuRef = useRef(null); // for outside click
//   const limit = 10;

//   const navigate = useNavigate();

//   // ✅ Fetch all tickets
//   useEffect(() => {
//     const loadTickets = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllTicketList(page, limit, "");
//         console.log("✅ API Response:", res);

//         const ticketData =
//           res?.data?.data?.allTickets ||
//           res?.data?.allTickets ||
//           res?.allTickets ||
//           [];

//         const cleanedTickets = ticketData.map((t) => ({
//           _id: t._id,
//           personName: t.personName || "N/A",
//           email: t.email || "N/A",
//           personNumber: t.personNumber || "N/A",
//           status: t.status || "N/A",
//           severity: t.severity || "N/A",
//           createdAt: t.createdAt || "",
//         }));

//         setTickets(cleanedTickets);
//         setFilteredTickets(cleanedTickets);
//         setTotalPages(res?.totalPages || 1);
//       } catch (err) {
//         console.error("❌ Error fetching tickets:", err);
//         setError("Failed to load tickets.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTickets();
//   }, [page]);

//   // ✅ Handle search input
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (!value.trim()) {
//       setSuggestions([]);
//       setFilteredTickets(tickets);
//       return;
//     }

//     const matched = tickets
//       .filter((t) =>
//         t.personName.toLowerCase().includes(value.trim().toLowerCase())
//       )
//       .map((t) => ({ id: t._id, name: t.personName }))
//       .slice(0, 5);

//     setSuggestions(matched);
//   };

//   const handleSuggestionClick = (id, name) => {
//     setSearchTerm(name);
//     setSuggestions([]);
//     navigate(`/user/details/${id}`);
//   };

//   // ✅ Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Action Handlers
//   const handleRemoveTicket = async (id) => {
//     if (window.confirm("Are you sure you want to remove this ticket?")) {
//       try {
//         console.log("🗑 Calling remove ticket API for:", id);
//         // await removeTicketAPI(id);
//         alert("Ticket removed successfully!");
//       } catch (err) {
//         console.error("❌ Error removing ticket:", err);
//       } finally {
//         setOpenMenuId(null);
//       }
//     }
//   };

//   const handleViewHistory = async (id) => {
//     console.log("📜 Fetching history for ticket:", id);
//     navigate(`/ticket/history/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleViewResolution = async (id) => {
//     console.log("🧩 Fetching resolution for ticket:", id);
//     navigate(`/ticket/resolution/${id}`);
//     setOpenMenuId(null);
//   };

//   // ✅ Navigate to ticket view when clicking ticket number
//   const handleTicketClick = (id) => {
//     navigate(`/ticket/view/${id}`);
//   };

//   // ✅ Pagination
//   const handlePrevPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

//   // ✅ Loading & Error
//   if (loading)
//     return (
//       <p className="text-center py-10 text-gray-500 animate-pulse">
//         Loading tickets...
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
//         <h1 className="text-2xl font-bold text-gray-800">🎫 All Tickets</h1>

//         {/* Search Section */}
//         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto relative">
//           <div className="relative w-full md:w-72">
//             <input
//               type="text"
//               placeholder="Search user by name..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="w-full border rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
//             />
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//               🔍
//             </span>

//             {suggestions.length > 0 && (
//               <ul className="absolute bg-white border border-gray-200 rounded-lg mt-1 w-full shadow-md z-20 max-h-56 overflow-y-auto transition-all">
//                 {suggestions.map((user) => (
//                   <li
//                     key={user.id}
//                     onClick={() => handleSuggestionClick(user.id, user.name)}
//                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
//                   >
//                     {user.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Table */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
//         <div className="hidden md:grid grid-cols-7 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>Name</div>
//           <div>Phone</div>
//           <div>Status</div>
//           <div>Created</div>
//           <div className="text-center">Actions</div>
//         </div>

//         {filteredTickets.length > 0 ? (
//           filteredTickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-7 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
//             >
//               <div>{(page - 1) * limit + index + 1}</div>

//               {/* ✅ Ticket number is clickable now */}
//               <div
//                 onClick={() => handleTicketClick(ticket._id)}
//                 className="text-blue-600 font-medium truncate cursor-pointer hover:underline"
//               >
//                 {ticket._id?.slice(-6)}
//               </div>

//               <div>{ticket.personName}</div>
//               <div>{ticket.personNumber}</div>
//               <div>{ticket.status}</div>
//               <div>
//                 {ticket.createdAt
//                   ? new Date(ticket.createdAt).toLocaleDateString()
//                   : "—"}
//               </div>

//               {/* ✅ Three-dot Action Menu */}
//               <div className="flex justify-center relative" ref={menuRef}>
//                 <button
//                   onClick={() =>
//                     setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)
//                   }
//                   className="p-2 rounded-full hover:bg-gray-200 transition"
//                 >
//                   <FaEllipsisV />
//                 </button>

//                 {openMenuId === ticket._id && (
//                   <div className="absolute right-0 mt-8 w-48 bg-white border rounded-lg shadow-lg z-30">
//                     <button
//                       onClick={() => handleRemoveTicket(ticket._id)}
//                       className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
//                     >
//                       <FaTrash className="text-red-500" /> Remove
//                     </button>
//                     <button
//                       onClick={() => handleViewHistory(ticket._id)}
//                       className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-50 text-gray-700"
//                     >
//                       <FaHistory className="text-blue-500" /> Ticket History
//                     </button>
//                     <button
//                       onClick={() => handleViewResolution(ticket._id)}
//                       className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
//                     >
//                       <FaCheckCircle className="text-green-500" /> Resolution
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500 font-medium">
//             No tickets found
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
import { getAllTicketList } from "../../service/ticket";
import { FaEllipsisV, FaTrash, FaHistory, FaCheckCircle } from "react-icons/fa";

export default function AllTicket() {
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch all tickets
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await getAllTicketList(page, limit, "");
        console.log("✅ API Response:", res);

        const ticketData =
          res?.data?.data?.allTickets ||
          res?.data?.allTickets ||
          res?.allTickets ||
          [];

        const cleanedTickets = ticketData.map((t) => ({
          _id: t._id,
          personName: t.personName || "N/A",
          email: t.email || "N/A",
          personNumber: t.personNumber || "N/A",
          status: t.status || "N/A",
          severity: t.severity || "N/A",
          createdAt: t.createdAt || "",
        }));

        setFilteredTickets(cleanedTickets);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error("❌ Error fetching tickets:", err);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [page]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Action Handlers
  const handleRemoveTicket = async (id) => {
    if (window.confirm("Are you sure you want to remove this ticket?")) {
      try {
        console.log("🗑 Calling remove ticket API for:", id);
        // await removeTicketAPI(id);
        alert("Ticket removed successfully!");
      } catch (err) {
        console.error("❌ Error removing ticket:", err);
      } finally {
        setOpenMenuId(null);
      }
    }
  };

  const handleViewHistory = (id) => {
    navigate(`/ticket/history/${id}`);
    setOpenMenuId(null);
  };

  const handleViewResolution = (id) => {
    navigate(`/ticket/resolution/${id}`);
    setOpenMenuId(null);
  };

  // ✅ Navigate to ticket view when clicking ticket number
  const handleTicketClick = (id) => {
    navigate(`/ticket/view/${id}`);
  };

  // ✅ Pagination
  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  // ✅ Loading & Error
  if (loading)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Loading tickets...
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
        <h1 className="text-2xl font-bold text-gray-800">🎫 All Tickets</h1>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <div className="hidden md:grid grid-cols-7 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div>S.No</div>
          <div>Ticket No</div>
          <div>Name</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Created</div>
          <div className="text-center">Actions</div>
        </div>

        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="grid grid-cols-2 md:grid-cols-7 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
            >
              <div>{(page - 1) * limit + index + 1}</div>

              {/* ✅ Ticket number is clickable */}
              <div
                onClick={() => handleTicketClick(ticket._id)}
                className="text-blue-600 font-medium truncate cursor-pointer hover:underline"
              >
                {ticket._id?.slice(-6)}
              </div>

              <div>{ticket.personName}</div>
              <div>{ticket.personNumber}</div>
              <div>{ticket.status}</div>
              <div>
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : "—"}
              </div>

              {/* ✅ Three-dot Action Menu */}
              <div className="flex justify-center relative" ref={menuRef}>
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)
                  }
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FaEllipsisV />
                </button>

                {openMenuId === ticket._id && (
                  <div className="absolute right-0 mt-8 w-48 bg-white border rounded-lg shadow-lg z-30">
                    <button
                      onClick={() => handleRemoveTicket(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
                    >
                      <FaTrash className="text-red-500" /> Remove
                    </button>
                    <button
                      onClick={() => handleViewHistory(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-50 text-gray-700"
                    >
                      <FaHistory className="text-blue-500" /> Ticket History
                    </button>
                    <button
                      onClick={() => handleViewResolution(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 text-gray-700"
                    >
                      <FaCheckCircle className="text-green-500" /> Resolution
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No tickets found
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
