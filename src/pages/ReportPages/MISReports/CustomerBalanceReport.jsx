import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import { getCustomerBalanceReport } from "../../../service/misReport";

export default function CustomerBalanceReport() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch customer balance report
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const res = await getCustomerBalanceReport(page, limit, searchTerm);
        setCustomers(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching customer balance report:", err);
        setError("Failed to load customer balance report");
        toast.error("Failed to load customer balance report ❌");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, [page, searchTerm]);

  const handleView = (id) => {
    navigate(`/customer-balance/${id}`);
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
      <h1 className="text-xl font-semibold mb-4">Customer Balance Report</h1>
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
      {customers.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No customers found.</p>
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
                  <th className="px-[2px] py-[2px] text-left">Wallet Balance</th>
                  <th className="px-[2px] py-[2px] text-left">Admin Name</th>
                  <th className="px-[2px] py-[2px] text-left">Reseller Name</th>
                  <th className="px-[2px] py-[2px] text-left">LCO Name</th>
                  <th className="px-[2px] py-[2px] text-left">Plan Name</th>
                  <th className="px-[2px] py-[2px] text-left">Plan Expiry</th>
                  <th className="px-[2px] py-[2px] text-left">Last Purchased</th>
                  <th className="px-[2px] py-[2px] text-left">Plan Activation</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer, index) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px]">{customer.generalInformation.name}</td>
                    <td className="px-[2px] py-[2px]">{customer.generalInformation.username}</td>
                    <td className="px-[2px] py-[2px]">{customer.walletBalance}</td>
                    <td className="px-[2px] py-[2px]">{customer.adminName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{customer.resellerName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{customer.lcoName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{customer.planName || "-"}</td>
                    <td className="px-[2px] py-[2px]">
                      {customer.planExpiry ? new Date(customer.planExpiry).toLocaleString() : "-"}
                    </td>
                    <td className="px-[2px] py-[2px]">
                      {customer.lastPurchased ? new Date(customer.lastPurchased).toLocaleString() : "-"}
                    </td>
                    <td className="px-[2px] py-[2px]">
                      {customer.planActivation ? new Date(customer.planActivation).toLocaleString() : "-"}
                    </td>
                    {/* <td className="px-[2px] py-[2px] text-right">
                      <button
                        onClick={() => handleView(customer._id)}
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
            {customers.map((customer, index) => (
              <div
                key={customer._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{(page - 1) * limit + index + 1}</p>
                <p className="text-sm"><strong>Name:</strong> {customer.generalInformation.name}</p>
                <p className="text-sm"><strong>Username:</strong> {customer.generalInformation.username}</p>
                <p className="text-sm"><strong>Wallet Balance:</strong> {customer.walletBalance}</p>
                <p className="text-sm"><strong>Admin Name:</strong> {customer.adminName || "-"}</p>
                <p className="text-sm"><strong>Reseller Name:</strong> {customer.resellerName || "-"}</p>
                <p className="text-sm"><strong>LCO Name:</strong> {customer.lcoName || "-"}</p>
                <p className="text-sm"><strong>Plan Name:</strong> {customer.planName || "-"}</p>
                <p className="text-sm"><strong>Plan Expiry:</strong> {customer.planExpiry ? new Date(customer.planExpiry).toLocaleString() : "-"}</p>
                <p className="text-sm"><strong>Last Purchased:</strong> {customer.lastPurchased ? new Date(customer.lastPurchased).toLocaleString() : "-"}</p>
                <p className="text-sm"><strong>Plan Activation:</strong> {customer.planActivation ? new Date(customer.planActivation).toLocaleString() : "-"}</p>
                {/* <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(customer._id)}
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