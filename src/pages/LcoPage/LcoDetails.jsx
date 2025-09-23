import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLcoDetails } from "../../service/lco"; // Fetch single LCO API

export default function LcoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lco, setLco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLco = async () => {
      try {
        const res = await getLcoDetails(id); // API call with ID
        setLco(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load LCO details");
      } finally {
        setLoading(false);
      }
    };
    loadLco();
  }, [id]);

  useEffect(() => {
    if (lco) {
      console.log("📌 LCO state updated:", lco);
    }
  }, [lco]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!lco) return <p className="p-4">LCO not found</p>;

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

        <h3 className="text-2xl font-semibold">LCO Details</h3>
      </div>

      <div className="border rounded-lg overflow-hidden shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Title" value={lco.title} />
          <Row label="LCO Name" value={lco.lcoName} />
          <Row label="Mobile No." value={lco.mobileNo} />
          <Row label="Telephone" value={lco.telephone} />
          <Row label="E-Mail" value={lco.email} />
          <Row label="Address" value={lco.address} />
          <Row label="Area" value={lco.area} />
          <Row label="Taluka" value={lco.taluka} />
          <Row label="State" value={lco.state} />
          <Row label="Country" value={lco.country} />
          <Row label="Pincode" value={lco.pincode} />
          <Row label="GST No." value={lco.gst} />
          <Row label="DOB" value={lco.dob} />
          <Row label="Balance" value={lco.lcoBalance} />
          <Row label="House No." value={lco.houseNo} />
          <Row label="SubArea" value={lco.subArea} />
          <Row label="Fax No." value={lco.faxNo} />
          <Row label="Pan No." value={lco.panNo} />
          <Row label="Reseller Name." value={lco.retailerId.resellerName} />
          <Row label="Role" value={lco.roleId.roleName} />
          <Row label="Messenger ID" value={lco.messengerId} />
          <Row label="Dashboard" value={lco.dashboard} />
          <Row label="LCO Code" value={lco.lcoCode} />
          <Row label="Contact Person Number" value={lco.contactPersonNumber} />
          <Row label="WhatsApp" value={lco.supportWhataApp} />
          <Row label="Website" value={lco.website} />
          <Row label="Anniversary Date" value={lco.anniversaryDate} />
          <Row label="Contact Person Name" value={lco.contactPersonName} />
          <Row label="Support Email" value={lco.supportEmail} />
          <Row label="Latitude" value={lco.latitude} />
          <Row label="Longitude" value={lco.longitude} />
          <Row label="NAS" value={lco.nas} />
          <Row label="Description" value={lco.description} />
          <Row label="Status" value={lco.status} />
        </div>
      </div>
    </>
  );
}
