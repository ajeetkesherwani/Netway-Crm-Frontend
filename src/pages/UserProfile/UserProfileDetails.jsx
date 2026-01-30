import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";
import { FaDownload } from "react-icons/fa";

const BASE_FILE_URL = "http://localhost:5004/public/"; // Adjust if needed

const UserProfile = () => {
  const { id } = useParams();
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
      <div style={{ padding: "60px", textAlign: "center", fontSize: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
        Loading User Profile...
      </div>
    );
  }

  if (!data?.userDetails) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "red", fontSize: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
        User Not Found!
      </div>
    );
  }

  const u = data.userDetails;
  const g = u.generalInformation || {};
  const a = u.addressDetails || {};
  const add = u.additionalInformation || {};
  const area = a.area || {};
  const docs = u.document || [];

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>

      {/* CUSTOMER DETAILS */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "0.5px" }}>
            CUSTOMER DETAILS
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
          {/* LEFT COLUMN */}
          <div style={{ width: "48%", minWidth: "300px" }}>
            <Field label="IP Address" value={g.ipAdress} />
            <Field label="Alternate Mobile" value={g.alternatePhone} />
            <Field label="Email" value={g.email} />
            <Field label="Date Of Birth" value={add.dob ? formatDate(add.dob) : ""} />
            <Field label="Connection Type" value={g.connectionType} />
            <Field label="IPACCT Id" value={g.ipactId} />
            <Field label="InstallationByName" value={g.installationByName || "-"} />
            {g.installationBy?.length > 0 ? (
              g.installationBy.map((inst, i) => (
                <div key={inst._id || i} style={{ marginBottom: "12px" }}>
                  <Field label={`Installer Name (${i + 1})`} value={inst.name || inst.staffName} />
                  <Field label="Email" value={inst.email} />
                  <Field label="Phone" value={inst.phoneNo || inst.phone} />
                  <Field label="Area" value={inst.area} />
                </div>
              ))
            ) : (
              <Field label="Installation By" value="-" />
            )}
            <Field label="Serial No" value={g.serialNo} />
            <Field label="SBT No" value={g.stbNo} />
            <Field label="Mac Id" value={g.macId} />
            <Field label="Circuit ID" value={g.circuitId} />
            <Field label="Remark" value={add.description} />
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ width: "48%", minWidth: "300px" }}>
            <Field label="Customer Type" value="Individual" />
            <Field label="Mobile" value={g.phone} />
            <Field label="Server Type" value="IPACT" />
            <Field label="PPPOE Password" value={g.plainPassword || "-"} />
            <Field label="Service Opted" value={g.serviceOpted?.toUpperCase()} />
          </div>
        </div>
      </div>

      {/* ADDRESS DETAILS */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>ADDRESS DETAILS</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
          <div style={{ flex: 1, minWidth: "350px" }}>
            <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
              Billing Address
            </strong>
            <Field label="Address Line 1" value={a.billingAddress?.addressine1} />
            <Field label="Address Line 2" value={a.billingAddress?.addressine2} />
            <Field label="City" value={a.billingAddress?.city} />
            <Field label="State" value={a.billingAddress?.state} />
            <Field label="Pincode" value={a.billingAddress?.pincode} />
          </div>

          <div style={{ flex: 1, minWidth: "350px" }}>
            <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
              Installation Address
            </strong>
            <Field label="Address Line 1" value={a.installationAddress?.addressine1} />
            <Field label="Address Line 2" value={a.installationAddress?.addressine2} />
            <Field label="City" value={a.installationAddress?.city} />
            <Field label="State" value={a.installationAddress?.state} />
            <Field label="Pincode" value={a.installationAddress?.pincode} />
          </div>

          <div style={{ flex: 1, minWidth: "350px" }}>
            <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
              Permanent Address
            </strong>
            <Field label="Address Line 1" value={a.permanentAddress?.addressine1} />
            <Field label="Address Line 2" value={a.permanentAddress?.addressine2} />
            <Field label="City" value={a.permanentAddress?.city} />
            <Field label="State" value={a.permanentAddress?.state} />
            <Field label="Pincode" value={a.permanentAddress?.pincode} />
          </div>
        </div>
      </div>

      {/* AREA */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>AREA</h2>
        </div>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Field label="Zone Name" value={area.zoneName || "Not Assigned"} />
          <Field label="Created By" value={area.createdBy || "-"} />
        </div>
      </div>

      {/* DOCUMENTS - OLD STYLE UI + MULTIPLE IMAGES SUPPORT */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{
          background: "#f3f3f3",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>DOCUMENTS</h2>
        </div>

        {docs.length === 0 ? (
          <p style={{
            color: "#777",
            fontStyle: "italic",
            textAlign: "center",
            padding: "40px 0",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            No documents uploaded
          </p>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            gap: "30px"
          }}>
            {docs.map((doc, docIndex) => {
              // Normalize documentImage → always array
              const images = Array.isArray(doc.documentImage)
                ? doc.documentImage
                : doc.documentImage
                ? [doc.documentImage]
                : [];

              return images.length > 0 ? images.map((imgPath, imgIndex) => {
                const cleanPath = imgPath.replace(/\\/g, "/").replace(/^public\//, "");
                const url = BASE_FILE_URL + cleanPath;
                const fileName = cleanPath.split("/").pop() || `document-${imgIndex + 1}`;
                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);
                const displayType = images.length > 1 
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
              }) : null;
            }).filter(Boolean)}
          </div>
        )}
      </div>

      {/* ADDITIONAL INFORMATION */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>ADDITIONAL INFORMATION</h2>
        </div>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Field label="E-KYC" value={add.ekyc === "yes" ? "Completed" : "Pending"} />
          <Field label="Notification" value={add.notification ? "Enabled" : "Disabled"} />
          <Field label="Add Plan Allowed" value={add.addPlan ? "Yes" : "No"} />
          <Field label="Wallet Balance" value={`₹${u.walletBalance || 0}`} />
          <Field label="Creadit balance" value={`₹${u.creditBalance || 0}`}/>
          <Field label="Account Status" value={u.status} />
          <Field label="Account Created" value={new Date(u.createdAt).toLocaleString("en-GB")} />
        </div>
      </div>
    </div>
  );
};

// Reusable Field Component
const Field = ({ label, value }) => (
  <p style={{ margin: "10px 0", fontSize: "15px" }}>
    <strong style={{ fontWeight: 500, minWidth: "200px", display: "inline-block", color: "#333" }}>
      {label}
    </strong> :{" "}
    <span style={{ fontWeight: 400, color: "#555" }}>
      {value || "-"}
    </span>
  </p>
);

// Document Item with Preview & Download (Old Style)
const DocItem = ({ docType, url, fileName, isImage, downloadFile, downloading, downloaded }) => {
  return (
    <div style={{
      marginBottom: 16,
      flex: "1 1 45%",
      minWidth: "300px",
      display: "flex",
      alignItems: "center",
      background: "#fff",
      padding: "12px",
      borderRadius: "8px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
    }}>
      <strong style={{ minWidth: 150, display: "inline-block", color: "#333" }}>
        {docType}
      </strong>

      {isImage ? (
        <img
          src={url}
          alt={docType}
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            marginLeft: 10,
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          onClick={() => window.open(url, "_blank")}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.onerror = null;
            if (e.target.nextSibling) e.target.nextSibling.style.display = "inline";
          }}
        />
      ) : (
        <span style={{ marginLeft: 10, color: "#777" }}>Preview not available</span>
      )}

      <button
        onClick={() => downloadFile(url, fileName)}
        disabled={downloading === fileName}
        style={{
          marginLeft: 12,
          background: "none",
          border: "none",
          cursor: downloading === fileName ? "not-allowed" : "pointer",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
        }}
        title="Download"
      >
        <FaDownload size={18} />
        {downloading === fileName && <span style={{ marginLeft: 5, fontSize: 12 }}>Downloading...</span>}
        {downloaded === fileName && <span style={{ marginLeft: 5, fontSize: 12, color: "green" }}>Downloaded!</span>}
      </button>
    </div>
  );
};

export default UserProfile;