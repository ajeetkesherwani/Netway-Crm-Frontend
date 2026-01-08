import { FaSearch, FaSync } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLcos } from "../../service/lco";
import { getRetailers } from "../../service/retailer";
import { getZones } from "../../service/apiClient";
import { getAllSubZones } from "../../service/apiClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectorWithSearchAndPagination from "../../components/SelectorWithSearchAndPagination";
import { convertUTCDateToYYYYMMDD } from "../../utils/convertUTCtoLocalDate";

export default function PaymentFilter({ setSearchParams }) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  // Selected values (store full object for _id)
  const [selectedLco, setSelectedLco] = useState(null);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  // Dropdown search text
  const [areaText, setAreaText] = useState("");
  const [zoneText, setZoneText] = useState("");
  const [showArea, setShowArea] = useState(false);
  const [showZone, setShowZone] = useState(false);

  // Data
  const [areas, setAreas] = useState([]); // subzones
  const [zones, setZones] = useState([]);

  const areaRef = useRef(null);
  const zoneRef = useRef(null);

  /* ───────────── FETCH DATA ───────────── */
  useEffect(() => {
    getZones().then((res) => setZones(res?.data || res || []));
    getAllSubZones().then((res) => setAreas(res?.data || res || []));
  }, []);

  /* ───────────── OUTSIDE CLICK CLOSE ───────────── */
  useEffect(() => {
    const handleClick = (e) => {
      if (areaRef.current && !areaRef.current.contains(e.target)) setShowArea(false);
      if (zoneRef.current && !zoneRef.current.contains(e.target)) setShowZone(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ───────────── FILTERING ───────────── */
  const filteredAreas = areas.filter((a) =>
    a.name?.toLowerCase().includes(areaText.toLowerCase())
  );

  const filteredZones = zones.filter((z) =>
    z.zoneName?.toLowerCase().includes(zoneText.toLowerCase())
  );

  /* ───────────── PAGINATED SELECTORS ───────────── */
  const loadLcos = useCallback(async ({ search = "", page = 1, limit = 10 }) => {
    try {
      const res = await getLcos({ search, page, limit });
      return res.data || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  }, []);

  const loadResellers = useCallback(async ({ search = "", page = 1, limit = 10 }) => {
    try {
      const res = await getRetailers({ search, page, limit });
      return res.data || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  }, []);

  /* ───────────── SELECTION HANDLERS ───────────── */
  const handleOnSelectLco = (lco) => setSelectedLco(lco);
  const handleOnSelectReseller = (reseller) => setSelectedReseller(reseller);

  const handleOnSelectArea = (area) => {
    setAreaText(area.name);
    setSelectedArea(area);
    setShowArea(false);
  };

  const handleOnSelectZone = (zone) => {
    setZoneText(zone.zoneName);
    setSelectedZone(zone);
    setShowZone(false);
  };

  /* ───────────── RESET ───────────── */
  const handleOnReset = () => {
    setFromDate(null);
    setToDate(null);
    setName("");
    setStatus("");
    setSelectedLco(null);
    setSelectedReseller(null);
    setSelectedArea(null);
    setSelectedZone(null);
    setAreaText("");
    setZoneText("");

    setSearchParams(new URLSearchParams());
  };

  /* ───────────── SEARCH ───────────── */
  const handleOnSearch = () => {
    const sp = new URLSearchParams();

    if (fromDate) sp.set("fromDate", convertUTCDateToYYYYMMDD(fromDate));
    if (toDate) sp.set("toDate", convertUTCDateToYYYYMMDD(toDate));
    if (name.trim()) sp.set("name", name.trim());
    if (status) sp.set("status", status);
    if (selectedArea?._id) sp.set("zone", selectedArea._id);
    if (selectedZone?._id) sp.set("area", selectedZone._id);
    // if (selectedArea?._id) sp.set("area", selectedArea._id);
    // if (selectedZone?._id) sp.set("zone", selectedZone._id);
    if (selectedLco?._id) sp.set("lco", selectedLco._id);
    if (selectedReseller?._id) sp.set("reseller", selectedReseller._id);

    setSearchParams(sp);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* User Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Name / Mobile / Email
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name, mobile or email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            minDate={fromDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            {/* Add more if needed */}
          </select>
        </div>

        {/* Zone */}
        <div ref={zoneRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone
          </label>
          <input
            type="text"
            value={zoneText}
            onChange={(e) => {
              setZoneText(e.target.value);
              setShowZone(true);
            }}
            onFocus={() => setShowZone(true)}
            placeholder="Select Zone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showZone && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredZones.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No zone found</div>
              ) : (
                filteredZones.map((zone) => (
                  <div
                    key={zone._id}
                    onClick={() => handleOnSelectZone(zone)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {zone.zoneName}
                  </div>
                ))
              )}
              {zoneText && (
                <div
                  onClick={() => {
                    setZoneText("");
                    setSelectedZone(null);
                    setShowZone(false);
                  }}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer border-t"
                >
                  Clear Zone
                </div>
              )}
            </div>
          )}
        </div>

          {/* Area (SubZone) */}
        <div ref={areaRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <input
            type="text"
            value={areaText}
            onChange={(e) => {
              setAreaText(e.target.value);
              setShowArea(true);
            }}
            onFocus={() => setShowArea(true)}
            placeholder="Select Area"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showArea && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredAreas.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No area found</div>
              ) : (
                filteredAreas.map((area) => (
                  <div
                    key={area._id}
                    onClick={() => handleOnSelectArea(area)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {area.name}
                  </div>
                ))
              )}
              {areaText && (
                <div
                  onClick={() => {
                    setAreaText("");
                    setSelectedArea(null);
                    setShowArea(false);
                  }}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer border-t"
                >
                  Clear Area
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reseller */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reseller
          </label>
          <SelectorWithSearchAndPagination
            valKey="resellerName"
            placeholder="Select Reseller"
            selected={selectedReseller}
            onSelect={handleOnSelectReseller}
            getDetails={loadResellers}
            inputClassName="py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4"
          />
        </div>

        {/* LCO */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LCO
          </label>
          <SelectorWithSearchAndPagination
            valKey="lcoName"
            placeholder="Select LCO"
            selected={selectedLco}
            onSelect={handleOnSelectLco}
            getDetails={loadLcos}
            inputClassName="py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleOnReset}
          className="px-6 py-3 bg-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition"
        >
          <FaSync /> Reset
        </button>

        <button
          onClick={handleOnSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaSearch /> Search
        </button>
      </div>
    </div>
  );
}