import React, { useEffect, useRef, useState } from "react";
import { getZones } from "../../../service/apiClient";
import { RxCross2 } from "react-icons/rx";

const AsyncAreaSelect = ({ onSelect, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getZones({ search });
      setData(res?.data || []);
    };

    if (isOpen) fetchData();
  }, [search, isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false);
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
      <div
        className="border p-1 rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected.zoneName : "Select Area..."}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow z-50">
          <input
            className="w-full p-2 border-b"
            placeholder="Search area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {selected && (
            <button
              className="absolute right-2 top-2 text-red-500"
              onClick={handleClear}
            >
              <RxCross2 />
            </button>
          )}

          <div className="max-h-52 overflow-y-auto">
            {data.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                className="p-2 hover:bg-blue-100 cursor-pointer"
              >
                {item.zoneName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncAreaSelect;
