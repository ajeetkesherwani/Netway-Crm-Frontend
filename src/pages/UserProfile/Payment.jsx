// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserFullDetails } from "../../service/user";

// const UserPayments = () => {
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
//         console.error("Error fetching payment data:", err);
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
//         Loading payments...
//       </div>
//     );
//   }

//   const payments = data?.payments || [];

//   return (
//     <div
//       style={{
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         background: "#f9f9f9",
//         minHeight: "100vh",
//       }}
//     >
//       {/* PAYMENT TABLE (No Heading, Black/White/Grey UI) */}
//       <div style={{ marginBottom: "40px" }}>

//         {payments.length > 0 ? (
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
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Receipt No</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Payment Date</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Mode</th>
//                   <th style={{ padding: "14px 12px", textAlign: "center" }}>Total</th>
//                   <th style={{ padding: "14px 12px", textAlign: "center" }}>Paid</th>
//                   <th style={{ padding: "14px 12px", textAlign: "center" }}>Due</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Status</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Txn/Cheque No</th>
//                   <th style={{ padding: "14px 12px", textAlign: "left" }}>Comment</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {payments.map((pay, index) => (
//                   <tr
//                     key={pay._id}
//                     style={{
//                       background: index % 2 === 0 ? "#fafafa" : "#fff",
//                       borderBottom: "1px solid #eee",
//                     }}
//                   >
//                     <td style={{ padding: "14px 12px", fontWeight: "600", color: "#333" }}>
//                       {pay.ReceiptNo || "-"}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       {formatDateTime(pay.PaymentDate || pay.createdAt)}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           background: "#f0f0f0",
//                           color: "#444",
//                           padding: "4px 10px",
//                           borderRadius: "4px",
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {pay.PaymentMode || "N/A"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>
//                       ₹{pay.totalAmount || 0}
//                     </td>

//                     <td
//                       style={{
//                         padding: "14px 12px",
//                         textAlign: "center",
//                         fontWeight: "bold",
//                         color: "#222",
//                       }}
//                     >
//                       ₹{pay.amountToBePaid || 0}
//                     </td>

//                     <td style={{ padding: "14px 12px", textAlign: "center", color: "#000" }}>
//                       ₹{pay.dueAmount || 0}
//                     </td>

//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           background: "#f0f0f0",
//                           color: "#000",
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           fontSize: "12.5px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {pay.paymentStatus || "Unknown"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "14px 12px", fontSize: "13px" }}>
//                       {pay.transactionNo || "-"}
//                     </td>

//                     <td
//                       style={{
//                         padding: "14px 12px",
//                         fontSize: "13.5px",
//                         color: "#555",
//                       }}
//                     >
//                       {pay.comment || "-"}
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
//             No payment records found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserPayments;


import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getUserFullDetails } from "../../service/user"; 
import ProtectedAction from "../../components/ProtectedAction"; 

const UserPayments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Mock actions (replace with real API calls when ready)
  const handleViewReceipt = (paymentId) => {
    // Example: Open receipt PDF or modal
    toast.success(`Viewing receipt for payment ${paymentId} (mock)`);
    setOpenMenuId(null);
  };

  const handleEditPayment = (paymentId) => {
    navigate(`/payments/edit/${paymentId}`, { state: { userId: id } });
    setOpenMenuId(null);
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      toast.success(`Payment ${paymentId} deleted (mock)`);
      // Optionally remove from state after real delete
      setOpenMenuId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl bg-gray-50 min-h-screen">
        Loading payments...
      </div>
    );
  }

  const payments = data?.payments || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Create Payment Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">User Payments</h2>
        {/* <button
          onClick={() => navigate("/payments/create", { state: { userId: id } })}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          Add Payment
        </button> */}
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Receipt No</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Payment Date</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Mode</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Total</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Paid</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Due</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Status</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Txn/Cheque No</th>
                  <th className="px-4 py-3 font-semibold border-r border-gray-300">Comment</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay, index) => (
                  <tr
                    key={pay._id}
                    className={`hover:bg-gray-50 border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-800 border-r border-gray-200">
                      {pay.ReceiptNo || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {formatDateTime(pay.PaymentDate || pay.createdAt)}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                        {pay.PaymentMode || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      ₹{pay.totalAmount?.toLocaleString() || "0"}
                    </td>

                    <td className="px-4 py-4 text-center border-r border-gray-200 font-semibold text-gray-800">
                      ₹{pay.amountToBePaid?.toLocaleString() || "0"}
                    </td>

                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      ₹{pay.dueAmount?.toLocaleString() || "0"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pay.paymentStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : pay.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {pay.paymentStatus || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      {pay.transactionNo || "—"}
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200 text-gray-600">
                      {pay.comment || "—"}
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-4 text-center relative border-r border-gray-200">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === pay._id ? null : pay._id)
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === pay._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 z-50 bg-white border rounded shadow-lg w-48 py-1"
                        >
                          <ProtectedAction module="payment" action="viewReceipt">
                            <button
                              onClick={() => handleViewReceipt(pay._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEye className="mr-2 text-blue-600" /> View Receipt
                            </button>
                          </ProtectedAction>

                          {/* <ProtectedAction module="payment" action="editReceipt">
                            <button
                              onClick={() => handleEditPayment(pay._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEdit className="mr-2 text-blue-600" /> Edit
                            </button>
                          </ProtectedAction> */}

                          <ProtectedAction module="payment" action="deleteReceipt">
                            <button
                              onClick={() => handleDeletePayment(pay._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <FaTrashAlt className="mr-2" /> Delete
                            </button>
                          </ProtectedAction>

                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No payment records found for this user.
        </div>
      )}
    </div>
  );
};

export default UserPayments;