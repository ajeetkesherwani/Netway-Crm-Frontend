import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getAllTicketList } from "../../service/ticket"; // Your existing API call

export default function ManageTicket() {
  const [tickets, setTickets] = useState({
    openTickets: [],
    assignedTickets: [],
    approvalTickets: [],
  });
  // const [counts, setCounts] = useState({
  //   openCount: 0,
  //   assignedCount: 0,
  //   approvalCount: 0,
  // });

  const [searchUser, setSearchUser] = useState("");
  const [searchTicket, setSearchTicket] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [ticketSuggestions, setTicketSuggestions] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({
    open: [],
    assigned: [],
    approval: [],
  });

  const navigate = useNavigate();

  // ✅ Fetch Ticket List from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getAllTicketList(1, 10, "", "Manage");
        if (res.status && res.data) {
          const { openTickets, assignedTickets, approvalTickets } = res.data;
          setTickets({
            openTickets: openTickets || [],
            assignedTickets: assignedTickets || [],
            approvalTickets: approvalTickets || [],
          });

          // Set counts from response
          setCounts({
            openCount: res.data.openCount || 0,
            assignedCount: res.data.assignedCount || 0,
            approvalCount: res.data.approvalCount || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  // 🔍 Combine all tickets for searching
  const allTickets = [
    ...tickets.openTickets,
    ...tickets.assignedTickets,
    ...tickets.approvalTickets,
  ];

  // 🔍 Search User by Name
  const handleUserSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchUser(value);

    if (!value) return setUserSuggestions([]);

    const filtered = allTickets.filter((t) =>
      t.personName?.toLowerCase().includes(value)
    );
    setUserSuggestions(filtered.slice(0, 5));
  };

  // 🔍 Search Ticket by Number
  const handleTicketSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTicket(value);

    if (!value) return setTicketSuggestions([]);

    const filtered = allTickets.filter((t) =>
      t.ticketNumber?.toLowerCase().includes(value)
    );
    setTicketSuggestions(filtered.slice(0, 5));
  };

  // 🧭 Navigation Handlers
  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);
  const handleUserClick = (name) => navigate(`/user/detail/${name}`);

  // ✅ Checkbox handling
  const toggleSelectAll = (type) => {
    const list = tickets[`${type}Tickets`];
    if (selectedTickets[type].length === list.length) {
      setSelectedTickets((prev) => ({ ...prev, [type]: [] }));
    } else {
      setSelectedTickets((prev) => ({
        ...prev,
        [type]: list.map((t) => t._id),
      }));
    }
  };

  const toggleSingleSelect = (type, id) => {
    setSelectedTickets((prev) => {
      const exists = prev[type].includes(id);
      const updated = exists
        ? prev[type].filter((tid) => tid !== id)
        : [...prev[type], id];
      return { ...prev, [type]: updated };
    });
  };

  return (
    <div className="p-5 bg-[#edf2f7] min-h-screen">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold text-gray-800">🎫Manage Ticket</h1>

        <div className="flex space-x-3">
          {/* <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
            Open: {counts.openCount}
          </span>
          <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded text-xs font-semibold">
            Assigned: {counts.assignedCount}
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold">
            Approval: {counts.approvalCount}
          </span> */}
        </div>
      </div>

      {/* 🔹 Search Bars */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        {/* User Search */}
        <div className="relative w-56">
          <input
            type="text"
            placeholder="Search User..."
            value={searchUser}
            onChange={handleUserSearch}
            className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm"
          />
          <FaSearch className="absolute right-2 top-3 text-gray-400" />
          {userSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
              {userSuggestions.map((u) => (
                <li
                  key={u._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(u.personName)}
                >
                  {u.personName} ({u.personNumber})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ticket Search */}
        <div className="relative w-56">
          <input
            type="text"
            placeholder="Search Ticket..."
            value={searchTicket}
            onChange={handleTicketSearch}
            className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm"
          />
          <FaSearch className="absolute right-2 top-3 text-gray-400" />
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

      {/* 🔹 Ticket Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TicketColumn
          title="Open Ticket"
          color="bg-[#0f3057]"
          tickets={tickets.openTickets}
          type="open"
          selectedTickets={selectedTickets}
          toggleSelectAll={toggleSelectAll}
          toggleSingleSelect={toggleSingleSelect}
          handleTicketClick={handleTicketClick}
          handleUserClick={handleUserClick}
        />

        <TicketColumn
          title="Assign Ticket"
          color="bg-[#003865]"
          tickets={tickets.assignedTickets}
          type="assigned"
          selectedTickets={selectedTickets}
          toggleSelectAll={toggleSelectAll}
          toggleSingleSelect={toggleSingleSelect}
          handleTicketClick={handleTicketClick}
          handleUserClick={handleUserClick}
        />

        <TicketColumn
          title="Approval Queue"
          color="bg-[#002b5c]"
          tickets={tickets.approvalTickets}
          type="approval"
          selectedTickets={selectedTickets}
          toggleSelectAll={toggleSelectAll}
          toggleSingleSelect={toggleSingleSelect}
          handleTicketClick={handleTicketClick}
          handleUserClick={handleUserClick}
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
  selectedTickets,
  toggleSelectAll,
  toggleSingleSelect,
  handleTicketClick,
  handleUserClick,
}) => (
  <div className="bg-white rounded-md shadow-md border">
    {/* Column Header */}
    <div
      className={`flex justify-between items-center px-4 py-2 text-white ${color} rounded-t-md`}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={
            selectedTickets[type].length === tickets.length &&
            tickets.length > 0
          }
          onChange={() => toggleSelectAll(type)}
        />
        <span className="font-semibold">{title}</span>
      </div>
      <span className="bg-orange-400 text-white px-2 py-0.5 text-xs rounded">
        {tickets.length}
      </span>
    </div>

    {/* Ticket List */}
    <div className="max-h-[70vh] overflow-y-auto">
      {tickets.length === 0 ? (
        <p className="text-center text-red-500 py-4">No Record Available</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="border-b px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTickets[type].includes(ticket._id)}
                  onChange={() => toggleSingleSelect(type, ticket._id)}
                />
                <p
                  onClick={() => handleTicketClick(ticket._id)}
                  className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
                >
                  {ticket.ticketNumber || "No Ticket Number"}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              <p>
                <strong>User:</strong>{" "}
                <span
                  className="text-blue-700 cursor-pointer hover:underline"
                  onClick={() => handleUserClick(ticket.personName)}
                >
                  {ticket.personName}
                </span>
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
              {/* {ticket.assignToId && (
                <p>
                  <strong>Assigned To:</strong> {ticket.assignToId}
                </p>
              )} */}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
