const UserProfile = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      {/* Heading Box */}
      <div
        style={{
          background: "#f3f3f3",
          padding: "10px 15px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "0.5px",
          }}
        >
          CUSTOMER DETAILS
        </h2>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>

        {/* LEFT COLUMN */}
        <div style={{ width: "45%" }}>
          <p><strong style={{ fontWeight: "500" }}>IP Address</strong> : <span style={{ fontWeight: "400" }}>10.20.254.224</span></p>
          <p><strong style={{ fontWeight: "500" }}>S/o</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Alternate Mobile</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Email</strong> : <span style={{ fontWeight: "400" }}>AAMIRCH523600-@GMAIL.COM</span></p>
          <p><strong style={{ fontWeight: "500" }}>Date Of Birth</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>GST No.</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Purchase Order No</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Connection Type</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>IPACCT Id</strong> : <span style={{ fontWeight: "400" }}>5691001024</span></p>
          <p><strong style={{ fontWeight: "500" }}>Installation By</strong> : <span style={{ fontWeight: "400" }}>BHANU</span></p>
          <p><strong style={{ fontWeight: "500" }}>Serial No</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Jaze User Id</strong> : <span style={{ fontWeight: "400" }}>0</span></p>
          <p><strong style={{ fontWeight: "500" }}>SBT No</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Mac Id</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Prorata billing</strong> : <span style={{ fontWeight: "400" }}>No</span></p>
          <p><strong style={{ fontWeight: "500" }}>A End</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Circuit ID</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Remark</strong> : </p>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: "45%" }}>
          <p><strong style={{ fontWeight: "500" }}>Customer Type</strong> : <span style={{ fontWeight: "400" }}>Individual</span></p>
          <p><strong style={{ fontWeight: "500" }}>Mobile</strong> : <span style={{ fontWeight: "400" }}>9870389722</span></p>
          <p><strong style={{ fontWeight: "500" }}>Telephone</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Gender</strong> : <span style={{ fontWeight: "400" }}>Male</span></p>
          <p><strong style={{ fontWeight: "500" }}>Due Days</strong> : <span style={{ fontWeight: "400" }}>1</span></p>
          <p><strong style={{ fontWeight: "500" }}>Pancard</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Registration Date</strong> : <span style={{ fontWeight: "400" }}>24-11-2025</span></p>
          <p><strong style={{ fontWeight: "500" }}>Sales Executive</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Server Type</strong> : <span style={{ fontWeight: "400" }}>IPACT</span></p>
          <p><strong style={{ fontWeight: "500" }}>PPPOE Password</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Url</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>Service Opted</strong> : <span style={{ fontWeight: "400" }}>Broadband</span></p>
          <p><strong style={{ fontWeight: "500" }}>VC No.</strong> : </p>
          <p><strong style={{ fontWeight: "500" }}>B End</strong> : </p>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
