// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllTicketList } from "../../service/ticket";

// export default function AllTicket() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]); // store search results
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;

//   const navigate = useNavigate();

//   // ✅ Fetch all tickets only once (no repeated API calls)
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

//   // ✅ Handle search input — only updates suggestions, not API
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (!value.trim()) {
//       setSuggestions([]);
//       setFilteredTickets(tickets);
//       return;
//     }

//     // show matching suggestions (no API)
//     const matched = tickets
//       .filter((t) =>
//         t.personName.toLowerCase().includes(value.trim().toLowerCase())
//       )
//       .map((t) => ({ id: t._id, name: t.personName }))
//       .slice(0, 5);

//     setSuggestions(matched);
//   };

//   // ✅ Search button click
//   const handleSearchClick = () => {
//     if (!searchTerm.trim()) {
//       setFilteredTickets(tickets);
//       return;
//     }

//     const match = tickets.find(
//       (t) => t.personName.toLowerCase() === searchTerm.trim().toLowerCase()
//     );

//     if (match) {
//       navigate(`/user/details/${match._id}`);
//     } else {
//       alert("No matching user found.");
//     }
//   };

//   // ✅ Suggestion click
//   const handleSuggestionClick = (id, name) => {
//     setSearchTerm(name);
//     setSuggestions([]);
//     navigate(`/user/details/${id}`);
//   };

//   const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);

//   const handlePrevPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => page < totalPages && setPage(page + 1);

//   // ✅ Responsive Table Headings
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

//       {/* Table Container */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
//         <div className="hidden md:grid grid-cols-8 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
//           <div>S.No</div>
//           <div>Ticket No</div>
//           <div>Name</div>
//           <div>Email</div>
//           <div>Phone</div>
//           <div>Status</div>
//           <div>Severity</div>
//           <div>Created At</div>
//         </div>

//         {filteredTickets.length > 0 ? (
//           filteredTickets.map((ticket, index) => (
//             <div
//               key={ticket._id}
//               className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200"
//             >
//               <div className="font-semibold md:hidden">#</div>
//               <div>{(page - 1) * limit + index + 1}</div>

//               <div className="md:hidden font-semibold">Ticket No</div>
//               <button
//                 onClick={() => handleViewTicket(ticket._id)}
//                 className="text-blue-600 font-medium hover:underline text-left truncate"
//               >
//                 {ticket._id?.slice(-6)}
//               </button>

//               <div className="md:hidden font-semibold">Name</div>
//               <div>{ticket.personName}</div>

//               <div className="md:hidden font-semibold">Email</div>
//               <div className="truncate">{ticket.email}</div>

//               <div className="md:hidden font-semibold">Phone</div>
//               <div>{ticket.personNumber}</div>

//               <div className="md:hidden font-semibold">Status</div>
//               <div>{ticket.status}</div>

//               <div className="md:hidden font-semibold">Severity</div>
//               <div>{ticket.severity}</div>

//               <div className="md:hidden font-semibold">Created</div>
//               <div>
//                 {ticket.createdAt
//                   ? new Date(ticket.createdAt).toLocaleDateString()
//                   : "—"}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500 font-medium">
//             No tickets found
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
import { getAllTicketList, deleteTicket } from "../../service/ticket";

export default function AllTicket() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  // ✅ Fetch Tickets
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

        setTickets(cleanedTickets);
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

  // ✅ Search Logic
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

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const match = tickets.find(
      (t) => t.personName.toLowerCase() === searchTerm.trim().toLowerCase()
    );

    if (match) navigate(`/user/details/${match._id}`);
    else alert("No matching user found.");
  };

  const handleSuggestionClick = (id, name) => {
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/user/details/${id}`);
  };

  // ✅ Action Handlers
  const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);
  const handleEditTicket = (id) => navigate(`/ticket/edit/${id}`);

  // const handleDeleteTicket = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this ticket?"
  //   );
  //   if (!confirmDelete) return;

    try {
      const res = await deleteTicket(id);
      if (res?.status) {
        alert("Ticket deleted successfully!");
        setTickets((prev) => prev.filter((t) => t._id !== id));
        setFilteredTickets((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert(res?.message || "Failed to delete ticket");
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

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

      {/* ✅ Create Ticket Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/ticket/create")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow text-sm"
        >
          ➕ Create New Ticket
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <div className="hidden md:grid grid-cols-10 bg-blue-50 border-b font-semibold text-sm text-gray-700 py-3 px-4">
          <div>S.No</div>
          <div>Ticket No</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Severity</div>
          <div>Created At</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="grid grid-cols-2 md:grid-cols-10 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200"
            >
              <div>{(page - 1) * limit + index + 1}</div>
              <button
                onClick={() => handleViewTicket(ticket._id)}
                className="text-blue-600 font-medium hover:underline truncate"
              >
                {ticket._id?.slice(-6)}
              </button>
              <div>{ticket.personName}</div>
              <div className="truncate">{ticket.email}</div>
              <div>{ticket.personNumber}</div>
              <div>{ticket.status}</div>
              <div>{ticket.severity}</div>
              <div>
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : "—"}
              </div>

              {/* ✅ Small Action Buttons */}
              <div className="flex justify-center gap-1 md:col-span-2">
                <button
                  onClick={() => handleViewTicket(ticket._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  👁 View
                </button>
                <button
                  onClick={() => handleEditTicket(ticket._id)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                >
                  ✏️ Edit
                </button>
                {/* <button
                  onClick={() => handleDeleteTicket(ticket._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  🗑 Delete
                </button> */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No tickets found
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
