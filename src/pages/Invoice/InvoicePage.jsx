import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchInvoicePdfBlob } from "../../service/purchasedPlan";
import { FaDownload, FaPrint } from "react-icons/fa";

export default function InvoicePage() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null); // We'll get this from backend metadata

  const objectUrlRef = useRef(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const blob = await fetchInvoicePdfBlob(id);
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load invoice PDF");
        toast.error(err.message || "Failed to load invoice PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [id]);

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("paid") || s === "completed") {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (s === "unpaid" || s === "pending") {
      return "bg-red-100 text-red-800 border-red-300";
    }
    if (s === "partial") {
      return "bg-blue-100 text-blue-800 border-blue-300";
    }
    if (s === "extra" || s.includes("overpaid")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!pdfUrl) return;
    const printWindow = window.open(pdfUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      toast.error("Popup blocked. Please allow popups for printing.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading invoice PDF...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Failed to load invoice PDF"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Status Banner + Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div
            className={`px-5 py-2.5 rounded-lg border font-medium text-base ${getStatusStyle(
              statusInfo?.paymentStatus || "Unknown"
            )}`}
          >
            Payment Status: <strong>{statusInfo?.paymentStatus || "Unknown"}</strong>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              <FaDownload /> Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <iframe
            src={pdfUrl}
            width="100%"
            height="900px"
            title="Invoice PDF Preview"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}