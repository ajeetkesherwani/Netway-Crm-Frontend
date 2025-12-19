// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   createTicket,
//   getStaffList,
//   getTicketCategories,
// } from "../../service/ticket";
// import { getAllUserList } from "../../service/user";
// import { toast } from "react-toastify";

// export default function TicketCreate() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [formData, setFormData] = useState({
//     userId: "",
//     personName: "",
//     personNumber: "",
//     email: "",
//     address: "",
//     category: "",
//     fileI: null,
//     fileII: null,
//     fileIII: null,
//     callSource: "Phone",
//     severity: "Medium",
//     assignToId: "",
//     callDescription: "",
//     isChargeable: false,
//     productId: "",
//     price: 0,
//   });

//   // ✅ Fetch Users, Staff, and Categories
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [userRes, staffRes, categoryRes] = await Promise.all([
//           getAllUserList(),
//           getStaffList(),
//           getTicketCategories(),
//         ]);

//         const allUsers = userRes.data || [];
//         setUsers(allUsers.filter((u) => u.generalInformation?.name));
//         setStaffList(staffRes.data || []);
//         setCategories(categoryRes.data || []);
//       } catch (err) {
//         console.error("❌ Failed to load data:", err);
//         toast.error("Failed to load user/staff/category data");
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // ✅ Handle change
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? checked : type === "file" ? files[0] : value,
//     }));
//   };

//   // ✅ When a user is selected (from search or dropdown)
//   const handleUserSelect = (user) => {
//     setFormData((prev) => ({
//       ...prev,
//       userId: user._id,
//       personName: user.generalInformation?.name || "",
//       personNumber: user.generalInformation?.phone || "",
//       email: user.generalInformation?.email || "",
//       address: user.generalInformation?.address || "",
//     }));
//     setSearchTerm(user.generalInformation?.name || "");
//     setShowSuggestions(false);
//   };

//   // ✅ Submit Ticket
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         data.append(key, formData[key] ?? "");
//       });
//       await createTicket(data);
//       toast.success("✅ Ticket created successfully");
//       navigate("/ticket/list");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to create ticket ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Clear all fields
//   const handleClear = () => {
//     setFormData({
//       userId: "",
//       personName: "",
//       personNumber: "",
//       email: "",
//       address: "",
//       category: "",
//       fileI: null,
//       fileII: null,
//       fileIII: null,
//       callSource: "Phone",
//       severity: "Medium",
//       assignToId: "",
//       callDescription: "",
//       isChargeable: false,
//       productId: "",
//       price: 0,
//     });
//     setSearchTerm("");
//   };

//   // ✅ Filter user suggestions
//   const filteredUsers =
//     searchTerm.trim() === ""
//       ? []
//       : users.filter((u) => {
//           const name = u.generalInformation?.name?.toLowerCase() || "";
//           const email = u.generalInformation?.email?.toLowerCase() || "";
//           const phone = u.generalInformation?.phone?.toLowerCase() || "";
//           const q = searchTerm.toLowerCase();
//           return name.includes(q) || email.includes(q) || phone.includes(q);
//         });

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-6">Create Ticket</h2>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         {/* ✅ Search with live suggestion */}
//         <div className="relative md:col-span-2 w-[300px]">
//           <label className="block font-medium mb-1">Search Customer</label>
//           <input
//             type="text"
//             placeholder="Search by name, email, or phone..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             className="border p-2 w-full rounded"
//           />
//           {showSuggestions && filteredUsers.length > 0 && (
//             <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
//               {filteredUsers.map((user) => (
//                 <li
//                   key={user._id}
//                   onClick={() => handleUserSelect(user)}
//                   className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                 >
//                   {user.generalInformation?.name} (
//                   {user.generalInformation?.email})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* ✅ Customer dropdown */}
//         <div>
//           <label className="block font-medium">Select Customer *</label>
//           <select
//             name="userId"
//             value={formData.userId}
//             onChange={(e) => {
//               const selectedUser = users.find((u) => u._id === e.target.value);
//               if (selectedUser) handleUserSelect(selectedUser);
//             }}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select Customer</option>
//             {users.map((user) => (
//               <option key={user._id} value={user._id}>
//                 {user.generalInformation?.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ✅ Auto-filled editable fields */}
//         <div>
//           <label className="block font-medium">Person Name *</label>
//           <input
//             type="text"
//             name="personName"
//             value={formData.personName}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Person Number *</label>
//           <input
//             type="text"
//             name="personNumber"
//             value={formData.personNumber}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Email *</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Address *</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>

//         {/* ✅ Category dropdown */}
//         <div>
//           <label className="block font-medium">Category *</label>
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Files */}
//         {["fileI", "fileII", "fileIII"].map((key) => (
//           <div key={key}>
//             <label className="block font-medium">{key.toUpperCase()}</label>
//             <input
//               type="file"
//               name={key}
//               onChange={handleChange}
//               className="border p-2 w-full rounded"
//             />
//           </div>
//         ))}

//         {/* Call Source */}
//         <div>
//           <label className="block font-medium">Call Source *</label>
//           <select
//             name="callSource"
//             value={formData.callSource}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="Phone">Phone</option>
//             <option value="Email">Email</option>
//             <option value="Web">Web</option>
//             <option value="Walk-in">Walk-in</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         {/* Severity */}
//         <div>
//           <label className="block font-medium">Severity *</label>
//           <select
//             name="severity"
//             value={formData.severity}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//             <option value="Critical">Critical</option>
//           </select>
//         </div>

//         {/* ✅ Assign To dropdown */}
//         <div>
//           <label className="block font-medium">Assign To *</label>
//           <select
//             name="assignToId"
//             value={formData.assignToId}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select Staff</option>
//             {staffList.map((staff) => (
//               <option key={staff._id} value={staff._id}>
//                 {staff.roleName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Call Description */}
//         <div className="md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={formData.callDescription}
//             onChange={handleChange}
//             rows={3}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Chargeable */}
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="isChargeable"
//             checked={formData.isChargeable}
//             onChange={handleChange}
//           />
//           <label>Is Chargeable</label>
//         </div>

//         {/* Product ID */}
//         <div>
//           <label className="block font-medium">Product ID</label>
//           <input
//             type="text"
//             name="productId"
//             value={formData.productId}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block font-medium">Price</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             className="border p-2 w-full rounded"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="col-span-2 flex justify-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={() => navigate("/ticket/list")}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//           >
//             {loading ? "Saving..." : "Submit"}
//           </button>
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTicket,
  getStaffList,
  getTicketCategories,
} from "../../service/ticket";
import { getAllUserList } from "../../service/user";
import { toast } from "react-toastify";

export default function TicketCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    personName: "",
    personNumber: "",
    email: "",
    address: "",
    category: "", // ← Ab ObjectId store hoga
    fileI: null,
    fileII: null,
    fileIII: null,
    callSource: "Phone",
    severity: "Medium",
    assignToId: "",
    callDescription: "",
    isChargeable: false,
    productId: "",
    price: 0,
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, staffRes, catRes] = await Promise.all([
          getAllUserList(),
          getStaffList(),
          getTicketCategories(),
        ]);
        setUsers((userRes.data || []).filter(u => u.generalInformation?.name));
        setStaffList(staffRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Smart handleChange
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : type === "file"
        ? files[0]
        : name === "price"
        ? value === "" ? 0 : Number(value)
        : value
    }));
  };

  // User Select
  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      userId: user._id,
      personName: user.generalInformation?.name || "",
      personNumber: user.generalInformation?.phone || "",
      email: user.generalInformation?.email || "",
      address: user.addressDetails?.billingAddress?.addressine1 || "",
    }));
    setSearchTerm(user.generalInformation?.name || "");
    setShowSuggestions(false);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      await createTicket(data);
      toast.success("Ticket created successfully");
      navigate("/ticket/all");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // Clear
  const handleClear = () => {
    setFormData({
      userId: "", personName: "", personNumber: "", email: "", address: "",
      category: "", fileI: null, fileII: null, fileIII: null,
      callSource: "Phone", severity: "Medium", assignToId: "",
      callDescription: "", isChargeable: false, productId: "", price: 0
    });
    setSearchTerm("");
  };

  // Search Filter
  const filteredUsers = searchTerm.trim() === "" ? [] : users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (
      u.generalInformation?.name?.toLowerCase().includes(q) ||
      u.generalInformation?.email?.toLowerCase().includes(q) ||
      u.generalInformation?.phone?.includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Search Customer */}
        <div className="relative md:col-span-2 w-[300px]">
          <label className="block font-medium mb-1">Search Customer</label>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            className="border p-2 w-full rounded"
          />
          {showSuggestions && filteredUsers.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {user.generalInformation?.name} ({user.generalInformation?.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Customer Dropdown */}
        <div>
          <label className="block font-medium">Select Customer *</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={(e) => {
              const user = users.find(u => u._id === e.target.value);
              if (user) handleUserSelect(user);
            }}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Customer</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.generalInformation?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-fill Fields */}
        <div>
          <label className="block font-medium">Person Name *</label>
          <input type="text" name="personName" value={formData.personName} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>

        <div>
          <label className="block font-medium">Person Number *</label>
          <input type="text" name="personNumber" value={formData.personNumber} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>

        <div>
          <label className="block font-medium">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>

        <div>
          <label className="block font-medium">Address *</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>

        {/* Category - Fixed: ObjectId bhejega */}
        <div>
          <label className="block font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Uploads */}
        {["fileI", "fileII", "fileIII"].map((key) => (
          <div key={key}>
            <label className="block font-medium">{key.toUpperCase()}</label>
            <input
              type="file"
              name={key}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        {/* Call Source */}
        <div>
          <label className="block font-medium">Call Source *</label>
          <select name="callSource" value={formData.callSource} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="Web">Web</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block font-medium">Severity *</label>
          <select name="severity" value={formData.severity} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Assign To */}
        <div>
          <label className="block font-medium">Assign To</label>
          <select
            name="assignToId"
            value={formData.assignToId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Staff</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.staffName || staff.name}
              </option>
            ))}
          </select>
        </div>

        {/* Call Description */}
        <div className="md:col-span-2">
          <label className="block font-medium">Call Description</label>
          <textarea
            name="callDescription"
            value={formData.callDescription}
            onChange={handleChange}
            rows={3}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Chargeable */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isChargeable"
            checked={formData.isChargeable}
            onChange={handleChange}
          />
          <label>Is Chargeable</label>
        </div>

        {/* Product ID */}
        <div>
          <label className="block font-medium">Product ID</label>
          <input type="text" name="productId" value={formData.productId} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/ticket/all")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}