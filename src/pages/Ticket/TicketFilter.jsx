import { FaSearch, FaSync } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLcos } from "../../service/lco";
import { getRetailers } from "../../service/retailer";
import { getZones, getAllSubZones } from "../../service/apiClient";
import { getCategoryList } from "../../service/category";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectorWithSearchAndPagination from "../../components/SelectorWithSearchAndPagination";
import { convertUTCDateToYYYYMMDD } from "../../utils/convertUTCtoLocalDate";

export default function TicketFilter({ setSearchParams }) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  /* ───────────── ZONE STATES ───────────── */
  const [zones, setZones] = useState([]);
  const [zoneText, setZoneText] = useState("");
  const [showZone, setShowZone] = useState(false);
  const zoneRef = useRef(null);

  /* ───────────── SUBZONE STATES ───────────── */
  const [subZones, setSubZones] = useState([]);
  const [subZoneText, setSubZoneText] = useState("");
  const [showSubZone, setShowSubZone] = useState(false);
  const subZoneRef = useRef(null);
  console.log("SubZones:", subZones);

  /*-----------------Category-----------------*/
  const [categoryes, setCatagoryes] = useState([]);
  const [categoryText, setCategoryText] = useState("");
  const [showCategory, setShowCatagory] = useState(false);
  const categoryRef = useRef(null);

  const [search, setSearch] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [callSource, setCallSource] = useState("");

  const [selectedLco, setSelectedLco] = useState(null);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSubZone, setSelectedSubZone] = useState(null);
  const [resolvedBy, setResolvedBy] = useState("");

  /* ───────────── FETCH DATA ───────────── */
  useEffect(() => {
    // getAllLco().then((res) => setLcos(res?.data || []));
    // getRetailer().then((res) => setResellers(res?.data || []));
    getZones().then((res) => setZones(res?.data || res || []));
    getCategoryList().then((res) => setCatagoryes(res?.data || []));
    getAllSubZones().then((res) => setSubZones(res?.data || []));
  }, []);

  /* ───────────── OUTSIDE CLICK CLOSE ───────────── */
  useEffect(() => {
    const handleClick = (e) => {
      if (zoneRef.current && !zoneRef.current.contains(e.target))
        setShowZone(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setShowCatagory(false);
      if (subZoneRef.current && !subZoneRef.current.contains(e.target))
        setShowSubZone(false);
    };
    // document.addEventListener("mousedown", handleClick);
    // return () => document.removeEventListener("mousedown", handleClick);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);


  // const filteredLcos = lcos.filter((l) =>
  //   l.lcoName?.toLowerCase().includes(lcoText.toLowerCase())
  // );

  // const filteredResellers = resellers.filter((r) =>
  //   r.resellerName?.toLowerCase().includes(resellerText.toLowerCase())
  // );

  const filteredZones = zones.filter((z) =>
    z.zoneName?.toLowerCase().includes(zoneText.toLowerCase())
  );

  const filteredSubZones = subZones.filter((sz) =>
    sz.name?.toLowerCase().includes(subZoneText.toLowerCase())
  );

  const filteredCategoryes = categoryes.filter((c) =>
    c.name?.toLowerCase().includes(categoryText.toLowerCase())
  );

  const handleOnReset = () => {
    setSelectedCategory(null);
    setSelectedLco(null);
    setSelectedZone(null);
    setSelectedReseller(null);
    setCallSource("");
    setCategoryText("");
    setFromDate(null);
    setToDate(null);
    setSearch("");
    setTicketNumber("");
    setZoneText("");
    setSelectedSubZone(null);
    setSubZoneText("");
    setResolvedBy("");
    


    const sp = new URLSearchParams();
    sp.delete("fromDate");
    sp.delete("toDate");
    sp.delete("userSearch");
    sp.delete("ticketNumber");
    sp.delete("category");
    sp.delete("zoneId");
    sp.delete("lcoId");
    sp.delete("resellerId");
    sp.delete("callSource");
    sp.delete("subZoneId");
    sp.delete("fixedBy");

    setSearchParams(sp);
  };

  const loadLcos = useCallback(async ({ search = "", page = 1, limit = 7 }) => {
    try {
      const res = await getLcos({
        search,
        page,
        limit,
      });
      return res.data || [];
    } catch (err) {
      console.log(err);
    }
  }, []);

  const loadResellers = useCallback(
    async ({ search = "", page = 1, limit = 7 }) => {
      try {
        const res = await getRetailers({
          search,
          page,
          limit,
        });
        return res.data || [];
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const handleOnSelectLco = (lco) => {
    setSelectedLco(lco);
  };

  const handleOnSelectReseller = (reseller) => {
    setSelectedReseller(reseller);
  };

  // const handleOnSelectCategory = (category) => {
  //   setSelectedCategory(category);
  // };

  const handleOnSelectZone = (zone) => {
    setSelectedZone(zone);
  };


  const handleOnSelectSubZone = (subZone) => {
    setSelectedSubZone(subZone);
  };



  const handleOnSearch = () => {
    const sp = new URLSearchParams();
    if (fromDate) sp.set("fromDate", convertUTCDateToYYYYMMDD(fromDate));
    if (toDate) sp.set("toDate", convertUTCDateToYYYYMMDD(toDate));
    if (search.trim()) sp.set("userSearch", search.trim());
    if (ticketNumber.trim()) sp.set("ticketNumber", ticketNumber.trim());
    if (selectedCategory) sp.set("category", selectedCategory._id);
    if (selectedZone) sp.set("zoneId", selectedZone?._id);
    if (selectedSubZone) sp.set("subZoneId", selectedSubZone._id);
    if (selectedLco) sp.set("lcoId", selectedLco?._id);
    if (selectedReseller) sp.set("resellerId", selectedReseller?._id);
    if (callSource.trim()) sp.set("callSource", callSource.trim());
    if (resolvedBy.trim()) sp.set("fixedBy", resolvedBy.trim());

    setSearchParams(sp);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-2 md:grid-3 lg:grid-cols-4 xl:grid-6 gap-4">
        {/* UNIFIED USER SEARCH FIELD — LOOKS EXACTLY LIKE YOUR OLD ONE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User name/No./Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type name, mobile or email..."
          />
        </div>

        {/* Ticket No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket No.
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Please Select"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Create Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => {
              setFromDate(date);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Close Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => {
              setToDate(date);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            minDate={fromDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ───────────── ZONE SEARCHABLE ───────────── */}
        <div ref={zoneRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Area
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Area"
            value={zoneText}
            onFocus={() => setShowZone(true)}
            onChange={(e) => {
              setZoneText(e.target.value);
              setShowZone(true);
            }}
          />

          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showZone && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
              {filteredZones.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No Zone found</div>
              ) : (
                filteredZones.map((zone) => (
                  <div
                    key={zone._id}
                    onClick={() => {
                      setZoneText(zone.zoneName);
                      setShowZone(false);
                      handleOnSelectZone(zone);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {zone.zoneName}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ───────────── SUBZONE SEARCHABLE ───────────── */}
        <div ref={subZoneRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Zone
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Zone"
            value={subZoneText}
            onFocus={() => setShowSubZone(true)}
            onChange={(e) => {
              setSubZoneText(e.target.value);
              setShowSubZone(true);
            }}
          />

          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showSubZone && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
              {filteredSubZones.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No SubZone found</div>
              ) : (
                filteredSubZones.map((sz) => (
                  <div
                    key={sz._id}
                    onClick={() => {
                      setSubZoneText(sz.name);
                      setShowSubZone(false);
                      handleOnSelectSubZone(sz);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {sz.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>


        {/* Resolved By */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resolved By
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.resolvedBy || ""}
            onChange={(e) => handleChange("resolvedBy", e.target.value)}
            placeholder="Enter name"
          />
        </div> */}

        {/* ───────────── CATEGORY SEARCHABLE ───────────── */}
        <div ref={categoryRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Category"
            value={categoryText}
            onFocus={() => setShowCatagory(true)}
            onChange={(e) => {
              setCategoryText(e.target.value);
              setShowCatagory(true);
            }}
          />

          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showCategory && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
              {filteredCategoryes.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No Category found</div>
              ) : (
                filteredCategoryes.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => {
                      setCategoryText(cat.name);
                      setShowCatagory(false);
                      setSelectedCategory(cat);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {cat.name}
                  </div>
                ))
              )}
              {/* Optional: Clear selection */}
              {categoryText && (
                <div
                  onClick={() => {
                    setCategoryText("");
                    setShowCatagory(false);
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer border-t"
                >
                  Clear Category
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>
          <SelectorWithSearchAndPagination
            valKey="name"
            placeholder="Select Category..."
            selected={selectedCategory}
            onSelect={handleOnSelectCategory}
            getDetails={loadResellers}
            className="text-sm min-w-52"
            cancelClassName="p-[1px]"
            inputClassName="py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4"
          />
        </div> */}

        {/* Assigned To */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.assignedTo || ""}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
            placeholder="Enter name"
          />
        </div> */}

        {/* Call Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Source
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={callSource}
            onChange={(e) => setCallSource(e.target.value)}
          >
            <option value="">Please Select</option>
            <option>Phone</option>
            <option>Email</option>
            <option>MobileApp</option>
            <option>Web</option>
          </select>
        </div>

        {/* ───────────── RESELLER SEARCHABLE (UI SAME) ───────────── */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Reseller
          </label>
          <SelectorWithSearchAndPagination
            valKey="resellerName"
            placeholder="Select Reseller..."
            selected={selectedReseller}
            onSelect={handleOnSelectReseller}
            getDetails={loadResellers}
            className="text-sm min-w-52"
            cancelClassName="p-[1px]"
            inputClassName="py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4"
          />
        </div>

        {/* ───────────── LCO SEARCHABLE (UI SAME) ───────────── */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select LCO
          </label>
          <SelectorWithSearchAndPagination
            valKey="lcoName"
            placeholder="Select LCO..."
            selected={selectedLco}
            onSelect={handleOnSelectLco}
            getDetails={loadLcos}
            className="text-sm min-w-52"
            cancelClassName="p-[1px]"
            inputClassName="py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4"
          />
        </div>

        {/* Resolved By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resolved By
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={resolvedBy}
            onChange={(e) => setResolvedBy(e.target.value)}
            placeholder="Type name (Admin / Reseller / LCO / Staff)"
          />
        </div>
      </div>



      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleOnReset}
          className="px-6 py-3 bg-gray-200 rounded-lg flex items-center gap-2"
        >
          <FaSync /> Reset
        </button>

        <button
          onClick={handleOnSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>
      </div>
    </div>
  );
}
