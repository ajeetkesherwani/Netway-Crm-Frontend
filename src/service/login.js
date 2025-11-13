// import toast from "react-hot-toast";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const login = async (payload) => {
//     console.log(payload, ' data for send in the api');
//     try {
//         const res = await fetch(`${BASE_URL}/auth/login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json", // ✅ tell backend we're sending JSON
//             },
//             body: JSON.stringify(payload) // ✅ convert object to JSON string
//         });
//         const result = await res.json();
//         console.log(result, "res");
//         if (result.token) {
//             // save JWT and auth flag
//             localStorage.setItem("token", result.token);
//         }
//         return result;
//     } catch (err) {
//         toast.error(err.message || 'Something went wrong!');
//         throw new Error(err.message);
//     }
// };

import toast from "react-hot-toast";
import { usePermission } from "../context/PermissionContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useLogin = () => {
    const { saveToken, updatePermissions } = usePermission();

    const login = async (payload) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("🔐 Login API response:", result);

            if (result.success && result.token) {
                // ✅ Save token persistently
                saveToken(result.token);

                // ✅ Try extracting permissions dynamically from all possible locations
                let permissions = {};

                if (result?.data?.user?.role?.permissions) {
                    permissions = result.data.user.role.permissions;
                } else if (result?.data?.role?.permissions) {
                    permissions = result.data.role.permissions;
                } else if (result?.permissions) {
                    permissions = result.permissions;
                }

                console.log("🧩 Extracted Permissions Object:", permissions);

                // ✅ Update permission context (for Sidebar, ProtectedAction, etc.)
                updatePermissions({
                    roleName:
                        result?.data?.user?.role?.roleName ||
                        result?.data?.role?.roleName ||
                        "Unknown",
                    permissions,
                });

                toast.success("Login Successful ✅");
            } else {
                toast.error(result.message || "Login failed ❌");
            }

            return result;
        } catch (err) {
            console.error("❌ Login error:", err);
            toast.error(err.message || "Something went wrong!");
            throw err;
        }
    };

    return { login };
};

//1
// import toast from "react-hot-toast";
// import { usePermission } from "../context/PermissionContext";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const useLogin = () => {
//     const { saveToken, updatePermissions } = usePermission();

//     const login = async (payload) => {
//         try {
//             const res = await fetch(`${BASE_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const result = await res.json();
//             console.log("🔐 Login API response:", result);

//             if (result.success && result.token) {
//                 // ✅ Save token persistently
//                 saveToken(result.token);

//                 // ✅ Save permissions only in memory
//                 if (result?.data?.user?.role) {
//                     updatePermissions(result.data.user.role);
//                 }

//                 toast.success("Login Successful!");
//             } else {
//                 toast.error(result.message || "Login failed");
//             }

//             return result;
//         } catch (err) {
//             toast.error(err.message || "Something went wrong!");
//             throw err;
//         }
//     };

//     return { login };
// };

// export const verifyToken = async (authToken) => {
//     try {
//         const res = await fetch(`${BASE_URL}/auth/verify`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${authToken}`,
//             },
//         });

//         const data = await res.json();
//         console.log("🧭 Verify Token API response:", data);
//         return data;
//     } catch (error) {
//         console.error("❌ Verify Token API error:", error);
//         return { success: false, message: error.message };
//     }
// };


// import toast from "react-hot-toast";
// import { usePermission } from "../context/PermissionContext";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // ✅ Context-aware login hook
// export const useLogin = () => {
//     const { updatePermissions, saveToken } = usePermission();

//     const login = async (payload) => {
//         try {
//             console.log("📤 Sending login payload:", payload);

//             const res = await fetch(`${BASE_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const result = await res.json();
//             console.log("🔐 Login Response:", result);

//             // ✅ Ensure token is present and success is true
//             if (result?.success && result?.token) {
//                 console.log("💾 Token received:", result.token);

//                 // ✅ Save token persistently via context (localStorage + state)
//                 saveToken(result.token);

//                 // ✅ Update permissions in memory (not localStorage)
//                 if (result?.data?.user?.role) {
//                     console.log("🔐 Updating permissions:", result.data.user.role.permissions);
//                     updatePermissions(result.data.user.role);
//                 }

//                 toast.success("Login Successful!");
//             } else {
//                 toast.error(result?.message || "Login failed");
//             }

//             return result;
//         } catch (err) {
//             console.error("❌ Login error:", err);
//             toast.error(err.message || "Something went wrong!");
//             throw err;
//         }
//     };

//     return { login };
// };


// import toast from "react-hot-toast";
// import { usePermission } from "../context/PermissionContext";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // ✅ Context-aware login hook
// export const useLogin = () => {
//     const { updatePermissions, saveToken } = usePermission();

//     const login = async (payload) => {
//         try {
//             const res = await fetch(`${BASE_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const result = await res.json();
//             console.log(result, "🔐 Login Response");

//             if (result.success && result.token) {
//                 // ✅ Save token persistently in localStorage via context
//                 saveToken(result.token);

//                 // ✅ Update permissions in memory
//                 if (result?.data?.user?.role) {
//                     updatePermissions(result.data.user.role);
//                 }

//                 toast.success("Login Successful!");
//             } else {
//                 toast.error(result.message || "Login failed");
//             }

//             return result;
//         } catch (err) {
//             toast.error(err.message || "Something went wrong!");
//             throw err;
//         }
//     };

//     return { login };
// };



// import toast from "react-hot-toast";
// import { usePermission } from "../context/PermissionContext";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // ✅ Context-aware login hook
// export const useLogin = () => {
//     const { updatePermissions, setToken } = usePermission();

//     const login = async (payload) => {
//         try {
//             const res = await fetch(`${BASE_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const result = await res.json();
//             console.log(result, "Login Response");

//             if (result.success && result.token) {
//                 localStorage.setItem("token", result.token);
//                 setToken(result.token);

//                 if (result?.data?.user?.role) {
//                     updatePermissions(result.data.user.role);
//                 }

//                 toast.success("Login Successful!");
//             } else {
//                 toast.error(result.message || "Login failed");
//             }

//             return result;
//         } catch (err) {
//             toast.error(err.message || "Something went wrong!");
//             throw err;
//         }
//     };

//     return { login };
// };

// // ✅ Plain version (for SignInForm)
// export const login = async (payload) => {
//     try {
//         const res = await fetch(`${BASE_URL}/auth/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         const result = await res.json();
//         console.log(result, "Login Response");
//         return result;
//     } catch (err) {
//         toast.error(err.message || "Something went wrong!");
//         throw err;
//     }
// };



//reseller
// export const resellerLogin = async (payload) => {
//     console.log(payload, ' data for send in the api');
//     try {
//         const res = await fetch(`${BASE_URL}/auth/reseller/login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload)
//         });
//         const result = await res.json();
//         console.log(result, "res");
//         if (result.token) {
//             // save JWT and auth flag
//             localStorage.setItem("token", result.token);
//         }
//         return result;
//     } catch (err) {
//         toast.error(err.message || 'Something went wrong!');
//         throw new Error(err.message);
//     }
// };