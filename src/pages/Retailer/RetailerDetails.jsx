import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRetailerDetails } from "../../service/retailer"; // Fetch single retailer API
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import RetailerEmployeeList from "./RetailorEmployee/RetailorEmployeeList";
import RetailerWalletList from "./RetailerWallet/RetailerWalletList";
import { FaBlackTie, FaLongArrowAltLeft } from "react-icons/fa";
import AssignPackageList from "./AssignPackage/AssignPackageList";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import ProtectedAction from "../../components/ProtectedAction";

const BASE_FILE_URL = "http://localhost:5004/public/";

export default function RetailerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // for open and closed the employees
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(true);
  const [isWalletHistoryOpen, setIsWalletHistoryOpen] = useState(true);
  const [isAssignedPackageOpen, setIsAssignedPaclagesOpen] = useState(true)

  const [downloadingFile, setDownloadingFile] = useState(null);
const [downloadedFile, setDownloadedFile] = useState(null);

  useEffect(() => {
    const loadRetailer = async () => {
      try {
        const res = await getRetailerDetails(id); // Make API accept ID to fetch single retailer
        setRetailer(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load retailer details");
      } finally {
        setLoading(false);
      }
    };
    loadRetailer();
  }, [id]);
  useEffect(() => {
    if (retailer) {
      console.log("📌 Retailer state updated:", retailer);
    }
  }, [retailer]);
  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!retailer) return <p className="p-4">Retailer not found</p>;
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
      <div className="p-4  mx-auto flex gap-2 items-center -mt-4">
        <h3 className="text-2xl font-semibold">{retailer?.resellerName} Details</h3>
      </div>

      <div className="flex justify-between mb-1">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          <span className="flex items-center"> <FaLongArrowAltLeft /> Back</span>
        </button>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <ProtectedAction module="reseller" action="Edit">
            <button
              onClick={() => navigate(`/retailer/update/${retailer?._id}`)}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </ProtectedAction>

          {/* ADD TRANSACTION BUTTON */}
          <ProtectedAction module="reseller" action="AddTransaction">
            <button
              onClick={() =>
                navigate(`/retailer/wallet/create/${retailer?._id}`, {
                  state: {
                    data: {
                      rsellerWalletBalance: retailer?.walletBalance || '',
                      creditBalance: retailer?.creditBalance || {},
                      resellerName: retailer?.resellerName || ''
                    }
                  }
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
          <Row label="Title" value={retailer.title} />
          <Row label="Reseller Name" value={retailer.resellerName} />
          <Row label="Mobile No." value={retailer.mobileNo} />
          <Row label="Phone No." value={retailer.phoneNo} />
          <Row label="E-Mail" value={retailer.email} />
          <Row label="Address" value={retailer.address} />
          <Row label="Area" value={retailer.area} />
          <Row label="State" value={retailer.state} />
          <Row label="Country" value={retailer.country} />
          <Row label="Pincode" value={retailer.pincode} />
          <Row label="GST No." value={retailer.gstNo} />
          <Row label="Balance" value={retailer.balance} />
          <Row label="PAN No." value={retailer.panNumber} />
          <Row label="Dashboard" value={retailer.dashboard} />
          <Row label="Contact Person Number" value={retailer.contactPersonNumber} />
          <Row label="WhatsApp Number" value={retailer.whatsAppNumber} />
          <Row label="Website" value={retailer.website} />
          <Row label="Contact Person Name" value={retailer.contactPersonName} />
          <Row label="Support Email" value={retailer.supportEmail} />
          <Row label="Latitude" value={retailer.latitude} />
          <Row label="Longitude" value={retailer.longitude} />
          <Row label="Status" value={retailer.status} />
        </div>
      </div> */}
      <div className="border rounded-lg overflow-hidden shadow">
  <div className="grid grid-cols-1 md:grid-cols-2">
    <Row label="Title" value={retailer.title} />
    <Row label="Reseller Name" value={retailer.resellerName} />
    <Row label="Mobile No." value={retailer.mobileNo} />
    <Row label="Phone No." value={retailer.phoneNo} />
    <Row label="E-Mail" value={retailer.email} />
    <Row label="Address" value={retailer.address} />
    <Row label="Area" value={retailer.area} />
    {/* <Row label="Taluka" value={retailer.taluka} /> */}
    <Row label="State" value={retailer.state} />
    <Row label="Country" value={retailer.country} />
    <Row label="Pincode" value={retailer.pincode} />
    <Row label="GST No." value={retailer.gstNo} />
    {/* <Row label="Birth Date" value={retailer.dob} /> */}
    <Row label="Balance" value={retailer.balance} />
    {/* <Row label="House No." value={retailer.houseNo} /> */}
    {/* <Row label="SubArea" value={retailer.subArea} /> */}
    {/* <Row label="Fax" value={retailer.fax} /> */}
    <Row label="PAN No." value={retailer.panNumber} />
    {/* <Row label="MessengerId" value={retailer.messengerId} /> */}
    <Row label="Dashboard" value={retailer.dashboard} />
    {/* <Row label="Reseller Code" value={retailer.resellerCode} /> */}
    <Row label="Contact Person Number" value={retailer.contactPersonNumber} />
    <Row label="WhatsApp Number" value={retailer.whatsAppNumber} />
    <Row label="Website" value={retailer.website} />
    {/* <Row label="Anniversary Date" value={retailer.annversaryDate} /> */}
    <Row label="Contact Person Name" value={retailer.contactPersonName} />
    <Row label="Support Email" value={retailer.supportEmail} />
    <Row label="Latitude" value={retailer.latitude} />
    <Row label="Longitude" value={retailer.longitude} />
    <Row label="Status" value={retailer.status} />

    {/* ── NEW: Document Previews (inline like LCO) ── */}
    {["aadhaarCard", "panCard", "license", "other"].map((docKey) => {
      const paths = retailer.document?.[docKey];
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
                {/* Small Preview (only first file for compactness) */}
                {(() => {
                  const path = files[0];
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

                {/* Download Button */}
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
      <div className="flex justify-between mt-1">
        <div>Reseller Employees</div>
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
      {isEmployeeOpen && <RetailerEmployeeList />}
      {/* this is for the wallet history */}
      <div className="flex justify-between mt-1">
        <div>Wallet History</div>
        <div
          className="cursor-pointer flex items-center gap-1"
          onClick={() => setIsWalletHistoryOpen(!isWalletHistoryOpen)}
        >
          {isWalletHistoryOpen ? (
            <MdKeyboardDoubleArrowUp size={20} />
          ) : (
            <MdKeyboardDoubleArrowDown size={20} />
          )}
        </div>
      </div>
      {isWalletHistoryOpen && <RetailerWalletList />}
      {/* this is for the listing of the assign packages to the reseller */}
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
      {isAssignedPackageOpen && <AssignPackageList />}
    </>
  );
}