import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPriceBookDetails, getPackageList, getRetailerList, getLcoList } from "../../service/pricebook";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

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

  // Resolve package name if needed (fallback)
  const getPackageName = (packageId) => {
    const pkg = packages.find((p) => p._id === packageId);
    return pkg ? pkg.name : `Unknown (${packageId})`;
  };

  // Download packages as Excel
  const downloadPackagesExcel = () => {
    if (!priceBook?.package || priceBook.package.length === 0) {
      toast.error("No packages to download");
      return;
    }

    const data = priceBook.package.map((pkg, index) => ({
      "S.No": index + 1,
      "Package Name": pkg.name || getPackageName(pkg.packageId),
      "Base Price": pkg.basePrice || "N/A",
      "Price": pkg.price || "N/A",
      "Retailer Price": pkg.retailerPrice || "N/A",
      "Offer Price": pkg.offerPrice || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Packages");

    // File name with price book name
    const fileName = `${priceBook.priceBookName.replace(/[^a-z0-9]/gi, '_')}_packages.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success("Packages downloaded successfully!");
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
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/pricebook/list")}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/pricebook/update/${id}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
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
          <p className="border p-2 rounded bg-gray-50">{priceBook.priceBookFor?.join(", ") || "N/A"}</p>
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
          <ul className="list-disc pl-5 space-y-2">
            {priceBook.assignedTo.map((item, idx) => (
              <li
                key={idx}
                className="border p-3 rounded bg-gray-50"
              >
                {item.resellerName || item.lcoName || "Unknown Assignee"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignees.</p>
        )}
      </div>

      {/* Packages Section with Download Button */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Packages</h3>
          <button
            onClick={downloadPackagesExcel}
            disabled={!priceBook.package || priceBook.package.length === 0}
            className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Download Packages Excel
          </button>
        </div>

        {priceBook.package && priceBook.package.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Package Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Base Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Retailer Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Offer Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priceBook.package.map((pkg, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{pkg.name || getPackageName(pkg.packageId)}</td>
                    <td className="px-4 py-3">{pkg.basePrice || "N/A"}</td>
                    <td className="px-4 py-3">{pkg.price || "N/A"}</td>
                    <td className="px-4 py-3">{pkg.retailerPrice || "N/A"}</td>
                    <td className="px-4 py-3">{pkg.offerPrice || "N/A"}</td>
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