// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";
// import { EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";
// import { login as setAuth } from "../../utils/auth";

// // ✅ Define props type
// type SignInFormProps = {
//   loginApi: (data: { email?: string; username?: string; password: string }) => Promise<any>;
//   heading?: string;
// };

// export default function SignInForm({ loginApi, heading }: SignInFormProps) {
//   const [formData, setFormData] = useState({ email: "", username: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   // ✅ Handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   // ✅ Handle form submit
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       // 👇 conditional data — depends on heading
//       const dataToSend =
//         heading?.toLowerCase() === "admin login"
//           ? { email: formData.email, password: formData.password }
//           : { employeeUserName : formData.username, password: formData.password };
//       const res = await loginApi(dataToSend);
//       if (res?.success) {
//         setAuth(res.token);
//         localStorage.setItem("rolePermission", JSON.stringify(res?.data?.user?.role?.permissions));
//         navigate("/");
//       } else {
//         toast.error(res?.error || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <div className="flex flex-col flex-1">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//               {heading || "Sign In"}
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Enter your credentials to sign in!
//             </p>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="space-y-6">
//               {/* ✅ Conditional field based on heading */}
//               {heading?.toLowerCase() === "admin login" ? (
//                 <div>
//                   <Label>
//                     Email <span className="text-error-500">*</span>
//                   </Label>
//                   <Input
//                     placeholder="info@gmail.com"
//                     name="email"
//                     onChange={handleChange}
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   <Label>
//                     Username <span className="text-error-500">*</span>
//                   </Label>
//                   <Input
//                     placeholder="Enter username"
//                     name="username"
//                     onChange={handleChange}
//                   />
//                 </div>
//               )}

//               <div className="mb-1">
//                 <Label>
//                   Password <span className="text-error-500">*</span>
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     onChange={handleChange}
//                     name="password"
//                   />
//                   <span
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                   >
//                     {showPassword ? (
//                       <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     ) : (
//                       <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//                     )}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between mb-4">
//                 <Link
//                   to="/reset-password"
//                   className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button className="w-full" size="sm">
//                 Sign in
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useVerifyOtp } from "../../service/login";

// ✅ Define props type
type SignInFormProps = {
  loginApi: (data: {
    email?: string;
    username?: string;
    userName?: string;
    employeeUserName?: string;
    password: string;
  }) => Promise<any>;
  heading?: string;
};

export default function SignInForm({ loginApi, heading }: SignInFormProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial role from heading or current path, default to 'admin'
  const getInitialRole = () => {
    const h = heading?.toLowerCase() || "";
    const p = location.pathname?.toLowerCase() || "";
    if (h.includes("reseller") || p.includes("reseller")) return "reseller";
    if (h.includes("lco") || p.includes("lco")) return "lco";
    return "admin";
  };

  const [selectedRole, setSelectedRole] = useState<string>(getInitialRole);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const { verifyOtp } = useVerifyOtp();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync role if heading or path changes
  useEffect(() => {
    setSelectedRole(getInitialRole());
  }, [heading, location.pathname]);

  // Read OTP state from navigation (e.g. from Employee List login buttons)
  useEffect(() => {
    if (location.state?.otpRequired && location.state?.loginSessionId && location.state?.pendingPayload) {
      setPendingPayload({
        ...location.state.pendingPayload,
        loginSessionId: location.state.loginSessionId,
      });
      setShowOtpModal(true);
      // Clear state so it doesn't pop up again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ Handle role switch (Admin, Reseller, LCO)
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setFormData({ email: "", username: "", password: "" });
    if (role === "admin" && location.pathname !== "/signin") {
      navigate("/signin");
    } else if (role === "reseller" && location.pathname !== "/reseller") {
      navigate("/reseller");
    } else if (role === "lco" && location.pathname !== "/lco") {
      navigate("/lco");
    }
  };

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let dataToSend;

      // 👇 Conditional login type detection based on selectedRole or heading
      const effectiveRole = selectedRole;
      const type = heading?.toLowerCase();

      if (effectiveRole === "admin" || type === "admin login") {
        // ✅ Admin Login → email + password
        dataToSend = { email: formData.email, password: formData.password };
      } else if (type === "staff login") {
        // ✅ Staff Login → userName + password
        dataToSend = {
          userName: formData.username,
          password: formData.password,
        };
      } else {
        // ✅ Reseller / LCO Login → employeeUserName + password
        dataToSend = {
          employeeUserName: formData.username,
          password: formData.password,
        };
      }

      const res = await loginApi(dataToSend);

      const isSuccess = res?.success || res?.status === "success" || res?.status === true || res?.status === 200 || res?.isOtpSent || (res?.message && res.message.toLowerCase().includes("otp"));
      const requiresOtp = !res?.token || res?.otpRequired || res?.isOtpSent || res?.otp_sent || (res?.message && res.message.toLowerCase().includes("otp"));

      if (isSuccess) {
        if (requiresOtp) {
          // ✅ OTP Required
          setPendingPayload({
            ...dataToSend,
            loginSessionId: res?.loginSessionId || res?.data?.loginSessionId || res?.sessionId || res?.data?.sessionId
          });
          setShowOtpModal(true);
        } else if (res?.token) {
          // ✅ Token received immediately (No OTP required)
          console.log("✅ Login successful — handled by PermissionContext");
          setTimeout(() => {
            window.location.href = "/";
          }, 200);
        }
      } else {
        // Error toast is already handled inside loginApi/useLogin
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOtpSubmit = async () => {
    if (!otp.trim() || !pendingPayload) return toast.error("Please enter a valid OTP");

    setIsVerifying(true);
    try {
      const verifyPayload = {
        ...pendingPayload,
        loginSessionId: pendingPayload.loginSessionId,
        otp: otp.trim()
      };

      console.log("📤 Sending verify payload:", verifyPayload);
      const res = await verifyOtp(verifyPayload);

      const isSuccess = res?.success || res?.status === "success" || res?.status === true || res?.status === 200;

      if (isSuccess && res?.token) {
        setShowOtpModal(false);
        setOtp("");
        setTimeout(() => {
          window.location.href = "/";
        }, 200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingPayload) return;
    try {
      const res = await loginApi(pendingPayload);
      if (res?.loginSessionId) {
        // Update the session ID in case the backend generated a new one
        setPendingPayload((prev: any) => ({
          ...prev,
          loginSessionId: res.loginSessionId
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayHeading =
    selectedRole === "admin"
      ? "Admin Login"
      : selectedRole === "reseller"
        ? "Reseller Login"
        : selectedRole === "lco"
          ? "LCO Login"
          : heading || "Sign In";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            {/* Radio Buttons with type="radio" above heading */}
            <div className="flex items-center gap-6 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="admin"
                  checked={selectedRole === "admin"}
                  onChange={() => handleRoleChange("admin")}
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                />
                Admin
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="reseller"
                  checked={selectedRole === "reseller"}
                  onChange={() => handleRoleChange("reseller")}
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                />
                Reseller
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="lco"
                  checked={selectedRole === "lco"}
                  onChange={() => handleRoleChange("lco")}
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                />
                LCO
              </label>
            </div>

            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {displayHeading}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* ✅ Conditional field based on role */}
              {selectedRole === "admin" ? (
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="mb-1">
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full" size="sm">
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 pt-20 px-4 transition-opacity">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>

            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Enter OTP
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtpSubmit()}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Send OTP
              </button>

              <button
                type="button"
                onClick={handleVerifyOtpSubmit}
                disabled={isVerifying}
                className="px-6 py-2 text-sm font-medium text-white bg-[#00a65a] rounded hover:bg-[#008d4c] disabled:opacity-50"
              >
                {isVerifying ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
