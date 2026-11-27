import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaEye, FaKey, FaSearch, FaTimes } from "react-icons/fa";
import { getThirdPartyApiConfigurations } from "../../service/thirdPartyApi";

export default function ThirdPartyApiList() {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);

  const fetchConfigurations = async () => {
    setLoading(true);
    setError("");
    try {
      setConfigurations(await getThirdPartyApiConfigurations());
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch API configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const filteredConfigurations = configurations.filter((configuration) =>
    [
      configuration.apiName,
      configuration.apiType,
      configuration.authenticationType,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-full p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            API Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View configured third-party services and their connection details.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchConfigurations}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4 flex max-w-md items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
        <FaSearch className="text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search APIs..."
          className="w-full border-0 bg-transparent text-sm outline-none"
        />
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={fetchConfigurations}>
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">API Name</th>
              <th className="px-4 py-3 font-medium">API Type</th>
              <th className="px-4 py-3 font-medium">API Method</th>
              <th className="px-4 py-3 font-medium">API URL</th>
              <th className="px-4 py-3 font-medium">Authentication</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                  Loading API configurations...
                </td>
              </tr>
            ) : filteredConfigurations.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                  {search
                    ? "No matching APIs found."
                    : "No API configurations available."}
                </td>
              </tr>
            ) : (
              filteredConfigurations.map((configuration, index) => {
                const methods = [
                  ...new Set(
                    configuration.endpoints.map((endpoint) => endpoint.method)
                  ),
                ].join(", ");

                return (
                  <tr key={configuration.id} className="align-top hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {index + 1}
                    </td>
                    <td className="max-w-56 px-4 py-4 font-medium text-gray-800">
                      {configuration.apiName}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {configuration.apiType}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{methods}</td>
                    <td className="max-w-sm break-all px-4 py-4 text-gray-600">
                      {configuration.endpoints[0]?.url || "-"}
                      {configuration.endpoints.length > 1 && (
                        <span className="ml-1 text-xs text-blue-600">
                          +{configuration.endpoints.length - 1} more
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {configuration.credentials.length} field(s), values hidden
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          configuration.status === "Configured"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {configuration.status}
                      </span>
                    </td>
                    <td className="relative px-4 py-3 text-center">
                      <button
                        type="button"
                        aria-label={`Actions for ${configuration.apiName}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId(
                            openMenuId === configuration.id
                              ? null
                              : configuration.id
                          );
                        }}
                        className="rounded-full p-2 text-gray-600 hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === configuration.id && (
                        <div
                          className="absolute right-4 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedConfiguration(configuration);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaEye className="text-blue-600" />
                            View details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedConfiguration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setSelectedConfiguration(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-details-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h2
                  id="api-details-title"
                  className="text-xl font-semibold text-gray-800"
                >
                  {selectedConfiguration.apiName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedConfiguration.apiType}
                  {selectedConfiguration.environment
                    ? ` · ${selectedConfiguration.environment}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close API details"
                onClick={() => setSelectedConfiguration(null)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <div>
                <h3 className="mb-2 font-medium text-gray-800">Endpoints</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[500px] text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Method</th>
                        <th className="px-3 py-2 text-left font-medium">URL</th>
                        <th className="px-3 py-2 text-left font-medium">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedConfiguration.endpoints.map((endpoint) => (
                        <tr key={`${endpoint.method}-${endpoint.url}`}>
                          <td className="whitespace-nowrap px-3 py-3">
                            {endpoint.method}
                          </td>
                          <td className="break-all px-3 py-3">{endpoint.url}</td>
                          <td className="px-3 py-3">{endpoint.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-800">
                  Authentication
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                  {selectedConfiguration.authenticationType}
                </p>
                <div className="space-y-2">
                  {selectedConfiguration.credentials.map((credential) => (
                    <div
                      key={credential.label}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-800">
                          {credential.label}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {credential.configurationKeys.join(", ")}
                        </span>
                      </div>
                      <span className="flex items-center gap-2 text-gray-600">
                        <FaKey className="text-gray-400" />
                        {credential.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-amber-700">
                  Secret values are intentionally never returned by the API or
                  displayed here.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
