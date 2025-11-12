import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getPurchasedPlans } from "../../service/purchasedPlan";

export default function IptvPackageList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // ✅ Fetch only IPTV plans
  const fetchIptvPlans = async () => {
    setLoading(true);
    try {
      const res = await getPurchasedPlans("iptv"); // backend filters by ?type=iptv
      const allPlans = res.data || [];
      const iptvPlans = allPlans.filter(
        (plan) => plan.package?.isIptv === true
      );
      setPlans(iptvPlans);
    } catch (err) {
      toast.error(err.message || "Failed to fetch IPTV plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIptvPlans();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlans = plans.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading IPTV plans...</p>;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          IPTV Package List
        </h2>
        <span className="text-sm text-gray-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, plans.length)} of {plans.length}
        </span>
      </div>

      {/* Table */}
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
            </tr>
          </thead>

          <tbody>
            {currentPlans.length > 0 ? (
              currentPlans.map((plan, index) => {
                const pkg = plan.package || {};
                const userInfo = plan.user?.generalInformation || {};

                return (
                  <tr key={plan._id} className="hover:bg-gray-50">
                    {/* S.NO */}
                    <td className="border px-3 py-2">
                      {startIndex + index + 1}
                    </td>

                    {/* ✅ Recharge Type (Blue Tick) */}
                    <td className="border px-3 py-2 text-center">
                      <RechargeType label="IPTV" active={pkg?.isIptv} />
                    </td>

                    {/* ✅ User Info */}
                    <td className="border px-3 py-2">
                      <div className="text-blue-700 font-medium">
                        {userInfo.username || "—"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {userInfo.name || "N/A"}
                      </div>
                    </td>

                    {/* ✅ Invoice No */}
                    <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
                      {`INV/25-26/${startIndex + index + 6650}`}
                    </td>

                    {/* ✅ Package */}
                    <td className="border px-3 py-2 text-gray-800">
                      {pkg?.name || "—"}
                    </td>

                    {/* ✅ Amount */}
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

                    {/* ✅ Invoice Date */}
                    <td className="border px-3 py-2 text-gray-700">
                      {new Date(plan.purchaseDate).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(plan.purchaseDate).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* ✅ Duration */}
                    <td className="border px-3 py-2 text-gray-700">
                      <span className="text-xs">
                        {new Date(plan.startDate).toLocaleDateString()} →{" "}
                        {new Date(plan.expiryDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No IPTV plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
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

// ✅ Reusable RechargeType Component (Blue Tick Style)
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
