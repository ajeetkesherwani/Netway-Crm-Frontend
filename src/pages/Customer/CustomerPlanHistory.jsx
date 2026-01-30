// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getUserPlanHistory } from "../../service/user"; 
// import { toast } from "react-toastify";
// import { FaArrowLeft } from "react-icons/fa";

// const PlanHistoryPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [planHistory, setPlanHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadHistory = async () => {
//       setLoading(true);
//       setError("");

//       const result = await getUserPlanHistory(id);

//       if (result.status) {
//         // Sort latest first
//         const sorted = result.data.sort(
//           (a, b) => new Date(b.rechargeDate) - new Date(a.rechargeDate)
//         );
//         setPlanHistory(sorted);
//       } else {
//         setError(result.message || "Failed to load plan history");
//         toast.error(result.message || "Failed to load plan history");
//       }
//       setLoading(false);
//     };

//     loadHistory();
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
//         >
//           <FaArrowLeft className="text-lg" />
//           Back to Profile
//         </button>

//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Plan History</h1>

//         {loading && (
//           <div className="text-center py-16 bg-white rounded-lg shadow">
//             <p className="text-gray-600">Loading plan history...</p>
//           </div>
//         )}

//         {error && (
//           <div className="text-center py-16 bg-white rounded-lg shadow">
//             <p className="text-red-600">{error}</p>
//           </div>
//         )}

//         {!loading && !error && planHistory.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-lg shadow">
//             <p className="text-gray-500 text-lg">No plan history found</p>
//           </div>
//         )}

//         {!loading && !error && planHistory.length > 0 && (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-100 text-xs uppercase text-gray-700">
//                   <tr>
//                     <th className="px-6 py-4 font-medium">S.No</th>
//                     <th className="px-6 py-4 font-medium">Package Name</th>
//                     <th className="px-6 py-4 font-medium">Recharge Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {planHistory.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-gray-600">{index + 1}</td>
//                       <td className="px-6 py-4 font-medium text-gray-900">
//                         {item.packageName}
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">
//                         {new Date(item.rechargeDate).toLocaleDateString("en-GB")}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlanHistoryPage;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserPlanHistory, getUserRenewHistory } from "../../service/user";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const PlanHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchasedPlans, setPurchasedPlans] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch purchased plans
        const purchasedResult = await getUserPlanHistory(id);
        if (purchasedResult.status) {
          const sorted = purchasedResult.data.sort(
            (a, b) => new Date(b.rechargeDate || b.purchaseDate || b.createdAt) - new Date(a.rechargeDate || a.purchaseDate || a.createdAt)
          );
          setPurchasedPlans(sorted);
        } else {
          throw new Error(purchasedResult.message);
        }

        // Fetch renewals
        const renewResult = await getUserRenewHistory(id);
        if (renewResult.status) {
          const sortedRenew = renewResult.data.sort(
            (a, b) => new Date(b.rechargeDate) - new Date(a.rechargeDate)
          );
          setRenewals(sortedRenew);
        } else {
          throw new Error(renewResult.message);
        }
      } catch (err) {
        const msg = err.message || "Failed to load history";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "—";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FaArrowLeft className="text-lg" />
          Back to Profile
        </button>

        {loading && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-600">Loading plan & renewal history...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            {/* ──────────────────────────────────────── */}
            <section>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Purchased Plan History</h1>

              {purchasedPlans.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500 text-lg">No purchased plans found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                          <th className="px-6 py-4 font-medium">S.No</th>
                          <th className="px-6 py-4 font-medium">Package Name</th>
                          <th className="px-6 py-4 font-medium">Recharge / Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {purchasedPlans.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {item.packageName || item.planName || "—"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatDate(item.rechargeDate || item.purchaseDate || item.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {/* ──────────────────────────────────────── */}
            <section>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Renewals History</h1>

              {renewals.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500 text-lg">No renewals found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                          <th className="px-6 py-4 font-medium">S.No</th>
                          <th className="px-6 py-4 font-medium">Package Name</th>
                          <th className="px-6 py-4 font-medium">Renewal Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {renewals.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {item.packageName || "—"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatDate(item.rechargeDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanHistoryPage;