import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { getLcoWalletList } from "../../../service/lco";

export default function LcoWalletList() {
  const { id } = useParams(); // LCO member ID from URL params
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const menuRef = useRef(null);
  const [transferData, setTransferData] = useState({});
  const [filterLetter, setFilterLetter] = useState("");

  // Fetch wallet transactions with filter
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const res = await getLcoWalletList(id, page, limit, searchTerm, filterLetter);
        setTransactions(res.data?.histories || []);
        setTotalPages(res.totalPages || 1);
        setTransferData({ lcoWalletBalance: res.data?.lcoWalletBalance || '', resellerData: res.data?.reseller || {} });
      } catch (err) {
        console.error("Error fetching wallet transactions:", err);
        setError("Failed to load wallet transactions");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [id, page, searchTerm, filterLetter]);
  // Handlers
  const handleView = (transactionId, transactionData) => {
    navigate(`/lco/wallet/view/${id}/${transactionId}`, {
      state: {
        data: transactionData
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilter = (letter) => {
    setFilterLetter(letter);
    setPage(1); // Reset to first page on filter
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p className="p-4">Loading wallet transactions...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="">
      <div className="flex items-center justify-end h-0 mb-4">
        <div className="space-x-2 flex">
          {/* <button
            onClick={() => navigate(`/lco/list`)}
            className="px-[2px] py-[2px] text-white bg-gray-600 rounded hover:bg-gray-700 text-[12px]"
          >
            <span className="flex items-center">
              <IoMdArrowBack className="mr-1" /> Back
            </span>
          </button> */}
          <button
            onClick={() => navigate(`/lco/wallet/create/${id}`, { state: { data: transferData } })}
            className="px-1 py-[1px] text-white bg-blue-600 rounded hover:bg-blue-700 relative -top-3 right-6 text-[12px]"
          >
            Add Transaction
          </button>
        </div>
      </div>
      {/* <div className="mb-1 flex flex-col md:flex-row justify-between items-start">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full md:w-1/3 rounded mb-2 md:mb-0"
        />
        <div className="flex flex-wrap gap-1">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'All'].map((letter) => (
            <button
              key={letter}
              onClick={() => handleFilter(letter === 'All' ? '' : letter)}
              className={`px-2 py-1 rounded ${filterLetter === (letter === 'All' ? '' : letter) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div> */}
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">No transactions found.</p>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-[2px] py-[2px] text-left">S.No</th>
                    <th className="px-[2px] py-[2px] text-left">Transaction ID</th>
                    <th className="px-[2px] py-[2px] text-left">Amount</th>
                    <th className="px-[2px] py-[2px] text-left">Remark</th>
                    <th className="px-[2px] py-[2px] text-left">Created By</th>
                    <th className="px-[2px] py-[2px] text-left">Transfer Date</th>
                    <th className="px-[2px] py-[2px] text-left">Created At</th>
                    <th className="px-[2px] py-[2px] text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                      <td className="px-[2px] py-[2px]">{transaction._id}</td>
                      <td className="px-[2px] py-[2px]">{transaction.amount}</td>
                      <td className="px-[2px] py-[2px]">{transaction.remark}</td>
                      <td className="px-[2px] py-[2px]">{transaction.createdBy}</td>
                      <td className="px-[2px] py-[2px]">{new Date(transaction.transferDate).toLocaleString()}</td>
                      <td className="px-[2px] py-[2px]">{new Date(transaction.createdAt).toLocaleString()}</td>
                      <td className="px-[2px] py-[2px] text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(transaction._id, transaction)}
                            className="p-1 text-gray-600 hover:text-blue-600 rounded"
                            title="View"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
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
                  <h2 className="text-lg font-medium">{transaction._id}</h2>
                  <p className="text-sm">Amount: {transaction.amount}</p>
                  <p className="text-sm">Remark: {transaction.remark}</p>
                  <p className="text-sm">Created By: {transaction.createdBy}</p>
                  <p className="text-sm">Transfer Date: {new Date(transaction.transferDate).toLocaleString()}</p>
                  <p className="text-sm">Created: {new Date(transaction.createdAt).toLocaleString()}</p>
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => handleView(transaction._id, transaction)}
                      className="text-blue-600 flex items-center text-sm"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* pagination */}
          {/* <div className="md:w-1/4 md:ml-4 mt-4 md:mt-0">
            <div className="flex flex-col items-end">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded mb-2 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mb-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}