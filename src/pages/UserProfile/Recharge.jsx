// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getCurrentPlan,
//   createPurchasedPlan,
//   renewPurchasedPlan,
//   getAssignedPackageList,
//   getWalletBalance,
//   refundPurchasedPlan
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
//   const [walletBalance, setWalletBalance] = useState(0);

//   // Dropdown search state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const [form, setForm] = useState({
//     packageId: "",
//     amountPaid: 0,
//     startDate: "",
//     expiryDate: "",
//     isPaymentReceived: false,
//     paymentAmount: 0,
//     paymentDate: "",
//     paymentMethod: "Online",
//     remark: "",
//     paymentRemark: "",
//   });

//   // Advance Renewal state
//   const [isAdvanceRenewal, setIsAdvanceRenewal] = useState(false);

//   useEffect(() => {
//     fetchCurrentPlan();
//     fetchPackages();
//     fetchWalletBalance();
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
//       if (res.status && res.data) {
//         const normalized = res.data.map(pkg => ({
//           ...pkg,
//           packageIdStr: pkg.packageId?._id?.toString() || pkg.packageId?.toString() || ""
//         }));
//         setPackages(normalized);
//       }
//     } catch (err) {
//       console.error("Failed to load packages", err);
//     }
//   };

//   const fetchWalletBalance = async () => {
//     try {
//       const res = await getWalletBalance(userId);
//       if (res.status && res.data) {
//         setWalletBalance(res.data.walletBalance || 0);
//       }
//     } catch (err) {
//       console.log("Wallet balance not loaded", err);
//       setWalletBalance(0);
//     }
//   };

//   const filteredPackages = searchTerm.trim()
//     ? packages.filter(pkg =>
//       pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     : packages;

//   const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

//   // Helper to calculate dates
//   const calculateDates = (pkg, advanceRenewal) => {
//     const today = new Date();
//     let baseDate = today;

//     if (advanceRenewal && currentPlan && new Date(currentPlan.expiryDate) >= today) {
//       baseDate = new Date(currentPlan.expiryDate);
//     }

//     const start = new Date(baseDate);
//     if (advanceRenewal) {
//       start.setDate(start.getDate() + 1);
//     }

//     const expiry = new Date(start);
//     const validityNum = Number(pkg?.validity?.number) || 1;
//     expiry.setMonth(expiry.getMonth() + validityNum);

//     return {
//       startDate: start.toISOString().split("T")[0],
//       expiryDate: expiry.toISOString().split("T")[0],
//     };
//   };

//   const openPurchaseModal = () => {
//     setIsRenew(false);
//     setSelectedPackage(null);
//     setSearchTerm("");

//     const today = new Date();
//     const hasActivePlan = currentPlan && new Date(currentPlan.expiryDate) >= today;

//     setIsAdvanceRenewal(hasActivePlan);

//     const { startDate, expiryDate } = calculateDates(null, hasActivePlan);

//     setForm({
//       packageId: "",
//       amountPaid: 0,
//       startDate,
//       expiryDate,
//       isPaymentReceived: false,
//       paymentAmount: 0,
//       paymentDate: today.toISOString().split("T")[0],
//       paymentMethod: "Cash",
//       remark: "",
//       paymentRemark: "",
//     });

//     setShowModal(true);
//   };

//   const openRenewModal = (planToRenew = currentPlan) => {
//     if (!planToRenew) {
//       toast.error("No active/current plan found to renew");
//       return;
//     }

//     const planPkgId = planToRenew.packageId?._id?.toString() || planToRenew.packageId?.toString();
//     const assignedPkg = packages.find(p => p.packageIdStr === planPkgId);

//     if (!assignedPkg) {
//       toast.error("Package not found in assigned list. Refresh page.");
//       return;
//     }

//     // Show next validity period (just for information – backend will decide real activation)
//     const proposedStart = new Date(planToRenew.expiryDate);
//     proposedStart.setDate(proposedStart.getDate() + 1);

//     const proposedExpiry = new Date(proposedStart);
//     const validityNum = Number(assignedPkg.validity?.number) || 1;
//     const unit = assignedPkg.validity?.unit?.toLowerCase() || 'month';

//     if (unit === 'day') proposedExpiry.setDate(proposedExpiry.getDate() + validityNum);
//     else if (unit === 'week') proposedExpiry.setDate(proposedExpiry.getDate() + validityNum * 7);
//     else if (unit === 'month') proposedExpiry.setMonth(proposedExpiry.getMonth() + validityNum);
//     else if (unit === 'year') proposedExpiry.setFullYear(proposedExpiry.getFullYear() + validityNum);

//     setIsRenew(true);
//     setIsAdvanceRenewal(true);           // ← ALWAYS true for renewals
//     setCurrentPlan(planToRenew);
//     setSelectedPackage(assignedPkg);

//     setForm({
//       packageId: assignedPkg._id,
//       amountPaid: assignedPkg.customPrice || assignedPkg.basePrice || 0,
//       startDate: proposedStart.toISOString().split("T")[0],
//       expiryDate: proposedExpiry.toISOString().split("T")[0],
//       isPaymentReceived: false,
//       paymentAmount: assignedPkg.customPrice || assignedPkg.basePrice || 0,
//       paymentDate: new Date().toISOString().split("T")[0],
//       paymentMethod: "Cash",
//       remark: "Advance renewal request",
//       paymentRemark: "",
//     });

//     setShowModal(true);
//   };


//   const handlePackageChange = (assignedPkgId) => {
//     const pkg = packages.find((p) => p._id === assignedPkgId);
//     if (!pkg) return;

//     const isAlreadyActive = plans.some(plan => {
//       const planPkgId = plan.packageId?._id?.toString() || plan.packageId?.toString();
//       return planPkgId === pkg.packageIdStr && new Date(plan.expiryDate) >= new Date();
//     });

//     if (isAlreadyActive && !isRenew && !isAdvanceRenewal) {
//       toast.error("This plan is already active! Enable Advance Renewal or use Renew button.", {
//         position: "top-center",
//         autoClose: 6000,
//       });
//       return;
//     }

//     setSelectedPackage(pkg);

//     const { startDate, expiryDate } = calculateDates(pkg, isAdvanceRenewal || isRenew);

//     setForm({
//       ...form,
//       packageId: pkg._id,
//       amountPaid: pkg.customPrice || pkg.basePrice || 0,
//       paymentAmount: pkg.customPrice || pkg.basePrice || 0,
//       startDate,
//       expiryDate,
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
//         packageId: selectedPackage.packageId?._id || selectedPackage.packageId,
//         assignedPackageId: form.packageId,
//         startDate: new Date(form.startDate).toISOString(),
//         expiryDate: new Date(form.expiryDate).toISOString(),

//         amountPaid: parseFloat(form.amountPaid) || 0,           // ← total due / package price

//         isPaymentReceived: form.isPaymentReceived,                  // "Yes" / "No"
//         paymentAmount: form.isPaymentReceived === true
//           ? parseFloat(form.paymentAmount) || 0                 // ← actual received now
//           : 0,

//         paymentMethod: form.paymentMethod,
//         paymentDate: form.isPaymentReceived === true
//           ? new Date(form.paymentDate).toISOString()
//           : null,
//         paymentRemark: form.paymentRemark || "",

//         advanceRenewal: isAdvanceRenewal,
//         remark: form.remark || (isRenew ? "Advance renewal request" : "New plan purchased"),
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
//           autoClose: 4000,
//         });
//         setShowModal(false);
//         fetchCurrentPlan();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "something went wrong.", {
//         position: "top-center",
//         autoClose: 6000,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-2xl text-gray-700 font-bold">Loading...</div>
//       </div>
//     );
//   }

//   const handleRefund = async (planId) => {
//     if (!window.confirm("Are you sure you want to refund this plan")) {
//       return;
//     }

//     try {
//       const res = await refundPurchasedPlan(planId);
//       if (res.status) {
//         toast.success("Plan refunded successfully!", {
//           position: "top-center",
//           autoClose: 4000,
//         });
//         fetchCurrentPlan();
//         fetchWalletBalance();
//       } else {
//         toast.error(res.message || "Refund failed.");
//       }
//     } catch (err) {
//       toast.error(err.message || "An error occurred during refund.");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-8xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8">User Recharge Management</h2>

//           <div className="flex justify-end gap-6 mb-8">
//             <ProtectedAction module="customer" action="PurchasedNewPackage">
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
//                     Latest Active to Row 1
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
//                     <ProtectedAction module="customer" action="RenewPackage">
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
//                         <td className="px-6 py-4">{plan.packageId?.name || "Unknown"}</td>
//                         <td className="px-6 py-4">{formatDate(plan.startDate)}</td>
//                         <td className="px-6 py-4">{formatDate(plan.expiryDate)}</td>
//                         <td className="px-6 py-4">₹{plan.amountPaid}</td>
//                         <td className="px-6 py-4">
//                           {plan.latestRenewal ? "Yes (Latest)" : plan.isRenewed ? "Yes" : "No"}
//                         </td>

//                         <ProtectedAction module="customer" action="RenewPackage">
//                           <td className="px-6 py-4">
//                             {isCurrentlyActive && (
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={() => openRenewModal(plan)}
//                                   className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
//                                 >
//                                   Renew
//                                 </button>

//                                 <ProtectedAction module="customer" action="RefundPackage">
//                                   <button
//                                     onClick={() => handleRefund(plan._id)}
//                                     className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
//                                   >
//                                     Refund
//                                   </button>
//                                 </ProtectedAction>
//                               </div>
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

//       {/* MODAL */}
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
//                   <div className="flex items-center gap-3 relative">
//                     <label className="w-36 font-semibold">Current Plan :</label>
//                     <div className="flex-1 relative">
//                       <input
//                         type="text"
//                         className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none bg-white"
//                         placeholder="Search package..."
//                         value={searchTerm || (selectedPackage ? selectedPackage.packageName : "")}
//                         onChange={(e) => {
//                           setSearchTerm(e.target.value);
//                           setShowDropdown(true);
//                           if (e.target.value !== selectedPackage?.packageName) {
//                             setSelectedPackage(null);
//                             setForm({ ...form, packageId: "" });
//                           }
//                         }}
//                         onFocus={() => setShowDropdown(true)}
//                         onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//                         disabled={isRenew}
//                       />
//                       {showDropdown && (
//                         <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-b mt-1 max-h-48 overflow-y-auto shadow-lg text-xs">
//                           {filteredPackages.length > 0 ? (
//                             filteredPackages.map((pkg) => (
//                               <li
//                                 key={pkg._id}
//                                 className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
//                                 onClick={() => {
//                                   handlePackageChange(pkg._id);
//                                   setSearchTerm(pkg.packageName);
//                                   setShowDropdown(false);
//                                 }}
//                               >
//                                 {pkg.packageName}
//                               </li>
//                             ))
//                           ) : (
//                             <li className="px-3 py-2 text-gray-500">No matching packages</li>
//                           )}
//                         </ul>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">MRP :</label>
//                     <input
//                       type="text"
//                       className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
//                       value={selectedPackage?.customPrice || selectedPackage?.basePrice || "0"}
//                       readOnly
//                     />
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
//                     <input
//                       type="text"
//                       className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold"
//                       value={`₹${Math.abs(Number(walletBalance)).toFixed(2)}`}
//                       readOnly
//                     />
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
//                     <input
//                       type="checkbox"
//                       className={`w-4 h-4 ${isRenew ? "accent-green-600" : "accent-blue-600"}`}
//                       checked={isRenew || isAdvanceRenewal}
//                       onChange={(e) => !isRenew && setIsAdvanceRenewal(e.target.checked)}
//                       disabled={isRenew}
//                     />
//                     <span className={`font-bold text-xs ${isRenew ? "text-green-600" : ""}`}>
//                       Advance Renewal
//                     </span>
//                     <input
//                       type="text"
//                       className="w-28 border border-gray-300 rounded px-2 py-1 bg-gray-200 text-center text-xs"
//                       value={currentPlan ? formatDate(currentPlan.expiryDate) : ""}
//                       readOnly
//                     />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="w-36">Validity :</label>
//                     <input
//                       type="text"
//                       className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
//                       value={`${selectedPackage?.validity?.number || ""} ${selectedPackage?.validity?.unit || ""}`}
//                       readOnly
//                     />
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
//                         checked={form.isPaymentReceived === true}
//                         onChange={() => setForm({ ...form, isPaymentReceived: true, paymentAmount: form.amountPaid })}
//                         className="w-4 h-4"
//                       />
//                       <span className="font-bold text-sm">Yes</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment"
//                         checked={form.isPaymentReceived === false}
//                         onChange={() => setForm({ ...form, isPaymentReceived: false })}
//                         className="w-4 h-4"
//                       />
//                       <span className="font-bold text-sm">No</span>
//                     </label>
//                   </div>
//                 </div>

//                 {form.isPaymentReceived === true && (
//                   <div className="grid grid-cols-2 gap-5 max-w-4xl mx-auto text-xs">
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Amount</span>
//                       <input
//                         type="number"
//                         className="w-52 border border-gray-400 rounded px-3 py-1.5"
//                         value={form.paymentAmount}
//                         onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
//                       />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Payment Date</span>
//                       <input
//                         type="date"
//                         className="w-52 border border-gray-400 rounded px-3 py-1.5"
//                         value={form.paymentDate}
//                         onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
//                       />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Payment Mode</span>
//                       <select
//                         className="w-52 border border-gray-400 rounded px-3 py-1.5"
//                         value={form.paymentMethod}
//                         onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
//                       >
//                         <option>Cash</option>
//                         <option>Upi</option>
//                         <option>Wallet</option>
//                         <option>Cheque</option>
//                         <option>Online</option>
//                       </select>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Remark</span>
//                       <input
//                         type="text"
//                         className="w-52 border border-gray-400 rounded px-3 py-1.5"
//                         value={form.paymentRemark}
//                         onChange={(e) => setForm({ ...form, paymentRemark: e.target.value })}
//                         placeholder="e.g. Paid via GPay"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-300 my-2"></div>
//                 <div className="grid grid-cols-2 gap-2 text-xs font-bold max-w-4xl mx-auto">
//                   <div className="flex justify-between"><span>Total Payable</span><span className="text-gray-800">₹{form.amountPaid || "0.00"}</span></div>
//                   <div className="flex justify-between"><span>Remaining</span><span className="text-gray-800">₹{form.isPaymentReceived === true ? (form.amountPaid - (parseFloat(form.paymentAmount) || 0)).toFixed(2) : form.amountPaid || "0.00"}</span></div>
//                   <div className="flex justify-between"><span>Payment Received</span><span className="text-gray-800">₹{form.isPaymentReceived === true ? form.paymentAmount || "0.00" : "0.00"}</span></div>
//                   {/* <div className="flex justify-between"><span>Wallet After</span><span className="text-gray-800">₹{form.isPaymentReceived === "Yes" ? (-100 - (form.amountPaid - (parseFloat(form.paymentAmount) || 0))).toFixed(2) : (-100 - form.amountPaid).toFixed(2)}</span></div> */}
//                   <div className="flex justify-between">
//                     <span>Wallet After</span>
//                     <span className="text-gray-800">
//                       ₹{(walletBalance - (form.isPaymentReceived === true
//                         ? (form.amountPaid - parseFloat(form.paymentAmount) || 0)
//                         : form.amountPaid)).toFixed(2)}
//                     </span>
//                   </div>
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
  getWalletBalance,
  refundPurchasedPlan
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

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    packageId: "",
    amountPaid: 0,
    startDate: "",
    expiryDate: "",
    isPaymentReceived: false,
    paymentAmount: 0,
    paymentDate: "",
    paymentMethod: "Online",
    remark: "",
    paymentRemark: "",
  });

  const [isAdvanceRenewal, setIsAdvanceRenewal] = useState(false);

  useEffect(() => {
    fetchCurrentPlan();
    fetchPackages();
    fetchWalletBalance();
  }, [userId]);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const res = await getCurrentPlan(userId);
      if (res.status && res.data && res.data.length > 0) {
        // Show only parent plans (exclude any accidental renewal-as-document if backend sends)
        // But in your case, backend sends only parent documents
        const filtered = res.data.filter(plan => plan.status !== "expired");

        // Sort: active plans come first
        const sorted = filtered.sort((a, b) => {
          if (a.status === "active" && b.status !== "active") return -1;
          if (a.status !== "active" && b.status === "active") return 1;
          return new Date(b.purchaseDate || b.startDate) - new Date(a.purchaseDate || a.startDate);
        });

        setPlans(sorted);

        const active = sorted.find(p => p.status === "active");
        setCurrentPlan(active || sorted[0]);
      } else {
        setPlans([]);
        setCurrentPlan(null);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
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

  const filteredPackages = searchTerm.trim()
    ? packages.filter(pkg =>
        pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : packages;

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const calculateDates = (pkg, advanceRenewal) => {
    const today = new Date();
    let baseDate = today;

    if (advanceRenewal && currentPlan && new Date(currentPlan.expiryDate) >= today) {
      baseDate = new Date(currentPlan.expiryDate);
    }

    const start = new Date(baseDate);
    if (advanceRenewal) start.setDate(start.getDate() + 1);

    const expiry = new Date(start);
    const validityNum = Number(pkg?.validity?.number) || 1;
    expiry.setMonth(expiry.getMonth() + validityNum);

    return {
      startDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
    };
  };

  const openPurchaseModal = () => {
    setIsRenew(false);
    setSelectedPackage(null);
    setSearchTerm("");

    const today = new Date();
    const hasActivePlan = currentPlan && new Date(currentPlan.expiryDate) >= today;

    setIsAdvanceRenewal(hasActivePlan);

    const { startDate, expiryDate } = calculateDates(null, hasActivePlan);

    setForm({
      packageId: "",
      amountPaid: 0,
      startDate,
      expiryDate,
      isPaymentReceived: false,
      paymentAmount: 0,
      paymentDate: today.toISOString().split("T")[0],
      paymentMethod: "Cash",
      remark: "",
      paymentRemark: "",
    });

    setShowModal(true);
  };

  const openRenewModal = (planToRenew = currentPlan) => {
    if (!planToRenew || planToRenew.status !== "active") {
      toast.error("Only active plans can be renewed.");
      return;
    }

    const planPkgId = planToRenew.packageId?._id?.toString() || planToRenew.packageId?.toString();
    const assignedPkg = packages.find(p => p.packageIdStr === planPkgId);

    if (!assignedPkg) {
      toast.error("Package not found in assigned list.");
      return;
    }

    const proposedStart = new Date(planToRenew.expiryDate);
    proposedStart.setDate(proposedStart.getDate() + 1);

    const proposedExpiry = new Date(proposedStart);
    const validityNum = Number(assignedPkg.validity?.number) || 1;
    const unit = assignedPkg.validity?.unit?.toLowerCase() || 'month';

    if (unit === 'day') proposedExpiry.setDate(proposedExpiry.getDate() + validityNum);
    else if (unit === 'week') proposedExpiry.setDate(proposedExpiry.getDate() + validityNum * 7);
    else if (unit === 'month') proposedExpiry.setMonth(proposedExpiry.getMonth() + validityNum);
    else if (unit === 'year') proposedExpiry.setFullYear(proposedExpiry.getFullYear() + validityNum);

    setIsRenew(true);
    setIsAdvanceRenewal(true);
    setCurrentPlan(planToRenew);
    setSelectedPackage(assignedPkg);

    setForm({
      packageId: assignedPkg._id,
      amountPaid: assignedPkg.customPrice || assignedPkg.basePrice || 0,
      startDate: proposedStart.toISOString().split("T")[0],
      expiryDate: proposedExpiry.toISOString().split("T")[0],
      isPaymentReceived: false,
      paymentAmount: assignedPkg.customPrice || assignedPkg.basePrice || 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      remark: "Advance renewal request",
      paymentRemark: "",
    });

    setShowModal(true);
  };

  const handlePackageChange = (assignedPkgId) => {
    const pkg = packages.find((p) => p._id === assignedPkgId);
    if (!pkg) return;

    const isAlreadyActive = plans.some(plan => {
      const planPkgId = plan.packageId?._id?.toString() || plan.packageId?.toString();
      return planPkgId === pkg.packageIdStr && new Date(plan.expiryDate) >= new Date();
    });

    if (isAlreadyActive && !isRenew && !isAdvanceRenewal) {
      toast.error("This plan is already active! Enable Advance Renewal or use Renew button.", {
        position: "top-center",
        autoClose: 6000,
      });
      return;
    }

    setSelectedPackage(pkg);

    const { startDate, expiryDate } = calculateDates(pkg, isAdvanceRenewal || isRenew);

    setForm({
      ...form,
      packageId: pkg._id,
      amountPaid: pkg.customPrice || pkg.basePrice || 0,
      paymentAmount: pkg.customPrice || pkg.basePrice || 0,
      startDate,
      expiryDate,
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
        isPaymentReceived: form.isPaymentReceived,
        paymentAmount: form.isPaymentReceived === true
          ? parseFloat(form.paymentAmount) || 0
          : 0,
        paymentMethod: form.paymentMethod,
        paymentDate: form.isPaymentReceived === true
          ? new Date(form.paymentDate).toISOString()
          : null,
        paymentRemark: form.paymentRemark || "",
        advanceRenewal: isAdvanceRenewal,
        remark: form.remark || (isRenew ? "Advance renewal request" : "New plan purchased"),
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
      toast.error(err.response?.data?.message || "Something went wrong.", {
        position: "top-center",
        autoClose: 6000,
      });
    }
  };

  const handleRefund = async (planId) => {
    if (!window.confirm("Are you sure you want to refund this plan?")) return;

    try {
      const res = await refundPurchasedPlan(planId);
      if (res.status) {
        toast.success("Plan refunded successfully!", { position: "top-center", autoClose: 4000 });
        fetchCurrentPlan();
        fetchWalletBalance();
      } else {
        toast.error(res.message || "Refund failed.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during refund.");
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
        <div className="max-w-8xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">User Recharge Management</h2>

          <div className="flex justify-end gap-6 mb-8">
            <ProtectedAction module="customer" action="PurchasedNewPackage">
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
                <h3 className="text-xl font-bold">All Plans</h3>
                {plans.length > 1 && (
                  <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
                    Active plan shown first
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
                    <ProtectedAction module="customer" action="RenewPackage">
                      <th className="px-6 py-4 text-left">Action</th>
                    </ProtectedAction>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan._id}
                      className={`hover:bg-gray-50 border-b ${plan.status === "active" ? "bg-blue-50 font-bold" : ""}`}
                    >
                      <td className="px-6 py-4">
                        {plan.status === "active" ? (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                            ACTIVE
                          </span>
                        ) : plan.status === "pending" ? (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                            PENDING
                          </span>
                        ) : (
                          <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs">
                            {plan.status?.toUpperCase() || "UNKNOWN"}
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

                      <ProtectedAction module="customer" action="RenewPackage">
                        <td className="px-6 py-4">
                          {plan.status === "active" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openRenewModal(plan)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
                              >
                                Renew
                              </button>

                              <ProtectedAction module="customer" action="RefundPackage">
                                <button
                                  onClick={() => handleRefund(plan._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-5 rounded shadow transition"
                                >
                                  Refund
                                </button>
                              </ProtectedAction>
                            </div>
                          )}
                        </td>
                      </ProtectedAction>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - unchanged from your version */}
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
                          if (e.target.value !== selectedPackage?.packageName) {
                            setSelectedPackage(null);
                            setForm({ ...form, packageId: "" });
                          }
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        disabled={isRenew}
                      />
                      {showDropdown && (
                        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-b mt-1 max-h-48 overflow-y-auto shadow-lg text-xs">
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
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 font-bold"
                      value={`₹${Math.abs(Number(walletBalance)).toFixed(2)}`}
                      readOnly
                    />
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
                    <input
                      type="checkbox"
                      className={`w-4 h-4 ${isRenew ? "accent-green-600" : "accent-blue-600"}`}
                      checked={isRenew || isAdvanceRenewal}
                      onChange={(e) => !isRenew && setIsAdvanceRenewal(e.target.checked)}
                      disabled={isRenew}
                    />
                    <span className={`font-bold text-xs ${isRenew ? "text-green-600" : ""}`}>
                      Advance Renewal
                    </span>
                    <input
                      type="text"
                      className="w-28 border border-gray-300 rounded px-2 py-1 bg-gray-200 text-center text-xs"
                      value={currentPlan ? formatDate(currentPlan.expiryDate) : ""}
                      readOnly
                    />
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
                        checked={form.isPaymentReceived === true}
                        onChange={() => setForm({ ...form, isPaymentReceived: true, paymentAmount: form.amountPaid })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.isPaymentReceived === false}
                        onChange={() => setForm({ ...form, isPaymentReceived: false })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">No</span>
                    </label>
                  </div>
                </div>

                {form.isPaymentReceived === true && (
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
                        <option>Upi</option>
                        <option>Wallet</option>
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
                  <div className="flex justify-between"><span>Remaining</span><span className="text-gray-800">₹{form.isPaymentReceived === true ? (form.amountPaid - (parseFloat(form.paymentAmount) || 0)).toFixed(2) : form.amountPaid || "0.00"}</span></div>
                  <div className="flex justify-between"><span>Payment Received</span><span className="text-gray-800">₹{form.isPaymentReceived === true ? form.paymentAmount || "0.00" : "0.00"}</span></div>
                  <div className="flex justify-between">
                    <span>Wallet After</span>
                    <span className="text-gray-800">
                      ₹{(walletBalance - (form.isPaymentReceived === true
                        ? (form.amountPaid - parseFloat(form.paymentAmount) || 0)
                        : form.amountPaid)).toFixed(2)}
                    </span>
                  </div>
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