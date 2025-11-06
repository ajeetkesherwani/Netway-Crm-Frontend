import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getPriceBookList, deletePriceBook } from "../../service/pricebook";
import { toast } from "react-toastify";

export default function PriceBookList() {
  const navigate = useNavigate();
  const [priceBooks, setPriceBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch price books
  useEffect(() => {
    const loadPriceBooks = async () => {
      setLoading(true);
      try {
        const res = await getPriceBookList(page, limit, searchTerm);
        setPriceBooks(res.data || []);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error("Error fetching price books:", err);
        setError("Failed to load price books");
      } finally {
        setLoading(false);
      }
    };
    loadPriceBooks();
  }, [page, searchTerm]);

  // Handlers
  const handleView = (id) => {
    navigate(`/pricebook/view/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/pricebook/update/${id}`);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this price book?")) {
      try {
        await deletePriceBook(id);
        toast.success("Price book deleted successfully ✅");
        setPriceBooks(priceBooks.filter((pb) => pb._id !== id));
      } catch (err) {
        console.error("Error deleting price book:", err);
        toast.error(err.message || "Failed to delete price book ❌");
      }
    }
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

  if (loading) return <p className="p-4">Loading price books...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Price Book List</h1>
        <ProtectedAction module="pricebook" action="create">
          <button
            onClick={() => navigate(`/pricebook/create`)}
            className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
            aria-label="Add Price Book"
          >
            Add Price Book
          </button>
        </ProtectedAction>
      </div>
{/* 
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search price books..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full md:w-1/3 rounded text-[14px]"
        />
      </div> */}

      {priceBooks.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No price books found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Price Book Name</th>
                  <th className="px-[2px] py-[2px] text-left">From Date</th>
                  <th className="px-[2px] py-[2px] text-left">To Date</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Description</th>
                  <th className="px-[2px] py-[2px] text-left">Price Book For</th>
                  <th className="px-[2px] py-[2px] text-left">Packages</th>
                  <th className="px-[2px] py-[2px] text-left">Assigned To</th>
                  <th className="px-[2px] py-[2px] text-left">Created At</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priceBooks.map((priceBook, index) => (
                  <tr key={priceBook._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline" onClick={() => handleView(priceBook._id)}>{priceBook.priceBookName}</td>
                    <td className="px-[2px] py-[2px]">{new Date(priceBook.fromDate).toLocaleDateString()}</td>
                    <td className="px-[2px] py-[2px]">{new Date(priceBook.toDate).toLocaleDateString()}</td>
                    <td className="px-[2px] py-[2px]">{priceBook.status}</td>
                    <td className="px-[2px] py-[2px]">{priceBook.description}</td>
                    <td className="px-[2px] py-[2px]">{priceBook.priceBookFor.join(", ")}</td>
                    <td className="px-[2px] py-[2px]">{priceBook.package.map((p) => p.name).join(", ")}</td>
                    <td className="px-[2px] py-[2px]">{priceBook.assignedTo.length} reseller(s)</td>
                    <td className="px-[2px] py-[2px]">{new Date(priceBook.createdAt).toLocaleString()}</td>
                    <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex justify-end space-x-3">
                        <ProtectedAction module="pricebook" action="view">
                          <button
                            onClick={() => handleView(priceBook._id)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                            aria-label="View"
                          >
                            <FaEye size={16} />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="pricebook" action="edit">
                          <button
                            onClick={() => handleEdit(priceBook._id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="pricebook" action="delete">
                          <button
                            onClick={() => handleDelete(priceBook._id)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </ProtectedAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {priceBooks.map((priceBook, index) => (
              <div
                key={priceBook._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium hover:cursor-pointer hover:underline" onClick={() => handleView(priceBook._id)}>{priceBook.priceBookName}</h2>
                <p className="text-sm">From: {new Date(priceBook.fromDate).toLocaleDateString()}</p>
                <p className="text-sm">To: {new Date(priceBook.toDate).toLocaleDateString()}</p>
                <p className="text-sm">Status: {priceBook.status}</p>
                <p className="text-sm">Description: {priceBook.description}</p>
                <p className="text-sm">Price Book For: {priceBook.priceBookFor.join(", ")}</p>
                <p className="text-sm">Packages: {priceBook.package.map((p) => p.name).join(", ")}</p>
                <p className="text-sm">Assigned To: {priceBook.assignedTo.length} reseller(s)</p>
                <p className="text-sm">Created: {new Date(priceBook.createdAt).toLocaleString()}</p>
                <div className="flex justify-end space-x-3 mt-3">
                  <ProtectedAction module="pricebook" action="view">
                    <button
                      onClick={() => handleView(priceBook._id)}
                      className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                      title="View"
                      aria-label="View"
                    >
                      <FaEye size={16} />
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="pricebook" action="edit">
                    <button
                      onClick={() => handleEdit(priceBook._id)}
                      className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="pricebook" action="delete">
                    <button
                      onClick={() => handleDelete(priceBook._id)}
                      className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-[14px]"
            >
              Previous
            </button>
            <span className="text-[14px]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-[14px]"
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
}