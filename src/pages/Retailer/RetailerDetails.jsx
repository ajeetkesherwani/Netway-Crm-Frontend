import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRetailerDetails } from "../../service/retailer"; // Fetch single retailer API

export default function RetailerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="flex border-b last:border-b-0 md:border-r">
      <div className="w-1/3 bg-gray-100 p-2 font-medium">{label}</div>
      <div className="w-2/3 p-2">{value || "—"}</div>
    </div>
  );

  return (
<>

<div className="p-4 max-w-7xl mx-auto flex justify-between items-center -mt-4">
  <button
    onClick={() => navigate(-1)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
  >
    ← Back
  </button>

  <h3 className="text-2xl font-semibold">Retailer Details</h3>
</div>



  <div className="border rounded-lg overflow-hidden shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Title" value={retailer.title} />
          <Row label="Reseller Name" value={retailer.resellerName} />
          <Row label="Mobile No." value={retailer.mobileNo} />
          <Row label="Phone No." value={retailer.phoneNo} />
          <Row label="E-Mail" value={retailer.email} />
          <Row label="Address" value={retailer.address} />
          <Row label="Area" value={retailer.area} />
          <Row label="Taluka" value={retailer.taluka}/>
          <Row label="State" value={retailer.state} />
          <Row label="Country" value={retailer.country} />
          <Row label="pincode" value={retailer.pincode} />
          <Row label="Gst No." value={retailer.gstNo} />
          <Row label="Birth Date" value={retailer.dob} />
          <Row label="Balance" value={retailer.balance} />
          <Row label="House No." value={retailer.houseNo} />
          <Row label="SubArea" value={retailer.subArea} />
          <Row label="Fax" value={retailer.fax}/>
          <Row label="Pan" value={retailer.panNumber}/>
          <Row label="MessengerId" value={retailer.messengerId}/>
          <Row label="Dashboard" value={retailer.dashboard}/>
          <Row label="ResllerCode" value={retailer.resellerCode}/>
          <Row label="Contact Person Number" value={retailer.contactPersonNumber}/>
          <Row label="WhatsApp Number" value={retailer.whatsAppNumber}/>
          <Row label="Website" value={retailer.website}/>
          <Row label="Annversary Date" value={retailer.annversaryDate}/>
          <Row label="Contact Person Name" value={retailer.contactPersonName}/>
          <Row label="Support Email" value={retailer.supportEmail} />
          <Row label="Latitude" value={retailer.longitude} />
          <Row label="Longitude" value={retailer.latitude} />
          <Row label="Role" value={retailer.roleId.roleName} />
          <Row label="NAS" value={retailer.nas} />
          <Row label="Status" value={retailer.status} />
        </div>
        </div>
    </>
  );
}
