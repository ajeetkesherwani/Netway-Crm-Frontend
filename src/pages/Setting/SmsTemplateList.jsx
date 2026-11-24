import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getSmsTemplatelist } from "../../service/common";
 
export default function SmsTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
 
  const fetchTemplates = async () => {
    setLoading(true);
    setError("");
 
    try {
      const response = await getSmsTemplatelist();
      if (response?.status === "success") {
        setTemplates(Array.isArray(response?.data?.sms) ? response.data.sms : []);
      } else {
        throw new Error(response?.message || "Failed to load SMS templates");
      }
    } catch (err) {
      setError(err.message || "Failed to load SMS templates");
      toast.error(err.message || "Failed to load SMS templates");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchTemplates();
  }, []);
 
  const handleSearch = () => {
    setAppliedSearch(searchTerm.trim().toLowerCase());
  };
 
  const exportToExcel = () => {
    if (templates.length === 0) {
      toast.error("No data to export");
      return;
    }
 
    const data = templates.map((template, index) => ({
      "S.No": index + 1,
      "Template ID": template.templateId || "",
      "Template Name": template.templateName || "",
      Category: template.category || "",
      Content: template.content || "",
      Variables: Array.isArray(template.variables) ? template.variables.join(", ") : "",
    }));
 
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SMS Templates");
    XLSX.writeFile(workbook, "sms_templates.xlsx");
    toast.success("Exported successfully!");
  };
 
  const displayedTemplates = templates.filter((template) => {
    if (!appliedSearch) return true;
 
    return [template.templateId, template.templateName, template.category, template.content]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(appliedSearch));
  });
 
  if (loading) {
    return <p className="p-6 text-gray-600">Loading SMS templates...</p>;
  }
 
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-800 leading-tight">
          SMS Templates
        </h1>
 
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              placeholder="Search SMS templates..."
              className="px-4 py-2 text-sm outline-none min-w-64"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>
 
          <button
            type="button"
            onClick={exportToExcel}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
          >
            Download as Excel
          </button>
        </div>
      </div>
 
      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
 
      {displayedTemplates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {appliedSearch ? "No matching SMS templates found." : "No SMS templates available."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">S.No</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Template ID</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Template Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Content</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Variables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedTemplates.map((template, index) => (
                  <tr key={template.templateId || index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600 align-top">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 align-top break-all">
                      {template.templateId || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 align-top">
                      {template.templateName || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 min-w-[420px] align-top">
                      {template.content || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {Array.isArray(template.variables) && template.variables.length > 0
                        ? template.variables.map((variable) => (
                            <span
                              key={variable}
                              className="inline-block mr-1 mb-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs"
                            >
                              {`{${variable}}`}
                            </span>
                          ))
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
 
 