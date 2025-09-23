import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../service/user"; 

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  console.log("User", user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserDetails(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
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

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r">
      <div className="w-1/3 bg-gray-100 p-2 font-medium">{label}</div>
      <div className="w-2/3 p-2">{value !== undefined && value !== "" ? value.toString() : "—"}</div>
    </div>
  );

  const { generalInformation, networkInformation, additionalInformation, document, _id, createdAt, updatedAt } = user;

  return (
    <>
      {/* Header with back button */}
      <div className="p-4 max-w-7xl mx-auto flex justify-between items-center -mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          ← Back
        </button>
        <h3 className="text-2xl font-semibold">User Details</h3>
      </div>

      {/* General Information */}
      <h4 className="text-lg font-semibold p-2 mt-4 bg-gray-200">General Information</h4>
      <div className="border rounded-lg overflow-hidden shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Title" value={generalInformation?.Title} />
          <Row label="Name" value={generalInformation?.name} />
          <Row label="Username" value={generalInformation?.username} />
          <Row label="Password" value={generalInformation?.password} />
          <Row label="Email" value={generalInformation?.email} />
          <Row label="Phone" value={generalInformation?.phone} />
          <Row label="Telephone" value={generalInformation?.telephone} />
          <Row label="CAF No" value={generalInformation?.cafNo} />
          <Row label="GST" value={generalInformation?.gst} />
          <Row label="Aadhar No" value={generalInformation?.adharNo} />
          <Row label="Address" value={generalInformation?.address} />
          <Row label="Pincode" value={generalInformation?.pincode} />
          <Row label="State" value={generalInformation?.state} />
          <Row label="District" value={generalInformation?.district} />
          <Row label="Country" value={generalInformation?.country} />
          <Row label="Role" value={generalInformation?.roleId?.roleName} />
          <Row label="Retailer" value={generalInformation?.retailerId?.resellerName} />
          <Row label="LCO" value={generalInformation?.lcoId?.lcoName} />
          <Row label="Payment Method" value={generalInformation?.paymentMethod} />
        </div>
      </div>

      {/* Network Information */}
      <h4 className="text-lg font-semibold p-2 mt-4 bg-gray-200">Network Information</h4>
      <div className="border rounded-lg overflow-hidden shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="NAS" value={networkInformation?.statisIp?.nas} />
          <Row label="Category" value={networkInformation?.statisIp?.category} />
          <Row label="Network Type" value={networkInformation?.networkType} />
          <Row label="IP Type" value={networkInformation?.ipType} />
          <Row label="Dynamic IP Pool" value={networkInformation?.dynamicIpPool} />
        </div>
      </div>

      {/* Additional Information */}
      <h4 className="text-lg font-semibold p-2 mt-4 bg-gray-200">Additional Information</h4>
      <div className="border rounded-lg overflow-hidden shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Date of Birth" value={additionalInformation?.dob} />
          <Row label="Description" value={additionalInformation?.description} />
          <Row label="Notification" value={additionalInformation?.notification ? "Yes" : "No"} />
          <Row label="Add Plan" value={additionalInformation?.addPlan ? "Yes" : "No"} />
          <Row label="Add Charges" value={additionalInformation?.addCharges ? "Yes" : "No"} />
        </div>
      </div>

      {/* Document */}
      <h4 className="text-lg font-semibold p-2 mt-4 bg-gray-200">Document</h4>
      <div className="border rounded-lg overflow-hidden shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Document Type" value={document?.documentType} />
          <Row label="Document Details" value={document?.documentDetails} />
        </div>
      </div>

      {/* System Info */}
      <h4 className="text-lg font-semibold p-2 mt-4 bg-gray-200">System Info</h4>
      <div className="border rounded-lg overflow-hidden shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="User ID" value={_id} />
          <Row label="Status" value={user?.status ? "Active" : "Inactive"} />
          <Row label="Created At" value={createdAt} />
          <Row label="Updated At" value={updatedAt} />
        </div>
      </div>
    </>
  );
}
