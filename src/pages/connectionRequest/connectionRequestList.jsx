// import React, { useState, useEffect } from "react";
// import { getConnectionRequests } from "../../service/connectionRequest";
// import { format } from "date-fns";

// export default function ConnectionRequestList() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const res = await getConnectionRequests();
//       if (res.status) {
//         setRequests(res.data || []);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(requests.length / itemsPerPage);
//   const paginatedData = requests.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (loading) {
//     return <p className="p-6 text-center text-gray-600">Loading connection requests...</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Connection Requests</h1>
//         <div className="text-sm text-gray-500">
//           Total: <span className="font-semibold text-gray-700">{requests.length}</span>
//         </div>
//       </div>

//       {/* Empty State */}
//       {requests.length === 0 ? (
//         <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
//           <svg
//             className="mx-auto h-16 w-16 text-gray-400 mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17 14v6m-3-4v4m-2-8v10m-4-6v6m8-14H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z"
//             />
//           </svg>
//           <p className="text-xl font-medium text-gray-600">No connection requests found</p>
//           <p className="text-gray-500 mt-2">New requests will appear here automatically</p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">S.No</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Address</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Comment</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {paginatedData.map((req, index) => (
//                   <tr key={req._id} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3 text-gray-900">
//                       {(currentPage - 1) * itemsPerPage + index + 1}
//                     </td>
//                     <td className="px-4 py-3 font-medium text-gray-900">{req.name}</td>
//                     <td className="px-4 py-3">
//                       <a href={`tel:${req.mobile}`} className="text-blue-600 font-medium hover:underline">
//                         {req.mobile}
//                       </a>
//                     </td>
//                     <td className="px-4 py-3">
//                       <a href={`mailto:${req.email}`} className="text-indigo-600 hover:underline">
//                         {req.email}
//                       </a>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{req.address || "-"}</td>
//                     <td className="px-4 py-3 text-gray-600 max-w-md">{req.comment || "-"}</td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="space-y-4 md:hidden">
//             {paginatedData.map((req, index) => (
//               <div
//                 key={req._id}
//                 className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <p className="text-sm text-gray-500">
//                     #{(currentPage - 1) * itemsPerPage + index + 1}
//                   </p>
//                   <span className="text-xs text-gray-500">
//                     {format(new Date(req.createdAt), "dd MMM yyyy")}
//                   </span>
//                 </div>

//                 <h3 className="text-lg font-semibold text-gray-800">{req.name}</h3>

//                 <div className="mt-3 space-y-2 text-sm">
//                   <p>
//                     <span className="font-medium text-gray-600">Mobile:</span>{" "}
//                     <a href={`tel:${req.mobile}`} className="text-blue-600 font-medium">
//                       {req.mobile}
//                     </a>
//                   </p>
//                   <p>
//                     <span className="font-medium text-gray-600">Email:</span>{" "}
//                     <a href={`mailto:${req.email}`} className="text-indigo-600">
//                       {req.email}
//                     </a>
//                   </p>
//                   {req.address && (
//                     <p>
//                       <span className="font-medium text-gray-600">Address:</span>{" "}
//                       <span className="text-gray-700">{req.address}</span>
//                     </p>
//                   )}
//                   {req.comment && (
//                     <p>
//                       <span className="font-medium text-gray-600">Comment:</span>{" "}
//                       <span className="text-gray-700">{req.comment}</span>
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-3">
//                     {format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-8 flex justify-center items-center gap-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded border ${
//                   currentPage === 1
//                     ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 Previous
//               </button>

//               <div className="flex gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-4 py-2 rounded border text-sm font-medium ${
//                       currentPage === page
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded border ${
//                   currentPage === totalPages
//                     ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { getConnectionRequests } from "../../service/connectionRequest";
import { format } from "date-fns";

export default function ConnectionRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getConnectionRequests();
      if (res.status) {
        setRequests(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedData = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Truncate comment
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "-";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading connection requests...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Connection Requests</h1>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-700">{requests.length}</span>
        </div>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 14v6m-3-4v4m-2-8v10m-4-6v6m8-14H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>
          <p className="text-xl font-medium text-gray-600">No connection requests found</p>
          <p className="text-gray-500 mt-2">New requests will appear here automatically</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Comment</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((req, index) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{req.name}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{req.mobile}</td>
                    <td className="px-4 py-3 text-gray-700">{req.email}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {req.address || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-md">
                      {truncateText(req.comment)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {paginatedData.map((req, index) => (
              <div key={req._id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm text-gray-500">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </p>
                  <span className="text-xs text-gray-500">
                    {format(new Date(req.createdAt), "dd MMM yyyy")}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{req.name}</h3>

                <div className="mt-3 space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-gray-600">Mobile:</span>{" "}
                    <span className="text-gray-800 font-medium">{req.mobile}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    <span className="text-gray-700">{req.email}</span>
                  </p>
                  {req.address && (
                    <p>
                      <span className="font-medium text-gray-600">Address:</span>{" "}
                      <span className="text-gray-700">{req.address}</span>
                    </p>
                  )}
                  {req.comment && (
                    <p>
                      <span className="font-medium text-gray-600">Comment:</span>{" "}
                      <span className="text-gray-700">{truncateText(req.comment, 80)}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    {format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded border text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded border text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}