// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserFullDetails } from "../../service/user";

// const UserTickets = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!id) return;
//       try {
//         const res = await getUserFullDetails(id);
//         if (res.status) {
//           setData(res);
//         }
//       } catch (err) {
//         console.error("Error fetching ticket data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id]);

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           padding: "60px",
//           textAlign: "center",
//           fontSize: "20px",
//           background: "#f9f9f9",
//           minHeight: "100vh",
//         }}
//       >
//         Loading tickets...
//       </div>
//     );
//   }

//   const tickets = data?.tickets || [];

//   return (
//     <div
//       style={{
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         background: "#f9f9f9",
//         minHeight: "100vh",
//       }}
//     >
//       {/* TICKETS TABLE - Same Style as Payments */}
//       <div style={{ marginBottom: "40px" }}>
//         {tickets.length > 0 ? (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "10px",
//               overflow: "hidden",
//               border: "1px solid #ddd",
//               fontSize: "14.5px",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr
//                   style={{
//                     background: "#e6e6e6",
//                     color: "#000",
//                     borderBottom: "1px solid #ccc",
//                   }}
//                 >
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Ticket No</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Person Name</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Contact</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Email</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Severity</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Status</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Assigned To</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Created On</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {tickets.map((ticket, index) => (
//                   <tr
//                     key={ticket._id}
//                     style={{
//                       background: index % 2 === 0 ? "#fafafa" : "#fff",
//                       borderBottom: "1px solid #eee",
//                     }}
//                   >
//                     <td style={{ padding: "14px 12px", fontWeight: "600", color: "#333" }}>
//                       {ticket.ticketNumber || "-"}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       {ticket.personName || "-"}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       {ticket.personNumber || "-"}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       {ticket.email || "-"}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           background:
//                             ticket.severity === "High"
//                               ? "#ffebee"
//                               : ticket.severity === "Medium"
//                               ? "#fff3e0"
//                               : "#e8f5e8",
//                           color:
//                             ticket.severity === "High"
//                               ? "#c62828"
//                               : ticket.severity === "Medium"
//                               ? "#ef6c00"
//                               : "#2e7d32",
//                           padding: "4px 10px",
//                           borderRadius: "4px",
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {ticket.severity || "Low"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           background:
//                             ticket.status === "Assigned"
//                               ? "#fff3cd"
//                               : ticket.status === "Completed"
//                               ? "#d4edda"
//                               : ticket.status === "Pending"
//                               ? "#f8d7da"
//                               : "#f0f0f0",
//                           color:
//                             ticket.status === "Assigned"
//                               ? "#856404"
//                               : ticket.status === "Completed"
//                               ? "#155724"
//                               : ticket.status === "Pending"
//                               ? "#721c24"
//                               : "#333",
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           fontSize: "12.5px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {ticket.status || "Unknown"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "14px 12px", fontSize: "13.5px" }}>
//                       {ticket.assignToId?.name || "Not Assigned"}
//                     </td>

//                     <td style={{ padding: "14px 12px", color: "#555" }}>
//                       {formatDateTime(ticket.createdAt)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "50px",
//               background: "#fff",
//               borderRadius: "10px",
//               color: "#999",
//               fontSize: "17px",
//               border: "1px solid #ddd",
//             }}
//           >
//             No tickets found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserTickets;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";

const UserTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await getUserFullDetails(id);
        if (res.status) {
          setData(res);
        }
      } catch (err) {
        console.error("Error fetching ticket data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl bg-gray-50 min-h-screen">
        Loading tickets...
      </div>
    );
  }

  const tickets = data?.tickets || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Create Ticket Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">User Tickets</h2>
        <button
          onClick={() => navigate("/ticket/create", { state: { userId: id } })} 
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          Create New Ticket
        </button>
      </div>

      {/* Tickets Table */}
      {tickets.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Ticket No</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Person Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Contact</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Email</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Severity</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Status</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Assigned To</th>
                  <th className="px-4 py-3 font-semibold">Created On</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className={`hover:bg-gray-50 border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-800 border-r border-gray-200">
                      {ticket.ticketNumber || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {ticket.personName || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {ticket.personNumber || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {ticket.email || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          ticket.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : ticket.severity === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.severity || "Low"}
                      </span>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          ticket.status === "Assigned"
                            ? "bg-yellow-100 text-yellow-800"
                            : ticket.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "Pending"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {ticket.assignToId?.name || "Not Assigned"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDateTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No tickets found for this user.
        </div>
      )}
    </div>
  );
};

export default UserTickets;