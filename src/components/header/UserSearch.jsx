// src/components/UserSearch.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { searchUsers } from "../../service/user"; 

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ---------------- DEBOUNCE SEARCH ----------------
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    console.log("Searching for:", query);

    const timer = setTimeout(async () => {
      const res = await searchUsers(query);
      console.log("Search results:", res);
      setResults(res);
      setShowDropdown(true);
    }, 300); 

    return () => clearTimeout(timer);
  }, [query]);

  // ---------------- CLICK OUTSIDE ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/user/profile/${user._id}`);
  };
   
  return (
    <div className="relative w-[430px]" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        
        onFocus={() => query && setShowDropdown(true)}
        className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-4 text-gray-800 dark:text-white"
      />
       

      {showDropdown && results.length > 0 && (
        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 z-50">
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {user.generalInformation?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
