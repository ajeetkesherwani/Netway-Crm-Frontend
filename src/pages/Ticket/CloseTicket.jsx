// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getAllTicketList } from "../../service/ticket";
// // import { FaTrash, FaClipboardList, FaCheckCircle } from "react-icons/fa";

// // export default function ClosedTicket() {
// //   const [tickets, setTickets] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   const limit = 10;
// //   const navigate = useNavigate();

// //   // ✅ Fetch Closed Tickets only
// //   useEffect(() => {
// //     const loadTickets = async () => {
// //       setLoading(true);
// //       try {
// //         // ❌ WRONG: getAllTicketList(page, limit, "Closed")
// //         // ✅ CORRECT:
// //         const res = await getAllTicketList(page, limit, "", "Closed");
// //         console.log("✅ API Response:", res);

// //         // ✅ Extract closedTickets correctly
// //         const ticketData = res?.data?.closedTickets || [];

// //         // ✅ Apply search filter locally
// //         const filtered = ticketData.filter((t) =>
// //           t.personName?.toLowerCase().includes(searchTerm.toLowerCase())
// //         );

// //         setTickets(filtered);
// //         setTotalPages(Math.ceil(filtered.length / limit));
// //       } catch (err) {
// //         console.error("Error fetching tickets:", err);
// //         setError("Failed to load tickets");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadTickets();
// //   }, [page, searchTerm]);

// //   // ✅ Search suggestions
// //   useEffect(() => {
// //     if (!searchTerm.trim()) {
// //       setSuggestions([]);
// //       return;
// //     }

// //     const timeout = setTimeout(() => {
// //       const matched = tickets
// //         .filter((t) =>
// //           t.personName?.toLowerCase().includes(searchTerm.toLowerCase())
// //         )
// //         .map((t) => ({ id: t._id, name: t.personName }))
// //         .slice(0, 5);

// //       setSuggestions(matched);
// //     }, 300);

// //     return () => clearTimeout(timeout);
// //   }, [searchTerm, tickets]);

// //   // ✅ Handlers
// //   const handleSearch = (e) => {
// //     setSearchTerm(e.target.value);
// //     setPage(1);
// //   };

// //   const handleSearchClick = () => {
// //     if (searchTerm.trim()) {
// //       const match = tickets.find(
// //         (t) => t.personName?.toLowerCase() === searchTerm.trim().toLowerCase()
// //       );
// //       if (match) navigate(`/user/details/${match._id}`);
// //       else alert("No matching user found.");
// //     }
// //   };

// //   const handleSuggestionClick = (id) => {
// //     setSuggestions([]);
// //     navigate(`/user/details/${id}`);
// //   };

// //   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

// //   // --- Action buttons ---
// //   const handleResolution = (id) => alert(`Resolution clicked for: ${id}`);
// //   const handleHistory = (id) => alert(`History clicked for: ${id}`);
// //   const handleRemove = (id) => alert(`Remove ticket: ${id}`);

// //   const handlePrevPage = () => page > 1 && setPage(page - 1);
// //   const handleNextPage = () => page < totalPages && setPage(page + 1);

// //   // ✅ Render
// //   if (loading)
// //     return (
// //       <p className="text-center py-10 text-gray-600">Loading tickets...</p>
// //     );
// //   if (error)
// //     return (
// //       <p className="text-center py-10 text-red-500 font-medium">{error}</p>
// //     );

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       {/* Header */}
// //       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
// //         <h1 className="text-2xl font-bold text-gray-800">🗂️ Closed Tickets</h1>

// //         {/* Search Section */}
// //         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto relative">
// //           <div className="relative w-full md:w-72">
// //             <input
// //               type="text"
// //               placeholder="Search user by name..."
// //               value={searchTerm}
// //               onChange={handleSearch}
// //               className="w-full border rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
// //             />
// //             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
// //               🔍
// //             </span>

// //             {/* Suggestions Dropdown */}
// //             {suggestions.length > 0 && (
// //               <ul className="absolute bg-white border border-gray-200 rounded-lg mt-1 w-full shadow-md z-20 max-h-56 overflow-y-auto">
// //                 {suggestions.map((user) => (
// //                   <li
// //                     key={user.id}
// //                     onClick={() => handleSuggestionClick(user.id)}
// //                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
// //                   >
// //                     {user.name}
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </div>

// //           {/* Search Button */}
// //           <button
// //             onClick={handleSearchClick}
// //             className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
// //           >
// //             Search
// //           </button>
// //         </div>
// //       </div>

// //       {/* Grid Table */}
// //       <div className="overflow-x-auto bg-white shadow rounded-lg">
// //         <div className="grid grid-cols-9 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
// //           <div>S.No</div>
// //           <div>Ticket No</div>
// //           <div>Name</div>
// //           <div>Email</div>
// //           <div>Phone</div>
// //           <div>Status</div>
// //           <div>Severity</div>
// //           <div>Created At</div>
// //           <div className="text-center">Action</div>
// //         </div>

// //         {tickets.length > 0 ? (
// //           tickets
// //             .slice((page - 1) * limit, page * limit)
// //             .map((ticket, index) => (
// //               <div
// //                 key={ticket._id}
// //                 className="grid grid-cols-9 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition"
// //               >
// //                 <div>{(page - 1) * limit + index + 1}</div>

// //                 {/* Ticket No */}
// //                 <button
// //                   onClick={() => handleViewTicket(ticket._id)}
// //                   className="text-green-600 font-medium hover:underline text-left"
// //                 >
// //                   {`WEB${(page - 1) * limit + index + 10051125}`}
// //                 </button>

// //                 <div>{ticket.personName || "—"}</div>
// //                 <div>{ticket.email || "—"}</div>
// //                 <div>{ticket.personNumber || "—"}</div>
// //                 <div>
// //                   <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">
// //                     {ticket.status}
// //                   </span>
// //                 </div>
// //                 <div>
// //                   <span
// //                     className={`px-2 py-1 rounded text-xs font-semibold ${
// //                       ticket.severity === "High"
// //                         ? "bg-red-100 text-red-700"
// //                         : ticket.severity === "Medium"
// //                         ? "bg-yellow-100 text-yellow-700"
// //                         : "bg-green-100 text-green-700"
// //                     }`}
// //                   >
// //                     {ticket.severity}
// //                   </span>
// //                 </div>
// //                 <div>
// //                   {ticket.createdAt
// //                     ? new Date(ticket.createdAt).toLocaleDateString()
// //                     : "—"}
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="flex justify-center gap-2">
// //                   <button
// //                     onClick={() => handleResolution(ticket._id)}
// //                     className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
// //                     title="Resolution"
// //                   >
// //                     <FaCheckCircle />
// //                   </button>
// //                   <button
// //                     onClick={() => handleHistory(ticket._id)}
// //                     className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
// //                     title="History"
// //                   >
// //                     <FaClipboardList />
// //                   </button>
// //                   <button
// //                     onClick={() => handleRemove(ticket._id)}
// //                     className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
// //                     title="Remove"
// //                   >
// //                     <FaTrash />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))
// //         ) : (
// //           <div className="text-center py-8 text-gray-500 font-medium">
// //             No closed tickets found
// //           </div>
// //         )}
// //       </div>

// //       {/* Pagination */}
// //       <div className="flex justify-center items-center gap-4 mt-6">
// //         <button
// //           onClick={handlePrevPage}
// //           disabled={page === 1}
// //           className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
// //         >
// //           Prev
// //         </button>
// //         <span className="font-medium text-gray-700">
// //           Page {page} of {totalPages}
// //         </span>
// //         <button
// //           onClick={handleNextPage}
// //           disabled={page === totalPages}
// //           className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList } from "../../service/ticket";
// import {
//   FaTrash,
//   FaClipboardList,
//   FaCheckCircle,
//   FaEllipsisV,
// } from "react-icons/fa";

// export default function ClosedTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 10;
//   const navigate = useNavigate();

//   // ✅ Fetch Closed Tickets only once
//   useEffect(() => {
//     const loadTickets = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllTicketList(page, limit, "", "Closed");
//         console.log("✅ API Response:", res);

//         const ticketData =
//           res?.data?.data?.closedTickets ||
//           res?.data?.closedTickets ||
//           res?.closedTickets ||
//           [];

//         const cleaned = ticketData.map((t) => ({
//           _id: t._id,
//           personName: t.personName || "N/A",
//           email: t.email || "N/A",
//           personNumber: t.personNumber || "N/A",
//           status: t.status || "Closed",
//           severity: t.severity || "Low",
//           createdAt: t.createdAt || "",
//         }));

//         setTickets(cleaned);
//         setFilteredTickets(cleaned);
//         setTotalPages(Math.ceil(cleaned.length / limit));
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//         setError("Failed to load tickets");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadTickets();
//   }, [page]);

//   // ✅ Search handling — no API hit while typing
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

//   // ✅ On search button click — filters locally
//   const handleSearchClick = () => {
//     if (!searchTerm.trim()) {
//       setFilteredTickets(tickets);
//       return;
//     }

//     const filtered = tickets.filter((t) =>
//       t.personName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredTickets(filtered);
//   };

//   // ✅ Suggestion click
//   const handleSuggestionClick = (id, name) => {
//     setSearchTerm(name);
//     setSuggestions([]);
//     navigate(`/user/details/${id}`);
//   };

//   // ✅ View ticket
//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

//   // ✅ 3-dot menu actions
//   const handleMenuToggle = (id) => {
//     setMenuOpen(menuOpen === id ? null : id);
//   };

//   const handleResolution = (id) => alert(`Resolution clicked for: ${id}`);
//   const handleHistory = (id) => alert(`History clicked for: ${id}`);
//   const handleRemove = (id) => alert(`Remove ticket: ${id}`);

//   const handlePrevPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

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

//             {/* Suggestions Dropdown */}
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

//           {/* Search Button */}
//           <button
//             onClick={handleSearchClick}
//             className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       {/* Table */}
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

//         {filteredTickets.length > 0 ? (
//           filteredTickets
//             .slice((page - 1) * limit, page * limit)
//             .map((ticket, index) => (
//               <div
//                 key={ticket._id}
//                 className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
//               >
//                 <div className="font-semibold md:hidden">#</div>
//                 <div>{(page - 1) * limit + index + 1}</div>

//                 <div className="md:hidden font-semibold">Ticket No</div>
//                 <button
//                   onClick={() => handleViewTicket(ticket._id)}
//                   className="text-green-600 font-medium hover:underline text-left truncate"
//                 >
//                   {ticket._id?.slice(-6)}
//                 </button>

//                 <div className="md:hidden font-semibold">Name</div>
//                 <div>{ticket.personName}</div>

//                 <div className="md:hidden font-semibold">Email</div>
//                 <div className="truncate">{ticket.email}</div>

//                 <div className="md:hidden font-semibold">Phone</div>
//                 <div>{ticket.personNumber}</div>

//                 <div className="md:hidden font-semibold">Severity</div>
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

//                 <div className="md:hidden font-semibold">Created</div>
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
//                     className="p-2 hover:bg-gray-100 rounded-full"
//                     title="Actions"
//                   >
//                     <FaEllipsisV />
//                   </button>

//                   {menuOpen === ticket._id && (
//                     <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-lg w-32 z-30 text-sm">
//                       <button
//                         onClick={() => handleResolution(ticket._id)}
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
//                       >
//                         <FaCheckCircle className="text-green-500" /> Resolve
//                       </button>
//                       <button
//                         onClick={() => handleHistory(ticket._id)}
//                         className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
//                       >
//                         <FaClipboardList className="text-gray-500" /> History
//                       </button>
//                       <button
//                         onClick={() => handleRemove(ticket._id)}
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

//       {/* Pagination */}
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketList } from "../../service/ticket";
import {
  FaTrash,
  FaClipboardList,
  FaCheckCircle,
  FaEllipsisV,
} from "react-icons/fa";

export default function ClosedTicket() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch Closed Tickets only once
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await getAllTicketList(page, limit, "", "Closed");
        console.log("✅ API Response:", res);

        const ticketData =
          res?.data?.data?.closedTickets ||
          res?.data?.closedTickets ||
          res?.closedTickets ||
          [];

        const cleaned = ticketData.map((t) => ({
          _id: t._id,
          personName: t.personName || "N/A",
          email: t.email || "N/A",
          personNumber: t.personNumber || "N/A",
          status: t.status || "Closed",
          severity: t.severity || "Low",
          createdAt: t.createdAt || "",
        }));

        setTickets(cleaned);
        setFilteredTickets(cleaned);
        setTotalPages(Math.ceil(cleaned.length / limit));
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, [page]);

  // ✅ Close dropdown when clicking outside
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

  // ✅ Search handling — no API hit while typing
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      setFilteredTickets(tickets);
      return;
    }

    const matched = tickets
      .filter((t) =>
        t.personName.toLowerCase().includes(value.trim().toLowerCase())
      )
      .map((t) => ({ id: t._id, name: t.personName }))
      .slice(0, 5);

    setSuggestions(matched);
  };

  // ✅ On search button click — filters locally
  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const filtered = tickets.filter((t) =>
      t.personName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  // ✅ Suggestion click
  const handleSuggestionClick = (id, name) => {
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/user/details/${id}`);
  };

  // ✅ View ticket
  const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

  // ✅ 3-dot menu actions
  const handleMenuToggle = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleResolution = (id) => {
    alert(`Resolution clicked for: ${id}`);
    setMenuOpen(null);
  };
  const handleHistory = (id) => {
    alert(`History clicked for: ${id}`);
    setMenuOpen(null);
  };
  const handleRemove = (id) => {
    alert(`Remove ticket: ${id}`);
    setMenuOpen(null);
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Loading closed tickets...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🗂️ Closed Tickets
        </h1>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto relative">
          <div className="relative w-full md:w-72">
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

            {/* Suggestions Dropdown */}
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

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <div className="hidden md:grid grid-cols-8 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div>S.No</div>
          <div>Ticket No</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Severity</div>
          <div>Created At</div>
          <div className="text-center">Status / Action</div>
        </div>

        {filteredTickets.length > 0 ? (
          filteredTickets
            .slice((page - 1) * limit, page * limit)
            .map((ticket, index) => (
              <div
                key={ticket._id}
                className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
              >
                <div className="font-semibold md:hidden">#</div>
                <div>{(page - 1) * limit + index + 1}</div>

                <div className="md:hidden font-semibold">Ticket No</div>
                <button
                  onClick={() => handleViewTicket(ticket._id)}
                  className="text-green-600 font-medium hover:underline text-left truncate"
                >
                  {ticket._id?.slice(-6)}
                </button>

                <div className="md:hidden font-semibold">Name</div>
                <div>{ticket.personName}</div>

                <div className="md:hidden font-semibold">Email</div>
                <div className="truncate">{ticket.email}</div>

                <div className="md:hidden font-semibold">Phone</div>
                <div>{ticket.personNumber}</div>

                <div className="md:hidden font-semibold">Severity</div>
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
                    {ticket.severity}
                  </span>
                </div>

                <div className="md:hidden font-semibold">Created</div>
                <div>
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString()
                    : "—"}
                </div>

                {/* ✅ Status + Action Menu */}
                <div className="flex justify-between md:justify-center items-center gap-2 relative">
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-700">
                    {ticket.status}
                  </span>

                  <button
                    onClick={() => handleMenuToggle(ticket._id)}
                    className="p-2 hover:bg-gray-100 rounded-full action-toggle"
                    title="Actions"
                  >
                    <FaEllipsisV />
                  </button>

                  {menuOpen === ticket._id && (
                    <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-lg w-32 z-30 text-sm action-menu">
                      <button
                        onClick={() => handleResolution(ticket._id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <FaCheckCircle className="text-green-500" /> Resolve
                      </button>
                      <button
                        onClick={() => handleHistory(ticket._id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <FaClipboardList className="text-gray-500" /> History
                      </button>
                      <button
                        onClick={() => handleRemove(ticket._id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No closed tickets found
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

