import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import { getUpcomingRenewalByDays } from "../../../service/misReport";

export default function UpcomingRenewalByDays() {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  // Fetch upcoming renewals
  useEffect(() => {
    const loadRenewals = async () => {
      setLoading(true);
      try {
        const res = await getUpcomingRenewalByDays(page, limit, searchTerm);
        setRenewals(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching upcoming renewals:", err);
        setError("Failed to load upcoming renewals");
        toast.error("Failed to load upcoming renewals ❌");
      } finally {
        setLoading(false);
      }
    };
    loadRenewals();
  }, [page, searchTerm]);
  const handleView = (id) => {
    navigate(`/renewal/${id}`);
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
      <h1 className="text-xl font-semibold mb-4">Upcoming Renewals</h1>
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
      {renewals.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No renewals found.</p>
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
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Phone</th>
                  <th className="px-[2px] py-[2px] text-left">Address</th>
                  <th className="px-[2px] py-[2px] text-left">Wallet Balance</th>
                  <th className="px-[2px] py-[2px] text-left">Package Name</th>
                  <th className="px-[2px] py-[2px] text-left">Admin Name</th>
                  <th className="px-[2px] py-[2px] text-left">Next Expiry</th>
                  <th className="px-[2px] py-[2px] text-left">Days Remaining</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renewals.map((renewal, index) => (
                  <tr key={renewal._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.generalInformation.name}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.generalInformation.username}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.generalInformation.email}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.generalInformation.phone}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.generalInformation.address}</td>
                    <td className="px-[2px] py-[2px]">{renewal.user.walletBalance}</td>
                    <td className="px-[2px] py-[2px]">{renewal.packageName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{renewal.adminName || "-"}</td>
                    <td className="px-[2px] py-[2px]">
                      {renewal.nextExpiry ? new Date(renewal.nextExpiry).toLocaleString() : "-"}
                    </td>
                    <td className="px-[2px] py-[2px]">{renewal.daysRemaining}</td>
                    {/* <td className="px-[2px] py-[2px] text-right">
                      <button
                        onClick={() => handleView(renewal._id)}
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
            {renewals.map((renewal, index) => (
              <div
                key={renewal._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{(page - 1) * limit + index + 1}</p>
                <p className="text-sm"><strong>Name:</strong> {renewal.user.generalInformation.name}</p>
                <p className="text-sm"><strong>Username:</strong> {renewal.user.generalInformation.username}</p>
                <p className="text-sm"><strong>Email:</strong> {renewal.user.generalInformation.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {renewal.user.generalInformation.phone}</p>
                <p className="text-sm"><strong>Address:</strong> {renewal.user.generalInformation.address}</p>
                <p className="text-sm"><strong>Wallet Balance:</strong> {renewal.user.walletBalance}</p>
                <p className="text-sm"><strong>Package Name:</strong> {renewal.packageName || "-"}</p>
                <p className="text-sm"><strong>Admin Name:</strong> {renewal.adminName || "-"}</p>
                <p className="text-sm"><strong>Next Expiry:</strong> {renewal.nextExpiry ? new Date(renewal.nextExpiry).toLocaleString() : "-"}</p>
                <p className="text-sm"><strong>Days Remaining:</strong> {renewal.daysRemaining}</p>
                {/* <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(renewal._id)}
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