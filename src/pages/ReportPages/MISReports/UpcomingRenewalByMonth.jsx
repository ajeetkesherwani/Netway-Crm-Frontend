import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { getUpcomingRenewalByMonth } from "../../../service/misReport";
import { IoMdArrowBack } from "react-icons/io";

export default function UpcomingRenewalByMonth() {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch upcoming renewals by month
  useEffect(() => {
    const loadRenewals = async () => {
      setLoading(true);
      try {
        const res = await getUpcomingRenewalByMonth(searchTerm);
        setRenewals(res.data.data || []);
        setMonth(res.data.month || "");
        setYear(res.data.year || "");
      } catch (err) {
        console.error("Error fetching upcoming renewals by month:", err);
        setError("Failed to load upcoming renewals");
        toast.error("Failed to load upcoming renewals ❌");
      } finally {
        setLoading(false);
      }
    };
    loadRenewals();
  }, [searchTerm]);

  const handleView = (id) => {
    navigate(`/renewal-month/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Upcoming Renewals for {month} {year}
      </h1>
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
                  <th className="px-[2px] py-[2px] text-left">Plan Name</th>
                  <th className="px-[2px] py-[2px] text-left">Admin Name</th>
                  <th className="px-[2px] py-[2px] text-left">Plan Expiry</th>
                  {/* <th className="px-[2px] py-[2px] text-left">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renewals.map((renewal, index) => (
                  <tr key={renewal._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px]">{renewal.Name}</td>
                    <td className="px-[2px] py-[2px]">{renewal.username}</td>
                    <td className="px-[2px] py-[2px]">{renewal.email}</td>
                    <td className="px-[2px] py-[2px]">{renewal.userPhone}</td>
                    <td className="px-[2px] py-[2px]">{renewal.address}</td>
                    <td className="px-[2px] py-[2px]">{renewal.walletBalance}</td>
                    <td className="px-[2px] py-[2px]">{renewal.planName || "-"}</td>
                    <td className="px-[2px] py-[2px]">{renewal.adminName || "-"}</td>
                    <td className="px-[2px] py-[2px]">
                      {renewal.planExpiry ? new Date(renewal.planExpiry).toLocaleString() : "-"}
                    </td>
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
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <p className="text-sm"><strong>Name:</strong> {renewal.Name}</p>
                <p className="text-sm"><strong>Username:</strong> {renewal.username}</p>
                <p className="text-sm"><strong>Email:</strong> {renewal.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {renewal.userPhone}</p>
                <p className="text-sm"><strong>Address:</strong> {renewal.address}</p>
                <p className="text-sm"><strong>Wallet Balance:</strong> {renewal.walletBalance}</p>
                <p className="text-sm"><strong>Plan Name:</strong> {renewal.planName || "-"}</p>
                <p className="text-sm"><strong>Admin Name:</strong> {renewal.adminName || "-"}</p>
                <p className="text-sm"><strong>Plan Expiry:</strong> {renewal.planExpiry ? new Date(renewal.planExpiry).toLocaleString() : "-"}</p>
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
        </>
      )}
    </div>
  );
}