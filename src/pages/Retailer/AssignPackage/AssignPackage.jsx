import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPackageList, assignPackageToReseller } from "../../../service/rolePermission";

export default function AssignPackage() {
  const { id } = useParams(); // Reseller ID from URL params
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offerPrices, setOfferPrices] = useState({});

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageList();
        setPackages(res.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleCheckboxChange = (pkg) => {
    setSelectedPackages((prev) => {
      const isSelected = prev.some((p) => p.packageId === pkg._id);
      if (isSelected) {
        return prev.filter((p) => p.packageId !== pkg._id);
      } else {
        return [
          ...prev,
          {
            packageId: pkg._id,
            name: pkg.name,
            basePrice: pkg.basePrice,
            price: pkg.basePrice,
            retailerPrice: pkg.basePrice,
            offerPrice: pkg.offerPrice || pkg.basePrice,
            status: "active",
          },
        ];
      }
    });
  };
  const handleOfferPriceChange = (pkgId, value) => {
    const pkg = packages.find((p) => p._id === pkgId);
    const newOfferPrice = parseFloat(value) || pkg.basePrice;

    if (newOfferPrice < pkg.basePrice) {
      toast.error(`Offer price cannot be less than base price (${pkg.basePrice})`);
      return;
    }
    setOfferPrices((prev) => ({
      ...prev,
      [pkgId]: newOfferPrice,
    }));

    setSelectedPackages((prev) =>
      prev.map((p) =>
        p.packageId === pkgId ? { ...p, offerPrice: newOfferPrice } : p
      )
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPackages.length === 0) {
      toast.error("Please select at least one package");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        assignTo: "Reseller",
        assignToId: id,
        package: selectedPackages,
      };
      await assignPackageToReseller(payload);
      toast.success("Packages assigned successfully ✅");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to assign packages ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedPackages([]);
    setOfferPrices({});
  };

  if (loading) return <p className="p-4">Loading packages...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Assign Packages to Reseller</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Select Packages</h3>
          {packages.length === 0 ? (
            <p className="text-gray-500">No packages found.</p>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg._id} className="border p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedPackages.some((p) => p.packageId === pkg._id)}
                      onChange={() => handleCheckboxChange(pkg)}
                      className="h-4 w-4"
                    />
                    <span className="font-medium">{pkg.name}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block font-medium">Base Price</label>
                      <input
                        type="number"
                        value={pkg.basePrice}
                        disabled
                        className="border p-2 w-full rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Offer Price</label>
                      <input
                        type="number"
                        defaultValue={offerPrices[pkg._id] || pkg.offerPrice || pkg.basePrice}
                        onBlur={(e) => handleOfferPriceChange(pkg._id, e.target.value)}
                        className="border p-2 w-full rounded"
                        min={pkg.basePrice}
                        disabled={!selectedPackages.some((p) => p.packageId === pkg._id)}
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Status</label>
                      <select
                        value={
                          selectedPackages.find((p) => p.packageId === pkg._id)?.status ||
                          "active"
                        }
                        onChange={(e) =>
                          setSelectedPackages((prev) =>
                            prev.map((p) =>
                              p.packageId === pkg._id ? { ...p, status: e.target.value } : p
                            )
                          )
                        }
                        className="border p-2 w-full rounded"
                        disabled={!selectedPackages.some((p) => p.packageId === pkg._id)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Assign Packages"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}