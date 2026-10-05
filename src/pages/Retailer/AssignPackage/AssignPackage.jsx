import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assignPackageToReseller } from "../../../service/rolePermission";
import { getPackagesByRole } from "../../../service/user";
import { getAllPackageList } from "../../../service/package";

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
        let allPackages = res.data || [];
        
        // Filter only H8 servertype for Reseller
        allPackages = allPackages.filter(pkg => pkg.servertype === "H8");

        // Fetch already assigned packages
        const assignedRes = await getPackagesByRole({
          targetRole: "Reseller",
          targetId: id
        });
        
        const assignedPackages = assignedRes?.data?.packages || [];
        const assignedIds = new Set(assignedPackages.map(p => p._id));

        // Show only available packages (not already assigned)
        const availablePackages = allPackages.filter(pkg => !assignedIds.has(pkg._id));
        setPackages(availablePackages);
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
    <div className="max-w-7xl mx-auto p-4 bg-white shadow rounded text-sm">
      <h2 className="text-lg font-bold mb-4">Assign Packages to Reseller</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <div>
          <h3 className="text-base font-semibold mb-2">Select Packages</h3>
          {packages.length === 0 ? (
            <p className="text-gray-500">No packages found.</p>
          ) : (
            <div className="space-y-2">
              {packages.map((pkg) => (
                <div key={pkg._id} className="border p-2 rounded bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedPackages.some((p) => p.packageId === pkg._id)}
                      onChange={() => handleCheckboxChange(pkg)}
                      className="h-3 w-3"
                    />
                    <span className="font-semibold text-gray-800">{pkg.name}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ml-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Base Price</label>
                      <input
                        type="number"
                        value={pkg.basePrice}
                        disabled
                        className="border p-1 w-full rounded bg-gray-200 text-xs h-7"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Offer Price</label>
                      <input
                        type="number"
                        defaultValue={offerPrices[pkg._id] || pkg.offerPrice || pkg.basePrice}
                        onBlur={(e) => handleOfferPriceChange(pkg._id, e.target.value)}
                        className="border p-1 w-full rounded text-xs h-7"
                        min={pkg.basePrice}
                        disabled={!selectedPackages.some((p) => p.packageId === pkg._id)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Status</label>
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
                        className="border p-1 w-full rounded text-xs h-7"
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

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Assign Packages"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}