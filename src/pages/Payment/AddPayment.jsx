// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { addWalletPayment, getAllUserList } from "../../service/user.js";
// import { getWalletBalance } from "../../service/recharge.js";

// export default function AddPayment() {
//     const navigate = useNavigate();

//     const [search, setSearch] = useState("");
//     const [suggestions, setSuggestions] = useState([]);
//     const [allUsers, setAllUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);

//     const [totalAmount, setTotalAmount] = useState(0);
//     const [amountToBePaid, setAmountToBePaid] = useState("");
//     const [dueAmount, setDueAmount] = useState(0);

//     const [paymentDate, setPaymentDate] = useState(new Date());
//     const [paymentMode, setPaymentMode] = useState("");
//     const [transactionNo, setTransactionNo] = useState("");
//     const [comments, setComments] = useState("");
//     const [fullPaid, setFullPaid] = useState(false);
//     const [sms, setSms] = useState(false);
//     const [file, setFile] = useState(null);

//     const [loading, setLoading] = useState(false);
//     const [fetchingUsers, setFetchingUsers] = useState(true);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const debounceRef = useRef(null);

//     // Load users
//     useEffect(() => {
//         const loadAllUsers = async () => {
//             try {
//                 setFetchingUsers(true);
//                 const res = await getAllUserList({});
//                 setAllUsers(res.data || []);
//             } catch (err) {
//                 console.error("Failed to load users:", err);
//                 setError("Could not load users for search");
//             } finally {
//                 setFetchingUsers(false);
//             }
//         };
//         loadAllUsers();
//     }, []);

//     // Search filter
//     useEffect(() => {
//         if (debounceRef.current) clearTimeout(debounceRef.current);

//         if (!search.trim()) {
//             setSuggestions([]);
//             return;
//         }

//         debounceRef.current = setTimeout(() => {
//             const filtered = allUsers.filter((user) =>
//                 (user.generalInformation?.name || "")
//                     .toLowerCase()
//                     .includes(search.toLowerCase())
//             );
//             setSuggestions(filtered);
//         }, 300);

//         return () => clearTimeout(debounceRef.current);
//     }, [search, allUsers]);

//     // Select user
//     const handleSelectUser = async (user) => {
//         setSelectedUser(user);
//         const name = user.generalInformation?.name || "Unknown User";
//         setSearch(name);
//         setSuggestions([]);
//         setError("");

//         try {
//             const response = await getWalletBalance(user._id);
//             const balance = Number(response?.data?.walletBalance || 0);

//             if (balance >= 0) {
//                 setError("No outstanding due for this user");
//                 setSelectedUser(null);
//                 setSearch("");
//                 setTotalAmount(0);
//                 setDueAmount(0);
//                 return;
//             }

//             setTotalAmount(balance);
//             setDueAmount(balance);
//             setAmountToBePaid("");
//             setFullPaid(false);
//         } catch (err) {
//             setError("Failed to load wallet balance");
//             console.error(err);
//         }
//     };

//     // Amount change
//     const handleAmountChange = (val) => {
//         if (val !== "" && !/^\d*\.?\d*$/.test(val)) return;
//         setAmountToBePaid(val);
//         setFullPaid(false);

//         const paid = Number(val) || 0;
//         const newDue = totalAmount + paid;
//         setDueAmount(newDue > 0 ? 0 : newDue);
//     };

//     // Full paid
//     const handleFullPaid = (checked) => {
//         setFullPaid(checked);
//         if (checked) {
//             const full = Math.abs(totalAmount);
//             setAmountToBePaid(full.toString());
//             setDueAmount(0);
//         } else {
//             setAmountToBePaid("");
//             setDueAmount(totalAmount);
//         }
//     };

//     // Clear form
//     const clearForm = () => {
//         setSearch("");
//         setSuggestions([]);
//         setSelectedUser(null);
//         setTotalAmount(0);
//         setAmountToBePaid("");
//         setDueAmount(0);
//         setPaymentDate(new Date());
//         setPaymentMode("");
//         setTransactionNo("");
//         setComments("");
//         setFullPaid(false);
//         setSms(true);
//         setFile(null);
//         setError("");
//         setSuccess("");
//     };

//     // FIXED SUBMIT - Now guaranteed to hit network
//     const handleSubmit = async () => {
//         if (!selectedUser) {
//             setError("Please select a user");
//             return;
//         }
//         if (!paymentMode) {
//             setError("Please select payment mode");
//             return;
//         }

//         const finalAmt = fullPaid ? Math.abs(totalAmount) : Number(amountToBePaid || 0);
//         if (!fullPaid && finalAmt <= 0) {
//             setError("Enter valid amount");
//             return;
//         }

//         setLoading(true);
//         setError("");
//         setSuccess("");

//         const formData = new FormData();
//         formData.append("amountToBePaid", finalAmt);
//         formData.append("paymentMode", paymentMode);
//         formData.append("transactionNo", transactionNo || "");
//         formData.append("comments", comments || "");
//         formData.append("fullPaid", fullPaid);
//         formData.append("sms", sms);

//         if (file) {
//             formData.append("imageProof", file);
//         }

//         console.log("Submitting payment for user ID:", selectedUser._id);
//         console.log("FormData contents:", {
//             amountToBePaid: finalAmt,
//             paymentMode,
//             transactionNo,
//             comments,
//             fullPaid,
//             sms,
//             file: file ? file.name : null,
//         });

//         try {
//             const result = await addWalletPayment(selectedUser._id, formData);
//             console.log("Success response:", result);
//             setSuccess("Payment recorded successfully!");
//             setTimeout(clearForm, 2000);
//         } catch (err) {
//             console.error("Submission error:", err);
//             // Better error message
//             const msg =
//                 err.response?.data?.message ||
//                 err.message ||
//                 "Submission failed - check console";
//             setError(msg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
//             {/* Header */}
//             <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                     <div className="bg-green-600 text-white px-4 py-2 rounded-l-md font-semibold">
//                         Add Payment
//                     </div>
//                     <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-green-600"></div>
//                 </div>

//                 <button
//                     onClick={() => navigate("/user/list")}
//                     className="bg-blue-700 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 flex items-center gap-2"
//                 >
//                     ← BACK
//                 </button>
//             </div>

//             {/* Left-aligned form */}
//             <div className="max-w-xl mx-0 mt-8 px-4 pb-12">
//                 <div className="bg-white rounded-2xl shadow-lg p-8">
//                     {error && (
//                         <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
//                             {error}
//                         </div>
//                     )}
//                     {success && (
//                         <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded mb-6">
//                             {success}
//                         </div>
//                     )}

//                     {fetchingUsers && (
//                         <div className="text-center text-gray-500 mb-6">Loading users...</div>
//                     )}

//                     {/* User Search */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">
//                             User Id <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 onFocus={() => {
//                                     // If a user is already selected, don't show suggestions on focus
//                                     if (selectedUser) {
//                                         setSuggestions([]);
//                                     }
//                                 }}
//                                 placeholder={selectedUser ? "User selected" : "Search by name"}
//                                 readOnly={!!selectedUser} // Makes it non-editable after selection (optional but recommended)
//                                 disabled={fetchingUsers}
//                                 className={`w-full border ${error && !selectedUser ? "border-red-500" : "border-gray-300"
//                                     } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 ${selectedUser ? "bg-gray-50 cursor-default" : "cursor-text"
//                                     }`}
//                             />

//                             {/* Only show suggestions if NO user is selected yet */}
//                             {!selectedUser && suggestions.length > 0 && (
//                                 <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
//                                     {suggestions.map((user) => {
//                                         const name = user.generalInformation?.name || "No Name";
//                                         return (
//                                             <div
//                                                 key={user._id}
//                                                 onClick={() => handleSelectUser(user)}
//                                                 className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
//                                             >
//                                                 <div className="font-medium text-gray-800">{name}</div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </div>

//                         {error && !selectedUser && (
//                             <p className="text-red-500 text-sm mt-2">This is a required field</p>
//                         )}
//                     </div>

//                     {/* Total Amount */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Total Amount</label>
//                         <input
//                             value={totalAmount ? Math.abs(totalAmount).toLocaleString("en-IN") : ""}
//                             disabled
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 font-bold text-gray-600"
//                         />
//                     </div>

//                     {/* Payment Date */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Payment Date</label>
//                         <DatePicker
//                             selected={paymentDate}
//                             onChange={(date) => setPaymentDate(date)}
//                             dateFormat="dd-MM-yyyy"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
//                         />
//                     </div>

//                     {/* Payment Mode */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Payment Mode</label>
//                         <select
//                             value={paymentMode}
//                             onChange={(e) => setPaymentMode(e.target.value)}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                         >
//                             <option value="">Select Mode</option>
//                             <option>Cash</option>
//                             <option>UPI</option>
//                             <option>Card</option>
//                             <option>Bank Transfer</option>
//                             <option>Cheque</option>
//                         </select>
//                     </div>

//                     {/* Amount to be paid */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Amount to be paid</label>
//                         <input
//                             type="text"
//                             value={amountToBePaid}
//                             onChange={(e) => handleAmountChange(e.target.value)}
//                             placeholder="0"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                         />
//                     </div>

//                     {/* Full Paid */}
//                     <div className="flex items-center gap-3 mb-6">
//                         <input
//                             type="checkbox"
//                             checked={fullPaid}
//                             onChange={(e) => handleFullPaid(e.target.checked)}
//                             className="w-5 h-5 text-blue-600"
//                         />
//                         <label className="text-gray-700">Full Amount To be Paid</label>
//                     </div>

//                     {/* Due Amount */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Due Amount</label>
//                         <input
//                             value={dueAmount ? Math.abs(dueAmount).toLocaleString("en-IN") : ""}
//                             disabled
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 font-bold text-gray-600"
//                         />
//                     </div>

//                     {/* Transaction No */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Transaction No</label>
//                         <input
//                             value={transactionNo}
//                             onChange={(e) => setTransactionNo(e.target.value)}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                         />
//                     </div>

//                     {/* Comment */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Comment</label>
//                         <textarea
//                             value={comments}
//                             onChange={(e) => setComments(e.target.value)}
//                             rows={4}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                         />
//                     </div>

//                     {/* Payment Proof */}
//                     <div className="mb-6">
//                         <label className="block text-gray-600 mb-2">Payment Proof</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setFile(e.target.files[0])}
//                             className="w-full"
//                         />
//                         <p className="text-gray-500 text-sm mt-2">
//                             {file ? file.name : "No file chosen"}
//                         </p>
//                     </div>

//                     {/* SMS */}
//                     <div className="flex items-center gap-3 mb-10">
//                         <input
//                             type="checkbox"
//                             checked={sms}
//                             onChange={() => setSms(!sms)}
//                             className="w-5 h-5 text-blue-600"
//                         />
//                         <label className="text-gray-700">SMS</label>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex justify-center gap-6">
//                         <button
//                             onClick={clearForm}
//                             className="px-10 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
//                         >
//                             Skip
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className="px-12 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-70"
//                         >
//                             {loading ? "Submitting..." : "SUBMIT"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addWalletPayment, getAllUserList } from "../../service/user.js";
import { getWalletBalance } from "../../service/recharge.js";

export default function AddPayment() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [totalAmount, setTotalAmount] = useState(0);      // now = current wallet balance
    const [amountToBePaid, setAmountToBePaid] = useState("");
    const [dueAmount, setDueAmount] = useState(0);          // now = projected new balance

    const [paymentDate, setPaymentDate] = useState(new Date());
    const [paymentMode, setPaymentMode] = useState("");
    const [transactionNo, setTransactionNo] = useState("");
    const [comments, setComments] = useState("");
    const [fullPaid, setFullPaid] = useState(false);
    const [sms, setSms] = useState(false);
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const debounceRef = useRef(null);

    // Load users
    useEffect(() => {
        const loadAllUsers = async () => {
            try {
                setFetchingUsers(true);
                const res = await getAllUserList({});
                setAllUsers(res.data || []);
            } catch (err) {
                console.error("Failed to load users:", err);
                setError("Could not load users for search");
            } finally {
                setFetchingUsers(false);
            }
        };
        loadAllUsers();
    }, []);

    // Search filter
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!search.trim()) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(() => {
            const filtered = allUsers.filter((user) =>
                (user.generalInformation?.name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
            setSuggestions(filtered);
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [search, allUsers]);

    // Select user
    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        const name = user.generalInformation?.name || "Unknown User";
        setSearch(name);
        setSuggestions([]);
        setError("");

        try {
            const response = await getWalletBalance(user._id);
            const balance = Number(response?.data?.walletBalance || 0);

            // ────────────────────────────────────────────────
            // Removed: no longer block users with balance >= 0
            // ────────────────────────────────────────────────

            setTotalAmount(balance);
            setDueAmount(balance);
            setAmountToBePaid("");
            setFullPaid(false);
        } catch (err) {
            setError("Failed to load wallet balance");
            console.error(err);
        }
    };

    // Amount change
    const handleAmountChange = (val) => {
        if (val !== "" && !/^\d*\.?\d*$/.test(val)) return;

        setAmountToBePaid(val);
        setFullPaid(false);

        const paid = Number(val) || 0;
        const newBalance = totalAmount + paid;
        setDueAmount(newBalance); // now shows real projected balance (can be positive)
    };

    // Full paid checkbox
    const handleFullPaid = (checked) => {
        setFullPaid(checked);

        if (checked) {
            if (totalAmount < 0) {
                // only auto-fill if there is actual due (negative balance)
                const full = Math.abs(totalAmount);
                setAmountToBePaid(full.toString());
                setDueAmount(0);
            } else {
                // prevent misleading auto-fill when no due exists
                setFullPaid(false);
                setError("Full paid option is only available when there is an outstanding due");
                setTimeout(() => setError(""), 4000);
            }
        } else {
            setAmountToBePaid("");
            setDueAmount(totalAmount);
        }
    };

    // Clear form
    const clearForm = () => {
        setSearch("");
        setSuggestions([]);
        setSelectedUser(null);
        setTotalAmount(0);
        setAmountToBePaid("");
        setDueAmount(0);
        setPaymentDate(new Date());
        setPaymentMode("");
        setTransactionNo("");
        setComments("");
        setFullPaid(false);
        setSms(true);
        setFile(null);
        setError("");
        setSuccess("");
    };

    // Submit
    const handleSubmit = async () => {
        if (!selectedUser) {
            setError("Please select a user");
            return;
        }
        if (!paymentMode) {
            setError("Please select payment mode");
            return;
        }

        const finalAmt = fullPaid ? Math.abs(totalAmount) : Number(amountToBePaid || 0);
        if (!fullPaid && finalAmt <= 0) {
            setError("Enter valid amount");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("amountToBePaid", finalAmt);
        formData.append("paymentMode", paymentMode);
        formData.append("transactionNo", transactionNo || "");
        formData.append("comments", comments || "");
        formData.append("fullPaid", fullPaid);
        formData.append("sms", sms);

        if (file) {
            formData.append("imageProof", file);
        }

        console.log("Submitting payment for user ID:", selectedUser._id);
        console.log("FormData contents:", {
            amountToBePaid: finalAmt,
            paymentMode,
            transactionNo,
            comments,
            fullPaid,
            sms,
            file: file ? file.name : null,
        });

        try {
            const result = await addWalletPayment(selectedUser._id, formData);
            console.log("Success response:", result);
            setSuccess("Payment recorded successfully!");
            setTimeout(clearForm, 2000);
        } catch (err) {
            console.error("Submission error:", err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Submission failed - check console";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-l-md font-semibold">
                        Add Payment
                    </div>
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-green-600"></div>
                </div>

                <button
                    onClick={() => navigate("/user/list")}
                    className="bg-blue-700 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 flex items-center gap-2"
                >
                    ← BACK
                </button>
            </div>

            {/* Left-aligned form */}
            <div className="max-w-xl mx-0 mt-8 px-4 pb-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded mb-6">
                            {success}
                        </div>
                    )}

                    {fetchingUsers && (
                        <div className="text-center text-gray-500 mb-6">Loading users...</div>
                    )}

                    {/* User Search */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">
                            User Id <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => {
                                    if (selectedUser) {
                                        setSuggestions([]);
                                    }
                                }}
                                placeholder={selectedUser ? "User selected" : "Search by name"}
                                readOnly={!!selectedUser}
                                disabled={fetchingUsers}
                                className={`w-full border ${error && !selectedUser ? "border-red-500" : "border-gray-300"
                                    } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 ${selectedUser ? "bg-gray-50 cursor-default" : "cursor-text"
                                    }`}
                            />

                            {!selectedUser && suggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {suggestions.map((user) => {
                                        const name = user.generalInformation?.name || "No Name";
                                        return (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-800">{name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {error && !selectedUser && (
                            <p className="text-red-500 text-sm mt-2">This is a required field</p>
                        )}
                    </div>

                    {/* Total Amount */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Total Amount</label>
                        <input
                            value={totalAmount }
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 font-bold text-gray-600"
                        />
                    </div>

                    {/* Payment Date */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Payment Date</label>
                        <DatePicker
                            selected={paymentDate}
                            onChange={(date) => setPaymentDate(date)}
                            dateFormat="dd-MM-yyyy"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Payment Mode */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Payment Mode</label>
                        <select
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <option value="">Select Mode</option>
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Card</option>
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                        </select>
                    </div>

                    {/* Amount to be paid */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Amount to be paid</label>
                        <input
                            type="text"
                            value={amountToBePaid}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                    </div>

                    {/* Full Paid */}
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            checked={fullPaid}
                            onChange={(e) => handleFullPaid(e.target.checked)}
                            className="w-5 h-5 text-blue-600"
                        />
                        <label className="text-gray-700">Full Amount To be Paid</label>
                    </div>

                    {/* Due Amount */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Due Amount</label>
                        <input
                            value={dueAmount ? Math.abs(dueAmount).toLocaleString("en-IN") : ""}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 font-bold text-gray-600"
                        />
                    </div>

                    {/* Transaction No */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Transaction No</label>
                        <input
                            value={transactionNo}
                            onChange={(e) => setTransactionNo(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Comment</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                    </div>

                    {/* Payment Proof */}
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Payment Proof</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full"
                        />
                        <p className="text-gray-500 text-sm mt-2">
                            {file ? file.name : "No file chosen"}
                        </p>
                    </div>

                    {/* SMS */}
                    <div className="flex items-center gap-3 mb-10">
                        <input
                            type="checkbox"
                            checked={sms}
                            onChange={() => setSms(!sms)}
                            className="w-5 h-5 text-blue-600"
                        />
                        <label className="text-gray-700">SMS</label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={clearForm}
                            className="px-10 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-12 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-70"
                        >
                            {loading ? "Submitting..." : "SUBMIT"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}