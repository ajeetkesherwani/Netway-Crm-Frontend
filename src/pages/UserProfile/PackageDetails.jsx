import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";

import {
  getAvailablePackagesForUser,
  getAssignedPackageList,
  assignPackageToUser,
  updateUserPackageStatus,
  deleteAssignedPackage
} from "../../service/userPackage";

const UserPackageDetails = () => {
  const { id: userId } = useParams();

  const [loading, setLoading] = useState(true);
  const [packageList, setPackageList] = useState([]);
  const [assignedPackages, setAssignedPackages] = useState([]);

  const [addRow, setAddRow] = useState(false);

  const [newPackage, setNewPackage] = useState({
    packageId: "",
    packageName: "",
    billType: "",
    basePrice: "",
    customPrice: "",
  });

  useEffect(() => {
    loadPackages();
    loadAssigned();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await getAvailablePackagesForUser(userId);
      console.log("Available Packages:", res);
      setPackageList(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAssigned = async () => {
    try {
      const res = await getAssignedPackageList(userId);
      setAssignedPackages(res.data || []);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (id) => {
    const pkg = packageList.find((x) => x._id === id);
    if (!pkg) return;

    setNewPackage({
      packageId: id,
      packageName: pkg.name,
      billType: pkg.billType,
      basePrice: pkg.basePrice,
      customPrice: pkg.basePrice,
    });
  };

  const saveNewPackage = async () => {
  if (!newPackage.packageId) {
    alert("Select package first");
    return;
  }

  try {
    await assignPackageToUser(userId, {
      packageId: newPackage.packageId,
      packageName: newPackage.packageName,
      billType: newPackage.billType,
      basePrice: Number(newPackage.basePrice),
      customPrice: Number(newPackage.customPrice),  // ❗ updated price always saved
      validity: {
        number: Number(newPackage.validity?.number) || 30,
        unit: newPackage.validity?.unit 
          ? newPackage.validity.unit.charAt(0).toUpperCase() + newPackage.validity.unit.slice(1).toLowerCase()
          : "Day"
      }
    });

    alert("Package Assigned!");
    setAddRow(false);

    setNewPackage({
      packageId: "",
      packageName: "",
      billType: "",
      basePrice: "",
      customPrice: "",
    });

    loadAssigned();
    loadPackages();
  } catch (err) {
    console.log(err);
  }
};

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await deleteAssignedPackage(id);
      alert("Package deleted successfully!");
      loadAssigned(); // Table refresh
      loadPackages(); // Dropdown refresh
    } catch (err) {
      console.log(err);
      alert("Failed to delete package");
    }
  };


  const changeStatus = async (id, status) => {
    try {
      await updateUserPackageStatus(id, status); // string pass karo directly
      loadAssigned();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl bg-gray-100 min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-bold mb-6">User Package Details</h2>

      {/* TABLE */}
      <div className="bg-white shadow border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300 text-gray-900">
              <th className="py-3 px-3 text-left">Package Name</th>
              <th className="py-3 px-3 text-left">Bill Type</th>
              <th className="py-3 px-3 text-left">Price</th>
              <ProtectedAction module="customer" action="updateAssignPackageStatus">
                <th className="py-3 px-3 text-left">Status</th>
              </ProtectedAction>
              <ProtectedAction module="customer" action="deleteAssignPackage">
                <th className="py-3 px-3 text-left">Action</th>
              </ProtectedAction>
            </tr>
          </thead>

          <tbody>
            {assignedPackages.map((p, index) => (
              <tr
                key={p._id}
                className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
              >
                <td className="py-3 px-3 font-semibold">{p.packageName}</td>
                <td className="py-3 px-3">{p.billType}</td>

                {/* <td className="py-3 px-3">{p.customPrice || p.basePrice}</td> */}
                <td className="py-3 px-3">{p.customPrice ?? p.basePrice}</td>

                <ProtectedAction module="customer" action="updateAssignPackageStatus">
                <td className="py-3 px-3">
                  {/* Tailwind Toggle Switch */}
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={p.status === "active"}
                      onChange={(e) =>
                        changeStatus(
                          p._id,
                          e.target.checked ? "active" : "inactive"
                        )
                      }
                    />
                    <span className="absolute cursor-pointer inset-0 bg-gray-400 peer-checked:bg-green-500 transition rounded-full"></span>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
                  </label>
                </td>
                </ProtectedAction>
                <ProtectedAction module="customer" action="deleteAssignPackage">
                <td className="py-3 px-3">
                  <button
                    onClick={() => handleDeletePackage(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td> 
                </ProtectedAction>
              </tr>
            ))}

            {/* ADD NEW ROW */}
            <ProtectedAction module="customer" action="assignPackage">
            {addRow && (
              <tr className="bg-blue-50 border-b border-gray-300">
                <td className="py-3 px-3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={newPackage.packageId}
                    onChange={(e) => handleSelectPackage(e.target.value)}
                  >
                    <option value="">Select Package</option>
                    {packageList.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-3 px-3">
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100"
                    value={newPackage.billType}
                    readOnly
                  />
                </td>

                <td className="py-3 px-3">
                  <input
                    type="number"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={newPackage.customPrice}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        customPrice: e.target.value,
                      })
                    }
                  />
                </td>

                <td className="py-3 px-3 text-center">—</td>

                <td className="py-3 px-3">
                  <button
                    onClick={saveNewPackage}
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
            </ProtectedAction>
          </tbody>
        </table>
      </div>

      {/* ADD ROW BUTTON */}
      <button
        onClick={() => setAddRow(true)}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
      >
        + Add Row
      </button>
    </div>
  );
};

export default UserPackageDetails;
