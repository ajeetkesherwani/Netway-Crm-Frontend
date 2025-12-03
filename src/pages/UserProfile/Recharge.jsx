// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getCurrentPlan } from "../../service/recharge";

// const UserRechargePackage = () => {
//   const { id: userId } = useParams();

//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [renewLoading, setRenewLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchCurrentPlan();
//   }, [userId]);

//   const fetchCurrentPlan = async () => {
//     try {
//       setLoading(true);
//       const res = await getCurrentPlan(userId);
//       if (res.status && res.data) setPlan(res.data);
//       else setPlan(null);
//     } catch (err) {
//       console.error("Error fetching current plan:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

//   const handleRenew = async () => {
//     if (!plan?._id) return alert("Invalid Plan ID");

//     try {
//       setRenewLoading(true);
//       const res = await renewPlan(plan._id);

//       if (res.status) {
//         setMessage("Plan Renewed Successfully!");

//         setTimeout(async () => {
//           const refreshed = await getCurrentPlan(userId);
//           if (refreshed.status) setPlan(refreshed.data);
//         }, 1500);
//       } else {
//         setMessage(res.message || "Renew Failed");
//       }
//     } catch {
//       setMessage("Something Went Wrong");
//     } finally {
//       setRenewLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: "60px", textAlign: "center", fontSize: "20px" }}>
//         Loading Package...
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial", background: "#f9f9f9", minHeight: "100vh" }}>
//       <h2 style={{ marginBottom: "20px" }}>User Current Package</h2>

//       {!plan ? (
//         <div style={{ textAlign: "center", padding: "45px", background: "#fff", borderRadius: "10px", border: "1px solid #ccc" }}>
//           No Active Plan Found
//         </div>
//       ) : (
//         <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ background: "#e6e6e6", borderBottom: "1px solid #ccc" }}>
//                 <th style={{ padding: "14px 12px", textAlign: "left" }}>Package Name</th>
//                 <th style={{ padding: "14px 12px", textAlign: "left" }}>Validity</th>
//                 <th style={{ padding: "14px 12px", textAlign: "left" }}>Start Date</th>
//                 <th style={{ padding: "14px 12px", textAlign: "left" }}>Expiry Date</th>
//                 <th style={{ padding: "14px 12px", textAlign: "left" }}>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
//                 <td style={{ padding: "14px 12px" }}>{plan.packageId?.name}</td>
//                 <td style={{ padding: "14px 12px" }}>
//                   {plan.packageId?.validity?.number} {plan.packageId?.validity?.unit}
//                 </td>
//                 <td style={{ padding: "14px 12px" }}>{formatDate(plan.startDate)}</td>
//                 <td style={{ padding: "14px 12px" }}>{formatDate(plan.expiryDate)}</td>

//                 <td style={{ padding: "14px 12px" }}>
//                   <span style={{
//                     background: "#d4edda",
//                     color: "#155724",
//                     padding: "4px 10px",
//                     borderRadius: "4px",
//                     fontWeight: "bold",
//                     fontSize: "12px"
//                   }}>
//                     {plan.status}
//                   </span>
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           <div style={{ padding: "20px" }}>
//             <button
//               onClick={handleRenew}
//               disabled={renewLoading}
//               style={{ background: "#007bff", color: "#fff", padding: "12px 20px", borderRadius: "6px", cursor: "pointer" }}
//             >
//               {renewLoading ? "Processing..." : "Renew Package"}
//             </button>

//             {message && (
//               <div style={{ marginTop: "15px", padding: "10px", background: "#e7f3fe", color: "#0c5460", borderRadius: "5px" }}>
//                 {message}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserRechargePackage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentPlan } from "../../service/recharge";

const UserRechargePackage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renewLoading, setRenewLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCurrentPlan();
  }, [userId]);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const res = await getCurrentPlan(userId);
      if (res.status && res.data) {
        setPlan(res.data);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error("Error fetching current plan:", err);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const handleRenew = async () => {
    if (!plan?._id) return alert("Invalid Plan ID");

    try {
      setRenewLoading(true);
      setMessage("");

      // Replace with your actual renew API
      // const res = await renewPlan(plan._id);

      // Mock success (remove when real API is connected)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = { status: true };

      if (res.status) {
        setMessage("Plan Renewed Successfully!");
        setTimeout(() => {
          fetchCurrentPlan();
          setMessage("");
        }, 1500);
      } else {
        setMessage(res.message || "Renew Failed");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setRenewLoading(false);
    }
  };

  const handlePurchase = () => {
    navigate(`/user/${userId}/purchase-package`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-medium">
        Loading Package Details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Current Package</h2>

      {/* Always Visible Purchase Button */}
      <div className="text-right mb-6">
        <button
          onClick={handlePurchase}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
        >
          Purchase New Package
        </button>
      </div>

      {/* No Plan Found */}
      {!plan ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Plan Found</h3>
          <p className="text-gray-500">This user has not purchased any package yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-300 text-left text-gray-800">
                <th className="px-4 py-3 font-semibold">Package Name</th>
                <th className="px-4 py-3 font-semibold">Validity</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">Expiry Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition">
                <td className="px-4 py-4 font-semibold text-gray-800">
                  {plan.packageId?.name || "N/A"}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {plan.packageId?.validity?.number} {plan.packageId?.validity?.unit}
                </td>
                <td className="px-4 py-4 text-gray-700">{formatDate(plan.startDate)}</td>
                <td className="px-4 py-4 text-gray-700">{formatDate(plan.expiryDate)}</td>

                {/* Status Badge - Matches UserTickets Style */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                      plan.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {plan.status || "Unknown"}
                  </span>
                </td>

                {/* Renew Button */}
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={handleRenew}
                    disabled={renewLoading}
                    className={`px-5 py-2 rounded font-bold text-sm transition ${
                      renewLoading
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow"
                    }`}
                  >
                    {renewLoading ? "Renewing..." : "Renew"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Success / Error Message */}
          {message && (
            <div
              className={`p-4 border-t border-gray-200 font-medium ${
                message.includes("Success")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRechargePackage;