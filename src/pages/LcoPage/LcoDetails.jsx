import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getLcoDetails } from "../../service/lco"; // Fetch single LCO API
import LcoEmployeeList from "./LcoEmployee/LcoEmployeeList";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import LcoWalletList from "./LcoWallet/LcoWalletList";
import { FaLongArrowAltLeft } from "react-icons/fa";
import LcoAssignPackageList from "./AssignPackage/LcoAssignPackageList";
import ProtectedAction from "../../components/ProtectedAction";
import { FaDownload } from "react-icons/fa";

const BASE_FILE_URL = "http://localhost:5004/public/";

export default function LcoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lco, setLco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // for open and closed the employees
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(true)
  const [isWalletHistoryOpen, setIsWalletHistoryOpen] = useState(true)
  const [isAssignedPackageOpen, setIsAssignedPaclagesOpen] = useState(true)
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);

  useEffect(() => {
    const loadLco = async () => {
      try {
        const res = await getLcoDetails(id); // API call with ID
        setLco(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load LCO details");
      } finally {
        setLoading(false);
      }
    };
    loadLco();
  }, [id]);

  useEffect(() => {
    if (lco) {
      console.log("📌 LCO state updated:", lco);
    }
  }, [lco]);
  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!lco) return <p className="p-4">LCO not found</p>;

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
      <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
      <div className="w-2/3 p-[2px]">{value || "—"}</div>
    </div>
  );

  const downloadFile = async (url, filename) => {
    try {
      setDownloadingFile(filename);
      setDownloadedFile(null);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadedFile(filename);
      setTimeout(() => setDownloadedFile(null), 3000);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download file");
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <>
      <h3 className="text-2xl font-semibold ">LCO Details</h3>


      <div className="flex justify-between mb-1">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <FaLongArrowAltLeft /> Back
        </button>

        {/* ACTION BUTTONS (RIGHT SIDE) */}
        <div className="flex items-center gap-2">

          {/* EDIT BUTTON — comes FIRST */}

          <ProtectedAction module="lco" action="Edit">
            <button
              onClick={() =>
                navigate(`/lco/update/${lco?._id}`, {
                  state: { from: `/lco/list/${id}` }
                })
              }
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </ProtectedAction>

          {/* ADD TRANSACTION BUTTON — comes AFTER */}
          <ProtectedAction module="lco" action="AddTransaction">
            <button
              onClick={() =>
                navigate(`/lco/wallet/create/${lco?._id}`, {
                  state: {
                    data: {
                      lcoWalletBalance: lco?.walletBalance || "0",
                      creditBalance: lco?.creditBalance || {},
                      name: lco?.retailerId?.resellerName || "",
                    },
                  },
                })
              }
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </ProtectedAction>

        </div>
      </div>
      
      {/* <div className="border rounded-lg overflow-hidden shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Title" value={lco.title} />
          <Row label="LCO Name" value={lco.lcoName} />
          <Row label="Mobile No." value={lco.mobileNo} />
          <Row label="Telephone" value={lco.telephone} />
          <Row label="E-Mail" value={lco.email} />
          <Row label="Address" value={lco.address} />
          <Row label="Area" value={lco.area} />
          <Row label="State" value={lco.state} />
          <Row label="Country" value={lco.country} />
          <Row label="Pincode" value={lco.pincode} />
          <Row label="GST No." value={lco.gst} />
          <Row label="Pan No." value={lco.panNo} />
          <Row label="Reseller Name" value={lco?.retailerId?.resellerName} />
          <Row label="Website" value={lco.website} />
          <Row label="Description" value={lco.description} />
          <Row label="Status" value={lco.status} />
        </div>
      </div> */}
      <div className="border rounded-lg overflow-hidden shadow">
  <div className="grid grid-cols-1 md:grid-cols-2">
    {/* Existing Rows */}
    <Row label="Title" value={lco.title} />
    <Row label="LCO Name" value={lco.lcoName} />
    <Row label="Mobile No." value={lco.mobileNo} />
    <Row label="Telephone" value={lco.telephone} />
    <Row label="E-Mail" value={lco.email} />
    <Row label="Address" value={lco.address} />
    <Row label="Area" value={lco.area} />
    <Row label="State" value={lco.state} />
    <Row label="Country" value={lco.country} />
    <Row label="Pincode" value={lco.pincode} />
    <Row label="GST No." value={lco.gst} />
    <Row label="Pan No." value={lco.panNo} />
    <Row label="Reseller Name" value={lco?.retailerId?.resellerName} />
    <Row label="Website" value={lco.website} />
    <Row label="Description" value={lco.description} />
    <Row label="Status" value={lco.status} />

    {/* ── NEW: Inline Document Previews ── */}
    {["aadhaarCard", "panCard", "license", "other"].map((docKey) => {
      const paths = lco.document?.[docKey];
      const files = Array.isArray(paths) ? paths : paths ? [paths] : [];
      const label = 
        docKey === "aadhaarCard" ? "Aadhaar Card" :
        docKey === "panCard"     ? "PAN Card" :
        docKey === "license"     ? "License" :
        "Other Document";

      return (
        <div 
          key={docKey} 
          className="flex border-b last:border-b-0 md:border-r text-[14px] items-center"
        >
          <div className="w-1/3 bg-gray-100 p-[2px] font-medium">
            {label}
          </div>
          <div className="w-2/3 p-[2px] flex items-center gap-3">
            {files.length > 0 ? (
              <>
                {/* Small Preview */}
                {(() => {
                  const path = files[0]; // Show first image only (compact)
                  const cleanPath = path.replace(/\\/g, "/");
                  const fullUrl = `${BASE_FILE_URL}${cleanPath.replace(/^public\//i, '')}`;
                  const fileName = cleanPath.split("/").pop() || `${docKey}-1`;
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                  return isImage ? (
                    <img
                      src={fullUrl}
                      alt={label}
                      className="w-12 h-12 object-cover rounded border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(fullUrl, "_blank")}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48?text=?";
                        e.target.alt = "Failed";
                      }}
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">Non-image file</span>
                  );
                })()}

                {/* Tiny Download Button */}
                <button
                  onClick={() => {
                    const path = files[0];
                    const cleanPath = path.replace(/\\/g, "/");
                    const fullUrl = `${BASE_FILE_URL}${cleanPath.replace(/^public\//i, '')}`;
                    const fileName = cleanPath.split("/").pop() || `${docKey}-1`;
                    downloadFile(fullUrl, fileName);
                  }}
                  disabled={downloadingFile === docKey}
                  className={`text-blue-600 hover:text-blue-800 transition text-sm ${
                    downloadingFile === docKey ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Download"
                >
                  <FaDownload size={14} />
                </button>

                {downloadedFile === docKey && (
                  <span className="text-green-600 text-xs ml-1">✓</span>
                )}
              </>
            ) : (
              <span className="text-gray-500 italic text-xs">Not Uploaded</span>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

  {/* DOCUMENTS SECTION - Compact, 2 per row, small cards */}
{/* <div className="mt-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">LCO Documents</h3>

  {lco?.document && Object.keys(lco.document).length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(lco.document).map(([docType, paths]) => {
        const files = Array.isArray(paths) ? paths : [paths];

        return files.map((path, index) => {
          const cleanPath = path.replace(/\\/g, "/");
          const fullUrl = `${BASE_FILE_URL}${cleanPath.replace(/^public\//i, '')}`;
          const fileName = cleanPath.split("/").pop() || `${docType}-${index + 1}`;
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

          const displayLabel = files.length > 1
            ? `${docType.charAt(0).toUpperCase() + docType.slice(1)} (${index + 1})`
            : docType.charAt(0).toUpperCase() + docType.slice(1);

          return (
            <div
              key={`${docType}-${index}`}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-md shadow-sm p-3 hover:shadow transition-all duration-150"
            >
    
              <div className="font-medium text-gray-700 text-sm min-w-[120px] truncate pr-2">
                {displayLabel}
              </div>

          
              <div className="flex-shrink-0 mx-2">
                {isImage ? (
                  <img
                    src={fullUrl}
                    alt={displayLabel}
                    className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer"
                    onClick={() => window.open(fullUrl, "_blank")}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64?text=Not+Found";
                      e.target.alt = "Image failed to load";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-[10px] text-center border border-gray-300">
                    Non-image
                  </div>
                )}
              </div>

              <button
                onClick={() => downloadFile(fullUrl, fileName)}
                disabled={downloadingFile === fileName}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded ${
                  downloadingFile === fileName
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaDownload size={12} />
                {downloadingFile === fileName ? "..." : "Download"}
              </button>

    
              {downloadedFile === fileName && (
                <span className="ml-2 text-green-600 text-xs font-medium hidden md:inline">
                  Done
                </span>
              )}
            </div>
          );
        });
      })}
    </div>
  ) : (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-500 text-sm italic">
      No documents uploaded for this LCO
    </div>
  )}
</div> */}

      {/* lco employee */}
      <div className="flex justify-between mt-1">
        <div>Lco Employees</div>
        <div
          className="cursor-pointer flex items-center gap-1"
          onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
        >
          {isEmployeeOpen ? (
            <MdKeyboardDoubleArrowUp size={20} />
          ) : (
            <MdKeyboardDoubleArrowDown size={20} />
          )}
        </div>
      </div>
      {isEmployeeOpen && <LcoEmployeeList />}
      {/* this is for the wallet history */}
      <div className="flex justify-between mt-1 ">
        <div>Wallet History</div>
        <div
          className="cursor-pointer flex items-center gap-1"
          onClick={() => setIsWalletHistoryOpen(!isWalletHistoryOpen)}
        >
          {isEmployeeOpen ? (
            <MdKeyboardDoubleArrowUp size={20} />
          ) : (
            <MdKeyboardDoubleArrowDown size={20} />
          )}
        </div>
      </div>
      {isWalletHistoryOpen && <LcoWalletList />}
      {/* this is for the listing of the assign packages to the lco */}
      <div className="flex justify-between mt-1">
        <div>Assigned Packages</div>
        <div
          className="cursor-pointer flex items-center gap-1"
          onClick={() => setIsAssignedPaclagesOpen(!isAssignedPackageOpen)}
        >
          {isAssignedPackageOpen ? (
            <MdKeyboardDoubleArrowUp size={20} />
          ) : (
            <MdKeyboardDoubleArrowDown size={20} />
          )}
        </div>
      </div>
      {isAssignedPackageOpen && <LcoAssignPackageList />}
    </>
  );
}
