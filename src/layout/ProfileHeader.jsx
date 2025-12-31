// import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getUserFullDetails } from "../service/user";
// import { FaEdit } from "react-icons/fa";
// import ProtectedAction from "../components/ProtectedAction";
// import { FaEllipsisV } from "react-icons/fa"

// const ProfileHeader = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const currentPath = location.pathname.split("/").pop() || "profile";

//   const tabs = [
//     {
//       id: "profile",
//       label: "Profile",
//       path: `/user/profile/${id}/profile`,
//       module: "customer",
//       action: "profile",
//     },
//     {
//       id: "package-details",
//       label: "Package Details",
//       path: `/user/profile/${id}/package-details`,
//       module: "customer",
//       action: "packageDetailView",
//     },
//     {
//       id: "invoice",
//       label: "Invoices",
//       path: `/user/profile/${id}/invoice`,
//       module: "customer",
//       action: "invoice",
//     },
//     {
//       id: "payment",
//       label: "Payments",
//       path: `/user/profile/${id}/payment`,
//       module: "customer",
//       action: "payments",
//     },
//     {
//       id: "tickets",
//       label: "Tickets",
//       path: `/user/profile/${id}/tickets`,
//       module: "customer",
//       action: "tickets",
//     },
//     {
//       id: "activity-log",
//       label: "Logs",
//       path: `/user/profile/${id}/activity-log`,
//       module: "customer",
//       action: "logs",
//     },
//     {
//       id: "recharge-package",
//       label: "Recharge Package",
//       path: `/user/profile/${id}/recharge-package`,
//       module: "customer",
//       action: "rechargePackageList",
//     },
//     {
//       id: "assigned-stock",
//       label: "Assigned Stock",
//       path: `/user/profile/${id}/assigned-stock`,
//       module: "customer",
//       action: "assignedStockView",
//     }
//   ];

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!id) return;

//       setLoading(true);
//       const result = await getUserFullDetails(id);

//       if (result.status) {
//         setUserData(result);
//       } else {
//         alert(result.message || "Failed to load user data");
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, [id]);

//   //for menu close on outside click
//   useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (isMenuOpen) setIsMenuOpen(false);
//   };
//   document.addEventListener("click", handleClickOutside);
//   return () => document.removeEventListener("click", handleClickOutside);
// }, [isMenuOpen]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
//         Loading Profile...
//       </div>
//     );
//   }

//   if (!userData?.userDetails) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-xl text-red-600">
//         User Not Found!
//       </div>
//     );
//   }

//   const user = userData.userDetails;
//   const general = user.generalInformation || {};

//   // Yeh sabse important part hai — latest active plan nikal rahe hain
//   const purchasedPlans = userData.purchasedPlans || [];
//   const latestPlan = purchasedPlans
//     .filter((plan) => new Date(plan.expiryDate) >= new Date()) // Only active/valid plans
//     .sort(
//       (a, b) =>
//         new Date(b.startDate || b.purchaseDate) -
//         new Date(a.startDate || a.purchaseDate)
//     )[0];

//   const currentPackage =
//     latestPlan?.packageId || user.packageInfomation?.packageId || {};
//   const expiryDate = latestPlan?.expiryDate || currentPackage.toDate || null;
//   const lastRechargeDate =
//     latestPlan?.purchaseDate || latestPlan?.startDate || null;

//   const remainingDays = expiryDate
//     ? Math.max(
//         0,
//         Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
//       )
//     : 0;

//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString("en-GB") : "–";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white border-b px-8 py-6 shadow-sm">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>

//           <button
//             onClick={() => navigate(`/user/update/${id}`)}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition shadow-sm hover:shadow-md text-sm font-medium"
//             title="Edit User Details"
//           >
//             <FaEdit className="text-base" />
//             <span className="hidden sm:inline">Edit User</span>
//             <span className="sm:hidden">Edit</span>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           {/* Left - Avatar + Info */}
//           <div className="flex gap-6">
//             <div className="w-28 h-28 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 128 128"
//                 className="w-20 h-20 text-gray-500"
//               >
//                 <circle
//                   cx="64"
//                   cy="40"
//                   r="24"
//                   fill="currentColor"
//                   opacity="0.6"
//                 />
//                 <path
//                   d="M16 120c0-28 20-48 48-48s48 20 48 48"
//                   fill="currentColor"
//                   opacity="0.5"
//                 />
//               </svg>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold text-gray-800">
//                 {general.title} {general.name || "N/A"}
//               </h3>
//               <div className="mt-3 space-y-2 text-sm text-gray-700">
//                 <p>
//                   <strong>ID:</strong> {general.ipactId || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Mobile:</strong> {general.phone || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {general.email || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Current Package:</strong>
//                   <span className="font-semibold text-blue-700">
//                     {currentPackage.name || "No Active Package"}
//                   </span>
//                 </p>
//                 <p>
//                   <strong>Service:</strong>{" "}
//                   {general.serviceOpted
//                     ? general.serviceOpted.toUpperCase()
//                     : "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right - Stats */}
//           <div className="grid grid-cols-2 gap-8 text-sm">
//             <div className="space-y-3">
//               <p>
//                 <strong>Expiry Date:</strong>
//                 <span
//                   className={`font-bold ${
//                     remainingDays <= 7 ? "text-red-600" : "text-gray-600"
//                   }`}
//                 >
//                   {" "}
//                   {formatDate(expiryDate)}
//                 </span>
//               </p>
//               <p>
//                 <strong>Remaining Days:</strong>
//                 <span
//                   className={`font-bold text-lg ${
//                     remainingDays <= 7 ? "text-gray-600" : "text-gray-600"
//                   }`}
//                 >
//                   {" "}
//                   {remainingDays} Days
//                 </span>
//               </p>
//               <p>
//                 <strong>Dues:</strong>
//                 <span className="font-bold text-gray-600">
//                   ₹
//                   {user.walletBalance < 0
//                     ? Math.abs(user.walletBalance).toFixed(2)
//                     : "0.00"}
//                 </span>
//               </p>
//               <p>
//                 <strong>Last Recharge:</strong> {formatDate(lastRechargeDate)}
//               </p>
//             </div>
//             <div className="space-y-3">
//               <p>
//                 <strong>Auto Renew:</strong>
//                 <span
//                   className={
//                     latestPlan?.isRenewed
//                       ? "text-gray-600 font-bold"
//                       : "text-gray-500"
//                   }
//                 >
//                   {latestPlan?.isRenewed ? "Yes" : "No"}
//                 </span>
//               </p>
//               <p>
//                 <strong>Online Bill Payment:</strong>{" "}
//                 <span className="text-gray-600 font-bold">Yes</span>
//               </p>
//               <p>
//                 <strong>Online Recharge:</strong>{" "}
//                 <span className="text-gray-600 font-bold">Yes</span>
//               </p>
//               <p>
//                 <strong>Status:</strong>
//                 <span
//                   className={`font-bold ${
//                     remainingDays > 0 ? "text-gray-600" : "text-red-600"
//                   }`}
//                 >
//                   {remainingDays > 0 ? "Active" : "Expired"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white shadow px-6 py-4 flex flex-wrap gap-4 border-b">
//         {tabs.map((tab) => (
//           <ProtectedAction key={tab.id} module="customer" action={tab.action}>
//             <button
//               onClick={() => navigate(tab.path)}
//               className={`px-5 py-2 rounded-md font-medium transition-all
//                 ${
//                   currentPath === tab.id ||
//                   (tab.id === "profile" && currentPath === id)
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//             >
//               {tab.label}
//             </button>
//           </ProtectedAction>
//         ))}
//       </div>

//       {/* Child Routes */}
//       <div className="p-8 bg-gray-50 min-h-screen">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;



import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getUserFullDetails,
  resetUserPassword,
  updateUserStatus,
  getUserPlanHistory,
} from "../service/user";
import {
  FaEdit,
  FaCreditCard,
  FaLink,
  FaSyncAlt,
  FaSignOutAlt,
  FaKey,
  FaBan,
  FaUserAlt,
  FaHistory,
  FaTicketAlt,
  FaChargingStation,
} from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";
import ProtectedAction from "../components/ProtectedAction";
import { toast } from "react-toastify";

const ProfileHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const currentPath = location.pathname.split("/").pop() || "profile";

  const tabs = [
    { id: "profile", label: "Profile", path: `/user/profile/${id}/profile`, module: "customer", action: "profile" },
    { id: "package-details", label: "Package Details", path: `/user/profile/${id}/package-details`, module: "customer", action: "packageDetailView" },
    { id: "invoice", label: "Invoices", path: `/user/profile/${id}/invoice`, module: "customer", action: "invoice" },
    { id: "payment", label: "Payments", path: `/user/profile/${id}/payment`, module: "customer", action: "payments" },
    { id: "tickets", label: "Tickets", path: `/user/profile/${id}/tickets`, module: "customer", action: "tickets" },
    { id: "activity-log", label: "Logs", path: `/user/profile/${id}/activity-log`, module: "customer", action: "logs" },
    { id: "recharge-package", label: "Recharge Package", path: `/user/profile/${id}/recharge-package`, module: "customer", action: "rechargePackageList" },
    { id: "assigned-stock", label: "Assigned Stock", path: `/user/profile/${id}/assigned-stock`, module: "customer", action: "assignedStockView" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await getUserFullDetails(id);
        if (result.status) {
          setUserData(result);
        } else {
          toast.error(result.message || "Failed to load user data");
        }
      } catch (err) {
        toast.error("Error loading user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Set user to Inactive
  const handleSetInactive = async () => {
    try {
      await updateUserStatus(id, "Inactive");
      toast.success("User status updated to Inactive");
      setIsMenuOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Change Password
  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await resetUserPassword(id, newPassword);
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">Loading Profile...</div>;
  }

  if (!userData?.userDetails) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-600">User Not Found!</div>;
  }

  const user = userData.userDetails;
  const general = user.generalInformation || {};

  const purchasedPlans = userData.purchasedPlans || [];
  const latestPlan = purchasedPlans
    .filter((plan) => new Date(plan.expiryDate) >= new Date())
    .sort((a, b) => new Date(b.startDate || b.purchaseDate) - new Date(a.startDate || a.purchaseDate))[0];

  const currentPackage = latestPlan?.packageId || user.packageInfomation?.packageId || {};
  const expiryDate = latestPlan?.expiryDate || currentPackage.toDate || null;
  const lastRechargeDate = latestPlan?.purchaseDate || latestPlan?.startDate || null;

  const remainingDays = expiryDate
    ? Math.max(0, Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en-GB") : "–");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>

          <ProtectedAction module="customer" action="edit">
            <button
              onClick={() => navigate(`/user/update/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition shadow-sm hover:shadow-md text-sm font-medium"
            >
              <FaEdit className="text-base" />
              <span className="hidden sm:inline">Edit User</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </ProtectedAction>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex gap-6">
            <div className="w-28 h-28 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-20 h-20 text-gray-500">
                <circle cx="64" cy="40" r="24" fill="currentColor" opacity="0.6" />
                <path d="M16 120c0-28 20-48 48-48s48 20 48 48" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">{general.title} {general.name || "N/A"}</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p><strong>ID:</strong> {general.ipactId || "N/A"}</p>
                <p><strong>Mobile:</strong> {general.phone || "N/A"}</p>
                <p><strong>Email:</strong> {general.email || "N/A"}</p>
                <p><strong>Current Package:</strong> <span className="font-semibold text-blue-700">{currentPackage.name || "No Active Package"}</span></p>
                <p><strong>Service:</strong> {general.serviceOpted ? general.serviceOpted.toUpperCase() : "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <p><strong>Expiry Date:</strong> <span className={`font-bold ${remainingDays <= 7 ? "text-red-600" : "text-gray-600"}`}> {formatDate(expiryDate)}</span></p>
              <p><strong>Remaining Days:</strong> <span className="font-bold text-lg text-gray-600"> {remainingDays} Days</span></p>
              <p><strong>Dues:</strong> <span className="font-bold text-gray-600">₹{user.walletBalance < 0 ? Math.abs(user.walletBalance).toFixed(2) : "0.00"}</span></p>
              <p><strong>Last Recharge:</strong> {formatDate(lastRechargeDate)}</p>
            </div>
            <div className="space-y-3">
              <p><strong>Auto Renew:</strong> <span className={latestPlan?.isRenewed ? "text-gray-600 font-bold" : "text-gray-500"}>{latestPlan?.isRenewed ? "Yes" : "No"}</span></p>
              <p><strong>Online Bill Payment:</strong> <span className="text-gray-600 font-bold">Yes</span></p>
              <p><strong>Online Recharge:</strong> <span className="text-gray-600 font-bold">Yes</span></p>
              <p><strong>Status:</strong> <span className={`font-bold ${remainingDays > 0 ? "text-green-600" : "text-red-600"}`}>{remainingDays > 0 ? "Active" : "Expired"}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Action Menu Button */}
      <div className="relative bg-white shadow px-6 py-4 flex flex-wrap items-center justify-between border-b">
        {/* Left: Tabs */}
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <ProtectedAction key={tab.id} module="customer" action={tab.action}>
              <button
                onClick={() => navigate(tab.path)}
                className={`px-5 py-2 rounded-md font-medium transition-all
                  ${currentPath === tab.id || (tab.id === "profile" && currentPath === id)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            </ProtectedAction>
          ))}
        </div>

        {/* Right: Three-dot Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2 rounded-lg bg-blue-700 hover:bg-red-600 transition text-white"
            title="More Actions"
          >
            <IoReorderThree className="text-xl" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="py-2">
                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaCreditCard /> Add Payment
                </button>
                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaLink /> Send Pay Link
                </button>
                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaSyncAlt /> Send Recharge Link
                </button>
                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaSignOutAlt /> Force To Logout
                </button>

                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FaKey /> Change Password
                </button>

                <button
                  onClick={handleSetInactive}
                  className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <FaBan /> Inactive
                </button>

                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaUserAlt /> Login as User
                </button>

                <button
                  onClick={() => {
                    navigate(`/user/plan-history/${id}`);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FaHistory /> Plan History
                </button>

                <button
                  onClick={() => {
                    navigate(`/ticket/create?userId=${id}`);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FaTicketAlt /> Add Ticket
                </button>

                <button className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <FaChargingStation /> Add Auto Recharge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-5">Change User Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 6 chars)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;