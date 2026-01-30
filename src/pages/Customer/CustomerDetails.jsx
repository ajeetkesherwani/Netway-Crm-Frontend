// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getUserDetails } from "../../service/user";
// import { FaLongArrowAltLeft } from "react-icons/fa";
// import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
// import CustomerPurchasePlanList from "./CustomerPurchasePlans/CustomerPurchasePlanList";
// const BASE_URL = import.meta.env.VITE_BASE_URL;

// export default function UserDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [purchasePlans, setPurchasePlans] = useState([]);
//   const [isPurchasePlansOpen, setIsPurchasePlansOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await getUserDetails(id);
//         console.log("API Response:", res); // Debug API response
//         if (res.status && res.data && res.data.user) {
//           setUser(res.data.user);
//           setPurchasePlans(res.data.purchasePlans || []);
//         } else {
//           setError("User data not found in response");
//         }
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//         setError("Failed to load user details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUser();
//   }, [id]);

//   useEffect(() => {
//     if (user) {
//       console.log("📌 User state updated:", user);
//     }
//   }, [user]);

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   if (!user) return <p className="p-4">User not found</p>;

//   const Row = ({ label, value }) => {
//     let displayValue = "—";

//     // Check if the value is an object and not an array
//     if (value !== undefined && value !== null && value !== "") {
//       if (typeof value === "object" && !Array.isArray(value)) {
//         // Handle nested object properties more safely
//         // Assuming you want to display a specific key if it's an object
//         if (value.name) {
//           displayValue = value.name;
//         } else if (value.staffName) {
//           displayValue = value.staffName;
//         } else if (value.resellerName) {
//           displayValue = value.resellerName;
//         } else if (value.lcoName) {
//           displayValue = value.lcoName;
//         } else if (value.roleName) {
//           displayValue = value.roleName;
//         } else if (value.username) {
//           displayValue = value.username;
//         } else {
//           // For general case: Convert object to string if it's a deeply nested one
//           displayValue = JSON.stringify(value);
//         }
//       } else {
//         displayValue = value.toString();  // This should work for strings or numbers
//       }
//     }

//     return (
//       <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
//         <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
//         <div className="w-2/3 p-[2px]">{displayValue}</div>
//       </div>
//     );
//   };


//   const { generalInformation, networkInformation, additionalInformation, document, _id, status, createdAt, updatedAt, walletBalance } = user;

//   return (
//     <>
//       <div className="p-4 max-w-7xl mx-auto flex gap-2 items-center -mt-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//         >
//           <span className="flex items-center">
//             <FaLongArrowAltLeft className="mr-2" /> Back
//           </span>
//         </button>
//         <h3 className="text-2xl font-semibold">User Details</h3>
//       </div>

//       {/* General Information */}
//       <div className="border rounded-lg overflow-hidden shadow mb-4">
//         <h4 className="text-lg font-semibold p-2 bg-gray-200">General Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="Title" value={generalInformation?.Title || generalInformation?.title} />
//           <Row label="Name" value={generalInformation?.name} />
//           <Row label="Username" value={generalInformation?.username} />
//           <Row label="Email" value={generalInformation?.email} />
//           <Row label="Phone" value={generalInformation?.phone} />
//           <Row label="Telephone" value={generalInformation?.telephone} />
//           <Row label="CAF No" value={generalInformation?.cafNo} />
//           <Row label="GST" value={generalInformation?.gst} />
//           <Row label="Aadhar No" value={generalInformation?.adharNo} />
//           <Row label="Address" value={generalInformation?.address} />
//           <Row label="Pincode" value={generalInformation?.pincode} />
//           <Row label="State" value={generalInformation?.state} />
//           <Row label="Country" value={generalInformation?.country} />
//           <Row label="District" value={generalInformation?.district} />
//           <Row label="Role" value={generalInformation?.roleId?.roleName} />
//           <Row label="Retailer" value={generalInformation?.retailerId?.resellerName || (typeof generalInformation?.retailerId === 'string' ? generalInformation?.retailerId : "")} />
//           <Row label="LCO" value={generalInformation?.lcoId?.lcoName || (typeof generalInformation?.lcoId === 'string' ? generalInformation?.lcoId : "")} />
//           <Row label="Payment Method" value={generalInformation?.paymentMethod} />
//         </div>
//       </div>
//       {/* Network Information */}
//       <div className="border rounded-lg overflow-hidden shadow mb-4">
//         <h4 className="text-lg font-semibold p-2 bg-gray-200">Network Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="NAS" value={networkInformation?.statisIp?.nas?.length > 0 ? networkInformation.statisIp.nas.join(", ") : "—"} />
//           <Row label="Category" value={networkInformation?.statisIp?.category} />
//           <Row label="Network Type" value={networkInformation?.networkType} />
//           <Row label="IP Type" value={networkInformation?.ipType} />
//           <Row label="Dynamic IP Pool" value={networkInformation?.dynamicIpPool} />
//         </div>
//       </div>
//       {/* Additional Information */}
//       <div className="border rounded-lg overflow-hidden shadow mb-4">
//         <h4 className="text-lg font-semibold p-2 bg-gray-200">Additional Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="Date of Birth" value={additionalInformation?.dob} />
//           <Row label="Description" value={additionalInformation?.description} />
//           <Row label="Notification" value={additionalInformation?.notification ? "Yes" : "No"} />
//           <Row label="Add Plan" value={additionalInformation?.addPlan ? "Yes" : "No"} />
//           <Row label="Add Charges" value={additionalInformation?.addCharges ? "Yes" : "No"} />
//         </div>
//       </div>
//       {/* Document */}
//       <div className="border rounded-lg overflow-hidden shadow mb-4">
//         <h4 className="text-lg font-semibold p-2 bg-gray-200">Document</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="Document Type" value={document?.documentType} />
//           <Row label="Document Details" value={document?.documentDetails} />
//         </div>
//       </div>
//       {/* System Info */}
//       <div className="border rounded-lg overflow-hidden shadow mb-4">
//         <h4 className="text-lg font-semibold p-2 bg-gray-200">System Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="User ID" value={_id} />
//           <Row label="Status" value={status} />
//           <Row label="Wallet Balance" value={walletBalance} />
//           <Row label="Created At" value={new Date(createdAt).toLocaleString()} />
//           <Row label="Updated At" value={new Date(updatedAt).toLocaleString()} />
//         </div>
//       </div>
//       {/* Purchase Plans */}
//       <div className="flex justify-between mt-1 ">
//         <div>Purchase Plans</div>
//         <div
//           className="cursor-pointer flex items-center gap-1"
//           onClick={() => setIsPurchasePlansOpen(!isPurchasePlansOpen)}
//         >
//           {isPurchasePlansOpen ? (
//             <MdKeyboardDoubleArrowUp size={20} />
//           ) : (
//             <MdKeyboardDoubleArrowDown size={20} />
//           )}
//         </div>
//       </div>
//       {isPurchasePlansOpen && <CustomerPurchasePlanList />}
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../service/user";
import { FaLongArrowAltLeft, FaDownload } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import CustomerPurchasePlanList from "./CustomerPurchasePlans/CustomerPurchasePlanList";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_FILE_URL = `${BASE_URL}/`; // e.g. http://localhost:5004/ or your production URL

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [purchasePlans, setPurchasePlans] = useState([]);
  const [isPurchasePlansOpen, setIsPurchasePlansOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserDetails(id);
        if (res.status && res.data?.user) {
          setUser(res.data.user);
          setPurchasePlans(res.data.purchasePlans || []);
        } else {
          setError("User data not found in response");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">User not found</p>;

  const hasValue = (val) =>
    val !== undefined &&
    val !== null &&
    val !== "" &&
    !(Array.isArray(val) && val.length === 0) &&
    !(typeof val === "object" && Object.keys(val).length === 0);

  const Row = ({ label, value }) => {
    if (!hasValue(value)) return null;

    let display = "—";

    if (typeof value === "boolean") {
      display = value ? "Yes" : "No";
    } else if (typeof value === "object" && !Array.isArray(value)) {
      if (value.name) display = value.name;
      else if (value.staffName) display = value.staffName;
      else if (value.resellerName) display = value.resellerName;
      else if (value.lcoName) display = value.lcoName;
      else if (value.roleName) display = value.roleName;
      else if (value.username) display = value.username;
      else if (value.zoneName) display = value.zoneName;
      else display = JSON.stringify(value);
    } else {
      display = String(value);
    }

    return (
      <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
        <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
        <div className="w-2/3 p-[2px]">{display}</div>
      </div>
    );
  };

  const g = user.generalInformation || {};
  const a = user.addressDetails || {};
  const add = user.additionalInformation || {};
  const docs = user.document || [];
  const area = a.area || {};

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "");

  const cleanImagePath = (path) => {
    if (!path) return "";
    return path.replace(/\\/g, "/").replace(/^public\//, "");
  };

  const getFullImageUrl = (path) => {
    const clean = cleanImagePath(path);
    return clean ? `${BASE_FILE_URL}${clean}` : "";
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Could not download file");
    }
  };

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto flex gap-2 items-center -mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          <span className="flex items-center">
            <FaLongArrowAltLeft className="mr-2" /> Back
          </span>
        </button>
        <h3 className="text-2xl font-semibold">User Details</h3>
      </div>

      {/* General Information */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">General Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Title" value={g.title || g.Title} />
          <Row label="Name" value={g.name} />
          <Row label="Billing Name" value={g.billingName} />
          <Row label="Username" value={g.username} />
          <Row label="Email" value={g.email} />
          <Row label="Phone" value={g.phone} />
          <Row label="Alternate Phone" value={g.alternatePhone} />
          <Row label="IP Address" value={g.ipAdress} />
          <Row label="IPACT ID" value={g.ipactId} />
          <Row label="Connection Type" value={g.connectionType} />
          <Row label="Service Opted" value={g.serviceOpted} />
          <Row label="Serial No" value={g.serialNo} />
          <Row label="MAC ID" value={g.macId} />
          <Row label="STB No" value={g.stbNo} />
          <Row label="VC No" value={g.vcNo} />
          <Row label="Circuit ID" value={g.circuitId} />
          <Row label="CAF No" value={g.cafNo} />
          <Row label="GST" value={g.gst} />
          <Row label="Aadhar No" value={g.adharNo} />
          <Row label="Payment Method" value={g.paymentMethod} />

          {/* Installation By – multiple */}
          {Array.isArray(g.installationBy) && g.installationBy.length > 0 && (
            <>
              <div className="col-span-2 border-b p-2 font-medium bg-gray-50">Installation By</div>
              {g.installationBy.map((inst, idx) => (
                <div key={inst._id || idx} className="col-span-2 grid grid-cols-1 md:grid-cols-2 border-b last:border-b-0">
                  <Row label={`Installer ${idx + 1} Name`} value={inst.name || inst.staffName} />
                  <Row label="Email" value={inst.email} />
                  <Row label="Phone" value={inst.phoneNo || inst.phone} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Address Details</h4>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing */}
          <div>
            <h5 className="font-semibold mb-2 text-blue-700">Billing Address</h5>
            <div className="space-y-1 text-sm">
              <div>{a.billingAddress?.addressine1 || a.billingAddress?.addressLine1}</div>
              <div>{a.billingAddress?.addressine2 || a.billingAddress?.addressLine2}</div>
              <div>
                {a.billingAddress?.city}
                {a.billingAddress?.city && a.billingAddress?.state ? ", " : ""}
                {a.billingAddress?.state}
              </div>
              <div>Pincode: {a.billingAddress?.pincode}</div>
            </div>
          </div>

          {/* Installation */}
          <div>
            <h5 className="font-semibold mb-2 text-blue-700">Installation Address</h5>
            <div className="space-y-1 text-sm">
              <div>{a.installationAddress?.addressine1 || a.installationAddress?.addressLine1}</div>
              <div>{a.installationAddress?.addressine2 || a.installationAddress?.addressLine2}</div>
              <div>
                {a.installationAddress?.city}
                {a.installationAddress?.city && a.installationAddress?.state ? ", " : ""}
                {a.installationAddress?.state}
              </div>
              <div>Pincode: {a.installationAddress?.pincode}</div>
            </div>
          </div>

          {/* Permanent */}
          <div>
            <h5 className="font-semibold mb-2 text-blue-700">Permanent Address</h5>
            <div className="space-y-1 text-sm">
              <div>{a.permanentAddress?.addressine1 || a.permanentAddress?.addressLine1}</div>
              <div>{a.permanentAddress?.addressine2 || a.permanentAddress?.addressLine2}</div>
              <div>
                {a.permanentAddress?.city}
                {a.permanentAddress?.city && a.permanentAddress?.state ? ", " : ""}
                {a.permanentAddress?.state}
              </div>
              <div>Pincode: {a.permanentAddress?.pincode}</div>
            </div>
          </div>
        </div>

        {/* Area / Zone */}
        {hasValue(area.zoneName) && (
          <div className="p-4 border-t">
            <Row label="Zone / Area" value={area.zoneName} />
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Date of Birth" value={add.dob ? new Date(add.dob).toLocaleDateString() : ""} />
          <Row label="Description / Remark" value={add.description} />
          <Row label="E-KYC" value={add.ekyc === "yes" ? "Completed" : add.ekyc === "no" ? "Pending" : add.ekyc} />
          <Row label="Notification" value={add.notification} />
          <Row label="Add Plan Allowed" value={add.addPlan} />
          <Row label="Add Charges Allowed" value={add.addCharges} />
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Documents</h4>

        {docs.length === 0 ? (
          <p className="p-6 text-center text-gray-500 italic">No documents uploaded</p>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => {
              const images = Array.isArray(doc.documentImage)
                ? doc.documentImage
                : doc.documentImage
                ? [doc.documentImage]
                : [];

              return images.map((imgPath, idx) => {
                const url = getFullImageUrl(imgPath);
                const filename = imgPath.split(/[\\/]/).pop() || `document-${idx + 1}`;
                const isImage = /\.(jpe?g|png|gif|webp|bmp)$/i.test(filename);

                return (
                  <div
                    key={`${doc._id}-${idx}`}
                    className="border rounded p-3 bg-white shadow-sm hover:shadow"
                  >
                    <div className="font-medium mb-2">{doc.documentType}</div>

                    {isImage && url ? (
                      <img
                        src={url}
                        alt={doc.documentType}
                        className="w-full h-40 object-cover rounded mb-3 cursor-pointer border"
                        onClick={() => window.open(url, "_blank")}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg"; // fallback
                        }}
                      />
                    ) : (
                      <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                        Preview not available
                      </div>
                    )}

                    <button
                      onClick={() => downloadFile(url, filename)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FaDownload size={14} />
                      Download
                    </button>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">System Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="User ID" value={user._id} />
          <Row label="Status" value={user.status} />
          <Row label="Wallet Balance" value={user.walletBalance} />
          <Row label="Credit Balance" value={user.creditBalance} />
          <Row label="Created At" value={formatDate(user.createdAt)} />
          <Row label="Updated At" value={formatDate(user.updatedAt)} />
        </div>
      </div>
    </>
  );
}