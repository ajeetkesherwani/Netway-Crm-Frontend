import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getReassignTicketList, deleteTicket } from "../../service/ticket";

export default function ReassignTicketList() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch Tickets
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

  useEffect(() => {
    fetchTickets();
  }, [page]);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdown if clicked anywhere outside of the menu button or menu
      if (
        !e.target.closest(".action-menu") &&
        !e.target.closest(".menu-toggle")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Delete Ticket
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        console.log("🗑 Deleting ticket:", id);
        const res = await deleteTicket(id);
        console.log("✅ Delete Response:", res);

        if (res.status || res.success) {
          alert("✅ Ticket deleted successfully!");
          await fetchTickets(); // Refresh list
        } else {
          alert("❌ Failed to delete: " + (res.message || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error deleting ticket:", err);
        alert(err.message || "Error deleting ticket");
      } finally {
        setOpenMenuId(null);
      }
    }
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Reassign Tickets
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
            {total}
          </span>
        </h1>
      </div>

      {/* Table */}
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
                  <td
                    className="px-3 py-1 border text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(`/ticket/view/${ticket._id}`)}
                  >
                    {ticket.ticketNumber || "N/A"}
                  </td>
                  <td className="px-3 py-1 border">
                    <span
                      className="text-blue-700 cursor-pointer font-medium hover:underline"
                      onClick={() =>
                        navigate(`/user/detail/${ticket.user.name}`)
                      }
                    >
                      {ticket.user.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {ticket.user.phoneNo}
                    </p>
                  </td>
                  <td className="px-3 py-1 border">
                    {ticket.severity || "Low"}
                  </td>
                  <td className="px-3 py-1 border">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-1 border">{ticket.user.callSource}</td>
                  <td className="px-3 py-1 border">
                    {new Date(
                      ticket.currentAssignee.assignedAt
                    ).toLocaleString()}
                  </td>
                  <td className="px-3 py-1 border text-gray-700">
                    {ticket.currentAssignee.id || "N/A"}
                  </td>
                  <td className="px-3 py-1 border text-gray-700">
                    {"Reassign Ticket"}
                  </td>
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

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === ticket._id ? null : ticket._id
                            );
                          }}
                          className="p-1 rounded hover:bg-gray-200 ml-2 menu-toggle"
                        >
                          <FaEllipsisV className="text-gray-600 text-sm" />
                        </button>

                        {openMenuId === ticket._id && (
                          <div className="absolute right-0 top-6 w-36 bg-white border shadow-md rounded z-20 text-left action-menu">
                            <button
                              onClick={() => handleRemove(ticket._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
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

      {/* Pagination */}
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
