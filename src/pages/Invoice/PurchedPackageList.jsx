import { useEffect, useState, useRef } from "react";
import { FaCheck, FaTrashAlt, FaEye, FaEllipsisV, FaSearch, FaDownload, FaUndo } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getInvoices, fetchInvoicePdfBlob, downloadInvoicePdf, deleteInvoice } from "../../service/purchasedPlan";
import ProtectedAction from "../../components/ProtectedAction";
import * as XLSX from "xlsx";
import { InvoiceFilters } from "../Invoice/InvoiceFilter";

const ITEMS_PER_PAGE = 15;

export default function PurchasedPlanList() {
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [openingInvoiceId, setOpeningInvoiceId] = useState(null);
  const menuRef = useRef(null);

  const [filters, setFilters] = useState({
    userSearch: "",
    fromDate: "",
    toDate: "",
    areaId: "",
    subZoneId: "",
    lcoId: "",
    resellerId: "",
    packageId: "",
    status: "",
    createdBy: "",
  });

  // Fetch invoices from backend with filters & pagination
  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        ...(filters.userSearch && { userSearch: filters.userSearch }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        ...(filters.areaId && { areaId: filters.areaId }),
        ...(filters.subZoneId && { subZoneId: filters.subZoneId }),
        ...(filters.lcoId && { lcoId: filters.lcoId }),
        ...(filters.resellerId && { resellerId: filters.resellerId }),
        ...(filters.packageId && { packageId: filters.packageId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.createdBy && { createdBy: filters.createdBy }),
      }).toString();

      const res = await getInvoices(`?${queryParams}`);
      setInvoices(res.data.invoices || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load invoices");
      setInvoices([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  // Search & Reset handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchInvoices(1);
  };

  const handleReset = () => {
    setFilters({
      userSearch: "",
      fromDate: "",
      toDate: "",
      areaId: "",
      subZoneId: "",
      lcoId: "",
      resellerId: "",
      packageId: "",
      status: "",
      createdBy: "",
    });
    setSearchInput("");
    setCurrentPage(1);
    fetchInvoices(1);
  };

  // Package name search (client-side filter)
  const finalInvoices = invoices.filter((inv) =>
    inv.packageName?.toLowerCase().includes(searchInput.trim().toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ────────────────────────────────────────────────
  //    STATUS LOGIC - only used for AMOUNT column color
  // ────────────────────────────────────────────────
  const getAmountStatusColor = (inv) => {
    const total = Number(inv.amount || 0);
    const paid = Number(inv.paidAmount || 0);   // ← change field name if different

    if (paid >= total && total > 0) return "green";
    if (paid === 0 && total > 0) return "red";
    if (paid > 0 && paid < total) return "blue";
    if (paid > total) return "yellow";
    return "gray";
  };

  // Excel download (works with current filtered list)
  const downloadExcel = () => {
    const data = finalInvoices.map((invoice, index) => ({
      "S.NO": index + 1,
      "Recharge Type": `${invoice.packageType?.internet ? "Internet " : ""}${invoice.packageType?.isOtt ? "OTT " : ""
        }${invoice.packageType?.isIptv ? "IPTV" : ""}`.trim(),
      Username: invoice.userId?.generalInformation?.username || "—",
      Name: invoice.userId?.generalInformation?.name || "N/A",
      "Invoice No.": invoice.invoiceNumber || "—",
      Package: invoice.packageName || "—",
      Amount: invoice.amount || 0,
      // "LCO Amount": invoice.lcoAmount || 0,
      // "Reseller Amount": invoice.resellerAmount || 0,
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

  // PDF Actions
  const handleViewInvoice = async (invoiceId) => {
    if (openingInvoiceId) return; // prevent double click

    setOpeningInvoiceId(invoiceId);

    try {
      const blob = await fetchInvoicePdfBlob(invoiceId);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      toast.error("Failed to open PDF");
    } finally {
      setOpeningInvoiceId(null);
      setOpenMenuId(null);
    }
  };

  // const handleViewInvoice = async (invoiceId) => {
  //   try {
  //     const blob = await fetchInvoicePdfBlob(invoiceId);
  //     const blobUrl = URL.createObjectURL(blob);
  //     window.open(blobUrl, "_blank");
  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  //     setOpenMenuId(null);
  //   } catch (err) {
  //     toast.error("Failed to open PDF");
  //     setOpenMenuId(null);
  //   }
  // };

  const handleDirectDownload = (invoiceId, invoiceNumber) => {
    downloadInvoicePdf(invoiceId, invoiceNumber);
    setOpenMenuId(null);
  };

  const handleDelete = async (invoiceId) => {     // ← accept both ids
    if (!window.confirm("Are you sure you want to delete this invoice.")) {
      return;
    }
    try {
      await deleteInvoice(invoiceId);
      toast.success("Invoice deleted successfully");
      fetchInvoices(currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to delete invoice");
    } finally {
      setOpenMenuId(null);
    }
  };

  // const handleDelete = (invoiceId) => {
  //   if (window.confirm("Are you sure you want to remove this invoice?")) {
  //     toast.success(`Invoice ${invoiceId} removed (mock)`);
  //     setOpenMenuId(null);
  //   }
  // };

  // const handleRefund = (invoiceId) => {
  //   if (window.confirm("Are you sure you want to refund this plan?")) {
  //     toast.success(`Refund processed for ${invoiceId} (mock)`);
  //     setOpenMenuId(null);
  //   }
  // };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 flex flex-col min-h-screen w-8xl">
      {/* Header with search, download + status legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Purchased Invoice List</h2>

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* Search input */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by package name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
            />
            <FaSearch className="absolute left-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Download button */}
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap"
          >
            Download Excel
          </button>

          {/* Status legend – small colored dots + labels */}
          <div className="flex items-center gap-4 sm:gap-5 text-sm text-gray-700 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Paid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>Unpaid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Extra</span>
            </div>
          </div>
        </div>
      </div>


      {/* Filters */}
      <InvoiceFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Showing info */}
      <div className="mb-4 text-sm text-gray-600">
        {loading
          ? "Loading..."
          : `Showing ${finalInvoices.length} of ${totalCount} invoices`}
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
              {/* <th className="px-4 py-3 border">LCO AMOUNT</th> */}
              {/* <th className="px-4 py-3 border">RESELLER AMOUNT</th> */}
              <th className="px-4 py-3 border">INVOICE DATE</th>
              <th className="px-4 py-3 border">DURATION</th>
              <th className="px-4 py-3 border">ADDED BY</th>
              <th className="px-4 py-3 border text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-8">Loading...</td>
              </tr>
            ) : finalInvoices.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              finalInvoices.map((invoice, index) => {
                const userInfo = invoice.userId?.generalInformation || {};
                const pkgType = invoice.packageType || {};
                const amountColor = getAmountStatusColor(invoice);

                return (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td className="border px-4 py-3 text-center">
                      <div className="flex justify-center gap-4">
                        <RechargeType label="Internet" active={pkgType.internet} />
                        <RechargeType label="OTT" active={pkgType.isOtt} />
                        <RechargeType label="IPTV" active={pkgType.isIptv} />
                      </div>
                    </td>

                    <td className="border px-4 py-3">
                      <div className="font-medium text-blue-700">
                        {userInfo.username || "—"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {userInfo.name || "N/A"}
                      </div>
                    </td>

                    <td className="border px-4 py-3">
                      <span
                        onClick={() => handleViewInvoice(invoice._id)}
                        className={`underline ${openingInvoiceId === invoice._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 cursor-pointer hover:text-blue-800"
                          }`}
                      >
                        {openingInvoiceId === invoice._id ? "Opening invoice..." : invoice.invoiceNumber}
                      </span>

                      {/* <span
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                        onClick={() => handleViewInvoice(invoice._id)}
                      >
                        {invoice.invoiceNumber || "—"}
                      </span> */}
                    </td>

                    <td className="border px-4 py-3">{invoice.packageName || "—"}</td>

                    {/* AMOUNT - colored according to status */}
                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${amountColor === "green" ? "bg-green-500" :
                          amountColor === "red" ? "bg-red-500" :
                            amountColor === "blue" ? "bg-blue-500" :
                              amountColor === "yellow" ? "bg-yellow-500" :
                                "bg-gray-500"
                          }`}
                      >
                        ₹{invoice.amount || 0}
                      </span>
                    </td>

                    {/* LCO Amount - no status color */}
                    {/* <td className="border px-4 py-3 text-center">₹{invoice.lcoAmount || 0}</td> */}

                    {/* Reseller Amount - no status color */}
                    {/* <td className="border px-4 py-3 text-center">₹{invoice.resellerAmount || 0}</td> */}

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.createdAt).toLocaleDateString("en-GB")}{" "}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString()}
                      </span>
                    </td>

                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(invoice.duration?.startDate).toLocaleDateString("en-GB")} →{" "}
                      {new Date(invoice.duration?.endDate).toLocaleDateString("en-GB")}
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
                          <ProtectedAction module="invoice" action="PackageRechargeView">
                            <button
                              onClick={() => handleViewInvoice(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEye className="mr-2 text-blue-600" /> View
                            </button>
                          </ProtectedAction>

                          <ProtectedAction module="invoice" action="InvoiceDownload">
                            <button
                              onClick={() =>
                                handleDirectDownload(invoice._id, invoice.invoiceNumber)
                              }
                              className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                            >
                              <FaDownload className="mr-2" /> Download
                            </button>
                          </ProtectedAction>

                          {/* <ProtectedAction module="invoice" action="packageRechargeRefund">
                            <button
                              onClick={() => handleRefund(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                            >
                              <FaUndo className="mr-2" /> Refund Plan
                            </button>
                          </ProtectedAction> */}

                          <ProtectedAction module="invoice" action="PackageRechargeRemove">
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <FaTrashAlt className="mr-2" /> Remove
                            </button>
                          </ProtectedAction>

                          {/* <ProtectedAction module="invoice" action="packageRechargeRemove">
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <FaTrashAlt className="mr-2" /> Remove
                            </button>
                          </ProtectedAction> */}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-6 pb-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-md text-sm font-medium ${currentPage === 1
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
            className={`px-5 py-2 rounded-md text-sm font-medium ${currentPage === totalPages
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