import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCustomerUpdateHistory } from "../../../service/misReport";
import { IoMdArrowBack } from "react-icons/io";

export default function CustomerUpdateHistory() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch customer update history
  useEffect(() => {
    const loadUpdates = async () => {
      setLoading(true);
      try {
        const res = await getCustomerUpdateHistory(page, limit, searchTerm);
        setUpdates(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching customer update history:", err);
        setError("Failed to load customer update history");
        toast.error("Failed to load customer update history ❌");
      } finally {
        setLoading(false);
      }
    };
    loadUpdates();
  }, [page, searchTerm]);

  const handleView = (id) => {
    navigate(`/customer-update/${id}`);
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
      <h1 className="text-xl font-semibold mb-4">Customer Update History</h1>
      <button
        onClick={() => navigate("/report/list")}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center mb-4"
      >
        <IoMdArrowBack className="mr-2" /> Back
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
      {updates.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No updates found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Name</th>
                  <th className="px-[2px] py-[2px] text-left">Username</th>
                  <th className="px-[2px] py-[2px] text-left">Old Plan Name</th>
                  <th className="px-[2px] py-[2px] text-left">New Plan Name</th>
                  <th className="px-[2px] py-[2px] text-left">Modified Date</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {updates.map((update, index) => (
                  <tr key={update._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px]">{update.generalInformation.name}</td>
                    <td className="px-[2px] py-[2px]">{update.generalInformation.username}</td>
                    <td className="px-[2px] py-[2px]">{update.oldPlanName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{update.newPlanName || "-"}</td>
                    <td className="px-[2px] py-[2px]">
                      {update.modifiedDate ? new Date(update.modifiedDate).toLocaleString() : "-"}
                    </td>
                    {/* <td className="px-[2px] py-[2px] text-right">
                      <button
                        onClick={() => handleView(update._id)}
                        className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                        title="View"
                      >
                        <FaEye size={16} />
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {updates.map((update, index) => (
              <div
                key={update._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{(page - 1) * limit + index + 1}</p>
                <p className="text-sm"><strong>Name:</strong> {update.generalInformation.name}</p>
                <p className="text-sm"><strong>Username:</strong> {update.generalInformation.username}</p>
                <p className="text-sm"><strong>Old Plan Name:</strong> {update.oldPlanName || "-"}</p>
                <p className="text-sm"><strong>New Plan Name:</strong> {update.newPlanName || "-"}</p>
                <p className="text-sm"><strong>Modified Date:</strong> {update.modifiedDate ? new Date(update.modifiedDate).toLocaleString() : "-"}</p>
                {/* <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(update._id)}
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