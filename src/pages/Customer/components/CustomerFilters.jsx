import { useState, useEffect, useRef } from "react";
import AsyncLcoSelect from "./AsyncLcoSelect";
import AsyncResellerSelect from "./AsyncResellerSelect";
import AsyncAreaSelect from "./AsyncAreaSelect";
import AsyncSubZoneSelect from "./AsyncSubZoneSelect";
import DatePicker from "react-datepicker";
import { getStaffList } from "../../../service/ticket";

export default function CustomerFilters({ filters, setSearchParams }) {
  const [staffList, setStaffList] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [installerDisplay, setInstallerDisplay] = useState("");
  const [serverTypeDisplay, setServerTypeDisplay] = useState(filters.serverType || "");
  const staffRef = useRef(null);

  useEffect(() => {
    setServerTypeDisplay(filters.serverType || "");
  }, [filters.serverType]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStaffList();
        if (res?.status) setStaffList(res.data || []);
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (staffRef.current && !staffRef.current.contains(event.target)) {
        setShowStaffDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!filters.installationBy) {
      setInstallerDisplay("");
    } else {
      const staff = staffList.find(s => s._id === filters.installationBy);
      if (staff) {
        setInstallerDisplay(staff.staffName || staff.name);
      } else {
        setInstallerDisplay(filters.installationBy);
      }
    }
  }, [filters.installationBy, staffList]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(window.location.search);

    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  /* ✅ SEARCH BUTTON */
  const handleSearch = () => {
    // Trigger re-render by resetting same params
    setSearchParams(new URLSearchParams(window.location.search));
  };

  /* ✅ RESET BUTTON */
  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-sm">
        {/* Search */}
        <input
          placeholder="Search name / email / phone"
          value={filters.searchQuery || ""}
          onChange={(e) => updateParam("searchQuery", e.target.value)}
          className="border p-1 rounded"
        />

        {/* Status */}
        <select
          value={filters.status || ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspend">Suspend</option>
        </select>

        {/* eKYC */}
        <select
          value={filters.ekyc || ""}
          onChange={(e) => updateParam("ekyc", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All eKYC</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {/* Service */}
        <select
          value={filters.serviceOpted || ""}
          onChange={(e) => updateParam("serviceOpted", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Select Service Opted</option>
          <option value="intercom">Intercom</option>
          <option value="broadband">Broadband</option>
          <option value="corporate">Corporate</option>
        </select>

        {/* Connection Type */}
        <select
          value={filters.connectionType || ""}
          onChange={(e) => updateParam("connectionType", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Select Connection Type</option>
          <option value="ill">ILL</option>
          <option value="ftth">FTTH</option>
          <option value="rf">RF</option>
          <option value="other">Other</option>
        </select>

        {/* Server Type */}
        {/* <input
          type="text"
          placeholder="Filter by Server Type"
          value={filters.serverType || ""}
          onChange={(e) => updateParam("serverType", e.target.value)}
          className="border p-1 rounded"
        /> */}

        {/* Installation By */}
        {/* <div className="relative" ref={staffRef}>
          <input
            placeholder="Installation By"
            value={installerDisplay}
            onChange={(e) => {
              setInstallerDisplay(e.target.value);
              updateParam("installationBy", e.target.value);
              setShowStaffDropdown(true);
            }}
            onFocus={() => setShowStaffDropdown(true)}
            className="border p-1 rounded w-full"
          />
          {showStaffDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
              {staffList
                .filter((s) => {
                  const name = s.staffName || s.name || "";
                  return name.toLowerCase().includes(installerDisplay.toLowerCase());
                })
                .map((s) => (
                  <div
                    key={s._id}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      updateParam("installationBy", s._id);
                      setInstallerDisplay(s.staffName || s.name);
                      setShowStaffDropdown(false);
                    }}
                  >
                    {s.staffName || s.name}
                  </div>
                ))}
            </div>
          )}
        </div> */}

        {/* Start Date */}
        <DatePicker
          selected={filters.startDate ? new Date(filters.startDate) : null}
          onChange={(date) =>
            updateParam("startDate", date ? date.toISOString() : "")
          }
          placeholderText="Start Date"
          dateFormat="yyyy-MM-dd"
          className="border p-1 rounded w-full"
          isClearable
        />

        {/* End Date */}
        <DatePicker
          selected={filters.endDate ? new Date(filters.endDate) : null}
          onChange={(date) =>
            updateParam("endDate", date ? date.toISOString() : "")
          }
          placeholderText="End Date"
          dateFormat="yyyy-MM-dd"
          className="border p-1 rounded w-full"
          isClearable
        />

        {/* Area */}
        <AsyncAreaSelect
          value={filters.area}
          onSelect={(id) => {
            updateParam("area", id);
            updateParam("subZone", "");
          }}
        />

        {/* SubZone */}
        <AsyncSubZoneSelect
          areaId={filters.area}
          value={filters.subZone}
          onSelect={(id) => updateParam("subZone", id)}
        />

        {/* CAF Form */}
        <select
          value={filters.cafUploaded || ""}
          onChange={(e) => updateParam("cafUploaded", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">CAF Form</option>
          <option value="yes">Uploaded</option>
          <option value="no">Not Uploaded</option>
        </select>

        {/* Reseller */}
        <AsyncResellerSelect
          value={filters.reseller}
          onSelect={(id) => updateParam("reseller", id)}
        />

        {/* LCO */}
        <AsyncLcoSelect
          value={filters.lco}
          onSelect={(id) => updateParam("lco", id)}
        />

             {/* Server Type */}
        <input
          type="text"
          placeholder="Filter by Server Type"
          value={serverTypeDisplay}
          onChange={(e) => setServerTypeDisplay(e.target.value)}
          onBlur={(e) => updateParam("serverType", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("serverType", e.target.value);
            }
          }}
          className="border p-1 rounded"
        />

        {/* Installation By */}
        <div className="relative" ref={staffRef}>
          <input
            placeholder="Installation By"
            value={installerDisplay}
            onChange={(e) => {
              setInstallerDisplay(e.target.value);
              setShowStaffDropdown(true);
            }}
            onFocus={() => setShowStaffDropdown(true)}
            className="border p-1 rounded w-full"
          />
          {showStaffDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
              {staffList
                .filter((s) => {
                  const name = s.staffName || s.name || "";
                  return name.toLowerCase().includes(installerDisplay.toLowerCase());
                })
                .map((s) => (
                  <div
                    key={s._id}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      updateParam("installationBy", s._id);
                      setInstallerDisplay(s.staffName || s.name);
                      setShowStaffDropdown(false);
                    }}
                  >
                    {s.staffName || s.name}
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>

      {/* 🔹 SEARCH & RESET BUTTONS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </>
  );
}
