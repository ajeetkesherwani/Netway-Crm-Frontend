import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProtectedAction from "../../components/ProtectedAction";

import {
  getAvailablePackagesForUser,
  getAssignedPackageList,
  assignPackageToUser,
  updateUserPackageStatus,
  deleteAssignedPackage,
} from "../../service/userPackage";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";
import DatePicker from "react-datepicker";
import SelectorWithSearchAndPagination from "../../components/SelectorWithSearchAndPagination";

const UserPackageDetails = () => {
  const { id: userId } = useParams();

  const [loading, setLoading] = useState(true);
  // const [packageList, setPackageList] = useState([]);
  const [assignedPackages, setAssignedPackages] = useState([]);

  const [addRow, setAddRow] = useState(false);

  const [newPackage, setNewPackage] = useState({
    packageId: "",
    packageName: "",
    billType: "",
    basePrice: "",
    customPrice: "",
    startDate: "",
    endDate: "",
    hasOtt: false,
    hasIptv: false,
  });

  useEffect(() => {
    loadPackages({});
    loadAssigned();
  }, []);

  const loadPackages = async ({ search = "", page = 1, limit = 7 }) => {
    try {
      const res = await getAvailablePackagesForUser(userId, {
        search,
        page,
        limit,
      });
      console.log("Available Packages:", res);
      // setPackageList(res.data || []);
      return res.data || [];
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

  const handleOnSelectPackage = (pkg) => {
    if (!pkg) {
      setNewPackage({});
      return;
    }

    setNewPackage({
      ...newPackage,
      packageId: pkg._id,
      packageName: pkg.name,
      name: pkg.name,
      _id: pkg._id,
      billType: pkg.billType,
      basePrice: pkg.basePrice,
      customPrice: pkg.basePrice,
      startDate: pkg.fromDate ? new Date(pkg.fromDate).toISOString() : "",
      endDate: pkg.toDate ? new Date(pkg.toDate).toISOString() : "",
      hasOtt: pkg.isOtt || false,
      hasIptv: pkg.isIptv || false,
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
        customPrice: Number(newPackage.customPrice), // ❗ updated price always saved
        validity: {
          number: Number(newPackage.validity?.number) || 30,
          unit: newPackage.validity?.unit
            ? newPackage.validity.unit.charAt(0).toUpperCase() +
              newPackage.validity.unit.slice(1).toLowerCase()
            : "Day",
        },
        startDate: newPackage.startDate,
        endDate: newPackage.endDate,
        hasOtt: newPackage.hasOtt,
        hasIptv: newPackage.hasIptv,
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
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;

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
      <div className="bg-white shadow border border-gray-300 rounded-lg">
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300 text-gray-900">
              <th className="py-3 px-3 text-left">Package Name</th>
              <th className="py-3 px-3 text-left">Bill Type</th>
              <th className="py-3 px-3 text-left">Price</th>
              <th className="py-3 px-3 text-left">Start</th>
              <th className="py-3 px-3 text-left">End</th>
              <ProtectedAction
                module="customer"
                action="updateAssignPackageStatus"
              >
                <th className="py-3 px-3 text-left">Status</th>
              </ProtectedAction>
              <ProtectedAction module="customer" action="deleteAssignPackage">
                <th className="py-3 px-3 text-left">Action</th>
              </ProtectedAction>
              <th className="py-3 px-3 text-left">Ott / Iptv</th>
            </tr>
          </thead>

          <tbody>
            {assignedPackages.map((p, index) => (
              <tr
                key={p._id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-3 font-semibold">{p.packageName}</td>
                <td className="py-3 px-3">{p.billType}</td>

                {/* <td className="py-3 px-3">{p.customPrice || p.basePrice}</td> */}
                <td className="py-3 px-3">{p.customPrice ?? p.basePrice}</td>
                <td className="py-3 px-3">
                  {convertUTCToLocalDateString(p.startDate) ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {convertUTCToLocalDateString(p.endDate) ?? "N/A"}
                </td>

                <ProtectedAction
                  module="customer"
                  action="updateAssignPackageStatus"
                >
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
                <td className="py-3 px-3">
                  <div className="flex flex-col gap-y-1">
                    <input
                      type="checkbox"
                      readOnly
                      className="pointer-events-none"
                      checked={p.hasOtt}
                    />
                    <input
                      type="checkbox"
                      readOnly
                      className="pointer-events-none"
                      checked={p.hasIptv}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {/* ADD NEW ROW */}
            <ProtectedAction module="customer" action="assignPackage">
              {addRow && (
                <tr className="bg-blue-50 border-b border-gray-300">
                  <td className="py-3 px-3 relative">
                    {/* <select
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
                    </select> */}
                    <SelectorWithSearchAndPagination
                      valKey="name"
                      placeholder="Select Package"
                      selected={newPackage}
                      onSelect={handleOnSelectPackage}
                      getDetails={loadPackages}
                      className="text-sm min-w-52 py-1"
                      cancelClassName="p-[1px]"
                    />
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

                  <td className="py-3 px-3">
                    <DatePicker
                      selected={newPackage.startDate}
                      defaultDate={newPackage.startDate}
                      placeholderText="End Date"
                      dateFormat="yyyy-MM-dd"
                      className="border border-gray-300 rounded p-1 w-full"
                      readOnly
                    />
                  </td>
                  <td className="py-3 px-3">
                    <DatePicker
                      selected={
                        newPackage.endDate ? new Date(newPackage.endDate) : null
                      }
                      onChange={(date) =>
                        setNewPackage({
                          ...newPackage,
                          endDate: date ? new Date(date).toISOString() : "",
                        })
                      }
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      popperPlacement="bottom-start"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/yyyy"
                      className="mt-1 p-1 pr-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer text-base w-full"
                      isClearable
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
