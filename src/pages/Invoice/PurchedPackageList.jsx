import { useEffect, useState, useRef } from "react";
import { FaCheck, FaTrashAlt, FaEye, FaEllipsisV, FaSearch, FaDownload, FaUndo } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getInvoices, fetchInvoicePdfBlob, downloadInvoicePdf } from "../../service/purchasedPlan";
import ProtectedAction from "../../components/ProtectedAction";
import * as XLSX from "xlsx";

import { InvoiceFilters } from "../Invoice/InvoiceFilter";

export default function PurchasedPlanList() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 15;
  const menuRef = useRef(null);

  // Filter states (unchanged)
  const [filters, setFilters] = useState({
    userSearch: "",
    invoiceNo: "",
    fromDate: "",
    toDate: "",
    area: "",
    lcoId: "",
    resellerId: "",
    package: "",
    status: "",
    rechargeStatus: "",
    createdBy: "",
  });

  // Fetch all invoices (unchanged)
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoices();
      const data = res.data.invoices || [];
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply filters (unchanged)
  const applyFilters = () => {
    let result = [...invoices];
    if (filters.userSearch) {
      const term = filters.userSearch.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.userId?.generalInformation?.username?.toLowerCase().includes(term) ||
          inv.userId?.generalInformation?.name?.toLowerCase().includes(term)
      );
    }
    if (filters.invoiceNo) {
      result = result.filter((inv) =>
        inv.invoiceNumber?.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      );
    }
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      result = result.filter((inv) => new Date(inv.createdAt) >= from);
    }
    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((inv) => new Date(inv.createdAt) <= to);
    }
    if (filters.area) {
      result = result.filter((inv) =>
        inv.userId?.generalInformation?.area?.toLowerCase().includes(filters.area.toLowerCase())
      );
    }
    if (filters.package) {
      result = result.filter((inv) =>
        inv.packageName?.toLowerCase().includes(filters.package.toLowerCase())
      );
    }
    if (filters.createdBy) {
      result = result.filter((inv) =>
        inv.addedBy?.toLowerCase().includes(filters.createdBy.toLowerCase())
      );
    }
    if (filters.lcoId) {
      result = result.filter((inv) => inv.lcoId === filters.lcoId);
    }
    if (filters.resellerId) {
      result = result.filter((inv) => inv.resellerId === filters.resellerId);
    }
    setFilteredInvoices(result);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      userSearch: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
      area: "",
      lcoId: "",
      resellerId: "",
      package: "",
      status: "",
      rechargeStatus: "",
      createdBy: "",
    });
    setFilteredInvoices(invoices);
    setCurrentPage(1);
  };

  const handlePackageSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handlePackageSearch();
  };

  const finalFiltered = filteredInvoices.filter((invoice) =>
    invoice.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(finalFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = finalFiltered.slice(startIndex, startIndex + itemsPerPage);

  const downloadExcel = () => {
    const data = finalFiltered.map((invoice, index) => ({
      "S.NO": index + 1,
      "Recharge Type": `${invoice.packageType?.internet ? "Internet " : ""}${
        invoice.packageType?.isOtt ? "OTT " : ""
      }${invoice.packageType?.isIptv ? "IPTV" : ""}`.trim(),
      Username: invoice.userId?.generalInformation?.username || "—",
      Name: invoice.userId?.generalInformation?.name || "N/A",
      "Invoice No.": invoice.invoiceNumber || "—",
      Package: invoice.packageName || "—",
      Amount: invoice.amount || 0,
      "LCO Amount": invoice.lcoAmount || 0,
      "Reseller Amount": invoice.resellerAmount || 0,
      "Invoice Date": new Date(invoice.createdAt).toLocaleString(),
      Duration: `${new Date(invoice.duration?.startDate).toLocaleDateString()} - ${new Date(
        invoice.duration?.endDate
      ).toLocaleDateString()}`,
      "Added By": invoice.addedBy || "—",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "invoices.xlsx");
  };

  // === UPDATED: Open PDF directly in new tab ===
  const handleViewInvoice = async (invoiceId) => {
    try {
      const blob = await fetchInvoicePdfBlob(invoiceId);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      // Optional: Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000); // 1 minute
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to open PDF: " + (err.message || "Unknown error"));
      setOpenMenuId(null);
    }
  };

  // Direct download (unchanged)
  const handleDirectDownload = (invoiceId, invoiceNumber) => {
    downloadInvoicePdf(invoiceId, invoiceNumber);
    setOpenMenuId(null);
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm("Are you sure you want to remove this invoice?")) {
      toast.success(`Invoice ${invoiceId} removed (mock)`);
      setOpenMenuId(null);
    }
  };

  const handleRefund = (invoiceId) => {
    if (window.confirm("Are you sure you want to refund this plan?")) {
      toast.success(`Refund processed for ${invoiceId} (mock)`);
      setOpenMenuId(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading invoices...</p>;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Purchased Invoice List</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by package name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch
              className="absolute left-3 text-gray-400 cursor-pointer hover:text-blue-600"
              onClick={handlePackageSearch}
            />
          </div>
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <InvoiceFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      {/* Showing info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, finalFiltered.length)} of{" "}
        {finalFiltered.length}
      </div>

      {/* Table */}
      <div className="flex-grow overflow-x-auto border rounded-md bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 border">S.NO</th>
              <th className="px-4 py-3 border text-center">RECHARGE TYPE</th>
              <th className="px-4 py-3 border">USER DETAILS</th>
              <th className="px-4 py-3 border">INVOICE NO.</th>
              <th className="px-4 py-3 border">PACKAGE</th>
              <th className="px-4 py-3 border">AMOUNT</th>
              <th className="px-4 py-3 border">LCO AMOUNT</th>
              <th className="px-4 py-3 border">RESELLER AMOUNT</th>
              <th className="px-4 py-3 border">INVOICE DATE</th>
              <th className="px-4 py-3 border">DURATION</th>
              <th className="px-4 py-3 border">ADDED BY</th>
              <th className="px-4 py-3 border text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice, index) => {
                const userInfo = invoice.userId?.generalInformation || {};
                const pkgType = invoice.packageType || {};

                return (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">{startIndex + index + 1}</td>

                    <td className="border px-4 py-3 text-center">
                      <div className="flex justify-center gap-4">
                        <RechargeType label="Internet" active={pkgType.internet} />
                        <RechargeType label="OTT" active={pkgType.isOtt} />
                        <RechargeType label="IPTV" active={pkgType.isIptv} />
                      </div>
                    </td>

                    <td className="border px-4 py-3">
                      <div className="font-medium text-blue-700">{userInfo.username || "—"}</div>
                      <div className="text-xs text-gray-600">{userInfo.name || "N/A"}</div>
                    </td>

                    <td className="border px-4 py-3">
                      <span
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                        onClick={() => handleViewInvoice(invoice._id)}
                      >
                        {invoice.invoiceNumber || "—"}
                      </span>
                    </td>

                    <td className="border px-4 py-3">{invoice.packageName || "—"}</td>

                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          Number(invoice.amount) > 1000 ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        ₹{invoice.amount || 0}
                      </span>
                    </td>

                    <td className="border px-4 py-3 text-center">₹{invoice.lcoAmount || 0}</td>
                    <td className="border px-4 py-3 text-center">₹{invoice.resellerAmount || 0}</td>

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.createdAt).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString()}
                      </span>
                    </td>

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.duration.startDate).toLocaleDateString()} →{" "}
                      {new Date(invoice.duration.endDate).toLocaleDateString()}
                    </td>

                    <td className="border px-4 py-3 text-gray-700">{invoice.addedBy || "—"}</td>

                    <td className="border px-4 py-3 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === invoice._id ? null : invoice._id)
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuId === invoice._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 z-50 bg-white border rounded shadow-lg w-48 py-1"
                        >
                          <ProtectedAction module="invoice" action="packageRechargeView">
                            <button
                              onClick={() => handleViewInvoice(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEye className="mr-2 text-blue-600" /> View
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="invoiceDownload">
                            <button
                              onClick={() => handleDirectDownload(invoice._id, invoice.invoiceNumber)}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                            >
                              <FaDownload className="mr-2" /> Download
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="packageRechargeRefund">
                            <button
                              onClick={() => handleRefund(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              <FaUndo className="mr-2" /> Refund Plan
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="packageRechargeRemove">
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {finalFiltered.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-md text-sm font-medium ${
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

// RechargeType component (unchanged)
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