// import { useEffect, useState, useRef } from "react";
// import { FaEllipsisV, FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getReassignTicketList } from "../../service/ticket"; // API service

// export default function ReassignTicketList() {
//   const [tickets, setTickets] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const limit = 10;

//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   // 🔹 Fetch API data
//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const res = await getReassignTicketList(page, limit);
//         if (res.status) {
//           setTickets(res.data.tickets || []);
//           setTotal(res.data.total || 0);
//         }
//       } catch (err) {
//         console.error("Error fetching reassign tickets:", err);
//       }
//     };
//     fetchTickets();
//   }, [page]);

//   // 🔹 Search suggestions
//   useEffect(() => {
//     if (!searchTerm) {
//       setSuggestions([]);
//       return;
//     }

//     const filtered = tickets.filter((t) =>
//       t.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setSuggestions(filtered.slice(0, 5));
//   }, [searchTerm, tickets]);

//   // 🔹 Close dropdown menu when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 🔹 Handlers
//   const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);
//   const handleUserClick = (name) => navigate(`/user/detail/${name}`);

//   const handleRemove = (id) => {
//     alert(`Remove Ticket ID: ${id}`);
//     setOpenMenuId(null);
//   };

//   const handleResolve = (id) => {
//     alert(`Resolve Ticket ID: ${id}`);
//     setOpenMenuId(null);
//   };

//   const handleHistory = (id) => {
//     navigate(`/ticket/history/${id}`);
//     setOpenMenuId(null);
//   };

//   // 🔹 Pagination Controls
//   const totalPages = Math.ceil(total / limit);

//   const handlePrev = () => page > 1 && setPage(page - 1);
//   const handleNext = () => page < totalPages && setPage(page + 1);

//   return (
//     <div className="p-5 bg-[#edf2f7] min-h-screen">
//       {/* 🔹 Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           Reassign Tickets
//           <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
//             {total}
//           </span>
//         </h1>

//         {/* Search Bar */}
//         <div className="relative w-64">
//           <input
//             type="text"
//             placeholder="Search User..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm"
//           />
//           <FaSearch className="absolute right-2 top-3 text-gray-400" />
//           {suggestions.length > 0 && (
//             <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
//               {suggestions.map((s) => (
//                 <li
//                   key={s._id}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleUserClick(s.user.name)}
//                 >
//                   {s.user.name} ({s.user.phoneNo})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* 🔹 Table */}
//       <div className="overflow-x-auto bg-white shadow-md rounded-md border">
//         <table className="min-w-full border-collapse text-sm">
//           <thead className="bg-[#f5f7fa] text-gray-700 border-b">
//             <tr>
//               <th className="px-4 py-2 border text-left">S.No</th>
//               <th className="px-4 py-2 border text-left">Ticket No</th>
//               <th className="px-4 py-2 border text-left">User Name</th>
//               <th className="px-4 py-2 border text-left">Assigned At</th>
//               <th className="px-4 py-2 border text-left">Status</th>
//               <th className="px-4 py-2 border text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-4 text-gray-500">
//                   No records found
//                 </td>
//               </tr>
//             ) : (
//               tickets.map((ticket, index) => (
//                 <tr key={ticket._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">
//                     {(page - 1) * limit + index + 1}
//                   </td>

//                   {/* Ticket Number */}
//                   <td
//                     className="px-4 py-2 border text-blue-600 font-semibold cursor-pointer hover:underline"
//                     onClick={() => handleTicketClick(ticket._id)}
//                   >
//                     {ticket.ticketNumber || "N/A"}
//                   </td>

//                   {/* User */}
//                   <td className="px-4 py-2 border">
//                     <span
//                       className="text-blue-700 font-medium cursor-pointer hover:underline"
//                       onClick={() => handleUserClick(ticket.user.name)}
//                     >
//                       {ticket.user.name}
//                     </span>
//                     <p className="text-xs text-gray-500">
//                       {ticket.user.phoneNo}
//                     </p>
//                   </td>

//                   {/* Assigned At */}
//                   <td className="px-4 py-2 border">
//                     {new Date(
//                       ticket.currentAssignee.assignedAt
//                     ).toLocaleString()}
//                   </td>

//                   {/* Status */}
//                   <td className="px-4 py-2 border">
//                     <span
//                       className={`px-2 py-1 text-xs rounded font-medium ${
//                         ticket.currentAssignee.currentStatus === "Open"
//                           ? "bg-green-100 text-green-700"
//                           : ticket.currentAssignee.currentStatus === "Closed"
//                           ? "bg-gray-200 text-gray-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {ticket.currentAssignee.currentStatus}
//                     </span>
//                   </td>

//                   {/* Action */}
//                   <td className="px-4 py-2 border text-center relative">
//                     <button
//                       onClick={() =>
//                         setOpenMenuId(
//                           openMenuId === ticket._id ? null : ticket._id
//                         )
//                       }
//                       className="p-1 rounded hover:bg-gray-200"
//                     >
//                       <FaEllipsisV />
//                     </button>

//                     {openMenuId === ticket._id && (
//                       <div
//                         ref={menuRef}
//                         className="absolute right-2 top-8 w-36 bg-white border shadow-md rounded z-20 text-left"
//                       >
//                         <button
//                           onClick={() => handleRemove(ticket._id)}
//                           className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
//                         >
//                           Remove
//                         </button>
//                         <button
//                           onClick={() => handleResolve(ticket._id)}
//                           className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
//                         >
//                           Resolve
//                         </button>
//                         <button
//                           onClick={() => handleHistory(ticket._id)}
//                           className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
//                         >
//                           Ticket History
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔹 Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={handlePrev}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm"
//         >
//           Previous
//         </button>
//         <span className="text-sm">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={handleNext}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getReassignTicketList } from "../../service/ticket"; // API service

export default function ReassignTicketList() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const limit = 10;

  const navigate = useNavigate();
  const menuRef = useRef(null);

  // ✅ Fetch Tickets API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getReassignTicketList(page, limit);
        if (res.status) {
          setTickets(res.data.tickets || []);
          setTotal(res.data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching reassign tickets:", err);
      }
    };
    fetchTickets();
  }, [page]);

  // ✅ Search suggestions
  useEffect(() => {
    if (!searchTerm) return setSuggestions([]);

    const filtered = tickets.filter((t) =>
      t.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchTerm, tickets]);

  // ✅ Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handlers
  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);
  const handleUserClick = (name) => navigate(`/user/detail/${name}`);

  const handleRemove = (id) => {
    alert(`Remove Ticket ID: ${id}`);
    setOpenMenuId(null);
  };

  const handleResolve = (id) => {
    alert(`Resolve Ticket ID: ${id}`);
    setOpenMenuId(null);
  };

  const handleHistory = (id) => {
    navigate(`/ticket/history/${id}`);
    setOpenMenuId(null);
  };

  // ✅ Pagination
  const totalPages = Math.ceil(total / limit);
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div className="p-5 bg-[#edf2f7] min-h-screen">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Reassign Tickets
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
            {total}
          </span>
        </h1>

        {/* 🔍 Search Bar */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md pl-3 pr-8 py-1.5 w-full text-sm"
          />
          <FaSearch className="absolute right-2 top-2.5 text-gray-400" />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
              {suggestions.map((s) => (
                <li
                  key={s._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(s.user.name)}
                >
                  {s.user.name} ({s.user.phoneNo})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md border">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[#f5f7fa] text-gray-700 border-b">
            <tr>
              <th className="px-3 py-2 border text-left">S.No</th>
              <th className="px-3 py-2 border text-left">Ticket No</th>
              <th className="px-3 py-2 border text-left">Client Name</th>
              <th className="px-3 py-2 border text-left">Priority</th>
              <th className="px-3 py-2 border text-left">Ticket Date</th>
              <th className="px-3 py-2 border text-left">Call Source</th>
              <th className="px-3 py-2 border text-left">Assigned Date/Time</th>
              <th className="px-3 py-2 border text-left">Assigned To</th>
              <th className="px-3 py-2 border text-left">Description</th>
              <th className="px-3 py-2 border text-left">Status / Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-3 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              tickets.map((ticket, index) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50 transition-all"
                  style={{ height: "44px" }}
                >
                  <td className="px-3 py-1 border text-gray-700 text-sm">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* Ticket No */}
                  <td
                    className="px-3 py-1 border text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => handleTicketClick(ticket._id)}
                  >
                    {ticket.ticketNumber || "N/A"}
                  </td>

                  {/* User Name */}
                  <td className="px-3 py-1 border">
                    <span
                      className="text-blue-700 cursor-pointer font-medium hover:underline"
                      onClick={() => handleUserClick(ticket.user.name)}
                    >
                      {ticket.user.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {ticket.user.phoneNo}
                    </p>
                  </td>

                  {/* Priority */}
                  <td className="px-3 py-1 border">
                    {ticket.severity || "Low"}
                  </td>

                  {/* Ticket Date */}
                  <td className="px-3 py-1 border">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>

                  {/* Call Source */}
                  <td className="px-3 py-1 border">{ticket.user.callSource}</td>

                  {/* Assigned Date */}
                  <td className="px-3 py-1 border">
                    {new Date(
                      ticket.currentAssignee.assignedAt
                    ).toLocaleString()}
                  </td>

                  {/* Assigned To */}
                  <td className="px-3 py-1 border text-gray-700">
                    {ticket.currentAssignee.id || "N/A"}
                  </td>

                  {/* Description */}
                  <td className="px-3 py-1 border text-gray-700">
                    {"Reassign Ticket"}
                  </td>

                  {/* Status + Action */}
                  <td className="px-3 py-1 border relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          ticket.currentAssignee.currentStatus === "Open"
                            ? "bg-green-100 text-green-700"
                            : ticket.currentAssignee.currentStatus === "Closed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ticket.currentAssignee.currentStatus}
                      </span>

                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === ticket._id ? null : ticket._id
                            );
                          }}
                          className="p-1 rounded hover:bg-gray-200 ml-2"
                        >
                          <FaEllipsisV className="text-gray-600 text-sm" />
                        </button>

                        {openMenuId === ticket._id && (
                          <div className="absolute right-0 top-6 w-36 bg-white border shadow-md rounded z-20 text-left">
                            <button
                              onClick={() => handleRemove(ticket._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => handleResolve(ticket._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleHistory(ticket._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              Ticket History
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
