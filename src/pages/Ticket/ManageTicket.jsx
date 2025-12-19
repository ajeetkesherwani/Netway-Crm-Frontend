// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import { getAllTicketList } from "../../service/ticket";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function ManageTicket() {
//   const [tickets, setTickets] = useState({
//     openTickets: [],
//     assignedTickets: [],
//   });

//   const [searchTicket, setSearchTicket] = useState("");
//   const [ticketSuggestions, setTicketSuggestions] = useState([]);

//   // Pagination for each tab
//   const [pages, setPages] = useState({
//     open: 1,
//     assigned: 1,
//   });

//   const limit = 10;
//   const navigate = useNavigate();

//   // ✅ Fetch Ticket List from API
//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const res = await getAllTicketList(1, 100, "", "Manage");
//         if (res.status && res.data) {
//           const { openTickets, assignedTickets } = res.data;
//           setTickets({
//             openTickets: openTickets || [],
//             assignedTickets: assignedTickets || [],
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//       }
//     };
//     fetchTickets();
//   }, []);

//   // 🔍 Combine all tickets for search
//   const allTickets = [...tickets.openTickets, ...tickets.assignedTickets];

//   // 🔍 Ticket search
//   const handleTicketSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTicket(value);
//     if (!value) return setTicketSuggestions([]);
//     const filtered = allTickets.filter((t) =>
//       t.ticketNumber?.toLowerCase().includes(value)
//     );
//     setTicketSuggestions(filtered.slice(0, 5));
//   };

//   // 🧭 Navigation
//   const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

//   // ✅ Pagination handlers
//   const handlePrevPage = (type) => {
//     setPages((prev) => ({ ...prev, [type]: Math.max(1, prev[type] - 1) }));
//   };

//   const handleNextPage = (type, totalPages) => {
//     setPages((prev) => ({
//       ...prev,
//       [type]: Math.min(totalPages, prev[type] + 1),
//     }));
//   };

//   return (
//     <div className="p-5 bg-[#edf2f7] min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="text-xl font-bold text-gray-800">🎫 Manage Ticket</h1>
//       </div>

//       {/* Ticket Search Bar */}
//       <div className="flex justify-center mb-6">
//         <div className="relative w-80">
//           <input
//             type="text"
//             placeholder="Search Ticket..."
//             value={searchTicket}
//             onChange={handleTicketSearch}
//             className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//           />
//           <FaSearch className="absolute right-3 top-3 text-gray-400" />
//           {ticketSuggestions.length > 0 && (
//             <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
//               {ticketSuggestions.map((t) => (
//                 <li
//                   key={t._id}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleTicketClick(t._id)}
//                 >
//                   {t.ticketNumber || "No Number"} - {t.personName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Ticket Columns */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <ProtectedAction module="tickets" action="manageOpenList">
//           <TicketColumn
//             title="Open Ticket"
//             color="bg-[#0f3057]"
//             tickets={tickets.openTickets}
//             type="open"
//             page={pages.open}
//             limit={limit}
//             handleTicketClick={handleTicketClick}
//             handlePrevPage={handlePrevPage}
//             handleNextPage={handleNextPage}
//           />
//         </ProtectedAction>

//         <ProtectedAction module="tickets" action="manageAssignTicketList">
//           <TicketColumn
//             title="Assign Ticket"
//             color="bg-[#003865]"
//             tickets={tickets.assignedTickets}
//             type="assigned"
//             page={pages.assigned}
//             limit={limit}
//             handleTicketClick={handleTicketClick}
//             handlePrevPage={handlePrevPage}
//             handleNextPage={handleNextPage}
//           />
//         </ProtectedAction>
//       </div>
//     </div>
//   );
// }

// // 🔸 Ticket Column Component
// const TicketColumn = ({
//   title,
//   color,
//   tickets,
//   type,
//   page,
//   limit,
//   handleTicketClick,
//   handlePrevPage,
//   handleNextPage,
// }) => {
//   const totalPages = Math.ceil(tickets.length / limit) || 1;
//   const paginatedTickets = tickets.slice((page - 1) * limit, page * limit);

//   return (
//     <div className="bg-white rounded-md shadow-md border flex flex-col justify-between">
//       {/* Column Header */}
//       <div
//         className={`flex justify-between items-center px-4 py-2 text-white ${color} rounded-t-md`}
//       >
//         <span className="font-semibold">{title}</span>
//         <span className="bg-orange-400 text-white px-2 py-0.5 text-xs rounded">
//           {tickets.length}
//         </span>
//       </div>

//       {/* Ticket List */}
//       <div className="max-h-[70vh] overflow-y-auto flex-1">
//         {tickets.length === 0 ? (
//           <p className="text-center text-red-500 py-4">No Record Available</p>
//         ) : (
//           paginatedTickets.map((ticket) => (
//             <div
//               key={ticket._id}
//               className="border-b px-4 py-3 hover:bg-gray-50 transition"
//             >
//               <div className="flex justify-between items-center">
//                 <p
//                   onClick={() => handleTicketClick(ticket._id)}
//                   className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
//                 >
//                   {ticket.ticketNumber || "No Ticket Number"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(ticket.createdAt).toLocaleString()}
//                 </p>
//               </div>
//               <div className="mt-1 text-sm text-gray-700">
//                 <p>
//                   <strong>User:</strong> {ticket.personName}
//                 </p>
//                 <p>
//                   <strong>Call Source:</strong> {ticket.callSource}
//                 </p>
//                 <p>
//                   <strong>Zone Name:</strong> {ticket.userId?.addressDetails?.area?.zoneName || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Severity:</strong> {ticket.severity}
//                 </p>
//                 <p>
//                   <strong>Address:</strong> {ticket.address}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ✅ Always Visible Pagination Controls */}
//       <div className="flex justify-between items-center px-4 py-2 border-t text-sm bg-gray-50">
//         <button
//           onClick={() => handlePrevPage(type)}
//           disabled={page === 1}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
//         >
//           Prev
//         </button>
//         <span className="font-medium text-gray-700">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handleNextPage(type, totalPages)}
//           disabled={page === totalPages}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
// import { getAllTicketList } from "../../service/ticket";
// import { getZones } from "../../service/apiClient";
// import ProtectedAction from "../../components/ProtectedAction";

// export default function ManageTicket() {
//   const [tickets, setTickets] = useState({
//     openTickets: [],
//     assignedTickets: [],
//   });

//   const [searchTicket, setSearchTicket] = useState("");
//   const [ticketSuggestions, setTicketSuggestions] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [selectedSeverity, setSelectedSeverity] = useState("all");

//   // Zone selection & show more per column
//   const [selectedZoneOpen, setSelectedZoneOpen] = useState(null);
//   const [showMoreOpen, setShowMoreOpen] = useState(false); // start collapsed

//   const [selectedZoneAssigned, setSelectedZoneAssigned] = useState(null);
//   const [showMoreAssigned, setShowMoreAssigned] = useState(false); // start collapsed

//   // Pagination
//   const [pages, setPages] = useState({
//     open: 1,
//     assigned: 1,
//   });

//   const limit = 10;
//   const navigate = useNavigate();

//   const getZoneName = (ticket) =>
//     ticket.userId?.addressDetails?.area?.zoneName || null;

//   // Fetch Tickets
//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const res = await getAllTicketList(1, 100, "", "Manage");
//         if (res.status && res.data) {
//           const { openTickets, assignedTickets } = res.data;
//           setTickets({
//             openTickets: openTickets || [],
//             assignedTickets: assignedTickets || [],
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//       }
//     };
//     fetchTickets();
//   }, []);

//   // Fetch Zones
//   useEffect(() => {
//     const fetchZones = async () => {
//       try {
//         const response = await getZones();
//         let zoneArray = [];
//         if (Array.isArray(response)) zoneArray = response;
//         else if (response?.data && Array.isArray(response.data)) zoneArray = response.data;
//         else if (response?.zones && Array.isArray(response.zones)) zoneArray = response.zones;
//         setZones(zoneArray);
//       } catch (err) {
//         console.error("Error fetching zones:", err);
//         setZones([]);
//       }
//     };
//     fetchZones();
//   }, []);

//   const allTickets = [...tickets.openTickets, ...tickets.assignedTickets];

//   const handleTicketSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTicket(value);
//     if (!value) return setTicketSuggestions([]);
//     const filtered = allTickets.filter((t) =>
//       t.ticketNumber?.toLowerCase().includes(value) ||
//       t.personName?.toLowerCase().includes(value) ||
//       t.email?.toLowerCase().includes(value) ||
//       t.phone?.toLowerCase().includes(value)
//     );
//     setTicketSuggestions(filtered.slice(0, 5));
//   };

//   const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

//   const handlePrevPage = (type) => {
//     setPages((prev) => ({ ...prev, [type]: Math.max(1, prev[type] - 1) }));
//   };

//   const handleNextPage = (type, totalPages) => {
//     setPages((prev) => ({
//       ...prev,
//       [type]: Math.min(totalPages, prev[type] + 1),
//     }));
//   };

//   const handleResetPage = (type) => {
//     setPages((prev) => ({ ...prev, [type]: 1 }));
//   };

//   const severityCounts = useMemo(() => {
//     const counts = { high: 0, medium: 0, low: 0, all: allTickets.length };
//     allTickets.forEach((t) => {
//       const sev = (t.severity || "").toLowerCase();
//       if (sev === "high") counts.high++;
//       else if (sev === "medium") counts.medium++;
//       else if (sev === "low") counts.low++;
//     });
//     return counts;
//   }, [allTickets]);

//   const handleSeverityChange = (sev) => {
//     setSelectedSeverity(sev);
//     setPages({ open: 1, assigned: 1 });
//   };

//   const openZoneCounts = useMemo(() => {
//     const counts = {};
//     zones.forEach((zone) => (counts[zone.zoneName] = 0));
//     tickets.openTickets.forEach((t) => {
//       const zn = getZoneName(t);
//       if (zn && counts[zn] !== undefined) counts[zn]++;
//     });
//     return counts;
//   }, [tickets.openTickets, zones]);

//   const assignedZoneCounts = useMemo(() => {
//     const counts = {};
//     zones.forEach((zone) => (counts[zone.zoneName] = 0));
//     tickets.assignedTickets.forEach((t) => {
//       const zn = getZoneName(t);
//       if (zn && counts[zn] !== undefined) counts[zn]++;
//     });
//     return counts;
//   }, [tickets.assignedTickets, zones]);

//   const visibleOpenZones = showMoreOpen ? zones : zones.slice(0, 8);
//   const visibleAssignedZones = showMoreAssigned ? zones : zones.slice(0, 8);

//   return (
//     <div className="p-5 bg-[#edf2f7] min-h-screen">
//       {/* Header with Severity Buttons */}
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="text-xl font-bold text-gray-800">🎫 Manage Ticket</h1>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleSeverityChange("high")}
//             className={`px-3 py-1 rounded text-sm ${
//               selectedSeverity === "high" ? "bg-red-600" : "bg-red-500"
//             } text-white`}
//           >
//             High {severityCounts.high}
//           </button>
//           <button
//             onClick={() => handleSeverityChange("medium")}
//             className={`px-3 py-1 rounded text-sm ${
//               selectedSeverity === "medium" ? "bg-yellow-600" : "bg-yellow-500"
//             } text-white`}
//           >
//             Medium {severityCounts.medium}
//           </button>
//           <button
//             onClick={() => handleSeverityChange("low")}
//             className={`px-3 py-1 rounded text-sm ${
//               selectedSeverity === "low" ? "bg-green-600" : "bg-green-500"
//             } text-white`}
//           >
//             Low {severityCounts.low}
//           </button>
//           <button
//             onClick={() => handleSeverityChange("all")}
//             className={`px-4 py-1 rounded text-sm border ${
//               selectedSeverity === "all" ? "bg-gray-300" : "bg-white"
//             } text-gray-800`}
//           >
//             All Ticket
//           </button>
//         </div>
//         <div className="relative w-80">
//           <input
//             type="text"
//             placeholder="Search Ticket..."
//             value={searchTicket}
//             onChange={handleTicketSearch}
//             className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//           />
//           <FaSearch className="absolute right-3 top-3 text-gray-400" />
//           {ticketSuggestions.length > 0 && (
//             <ul className="absolute bg-white border w-full rounded mt-1 shadow-md z-50 text-sm">
//               {ticketSuggestions.map((t) => (
//                 <li
//                   key={t._id}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleTicketClick(t._id)}
//                 >
//                   {t.ticketNumber || "No Number"} - {t.personName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Columns */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <ProtectedAction module="tickets" action="manageOpenList">
//           <div>
//             {/* Zones above Open Ticket */}
//             <div className="mb-3 flex flex-wrap gap-2">
//               {visibleOpenZones.map((z) => (
//                 <button
//                   key={z._id}
//                   onClick={() => {
//                     setSelectedZoneOpen(selectedZoneOpen === z.zoneName ? null : z.zoneName);
//                     setPages((prev) => ({ ...prev, open: 1 }));
//                   }}
//                   className={`px-4 py-2 rounded text-sm ${
//                     selectedZoneOpen === z.zoneName
//                       ? "bg-blue-600 text-white"
//                       : "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                   }`}
//                 >
//                   {z.zoneName} ({openZoneCounts[z.zoneName] || 0})
//                 </button>
//               ))}
//               {zones.length > 8 && (
//                 <button
//                   onClick={() => setShowMoreOpen(!showMoreOpen)}
//                   className="px-4 py-2 rounded text-sm bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-1"
//                 >
//                   {showMoreOpen ? <FaMinus /> : <FaPlus />}
//                   {showMoreOpen ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>

//             <TicketColumn
//               title="Open Ticket"
//               color="bg-[#0f3057]"
//               tickets={tickets.openTickets}
//               type="open"
//               page={pages.open}
//               limit={limit}
//               handleTicketClick={handleTicketClick}
//               handlePrevPage={handlePrevPage}
//               handleNextPage={handleNextPage}
//               selectedSeverity={selectedSeverity}
//               selectedZone={selectedZoneOpen}
//             />
//           </div>
//         </ProtectedAction>

//         <ProtectedAction module="tickets" action="manageAssignTicketList">
//           <div>
//             {/* Zones above Assign Ticket */}
//             <div className="mb-3 flex flex-wrap gap-2">
//               {visibleAssignedZones.map((z) => (
//                 <button
//                   key={z._id}
//                   onClick={() => {
//                     setSelectedZoneAssigned(selectedZoneAssigned === z.zoneName ? null : z.zoneName);
//                     setPages((prev) => ({ ...prev, assigned: 1 }));
//                   }}
//                   className={`px-4 py-2 rounded text-sm ${
//                     selectedZoneAssigned === z.zoneName
//                       ? "bg-blue-600 text-white"
//                       : "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                   }`}
//                 >
//                   {z.zoneName} ({assignedZoneCounts[z.zoneName] || 0})
//                 </button>
//               ))}
//               {zones.length > 8 && (
//                 <button
//                   onClick={() => setShowMoreAssigned(!showMoreAssigned)}
//                   className="px-4 py-2 rounded text-sm bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-1"
//                 >
//                   {showMoreAssigned ? <FaMinus /> : <FaPlus />}
//                   {showMoreAssigned ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>

//             <TicketColumn
//               title="Assign Ticket"
//               color="bg-[#003865]"
//               tickets={tickets.assignedTickets}
//               type="assigned"
//               page={pages.assigned}
//               limit={limit}
//               handleTicketClick={handleTicketClick}
//               handlePrevPage={handlePrevPage}
//               handleNextPage={handleNextPage}
//               selectedSeverity={selectedSeverity}
//               selectedZone={selectedZoneAssigned}
//             />
//           </div>
//         </ProtectedAction>
//       </div>
//     </div>
//   );
// }

// // Ticket Column
// const TicketColumn = ({
//   title,
//   color,
//   tickets,
//   type,
//   page,
//   limit,
//   handleTicketClick,
//   handlePrevPage,
//   handleNextPage,
//   selectedSeverity,
//   selectedZone,
// }) => {
//   const getZoneName = (ticket) =>
//     ticket.userId?.addressDetails?.area?.zoneName || null;

//   const filteredTickets = useMemo(() => {
//     return tickets.filter((t) => {
//       const zoneMatch = !selectedZone || getZoneName(t) === selectedZone;
//       const severityMatch =
//         selectedSeverity === "all" ||
//         (t.severity || "").toLowerCase() === selectedSeverity;
//       return zoneMatch && severityMatch;
//     });
//   }, [tickets, selectedZone, selectedSeverity]);

//   const totalPages = Math.ceil(filteredTickets.length / limit) || 1;
//   const paginatedTickets = filteredTickets.slice(
//     (page - 1) * limit,
//     page * limit
//   );

//   return (
//     <div className="bg-white rounded-md shadow-md border flex flex-col justify-between">
//       <div
//         className={`flex justify-between items-center px-4 py-2 text-white ${color} rounded-t-md`}
//       >
//         <span className="font-semibold">{title}</span>
//         <span className="bg-orange-400 text-white px-2 py-0.5 text-xs rounded">
//           {filteredTickets.length}
//         </span>
//       </div>
//       <div className="max-h-[70vh] overflow-y-auto flex-1">
//         {filteredTickets.length === 0 ? (
//           <p className="text-center text-red-500 py-4">No Record Available</p>
//         ) : (
//           paginatedTickets.map((ticket) => (
//             <div
//               key={ticket._id}
//               className="border-b px-4 py-3 hover:bg-gray-50 transition"
//             >
//               <div className="flex justify-between items-center">
//                 <p
//                   onClick={() => handleTicketClick(ticket._id)}
//                   className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
//                 >
//                   {ticket.ticketNumber || "No Ticket Number"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(ticket.createdAt).toLocaleString()}
//                 </p>
//               </div>
//               <div className="mt-1 text-sm text-gray-700 grid grid-cols-2 gap-2">
//                 <p>
//                   <strong>User:</strong> {ticket.personName}
//                 </p>
//                 <p>
//                   <strong>Call Source:</strong> {ticket.callSource}
//                 </p>
//                 <p>
//                   <strong>Zone Name:</strong> {getZoneName(ticket) || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Severity:</strong> {ticket.severity}
//                 </p>
//                 <p className="col-span-2">
//                   <strong>Address:</strong> {ticket.address}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       <div className="flex justify-between items-center px-4 py-2 border-t text-sm bg-gray-50">
//         <button
//           onClick={() => handlePrevPage(type)}
//           disabled={page === 1}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
//         >
//           Prev
//         </button>
//         <span className="font-medium text-gray-700">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handleNextPage(type, totalPages)}
//           disabled={page === totalPages}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { getAllTicketList } from "../../service/ticket";
import { getZones } from "../../service/apiClient";
import ProtectedAction from "../../components/ProtectedAction";

export default function ManageTicket() {
  const [tickets, setTickets] = useState({
    openTickets: [],
    assignedTickets: [],
  });

  const [searchTicket, setSearchTicket] = useState("");
  const [ticketSuggestions, setTicketSuggestions] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  // Zone selection & show more per column
  const [selectedZoneOpen, setSelectedZoneOpen] = useState(null);
  const [showMoreOpen, setShowMoreOpen] = useState(false);

  const [selectedZoneAssigned, setSelectedZoneAssigned] = useState(null);
  const [showMoreAssigned, setShowMoreAssigned] = useState(false);

  // Pagination
  const [pages, setPages] = useState({
    open: 1,
    assigned: 1,
  });

  const limit = 10;
  const navigate = useNavigate();

  const getZoneName = (ticket) =>
    ticket.userId?.addressDetails?.area?.zoneName || null;

  // Fetch Tickets
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

  // Fetch Zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getZones();
        let zoneArray = [];
        if (Array.isArray(response)) zoneArray = response;
        else if (response?.data && Array.isArray(response.data)) zoneArray = response.data;
        else if (response?.zones && Array.isArray(response.zones)) zoneArray = response.zones;
        setZones(zoneArray);
      } catch (err) {
        console.error("Error fetching zones:", err);
        setZones([]);
      }
    };
    fetchZones();
  }, []);

  const allTickets = [...tickets.openTickets, ...tickets.assignedTickets];

  const handleTicketSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTicket(value);
    if (!value) return setTicketSuggestions([]);
    const filtered = allTickets.filter((t) =>
      t.ticketNumber?.toLowerCase().includes(value) ||
      t.personName?.toLowerCase().includes(value) ||
      t.email?.toLowerCase().includes(value) ||
      t.phone?.toLowerCase().includes(value)
    );
    setTicketSuggestions(filtered.slice(0, 5));
  };

  const handleTicketClick = (id) => navigate(`/ticket/view/${id}`);

  const handlePrevPage = (type) => {
    setPages((prev) => ({ ...prev, [type]: Math.max(1, prev[type] - 1) }));
  };

  const handleNextPage = (type, totalPages) => {
    setPages((prev) => ({
      ...prev,
      [type]: Math.min(totalPages, prev[type] + 1),
    }));
  };

  const handleResetPage = (type) => {
    setPages((prev) => ({ ...prev, [type]: 1 }));
  };

  const severityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, all: allTickets.length };
    allTickets.forEach((t) => {
      const sev = (t.severity || "").toLowerCase();
      if (sev === "high") counts.high++;
      else if (sev === "medium") counts.medium++;
      else if (sev === "low") counts.low++;
    });
    return counts;
  }, [allTickets]);

  // When clicking "All Ticket" → clear severity + clear any zone filter in both columns
  const handleSeverityChange = (sev) => {
    setSelectedSeverity(sev);
    setSelectedZoneOpen(null);     // Clear zone filter for Open
    setSelectedZoneAssigned(null); // Clear zone filter for Assigned
    setPages({ open: 1, assigned: 1 });
  };

  const openZoneCounts = useMemo(() => {
    const counts = {};
    zones.forEach((zone) => (counts[zone.zoneName] = 0));
    tickets.openTickets.forEach((t) => {
      const zn = getZoneName(t);
      if (zn && counts[zn] !== undefined) counts[zn]++;
    });
    return counts;
  }, [tickets.openTickets, zones]);

  const assignedZoneCounts = useMemo(() => {
    const counts = {};
    zones.forEach((zone) => (counts[zone.zoneName] = 0));
    tickets.assignedTickets.forEach((t) => {
      const zn = getZoneName(t);
      if (zn && counts[zn] !== undefined) counts[zn]++;
    });
    return counts;
  }, [tickets.assignedTickets, zones]);

  const visibleOpenZones = showMoreOpen ? zones : zones.slice(0, 8);
  const visibleAssignedZones = showMoreAssigned ? zones : zones.slice(0, 8);

  return (
    <div className="p-5 bg-[#edf2f7] min-h-screen">
      {/* Header with Severity Buttons on same row */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold text-gray-800">🎫 Manage Ticket</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSeverityChange("high")}
            className={`px-3 py-1 rounded text-sm ${
              selectedSeverity === "high" ? "bg-red-600" : "bg-red-500"
            } text-white`}
          >
            High {severityCounts.high}
          </button>
          <button
            onClick={() => handleSeverityChange("medium")}
            className={`px-3 py-1 rounded text-sm ${
              selectedSeverity === "medium" ? "bg-yellow-600" : "bg-yellow-500"
            } text-white`}
          >
            Medium {severityCounts.medium}
          </button>
          <button
            onClick={() => handleSeverityChange("low")}
            className={`px-3 py-1 rounded text-sm ${
              selectedSeverity === "low" ? "bg-green-600" : "bg-green-500"
            } text-white`}
          >
            Low {severityCounts.low}
          </button>
          <button
            onClick={() => handleSeverityChange("all")}
            className={`px-4 py-1 rounded text-sm border ${
              selectedSeverity === "all" ? "bg-gray-300" : "bg-white"
            } text-gray-800`}
          >
            All Ticket
          </button>
        </div>
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

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProtectedAction module="tickets" action="manageOpenList">
          <div>
            {/* Zones above Open Ticket */}
            <div className="mb-3 flex flex-wrap gap-2">
              {visibleOpenZones.map((z) => (
                <button
                  key={z._id}
                  onClick={() => {
                    setSelectedZoneOpen(z.zoneName);
                    handleResetPage("open");
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    selectedZoneOpen === z.zoneName
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {z.zoneName} ({openZoneCounts[z.zoneName] || 0})
                </button>
              ))}
              {zones.length > 8 && (
                <button
                  onClick={() => setShowMoreOpen(!showMoreOpen)}
                  className="px-4 py-2 rounded text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-1"
                >
                  {showMoreOpen ? <FaMinus /> : <FaPlus />}
                  {showMoreOpen ? "Show less" : "Show more"}
                </button>
              )}
            </div>

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
              selectedSeverity={selectedSeverity}
              selectedZone={selectedZoneOpen}
            />
          </div>
        </ProtectedAction>

        <ProtectedAction module="tickets" action="manageAssignTicketList">
          <div>
            {/* Zones above Assign Ticket */}
            <div className="mb-3 flex flex-wrap gap-2">
              {visibleAssignedZones.map((z) => (
                <button
                  key={z._id}
                  onClick={() => {
                    setSelectedZoneAssigned(z.zoneName);
                    handleResetPage("assigned");
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    selectedZoneAssigned === z.zoneName
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {z.zoneName} ({assignedZoneCounts[z.zoneName] || 0})
                </button>
              ))}
              {zones.length > 8 && (
                <button
                  onClick={() => setShowMoreAssigned(!showMoreAssigned)}
                  className="px-4 py-2 rounded text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-1"
                >
                  {showMoreAssigned ? <FaMinus /> : <FaPlus />}
                  {showMoreAssigned ? "Show less" : "Show more"}
                </button>
              )}
            </div>

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
              selectedSeverity={selectedSeverity}
              selectedZone={selectedZoneAssigned}
            />
          </div>
        </ProtectedAction>
      </div>
    </div>
  );
}

// Ticket Column
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
  selectedSeverity,
  selectedZone,
}) => {
  const getZoneName = (ticket) =>
    ticket.userId?.addressDetails?.area?.zoneName || null;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const zoneMatch = !selectedZone || getZoneName(t) === selectedZone;
      const severityMatch =
        selectedSeverity === "all" ||
        (t.severity || "").toLowerCase() === selectedSeverity;
      return zoneMatch && severityMatch;
    });
  }, [tickets, selectedZone, selectedSeverity]);

  const totalPages = Math.ceil(filteredTickets.length / limit) || 1;
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="bg-white rounded-md shadow-md border flex flex-col justify-between">
      <div
        className={`flex justify-between items-center px-4 py-2 text-white ${color} rounded-t-md`}
      >
        <span className="font-semibold">{title}</span>
        <span className="bg-orange-400 text-white px-2 py-0.5 text-xs rounded">
          {filteredTickets.length}
        </span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto flex-1">
        {filteredTickets.length === 0 ? (
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
              <div className="mt-1 text-sm text-gray-700 grid grid-cols-2 gap-2">
                <p>
                  <strong>User:</strong> {ticket.personName}
                </p>
                <p>
                  <strong>Call Source:</strong> {ticket.callSource}
                </p>
                <p>
                  <strong>Zone Name:</strong> {getZoneName(ticket) || "N/A"}
                </p>
                <p>
                  <strong>Severity:</strong> {ticket.severity}
                </p>
                <p className="col-span-2">
                  <strong>Address:</strong> {ticket.address}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
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