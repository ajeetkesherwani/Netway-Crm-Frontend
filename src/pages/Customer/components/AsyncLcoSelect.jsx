import { getLcos } from "../../../service/lco";
import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const AsyncLcoSelect = ({ onSelect, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLcos({
          search,
          page: page,
          limit: 7,
        });

        const newData = res?.data || [];
        setData(newData);
      } catch (error) {
        console.log("Error fetching lcos: ", error);
      }
    };
    const timeout = setTimeout(() => {
      if (isOpen) fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, search, isOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSelect = (item) => {
    setIsOpen(false);
    setSelected(item);
    onSelect(item._id);
  };

  const handleClear = () => {
    setIsOpen(false);
    setSelected(null);
    onSelect(null);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="border p-1 rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected.lcoName : "Select Lco..."}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-50 animate-fade">
          {/* Search Field */}
          <div className="flex relative w-full gap-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="flex-1 p-2 mr-10 border-b focus:outline-none"
            />
            {selected && (
              <button
                className="absolute p-1 w-fit outline-none bg-red-400 text-white cursor-pointer hover:bg-red-500 right-0 top-1/2 -translate-y-1/2 hover:text-gray-100 rounded-full"
                onClick={handleClear}
              >
                <RxCross2 />
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={`p-2 cursor-pointer hover:bg-blue-100 ${
                    selected?._id === item._id ? "bg-blue-200" : ""
                  }`}
                >
                  <span className="mr-2.5">
                    {item.lcoName || item.mobileNo || item.email}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-800 p-3">No results</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between p-2 border-t bg-gray-50 items-center">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Prev
            </button>
            <div>
              <span className="text-sm rounded-full w-6 h-6 aspect-square bg-blue-400 text-white flex justify-center items-center">
                {page}
              </span>
            </div>

            <button
              disabled={data.length === 0}
              onClick={() => setPage(page + 1)}
              className="disabled:opacity-50 disabled:pointer-events-none cursor-pointer px-2 py-1"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncLcoSelect;
