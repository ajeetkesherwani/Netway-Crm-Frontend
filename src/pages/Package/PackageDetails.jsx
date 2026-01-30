// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPackageDetails } from "../../service/package";

// export default function PackageDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [pkg, setPkg] = useState(null);
//   console.log("pkg", pkg);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadPackage = async () => {
//       try {
//         const res = await getPackageDetails(id); // API should return single package by ID
//         setPkg(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load package details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPackage();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   if (!pkg) return <p className="p-4">Package not found</p>;

//   const Row = ({ label, value }) => (
//     <div className="flex flex-col md:flex-row border-b last:border-b-0">
//       <div className="md:w-1/3 bg-gray-100 p-2 font-medium">{label}</div>
//       <div className="md:w-2/3 p-2 break-words">{value ?? "—"}</div>
//     </div>
//   );

//   return (
//     <>
//       <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center -mt-4 mb-4 space-y-2 md:space-y-0">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//         >
//           ← Back
//         </button>
//         <h3 className="text-2xl font-semibold">Package Details</h3>
//       </div>

//       <div className="border rounded-lg overflow-hidden shadow max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <Row label="Name" value={pkg.name} />
//           <Row label="Name" value={pkg.name} />
//           <Row label="Description" value={pkg.description} />
//           <Row label="Type of Plan" value={pkg.typeOfPlan} />
//           <Row label="Category of Plan" value={pkg.categoryOfPlan} />
//           <Row
//             label="Validity"
//             value={`${pkg.validity?.number} ${pkg.validity?.unit}`}
//           />
//           <Row label="Status" value={pkg.status} />
//           <Row label="SAC Code" value={pkg.sacCode} />
//           <Row
//             label="From Date"
//             value={new Date(pkg.fromDate).toLocaleDateString()}
//           />
//           <Row
//             label="To Date"
//             value={new Date(pkg.toDate).toLocaleDateString()}
//           />
//           <Row
//             label="Base Price"
//             value={pkg.basePrice}
//           />
//              <Row
//             label="Offer Price"
//             value={pkg.offerPrice}
//           />
//         </div>
//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageDetails } from "../../service/package";

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const res = await getPackageDetails(id);
        setPkg(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!pkg) return <p className="p-4">Package not found</p>;

  const Row = ({ label, value }) => (
    <div className="flex flex-col md:flex-row border-b last:border-b-0">
      <div className="md:w-1/3 bg-gray-100 p-2 font-medium">{label}</div>
      <div className="md:w-2/3 p-2 break-words">{value ?? "—"}</div>
    </div>
  );

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center -mt-4 mb-4 space-y-2 md:space-y-0">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/package/update/${id}`)} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit
          </button>
        </div>
        <h3 className="text-2xl font-semibold">Package Details</h3>
        {/* Empty div to balance flex if needed */}
        <div></div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Name" value={pkg.name} />
          <Row label="Description" value={pkg.description} />
          <Row label="Type of Plan" value={pkg.typeOfPlan} />
          <Row label="Category of Plan" value={pkg.categoryOfPlan} />
          <Row label="Bill Type" value={pkg.billType} />
          <Row
            label="Validity"
            value={
              pkg.validity
                ? `${pkg.validity.number} ${pkg.validity.unit}(s)`
                : "—"
            }
          />
          <Row label="Base Price" value={pkg.basePrice} />
          <Row label="Offer Price" value={pkg.offerPrice} />
          <Row label="SAC Code" value={pkg.sacCode} />
          <Row
            label="From Date"
            value={
              pkg.fromDate ? new Date(pkg.fromDate).toLocaleDateString() : "—"
            }
          />
          <Row
            label="To Date"
            value={
              pkg.toDate ? new Date(pkg.toDate).toLocaleDateString() : "—"
            }
          />
          <Row label="Status" value={pkg.status === "active" ? "Active" : "Inactive"} />
          <Row label="Package Available" value={pkg.packageAvailable ? "Yes" : "No"} />
          <Row label="Offer Package" value={pkg.offerPackage ? "Yes" : "No"} />
          <Row label="Is OTT" value={pkg.isOtt ? "Yes" : "No"} />
          {pkg.isOtt && <Row label="OTT Type" value={pkg.ottType} />}
          {pkg.isOtt && <Row label="OTT Package ID" value={pkg.ottPackageId?.name} />}
          <Row label="Is IPTV" value={pkg.isIptv ? "Yes" : "No"} />
          {pkg.isIptv && <Row label="IPTV Type" value={pkg.iptvType} />}
          {pkg.isIptv && <Row label="IPTV Package ID" value={pkg.iptvPackageId?.plan_name} />}
          <Row
            label="Created At"
            value={pkg.createdAt ? new Date(pkg.createdAt).toLocaleString() : "—"}
          />
          <Row
            label="Updated At"
            value={pkg.updatedAt ? new Date(pkg.updatedAt).toLocaleString() : "—"}
          />
        </div>
      </div>
    </>
  );
}