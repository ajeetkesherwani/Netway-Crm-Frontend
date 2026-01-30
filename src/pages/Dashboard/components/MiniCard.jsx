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
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow text-white ${COLOR_MAP[color]}`}
    >
      <div>
        <p className="text-sm opacity-90">{title}</p>

        {/* COUNT ONLY CLICKABLE */}
        <p
          onClick={value > 0 ? onCountClick : undefined}
          className={`text-2xl font-bold mt-1 ${
            value > 0
              ? "cursor-pointer  hover:opacity-90"
              : "cursor-default"
          }`}
        >
          {value ?? 0}
        </p>
      </div>

      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  );
};


export default MiniCard;
