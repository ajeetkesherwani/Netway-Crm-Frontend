// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import { getAllTicketList } from "../../service/ticket";
// export default function ApprovelTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState(""); // New state for filter
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;
//   const navigate = useNavigate();
//   const menuRef = useRef(null);
//   // Fetch tickets
//   useEffect(() => {
//     const loadTickets = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllTicketList(page, limit, searchTerm, filter);
//         setTickets(res.data || []);
//         setTotalPages(res.totalPages || 1);
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//         setError("Failed to load tickets");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadTickets();
//   }, [page, searchTerm, filter]); // Added filter to dependencies

//   // Close dropdown when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handlers
//   const handleView = (id) => {
//     navigate(`/ticket/view/${id}`);
//     setOpenMenuId(null);
//   };

//   const handleEdit = (id) => {
//     navigate(`/ticket/update/${id}`);
//     setOpenMenuId(null);
//   };
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this ticket?")) {
//       // TODO: Call delete API
//       setTickets(tickets.filter((t) => t._id !== id));
//       setOpenMenuId(null);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setPage(1); // Reset to first page on search
//   };

//   const handleFilter = (e) => {
//     setFilter(e.target.value);
//     setPage(1); // Reset to first page on filter change
//   };

//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   if (loading) return <p className="p-4">Loading tickets...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">Approvel Ticket </h1>
//         {/* <button
//           onClick={() => navigate("/ticket/create")}
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Add Ticket
//         </button> */}
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
//         <input
//           type="text"
//           placeholder="Search tickets..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="border p-2 w-full md:w-1/3 rounded"
//         />
//         <select
//           value={filter}
//           onChange={handleFilter}
//           className="border p-2 w-full md:w-1/4 rounded"
//         >
//           <option value="">All</option>
//           <option value="assigned">Assigned</option>
//           <option value="nonAssigned">Non-Assigned</option>
//         </select>
//       </div>
//       {tickets.length === 0 ? (
//         <p className="text-gray-500">No tickets found.</p>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">S.No</th>
//                   <th className="px-4 py-2 text-left">Person Name</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Phone</th>
//                   <th className="px-4 py-2 text-left">Address</th>
//                   <th className="px-4 py-2 text-left">Category</th>
//                   <th className="px-4 py-2 text-left">Severity</th>
//                   <th className="px-4 py-2 text-left">Price</th>
//                   <th className="px-4 py-2 text-left">Created At</th>
//                   <th className="px-4 py-2 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {tickets.map((ticket, index) => (
//                   <tr key={ticket._id} className="hover:bg-gray-50 relative">
//                     <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
//                     <td className="px-4 py-2">{ticket.personName}</td>
//                     <td className="px-4 py-2">{ticket.email}</td>
//                     <td className="px-4 py-2">{ticket.personNumber}</td>
//                     <td className="px-4 py-2">{ticket.address}</td>
//                     <td className="px-4 py-2">{ticket.category}</td>
//                     <td className="px-4 py-2">{ticket.severity}</td>
//                     <td className="px-4 py-2">{ticket.price}</td>
//                     <td className="px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
//                     <td className="px-4 py-2 text-right relative">
//                       <button
//                         onClick={() =>
//                           setOpenMenuId(
//                             openMenuId === ticket._id ? null : ticket._id
//                           )
//                         }
//                         className="p-2 rounded hover:bg-gray-200"
//                       >
//                         <FaEllipsisV />
//                       </button>
//                       {openMenuId === ticket._id && (
//                         <div
//                           ref={menuRef}
//                           className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
//                         >
//                           <button
//                             onClick={() => handleView(ticket._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
//                           >
//                             <FaEye className="mr-2" /> View
//                           </button>
//                           <button
//                             onClick={() => handleEdit(ticket._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
//                           >
//                             <FaEdit className="mr-2" /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(ticket._id)}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <FaTrash className="mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="space-y-4 md:hidden">
//             {tickets.map((ticket, index) => (
//               <div
//                 key={ticket._id}
//                 className="p-4 border rounded-lg shadow-sm bg-white"
//               >
//                 <p className="text-sm text-gray-500">#{index + 1}</p>
//                 <h2 className="text-lg font-medium">{ticket.personName}</h2>
//                 <p className="text-sm">Email: {ticket.email}</p>
//                 <p className="text-sm">Phone: {ticket.personNumber}</p>
//                 <p className="text-sm">Address: {ticket.address}</p>
//                 <p className="text-sm">Category: {ticket.category}</p>
//                 <p className="text-sm">Severity: {ticket.severity}</p>
//                 <p className="text-sm">Price: {ticket.price}</p>
//                 <p className="text-sm">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
//                 <div className="flex justify-end space-x-3 mt-3">
//                   <button
//                     onClick={() => handleView(ticket._id)}
//                     className="text-blue-600 flex items-center text-sm"
//                   >
//                     <FaEye className="mr-1" /> View
//                   </button>
//                   <button
//                     onClick={() => handleEdit(ticket._id)}
//                     className="text-green-600 flex items-center text-sm"
//                   >
//                     <FaEdit className="mr-1" /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(ticket._id)}
//                     className="text-red-600 flex items-center text-sm"
//                   >
//                     <FaTrash className="mr-1" /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handlePrevPage}
//               disabled={page === 1}
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={handleNextPage}
//               disabled={page === totalPages}
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketList, updateTicket } from "../../service/ticket";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ApprovalTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const limit = 10;

  // ✅ Fetch all Fixed tickets
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await getAllTicketList(page, limit, "", "Fixed");
        console.log("✅ Fixed Tickets API Response:", res);

        // ✅ Use the correct key based on API response
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

    loadTickets();
  }, [page]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle Ticket Selection
  const handleSelectTicket = (id) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map((t) => t._id));
    }
    setSelectAll(!selectAll);
  };

  // ✅ Approve Ticket (Update status → Closed)
  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append("status", "Closed");

      await updateTicket(id, formData);
      alert("✅ Ticket approved successfully (status updated to Closed).");

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: "Closed" } : t))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error("❌ Error approving ticket:", err);
      alert("Failed to approve ticket.");
    }
  };

  // ✅ Disapprove Ticket (placeholder)
  const handleDisapprove = (id) => {
    alert(`❌ Disapprove clicked for Ticket ID: ${id}`);
    setOpenMenuId(null);
  };

  // ✅ Navigate to Ticket View
  const handleTicketClick = (id) => {
    navigate(`/ticket/view/${id}`);
  };

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
        <div className="hidden md:grid grid-cols-9 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="cursor-pointer"
            />
          </div>
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
              className="grid grid-cols-2 md:grid-cols-9 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
            >
              {/* ✅ Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={selectedTickets.includes(ticket._id)}
                  onChange={() => handleSelectTicket(ticket._id)}
                  className="cursor-pointer"
                />
              </div>

              {/* ✅ S.No */}
              <div>{(page - 1) * limit + index + 1}</div>

              {/* ✅ Ticket number clickable */}
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

              {/* ✅ Status + Action */}
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
