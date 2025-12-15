// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserFullDetails } from "../../service/user"; // your service path
// import ProtectedAction from "../../components/ProtectedAction";

// const UserProfile = () => {
//   const { id } = useParams(); // Get user ID from URL
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!id) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await getUserFullDetails(id);
//         if (res.status) {
//           setData(res);
//         } else {
//           console.error("API Error:", res.message);
//         }
//       } catch (err) {
//         console.error("Fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   if (loading) {
//     return (
//       <div style={{ padding: "60px", textAlign: "center", fontSize: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
//         Loading User Profile...
//       </div>
//     );
//   }

//   if (!data?.userDetails) {
//     return (
//       <div style={{ padding: "60px", textAlign: "center", color: "red", fontSize: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
//         User Not Found!
//       </div>
//     );
//   }

//   const u = data.userDetails;
//   const g = u.generalInformation || {};
//   const a = u.addressDetails || {};
//   const add = u.additionalInformation || {};
//   const area = a.area || {};
//   const docs = u.document || [];

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>

//       {/* CUSTOMER DETAILS */}
//       <div style={{ marginBottom: "40px" }}>
//         <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
//           <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "0.5px" }}>
//             CUSTOMER DETAILS
//           </h2>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
//           {/* LEFT COLUMN */}
//           <div style={{ width: "48%", minWidth: "300px" }}>
//             <Field label="IP Address" value={g.ipAdress} />
//             <Field label="Alternate Mobile" value={g.alternatePhone} />
//             <Field label="Email" value={g.email} />
//             <Field label="Date Of Birth" value={add.dob ? formatDate(add.dob) : ""} />
//             <Field label="Connection Type" value={g.connectionType} />
//             <Field label="IPACCT Id" value={g.ipactId} />
//             {/* <Field label="Installation By" value={g.installationBy || "-"} /> */}
//             <Field label="InstallationByName" value={g.installationByName || "-"} />
//             {g.installationBy?.length > 0 ? (
//               g.installationBy.map((inst, i) => (
//                 <div key={inst._id || i} style={{ marginBottom: "12px" }}>
//                   <Field label={`Installer Name (${i + 1})`} value={inst.name} />
//                   <Field label="Email" value={inst.email} />
//                   <Field label="Phone" value={inst.phoneNo} />
//                   <Field label="Area" value={inst.area} />
//                   <Field label="Staff Name" value={inst.staffName} />
//                 </div>
//               ))
//             ) : (
//               <Field label="Installation By" value="-" />
//             )}
//             <Field label="Serial No" value={g.serialNo} />
//             <Field label="SBT No" value={g.stbNo} />
//             <Field label="Mac Id" value={g.macId} />
//             <Field label="Circuit ID" value={g.circuitId} />
//             <Field label="Remark" value={add.description} />
//           </div>

//           {/* RIGHT COLUMN */}
//           <div style={{ width: "48%", minWidth: "300px" }}>
//             <Field label="Customer Type" value="Individual" />
//             <Field label="Mobile" value={g.phone} />
//             <Field label="Server Type" value="IPACT" />
//             <Field label="PPPOE Password" value={g.plainPassword || "-"} />
//             <Field label="Service Opted" value={g.serviceOpted?.toUpperCase()} />
//           </div>
//         </div>
//       </div>

//       {/* ==================== ADDRESS DETAILS ==================== */}
//       <div style={{ marginBottom: "40px" }}>
//         <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
//           <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>ADDRESS DETAILS</h2>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>

//           {/* LEFT: Billing Address */}
//           <div style={{ flex: 1, minWidth: "350px" }}>
//             <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
//               Billing Address
//             </strong>
//             <Field label="Address Line 1" value={a.billingAddress?.addressine1} />
//             <Field label="Address Line 2" value={a.billingAddress?.addressine2} />
//             <Field label="City" value={a.billingAddress?.city} />
//             <Field label="State" value={a.billingAddress?.state} />
//             <Field label="Pincode" value={a.billingAddress?.pincode} />
//           </div>

//           {/* RIGHT: Installation Address */}
//           <div style={{ flex: 1, minWidth: "350px" }}>
//             <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
//               Installation Address
//             </strong>
//             <Field label="Address Line 1" value={a.installationAddress?.addressine1} />
//             <Field label="Address Line 2" value={a.installationAddress?.addressine2} />
//             <Field label="City" value={a.installationAddress?.city} />
//             <Field label="State" value={a.installationAddress?.state} />
//             <Field label="Pincode" value={a.installationAddress?.pincode} />
//           </div>

//            <div style={{ flex: 1, minWidth: "350px" }}>
//             <strong style={{ color: "#1976d2", fontSize: "17px", display: "block", marginBottom: "12px" }}>
//               Permanant Address
//             </strong>
//             <Field label="Address Line 1" value={a.permanentAddress?.addressine1} />
//             <Field label="Address Line 2" value={a.permanentAddress?.addressine2} />
//             <Field label="City" value={a.permanentAddress?.city} />
//             <Field label="State" value={a.permanentAddress?.state} />
//             <Field label="Pincode" value={a.permanentAddress?.pincode} />
//           </div>

//         </div>
//       </div>

//       {/* AREA */}
//       <div style={{ marginBottom: "40px" }}>
//         <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
//           <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>AREA</h2>
//         </div>
//         <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//           <Field label="Zone Name" value={area.zoneName || "Not Assigned"} />
//           <Field label="Created By" value={area.createdBy || "-"} />
//         </div>
//       </div>

//       {/* ==================== DOCUMENTS ==================== */}
//       <div style={{ marginBottom: "40px" }}>
//         <div style={{
//           background: "#f3f3f3",
//           padding: "12px 20px",
//           borderRadius: "8px",
//           marginBottom: "20px"
//         }}>
//           <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>DOCUMENTS</h2>
//         </div>

//         {/* Same 2-column layout as Customer Details & Address */}
//         <div style={{
//           display: "flex",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: "30px"
//         }}>

//           {/* LEFT COLUMN */}
//           <div style={{ flex: 1, minWidth: "300px" }}>
//             {docs.length > 0 ? (
//               docs.slice(0, Math.ceil(docs.length / 2)).map((doc) => (
//                 <Field
//                   key={doc._id}
//                   label={doc.documentType}
//                   value="Uploaded"
//                 />
//               ))
//             ) : null}
//           </div>

//           {/* RIGHT COLUMN */}
//           <div style={{ flex: 1, minWidth: "300px" }}>
//             {docs.length > 0 ? (
//               docs.slice(Math.ceil(docs.length / 2)).map((doc) => (
//                 <Field
//                   key={doc._id}
//                   label={doc.documentType}
//                   value="Uploaded"
//                 />
//               ))
//             ) : (
//               <p style={{
//                 color: "#777",
//                 fontStyle: "italic",
//                 textAlign: "center",
//                 padding: "20px 0",
//                 gridColumn: "1 / -1"
//               }}>
//                 No documents uploaded
//               </p>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* ADDITIONAL INFORMATION */}
//       <div style={{ marginBottom: "40px" }}>
//         <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
//           <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>ADDITIONAL INFORMATION</h2>
//         </div>
//         <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//           <Field label="E-KYC" value={add.ekyc === "yes" ? "Completed" : "Pending"} />
//           <Field label="Notification" value={add.notification ? "Enabled" : "Disabled"} />
//           <Field label="Add Plan Allowed" value={add.addPlan ? "Yes" : "No"} />
//           <Field label="Wallet Balance" value={`₹${u.walletBalance || 0}`} />
//           <Field label="Account Status" value={u.status} />
//           <Field label="Account Created" value={new Date(u.createdAt).toLocaleString("en-GB")} />
//         </div>
//       </div>

//     </div>
//   );
// };

// // Reusable Field (exact same style as your old component)
// const Field = ({ label, value }) => (
//   <p style={{ margin: "10px 0", fontSize: "15px" }}>
//     <strong style={{ fontWeight: 500, minWidth: "200px", display: "inline-block", color: "#333" }}>
//       {label}
//     </strong> :{" "}
//     <span style={{ fontWeight: 400, color: "#555" }}>
//       {value || ""}
//     </span>
//   </p>
// );

// export default UserProfile;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user";
import { FaDownload } from "react-icons/fa";

const BASE_FILE_URL = "http://localhost:5004/uploads/"; // Ensure this matches your backend static folder

const UserProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null); // Track which file is downloading

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return setLoading(false);
      try {
        const res = await getUserFullDetails(id);
        if (res.status) setData(res);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        Loading User Profile...
      </div>
    );
  if (!data?.userDetails)
    return (
      <div style={{ padding: 60, textAlign: "center", color: "red" }}>
        User Not Found!
      </div>
    );

  const docs = data.userDetails.document || [];

  // Download file with loader
  const downloadFile = async (url, filename) => {
    try {
      setDownloading(filename);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Check server or file path.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div style={{ padding: 20, background: "#f9f9f9", minHeight: "100vh" }}>
      {/* ================= DOCUMENTS ================= */}
      <Section title="DOCUMENTS">
        <TwoCol>
          {docs.map((doc) => (
            <DocItem
              key={doc._id}
              doc={doc}
              downloadFile={downloadFile}
              downloading={downloading}
            />
          ))}
        </TwoCol>
      </Section>
    </div>
  );
};

/* ================= DOCUMENT ITEM ================= */
const DocItem = ({ doc, downloadFile, downloading }) => {
  const url = BASE_FILE_URL + doc.documentImage;
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(doc.documentImage);

  return (
    <div
      style={{
        marginBottom: 16,
        flex: "1 1 45%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <strong style={{ minWidth: 150, display: "inline-block" }}>
        {doc.documentType}
      </strong>

      {isImage ? (
        <img
          src={url}
          alt={doc.documentType}
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
        />
      ) : (
        <span style={{ marginLeft: 10 }}>Preview not available</span>
      )}

      <button
        onClick={() => downloadFile(url, doc.documentImage)}
        style={{
          marginLeft: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
        }}
        title="Download"
        disabled={downloading === doc.documentImage}
      >
        <FaDownload size={18} />
        {downloading === doc.documentImage && (
          <span style={{ marginLeft: 5, fontSize: 12 }}>Downloading...</span>
        )}
      </button>
    </div>
  );
};

/* ================= UI HELPERS ================= */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <div
      style={{
        background: "#f3f3f3",
        padding: "12px 20px",
        borderRadius: 8,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{title}</h2>
    </div>
    <div style={{ marginTop: 20 }}>{children}</div>
  </div>
);

const TwoCol = ({ children }) => (
  <div
    style={{
      display: "flex",
      gap: 30,
      flexWrap: "wrap",
      justifyContent: "flex-start",
    }}
  >
    {children}
  </div>
);

export default UserProfile;
