import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchInvoicePdfBlob } from "../../service/purchasedPlan"; // Adjust path
import { FaDownload, FaPrint } from "react-icons/fa";

export default function InvoicePage() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const blob = await fetchInvoicePdfBlob(id);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        toast.error(err.message || "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [id, pdfUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Invoice_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading PDF...</p>;

  if (!pdfUrl) return <p className="p-6 text-red-600">Failed to load PDF.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaDownload /> Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPrint /> Print
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white shadow-lg rounded overflow-hidden">
          <iframe
            src={pdfUrl}
            width="100%"
            height="800px"
            title="Invoice PDF"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}