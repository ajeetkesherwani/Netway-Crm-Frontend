import { useEffect, useState, useRef } from "react";
import { FaCheck, FaTrashAlt, FaEye, FaEllipsisV } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getPurchasedPlans } from "../../service/purchasedPlan";
import ProtectedAction from "../../components/ProtectedAction";

export default function PurchasedPlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const menuRef = useRef(null);

  // ✅ Fetch data from backend
  const fetchPlans = async (type = "") => {
    setLoading(true);
    try {
      const res = await getPurchasedPlans(type);
      setPlans(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewInvoice = (planId) => {
    toast.success(`View Invoice for ID: ${planId}`);
    setOpenMenuId(null);
  };

  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to remove this plan?")) {
      toast.success(`Plan ${planId} removed (mock)`);
      setOpenMenuId(null);
    }
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlans = plans.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading plans...</p>;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Purchased Invoice List
        </h2>
        <span className="text-sm text-gray-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, plans.length)} of {plans.length}
        </span>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="px-3 py-2 border">S.NO</th>
              <th className="px-3 py-2 border text-center">RECHARGE TYPE</th>
              <th className="px-3 py-2 border">USER DETAILS</th>
              <th className="px-3 py-2 border">INVOICE NO.</th>
              <th className="px-3 py-2 border">PACKAGE</th>
              <th className="px-3 py-2 border">AMOUNT</th>
              <th className="px-3 py-2 border">INVOICE DATE</th>
              <th className="px-3 py-2 border">DURATION</th>
              <th className="px-3 py-2 border text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {currentPlans.length > 0 ? (
              currentPlans.map((plan, index) => {
                const pkg = plan.package || {};
                const userInfo = plan.user?.generalInformation || {};
                const isOtt = pkg?.isOtt || false;
                const isIptv = pkg?.isIptv || false;
                const isInternet = !isOtt && !isIptv;

                return (
                  <tr key={plan._id} className="hover:bg-gray-50 relative">
                    <td className="border px-3 py-2">
                      {startIndex + index + 1}
                    </td>

                    {/* ✅ Recharge Type */}
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <RechargeType label="Internet" active={isInternet} />
                        <RechargeType label="OTT" active={isOtt} />
                        <RechargeType label="IPTV" active={isIptv} />
                      </div>
                    </td>

                    {/* ✅ User Details */}
                    <td className="border px-3 py-2">
                      <div className="text-blue-700 font-medium">
                        {userInfo.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {userInfo.name || "N/A"}
                      </div>
                    </td>

                    {/* INVOICE NO */}
                    <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
                      {`INV/25-26/${startIndex + index + 6650}`}
                    </td>

                    {/* PACKAGE NAME */}
                    <td className="border px-3 py-2 text-gray-800">
                      {pkg?.name || "—"}
                    </td>

                    {/* AMOUNT */}
                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          Number(pkg?.basePrice) > 1000
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        ₹{pkg?.basePrice || 0}
                      </span>
                    </td>

                    {/* INVOICE DATE */}
                    <td className="border px-3 py-2 text-gray-700">
                      {new Date(plan.purchaseDate).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(plan.purchaseDate).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* DURATION */}
                    <td className="border px-3 py-2 text-gray-700">
                      <span className="text-xs">
                        {new Date(plan.startDate).toLocaleDateString()} →{" "}
                        {new Date(plan.expiryDate).toLocaleDateString()}
                      </span>
                    </td>

                    {/* ✅ ACTIONS with dropdown */}
                    <td className="border px-3 py-2 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === plan._id ? null : plan._id
                          )
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === plan._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-6 top-9 z-50 bg-white border rounded shadow-md w-36 py-1"
                        >
                          <ProtectedAction module="invoice" action="packageRechargeView">
                          <button
                            onClick={() => handleViewInvoice(plan._id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaEye className="mr-2 text-blue-600" /> View
                          </button>
                          </ProtectedAction>
                          <ProtectedAction module="invoice" action="packageRechargeRemove">
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrashAlt className="mr-2" /> Remove
                          </button>
                          </ProtectedAction>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No purchased plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls — fixed bottom area */}
      {plans.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ✅ Small reusable RechargeType component
const RechargeType = ({ label, active }) => (
  <div className="text-center text-xs">
    <div>{label}</div>
    {active && (
      <div className="mx-auto mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
        <FaCheck className="text-white text-[10px]" />
      </div>
    )}
  </div>
);


