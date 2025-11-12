import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketList, deleteTicket } from "../../service/ticket"; // ✅ added deleteTicket import
import {
  FaTrash,
  FaClipboardList,
  FaCheckCircle,
  FaEllipsisV,
} from "react-icons/fa";

export default function ClosedTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch Closed Tickets
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
      setTotalPages(Math.ceil(cleaned.length / limit));
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // ✅ Action handlers
  const handleViewTicket = (id) => navigate(`/ticket/view/${id}`);
  const handleMenuToggle = (id) => setMenuOpen(menuOpen === id ? null : id);

  const handleResolution = (id) => {
    navigate(`/ticket/resolution/${id}`);
    setMenuOpen(null);
  };

  const handleHistory = (id) => {
    navigate(`/ticket/history/${id}`);
    setMenuOpen(null);
  };

  // ✅ Fully working DELETE function
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        console.log("🗑 Deleting ticket:", id);
        const res = await deleteTicket(id);
        console.log("✅ Delete Response:", res);

        if (res.status || res.success) {
          alert("✅ Ticket deleted successfully!");
          await loadTickets(); // refresh list
        } else {
          alert("❌ Failed to delete: " + (res.message || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error deleting ticket:", err);
        alert(err.message || "Error deleting ticket");
      } finally {
        setMenuOpen(null);
      }
    }
  };

  // ✅ Pagination
  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  // ✅ Loading & Error
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
      </div>

      {/* ✅ Table */}
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

        {tickets.length > 0 ? (
          tickets
            .slice((page - 1) * limit, page * limit)
            .map((ticket, index) => (
              <div
                key={ticket._id}
                className="grid grid-cols-2 md:grid-cols-8 items-center text-sm text-gray-700 border-b hover:bg-gray-50 px-4 py-3 transition duration-200 relative"
              >
                <div>{(page - 1) * limit + index + 1}</div>

                {/* ✅ Ticket number clickable */}
                <button
                  onClick={() => handleViewTicket(ticket._id)}
                  className="text-green-600 font-medium hover:underline text-left truncate"
                >
                  {ticket._id?.slice(-6)}
                </button>

                <div>{ticket.personName}</div>
                <div className="truncate">{ticket.email}</div>
                <div>{ticket.personNumber}</div>

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
                        onClick={() => handleRemove(ticket._id)} // ✅ DELETE connected
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
