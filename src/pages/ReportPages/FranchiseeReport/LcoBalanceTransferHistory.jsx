import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { getLcoBalanceTransferReport } from "../../../service/franchiseeReports";
import { IoMdArrowBack } from "react-icons/io";

export default function LcoBalanceTransferHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch LCO balance transfer report
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const res = await getLcoBalanceTransferReport(page, limit, searchTerm);
        setTransactions(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching LCO balance transfer report:", err);
        setError("Failed to load LCO balance transfer report");
        toast.error("Failed to load LCO balance transfer report ❌");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [page, searchTerm]);

  const handleView = (id) => {
    navigate(`/transaction/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">LCO Balance Transfer History</h1>
      </div>
 <button
                  onClick={() => navigate("/report/list")}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center mb-1"
                >
                  <IoMdArrowBack /> Back
                </button>
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full md:w-1/3 rounded text-[14px]"
        />
      </div> */}
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No transactions found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">LCO Name</th>
                  <th className="px-[2px] py-[2px] text-left">Reseller Name</th>
                  <th className="px-[2px] py-[2px] text-left">Amount</th>
                  <th className="px-[2px] py-[2px] text-left">Transfer Date</th>
                  <th className="px-[2px] py-[2px] text-left">Remark</th>
                  <th className="px-[2px] py-[2px] text-left">Created By</th>
                  <th className="px-[2px] py-[2px] text-left">Created At</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px]">{transaction.lco.lcoName}</td>
                    <td className="px-[2px] py-[2px]">{transaction.reseller.resellerName}</td>
                    <td className="px-[2px] py-[2px]">{transaction.amount}</td>
                    <td className="px-[2px] py-[2px]">{new Date(transaction.transferDate).toLocaleString()}</td>
                    <td className="px-[2px] py-[2px]">{transaction.remark}</td>
                    <td className="px-[2px] py-[2px]">{transaction.createdByName}</td>
                    <td className="px-[2px] py-[2px]">{new Date(transaction.createdAt).toLocaleString()}</td>
                    {/* <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleView(transaction._id)}
                          className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {transactions.map((transaction, index) => (
              <div
                key={transaction._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <p className="text-sm">LCO: {transaction.lco.lcoName}</p>
                <p className="text-sm">Reseller: {transaction.reseller.resellerName}</p>
                <p className="text-sm">Amount: {transaction.amount}</p>
                <p className="text-sm">Transfer Date: {new Date(transaction.transferDate).toLocaleString()}</p>
                <p className="text-sm">Remark: {transaction.remark}</p>
                <p className="text-sm">Created By: {transaction.createdByName}</p>
                <p className="text-sm">Created At: {new Date(transaction.createdAt).toLocaleString()}</p>
                {/* <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(transaction._id)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                </div> */}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
}