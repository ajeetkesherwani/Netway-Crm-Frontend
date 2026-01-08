// import AsyncLcoSelect from "./AsyncLcoSelect";
// import AsyncResellerSelect from "./AsyncResellerSelect";
// import AsyncAreaSelect from "./AsyncAreaSelect";
// import AsyncSubZoneSelect from "./AsyncSubZoneSelect";
// import DatePicker from "react-datepicker";

// export default function CustomerFilters({ filters, setSearchParams }) {
//   const updateParam = (key, value) => {
//   const params = new URLSearchParams(window.location.search);

//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     params.delete(key);
//   } else {
//     params.set(key, value);
//   }

//   setSearchParams(params);
// };
//   // const updateParam = (key, value) => {
//   //   const params = new URLSearchParams(filters);
//   //   if (!value) params.delete(key);
//   //   else params.set(key, value);
//   //   setSearchParams(params);
//   // };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-sm">
//       {/* Search */}
//       <input
//         placeholder="Search name / email / phone"
//         value={filters.searchQuery || ""}
//         onChange={(e) => updateParam("searchQuery", e.target.value)}
//         className="border p-1 rounded"
//       />

//       {/* Status */}
//       <select
//         value={filters.status || ""}
//         onChange={(e) => updateParam("status", e.target.value)}
//         className="border p-1 rounded"
//       >
//         <option value="">All Status</option>
//         <option value="active">Active</option>
//         <option value="Inactive">Inactive</option>
//         <option value="Suspend">Suspend</option>
//       </select>

//       {/* eKYC */}
//       <select
//         value={filters.ekyc || ""}
//         onChange={(e) => updateParam("ekyc", e.target.value)}
//         className="border p-1 rounded"
//       >
//         <option value="">All eKYC</option>
//         <option value="yes">Yes</option>
//         <option value="no">No</option>
//       </select>

//       {/* Service */}
//       <select
//         value={filters.serviceOpted || ""}
//         onChange={(e) => updateParam("serviceOpted", e.target.value)}
//         className="border p-1 rounded"
//       >
//         <option value="">All Services</option>
//         <option value="intercom">Intercom</option>
//         <option value="broadband">Broadband</option>
//         <option value="corporate">Corporate</option>
//       </select>

//       {/* Start Date */}
//       <DatePicker
//         selected={filters.startDate ? new Date(filters.startDate) : null}
//         onChange={(date) =>
//           updateParam("startDate", date ? date.toISOString() : "")
//         }
//         placeholderText="Start Date"
//         dateFormat="yyyy-MM-dd"
//         className="border p-1 rounded w-full"
//         isClearable
//       />

//       {/* End Date */}
//       <DatePicker
//         selected={filters.endDate ? new Date(filters.endDate) : null}
//         onChange={(date) =>
//           updateParam("endDate", date ? date.toISOString() : "")
//         }
//         placeholderText="End Date"
//         dateFormat="yyyy-MM-dd"
//         className="border p-1 rounded w-full"
//         isClearable
//       />

//       {/* Area */}
//       <AsyncAreaSelect
//         value={filters.area}
//         onSelect={(id) => {
//           updateParam("area", id);
//           updateParam("subZone", ""); // reset subzone on area change
//         }}
//       />

//       {/* SubZone */}
//       <AsyncSubZoneSelect
//         areaId={filters.area}
//         value={filters.subZone}
//         onSelect={(id) => updateParam("subZone", id)}
//       />

//       {/* CAF Form */}
//       <select
//         value={filters.cafUploaded || ""}
//         onChange={(e) => updateParam("cafUploaded", e.target.value)}
//         className="border p-1 rounded"
//       >
//         <option value="">CAF Form</option>
//         <option value="yes">Uploaded</option>
//         <option value="no">Not Uploaded</option>
//       </select>

//       {/* Reseller */}
//       <AsyncResellerSelect
//         value={filters.reseller}
//         onSelect={(id) => updateParam("reseller", id)}
//       />

//       {/* LCO */}
//       <AsyncLcoSelect
//         value={filters.lco}
//         onSelect={(id) => updateParam("lco", id)}
//       />
//     </div>
//   );
// }


import AsyncLcoSelect from "./AsyncLcoSelect";
import AsyncResellerSelect from "./AsyncResellerSelect";
import AsyncAreaSelect from "./AsyncAreaSelect";
import AsyncSubZoneSelect from "./AsyncSubZoneSelect";
import DatePicker from "react-datepicker";

export default function CustomerFilters({ filters, setSearchParams }) {
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
          <option value="">All Services</option>
          <option value="intercom">Intercom</option>
          <option value="broadband">Broadband</option>
          <option value="corporate">Corporate</option>
        </select>

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
