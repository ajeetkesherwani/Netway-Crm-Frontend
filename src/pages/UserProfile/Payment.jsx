import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";

const UserPayments = () => {
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
        console.error("Error fetching payment data:", err);
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
        Loading payments...
      </div>
    );
  }

  const payments = data?.payments || [];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* PAYMENT TABLE (No Heading, Black/White/Grey UI) */}
      <div style={{ marginBottom: "40px" }}>

        {payments.length > 0 ? (
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
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Receipt No</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Payment Date</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Mode</th>
                  <th style={{ padding: "14px 12px", textAlign: "center" }}>Total</th>
                  <th style={{ padding: "14px 12px", textAlign: "center" }}>Paid</th>
                  <th style={{ padding: "14px 12px", textAlign: "center" }}>Due</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Txn/Cheque No</th>
                  <th style={{ padding: "14px 12px", textAlign: "left" }}>Comment</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((pay, index) => (
                  <tr
                    key={pay._id}
                    style={{
                      background: index % 2 === 0 ? "#fafafa" : "#fff",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: "14px 12px", fontWeight: "600", color: "#333" }}>
                      {pay.ReceiptNo || "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {formatDateTime(pay.PaymentDate || pay.createdAt)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          background: "#f0f0f0",
                          color: "#444",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {pay.PaymentMode || "N/A"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px", textAlign: "center" }}>
                      ₹{pay.totalAmount || 0}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#222",
                      }}
                    >
                      ₹{pay.amountToBePaid || 0}
                    </td>

                    <td style={{ padding: "14px 12px", textAlign: "center", color: "#000" }}>
                      ₹{pay.dueAmount || 0}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
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
                        {pay.paymentStatus || "Unknown"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px", fontSize: "13px" }}>
                      {pay.transactionNo || "-"}
                    </td>

                    <td
                      style={{
                        padding: "14px 12px",
                        fontSize: "13.5px",
                        color: "#555",
                      }}
                    >
                      {pay.comment || "-"}
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
            No payment records found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPayments;
