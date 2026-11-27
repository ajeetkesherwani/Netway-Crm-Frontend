import React from "react";

const COLOR_MAP = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  gray: "bg-gray-500",
};

const MiniCard = ({ title, value, icon, color = "blue", onCountClick }) => {
  return (
    <button
      type="button"
      onClick={onCountClick}
      disabled={!onCountClick}
      className={`flex min-h-16 w-full items-center justify-between rounded-md px-3 py-2 text-left text-white shadow-sm transition enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:cursor-default ${COLOR_MAP[color]}`}
    >
      <div>
        <p className="text-xs font-medium opacity-90 sm:text-sm">{title}</p>
        <p className="mt-0.5 text-xl font-bold leading-tight">{value ?? 0}</p>
      </div>

      <div className="text-2xl opacity-80">{icon}</div>
    </button>
  );
};


export default MiniCard;
