// src/pages/SupportMessageList.jsx
import React, { useState, useEffect } from "react";
// import { getSupportMessages } from "../../service/message";
import { format } from "date-fns";

export default function SupportMessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getSupportMessages();
      if (res.status) {
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const paginatedData = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "-";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  const getUserInfo = (msg) => {
    if (msg.userId?.generalInformation) {
      return {
        name: msg.userId.generalInformation.name || "Unknown User",
        phone: msg.userId.generalInformation.phone || "-",
        email: msg.userId.generalInformation.email || "-",
      };
    }
    return { name: "Guest User", phone: "-", email: "-" };
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading support messages...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Support Messages</h1>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-700">{messages.length}</span>
        </div>
      </div>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-xl font-medium text-gray-600">No support messages found</p>
          <p className="text-gray-500 mt-2">New messages will appear here automatically</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View - EXACT SAME AS ConnectionRequestList */}
          <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Message</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((msg, index) => {
                  const user = getUserInfo(msg);
                  return (
                    <tr key={msg._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{user.phone}</td>
                      <td className="px-4 py-3 text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-md">
                        {truncateText(msg.message)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - SAME AS ConnectionRequestList */}
          <div className="space-y-4 md:hidden">
            {paginatedData.map((msg, index) => {
              const user = getUserInfo(msg);
              return (
                <div key={msg._id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-gray-500">
                      #{(currentPage - 1) * itemsPerPage + index + 1}
                    </p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>

                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-600">Mobile:</span>{" "}
                      <span className="text-gray-800 font-medium">{user.phone}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Email:</span>{" "}
                      <span className="text-gray-700">{user.email}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Message:</span>{" "}
                      <span className="text-gray-700">{truncateText(msg.message, 80)}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                      {format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination - EXACT SAME */}
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