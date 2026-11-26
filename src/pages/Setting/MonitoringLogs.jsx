import { useEffect, useState } from "react";
import { getMonitoringLogs } from "../../service/common";

const TABS = [
  { filter: "activity", label: "Activity Log" },
  { filter: "audit", label: "Audit Logs" },
  { filter: "sms", label: "Sms Log" },
  { filter: "whatsapp", label: "Whatsapp Log" },
];

const EMPTY_FILTERS = {
  search: "",
  staffName: "",
  from: "",
  to: "",
  actorId: "",
};

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

function displayValue(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${displayValue(nestedValue)}`)
      .join(", ");
  }
  return String(value);
}

function displayDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return displayValue(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${day}/${month}/${year} ${time}`;
}

function getActorName(log) {
  const actor = log.actor;
  return displayValue(
    firstValue(
      log.actorName,
      log.userName,
      log.username,
      log.email,
      typeof actor === "object" && actor
        ? firstValue(actor.name, actor.fullName, actor.username, actor.email, actor._id, actor.id)
        : actor,
      log.actorId
    )
  );
}

function getActorRole(log) {
  return firstValue(log.actorRole, log.role, log.actor?.role);
}

function getDetails(log) {
  const detailFields = [
    ["API Path", firstValue(log.apiPath, log.path, log.endpoint)],
    ["Recipient", firstValue(log.recipient, log.phoneNumber)],
    ["Template", firstValue(log.templateName, log.messageTemplate, log.template)],
    ["Provider", firstValue(log.provider, log.providerDetails)],
    ["Message", firstValue(log.message, log.description, log.details)],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  return detailFields.length
    ? detailFields.map(([label, value]) => `${label}: ${displayValue(value)}`).join(" | ")
    : "—";
}

export default function MonitoringLogs() {
  const [activeFilter, setActiveFilter] = useState("activity");
  const [formFilters, setFormFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState({});
  const limit = 25;
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadLogs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMonitoringLogs(
          {
            filter: activeFilter,
            page,
            limit,
            ...appliedFilters,
          },
          { signal: controller.signal }
        );
        if (!Array.isArray(response?.data)) {
          throw new Error("The monitoring logs response did not contain a data list.");
        }

        const resultTotal = Number(response.total) || 0;
        const resultLimit = Number(response.limit) || limit;
        setLogs(response.data);
        setTotal(resultTotal);
        setTotalPages(
          Number(response.totalPages) ||
            Math.ceil(resultTotal / resultLimit)
        );
        setPage(Number(response.page) || page);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setLogs([]);
          setTotal(0);
          setTotalPages(0);
          setError(requestError.message || "Failed to load monitoring logs.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadLogs();
    return () => controller.abort();
  }, [activeFilter, page, appliedFilters]);

  const setFilterValue = (key, value) => {
    setFormFilters((previous) => ({ ...previous, [key]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const nextFilters = Object.fromEntries(
      Object.entries(formFilters).filter(([, value]) => value.trim() !== "")
    );
    setPage(1);
    setAppliedFilters(nextFilters);
  };

  const changeTab = (filter) => {
    setActiveFilter(filter);
    setFormFilters(EMPTY_FILTERS);
    setAppliedFilters({});
    setPage(1);
  };

  const visibleFilters = [
    {
      key: "search",
      label: "Search",
      placeholder: "Name, username, email, or mobile",
    },
    { key: "staffName", label: "Staff Name", placeholder: "Staff name" },
    { key: "actorId", label: "User ID", placeholder: "User ID" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* <h1 className="mb-5 text-xl font-semibold text-gray-800">Monitoring Logs</h1> */}

      <div className="mb-5 overflow-x-auto border-b border-gray-200">
        <div className="flex min-w-max gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.filter}
              type="button"
              onClick={() => changeTab(tab.filter)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                activeFilter === tab.filter
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-transparent bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={activeFilter === tab.filter ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-5 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        {visibleFilters.map(({ key, label, placeholder }) => (
          <label key={key} className="flex flex-col gap-1 text-sm text-gray-600">
            <span>{label}</span>
            <input
              type="text"
              value={formFilters[key]}
              onChange={(event) => setFilterValue(key, event.target.value)}
              placeholder={placeholder}
              className="rounded border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-blue-500"
            />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          <span>From Date</span>
          <input
            type="date"
            value={formFilters.from}
            onChange={(event) => setFilterValue("from", event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-blue-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          <span>To Date</span>
          <input
            type="date"
            value={formFilters.to}
            onChange={(event) => setFilterValue("to", event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-blue-500"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setFormFilters(EMPTY_FILTERS);
              setAppliedFilters({});
              setPage(1);
            }}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div role="alert" className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeFilter === "activity" ? (
        <div className="space-y-2">
          {loading ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-500">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
              No logs found.
            </div>
          ) : (
            logs.map((log, index) => (
              <article
                key={log._id || log.id || `${page}-${index}`}
                className="border border-gray-200 bg-white px-4 py-4 text-sm text-gray-800 shadow-sm sm:px-5"
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {displayDate(firstValue(log.timestamp, log.createdAt, log.date, log.time))}
                </p>
                <p className="break-words whitespace-pre-wrap">
                  <strong>Description:</strong>{" "}
                  {displayValue(firstValue(log.description, log.action, log.event))}
                </p>
                <p>
                  <strong>By:</strong> {getActorName(log)}
                  {getActorRole(log) ? ` (${displayValue(getActorRole(log))})` : ""}
                </p>
                <p>
                  <strong>IP:</strong>{" "}
                  {displayValue(firstValue(log.ip, log.ipAddress))}
                </p>
              </article>
            ))
          )}
        </div>
      ) : activeFilter === "audit" ? (
        <div className="space-y-2">
          {loading ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-500">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
              No logs found.
            </div>
          ) : (
            logs.map((log, index) => {
              const role = getActorRole(log);
              return (
                <article
                  key={log._id || log.id || `${page}-${index}`}
                  className="border border-gray-200 bg-white px-4 py-4 text-sm text-gray-800 shadow-sm sm:px-5"
                >
                  <p>
                    <strong>Date:</strong>{" "}
                    {displayDate(firstValue(log.timestamp, log.createdAt, log.date, log.time))}
                  </p>
                  <p>
                    <strong>Action:</strong>{" "}
                    {displayValue(firstValue(log.action, log.event))}
                  </p>
                  <p>
                    <strong>By:</strong> {getActorName(log)}
                    {role ? ` (${displayValue(role)})` : ""}
                  </p>
                  <p>
                    <strong>IP:</strong>{" "}
                    {displayValue(firstValue(log.ip, log.ipAddress))}
                  </p>
                </article>
              );
            })
          )}
        </div>
      ) : activeFilter === "sms" || activeFilter === "whatsapp" ? (
        <div className="space-y-2">
          {loading ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-500">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
              No logs found.
            </div>
          ) : (
            logs.map((log, index) => (
              <article
                key={log._id || log.id || `${page}-${index}`}
                className="border border-gray-200 bg-white px-4 py-4 text-sm text-gray-800 shadow-sm sm:px-5"
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {displayDate(firstValue(log.timestamp, log.createdAt, log.date, log.time))}
                </p>
                <p className="break-words whitespace-pre-wrap">
                  <strong>Content:</strong>{" "}
                  {displayValue(log.message)}
                </p>
                <p>
                  <strong>Number:</strong>{" "}
                  {displayValue(firstValue(log.recipient, log.phoneNumber))}
                </p>
                {activeFilter === "whatsapp" && (
                  <p>
                    <strong>Template:</strong>{" "}
                    {displayValue(firstValue(log.templateName, log.messageTemplate))}
                  </p>
                )}
                <p>
                  <strong>Type:</strong>{" "}
                  {activeFilter === "whatsapp" ? "WhatsApp" : "SMS"}
                </p>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Actor</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Module</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold">IP Address</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr
                      key={log._id || log.id || `${page}-${index}`}
                      className="text-gray-700 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{getActorName(log)}</td>
                      <td className="px-4 py-3">
                        {displayValue(firstValue(log.actorRole, log.role, log.actor?.role))}
                      </td>
                      <td className="px-4 py-3">
                        {displayValue(firstValue(log.action, log.event))}
                      </td>
                      <td className="px-4 py-3">{displayValue(log.status)}</td>
                      <td className="px-4 py-3">{displayValue(log.module)}</td>
                      <td className="max-w-md whitespace-normal px-4 py-3">
                        {getDetails(log)}
                      </td>
                      <td className="px-4 py-3">
                        {displayValue(firstValue(log.ip, log.ipAddress))}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {displayDate(firstValue(log.timestamp, log.createdAt, log.date, log.time))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <span>
            {total} total logs {totalPages > 0 && `· Page ${page} of ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={loading || page >= totalPages}
              className="rounded border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
}
