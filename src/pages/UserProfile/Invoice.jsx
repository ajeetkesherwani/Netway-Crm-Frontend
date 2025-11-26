
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";

// Component to display recharge type with optional active indicator
const RechargeTypeBadge = ({ label, active }) => (
  <div className="text-center text-xs">
    <div className="text-gray-700">{label}</div>
    {active && (
      <div className="mt-1 w-6 h-6 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
  </div>
);

const UserInvoices = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await getUserFullDetails(id);
        if (res.status) {
          setData(res);
        }
      } catch (err) {
        console.error("Error fetching user invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-IN")} ${date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg bg-gray-50 min-h-screen">
        Loading invoices...
      </div>
    );
  }

  const plans = data?.purchasedPlans || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Purchased Plans & Invoices</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Records: <span className="font-medium">{plans.length}</span>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">S.No</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Recharge Type</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">User</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">Invoice No</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">Package</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Amount</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">Purchase Date</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-300">Validity</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan, index) => {
                  const pkg = plan.packageId || {};
                  const isOtt = pkg.isOtt || false;
                  const isIptv = pkg.isIptv || false;
                  const isInternet = !isOtt && !isIptv;

                  const userName = data?.userDetails?.generalInformation?.name || "N/A";
                  const username = data?.userDetails?.generalInformation?.username || "—";

                  return (
                    <tr key={plan._id} className="hover:bg-gray-50 border-b border-gray-200">
                      {/* S.No */}
                      <td className="px-4 py-4 text-center font-medium text-gray-800 border-r border-gray-200">
                        {index + 1}
                      </td>

                      {/* Recharge Type - Blue tick only for active */}
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="flex justify-center gap-4">
                          <RechargeTypeBadge label="Internet" active={isInternet} />
                          <RechargeTypeBadge label="OTT" active={isOtt} />
                          <RechargeTypeBadge label="IPTV" active={isIptv} />
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="font-medium text-blue-700">{username}</div>
                        <div className="text-xs text-gray-600">{userName}</div>
                      </td>

                      {/* Invoice No */}
                      <td className="px-4 py-4 border-r border-gray-200">
                        <span className="text-blue-600 underline cursor-pointer font-medium">
                          INV/25-26/{String(6650 + index).padStart(5, "0")}
                        </span>
                      </td>

                      {/* Package Name */}
                      <td className="px-4 py-4 border-r border-gray-200 font-medium text-gray-800">
                        {pkg.name || "—"}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4 text-center border-r border-gray-200">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                            (pkg.basePrice || 0) > 1000 ? "bg-red-500" : "bg-green-600"
                          }`}
                        >
                          ₹{pkg.basePrice || plan.amountPaid || 0}
                        </span>
                      </td>

                      {/* Purchase Date */}
                      <td className="px-4 py-4 text-gray-700 border-r border-gray-200 text-xs">
                        {formatDateTime(plan.purchaseDate || plan.createdAt)}
                      </td>

                      {/* Validity */}
                      <td className="px-4 py-4 text-gray-700 border-r border-gray-200 text-xs">
                        {plan.startDate && formatDate(plan.startDate)} →{" "}
                        {plan.expiryDate && formatDate(plan.expiryDate)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            plan.status === "active"
                              ? "bg-green-100 text-green-800"
                              : plan.status === "expired"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {plan.status?.charAt(0).toUpperCase() + plan.status?.slice(1) || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500 text-lg">
                    No purchased plans or invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserInvoices;