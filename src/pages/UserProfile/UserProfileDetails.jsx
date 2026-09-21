import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";
import {
  FaDownload,
  FaEdit,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import UserPackageDetails from "./PackageDetails";

const BASE_FILE_URL = import.meta.env.VITE_IMAGE_URL
  ? `${import.meta.env.VITE_IMAGE_URL}/public/`
  : "http://localhost:5004/public/";

const hasValue = (v) => {
  if (v === undefined || v === null) return false;
  const s = String(v).trim();
  return (
    s !== "" &&
    s !== "—" &&
    s !== "-" &&
    s !== "/-" &&
    s !== "N/A" &&
    s !== "undefined" &&
    s !== "null"
  );
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await getUserFullDetails(id);
        if (res.status) {
          setData(res);
        } else {
          console.error("API Error:", res.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-600 text-lg bg-gray-50 min-h-screen">
        Loading User Profile...
      </div>
    );
  }

  if (!data?.userDetails) {
    return (
      <div className="p-16 text-center text-red-600 text-lg bg-gray-50 min-h-screen">
        User Not Found!
      </div>
    );
  }

  const u = data.userDetails;
  const g = u.generalInformation || {};
  const a = u.addressDetails || {};
  const add = u.additionalInformation || {};
  const net = u.networkInformation || {};
  const area = a.area || {};
  const subZone = a.subZone || {};
  const docs = u.document || [];

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  };

  const formatDateTime = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const pad = (n) => String(n).padStart(2, "0");
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}-${month}-${year} ${pad(hours)}:${minutes}:${seconds} ${ampm}`;
  };

  // Blob-based file download
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
      alert("Download failed. Check file path or server.");
    } finally {
      setDownloadingFile(null);
    }
  };

  const getInstallerDisplay = () => {
    if (g.installationByName?.trim()) return g.installationByName.trim();
    if (Array.isArray(g.installationBy) && g.installationBy.length > 0) {
      const names = g.installationBy
        .map((inst) =>
          typeof inst === "object" ? inst.name || inst.staffName : inst,
        )
        .filter(Boolean);
      if (names.length > 0) return names.join(", ");
    }
    return "";
  };

  const getSalesExecutiveDisplay = () => {
    if (!g.selsExecutive) return "";
    if (typeof g.selsExecutive === "object") {
      return g.selsExecutive.name || g.selsExecutive.staffName || "";
    }
    return String(g.selsExecutive);
  };

  const getAreaDisplay = () => {
    if (area?.zoneName) return area.zoneName;
    if (area?.name) return area.name;
    if (typeof a.area === "string") return a.area;
    return "";
  };

  const getSubZoneDisplay = () => {
    if (subZone?.subZoneName) return subZone.subZoneName;
    if (subZone?.name) return subZone.name;
    if (typeof a.subZone === "string") return a.subZone;
    if (a.subArea) return a.subArea;
    return "";
  };

  const getProrataDisplay = () => {
    if (
      u.prorataBilling === undefined ||
      u.prorataBilling === null ||
      u.prorataBilling === ""
    ) {
      return "";
    }
    return u.prorataBilling ? "Yes" : "No";
  };

  // Address texts
  const billingAddressText = [
    a.billingAddress?.addressine1 || a.billingAddress?.addressLine1,
    a.billingAddress?.addressine2 || a.billingAddress?.addressLine2,
  ]
    .filter(Boolean)
    .join(", ");

  const installAddressText = [
    a.installationAddress?.addressine1 || a.installationAddress?.addressLine1,
    a.installationAddress?.addressine2 || a.installationAddress?.addressLine2,
  ]
    .filter(Boolean)
    .join(", ");

  const permAddressText = [
    a.permanentAddress?.addressine1 || a.permanentAddress?.addressLine1,
    a.permanentAddress?.addressine2 || a.permanentAddress?.addressLine2,
  ]
    .filter(Boolean)
    .join(", ");

  // Visibility checks for section cards (don't show card if no data)
  const hasBillingData =
    hasValue(a.billingAddress?.state) ||
    hasValue(a.billingAddress?.city) ||
    hasValue(a.billingAddress?.pincode) ||
    hasValue(a.billingAddress?.landmark) ||
    hasValue(billingAddressText);

  const hasInstallData =
    hasValue(a.installationAddress?.state) ||
    hasValue(a.installationAddress?.city) ||
    hasValue(a.installationAddress?.pincode) ||
    hasValue(a.installationAddress?.landmark) ||
    hasValue(installAddressText);

  const hasPermData =
    hasValue(a.permanentAddress?.state) ||
    hasValue(a.permanentAddress?.city) ||
    hasValue(a.permanentAddress?.pincode) ||
    hasValue(a.permanentAddress?.landmark) ||
    hasValue(permAddressText);

  const zoneValue = area?.zoneName || a.zone || a.customArea || "";
  const hasAddressAddressData =
    hasValue(getAreaDisplay()) ||
    hasValue(a.box) ||
    hasValue(getSubZoneDisplay()) ||
    hasValue(a.street) ||
    hasValue(net.olt || a.olt) ||
    hasValue(net.splitter || a.splitter) ||
    hasValue(net.port || a.port) ||
    hasValue(a.building) ||
    hasValue(zoneValue);

  const hasAddlData =
    hasValue(add.ekyc) ||
    hasValue(add.notification) ||
    hasValue(add.addPlan) ||
    hasValue(u.createdAt);

  return (
    <div className="w-full px-0 py-2">
      {/* Top Main Container Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7 mb-6 w-full">
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h1 className="text-base sm:text-lg font-bold text-[#143e6a] tracking-wide uppercase">
            Customer Details
          </h1>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Customer Attributes (Only fields with data are shown) */}
          <div className="space-y-0.5">
            <DetailRow label="IP Address" value={g.ipAdress || g.ipAddress} />
            <DetailRow label="S/o" value={g.fatherName || g.so} />
            <DetailRow label="Alternate Mobile" value={g.alternatePhone} />
            <DetailRow label="Email" value={g.email} />
            <DetailRow
              label="Date Of Birth"
              value={add.dob ? formatDate(add.dob) : ""}
            />
            <DetailRow label="GST No." value={g.gstNo} />
            <DetailRow label="Purchase Order No" value={g.purchaseOrderNo} />
            <DetailRow
              label="Connection Type"
              value={g.connectionType?.toUpperCase()}
            />
            <DetailRow label="IPACCT TECH ID" value={g.ipactId} />
            <DetailRow label="Installation By" value={getInstallerDisplay()} />
            <DetailRow label="Serial No" value={g.serialNo} />
            <DetailRow
              label="Jaze User Id"
              value={g.UserId || g.userId || g.username}
            />
            <DetailRow label="SBT No" value={g.stbNo} />
            <DetailRow label="Mac Id" value={g.macId} />
            <DetailRow label="Prorata billing" value={getProrataDisplay()} />
            <DetailRow label="A End" value={g.aEnd} />
            <DetailRow label="Circuit ID" value={g.circuitId} />
            <DetailRow label="Customer Type" value={u.customerType} />
            <DetailRow label="Mobile" value={g.phone} />
            <DetailRow label="Telephone" value={g.telephone} />
            <DetailRow label="Gender" value={g.gender} />
            <DetailRow label="Due Days" value={u.dueDays} />
            <DetailRow label="Pancard" value={g.pancard} />
            <DetailRow
              label="Registration Date/Time"
              value={formatDateTime(u.createdAt)}
            />
            <DetailRow
              label="Sales Executive"
              value={getSalesExecutiveDisplay()}
            />
            <DetailRow label="Server Type" value={g.serverType} />
            <DetailRow label="PPPOE Password" value={g.plainPassword} />
            <DetailRow
              label="Service Opted"
              value={g.serviceOpted?.toUpperCase()}
            />
            <DetailRow label="Remark" value={add.description} />
          </div>

          {/* RIGHT COLUMN: Address Cards (Only cards and fields with data are shown) */}
          <div className="space-y-6">
            {/* BILLING ADDRESS */}
            {hasBillingData && (
              <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-xs">
                <div className="bg-[#f0f4f9] px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-[#143e6a] uppercase tracking-wider">
                    Billing Address
                  </h3>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="State"
                      value={a.billingAddress?.state}
                      width="w-20"
                    />
                    <AddressField
                      label="City"
                      value={a.billingAddress?.city}
                      width="w-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Pincode"
                      value={a.billingAddress?.pincode}
                      width="w-20"
                    />
                    <AddressField
                      label="Landmark"
                      value={a.billingAddress?.landmark}
                      width="w-20"
                    />
                  </div>

                  {hasValue(billingAddressText) && (
                    <div className="pt-1">
                      <span className="font-semibold text-gray-800 block mb-0.5">
                        Address
                      </span>
                      <span className="text-gray-600 leading-relaxed break-words">
                        {billingAddressText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* INSTALLATION ADDRESS */}
            {hasInstallData && (
              <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-xs">
                <div className="bg-[#f0f4f9] px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-[#143e6a] uppercase tracking-wider">
                    Installation Address
                  </h3>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="State"
                      value={a.installationAddress?.state}
                      width="w-20"
                    />
                    <AddressField
                      label="City"
                      value={a.installationAddress?.city}
                      width="w-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Pincode"
                      value={a.installationAddress?.pincode}
                      width="w-20"
                    />
                    <AddressField
                      label="Landmark"
                      value={a.installationAddress?.landmark}
                      width="w-20"
                    />
                  </div>

                  {hasValue(installAddressText) && (
                    <div className="pt-1">
                      <span className="font-semibold text-gray-800 block mb-0.5">
                        Address
                      </span>
                      <span className="text-gray-600 leading-relaxed break-words">
                        {installAddressText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PERMANENT ADDRESS */}
            {hasPermData && (
              <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-xs">
                <div className="bg-[#f0f4f9] px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-[#143e6a] uppercase tracking-wider">
                    Permanent Address
                  </h3>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="State"
                      value={a.permanentAddress?.state}
                      width="w-20"
                    />
                    <AddressField
                      label="City"
                      value={a.permanentAddress?.city}
                      width="w-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Pincode"
                      value={a.permanentAddress?.pincode}
                      width="w-20"
                    />
                    <AddressField
                      label="Landmark"
                      value={a.permanentAddress?.landmark}
                      width="w-20"
                    />
                  </div>

                  {hasValue(permAddressText) && (
                    <div className="pt-1">
                      <span className="font-semibold text-gray-800 block mb-0.5">
                        Address
                      </span>
                      <span className="text-gray-600 leading-relaxed break-words">
                        {permAddressText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADDRESS ADDRESS (Area / Location / Zone) */}
            {hasAddressAddressData && (
              <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-xs">
                <div className="bg-[#f0f4f9] px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-[#143e6a] uppercase tracking-wider">
                    Address Address
                  </h3>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Area"
                      value={getAreaDisplay()}
                      width="w-24"
                    />
                    <AddressField label="Box" value={a.box} width="w-20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Zone"
                      value={getSubZoneDisplay()}
                      width="w-24"
                    />
                    <AddressField
                      label="Street"
                      value={a.street}
                      width="w-20"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <AddressField
                      label="OLT"
                      value={net.olt || a.olt}
                      width="w-12"
                    />
                    <AddressField
                      label="Splitter"
                      value={net.splitter || a.splitter}
                      width="w-16"
                    />
                    <AddressField
                      label="Port"
                      value={net.port || a.port}
                      width="w-12"
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <AddressField label="Building" value={a.building} width="w-24" />
                    <AddressField label="Zone" value={zoneValue} width="w-20" />
                  </div> */}
                </div>
              </div>
            )}

            {/* ADDITIONAL INFORMATION */}
            {hasAddlData && (
              <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-xs">
                <div className="bg-[#f0f4f9] px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-[#143e6a] uppercase tracking-wider">
                    Additional Information
                  </h3>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="E-KYC"
                      value={
                        add.ekyc
                          ? add.ekyc === "yes"
                            ? "Completed"
                            : "Pending"
                          : ""
                      }
                      width="w-36"
                    />
                    <AddressField
                      label="Notification"
                      value={
                        add.notification !== undefined
                          ? add.notification
                            ? "Enabled"
                            : "Disabled"
                          : ""
                      }
                      width="w-36"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Add Plan Allowed"
                      value={
                        add.addPlan !== undefined
                          ? add.addPlan
                            ? "Yes"
                            : "No"
                          : ""
                      }
                      width="w-36"
                    />
                    <AddressField
                      label="Account Created"
                      value={u.createdAt ? formatDateTime(u.createdAt) : ""}
                      width="w-36"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENTS SECTION */}
      {docs.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 w-full">
          <div className="bg-[#f0f4f9] px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xs sm:text-sm font-bold text-[#143e6a] uppercase tracking-wider">
              Documents ({docs.length})
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docs
                .map((doc, docIndex) => {
                  const images = Array.isArray(doc.documentImage)
                    ? doc.documentImage
                    : doc.documentImage
                      ? [doc.documentImage]
                      : [];

                  return images.length > 0
                    ? images.map((imgPath, imgIndex) => {
                        const cleanPath = imgPath
                          .replace(/\\/g, "/")
                          .replace(/^public\//, "");
                        const url = BASE_FILE_URL + cleanPath;
                        const fileName =
                          cleanPath.split("/").pop() ||
                          `document-${imgIndex + 1}`;
                        const isImage =
                          /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);
                        const displayType =
                          images.length > 1
                            ? `${doc.documentType} (${imgIndex + 1})`
                            : doc.documentType;

                        return (
                          <DocItem
                            key={`${docIndex}-${imgIndex}`}
                            docType={displayType}
                            url={url}
                            fileName={fileName}
                            isImage={isImage}
                            downloadFile={downloadFile}
                            downloading={downloadingFile}
                            downloaded={downloadedFile}
                          />
                        );
                      })
                    : null;
                })
                .filter(Boolean)}
            </div>
          </div>
        </div>
      )}

      {/* PACKAGE DETAILS SECTION */}
      <UserPackageDetails
        ipactId={u.ipactId ?? g.ipactId ?? u.ipacctId ?? g.ipacctId}
      />
    </div>
  );
};

// Reusable Detail Row Component (Left Column - only rendered if value exists)
const DetailRow = ({ label, value }) => {
  if (!hasValue(value)) return null;

  return (
    <div className="flex items-start py-1.5 text-[13px] border-b border-gray-100 last:border-b-0">
      <span className="font-semibold text-gray-800 w-44 sm:w-52 shrink-0">
        {label}
      </span>
      <span className="text-gray-600 flex-1 break-words font-normal">
        {String(value).trim()}
      </span>
    </div>
  );
};

// Reusable Address Field Component (Right Column - only rendered if value exists)
const AddressField = ({ label, value, width = "w-20" }) => {
  if (!hasValue(value)) return null;

  return (
    <div className="flex items-start gap-2">
      <span className={`font-semibold text-gray-800 ${width} shrink-0`}>
        {label}
      </span>
      <span className="text-gray-600 flex-1 break-words">
        {String(value).trim()}
      </span>
    </div>
  );
};

// Document Item with Preview & Download
const DocItem = ({
  docType,
  url,
  fileName,
  isImage,
  downloadFile,
  downloading,
  downloaded,
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100/70 transition">
      <div className="flex items-center gap-2.5 min-w-0">
        {isImage ? (
          <img
            src={url}
            alt={docType}
            className="w-10 h-10 object-cover rounded border border-gray-300 cursor-pointer flex-shrink-0 hover:opacity-90"
            onClick={() => window.open(url, "_blank")}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.onerror = null;
              if (e.target.nextSibling)
                e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-10 h-10 bg-gray-200 text-gray-500 rounded border border-gray-300 flex items-center justify-center flex-shrink-0 ${
            isImage ? "hidden" : "flex"
          }`}
        >
          <FaFileAlt className="text-base text-gray-400" />
        </div>

        <div className="min-w-0">
          <strong className="block text-xs font-semibold text-gray-800 truncate">
            {docType}
          </strong>
          <span className="text-[10px] text-gray-500 truncate block">
            {fileName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
        <button
          onClick={() => window.open(url, "_blank")}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-white rounded transition"
          title="Open in new tab"
        >
          <FaExternalLinkAlt className="text-[10px]" />
        </button>

        <button
          onClick={() => downloadFile(url, fileName)}
          disabled={downloading === fileName}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-white rounded transition disabled:opacity-50 flex items-center gap-1 text-xs font-medium"
          title="Download Document"
        >
          <FaDownload className="text-xs" />
          {downloading === fileName && (
            <span className="text-[10px]">Saving...</span>
          )}
          {downloaded === fileName && (
            <span className="text-[10px] text-green-600 font-semibold">
              Done!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
