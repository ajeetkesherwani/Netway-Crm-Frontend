import { useEffect, useRef, useState } from "react";
import { FaSearch, FaSync } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getAllLco } from "../../service/lco";
import { getRetailer } from "../../service/retailer";
import { getZones, getAllSubZones } from "../../service/apiClient";
import { getAllPackageList } from "../../service/package";

export const InvoiceFilters = ({
  filters,
  setFilters,
  onSearch,
  onReset,
}) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Dropdown data
  const [lcos, setLcos] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [zones, setZones] = useState([]);
  const [packages, setPackages] = useState([]);

  // Search texts
  const [lcoText, setLcoText] = useState("");
  const [resellerText, setResellerText] = useState("");
  const [zoneText, setZoneText] = useState("");
  const [packageText, setPackageText] = useState("");

  // Dropdown visibility
  const [showLco, setShowLco] = useState(false);
  const [showReseller, setShowReseller] = useState(false);
  const [showZone, setShowZone] = useState(false);
  const [showPackage, setShowPackage] = useState(false);

  // SubZone
  const [subZones, setSubZones] = useState([]);
  const [subZoneText, setSubZoneText] = useState("");
  const [showSubZone, setShowSubZone] = useState(false);
  const subZoneRef = useRef(null);

  const lcoRef = useRef(null);
  const resellerRef = useRef(null);
  const zoneRef = useRef(null);
  const packageRef = useRef(null);

  // Fetch dropdown data
  useEffect(() => {
    Promise.all([
      getAllLco().then(res => setLcos(res?.data || [])),
      getRetailer().then(res => setResellers(res?.data || [])),
      getZones().then(res => setZones(res?.data || [])),
      getAllSubZones().then(res => setSubZones(res?.data || [])),
      getAllPackageList().then(res => setPackages(res?.data || [])),
    ]).catch(() => { });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (lcoRef.current && !lcoRef.current.contains(e.target)) setShowLco(false);
      if (resellerRef.current && !resellerRef.current.contains(e.target)) setShowReseller(false);
      if (zoneRef.current && !zoneRef.current.contains(e.target)) setShowZone(false);
      if (subZoneRef.current && !subZoneRef.current.contains(e.target)) setShowSubZone(false);
      if (packageRef.current && !packageRef.current.contains(e.target)) setShowPackage(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredLcos = lcos.filter(l => l.lcoName?.toLowerCase().includes(lcoText.toLowerCase()));
  const filteredResellers = resellers.filter(r => r.resellerName?.toLowerCase().includes(resellerText.toLowerCase()));
  const filteredZones = zones.filter(z => z.zoneName?.toLowerCase().includes(zoneText.toLowerCase()));
  const filteredSubZones = subZones.filter(sz => sz.name?.toLowerCase().includes(subZoneText.toLowerCase()));
  const filteredPackages = packages.filter(p => p.name?.toLowerCase().includes(packageText.toLowerCase()));

  const formatDateForBackend = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* User Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User name / ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={filters.userSearch || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, userSearch: e.target.value }))}
            placeholder="Name, Email, Phone..."
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => {
              setFromDate(date);
              setFilters(prev => ({ ...prev, fromDate: formatDateForBackend(date) }));
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => {
              setToDate(date);
              setFilters(prev => ({ ...prev, toDate: formatDateForBackend(date) }));
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            minDate={fromDate}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Zone / Area */}
        <div ref={zoneRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Area</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search area"
            value={zoneText}
            onFocus={() => setShowZone(true)}
            onChange={(e) => {
              setZoneText(e.target.value);
              setShowZone(true);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />
          {showZone && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredZones.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No zones found</div>
              ) : (
                filteredZones.map(zone => (
                  <div
                    key={zone._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setZoneText(zone.zoneName);
                      setFilters(prev => ({ ...prev, areaId: zone._id }));
                      setShowZone(false);
                    }}
                  >
                    {zone.zoneName}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* SubZone */}
        <div ref={subZoneRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Zone
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search zone"
            value={subZoneText}
            onFocus={() => setShowSubZone(true)}
            onChange={(e) => {
              setSubZoneText(e.target.value);
              setShowSubZone(true);
            }}
          />

          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showSubZone && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredSubZones.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No subzones found</div>
              ) : (
                filteredSubZones.map(sz => (
                  <div
                    key={sz._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setSubZoneText(sz.name);
                      setFilters(prev => ({
                        ...prev,
                        subZoneId: sz._id,
                      }));
                      setShowSubZone(false);
                    }}
                  >
                    {sz.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>


        {/* Reseller */}
        <div ref={resellerRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Reseller</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search Reseller"
            value={resellerText}
            onFocus={() => setShowReseller(true)}
            onChange={(e) => {
              setResellerText(e.target.value);
              setShowReseller(true);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />
          {showReseller && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredResellers.map(res => (
                <div
                  key={res._id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setResellerText(res.resellerName);
                    setFilters(prev => ({ ...prev, resellerId: res._id }));
                    setShowReseller(false);
                  }}
                >
                  {res.resellerName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LCO */}
        <div ref={lcoRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select LCO</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search LCO"
            value={lcoText}
            onFocus={() => setShowLco(true)}
            onChange={(e) => {
              setLcoText(e.target.value);
              setShowLco(true);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />
          {showLco && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredLcos.map(lco => (
                <div
                  key={lco._id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setLcoText(lco.lcoName);
                    setFilters(prev => ({ ...prev, lcoId: lco._id }));
                    setShowLco(false);
                  }}
                >
                  {lco.lcoName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package */}
        <div ref={packageRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Package</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search Package"
            value={packageText}
            onFocus={() => setShowPackage(true)}
            onChange={(e) => {
              setPackageText(e.target.value);
              setShowPackage(true);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />
          {showPackage && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredPackages.map(pkg => (
                <div
                  key={pkg._id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setPackageText(pkg.name);
                    setFilters(prev => ({ ...prev, packageId: pkg._id }));
                    setShowPackage(false);
                  }}
                >
                  {pkg.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={filters.status || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="ExtraPaid">Extra Paid</option>
            <option value="Pending">Pending</option>
            <option value="UnPaid">UnPaid</option>
          </select>
        </div>

        {/* Created By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={filters.createdBy || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
            placeholder="Admin/Reseller/LCO name"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => {
            onReset();
            setFromDate(null);
            setToDate(null);
            setZoneText("");
            setSubZoneText("");
            setLcoText("");
            setResellerText("");
            setPackageText("");
          }}
          className="px-6 py-3 bg-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-300"
        >
          <FaSync /> Reset
        </button>
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FaSearch /> Search
        </button>
      </div>
    </div>
  );
};