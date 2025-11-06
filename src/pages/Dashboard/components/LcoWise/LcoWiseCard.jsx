import React from "react";

export default function LcoWiseCard({
  title,
  big = 0,
  today = 0,
  week = 0,
  month = 0,
  color = "blue",
  onViewDetails,
  onLcoWise,
}) {
  const styles = {
    blue: {
      container: "bg-blue-100 border border-blue-200",
      title: "text-blue-800",
      btn: "bg-blue-500 hover:bg-blue-600",
    },
    green: {
      container: "bg-green-100 border border-green-200",
      title: "text-green-800",
      btn: "bg-green-500 hover:bg-green-600",
    },
    yellow: {
      container: "bg-yellow-100 border border-yellow-200",
      title: "text-yellow-800",
      btn: "bg-yellow-500 hover:bg-yellow-600",
    },
    gray: {
      container: "bg-gray-100 border border-gray-200",
      title: "text-gray-800",
      btn: "bg-gray-500 hover:bg-gray-600",
    },
    indigo: {
      container: "bg-indigo-100 border border-indigo-200",
      title: "text-indigo-800",
      btn: "bg-indigo-500 hover:bg-indigo-600",
    },
  };

  const s = styles[color] || styles.blue;

  return (
    <div className={`${s.container} p-4 rounded-lg shadow-sm text-center`}>
      <div className="flex justify-between items-start">
        <h3 className={`${s.title} font-bold text-lg mb-2`}>{title}</h3>
        <div className="text-3xl font-semibold text-gray-900 mb-2">{big}</div>
      </div>

      <div className="text-md text-gray-600 space-y-1 mt-2">
        <p>Today {today}</p>
        <div className="flex justify-around mt-1">
          <p>Week {week}</p>
          <p>Month {month}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-around">
        <button
          onClick={onViewDetails}
          className={`${s.btn} text-white px-3 py-1 rounded`}
        >
          View Details
        </button>
        {/* <button
          onClick={onLcoWise}
          className={`${s.btn} text-white px-3 py-1 rounded`}
        >
          Lco Wise
        </button> */}
      </div>
    </div>
  );
}