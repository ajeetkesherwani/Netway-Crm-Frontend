import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllUsersReport } from "../../../service/subscriberReport";
import { IoMdArrowBack } from "react-icons/io";

export default function AccountWiseProfileReport() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch users report
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsersReport(page, limit, searchTerm);
        setUsers(res.data.data || []);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching users report:", err);
        setError("Failed to load users report");
        toast.error("Failed to load users report ❌");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [page, searchTerm]);

  const handleView = (id) => {
    navigate(`/user/${id}`);
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

//   if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Account Wise Profile Report</h1>
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

      {users.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No users found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Username</th>
                  <th className="px-[2px] py-[2px] text-left">Customer Name</th>
                  <th className="px-[2px] py-[2px] text-left">Phone</th>
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">GSTIN</th>
                  <th className="px-[2px] py-[2px] text-left">Area</th>
                  <th className="px-[2px] py-[2px] text-left">Created At</th>
                  <th className="px-[2px] py-[2px] text-left">Activation Date</th>
                  <th className="px-[2px] py-[2px] text-left">Expiry Date</th>
                  <th className="px-[2px] py-[2px] text-left">Created By Type</th>
                  <th className="px-[2px] py-[2px] text-left">Created By Name</th>
                  <th className="px-[2px] py-[2px] text-left">Created For</th>
                  <th className="px-[2px] py-[2px] text-left">Plan Name</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{(page - 1) * limit + index + 1}</td>
                    <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline">{user.username}</td>
                    <td className="px-[2px] py-[2px]">{user.customerName}</td>
                    <td className="px-[2px] py-[2px]">{user.phone}</td>
                    <td className="px-[2px] py-[2px]">{user.email}</td>
                    <td className="px-[2px] py-[2px]">{user.status}</td>
                    <td className="px-[2px] py-[2px]">{user.gstin}</td>
                    <td className="px-[2px] py-[2px]">{user.area}</td>
                    <td className="px-[2px] py-[2px]">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="px-[2px] py-[2px]">{user.activationDate ? new Date(user.activationDate).toLocaleString() : "—"}</td>
                    <td className="px-[2px] py-[2px]">{user.expiryDate ? new Date(user.expiryDate).toLocaleString() : "—"}</td>
                    <td className="px-[2px] py-[2px]">{user.createdByType}</td>
                    <td className="px-[2px] py-[2px]">{user.createdByName}</td>
                    <td className="px-[2px] py-[2px]">{user.createdFor}</td>
                    <td className="px-[2px] py-[2px]">{user.planName}</td>
                    {/* <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleView(user.id)}
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
            {users.map((user, index) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium hover:cursor-pointer hover:underline" onClick={() => handleView(user.id)}>{user.username}</h2>
                <p className="text-sm">Customer Name: {user.customerName}</p>
                <p className="text-sm">Phone: {user.phone}</p>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-sm">Status: {user.status}</p>
                <p className="text-sm">GSTIN: {user.gstin}</p>
                <p className="text-sm">Area: {user.area}</p>
                <p className="text-sm">Created At: {new Date(user.createdAt).toLocaleString()}</p>
                <p className="text-sm">Activation Date: {user.activationDate ? new Date(user.activationDate).toLocaleString() : "—"}</p>
                <p className="text-sm">Expiry Date: {user.expiryDate ? new Date(user.expiryDate).toLocaleString() : "—"}</p>
                <p className="text-sm">Created By Type: {user.createdByType}</p>
                <p className="text-sm">Created By Name: {user.createdByName}</p>
                <p className="text-sm">Created For: {user.createdFor}</p>
                <p className="text-sm">Plan Name: {user.planName}</p>
                {/* <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleView(user.id)}
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