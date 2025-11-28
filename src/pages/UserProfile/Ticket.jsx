import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";

const UserTickets = () => {
  const { id } = useParams();
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
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          fontSize: "20px",
          background: "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        Loading tickets...
      </div>
    );
  }

  const tickets = data?.tickets || [];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* TICKETS TABLE - Same Style as Payments */}
      <div style={{ marginBottom: "40px" }}>
        {tickets.length > 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ddd",
              fontSize: "14.5px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#e6e6e6",
                    color: "#000",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Ticket No</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Person Name</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Contact</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Severity</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Assigned To</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Created On</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    style={{
                      background: index % 2 === 0 ? "#fafafa" : "#fff",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: "14px 12px", fontWeight: "600", color: "#333" }}>
                      {ticket.ticketNumber || "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {ticket.personName || "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {ticket.personNumber || "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {ticket.email || "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          background:
                            ticket.severity === "High"
                              ? "#ffebee"
                              : ticket.severity === "Medium"
                              ? "#fff3e0"
                              : "#e8f5e8",
                          color:
                            ticket.severity === "High"
                              ? "#c62828"
                              : ticket.severity === "Medium"
                              ? "#ef6c00"
                              : "#2e7d32",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {ticket.severity || "Low"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          background:
                            ticket.status === "Assigned"
                              ? "#fff3cd"
                              : ticket.status === "Completed"
                              ? "#d4edda"
                              : ticket.status === "Pending"
                              ? "#f8d7da"
                              : "#f0f0f0",
                          color:
                            ticket.status === "Assigned"
                              ? "#856404"
                              : ticket.status === "Completed"
                              ? "#155724"
                              : ticket.status === "Pending"
                              ? "#721c24"
                              : "#333",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          fontWeight: "bold",
                        }}
                      >
                        {ticket.status || "Unknown"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px", fontSize: "13.5px" }}>
                      {ticket.assignToId?.name || "Not Assigned"}
                    </td>

                    <td style={{ padding: "14px 12px", color: "#555" }}>
                      {formatDateTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              background: "#fff",
              borderRadius: "10px",
              color: "#999",
              fontSize: "17px",
              border: "1px solid #ddd",
            }}
          >
            No tickets found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTickets;