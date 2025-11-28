// const UserProfile = () => {
//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>

//       {/* Heading Box */}
//       <div
//         style={{
//           background: "#f3f3f3",
//           padding: "10px 15px",
//           borderRadius: "6px",
//           marginBottom: "20px",
//         }}
//       >
//         <h2
//           style={{
//             margin: 0,
//             fontSize: "22px",
//             fontWeight: "800",
//             letterSpacing: "0.5px",
//           }}
//         >
//           CUSTOMER DETAILS
//         </h2>
//       </div>

//       <div style={{ display: "flex", justifyContent: "space-between" }}>

//         {/* LEFT COLUMN */}
//         <div style={{ width: "45%" }}>
//           <p><strong style={{ fontWeight: "500" }}>IP Address</strong> : <span style={{ fontWeight: "400" }}>10.20.254.224</span></p>
//           <p><strong style={{ fontWeight: "500" }}>S/o</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Alternate Mobile</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Email</strong> : <span style={{ fontWeight: "400" }}>AAMIRCH523600-@GMAIL.COM</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Date Of Birth</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>GST No.</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Purchase Order No</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Connection Type</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>IPACCT Id</strong> : <span style={{ fontWeight: "400" }}>5691001024</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Installation By</strong> : <span style={{ fontWeight: "400" }}>BHANU</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Serial No</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Jaze User Id</strong> : <span style={{ fontWeight: "400" }}>0</span></p>
//           <p><strong style={{ fontWeight: "500" }}>SBT No</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Mac Id</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Prorata billing</strong> : <span style={{ fontWeight: "400" }}>No</span></p>
//           <p><strong style={{ fontWeight: "500" }}>A End</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Circuit ID</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Remark</strong> : </p>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div style={{ width: "45%" }}>
//           <p><strong style={{ fontWeight: "500" }}>Customer Type</strong> : <span style={{ fontWeight: "400" }}>Individual</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Mobile</strong> : <span style={{ fontWeight: "400" }}>9870389722</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Telephone</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Gender</strong> : <span style={{ fontWeight: "400" }}>Male</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Due Days</strong> : <span style={{ fontWeight: "400" }}>1</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Pancard</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Registration Date</strong> : <span style={{ fontWeight: "400" }}>24-11-2025</span></p>
//           <p><strong style={{ fontWeight: "500" }}>Sales Executive</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Server Type</strong> : <span style={{ fontWeight: "400" }}>IPACT</span></p>
//           <p><strong style={{ fontWeight: "500" }}>PPPOE Password</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Url</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>Service Opted</strong> : <span style={{ fontWeight: "400" }}>Broadband</span></p>
//           <p><strong style={{ fontWeight: "500" }}>VC No.</strong> : </p>
//           <p><strong style={{ fontWeight: "500" }}>B End</strong> : </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserProfile;

// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserFullDetails } from "../../service/user"; // your service path

const UserProfile = () => {
  const { id } = useParams(); // Get user ID from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <Field label="Installation By" value={g.installationBy || "-"} />
            <Field label="InstallationByName" value={g.installationByName || "-"} />
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

      {/* ==================== ADDRESS DETAILS ==================== */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ background: "#f3f3f3", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>ADDRESS DETAILS</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>

          {/* LEFT: Billing Address */}
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

          {/* RIGHT: Installation Address */}
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

      {/* ==================== DOCUMENTS ==================== */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{
          background: "#f3f3f3",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>DOCUMENTS</h2>
        </div>

        {/* Same 2-column layout as Customer Details & Address */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px"
        }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            {docs.length > 0 ? (
              docs.slice(0, Math.ceil(docs.length / 2)).map((doc) => (
                <Field
                  key={doc._id}
                  label={doc.documentType}
                  value="Uploaded"
                />
              ))
            ) : null}
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            {docs.length > 0 ? (
              docs.slice(Math.ceil(docs.length / 2)).map((doc) => (
                <Field
                  key={doc._id}
                  label={doc.documentType}
                  value="Uploaded"
                />
              ))
            ) : (
              <p style={{
                color: "#777",
                fontStyle: "italic",
                textAlign: "center",
                padding: "20px 0",
                gridColumn: "1 / -1"
              }}>
                No documents uploaded
              </p>
            )}
          </div>

        </div>
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
          <Field label="Account Status" value={u.status} />
          <Field label="Account Created" value={new Date(u.createdAt).toLocaleString("en-GB")} />
        </div>
      </div>

    </div>
  );
};

// Reusable Field (exact same style as your old component)
const Field = ({ label, value }) => (
  <p style={{ margin: "10px 0", fontSize: "15px" }}>
    <strong style={{ fontWeight: 500, minWidth: "200px", display: "inline-block", color: "#333" }}>
      {label}
    </strong> :{" "}
    <span style={{ fontWeight: 400, color: "#555" }}>
      {value || ""}
    </span>
  </p>
);

export default UserProfile;