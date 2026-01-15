// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { getCompletePayments } from "../../service/payment";
// import * as XLSX from "xlsx";

// export default function CompletePaymentList() {
//   const [payments, setPayments] = useState([]);
//   const [filteredPayments, setFilteredPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchInput, setSearchInput] = useState(""); 
//   const [searchTerm, setSearchTerm] = useState("");  
//   const itemsPerPage = 15;

//   // Fetch complete payments
//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const res = await getCompletePayments();
//       const data = res.data || [];
//       setPayments(data);
//       setFilteredPayments(data);
//     } catch (err) {
//       toast.error(err.message || "Failed to fetch complete payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   // Handle search when button is clicked
//   const handleSearch = () => {
//     const term = searchInput.trim().toLowerCase();
//     setSearchTerm(term);
//     setCurrentPage(1);

//     if (!term) {
//       setFilteredPayments(payments);
//       return;
//     }

//     const filtered = payments.filter((item) => {
//       const user = item.userId?.generalInformation || {};
//       const username = (user.username || "").toLowerCase();
//       const name = (user.name || "").toLowerCase();
//       return username.includes(term) || name.includes(term);
//     });

//     setFilteredPayments(filtered);
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((p) => p + 1);
//   };
//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((p) => p - 1);
//   };

//   // Download Excel (filtered data)
//   const handleDownloadExcel = () => {
//     if (filteredPayments.length === 0) {
//       toast.info("No data to export");
//       return;
//     }

//     const exportData = filteredPayments.map((item, index) => {
//       const user = item.userId?.generalInformation || {};
//       return {
//         "S.No": index + 1,
//         "Username": user.username || "—",
//         "Name": user.name || "N/A",
//         "Invoice No": item.ReceiptNo || "—",
//         "Total Amount": item.totalAmount || 0,
//         "Paid Amount": item.dueAmount || 0,
//         "Payment Mode": item.paymentMode || "Online",
//         "Paid Date": new Date(item.PaymentDate).toLocaleDateString("en-IN"),
//         "Paid Time": new Date(item.PaymentDate).toLocaleTimeString("en-IN"),
//         "Recharge Date": new Date(item.PaymentDate).toLocaleDateString("en-IN"),
//       };
//     });

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Completed Payments");

//     ws["!cols"] = [
//       { wch: 8 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
//       { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
//       { wch: 15 }, { wch: 15 },
//     ];

//     const today = new Date().toISOString().slice(0, 10);
//     XLSX.writeFile(wb, `Completed_Payments_${today}.xlsx`);

//     toast.success("Excel downloaded successfully!");
//   };

//   if (loading) return <p className="p-6 text-gray-600">Loading payments...</p>;

//   return (
//     <div className="p-6 flex flex-col min-h-screen">
//       {/* Header with Search + Download */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Received Payment List
//         </h2>

//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           {/* Search Box with Icon */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//               placeholder="Search by username or name"
//               className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
//             />
//             <button
//               onClick={handleSearch}
//               className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600"
//             >
//               🔍
//             </button>
//           </div>

//           {/* Download Excel */}
//           <button
//             onClick={handleDownloadExcel}
//             className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow flex items-center justify-center gap-2 transition"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//             </svg>
//             Download Excel
//           </button>
//         </div>
//       </div>

//       {/* Count Info */}
//       <div className="text-sm text-gray-500 mb-4">
//         Showing {startIndex + 1}–
//         {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of{" "}
//         {filteredPayments.length} completed payments
//       </div>

//       {/* Table */}
//       <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
//         <table className="w-full text-sm text-left border-collapse">
//           <thead className="bg-blue-50 text-gray-700 border-b">
//             <tr>
//               <th className="px-3 py-2 border text-center">S.NO</th>
//               <th className="px-3 py-2 border text-center">USER / LINK ID</th>
//               <th className="px-3 py-2 border text-center">INVOICE NO</th>
//               <th className="px-3 py-2 border text-center">TOTAL</th>
//               <th className="px-3 py-2 border text-center">PAID</th>
//               <th className="px-3 py-2 border text-center">MODE</th>
//               <th className="px-3 py-2 border text-center">PAID DATE</th>
//               <th className="px-3 py-2 border text-center">RECHARGE DATE</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentPayments.length > 0 ? (
//               currentPayments.map((item, index) => {
//                 const user = item.userId?.generalInformation || {};
//                 return (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     <td className="border px-3 py-2 text-center font-medium">
//                       {startIndex + index + 1}
//                     </td>

//                     <td className="border px-3 py-2 text-center">
//                       <div className="font-semibold text-blue-700">
//                         {user.username || "—"}
//                       </div>
//                       <div className="text-gray-700 text-xs">
//                         {user.name || "N/A"}
//                       </div>
//                     </td>

//                     <td className="border px-3 py-2 text-center text-blue-600">
//                       {item.ReceiptNo || "—"}
//                     </td>

//                     <td className="border px-3 py-2 text-center">
//                       ₹{item.totalAmount || 0}
//                     </td>

//                     <td className="border px-3 py-2 text-center text-green-600 font-semibold">
//                       ₹{item.dueAmount || 0}
//                     </td>

//                     <td className="border px-3 py-2 text-center">
//                       {item.paymentMode || "Online"}
//                     </td>

//                     <td className="border px-3 py-2 text-center">
//                       {new Date(item.PaymentDate).toLocaleDateString()} <br />
//                       <span className="text-xs text-gray-500">
//                         {new Date(item.PaymentDate).toLocaleTimeString()}
//                       </span>
//                     </td>

//                     <td className="border px-3 py-2 text-center">
//                       {new Date(item.PaymentDate).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-8 text-gray-500">
//                   No completed payments found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {filteredPayments.length > itemsPerPage && (
//         <div className="mt-6 flex justify-center items-center gap-6 pb-4">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
//               currentPage === 1
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             ← Previous
//           </button>

//           <div className="text-sm font-medium text-gray-700">
//             Page {currentPage} of {totalPages}
//           </div>

//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
//               currentPage === totalPages
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import PaymentFilter from "./PaymentFilter";
import { getFilteredPayments } from "../../service/payment";
import * as XLSX from "xlsx";

export default function CompletePaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  const itemsPerPage = 15;

  const fetchPayments = useCallback(async (params) => {
    setLoading(true);
    try {
      // CRITICAL: Always force paymentStatus=Completed — no override allowed
      const finalParams = new URLSearchParams(params);
      finalParams.set("paymentStatus", "Completed");

      const res = await getFilteredPayments(finalParams.toString());
      const data = res.data || [];
      const count = res.total || data.length;

      setPayments(data);
      setTotal(count);
      setCurrentPage(1);
    } catch (err) {
      toast.error(err.message || "Failed to fetch completed payments");
      setPayments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set default to Completed on first load
  useEffect(() => {
    if (searchParams.toString() === "") {
      const defaultParams = new URLSearchParams();
      defaultParams.set("paymentStatus", "Completed");
      setSearchParams(defaultParams);
    }
  }, []);

  // Re-fetch whenever filter changes
  useEffect(() => {
    fetchPayments(searchParams);
  }, [searchParams, fetchPayments]);

  // Pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };                                                            

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Excel Download - Only Completed
  const handleDownloadExcel = () => {
    if (payments.length === 0) {
      toast.info("No data to export");
      return;
    }

    const exportData = payments.map((item, index) => {
      const user = item.userId?.generalInformation || {};
      return {
        "S.No": index + 1,
        "Username": user.username || "—",
        "Name": user.name || "N/A",
        "Invoice No": item.ReceiptNo || "—",
        "Total Amount": item.totalAmount || 0,
        "Paid Amount": item.dueAmount || 0,
        "Payment Mode": item.paymentMode || "Online",
        "Paid Date": new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN"),
        "Paid Time": new Date(item.createdAt || item.PaymentDate).toLocaleTimeString("en-IN"),
        // "Recharge Date": new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN"),
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Completed Payments");

    ws["!cols"] = [
      { wch: 8 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 },
    ];

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Completed_Payments_${today}.xlsx`);

    toast.success("Excel downloaded successfully!");
  };

  if (loading && payments.length === 0) {
    return <p className="p-6 text-gray-600">Loading completed payments...</p>;
  }

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Advanced Filter Panel - Works only on Completed payments */}
      <PaymentFilter setSearchParams={setSearchParams} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Received Payment List
        </h2>

        <button
          onClick={handleDownloadExcel}
          disabled={loading || payments.length === 0}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Excel
        </button>
      </div>

      {/* Count Info */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {payments.length > 0 ? startIndex + 1 : 0}–
        {Math.min(startIndex + itemsPerPage, payments.length)} of {total} completed payments
      </div>

      {/* Table - Blue Theme */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-blue-50 text-gray-700 border-b">
            <tr>
              <th className="px-3 py-2 border text-center">S.NO</th>
              <th className="px-3 py-2 border text-center">USER / LINK ID</th>
              <th className="px-3 py-2 border text-center">INVOICE NO</th>
              <th className="px-3 py-2 border text-center">TOTAL</th>
              <th className="px-3 py-2 border text-center">PAID</th>
              <th className="px-3 py-2 border text-center">MODE</th>
              <th className="px-3 py-2 border text-center">PAID DATE</th>
              {/* <th className="px-3 py-2 border text-center">RECHARGE DATE</th> */}
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((item, index) => {
                const user = item.userId?.generalInformation || {};
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-center font-medium">
                      {startIndex + index + 1}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      <div className="font-semibold text-blue-700">
                        {user.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {user.name || "N/A"}
                      </div>
                    </td>

                    <td className="border px-3 py-2 text-center text-blue-600">
                      {item.ReceiptNo || "—"}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      ₹{item.totalAmount || 0}
                    </td>

                    <td className="border px-3 py-2 text-center text-green-600 font-semibold">
                      ₹{item.dueAmount || 0}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {item.paymentMode || "Online"}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN")}{" "}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt || item.PaymentDate).toLocaleTimeString("en-IN")}
                      </span>
                    </td>

                    {/* <td className="border px-3 py-2 text-center">
                      {new Date(item.createdAt || item.PaymentDate).toLocaleDateString("en-IN")}
                    </td> */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No completed payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Blue Buttons */}
      {total > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}