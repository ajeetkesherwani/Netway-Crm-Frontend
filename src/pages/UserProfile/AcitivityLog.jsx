import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";

const UserLogs = () => {
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
        console.error("Error fetching logs:", err);
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
      second: "2-digit",
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
        Loading logs...
      </div>
    );
  }

  const logs = data?.logs || [];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        {logs.length > 0 ? (
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
                  <th style={{ padding: "14px 12px", textAlign: "left", width: "190px" }}>
                    Date & Time
                  </th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>
                    Activity
                  </th>
                  <th style={{ padding: "14px 12px", textAlign: "left", width: "130px" }}>
                    Added By
                  </th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => {
                  const addedBy = log.addedBy?.role || "System";

                  return (
                    <tr
                      key={log._id}
                      style={{
                        background: "#fafafa",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {/* DATE & TIME */}
                      <td
                        style={{
                          padding: "14px 12px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {formatDateTime(log.createdAt)}
                      </td>

                      {/* DESCRIPTION - Same layout as before */}
                      <td style={{ padding: "14px 12px", color: "#444" }}>
                        <div style={{ marginBottom: "6px" }}>
                          <strong style={{ color: "#000", fontSize: "15px" }}>
                            {log.type || "Action"}
                          </strong>
                        </div>

                        <div style={{ fontSize: "14px", color: "#333" }}>
                          {log.description}
                        </div>

                        {/* DETAILS */}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "13px",
                              color: "#666",
                            }}
                          >
                            {Object.entries(log.details).map(([key, value]) => (
                              <span key={key}>
                                <strong>{key}:</strong> {value},{" "}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* IP */}
                        {log.ip && (
                          <div
                            style={{
                              marginTop: "6px",
                              fontSize: "12.5px",
                              color: "#777",
                            }}
                          >
                            <strong>IP:</strong> {log.ip}
                          </div>
                        )}
                      </td>

                      {/* ADDED BY - Badge like Tickets */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <span
                          style={{
                            background: "#f0f0f0",
                            color: "#000",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12.5px",
                            fontWeight: "bold",
                          }}
                        >
                          {addedBy}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogs;