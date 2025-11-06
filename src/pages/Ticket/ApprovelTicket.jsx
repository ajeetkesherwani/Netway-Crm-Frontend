import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { getAllTicketList } from "../../service/ticket";
export default function ApprovelTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(""); // New state for filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const menuRef = useRef(null);
  // Fetch tickets
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await getAllTicketList(page, limit, searchTerm, filter);
        setTickets(res.data || []);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, [page, searchTerm, filter]); // Added filter to dependencies

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleView = (id) => {
    navigate(`/ticket/view/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/ticket/update/${id}`);
    setOpenMenuId(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      // TODO: Call delete API
      setTickets(tickets.filter((t) => t._id !== id));
      setOpenMenuId(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p className="p-4">Loading tickets...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Approvel Ticket </h1>
        {/* <button
          onClick={() => navigate("/ticket/create")}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Ticket
        </button> */}
      </div>

      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full md:w-1/3 rounded"
        />
        <select
          value={filter}
          onChange={handleFilter}
          className="border p-2 w-full md:w-1/4 rounded"
        >
          <option value="">All</option>
          <option value="assigned">Assigned</option>
          <option value="nonAssigned">Non-Assigned</option>
        </select>
      </div>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">S.No</th>
                  <th className="px-4 py-2 text-left">Person Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Severity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 relative">
                    <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-2">{ticket.personName}</td>
                    <td className="px-4 py-2">{ticket.email}</td>
                    <td className="px-4 py-2">{ticket.personNumber}</td>
                    <td className="px-4 py-2">{ticket.address}</td>
                    <td className="px-4 py-2">{ticket.category}</td>
                    <td className="px-4 py-2">{ticket.severity}</td>
                    <td className="px-4 py-2">{ticket.price}</td>
                    <td className="px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === ticket._id ? null : ticket._id
                          )
                        }
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === ticket._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
                        >
                          <button
                            onClick={() => handleView(ticket._id)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <FaEye className="mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(ticket._id)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ticket._id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {tickets.map((ticket, index) => (
              <div
                key={ticket._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">{ticket.personName}</h2>
                <p className="text-sm">Email: {ticket.email}</p>
                <p className="text-sm">Phone: {ticket.personNumber}</p>
                <p className="text-sm">Address: {ticket.address}</p>
                <p className="text-sm">Category: {ticket.category}</p>
                <p className="text-sm">Severity: {ticket.severity}</p>
                <p className="text-sm">Price: {ticket.price}</p>
                <p className="text-sm">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(ticket._id)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(ticket._id)}
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="text-red-600 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}