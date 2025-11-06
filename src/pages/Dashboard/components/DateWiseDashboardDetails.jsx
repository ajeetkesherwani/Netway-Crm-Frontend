import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardBarUsers() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const label = state?.label ?? "Details";
  const users = Array.isArray(state?.users) ? state.users : [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Users — {label}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users for this period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">#</th>
                <th className="p-3 text-left font-medium text-gray-700">Username</th>
                <th className="p-3 text-left font-medium text-gray-700">Customer Name</th>
                <th className="p-3 text-left font-medium text-gray-700">Current Plan</th>
                <th className="p-3 text-left font-medium text-gray-700">Plan Status</th>
                <th className="p-3 text-left font-medium text-gray-700">Plan start date</th>
                <th className="p-3 text-left font-medium text-gray-700">Expiry Date</th>
                <th className="p-3 text-left font-medium text-gray-700">Wallet Balance</th>
                <th className="p-3 text-left font-medium text-gray-700">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user._id || user.username || index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{user.username || "-"}</td>
                  <td className="p-3">{user.customerName || "-"}</td>
                  <td className="p-3">{user.currentPlan || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.planStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : user.planStatus === "expired"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.planStatus || "-"}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.expiryDate
                      ? new Date(user.planStartDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td className="p-3">
                    {user.expiryDate
                      ? new Date(user.expiryDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td className="p-3 text-green-600 font-medium">
                    ₹{user.walletBalance?.toLocaleString() || "0"}
                  </td>
                  <td className="p-3 text-blue-600 font-medium">
                    ₹{user.amountPaid?.toLocaleString() || "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}