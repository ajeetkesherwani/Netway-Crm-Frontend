import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getAllTicketList } from "../../service/ticket";

export default function ManageTicket() {
  const [tickets, setTickets] = useState({
    openTickets: [],
    assignedTickets: [],
  });

  const [searchTicket, setSearchTicket] = useState("");
  const [ticketSuggestions, setTicketSuggestions] = useState([]);

  // Pagination for each tab
  const [pages, setPages] = useState({
    open: 1,
    assigned: 1,
  });

  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch Ticket List from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getAllTicketList(1, 100, "", "Manage");
        if (res.status && res.data) {
          const { openTickets, assignedTickets } = res.data;
          setTickets({
            openTickets: openTickets || [],
            assignedTickets: assignedTickets || [],
          });
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  // 🔍 Combine all tickets for search
  const allTickets = [...tickets.openTickets, ...tickets.assignedTickets];

  // 🔍 Ticket search
  const handleTicketSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTicket(value);
    if (!value) return setTicketSuggestions([]);
    const filtered = allTickets.filter((t) =>
      t.ticketNumber?.toLowerCase().includes(value)
    );
    setTicketSuggestions(filtered.slice(0, 5));
  };

  // 🧭 Navigation
  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

  // ✅ Pagination handlers
  const handlePrevPage = (type) => {
    setPages((prev) => ({ ...prev, [type]: Math.max(1, prev[type] - 1) }));
  };

  const handleNextPage = (type, totalPages) => {
    setPages((prev) => ({
      ...prev,
      [type]: Math.min(totalPages, prev[type] + 1),
    }));
  };

  return (
    <div className="p-5 bg-[#edf2f7] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold text-gray-800">🎫 Manage Ticket</h1>
      </div>

      {/* Ticket Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search Ticket..."
            value={searchTicket}
            onChange={handleTicketSearch}
            className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
          {ticketSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
              {ticketSuggestions.map((t) => (
                <li
                  key={t._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTicketClick(t._id)}
                >
                  {t.ticketNumber || "No Number"} - {t.personName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketColumn
          title="Open Ticket"
          color="bg-[#0f3057]"
          tickets={tickets.openTickets}
          type="open"
          page={pages.open}
          limit={limit}
          handleTicketClick={handleTicketClick}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />

        <TicketColumn
          title="Assign Ticket"
          color="bg-[#003865]"
          tickets={tickets.assignedTickets}
          type="assigned"
          page={pages.assigned}
          limit={limit}
          handleTicketClick={handleTicketClick}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      </div>
    </div>
  );
}

// 🔸 Ticket Column Component
const TicketColumn = ({
  title,
  color,
  tickets,
  type,
  page,
  limit,
  handleTicketClick,
  handlePrevPage,
  handleNextPage,
}) => {
  const totalPages = Math.ceil(tickets.length / limit) || 1;
  const paginatedTickets = tickets.slice((page - 1) * limit, page * limit);

  return (
    <div className="bg-white rounded-md shadow-md border flex flex-col justify-between">
      {/* Column Header */}
      <div
        className={`flex justify-between items-center px-4 py-2 text-white ${color} rounded-t-md`}
      >
        <span className="font-semibold">{title}</span>
        <span className="bg-orange-400 text-white px-2 py-0.5 text-xs rounded">
          {tickets.length}
        </span>
      </div>

      {/* Ticket List */}
      <div className="max-h-[70vh] overflow-y-auto flex-1">
        {tickets.length === 0 ? (
          <p className="text-center text-red-500 py-4">No Record Available</p>
        ) : (
          paginatedTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border-b px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <p
                  onClick={() => handleTicketClick(ticket._id)}
                  className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
                >
                  {ticket.ticketNumber || "No Ticket Number"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                <p>
                  <strong>User:</strong> {ticket.personName}
                </p>
                <p>
                  <strong>Call Source:</strong> {ticket.callSource}
                </p>
                <p>
                  <strong>Severity:</strong> {ticket.severity}
                </p>
                <p>
                  <strong>Address:</strong> {ticket.address}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Always Visible Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-2 border-t text-sm bg-gray-50">
        <button
          onClick={() => handlePrevPage(type)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handleNextPage(type, totalPages)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};
