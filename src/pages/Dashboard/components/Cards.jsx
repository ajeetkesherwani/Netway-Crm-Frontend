// src/components/Dashboard/Cards.jsx (updated)
import React from 'react';

const Card = ({ title, big, today, week, month, color, onViewDetails, onResellerWise,viewPermission,
  resellerWisePermission }) => {
  return (
    <div className={`bg-${color}-100 border border-${color}-200 p-4 rounded-lg shadow-sm text-center`}>
      <div className='flex justify-between'> <h3 className={`text-${color}-800 font-bold text-lg mb-2`}>{title}</h3>
      <div className="text-3xl font-semibold text-gray-900 mb-2">{big}</div></div>
      <div className="text-md text-gray-600 space-y-1">
        <p>Today {today}</p>
        <div className='flex justify-around '>
        <p>Week {week}</p>
        <p>Month {month}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-around">
        {/* ✅ Show only if permission is true */}
        {viewPermission && (
          <button
            onClick={onViewDetails}
            className={`bg-${color}-500 text-white px-3 py-1 rounded hover:bg-${color}-600`}
          >
            View Details
          </button>
        )}

        {/* ✅ Show only if permission is true */}
        {resellerWisePermission && (
          <button
            onClick={onResellerWise}
            className={`bg-${color}-500 text-white px-3 py-1 rounded hover:bg-${color}-600`}
          >
            Reseller Wise
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;