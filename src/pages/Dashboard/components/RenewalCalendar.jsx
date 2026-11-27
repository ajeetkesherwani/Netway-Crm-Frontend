import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRenewalCalendar } from "../../../service/dashboardApi";
import DashboardSection from "./DashboardSection";

const formatDate = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const RenewalCalendar = () => {
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState({ upcoming: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRenewalCalendar()
      .then((response) => setCalendar(response.data || { upcoming: [], expired: [] }))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const openUsers = (date, type) => {
    navigate(
      `/user/list?renewalDate=${encodeURIComponent(date)}&renewalType=${type}`
    );
  };

  const renderDateRow = (title, items, type) => (
    <div className="mb-5">
      <h3 className="mb-2 font-semibold text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.date}
                className="border border-teal-600 bg-teal-500 px-2 py-2 text-center text-sm font-medium text-white"
              >
                {formatDate(item.date)}
              </div>
            ))}
          </div>
          <div
            className="grid bg-gray-100"
            style={{
              gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.date}
                className="flex min-h-11 items-center justify-center border border-gray-300"
              >
                <button
                  type="button"
                  onClick={() => openUsers(item.date, type)}
                  aria-label={`${item.count} customers, ${title.toLowerCase()} ${formatDate(item.date)}`}
                  className="rounded border border-red-500 bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow hover:bg-red-600"
                >
                  {item.count}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const year = new Date().getFullYear();

  return (
    <DashboardSection title="Plan Renewal Status">
      {loading ? (
        <p className="text-sm text-gray-600">Loading plan renewal dates...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <>
          {renderDateRow(`To Be Renewed (${year})`, calendar.upcoming, "upcoming")}
          {renderDateRow(
            `Customer Didn't Renew (${year})`,
            calendar.expired,
            "expired"
          )}
        </>
      )}
    </DashboardSection>
  );
};

export default RenewalCalendar;
