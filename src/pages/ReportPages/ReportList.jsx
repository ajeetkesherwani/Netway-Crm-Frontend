import React from "react";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../context/PermissionContext";

export default function ReportList() {
  const navigate = useNavigate();
  const { permissions, loading } = usePermission();

  if (loading) return <p>Loading permissions...</p>;

  // Helper to check permissions safely
  const can = (key) => permissions?.report?.[key] === true;

  // Build reports data dynamically based on permissions
  const reportsData = [
    {
      title: "Subscriber Reports",
      reports: [
        ...(can("accountProfileWise")
          ? [{ name: "Account profile wise report", path: "/report/account-wise-profile-report/list" }]
          : []),
        ...(can("inactiveCustomer")
          ? [{ name: "Inactive Customer Report", path: "/report/inactive-customer-report/list" }]
          : []),
        ...(can("suspendedCustomer")
          ? [{ name: "Suspended Customers Report", path: "/report/all-suspended-user/list" }]
          : []),
      ],
    },
    {
      title: "Franchisee Reports",
      reports: [
        ...(can("lcoBalanceTransferHistory")
          ? [{ name: "LCO Balance Transfer History", path: "/report/lco-balance-transfer-history/list" }]
          : []),
        ...(can("lcoTransactionHistory")
          ? [{ name: "LCO Transaction History", path: "/report/lco-transaction-history/list" }]
          : []),
        ...(can("onlineTransaction")
          ? [{ name: "Online Transaction (Subscribers)", path: "/report/online-transaction/list" }]
          : []),
        ...(can("resellerBalanceTransfer")
          ? [{ name: "Reseller Balance Transfer", path: "/report/reseller-transfer-balance/list" }]
          : []),
      ],
    },
    {
      title: "MIS Reports",
      reports: [
        ...(can("customerQBalance")
          ? [{ name: "Customer Q/Balance Report", path: "/report/customer-balance-report" }]
          : []),
        ...(can("customerUpdateHistory")
          ? [{ name: "Customer Update History", path: "/report/customer-update-history" }]
          : []),
        ...(can("upcomingRenewalByName")
          ? [{ name: "Upcoming Renewal By names", path: "/report/upcoming-renewal-by-days" }]
          : []),
        ...(can("upcomingRenewalByMonth")
          ? [{ name: "Upcoming Renewal By months", path: "/report/upcoming-renewal-by-days" }]
          : []),
      ],
    },
    {
      title: "Revenue Reports",
      reports: [
        ...(can("newRegistrationPlan")
          ? [{ name: "New Registration Plan Report", path: "/report/new-registration-plan-report" }]
          : []),
        ...(can("payment")
          ? [{ name: "Payment Report", path: "/report/payment-report" }]
          : []),
        ...(can("recentPurchasedOrRenew")
          ? [{ name: "Recent Purchased Or Renew Report", path: "/report/recent-purchased-or-renew-report" }]
          : []),
      ],
    },
    {
      title: "Tickets Reports",
      reports: [
        ...(can("openTicket")
          ? [{ name: "Open Tickets", path: "/report/open-ticket-report" }]
          : []),
        ...(can("closedTicket")
          ? [{ name: "Closed Tickets", path: "/report/closed-ticket-report" }]
          : []),
        ...(can("fixedTicket")
          ? [{ name: "Fixed Tickets", path: "/report/fixed-ticket-report" }]
          : []),
        ...(can("assignedTicket")
          ? [{ name: "Assigned Tickets", path: "/report/assigned-ticket-report" }]
          : []),
        ...(can("unassignedTicket")
          ? [{ name: "Unassigned Tickets", path: "/report/unassigned-ticket-report" }]
          : []),
        ...(can("resolvedTicket")
          ? [{ name: "Resolved Tickets", path: "/report/resolved-ticket-report" }]
          : []),
      ],
    },
  ].filter((category) => category.reports.length > 0); // remove empty categories

  const handleReportClick = (path) => navigate(path);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-fit">
        {reportsData.map((category, index) => (
          <div key={index} className="bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white bg-blue-600 p-2 rounded-t-lg mb-4 capitalize px-2">
              {category.title}
            </h3>
            <ul className="space-y-2 mb-2">
              {category.reports.map((report, reportIndex) => (
                <li key={reportIndex} className="flex items-center justify-between overflow-auto">
                  <span
                    className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer px-2"
                    onClick={() => handleReportClick(report.path)}
                  >
                    {report.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
