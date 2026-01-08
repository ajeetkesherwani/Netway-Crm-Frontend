import React, { useEffect, useRef, useState } from "react";
import { getAllSubZones } from "../../../service/apiClient";
import { RxCross2 } from "react-icons/rx";

const AsyncSubZoneSelect = ({ onSelect, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  // 🔹 Fetch subzones ONLY when dropdown opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const res = await getAllSubZones();
        setData(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch subzones", err);
        setData([]);
      }
    };

    fetchData();
  }, [isOpen]);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    onSelect(item._id);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    onSelect(null);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        className="border p-1 rounded cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected ? selected.name : "Select SubZone..."}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow z-50">
          {selected && (
            <button
              className="absolute right-2 top-2 text-red-500"
              onClick={handleClear}
            >
              <RxCross2 />
            </button>
          )}

          <div className="max-h-52 overflow-y-auto">
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={`p-2 cursor-pointer hover:bg-blue-100 ${
                    selected?._id === item._id ? "bg-blue-200" : ""
                  }`}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-2">
                No subzones found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncSubZoneSelect;
