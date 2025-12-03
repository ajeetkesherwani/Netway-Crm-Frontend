import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../service/user";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import CustomerPurchasePlanList from "./CustomerPurchasePlans/CustomerPurchasePlanList";
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        console.log("API Response:", res); // Debug API response
        if (res.status && res.data && res.data.user) {
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

  useEffect(() => {
    if (user) {
      console.log("📌 User state updated:", user);
    }
  }, [user]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">User not found</p>;

  const Row = ({ label, value }) => {
    let displayValue = "—";

    // Check if the value is an object and not an array
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object" && !Array.isArray(value)) {
        // Handle nested object properties more safely
        // Assuming you want to display a specific key if it's an object
        if (value.name) {
          displayValue = value.name;
        } else if (value.staffName) {
          displayValue = value.staffName;
        } else if (value.resellerName) {
          displayValue = value.resellerName;
        } else if (value.lcoName) {
          displayValue = value.lcoName;
        } else if (value.roleName) {
          displayValue = value.roleName;
        } else if (value.username) {
          displayValue = value.username;
        } else {
          // For general case: Convert object to string if it's a deeply nested one
          displayValue = JSON.stringify(value);
        }
      } else {
        displayValue = value.toString();  // This should work for strings or numbers
      }
    }

    return (
      <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
        <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
        <div className="w-2/3 p-[2px]">{displayValue}</div>
      </div>
    );
  };


  const { generalInformation, networkInformation, additionalInformation, document, _id, status, createdAt, updatedAt, walletBalance } = user;

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
          <Row label="Title" value={generalInformation?.Title || generalInformation?.title} />
          <Row label="Name" value={generalInformation?.name} />
          <Row label="Username" value={generalInformation?.username} />
          <Row label="Email" value={generalInformation?.email} />
          <Row label="Phone" value={generalInformation?.phone} />
          <Row label="Telephone" value={generalInformation?.telephone} />
          <Row label="CAF No" value={generalInformation?.cafNo} />
          <Row label="GST" value={generalInformation?.gst} />
          <Row label="Aadhar No" value={generalInformation?.adharNo} />
          <Row label="Address" value={generalInformation?.address} />
          <Row label="Pincode" value={generalInformation?.pincode} />
          <Row label="State" value={generalInformation?.state} />
          <Row label="Country" value={generalInformation?.country} />
          <Row label="District" value={generalInformation?.district} />
          <Row label="Role" value={generalInformation?.roleId?.roleName} />
          <Row label="Retailer" value={generalInformation?.retailerId?.resellerName || (typeof generalInformation?.retailerId === 'string' ? generalInformation?.retailerId : "")} />
          <Row label="LCO" value={generalInformation?.lcoId?.lcoName || (typeof generalInformation?.lcoId === 'string' ? generalInformation?.lcoId : "")} />
          <Row label="Payment Method" value={generalInformation?.paymentMethod} />
        </div>
      </div>
      {/* Network Information */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Network Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="NAS" value={networkInformation?.statisIp?.nas?.length > 0 ? networkInformation.statisIp.nas.join(", ") : "—"} />
          <Row label="Category" value={networkInformation?.statisIp?.category} />
          <Row label="Network Type" value={networkInformation?.networkType} />
          <Row label="IP Type" value={networkInformation?.ipType} />
          <Row label="Dynamic IP Pool" value={networkInformation?.dynamicIpPool} />
        </div>
      </div>
      {/* Additional Information */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Date of Birth" value={additionalInformation?.dob} />
          <Row label="Description" value={additionalInformation?.description} />
          <Row label="Notification" value={additionalInformation?.notification ? "Yes" : "No"} />
          <Row label="Add Plan" value={additionalInformation?.addPlan ? "Yes" : "No"} />
          <Row label="Add Charges" value={additionalInformation?.addCharges ? "Yes" : "No"} />
        </div>
      </div>
      {/* Document */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">Document</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Document Type" value={document?.documentType} />
          <Row label="Document Details" value={document?.documentDetails} />
          {/* <Row label="Document Image" value={document?.documentImage ? <a href={BASE_URL + document.documentImage} target="_blank" rel="noopener noreferrer">View Image</a> : "—"} /> */}
        </div>
      </div>
      {/* System Info */}
      <div className="border rounded-lg overflow-hidden shadow mb-4">
        <h4 className="text-lg font-semibold p-2 bg-gray-200">System Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="User ID" value={_id} />
          <Row label="Status" value={status} />
          <Row label="Wallet Balance" value={walletBalance} />
          <Row label="Created At" value={new Date(createdAt).toLocaleString()} />
          <Row label="Updated At" value={new Date(updatedAt).toLocaleString()} />
        </div>
      </div>
      {/* Purchase Plans */}
      <div className="flex justify-between mt-1 ">
        <div>Purchase Plans</div>
        <div
          className="cursor-pointer flex items-center gap-1"
          onClick={() => setIsPurchasePlansOpen(!isPurchasePlansOpen)}
        >
          {isPurchasePlansOpen ? (
            <MdKeyboardDoubleArrowUp size={20} />
          ) : (
            <MdKeyboardDoubleArrowDown size={20} />
          )}
        </div>
      </div>
      {isPurchasePlansOpen && <CustomerPurchasePlanList />}
    </>
  );
}