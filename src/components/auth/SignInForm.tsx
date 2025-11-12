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

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
// import { login as setAuth } from "../../utils/auth";

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
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // // ✅ Handle form submit

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let dataToSend;

      // 👇 Conditional login type detection based on heading
      const type = heading?.toLowerCase();

      if (type === "admin login") {
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

      if (res?.success) {
        // ✅ No need to manually store token or permissions — context already does this
        console.log("✅ Login successful — handled by PermissionContext");
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res?.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     let dataToSend;

  //     // 👇 Conditional login type detection based on heading
  //     const type = heading?.toLowerCase();

  //     if (type === "admin login") {
  //       // ✅ Admin Login → email + password
  //       dataToSend = { email: formData.email, password: formData.password };
  //     } else if (type === "staff login") {
  //       // ✅ Staff Login → userName + password
  //       dataToSend = {
  //         userName: formData.username,
  //         password: formData.password,
  //       };
  //     } else {
  //       // ✅ Reseller / LCO Login → employeeUserName + password
  //       dataToSend = {
  //         employeeUserName: formData.username,
  //         password: formData.password,
  //       };
  //     }

  //     const res = await loginApi(dataToSend);

  //     if (res?.success) {
  //       setAuth(res.token);
  //       localStorage.setItem(
  //         "rolePermission",
  //         JSON.stringify(res?.data?.user?.role?.permissions)
  //       );
  //       navigate("/");
  //     } else {
  //       toast.error(res?.error || "Login failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Login failed");
  //   }
  // };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {heading || "Sign In"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* ✅ Conditional field based on heading */}
              {heading?.toLowerCase() === "admin login" ? (
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    name="email"
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
    </div>
  );
}
