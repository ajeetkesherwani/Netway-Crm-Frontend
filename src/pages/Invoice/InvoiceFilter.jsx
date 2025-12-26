// import { useEffect, useRef, useState } from "react";
// import { FaSearch, FaSync } from "react-icons/fa";
// import { MdArrowDropDown } from "react-icons/md";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import { getAllLco } from "../../service/lco";
// import { getRetailer } from "../../service/retailer";
// import { getZones } from "../../service/apiClient";

// import { getAllPackageList } from "../../service/package";

// export const InvoiceFilters = ({
//   filters,
//   onFilterChange,
//   onSearch,
//   onReset,
// }) => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);

//   // LCO States
//   const [lcos, setLcos] = useState([]);
//   const [lcoText, setLcoText] = useState("");
//   const [showLco, setShowLco] = useState(false);
//   const lcoRef = useRef(null);

//   // Reseller States
//   const [resellers, setResellers] = useState([]);
//   const [resellerText, setResellerText] = useState("");
//   const [showReseller, setShowReseller] = useState(false);
//   const resellerRef = useRef(null);

//   // Zone / Area States
//   const [zones, setZones] = useState([]);
//   const [zoneText, setZoneText] = useState("");
//   const [showZone, setShowZone] = useState(false);
//   const zoneRef = useRef(null);

//   // Package States
//   const [packages, setPackages] = useState([]);
//   const [packageText, setPackageText] = useState("");
//   const [showPackage, setShowPackage] = useState(false);
//   const packageRef = useRef(null);

//   /* ───────────── FETCH DATA ───────────── */
//   useEffect(() => {
//     // Fetch LCOs
//     getAllLco()
//       .then((res) => setLcos(res?.data || []))
//       .catch(() => setLcos([]));

//     // Fetch Resellers
//     getRetailer()
//       .then((res) => setResellers(res?.data || []))
//       .catch(() => setResellers([]));

//     // Fetch Zones/Areas
//     getZones()
//       .then((res) => setZones(res?.data || res || []))
//       .catch(() => setZones([]));

//     // Fetch Packages
//     getAllPackageList()
//       .then((res) => setPackages(res?.data || []))
//       .catch(() => setPackages([]));
//   }, []);

//   /* ───────────── CLOSE DROPDOWNS ON OUTSIDE CLICK ───────────── */
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (lcoRef.current && !lcoRef.current.contains(e.target)) setShowLco(false);
//       if (resellerRef.current && !resellerRef.current.contains(e.target))
//         setShowReseller(false);
//       if (zoneRef.current && !zoneRef.current.contains(e.target)) setShowZone(false);
//       if (packageRef.current && !packageRef.current.contains(e.target))
//         setShowPackage(false);
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   /* ───────────── FILTERED LISTS ───────────── */
//   const filteredLcos = lcos.filter((l) =>
//     l.lcoName?.toLowerCase().includes(lcoText.toLowerCase())
//   );

//   const filteredResellers = resellers.filter((r) =>
//     r.resellerName?.toLowerCase().includes(resellerText.toLowerCase())
//   );

//   const filteredZones = zones.filter((z) =>
//     z.zoneName?.toLowerCase().includes(zoneText.toLowerCase())
//   );

//   const filteredPackages = packages.filter((pkg) =>
//     pkg.name?.toLowerCase().includes(packageText.toLowerCase()) // Adjust field name if needed
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//         {/* User Name / ID */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             User name / ID
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.userSearch || ""}
//             onChange={(e) => onFilterChange("userSearch", e.target.value)}
//             placeholder="Username, Name, ID..."
//           />
//         </div>

//         {/* From Date */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             From Date
//           </label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => {
//               setFromDate(date);
//               if (date) {
//                 const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
//                 const formatted = new Date(utcDate).toISOString().split("T")[0];
//                 onFilterChange("fromDate", formatted);
//               } else {
//                 onFilterChange("fromDate", "");
//               }
//             }}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="DD/MM/YYYY"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* To Date */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             To Date
//           </label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => {
//               setToDate(date);
//               if (date) {
//                 const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
//                 const formatted = new Date(utcDate).toISOString().split("T")[0];
//                 onFilterChange("toDate", formatted);
//               } else {
//                 onFilterChange("toDate", "");
//               }
//             }}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="DD/MM/YYYY"
//             minDate={fromDate}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Select Zone / Area */}
//         <div ref={zoneRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Zone / Area
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Search Zone / Area"
//             value={zoneText}
//             onFocus={() => setShowZone(true)}
//             onChange={(e) => {
//               setZoneText(e.target.value);
//               setShowZone(true);
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showZone && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
//               {filteredZones.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No Zone found</div>
//               ) : (
//                 filteredZones.map((zone) => (
//                   <div
//                     key={zone._id}
//                     onClick={() => {
//                       setZoneText(zone.zoneName);
//                       onFilterChange("area", zone.zoneName); // or use zone._id if your backend expects ID
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

//         {/* Select LCO */}
//         <div ref={lcoRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select LCO
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Search LCO"
//             value={lcoText}
//             onFocus={() => setShowLco(true)}
//             onChange={(e) => {
//               setLcoText(e.target.value);
//               setShowLco(true);
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showLco && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
//               {filteredLcos.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No LCO found</div>
//               ) : (
//                 filteredLcos.map((lco) => (
//                   <div
//                     key={lco._id}
//                     onClick={() => {
//                       setLcoText(lco.lcoName);
//                       onFilterChange("lcoId", lco._id);
//                       setShowLco(false);
//                     }}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                   >
//                     {lco.lcoName}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Select Reseller */}
//         <div ref={resellerRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Reseller
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Search Reseller"
//             value={resellerText}
//             onFocus={() => setShowReseller(true)}
//             onChange={(e) => {
//               setResellerText(e.target.value);
//               setShowReseller(true);
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showReseller && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
//               {filteredResellers.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No Reseller found</div>
//               ) : (
//                 filteredResellers.map((res) => (
//                   <div
//                     key={res._id}
//                     onClick={() => {
//                       setResellerText(res.resellerName);
//                       onFilterChange("resellerId", res._id);
//                       setShowReseller(false);
//                     }}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                   >
//                     {res.resellerName}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Select Package */}
//         <div ref={packageRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Package
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Search Package"
//             value={packageText}
//             onFocus={() => setShowPackage(true)}
//             onChange={(e) => {
//               setPackageText(e.target.value);
//               setShowPackage(true);
//             }}
//           />
//           <MdArrowDropDown className="absolute right-3 top-9 text-gray-500 pointer-events-none" />

//           {showPackage && (
//             <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
//               {filteredPackages.length === 0 ? (
//                 <div className="px-4 py-2 text-gray-500">No Package found</div>
//               ) : (
//                 filteredPackages.map((pkg) => (
//                   <div
//                     key={pkg._id}
//                     onClick={() => {
//                       setPackageText(pkg.name);
//                       onFilterChange("packageId", pkg._id); 
//                       setShowPackage(false);
//                     }}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                   >
//                     {pkg.name}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.status || ""}
//             onChange={(e) => onFilterChange("status", e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="active">Paid</option>
//             <option value="expired">Extra Paid</option>
//             <option value="pending">Partial</option>
//             <option value="cancelled">UnPaid</option>
//           </select>
//         </div>

//         {/* Recharge Status */}
//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Recharge Status
//           </label>
//           <select
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.rechargeStatus || ""}
//             onChange={(e) => onFilterChange("rechargeStatus", e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="success">Success</option>
//             <option value="failed">Failed</option>
//             <option value="pending">Pending</option>
//           </select>
//         </div> */}

//         {/* Created By */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Created By
//           </label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={filters.createdBy || ""}
//             onChange={(e) => onFilterChange("createdBy", e.target.value)}
//             placeholder="Name or ID"
//           />
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button
//           onClick={onReset}
//           className="px-6 py-3 bg-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition"
//         >
//           <FaSync /> Reset
//         </button>

//         <button
//           onClick={onSearch}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
//         >
//           <FaSearch /> Search
//         </button>
//       </div>
//     </div>
//   );
// };


import { useEffect, useRef, useState } from "react";
import { FaSearch, FaSync } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getAllLco } from "../../service/lco";
import { getRetailer } from "../../service/retailer";
import { getZones } from "../../service/apiClient";
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
      getAllPackageList().then(res => setPackages(res?.data || [])),
    ]).catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (lcoRef.current && !lcoRef.current.contains(e.target)) setShowLco(false);
      if (resellerRef.current && !resellerRef.current.contains(e.target)) setShowReseller(false);
      if (zoneRef.current && !zoneRef.current.contains(e.target)) setShowZone(false);
      if (packageRef.current && !packageRef.current.contains(e.target)) setShowPackage(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredLcos = lcos.filter(l => l.lcoName?.toLowerCase().includes(lcoText.toLowerCase()));
  const filteredResellers = resellers.filter(r => r.resellerName?.toLowerCase().includes(resellerText.toLowerCase()));
  const filteredZones = zones.filter(z => z.zoneName?.toLowerCase().includes(zoneText.toLowerCase()));
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Zone / Area</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Search Zone"
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
            <option value="active">Paid</option>
            <option value="expired">Extra Paid</option>
            <option value="pending">Partial</option>
            <option value="cancelled">UnPaid</option>
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