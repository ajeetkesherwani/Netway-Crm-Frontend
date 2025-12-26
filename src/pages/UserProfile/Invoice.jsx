
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserFullDetails } from "../../service/user";

// // Component to display recharge type with optional active indicator
// const RechargeTypeBadge = ({ label, active }) => (
//   <div className="text-center text-xs">
//     <div className="text-gray-700">{label}</div>
//     {active && (
//       <div className="mt-1 w-6 h-6 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
//         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//         </svg>
//       </div>
//     )}
//   </div>
// );

// const UserInvoices = () => {
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
//         console.error("Error fetching user invoices:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN");
//   };

//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString("en-IN")} ${date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-gray-600 text-lg bg-gray-50 min-h-screen">
//         Loading invoices...
//       </div>
//     );
//   }

//   const plans = data?.purchasedPlans || [];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Purchased Plans & Invoices</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Total Records: <span className="font-medium">{plans.length}</span>
//         </p>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
//               <tr>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">S.No</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Recharge Type</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">User</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">Invoice No</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">Package</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Amount</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">Purchase Date</th>
//                 <th className="px-4 py-3 font-semibold border-r border-gray-300">Validity</th>
//                 <th className="px-4 py-3 font-semibold">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {plans.length > 0 ? (
//                 plans.map((plan, index) => {
//                   const pkg = plan.packageId || {};
//                   const isOtt = pkg.isOtt || false;
//                   const isIptv = pkg.isIptv || false;
//                   const isInternet = !isOtt && !isIptv;

//                   const userName = data?.userDetails?.generalInformation?.name || "N/A";
//                   const username = data?.userDetails?.generalInformation?.username || "—";

//                   return (
//                     <tr key={plan._id} className="hover:bg-gray-50 border-b border-gray-200">
//                       {/* S.No */}
//                       <td className="px-4 py-4 text-center font-medium text-gray-800 border-r border-gray-200">
//                         {index + 1}
//                       </td>

//                       {/* Recharge Type - Blue tick only for active */}
//                       <td className="px-4 py-4 border-r border-gray-200">
//                         <div className="flex justify-center gap-4">
//                           <RechargeTypeBadge label="Internet" active={isInternet} />
//                           <RechargeTypeBadge label="OTT" active={isOtt} />
//                           <RechargeTypeBadge label="IPTV" active={isIptv} />
//                         </div>
//                       </td>

//                       {/* User Info */}
//                       <td className="px-4 py-4 border-r border-gray-200">
//                         <div className="font-medium text-blue-700">{username}</div>
//                         <div className="text-xs text-gray-600">{userName}</div>
//                       </td>

//                       {/* Invoice No */}
//                       <td className="px-4 py-4 border-r border-gray-200">
//                         <span className="text-blue-600 underline cursor-pointer font-medium">
//                           INV/25-26/{String(6650 + index).padStart(5, "0")}
//                         </span>
//                       </td>

//                       {/* Package Name */}
//                       <td className="px-4 py-4 border-r border-gray-200 font-medium text-gray-800">
//                         {pkg.name || "—"}
//                       </td>

//                       {/* Amount */}
//                       <td className="px-4 py-4 text-center border-r border-gray-200">
//                         <span
//                           className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
//                             (pkg.basePrice || 0) > 1000 ? "bg-red-500" : "bg-green-600"
//                           }`}
//                         >
//                           ₹{pkg.basePrice || plan.amountPaid || 0}
//                         </span>
//                       </td>

//                       {/* Purchase Date */}
//                       <td className="px-4 py-4 text-gray-700 border-r border-gray-200 text-xs">
//                         {formatDateTime(plan.purchaseDate || plan.createdAt)}
//                       </td>

//                       {/* Validity */}
//                       <td className="px-4 py-4 text-gray-700 border-r border-gray-200 text-xs">
//                         {plan.startDate && formatDate(plan.startDate)} →{" "}
//                         {plan.expiryDate && formatDate(plan.expiryDate)}
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-4 text-center">
//                         <span
//                           className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
//                             plan.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : plan.status === "expired"
//                               ? "bg-gray-100 text-gray-700"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {plan.status?.charAt(0).toUpperCase() + plan.status?.slice(1) || "Unknown"}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="text-center py-10 text-gray-500 text-lg">
//                     No purchased plans or invoices found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInvoices;

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaCheck, FaTrashAlt, FaEye, FaEllipsisV, FaDownload, FaUndo } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ProtectedAction from "../../components/ProtectedAction";

// Import the new service function
import { getUserInvoices, fetchInvoicePdfBlob, downloadInvoicePdf } from "../../service/purchasedPlan";

// Recharge Type Badge (same as PurchasedPlanList)
const RechargeType = ({ label, active }) => (
  <div className="text-center text-xs">
    <div>{label}</div>
    {active && (
      <div className="mx-auto mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
        <FaCheck className="text-white text-[10px]" />
      </div>
    )}
  </div>
);

const UserInvoices = () => {
  const { id } = useParams(); // user ID from route
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Fetch user invoices using the service
  const fetchUserInvoices = async () => {
    setLoading(true);
    try {
      const data = await getUserInvoices(id);
      setInvoices(data.invoices || []);
    } catch (err) {
      toast.error(err.message || "Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserInvoices();
    }
  }, [id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // View PDF in new tab
  const handleViewInvoice = async (invoiceId) => {
    try {
      const blob = await fetchInvoicePdfBlob(invoiceId);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to open PDF");
      setOpenMenuId(null);
    }
  };

  // Direct PDF download
  const handleDirectDownload = (invoiceId, invoiceNumber) => {
    downloadInvoicePdf(invoiceId, invoiceNumber);
    setOpenMenuId(null);
  };

  // Mock actions (replace with real API calls when ready)
  const handleDelete = (invoiceId) => {
    if (window.confirm("Are you sure you want to remove this invoice?")) {
      toast.success(`Invoice ${invoiceId} removed (mock)`);
      setOpenMenuId(null);
    }
  };

  const handleRefund = (invoiceId) => {
    if (window.confirm("Are you sure you want to refund this plan?")) {
      toast.success(`Refund processed for ${invoiceId} (mock)`);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Invoices</h2>
        <p className="text-sm text-gray-600 mt-1">
          {loading
            ? "Loading..."
            : `Showing ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Table - Exact match to PurchasedPlanList UI */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 border">S.NO</th>
              <th className="px-4 py-3 border text-center">RECHARGE TYPE</th>
              <th className="px-4 py-3 border">USER DETAILS</th>
              <th className="px-4 py-3 border">INVOICE NO.</th>
              <th className="px-4 py-3 border">PACKAGE</th>
              <th className="px-4 py-3 border">AMOUNT</th>
              <th className="px-4 py-3 border">LCO AMOUNT</th>
              <th className="px-4 py-3 border">RESELLER AMOUNT</th>
              <th className="px-4 py-3 border">INVOICE DATE</th>
              <th className="px-4 py-3 border">DURATION</th>
              <th className="px-4 py-3 border">ADDED BY</th>
              <th className="px-4 py-3 border text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-8">Loading...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  No invoices found for this user.
                </td>
              </tr>
            ) : (
              invoices.map((invoice, index) => {
                const userInfo = invoice.userId?.generalInformation || {};
                const pkgType = invoice.packageType || {};

                return (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">{index + 1}</td>

                    <td className="border px-4 py-3 text-center">
                      <div className="flex justify-center gap-4">
                        <RechargeType label="Internet" active={pkgType.internet} />
                        <RechargeType label="OTT" active={pkgType.isOtt} />
                        <RechargeType label="IPTV" active={pkgType.isIptv} />
                      </div>
                    </td>

                    <td className="border px-4 py-3">
                      <div className="font-medium text-blue-700">
                        {userInfo.username || "—"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {userInfo.name || "N/A"}
                      </div>
                    </td>

                    <td className="border px-4 py-3">
                      <span
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                        onClick={() => handleViewInvoice(invoice._id)}
                      >
                        {invoice.invoiceNumber || "—"}
                      </span>
                    </td>

                    <td className="border px-4 py-3">{invoice.packageName || "—"}</td>

                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          Number(invoice.amount) > 1000 ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        ₹{invoice.amount || 0}
                      </span>
                    </td>

                    <td className="border px-4 py-3 text-center">₹{invoice.lcoAmount || 0}</td>
                    <td className="border px-4 py-3 text-center">₹{invoice.resellerAmount || 0}</td>

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString()}
                      </span>
                    </td>

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.duration?.startDate).toLocaleDateString("en-GB")} →{" "}
                      {new Date(invoice.duration?.endDate).toLocaleDateString("en-GB")}
                    </td>

                    <td className="border px-4 py-3 text-gray-700">{invoice.addedBy || "—"}</td>

                    <td className="border px-4 py-3 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === invoice._id ? null : invoice._id)
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === invoice._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 z-50 bg-white border rounded shadow-lg w-48 py-1"
                        >
                          <ProtectedAction module="invoice" action="packageRechargeView">
                            <button
                              onClick={() => handleViewInvoice(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEye className="mr-2 text-blue-600" /> View
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="invoiceDownload">
                            <button
                              onClick={() =>
                                handleDirectDownload(invoice._id, invoice.invoiceNumber)
                              }
                              className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                            >
                              <FaDownload className="mr-2" /> Download
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="packageRechargeRefund">
                            <button
                              onClick={() => handleRefund(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              <FaUndo className="mr-2" /> Refund Plan
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="packageRechargeRemove">
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <FaTrashAlt className="mr-2" /> Remove
                            </button>
                          </ProtectedAction>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInvoices;