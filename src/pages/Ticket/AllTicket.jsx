import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketList, deleteTicket } from "../../service/ticket";
import { FaEllipsisV, FaTrash, FaHistory, FaCheckCircle } from "react-icons/fa";

export default function AllTicket() {
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  // ✅ Load all tickets (used for refresh)
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

  // ✅ Fetch on mount and when page changes
  useEffect(() => {
    loadTickets();
  }, [page]);

  // ✅ Close dropdown when clicking outside (fixed)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".ticket-action-menu")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Delete Ticket Handler (working)
  const handleRemoveTicket = async (id) => {
    if (window.confirm("Are you sure you want to remove this ticket?")) {
      try {
        console.log("🗑 Deleting Ticket ID:", id);
        const res = await deleteTicket(id);
        console.log("✅ Delete Response:", res);

        if (res.status || res.success) {
          alert("✅ Ticket deleted successfully!");
          await loadTickets(); // Refresh list
          setOpenMenuId(null);
        } else {
          alert("❌ Failed to delete: " + (res.message || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error removing ticket:", err);
        alert(err.message || "Error deleting ticket");
      }
    }
  };

  // ✅ View History
  const handleViewHistory = (id, e) => {
    e.stopPropagation();
    navigate(`/ticket/history/${id}`);
    setOpenMenuId(null);
  };

  // ✅ View Resolution
  const handleViewResolution = (id, e) => {
    e.stopPropagation();
    navigate(`/ticket/resolution/${id}`);
    setOpenMenuId(null);
  };

  // ✅ Navigate to ticket view on click
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
              onClick={() => handleTicketClick(ticket._id)}
              className="grid grid-cols-2 md:grid-cols-7 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative cursor-pointer"
            >
              <div>{(page - 1) * limit + index + 1}</div>

              {/* ✅ Ticket number clickable */}
              <div className="text-blue-600 font-medium truncate hover:underline">
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

              {/* ✅ Action Menu */}
              <div className="flex justify-center relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === ticket._id ? null : ticket._id
                    );
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FaEllipsisV />
                </button>

                {openMenuId === ticket._id && (
                  <div className="ticket-action-menu absolute right-0 mt-8 w-48 bg-white border rounded-lg shadow-lg z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTicket(ticket._id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-gray-700"
                    >
                      <FaTrash className="text-red-500" /> Remove
                    </button>

                    <button
                      onClick={(e) => handleViewHistory(ticket._id, e)}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-50 text-gray-700"
                    >
                      <FaHistory className="text-blue-500" /> Ticket History
                    </button>

                    <button
                      onClick={(e) => handleViewResolution(ticket._id, e)}
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
