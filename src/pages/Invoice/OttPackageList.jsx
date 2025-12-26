// import { useEffect, useState } from "react";
// import { FaCheck } from "react-icons/fa";
// import { toast } from "react-hot-toast";
// import { getPurchasedPlans } from "../../service/purchasedPlan";

// export default function OttPackageList() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   // ✅ Fetch OTT plans only
//   const fetchOttPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await getPurchasedPlans("ott"); // 👈 This calls ?type=ott
//       setPlans(res.data || []);
//     } catch (err) {
//       toast.error(err.message || "Failed to fetch OTT plans");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOttPlans();
//   }, []);

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(plans.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentPlans = plans.slice(startIndex, startIndex + itemsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((p) => p + 1);
//   };
//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((p) => p - 1);
//   };

//   if (loading) return <p className="p-6 text-gray-600">Loading OTT plans...</p>;

//   return (
//     <div className="p-6 flex flex-col min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">
//           OTT Recharge List
//         </h2>
//         <span className="text-sm text-gray-500">
//           Showing {startIndex + 1}–
//           {Math.min(startIndex + itemsPerPage, plans.length)} of {plans.length}
//         </span>
//       </div>

//       {/* Table */}
//       <div className="flex-grow overflow-x-auto border rounded-md bg-white">
//         <table className="w-full text-sm text-left border-collapse">
//           <thead className="bg-gray-100 text-gray-700 border-b">
//             <tr>
//               <th className="px-3 py-2 border">S.NO</th>
//               <th className="px-3 py-2 border text-center">RECHARGE TYPE</th>
//               <th className="px-3 py-2 border">USER DETAILS</th>
//               <th className="px-3 py-2 border">INVOICE NO.</th>
//               <th className="px-3 py-2 border">PACKAGE</th>
//               <th className="px-3 py-2 border">AMOUNT</th>
//               <th className="px-3 py-2 border">INVOICE DATE</th>
//               <th className="px-3 py-2 border">DURATION</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentPlans.length > 0 ? (
//               currentPlans.map((plan, index) => {
//                 const pkg = plan.package || {};
//                 const userInfo = plan.user?.generalInformation || {};

//                 return (
//                   <tr key={plan._id} className="hover:bg-gray-50">
//                     <td className="border px-3 py-2">
//                       {startIndex + index + 1}
//                     </td>

//                     {/* ✅ Recharge Type */}
//                     <td className="border px-3 py-2 text-center">
//                       <RechargeType label="OTT" active={pkg?.isOtt} />
//                     </td>

//                     {/* ✅ User Info */}
//                     <td className="border px-3 py-2">
//                       <div className="text-blue-700 font-medium">
//                         {userInfo.username || "—"}
//                       </div>
//                       <div className="text-gray-700 text-xs">
//                         {userInfo.name || "N/A"}
//                       </div>
//                     </td>

//                     {/* ✅ Invoice No */}
//                     <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
//                       {`INV/25-26/${startIndex + index + 6650}`}
//                     </td>

//                     {/* ✅ Package */}
//                     <td className="border px-3 py-2 text-gray-800">
//                       {pkg?.name || "—"}
//                     </td>

//                     {/* ✅ Amount */}
//                     <td className="border px-3 py-2 text-center">
//                       <span
//                         className={`px-2 py-1 rounded text-white text-xs ${
//                           Number(pkg?.basePrice) > 1000
//                             ? "bg-red-500"
//                             : "bg-green-500"
//                         }`}
//                       >
//                         ₹{pkg?.basePrice || 0}
//                       </span>
//                     </td>

//                     {/* ✅ Invoice Date */}
//                     <td className="border px-3 py-2 text-gray-700">
//                       {new Date(plan.purchaseDate).toLocaleDateString()} <br />
//                       <span className="text-xs text-gray-500">
//                         {new Date(plan.purchaseDate).toLocaleTimeString()}
//                       </span>
//                     </td>

//                     {/* ✅ Duration */}
//                     <td className="border px-3 py-2 text-gray-700">
//                       <span className="text-xs">
//                         {new Date(plan.startDate).toLocaleDateString()} →{" "}
//                         {new Date(plan.expiryDate).toLocaleDateString()}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4 text-gray-500">
//                   No OTT plans found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Pagination Controls */}
//       {plans.length > itemsPerPage && (
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

// // ✅ Reusable RechargeType
// const RechargeType = ({ label, active }) => (
//   <div className="text-center text-xs">
//     <div>{label}</div>
//     {active && (
//       <div className="mx-auto mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
//         <FaCheck className="text-white text-[10px]" />
//       </div>
//     )}
//   </div>
// );


import { useEffect, useState, useRef } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getInvoices } from "../../service/purchasedPlan";
import * as XLSX from 'xlsx';

export default function OTTPurchasedPlanList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 15;

  // Fetch OTT invoices (pass type="ott")
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoices("ott"); // Fetches only OTT invoices
      setInvoices(res.data.invoices || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch OTT invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle search on Enter or icon click
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1); // Reset to page 1
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Download Excel
  const downloadExcel = () => {
    const data = invoices.map((invoice, index) => ({
      "S.NO": index + 1,
      "Recharge Type": "OTT", // Fixed since we filter for OTT only
      "Username": invoice.userId?.generalInformation?.username || '—',
      "Name": invoice.userId?.generalInformation?.name || 'N/A',
      "Invoice No.": invoice.invoiceNumber || '—',
      "Package": invoice.packageName || '—',
      "Amount": invoice.amount || 0,
      "Invoice Date": new Date(invoice.createdAt).toLocaleString(),
      "Duration": `${new Date(invoice.duration.startDate).toLocaleDateString()} - ${new Date(invoice.duration.endDate).toLocaleDateString()}`,
      "Added By": invoice.addedBy || '—',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OTT_Invoices");
    XLSX.writeFile(wb, "ott_invoices.xlsx");
  };

  // Filter invoices by package name
  const filteredInvoices = invoices.filter(invoice =>
    invoice.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading OTT invoices...</p>;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          OTT Recharge List
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by package name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch
              className="absolute left-3 text-gray-400 cursor-pointer hover:text-blue-600"
              onClick={handleSearch}
            />
          </div>
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
          >
            Download Excel
          </button>
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="px-3 py-2 border">S.NO</th>
              <th className="px-3 py-2 border text-center">RECHARGE TYPE</th>
              <th className="px-3 py-2 border">USER DETAILS</th>
              <th className="px-3 py-2 border">INVOICE NO.</th>
              <th className="px-3 py-2 border">PACKAGE</th>
              <th className="px-3 py-2 border">AMOUNT</th>
              <th className="px-3 py-2 border">INVOICE DATE</th>
              <th className="px-3 py-2 border">DURATION</th>
              <th className="px-3 py-2 border">ADDED BY</th>
            </tr>
          </thead>

          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice, index) => {
                const userInfo = invoice.userId?.generalInformation || {};
                const packageType = invoice.packageType || {};

                return (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {startIndex + index + 1}
                    </td>

                    {/* Recharge Type - Always OTT */}
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <RechargeType label="OTT" active={true} />
                      </div>
                    </td>

                    {/* User Details */}
                    <td className="border px-3 py-2">
                      <div className="text-blue-700 font-medium">
                        {userInfo.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {userInfo.name || "N/A"}
                      </div>
                    </td>

                    {/* Invoice No. - Not clickable */}
                    <td className="border px-3 py-2 text-blue-600">
                      {invoice.invoiceNumber || "—"}
                    </td>

                    {/* Package */}
                    <td className="border px-3 py-2 text-gray-800">
                      {invoice.packageName || "—"}
                    </td>

                    {/* Amount */}
                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          Number(invoice.amount) > 1000
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        ₹{invoice.amount || 0}
                      </span>
                    </td>

                    {/* Invoice Date */}
                    <td className="border px-3 py-2 text-gray-700">
                      {new Date(invoice.createdAt).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="border px-3 py-2 text-gray-700">
                      <span className="text-xs">
                        {new Date(invoice.duration.startDate).toLocaleDateString()} →{" "}
                        {new Date(invoice.duration.endDate).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Added By */}
                    <td className="border px-3 py-2 text-gray-700">
                      {invoice.addedBy || "—"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No OTT invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredInvoices.length > itemsPerPage && (
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

// Small reusable RechargeType component
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