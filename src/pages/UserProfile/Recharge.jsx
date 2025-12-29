// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getCurrentPlan,
//   createPurchasedPlan,
//   renewPurchasedPlan,
//   getAssignedPackageList,
// } from "../../service/recharge";
// import ProtectedAction from "../../components/ProtectedAction";
// import { toast } from "react-toastify";

// const UserRechargePackage = () => {
//   const { id: userId } = useParams();

//   const [plans, setPlans] = useState([]);
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isRenew, setIsRenew] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState(null);

//   const [form, setForm] = useState({
//     packageId: "",
//     amountPaid: 0,
//     startDate: "",
//     expiryDate: "",
//     paymentReceived: "No",
//     paymentAmount: 0,
//     paymentDate: "",
//     paymentMethod: "Cash",
//     remark: "",
//     paymentRemark: "",
//   });

//   useEffect(() => {
//     fetchCurrentPlan();
//     fetchPackages();
//   }, [userId]);

//   const fetchCurrentPlan = async () => {
//     try {
//       setLoading(true);
//       const res = await getCurrentPlan(userId);

//       if (res.status && res.data && res.data.length > 0) {
//         const sortedPlans = res.data.sort((a, b) => {
//           const dateA = new Date(a.startDate || a.purchaseDate);
//           const dateB = new Date(b.startDate || b.purchaseDate);
//           return dateB - dateA;
//         });
//         setPlans(sortedPlans);
//         setCurrentPlan(sortedPlans[0]);
//       } else {
//         setPlans([]);
//         setCurrentPlan(null);
//       }
//     } catch (err) {
//       console.error(err);
//       setPlans([]);
//       setCurrentPlan(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPackages = async () => {
//     try {
//       const res = await getAssignedPackageList(userId);
//       if (res.status) {
//         setPackages(res.data || []);
//       }
//     } catch (err) {
//       console.error("Failed to load packages", err);
//     }
//   };

//   const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

//   const openPurchaseModal = () => {
//     setIsRenew(false);
//     const today = new Date().toISOString().split("T")[0];
//     setForm({
//       packageId: "",
//       amountPaid: 0,
//       startDate: today,
//       expiryDate: "",
//       paymentReceived: "No",
//       paymentAmount: 0,
//       paymentDate: today,
//       paymentMethod: "Cash",
//       remark: "",
//       paymentRemark: "",
//     });
//     setSelectedPackage(null);
//     setShowModal(true);
//   };

//   const openRenewModal = (planToRenew = currentPlan) => {
//     if (!planToRenew) {
//       toast.error("No active plan to renew");
//       return;
//     }

//     const assignedPkg = packages.find(p => p.packageId === planToRenew.packageId?._id);
//     if (!assignedPkg) {
//       toast.error("Assigned package not found");
//       return;
//     }

//     const start = new Date(planToRenew.expiryDate);
//     start.setDate(start.getDate() + 1);
//     const expiry = new Date(start);
//     expiry.setMonth(expiry.getMonth() + (assignedPkg.validity?.number || 1));

//     setIsRenew(true);
//     setCurrentPlan(planToRenew);
//     setSelectedPackage(assignedPkg);
//     setForm({
//       packageId: assignedPkg._id,
//       amountPaid: assignedPkg.customPrice,
//       startDate: start.toISOString().split("T")[0],
//       expiryDate: expiry.toISOString().split("T")[0],
//       paymentReceived: "No",
//       paymentAmount: assignedPkg.customPrice,
//       paymentDate: new Date().toISOString().split("T")[0],
//       paymentMethod: "Cash",
//       remark: "Renewed plan",
//       paymentRemark: "",
//     });
//     setShowModal(true);
//   };

//   const handlePackageChange = (assignedPkgId) => {
//     const pkg = packages.find((p) => p._id === assignedPkgId);
//     if (!pkg) return;

//   console.log("Selected Package Full Object:", pkg);
//   console.log("Validity Object:", pkg.validity);
//   console.log("Validity Number:", pkg.validity?.number);
//   console.log("Validity Unit:", pkg.validity?.unit);

//     // Check if this package is already active
//     const isAlreadyActive = plans.some(plan =>
//       plan.packageId?._id === pkg.packageId &&
//       new Date(plan.expiryDate) >= new Date()
//     );

//     if (isAlreadyActive) {
//       toast.error("This package is already active. Please renew instead!", {
//         position: "top-center",
//         autoClose: 5000,
//       });
//       return;
//     }

//     setSelectedPackage(pkg);

//     const baseDate = isRenew && currentPlan ? new Date(currentPlan.expiryDate) : new Date();
//     const start = new Date(baseDate);
//     start.setDate(start.getDate() + (isRenew ? 1 : 0));
//     const expiry = new Date(start);
//     expiry.setMonth(expiry.getMonth() + (pkg.validity?.number || 1));

//     setForm({
//       ...form,
//       packageId: pkg._id,
//       amountPaid: pkg.customPrice,
//       paymentAmount: pkg.customPrice,
//       startDate: start.toISOString().split("T")[0],
//       expiryDate: expiry.toISOString().split("T")[0],
//     });
//   };

//   const handleSubmit = async () => {
//     if (!form.packageId || !selectedPackage) {
//       toast.error("Please select a valid package");
//       return;
//     }

//     try {
//       const payload = {
//         userId,
//         packageId: selectedPackage.packageId,
//         assignedPackageId: form.packageId,
//         startDate: new Date(form.startDate).toISOString(),
//         expiryDate: new Date(form.expiryDate).toISOString(),
//         amountPaid: parseFloat(form.amountPaid),
//         paymentReceived: form.paymentReceived,
//         paymentMethod: form.paymentMethod,
//         paymentStatus: form.paymentReceived === "Yes" ? "paid" : "pending",
//         paymentDate: form.paymentReceived === "Yes" ? new Date(form.paymentDate).toISOString() : null,
//         remark: form.remark,
//         paymentRemark: form.paymentRemark,
//       };

//       let res;
//       if (isRenew && currentPlan?._id) {
//         res = await renewPurchasedPlan(currentPlan._id, payload);
//       } else {
//         res = await createPurchasedPlan(payload);
//       }

//       if (res.status) {
//         toast.success(isRenew ? "Plan renewed successfully!" : "New plan purchased successfully!", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//         setShowModal(false);
//         fetchCurrentPlan();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong.", {
//         position: "top-center",
//         autoClose: 5000,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8">User Recharge Management</h2>

//           <div className="flex justify-end gap-6 mb-8">
//             <ProtectedAction module="customer" action="purchasedNewPackage">
//               <button
//                 onClick={openPurchaseModal}
//                 className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
//               >
//                 Purchase New Plan
//               </button>
//             </ProtectedAction>
//           </div>

//           {plans.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//               <p className="text-xl text-gray-600">No active plan found for this user.</p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
//                 <h3 className="text-xl font-bold">All Active Plans</h3>
//                 {plans.length > 1 && (
//                   <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
//                     Latest Active → Row 1
//                   </span>
//                 )}
//               </div>

//               <table className="w-full">
//                 <thead className="bg-gray-200 text-gray-700">
//                   <tr>
//                     <th className="px-6 py-4 text-left">Status</th>
//                     <th className="px-6 py-4 text-left">Package</th>
//                     <th className="px-6 py-4 text-left">Start Date</th>
//                     <th className="px-6 py-4 text-left">Expiry Date</th>
//                     <th className="px-6 py-4 text-left">Amount</th>
//                     <th className="px-6 py-4 text-left">Renewed?</th>
//                     <ProtectedAction module="customer" action="renewPackage">
//                       <th className="px-6 py-4 text-left">Action</th>
//                     </ProtectedAction>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {plans.map((plan, index) => {
//                     const isLatest = index === 0;
//                     const isCurrentlyActive = new Date(plan.expiryDate) >= new Date();

//                     return (
//                       <tr
//                         key={plan._id}
//                         className={`hover:bg-gray-50 border-b ${isLatest ? "bg-blue-50 font-bold" : ""}`}
//                       >
//                         <td className="px-6 py-4">
//                           {isLatest && isCurrentlyActive ? (
//                             <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
//                               CURRENT ACTIVE
//                             </span>
//                           ) : isCurrentlyActive ? (
//                             <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
//                               ACTIVE
//                             </span>
//                           ) : (
//                             <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
//                               EXPIRED
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">{plan.packageId?.name}</td>
//                         <td className="px-6 py-4">{formatDate(plan.startDate)}</td>
//                         <td className="px-6 py-4">{formatDate(plan.expiryDate)}</td>
//                         <td className="px-6 py-4">₹{plan.amountPaid}</td>
//                         <td className="px-6 py-4">
//                           {plan.latestRenewal ? "Yes (Latest)" : plan.isRenewed ? "Yes" : "No"}
//                         </td>

//                         <ProtectedAction module="customer" action="renewPackage">
//                           <td className="px-6 py-4">
//                             {isCurrentlyActive && (
//                               <button
//                                 onClick={() => openRenewModal(plan)}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
//                               >
//                                 Renew
//                               </button>
//                             )}
//                           </td>
//                         </ProtectedAction>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL - 100% SAME UI & FIELDS */}
//       {showModal && (
//         <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 px-4">
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border-4 border-blue-500 max-h-screen overflow-y-auto">
//             <div className="bg-gray-700 text-white px-5 py-2.5 flex items-center justify-between text-sm sticky top-0 z-10">
//               <div className="font-bold text-sm">
//                 {isRenew ? "Renew Plan" : "Purchase New Plan"} | User ID: {userId}
//               </div>
//               {isRenew && (
//                 <div className="flex items-center gap-6 text-xs">
//                   <label className="flex items-center gap-1.5">
//                     <input type="radio" checked={true} readOnly className="w-3.5 h-3.5" />
//                     <span>Renew</span>
//                   </label>
//                   <label className="flex items-center gap-1.5">
//                     <input type="radio" checked={false} readOnly className="w-3.5 h-3.5" />
//                     <span>Upgrade</span>
//                   </label>
//                 </div>
//               )}
//             </div>

//             <div className="p-1 bg-gray-50 text-xs space-y-3.5 text-gray-700">
//               <div className="grid grid-cols-2 gap-6">
//                 {/* LEFT COLUMN */}
//                 <div className="space-y-2.5">
//                   <div className="flex items-center gap-3">
//                     <label className="w-36 font-semibold">Current Plan :</label>
//                     <select
//                       className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
//                       value={form.packageId}
//                       onChange={(e) => handlePackageChange(e.target.value)}
//                       disabled={isRenew}
//                     >
//                       <option value="">Select Package</option>
//                       {packages.map((pkg) => (
//                         <option key={pkg._id} value={pkg._id}>
//                           {pkg.packageName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">MRP :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value={selectedPackage?.customPrice || "0"} readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Discount :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Refund Charge :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0.0" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Wallet Balance :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold" value="-100.00" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36 font-bold">Total Pay Amount :</label>
//                     <input
//                       type="text"
//                       className="flex-1 border-2 border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold"
//                       value={form.amountPaid || "0.00"}
//                       readOnly
//                     />
//                   </div>
//                 </div>

//                 {/* RIGHT COLUMN */}
//                 <div className="space-y-2.5">
//                   <div className="flex items-center gap-3">
//                     <input type="checkbox" className="w-4 h-4" defaultChecked={isRenew} />
//                     <span className="font-bold text-xs">Advance Renewal</span>
//                     <input type="text" className="w-28 border border-gray-300 rounded px-2 py-1 bg-gray-200 text-center text-xs" value="03/01/2026" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Validity :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value={`${selectedPackage?.validity?.number || ""} ${selectedPackage?.validity?.unit || ""}`} readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Volume Quota :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Time Quota :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Old Plan Used :</label>
//                     <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="" readOnly />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Remark :</label>
//                     <input
//                       type="text"
//                       className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs"
//                       value={form.remark}
//                       onChange={(e) => setForm({ ...form, remark: e.target.value })}
//                       placeholder="Enter remark"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Section */}
//               <div className="border-t-2 border-gray-400 mt-4 pt-3.5 pb-2">
//                 <div className="text-center mb-2">
//                   <span className="font-bold text-sm">Payment Received</span>
//                   <div className="inline-flex gap-8 ml-5">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment"
//                         checked={form.paymentReceived === "Yes"}
//                         onChange={() => setForm({ ...form, paymentReceived: "Yes", paymentAmount: form.amountPaid })}
//                         className="w-4 h-4"
//                       />
//                       <span className="font-bold text-sm">Yes</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment"
//                         checked={form.paymentReceived === "No"}
//                         onChange={() => setForm({ ...form, paymentReceived: "No" })}
//                         className="w-4 h-4"
//                       />
//                       <span className="font-bold text-sm">No</span>
//                     </label>
//                   </div>
//                 </div>

//                 {form.paymentReceived === "Yes" && (
//                   <div className="grid grid-cols-2 gap-5 max-w-4xl mx-auto text-xs">
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Amount</span>
//                       <input type="number" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentAmount} onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })} />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Payment Date</span>
//                       <input type="date" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Payment Mode</span>
//                       <select className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
//                         <option>Cash</option>
//                         <option>UPI</option>
//                         <option>Bank Transfer</option>
//                         <option>Cheque</option>
//                         <option>Online</option>
//                       </select>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Remark</span>
//                       <input type="text" className="w-52 border border-gray-400 rounded px-3 py-1.5" value={form.paymentRemark} onChange={(e) => setForm({ ...form, paymentRemark: e.target.value })} placeholder="e.g. Paid via GPay" />
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-300 my-2"></div>
//                 <div className="grid grid-cols-2 gap-2 text-xs font-bold max-w-4xl mx-auto">
//                   <div className="flex justify-between"><span>Total Payable</span><span className="text-gray-800">₹{form.amountPaid || "0.00"}</span></div>
//                   <div className="flex justify-between"><span>Remaining</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (form.amountPaid - (parseFloat(form.paymentAmount) || 0)).toFixed(2) : form.amountPaid || "0.00"}</span></div>
//                   <div className="flex justify-between"><span>Payment Received</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? form.paymentAmount || "0.00" : "0.00"}</span></div>
//                   <div className="flex justify-between"><span>Wallet After</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (-100 - (form.amountPaid - (parseFloat(form.paymentAmount) || 0))).toFixed(2) : (-100 - form.amountPaid).toFixed(2)}</span></div>
//                 </div>
//               </div>

//               <div className="flex justify-center gap-2 py-2 border-t border-gray-300 -mt-3">
//                 <button
//                   onClick={handleSubmit}
//                   className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-8 rounded shadow transition"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1.5 px-8 rounded shadow transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserRechargePackage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCurrentPlan,
  createPurchasedPlan,
  renewPurchasedPlan,
  getAssignedPackageList,
  getWalletBalance
} from "../../service/recharge";
import ProtectedAction from "../../components/ProtectedAction";
import { toast } from "react-toastify";

const UserRechargePackage = () => {
  const { id: userId } = useParams();

  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  //dropdown search state
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    packageId: "",
    amountPaid: 0,
    startDate: "",
    expiryDate: "",
    paymentReceived: "No",
    paymentAmount: 0,
    paymentDate: "",
    paymentMethod: "Cash",
    remark: "",
    paymentRemark: "",
  });

  // open purchase model automatically
  useEffect(() => {
    fetchCurrentPlan();
    fetchPackages();
    fetchWalletBalance();
  }, [userId]);


  useEffect(() => {
    if (userId) {
      openPurchaseModal();
    }
  }, [userId]);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const res = await getCurrentPlan(userId);

      if (res.status && res.data && res.data.length > 0) {
        const sortedPlans = res.data.sort((a, b) => {
          const dateA = new Date(a.startDate || a.purchaseDate);
          const dateB = new Date(b.startDate || b.purchaseDate);
          return dateB - dateA;
        });
        setPlans(sortedPlans);
        setCurrentPlan(sortedPlans[0]);
      } else {
        setPlans([]);
        setCurrentPlan(null);
      }
    } catch (err) {
      console.error(err);
      setPlans([]);
      setCurrentPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await getAssignedPackageList(userId);
      if (res.status && res.data) {
        // IMPORTANT: Convert ObjectId to string for safe comparison
        const normalized = res.data.map(pkg => ({
          ...pkg,
          packageIdStr: pkg.packageId?._id?.toString() || pkg.packageId?.toString() || ""
        }));
        setPackages(normalized);
      }
    } catch (err) {
      console.error("Failed to load packages", err);
    }
  };

  //serach tearms filtering
  const filteredPackages = searchTerm.trim()
    ? packages.filter(pkg =>
      pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : packages;

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const fetchWalletBalance = async () => {
    try {
      const res = await getWalletBalance(userId);
      if (res.status && res.data) {
        setWalletBalance(res.data.walletBalance || 0);
      }
    } catch (err) {
      console.log("Wallet balance not loaded", err);
      setWalletBalance(0);
    }
  };

  const openPurchaseModal = () => {
    setIsRenew(false);
    const today = new Date().toISOString().split("T")[0];
    setForm({
      packageId: "",
      amountPaid: 0,
      startDate: today,
      expiryDate: "",
      paymentReceived: "No",
      paymentAmount: 0,
      paymentDate: today,
      paymentMethod: "Cash",
      remark: "",
      paymentRemark: "",
    });
    setSelectedPackage(null);
    setShowModal(true);
  };

  // RENEW BUTTON 
  const openRenewModal = (planToRenew = currentPlan) => {
    if (!planToRenew) {
      toast.error("No active plan to renew");
      return;
    }

    // Convert both IDs to string for comparison
    const planPkgId = planToRenew.packageId?._id?.toString() || planToRenew.packageId?.toString();

    const assignedPkg = packages.find(p => p.packageIdStr === planPkgId);

    if (!assignedPkg) {
      toast.error("Assigned package not found. Please refresh the page.");
      return;
    }

    // Calculate next day after expiry
    const start = new Date(planToRenew.expiryDate);
    start.setDate(start.getDate() + 1);

    // Add validity period
    const expiry = new Date(start);
    const validityNum = Number(assignedPkg.validity?.number) || 1;
    expiry.setMonth(expiry.getMonth() + validityNum);

    setIsRenew(true);
    setCurrentPlan(planToRenew);
    setSelectedPackage(assignedPkg);

    setForm({
      packageId: assignedPkg._id,
      amountPaid: assignedPkg.customPrice || assignedPkg.basePrice || 0,
      startDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      paymentReceived: "No",
      paymentAmount: assignedPkg.customPrice || assignedPkg.basePrice || 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      remark: "Renewed plan",
      paymentRemark: "",
    });

    setShowModal(true);
  };

  const handlePackageChange = (assignedPkgId) => {
    const pkg = packages.find((p) => p._id === assignedPkgId);
    if (!pkg) return;

    // Prevent duplicate purchase of active plan
    const isAlreadyActive = plans.some(plan => {
      const planPkgId = plan.packageId?._id?.toString() || plan.packageId?.toString();
      return planPkgId === pkg.packageIdStr && new Date(plan.expiryDate) >= new Date();
    });

    if (isAlreadyActive) {
      toast.error("This plan is already active! Please use 'Renew' button.", {
        position: "top-center",
        autoClose: 6000,
      });
      return;
    }

    setSelectedPackage(pkg);

    const baseDate = isRenew && currentPlan ? new Date(currentPlan.expiryDate) : new Date();
    const start = new Date(baseDate);
    start.setDate(start.getDate() + (isRenew ? 1 : 0));

    const expiry = new Date(start);
    const validityNum = Number(pkg.validity?.number) || 1;
    expiry.setMonth(expiry.getMonth() + validityNum);

    setForm({
      ...form,
      packageId: pkg._id,
      amountPaid: pkg.customPrice || pkg.basePrice || 0,
      paymentAmount: pkg.customPrice || pkg.basePrice || 0,
      startDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
    });
  };

  const handleSubmit = async () => {
    if (!form.packageId || !selectedPackage) {
      toast.error("Please select a valid package");
      return;
    }

    try {
      const payload = {
        userId,
        packageId: selectedPackage.packageId?._id || selectedPackage.packageId,
        assignedPackageId: form.packageId,
        startDate: new Date(form.startDate).toISOString(),
        expiryDate: new Date(form.expiryDate).toISOString(),
        amountPaid: parseFloat(form.amountPaid) || 0,
        paymentReceived: form.paymentReceived,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentReceived === "Yes" ? "paid" : "pending",
        paymentDate: form.paymentReceived === "Yes" ? new Date(form.paymentDate).toISOString() : null,
        remark: form.remark || (isRenew ? "Plan renewed" : "New plan purchased"),
        paymentRemark: form.paymentRemark,
      };

      let res;
      if (isRenew && currentPlan?._id) {
        res = await renewPurchasedPlan(currentPlan._id, payload);
      } else {
        res = await createPurchasedPlan(payload);
      }

      if (res.status) {
        toast.success(isRenew ? "Plan renewed successfully!" : "New plan purchased successfully!", {
          position: "top-center",
          autoClose: 4000,
        });
        setShowModal(false);
        fetchCurrentPlan();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        position: "top-center",
        autoClose: 6000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-700 font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">User Recharge Management</h2>

          <div className="flex justify-end gap-6 mb-8">
            <ProtectedAction module="customer" action="purchasedNewPackage">
              <button
                onClick={openPurchaseModal}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Purchase New Plan
              </button>
            </ProtectedAction>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600">No active plan found for this user.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">All Active Plans</h3>
                {plans.length > 1 && (
                  <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
                    Latest Active to Row 1
                  </span>
                )}
              </div>

              <table className="w-full">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Package</th>
                    <th className="px-6 py-4 text-left">Start Date</th>
                    <th className="px-6 py-4 text-left">Expiry Date</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Renewed?</th>
                    <ProtectedAction module="customer" action="renewPackage">
                      <th className="px-6 py-4 text-left">Action</th>
                    </ProtectedAction>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => {
                    const isLatest = index === 0;
                    const isCurrentlyActive = new Date(plan.expiryDate) >= new Date();

                    return (
                      <tr
                        key={plan._id}
                        className={`hover:bg-gray-50 border-b ${isLatest ? "bg-blue-50 font-bold" : ""}`}
                      >
                        <td className="px-6 py-4">
                          {isLatest && isCurrentlyActive ? (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                              CURRENT ACTIVE
                            </span>
                          ) : isCurrentlyActive ? (
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                              EXPIRED
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">{plan.packageId?.name || "Unknown"}</td>
                        <td className="px-6 py-4">{formatDate(plan.startDate)}</td>
                        <td className="px-6 py-4">{formatDate(plan.expiryDate)}</td>
                        <td className="px-6 py-4">₹{plan.amountPaid}</td>
                        <td className="px-6 py-4">
                          {plan.latestRenewal ? "Yes (Latest)" : plan.isRenewed ? "Yes" : "No"}
                        </td>

                        <ProtectedAction module="customer" action="renewPackage">
                          <td className="px-6 py-4">
                            {isCurrentlyActive && (
                              <button
                                onClick={() => openRenewModal(plan)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
                              >
                                Renew
                              </button>
                            )}
                          </td>
                        </ProtectedAction>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - SAME UI, ALL FIELDS, FULLY WORKING */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border-4 border-blue-500 max-h-screen overflow-y-auto">
            <div className="bg-gray-700 text-white px-5 py-2.5 flex items-center justify-between text-sm sticky top-0 z-10">
              <div className="font-bold text-sm">
                {isRenew ? "Renew Plan" : "Purchase New Plan"} | User ID: {userId}
              </div>
              {isRenew && (
                <div className="flex items-center gap-6 text-xs">
                  <label className="flex items-center gap-1.5">
                    <input type="radio" checked={true} readOnly className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" checked={false} readOnly className="w-3.5 h-3.5" />
                    <span>Upgrade</span>
                  </label>
                </div>
              )}
            </div>

            <div className="p-1 bg-gray-50 text-xs space-y-3.5 text-gray-700">
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-2.5">

                  {/* serachable dropdown for packages */}
                  <div className="flex items-center gap-3 relative">
                    <label className="w-36 font-semibold">Current Plan :</label>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none bg-white"
                        placeholder="Search package..."
                        value={searchTerm || (selectedPackage ? selectedPackage.packageName : "")}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowDropdown(true);
                          // If user types something new, clear previous selection
                          if (e.target.value !== selectedPackage?.packageName) {
                            setSelectedPackage(null);
                            setForm({ ...form, packageId: "" });
                          }
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => {
                          // Small delay so click on item registers
                          setTimeout(() => setShowDropdown(false), 200);
                        }}
                        disabled={isRenew}
                      />

                      {showDropdown && (
                        <ul
                          className="absolute z-50 w-full bg-white border border-gray-300 rounded-b mt-1 max-h-48 overflow-y-auto shadow-lg text-xs"
                        >
                          {filteredPackages.length > 0 ? (
                            filteredPackages.map((pkg) => (
                              <li
                                key={pkg._id}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                onClick={() => {
                                  handlePackageChange(pkg._id);
                                  setSearchTerm(pkg.packageName);
                                  setShowDropdown(false);
                                }}
                              >
                                {pkg.packageName}
                              </li>
                            ))
                          ) : (
                            <li className="px-3 py-2 text-gray-500">No matching packages</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <label className="w-36 font-semibold">Current Plan :</label>
                    <select
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                      value={form.packageId}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      disabled={isRenew}
                    >
                      <option value="">Select Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                          {pkg.packageName}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="flex items-center gap-3">
                    <label className="w-36">MRP :</label>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
                      value={selectedPackage?.customPrice || selectedPackage?.basePrice || "0"}
                      readOnly
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Discount :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Refund Charge :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="0.0" readOnly />
                  </div>


                  <div className="flex items-center gap-3">
                    <label className="w-36">Wallet Balance :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold"
                      value={`₹${Math.abs(Number(walletBalance)).toFixed(2)}`}
                      readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36 font-bold">Total Pay Amount :</label>
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold"
                      value={form.amountPaid || "0.00"}
                      readOnly
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={isRenew} />
                    <span className="font-bold text-xs">Advance Renewal</span>
                    <input type="text" className="w-28 border border-gray-300 rounded px-2 py-1 bg-gray-200 text-center text-xs" value="03/01/2026" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Validity :</label>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
                      value={`${selectedPackage?.validity?.number || ""} ${selectedPackage?.validity?.unit || ""}`}
                      readOnly
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Volume Quota :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Time Quota :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="UNLIMITED" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Old Plan Used :</label>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100" value="" readOnly />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-36">Remark :</label>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs"
                      value={form.remark}
                      onChange={(e) => setForm({ ...form, remark: e.target.value })}
                      placeholder="Enter remark"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t-2 border-gray-400 mt-4 pt-3.5 pb-2">
                <div className="text-center mb-2">
                  <span className="font-bold text-sm">Payment Received</span>
                  <div className="inline-flex gap-8 ml-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentReceived === "Yes"}
                        onChange={() => setForm({ ...form, paymentReceived: "Yes", paymentAmount: form.amountPaid })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentReceived === "No"}
                        onChange={() => setForm({ ...form, paymentReceived: "No" })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">No</span>
                    </label>
                  </div>
                </div>

                {form.paymentReceived === "Yes" && (
                  <div className="grid grid-cols-2 gap-5 max-w-4xl mx-auto text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Amount</span>
                      <input
                        type="number"
                        className="w-52 border border-gray-400 rounded px-3 py-1.5"
                        value={form.paymentAmount}
                        onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Payment Date</span>
                      <input
                        type="date"
                        className="w-52 border border-gray-400 rounded px-3 py-1.5"
                        value={form.paymentDate}
                        onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Payment Mode</span>
                      <select
                        className="w-52 border border-gray-400 rounded px-3 py-1.5"
                        value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      >
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>
                        <option>Online</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Remark</span>
                      <input
                        type="text"
                        className="w-52 border border-gray-400 rounded px-3 py-1.5"
                        value={form.paymentRemark}
                        onChange={(e) => setForm({ ...form, paymentRemark: e.target.value })}
                        placeholder="e.g. Paid via GPay"
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-300 my-2"></div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold max-w-4xl mx-auto">
                  <div className="flex justify-between"><span>Total Payable</span><span className="text-gray-800">₹{form.amountPaid || "0.00"}</span></div>
                  <div className="flex justify-between"><span>Remaining</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (form.amountPaid - (parseFloat(form.paymentAmount) || 0)).toFixed(2) : form.amountPaid || "0.00"}</span></div>
                  <div className="flex justify-between"><span>Payment Received</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? form.paymentAmount || "0.00" : "0.00"}</span></div>
                  <div className="flex justify-between"><span>Wallet After</span><span className="text-gray-800">₹{form.paymentReceived === "Yes" ? (-100 - (form.amountPaid - (parseFloat(form.paymentAmount) || 0))).toFixed(2) : (-100 - form.amountPaid).toFixed(2)}</span></div>
                </div>
              </div>

              <div className="flex justify-center gap-2 py-2 border-t border-gray-300 -mt-3">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-8 rounded shadow transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1.5 px-8 rounded shadow transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRechargePackage;