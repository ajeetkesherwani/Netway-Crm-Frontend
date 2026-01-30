// import { useEffect, useState, useRef } from "react";
// import { FaCheck, FaSearch } from "react-icons/fa";
// import { toast } from "react-hot-toast";
// import { getInvoices } from "../../service/purchasedPlan";
// import * as XLSX from 'xlsx';

// export default function IptvPackageList() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const itemsPerPage = 15;

//   // Fetch IPTV plans using the invoice service
//   const fetchIptvPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await getInvoices("iptv"); // Calls /common/invoiceList?type=iptv
//       setPlans(res.data.invoices || []); // Access invoices array from response
//     } catch (err) {
//       toast.error(err.message || "Failed to fetch IPTV plans");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIptvPlans();
//   }, []);

//   // Handle search on Enter or icon click
//   const handleSearch = () => {
//     setSearchTerm(searchInput.trim());
//     setCurrentPage(1); // Reset to page 1
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Download Excel
//   const downloadExcel = () => {
//     const data = plans.map((invoice, index) => ({
//       "S.NO": index + 1,
//       "Recharge Type": "IPTV",
//       "Username": invoice.userId?.generalInformation?.username || '—',
//       "Name": invoice.userId?.generalInformation?.name || 'N/A',
//       "Invoice No.": invoice.invoiceNumber || '—',
//       "Package": invoice.packageName || '—',
//       "Amount": invoice.amount || 0,
//       "Invoice Date": new Date(invoice.createdAt).toLocaleString(),
//       "Duration": `${new Date(invoice.duration.startDate).toLocaleDateString()} - ${new Date(invoice.duration.endDate).toLocaleDateString()}`,
//       "Added By": invoice.addedBy || '—',
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "IPTV_Invoices");
//     XLSX.writeFile(wb, "iptv_invoices.xlsx");
//   };

//   // Filter plans by package name
//   const filteredPlans = plans.filter(invoice =>
//     invoice.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   if (loading) return <p className="p-6 text-gray-600">Loading IPTV invoices...</p>;

//   return (
//     <div className="p-6 flex flex-col min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">
//           IPTV Recharge List
//         </h2>
//         <div className="flex items-center gap-3">
//           <div className="relative flex items-center">
//             <input
//               type="text"
//               placeholder="Search by package name..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute left-3 text-gray-400 cursor-pointer hover:text-blue-600"
//               onClick={handleSearch}
//             />
//           </div>
//           <button
//             onClick={downloadExcel}
//             className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
//           >
//             Download Excel
//           </button>
//           <span className="text-sm text-gray-500">
//             Showing {startIndex + 1}–
//             {Math.min(startIndex + itemsPerPage, filteredPlans.length)} of {filteredPlans.length}
//           </span>
//         </div>
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
//               <th className="px-3 py-2 border">ADDED BY</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentPlans.length > 0 ? (
//               currentPlans.map((invoice, index) => {
//                 const userInfo = invoice.userId?.generalInformation || {};
//                 const packageType = invoice.packageType || {};

//                 return (
//                   <tr key={invoice._id} className="hover:bg-gray-50">
//                     <td className="border px-3 py-2">
//                       {startIndex + index + 1}
//                     </td>

//                     {/* Recharge Type - Always IPTV */}
//                     <td className="border px-3 py-2 text-center">
//                       <div className="flex justify-center gap-3">
//                         <RechargeType label="IPTV" active={true} />
//                       </div>
//                     </td>

//                     {/* User Details */}
//                     <td className="border px-3 py-2">
//                       <div className="text-blue-700 font-medium">
//                         {userInfo.username || "—"}
//                       </div>
//                       <div className="text-gray-700 text-xs">
//                         {userInfo.name || "N/A"}
//                       </div>
//                     </td>

//                     {/* Invoice No. - Plain text */}
//                     <td className="border px-3 py-2 text-blue-600">
//                       {invoice.invoiceNumber || "—"}
//                     </td>

//                     {/* Package */}
//                     <td className="border px-3 py-2 text-gray-800">
//                       {invoice.packageName || "—"}
//                     </td>

//                     {/* Amount */}
//                     <td className="border px-3 py-2 text-center">
//                       <span
//                         className={`px-2 py-1 rounded text-white text-xs ${Number(invoice.amount) > 1000
//                             ? "bg-red-500"
//                             : "bg-green-500"
//                           }`}
//                       >
//                         ₹{invoice.amount || 0}
//                       </span>
//                     </td>

//                     {/* Invoice Date */}
//                     <td className="border px-3 py-2 text-gray-700">
//                       {new Date(invoice.createdAt).toLocaleDateString()} <br />
//                       <span className="text-xs text-gray-500">
//                         {new Date(invoice.createdAt).toLocaleTimeString()}
//                       </span>
//                     </td>


//                     {/* Duration */}
//                     <td className="border px-3 py-2 text-gray-700">
//                       <span className="text-xs">
//                         {new Date(invoice.duration.startDate).toLocaleDateString()} →{" "}
//                         {new Date(invoice.duration.endDate).toLocaleDateString()}
//                       </span>
//                     </td>

//                     {/* added by */}
//                     <td className="border px-3 py-2 text-gray-700">
//                       {invoice.addedBy}

//                     </td>

//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4 text-gray-500">
//                   No IPTV invoices found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {filteredPlans.length > itemsPerPage && (
//         <div className="mt-6 flex justify-center items-center gap-6 pb-4">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${currentPage === 1
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//           >
//             ← Previous
//           </button>

//           <div className="text-sm font-medium text-gray-700">
//             Page {currentPage} of {totalPages}
//           </div>

//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${currentPage === totalPages
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // Reusable RechargeType Component
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

// IptvPackageList.jsx (or IptvPurchasedPlanList.jsx)
import { useEffect, useState, useRef } from "react";
import { FaCheck, FaSearch, FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getInvoices } from "../../service/purchasedPlan";
import * as XLSX from "xlsx";
import { InvoiceFilters } from "../Invoice/InvoiceFilter"; // Adjust path if needed

export default function IptvPackageList() {
  const [plans, setPlans] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 15;

  const [filters, setFilters] = useState({
    userSearch: "",
    fromDate: "",
    toDate: "",
    areaId: "",
    lcoId: "",
    resellerId: "",
    packageId: "",
    status: "",
    createdBy: "",
  });

  // Fetch IPTV plans with filters & pagination
  const fetchIptvPlans = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: itemsPerPage,
        type: "iptv", // Fixed for IPTV
        ...(filters.userSearch && { userSearch: filters.userSearch }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        ...(filters.areaId && { areaId: filters.areaId }),
        ...(filters.lcoId && { lcoId: filters.lcoId }),
        ...(filters.resellerId && { resellerId: filters.resellerId }),
        ...(filters.packageId && { packageId: filters.packageId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.createdBy && { createdBy: filters.createdBy }),
      }).toString();

      const res = await getInvoices(`?${queryParams}`);
      setPlans(res.data.invoices || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      toast.error(err.message || "Failed to fetch IPTV invoices");
      setPlans([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIptvPlans(currentPage);
  }, [currentPage]);

  // Search & Reset handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchIptvPlans(1);
  };

  const handleReset = () => {
    setFilters({
      userSearch: "",
      fromDate: "",
      toDate: "",
      areaId: "",
      lcoId: "",
      resellerId: "",
      packageId: "",
      status: "",
      createdBy: "",
    });
    setSearchInput("");
    setCurrentPage(1);
    fetchIptvPlans(1);
  };

  // Optional: Client-side package name filter
  const filteredPlans = plans.filter((plan) =>
    plan.packageName?.toLowerCase().includes(searchInput.trim().toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Download Excel
  const downloadExcel = () => {
    const data = filteredPlans.map((invoice, index) => ({
      "S.NO": index + 1,
      "Recharge Type": "IPTV",
      "Username": invoice.userId?.generalInformation?.username || "—",
      "Name": invoice.userId?.generalInformation?.name || "N/A",
      "Invoice No.": invoice.invoiceNumber || "—",
      "Package": invoice.packageName || "—",
      "Amount": invoice.amount || 0,
      "Invoice Date": new Date(invoice.createdAt).toLocaleString(),
      "Duration": `${new Date(invoice.duration?.startDate).toLocaleDateString()} - ${new Date(
        invoice.duration?.endDate
      ).toLocaleDateString()}`,
      "Added By": invoice.addedBy || "—",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IPTV_Invoices");
    XLSX.writeFile(wb, "iptv_invoices.xlsx");
  };

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">IPTV Recharge List</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by package name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch
              className="absolute left-3 text-gray-400 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setCurrentPage(1);
                fetchIptvPlans(1);
              }}
            />
          </div>
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* Filters - Same as OTT & main list */}
      <InvoiceFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Showing info */}
      <div className="mb-4 text-sm text-gray-600">
        {loading
          ? "Loading..."
          : `Showing ${filteredPlans.length} of ${totalCount} IPTV invoices`}
      </div>

      {/* Table */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
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
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">Loading...</td>
              </tr>
            ) : filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No IPTV invoices found.
                </td>
              </tr>
            ) : (
              filteredPlans.map((invoice, index) => {
                const userInfo = invoice.userId?.generalInformation || {};
                const packageType = invoice.packageType || {};

                return (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Recharge Type - Always IPTV */}
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <RechargeType label="IPTV" active={true} />
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

                    {/* Invoice No. */}
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
                          Number(invoice.amount) > 1000 ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        ₹{invoice.amount || 0}
                      </span>
                    </td>

                    {/* Invoice Date */}
                    <td className="border px-3 py-2 text-gray-700">
                      {new Date(invoice.createdAt).toLocaleDateString("en-GB")}{" "}
                      {/* dd/mm/yyyy */}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="border px-3 py-2 text-gray-700">
                      {new Date(invoice.duration?.startDate).toLocaleDateString("en-GB")} →{" "}
                      {new Date(invoice.duration?.endDate).toLocaleDateString("en-GB")}
                    </td>

                    {/* Added By */}
                    <td className="border px-3 py-2 text-gray-700">
                      {invoice.addedBy || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

// Reusable RechargeType Component
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