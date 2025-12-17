import AsyncLcoSelect from "./AsyncLcoSelect";
import AsyncResellerSelect from "./AsyncResellerSelect";
import DatePicker from "react-datepicker";

export default function CustomerFilters({ filters, setSearchParams }) {
  const updateParam = (key, value) => {
    const params = new URLSearchParams(filters);
    if (!value) params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-sm">
      <input
        placeholder="Search name / email / phone"
        value={filters.searchQuery}
        onChange={(e) => updateParam("searchQuery", e.target.value)}
        className="border p-1 rounded"
      />

      <select
        value={filters.status}
        onChange={(e) => updateParam("status", e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Suspend">Suspend</option>
      </select>

      <select
        value={filters.ekyc}
        onChange={(e) => updateParam("ekyc", e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">All eKYC</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <select
        value={filters.serviceOpted}
        onChange={(e) => updateParam("serviceOpted", e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">All Services</option>
        <option value="intercom">Intercom</option>
        <option value="broadband">Broadband</option>
        <option value="corporate">Corporate</option>
      </select>

      <DatePicker
        selected={filters.startDate}
        onChange={(date) =>
          updateParam("startDate", date ? new Date(date).toISOString() : "")
        }
        placeholderText="Start Date"
        dateFormat="yyyy-MM-dd"
        className="border p-1 rounded w-full text-sm"
        isClearable
      />

      <DatePicker
        selected={filters.endDate}
        onChange={(date) =>
          updateParam("endDate", date ? new Date(date).toISOString() : "")
        }
        placeholderText="End Date"
        dateFormat="yyyy-MM-dd"
        className="border p-1 rounded w-full"
        isClearable
      />

      <AsyncResellerSelect
        value={filters.reseller}
        onSelect={(id) => updateParam("reseller", id)}
      />

      <AsyncLcoSelect
        value={filters.lco}
        onSelect={(id) => updateParam("lco", id)}
      />
    </div>
  );
}
