import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { getPurchasedPlanList, updateUserStatus } from "../../../service/user";

export default function CustomerPurchasePlanList() {
  const { id: userId } = useParams(); // Customer ID from URL params
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [customerData, setCustomerData] = useState({ name: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alphabetFilter, setAlphabetFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const menuRef = useRef(null);

  // Alphabet array for filter buttons
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Fetch all purchase plans once
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const res = await getPurchasedPlanList(userId, 1, 10000, ''); // Fetch all by setting large limit
        const fetchedPlans = res.data || []; // Adjusted assuming res.data.plans is the array
        setAllPlans(fetchedPlans);
        setCustomerData({ name: res.data?.customerName || '', status: res.data?.status || '' });
        applyFiltersAndPagination(fetchedPlans);
      } catch (err) {
        console.error("Error fetching purchase plans:", err);
        setError("Failed to load purchase plans");
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [userId]);

  // Apply frontend filters and pagination when search, alphabet, or page changes
  useEffect(() => {
    let filtered = allPlans;
    if (alphabetFilter) {
      filtered = filtered.filter(plan => plan.planName?.charAt(0).toUpperCase() === alphabetFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    applyFiltersAndPagination(filtered);
  }, [searchTerm, alphabetFilter, allPlans, page]);

  const applyFiltersAndPagination = (filteredPlans) => {
    const total = Math.ceil(filteredPlans.length / limit);
    setTotalPages(total || 1);
    const start = (page - 1) * limit;
    const paginated = filteredPlans.slice(start, start + limit);
    setPlans(paginated);
    if (page > total && total > 0) setPage(total);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle status update for customer
  const handleStatusUpdate = async () => {
    const newStatus = customerData.status === "Active" ? "Inactive" : "Active";
    try {
      await updateUserStatus(userId, newStatus);
      setCustomerData((prev) => ({ ...prev, status: newStatus }));
      alert(`Customer status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating customer status:", err);
      alert("Failed to update customer status");
    }
  };

  // Handlers
  const handleView = (planId) => {
    navigate(`/customer/purchase-plan/view/${userId}/${planId}`);
    setOpenMenuId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleAlphabetClick = (letter) => {
    setAlphabetFilter(alphabetFilter === letter ? "" : letter);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p className="p-4">Loading purchase plans...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="">
      <div className="flex items-center justify-end mb-1 h-0">
        {/* <h1 className="text-xl font-semibold text-[13px]">
          Purchase Plans  {customerData.name} 
          - Status: <span className={`${customerData.status === "Active" ? "text-green-700" : "text-red-700"}`}>{customerData.status}</span>
        </h1> */}
        {/* <div className="">
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-1 w-full md:w-full rounded text-[12px]"
          />
        </div> */}
        <div className="space-x-2 flex  ">
          {/* <button
            onClick={() => navigate(`/customer/list`)}
            className="px-1 py-1 text-white bg-gray-600 rounded hover:bg-gray-700 text-[12px]"
          >
            <span className="flex items-center h-full">
              <IoMdArrowBack className="mr-1" /> Back
            </span>
          </button>
          <button
            onClick={handleStatusUpdate}
            className={`px-1 py-1 text-white ${customerData.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} rounded text-[12px]`}
          >
            {customerData.status === "Active" ? "Deactivate" : "Activate"} Customer
          </button> */}
          <button
            onClick={() => navigate(`/customer/purchase-plan/create/${userId}`)}
            className="px-1 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-[12px] relative right-5 -top-3"
          >
            Add Purchase Plan
          </button>
        </div>
      </div>
      {/* A-Z Alphabet Filter */}
      {/* <div className="mb-2 flex flex-wrap gap-1">
        {alphabets.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphabetClick(letter)}
            className={`px-1 py-0.5 text-xs border rounded ${alphabetFilter === letter ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {letter}
          </button>
        ))}
        <button
          onClick={() => handleAlphabetClick("")}
          className={`px-1 py-0.5 text-xs border rounded ml-1 ${!alphabetFilter ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          All
        </button>
      </div> */}

      {plans.length === 0 ? (
        <p className="text-gray-500 text-center">No purchase plans found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 text-left">S.No</th>
                  <th className="px-2 py-1 text-left">Plan ID</th>
                  <th className="px-2 py-1 text-left">Plan Name</th>
                  <th className="px-2 py-1 text-left">Amount</th>
                  <th className="px-2 py-1 text-left">Status</th>
                  <th className="px-2 py-1 text-left">Purchase Date</th>
                  <th className="px-2 py-1 text-left">Created At</th>
                  <th className="px-2 py-1 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan, index) => (
                  <tr key={plan._id} className="hover:bg-gray-50 relative">
                    <td className="px-2 py-1">{(page - 1) * limit + index + 1}</td>
                    <td className="px-2 py-1">{plan._id}</td>
                    <td className="px-2 py-1">{plan.planName || "N/A"}</td>
                    <td className="px-2 py-1">{plan.amount}</td>
                    <td className={`px-2 py-1 ${plan.status === "Active" ? "text-green-700" : "text-red-700"}`}>{plan.status}</td>
                    <td className="px-2 py-1">{new Date(plan.purchaseDate).toLocaleString()}</td>
                    <td className="px-2 py-1">{new Date(plan.createdAt).toLocaleString()}</td>
                    <td className="px-2 py-1 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === plan._id ? null : plan._id)
                        }
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV size={12} />
                      </button>
                      {openMenuId === plan._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
                        >
                          <button
                            onClick={() => handleView(plan._id)}
                            className="flex items-center w-full px-2 py-1 text-xs hover:bg-gray-100"
                          >
                            <FaEye className="mr-1" size={10} /> View
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {plans.map((plan, index) => (
              <div
                key={plan._id}
                className="p-3 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-xs text-gray-500">#{(page - 1) * limit + index + 1}</p>
                <h2 className="text-md font-medium">{plan._id}</h2>
                <p className="text-xs">Plan Name: {plan.planName || "N/A"}</p>
                <p className="text-xs">Amount: {plan.amount}</p>
                <p className="text-xs">Status: {plan.status}</p>
                <p className="text-xs">Purchase Date: {new Date(plan.purchaseDate).toLocaleString()}</p>
                <p className="text-xs">Created: {new Date(plan.createdAt).toLocaleString()}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleView(plan._id)}
                    className="text-blue-600 flex items-center text-xs"
                  >
                    <FaEye className="mr-1" size={10} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Minimized Pagination on Bottom Right */}
          {/* <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-2 py-0.5 text-xs bg-white rounded disabled:opacity-50 hover:bg-gray-200"
              >
                Prev
              </button>
              <span className="text-xs px-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-2 py-0.5 text-xs bg-white rounded disabled:opacity-50 hover:bg-gray-200"
              >
                Next
              </button>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}