// import { FaSearch, FaSync } from "react-icons/fa";
// import { MdArrowDropDown } from "react-icons/md";
// import { useEffect, useRef, useState } from "react";
// import { getAllLco } from "../../service/lco";
// import { getRetailer } from "../../service/retailer";
// import { getZones } from "../../service/apiClient";
// import { getCategoryList } from "../../service/category"
// import DatePicker from "react-datepicker";

// export default function TicketFilter({ filters, onFilterChange, onSearch, onReset }) {
//   const handleChange = (key, value) => {
//     onFilterChange(key, value);
//   };

//   const [fromDate, setFromDate] = useState(null);
// const [toDate, setToDate] = useState(null);

//   /* ───────────── LCO STATES ───────────── */
//   const [lcos, setLcos] = useState([]);
//   const [lcoText, setLcoText] = useState("");
//   const [showLco, setShowLco] = useState(false);
//   const lcoRef = useRef(null);

//   /* ───────────── RESELLER STATES ───────────── */
//   const [resellers, setResellers] = useState([]);
//   const [resellerText, setResellerText] = useState("");
//   const [showReseller, setShowReseller] = useState(false);
//   const resellerRef = useRef(null);

//   /* ───────────── ZONE STATES ───────────── */
//   const [zones, setZones] = useState([]);
//   const [zoneText, setZoneText] = useState("");
//   const [showZone, setShowZone] = useState(false);
//   const zoneRef = useRef(null);

//   /*-----------------Category-----------------*/
//   const [categoryes, setCatagoryes] = useState([]);
//   const [categoryText, setCategoryText] = useState("");
//   const [showCategory, setShowCatagory] = useState(false);
//   const categoryRef = useRef(null);

//   /* ───────────── FETCH DATA ───────────── */
//   useEffect(() => {
//     getAllLco().then(res => setLcos(res?.data || []));
//     getRetailer().then(res => setResellers(res?.data || []));
//     getZones().then(res => setZones(res?.data || res || []));
//     getCategoryList().then(res => setCatagoryes(res?.data || []));
//   }, []);

//   /* ───────────── OUTSIDE CLICK CLOSE ───────────── */
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (lcoRef.current && !lcoRef.current.contains(e.target)) setShowLco(false);
//       if (resellerRef.current && !resellerRef.current.contains(e.target)) setShowReseller(false);
//       if (zoneRef.current && !zoneRef.current.contains(e.target)) { setShowZone(false); }
//       if (categoryRef.current && !categoryRef.current.contains(e.target)) { setShowCatagory(false); }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const filteredLcos = lcos.filter(l =>
//     l.lcoName?.toLowerCase().includes(lcoText.toLowerCase())
//   );

//   const filteredResellers = resellers.filter(r =>
//     r.resellerName?.toLowerCase().includes(resellerText.toLowerCase())
//   );

//   const filteredZones = zones.filter(z =>
//     z.zoneName?.toLowerCase().includes(zoneText.toLowerCase())
//   );

//   const filteredCategoryes = categoryes.filter(c =>
//     c.name?.toLowerCase().includes(categoryText.toLocaleLowerCase())
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">

//         {/* User */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             User name/No./Email
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.userMobile || ""}
//             onChange={(e) => handleChange("userMobile", e.target.value)}
//             placeholder="Please Select"
//           />
//         </div>

//         {/* Ticket No */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Ticket No.
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.ticketNo || ""}
//             onChange={(e) => handleChange("ticketNo", e.target.value)}
//             placeholder="Please Select"
//           />
//         </div>

//         {/* From Date */}
//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Ticket Create Date
//           </label>
//           <input
//             type="date"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//             value={filters.fromDate || ""}
//             onChange={(e) => handleChange("fromDate", e.target.value)}
//           />
//         </div> */}
//         {/* From Date */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Ticket Create Date
//   </label>
//   <DatePicker
//     selected={fromDate}
//     onChange={(date) => {
//       setFromDate(date);
//       handleChange("fromDate", date);
//     }}
//     dateFormat="dd/MM/yyyy"
//     placeholderText="DD/MM/YYYY"
//     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//   />
// </div>

//         {/* To Date */}

// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Ticket Close Date
//   </label>
//   <DatePicker
//     selected={toDate}
//     onChange={(date) => {
//       setToDate(date);
//       handleChange("toDate", date);
//     }}
//     dateFormat="dd/MM/yyyy"
//     placeholderText="DD/MM/YYYY"
//     minDate={fromDate}
//     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//   />
// </div>

//         {/* ───────────── ZONE SEARCHABLE ───────────── */}
//         <div ref={zoneRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Zones
//           </label>

//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Select Area"
//             value={zoneText}
//             onFocus={() => setShowZone(true)}
//             onChange={(e) => {
//               setZoneText(e.target.value);
//               setShowZone(true);
//               handleChange("area", "");
//             }}
//           />

//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showZone && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
//               {filteredZones.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No Zone found</div>
//               ) : (
//                 filteredZones.map((zone) => (
//                   <div
//                     key={zone._id}
//                     onClick={() => {
//                       setZoneText(zone.zoneName);
//                       handleChange("area", zone._id);
//                       setShowZone(false);
//                     }}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                   >
//                     {zone.zoneName}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Resolved By */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Resolved By
//           </label>
//           <select
//             value={filters.resolvedBy || ""}
//             onChange={(e) => handleChange("resolvedBy", e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Please Select</option>
//           </select>
//         </div>

//         {/* ───────────── CATEGORY SEARCHABLE ───────────── */}
//         <div ref={categoryRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Category
//           </label>

//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Select Category"
//             value={categoryText}
//             onFocus={() => setShowCatagory(true)}
//             onChange={(e) => {
//               setCategoryText(e.target.value);
//               setShowCatagory(true);
//               handleChange("category", "");
//             }}
//           />

//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showCategory && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
//               {filteredCategoryes.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No Category found</div>
//               ) : (
//                 filteredCategoryes.map((cat) => (
//                   <div
//                     key={cat._id}
//                     onClick={() => {
//                       setCategoryText(cat.name);
//                       handleChange("category", cat._id);
//                       setShowCatagory(false);
//                     }}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                   >
//                     {cat.name}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Assigned To */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Assigned To
//           </label>
//           <select
//             value={filters.assignedTo || ""}
//             onChange={(e) => handleChange("assignedTo", e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Please Select</option>
//           </select>
//         </div>

//         {/* Call Source */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Call Source
//           </label>
//           <select
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//             value={filters.callSource || ""}
//             onChange={(e) => handleChange("callSource", e.target.value)}
//           >
//             <option value="">Please Select</option>
//             <option>Phone</option>
//             <option>Email</option>
//             <option>MobileApp</option>
//             <option>Web</option>
//           </select>
//         </div>

//         {/* ───────────── LCO SEARCHABLE (UI SAME) ───────────── */}
//         <div ref={lcoRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select LCO
//           </label>

//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Please Select"
//             value={lcoText}
//             onFocus={() => setShowLco(true)}
//             onChange={(e) => {
//               setLcoText(e.target.value);
//               setShowLco(true);
//               handleChange("lcoId", "");
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showLco && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
//               {filteredLcos.map(lco => (
//                 <div
//                   key={lco._id}
//                   onClick={() => {
//                     setLcoText(lco.lcoName);
//                     handleChange("lcoId", lco._id);
//                     setShowLco(false);
//                   }}
//                   className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {lco.lcoName}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ───────────── RESELLER SEARCHABLE (UI SAME) ───────────── */}
//         <div ref={resellerRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Reseller
//           </label>

//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Please Select"
//             value={resellerText}
//             onFocus={() => setShowReseller(true)}
//             onChange={(e) => {
//               setResellerText(e.target.value);
//               setShowReseller(true);
//               handleChange("resellerId", "");
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showReseller && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
//               {filteredResellers.map(res => (
//                 <div
//                   key={res._id}
//                   onClick={() => {
//                     setResellerText(res.resellerName);
//                     handleChange("resellerId", res._id);
//                     setShowReseller(false);
//                   }}
//                   className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {res.resellerName}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Select Area */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Zones
//           </label>
//           <select
//             value={filters.area || ""}
//             onChange={(e) => handleChange("area", e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Area</option>
//             {/* Populate from API */}
//           </select>
//         </div>

//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button
//           onClick={onReset}
//           className="px-6 py-3 bg-gray-200 rounded-lg flex items-center gap-2"
//         >
//           <FaSync /> Reset
//         </button>

//         <button
//           onClick={onSearch}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"
//         >
//           <FaSearch /> Search
//         </button>
//       </div>
//     </div>
//   );
// }

import { FaSearch, FaSync } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLcos } from "../../service/lco";
import { getRetailers } from "../../service/retailer";
import { getZones } from "../../service/apiClient";
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

  /* ───────────── FETCH DATA ───────────── */
  useEffect(() => {
    // getAllLco().then((res) => setLcos(res?.data || []));
    // getRetailer().then((res) => setResellers(res?.data || []));
    getZones().then((res) => setZones(res?.data || res || []));
    getCategoryList().then((res) => setCatagoryes(res?.data || []));
  }, []);

  /* ───────────── OUTSIDE CLICK CLOSE ───────────── */
  useEffect(() => {
    const handleClick = (e) => {
      if (zoneRef.current && !zoneRef.current.contains(e.target))
        setShowZone(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setShowCatagory(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

  // const loadCategories = useCallback(
  //   async ({ search = "", page = 1, limit = 7 }) => {
  //     try {
  //       const res = await getCategoryList({
  //         search,
  //         page,
  //         limit,
  //       });
  //       return res.data || [];
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  //   []
  // );

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

  const handleOnSearch = () => {
    const sp = new URLSearchParams();
    if (fromDate) sp.set("fromDate", convertUTCDateToYYYYMMDD(fromDate));
    if (toDate) sp.set("toDate", convertUTCDateToYYYYMMDD(toDate));
    if (search.trim()) sp.set("userSearch", search.trim());
    if (ticketNumber.trim()) sp.set("ticketNumber", ticketNumber.trim());
    if (selectedCategory) sp.set("category", selectedCategory._id);
    if (selectedZone) sp.set("zoneId", selectedZone?._id);
    if (selectedLco) sp.set("lcoId", selectedLco?._id);
    if (selectedReseller) sp.set("resellerId", selectedReseller?._id);
    if (callSource.trim()) sp.set("callSource", callSource.trim());

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
              // if (date) {
              //   // Use UTC to prevent timezone shift
              //   const utcDate = Date.UTC(
              //     date.getFullYear(),
              //     date.getMonth(),
              //     date.getDate()
              //   );
              //   const formatted = new Date(utcDate).toISOString().split("T")[0];
              //   handleChange("fromDate", formatted);
              // } else {
              //   handleChange("fromDate", "");
              // }
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
              // if (date) {
              //   // Use UTC to prevent timezone shift
              //   const utcDate = Date.UTC(
              //     date.getFullYear(),
              //     date.getMonth(),
              //     date.getDate()
              //   );
              //   const formatted = new Date(utcDate).toISOString().split("T")[0];
              //   handleChange("toDate", formatted);
              // } else {
              //   handleChange("toDate", "");
              // }
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
            Select Zones
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
        {/* <div ref={categoryRef} className="relative">
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
              handleChange("category", e.target.value);
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
                      handleChange("category", cat._id);
                      setShowCatagory(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {cat.name}
                  </div>
                ))
              )}
            </div>
          )}
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

        {/* ───────────── LCO SEARCHABLE (UI SAME) ───────────── */}
        {/* <div ref={lcoRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select LCO
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Please Select"
            value={lcoText}
            onFocus={() => setShowLco(true)}
            onChange={(e) => {
              setLcoText(e.target.value);
              setShowLco(true);
              handleChange("lcoId", e.target.value);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showLco && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
              {filteredLcos.map((lco) => (
                <div
                  key={lco._id}
                  onClick={() => {
                    setLcoText(lco.lcoName);
                    handleChange("lcoId", lco._id);
                    setShowLco(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {lco.lcoName}
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* ───────────── RESELLER SEARCHABLE (UI SAME) ───────────── */}
        {/* <div ref={resellerRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Reseller
          </label>

          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Please Select"
            value={resellerText}
            onFocus={() => setShowReseller(true)}
            onChange={(e) => {
              setResellerText(e.target.value);
              setShowReseller(true);
              handleChange("resellerId", e.target.value);
            }}
          />
          <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

          {showReseller && (
            <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow">
              {filteredResellers.map((res) => (
                <div
                  key={res._id}
                  onClick={() => {
                    setResellerText(res.resellerName);
                    handleChange("resellerId", res._id);
                    setShowReseller(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {res.resellerName}
                </div>
              ))}
            </div>
          )}
        </div> */}

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
      

        {/* Select Area */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Zones
          </label>
          <select
            value={filters.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Area</option>
          </select>
        </div> */}
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
