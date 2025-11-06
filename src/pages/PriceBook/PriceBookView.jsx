import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPriceBookDetails, getPackageList, getRetailerList, getLcoList } from "../../service/pricebook";
import { toast } from "react-toastify";

export default function PriceBookView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [priceBook, setPriceBook] = useState(null);
  const [packages, setPackages] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [lcos, setLcos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch price book details and reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceBookRes, packageRes, retailerRes, lcoRes] = await Promise.all([
          getPriceBookDetails(id),
          getPackageList(),
          getRetailerList(),
          getLcoList(),
        ]);
        setPriceBook(priceBookRes.data || null);
        setPackages(packageRes.data || []);
        setRetailers(retailerRes.data || []);
        setLcos(lcoRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load price book details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // Resolve package name
  const getPackageName = (packageId) => {
    const pkg = packages.find((p) => p._id === packageId);
    return pkg ? pkg.name : `Unknown (${packageId})`;
  };
  // Resolve assignedTo name
  const getAssignedToName = (id) => {
    if (priceBook?.priceBookFor === "Reseller") {
      const retailer = retailers.find((r) => r._id === id);
      return retailer ? retailer.resellerName : `Unknown (${id})`;
    } else {
      const lco = lcos.find((l) => l._id === id);
      return lco ? lco.lcoName : `Unknown (${id})`;
    }
  };
  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }
  if (!priceBook) {
    return <div className="text-center p-6 text-red-500">Price book not found.</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Price Book Details</h2>
        <button
          onClick={() => navigate("/pricebook/list")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Price Book Name</label>
          <p className="border p-2 rounded bg-gray-50">{priceBook.priceBookName || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <p className="border p-2 rounded bg-gray-50 capitalize">{priceBook.status || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">From Date</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(priceBook.fromDate)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">To Date</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(priceBook.toDate)}</p>
        </div>
        <div className="col-span-2">
          <label className="block font-medium text-gray-700">Description</label>
          <p className="border p-2 rounded bg-gray-50">{priceBook.description || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Price Book For</label>
          <p className="border p-2 rounded bg-gray-50">{priceBook.priceBookFor || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">ID</label>
          <p className="border p-2 rounded bg-gray-50">{priceBook._id || "N/A"}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Created At</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(priceBook.createdAt)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Updated At</label>
          <p className="border p-2 rounded bg-gray-50">{formatDate(priceBook.updatedAt)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
        {priceBook.assignedTo && priceBook.assignedTo.length > 0 ? (
          <ul className="list-disc pl-5">
            {priceBook.assignedTo.map((id) => (
              <li key={id} className="border p-2 rounded bg-gray-50 mb-2">
                {/* {getAssignedToName(id)} */}
                {id?.resellerName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignees.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Packages</h3>
        {priceBook.package && priceBook.package.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Package Name</th>
                  <th className="px-4 py-2 text-left">Base Price</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Retailer Price</th>
                  <th className="px-4 py-2 text-left">Offer Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priceBook.package.map((pkg) => (
                  <tr key={pkg.packageId} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{pkg.name || getPackageName(pkg.packageId)}</td>
                    <td className="px-4 py-2">{pkg.basePrice || "N/A"}</td>
                    <td className="px-4 py-2">{pkg.price || "N/A"}</td>
                    <td className="px-4 py-2">{pkg.retailerPrice || "N/A"}</td>
                    <td className="px-4 py-2">{pkg.offerPrice || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No packages assigned.</p>
        )}
      </div>
    </div>
  );
}