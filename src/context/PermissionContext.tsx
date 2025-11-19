// import React, { createContext, useContext, useMemo } from "react";

// const PermissionContext = createContext({});

// export const PermissionProvider = ({ children }) => {
//   const storedPermissions = localStorage.getItem("rolePermission");
//   const permissions = useMemo(() => {
//     try {
//       return storedPermissions ? JSON.parse(storedPermissions) : {};
//     } catch {
//       return {};
//     }
//   }, [storedPermissions]);
//   console.log("Permissions loaded:", permissions);
//   return (
//     <PermissionContext.Provider value={{ permissions }}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };
// export const usePermission = () => useContext(PermissionContext);
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// const PermissionContext = createContext({group: any});

// export const PermissionProvider = ({ children }) => {
//   // ✅ Get token from localStorage
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [user, setUser] = useState(null);
//   const [permissions, setPermissions] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ✅ Use the Vite environment variable
//   const BASE_URL = import.meta.env.VITE_BASE_URL;

//   // ✅ Save token persistently (in localStorage only)
//   const saveToken = (newToken) => {
//     console.log("💾 Token saved:", newToken);
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   // ✅ Update permissions (in memory only)
//   const updatePermissions = (roleData = {}) => {
//     const roleConfig = roleData.roleConfig || {};
//     const rolePerms = roleData.permissions || {};
//     const finalPerms = Object.keys(roleConfig).length ? roleConfig : rolePerms;

//     console.log("🔐 Permissions updated (in memory only):", finalPerms);
//     setPermissions(finalPerms);
//   };

//   // ✅ Clear all authentication info (logout)
//   const clearPermissions = () => {
//     console.log("🧹 Clearing all authentication data...");
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     setPermissions({});
//   };

//   // ✅ Verify token API (same structure, just using /auth/verify)
//   const verifyToken = async (authToken) => {
//     try {
//       const res = await fetch(`${BASE_URL}/auth/verify`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       const data = await res.json();
//       console.log("🧭 Verify Token API response:", data);
//       return data;
//     } catch (error) {
//       console.error("❌ Verify Token API error:", error);
//       return { success: false, message: error.message };
//     }
//   };

//   // ✅ Fetch user & permissions from backend using verifyToken API
//   const fetchUserAndPermissions = async (authToken) => {
//     try {
//       setLoading(true);
//       console.log("🌐 Verifying token and loading permissions...");

//       const data = await verifyToken(authToken);

//       // ✅ Update user & permissions if success
//       if (data.success || data.status) {
//         const userData = data.data?.user || data.user || {};
//         const roleData =
//           data.data?.user?.role || data.data?.roleData || data.roleData || {};

//         console.log("✅ Session restored successfully:", {
//           user: userData,
//           role: roleData,
//         });

//         setUser(userData);
//         updatePermissions(roleData);
//       } else {
//         console.warn("❌ Token invalid or expired. Clearing session...");
//         clearPermissions();
//       }
//     } catch (err) {
//       console.error("⚠️ Error verifying session:", err);
//       clearPermissions();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ On refresh — if token exists, re-fetch permissions
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       console.log("🔁 Token found, restoring user and permissions...");
//       fetchUserAndPermissions(storedToken);
//     } else {
//       console.log("🚫 No token found — clearing permissions");
//       clearPermissions();
//     }
//   }, []);

//   // ✅ Memoized context value
//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       permissions,
//       loading,
//       saveToken,
//       updatePermissions,
//       clearPermissions,
//     }),
//     [token, user, permissions, loading]
//   );

//   return (
//     <PermissionContext.Provider value={value}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => useContext(PermissionContext);
















//========================================//
// PermissionContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   ReactNode,
// } from "react";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useMemo, 
  useState 
} from "react";
import type { ReactNode } from "react";

// --------------------
// ✅ Types
// --------------------
export interface PermissionContextType {
  token: string | null;
  user: any;
  permissions: Record<string, any>;
  loading: boolean;
  saveToken: (token: string) => void;
  updatePermissions: (data: any) => void;
  clearPermissions: () => void;
}

interface PermissionProviderProps {
  children: ReactNode;
}

// --------------------
// ✅ Context
// --------------------
const PermissionContext = createContext<PermissionContextType>({
  token: null,
  user: null,
  permissions: {},
  loading: false,
  saveToken: () => {},
  updatePermissions: () => {},
  clearPermissions: () => {},
});

// --------------------
// ✅ Provider
// --------------------
export const PermissionProvider = ({ children }: PermissionProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const saveToken = (newToken: string) => {
    console.log("💾 Token saved:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const updatePermissions = (roleData: any = {}) => {
    const roleConfig = roleData.roleConfig || {};
    const rolePerms = roleData.permissions || {};
    const finalPerms = Object.keys(roleConfig).length ? roleConfig : rolePerms;

    console.log("🔐 Permissions updated (in memory only):", finalPerms);
    setPermissions(finalPerms);
  };

  const clearPermissions = () => {
    console.log("🧹 Clearing all authentication data...");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPermissions({});
  };

  const verifyToken = async (authToken: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      console.log("🧭 Verify Token API response:", data);
      return data;
    } catch (error: any) {
      console.error("❌ Verify Token API error:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchUserAndPermissions = async (authToken: string) => {
    try {
      setLoading(true);
      console.log("🌐 Verifying token and loading permissions...");

      const data = await verifyToken(authToken);

      if (data.success || data.status) {
        const userData = data.data?.user || data.user || {};
        const roleData =
          data.data?.user?.role || data.data?.roleData || data.roleData || {};

        console.log("✅ Session restored successfully:", {
          user: userData,
          role: roleData,
        });

        setUser(userData);
        updatePermissions(roleData);
      } else {
        console.warn("❌ Token invalid or expired. Clearing session...");
        clearPermissions();
      }
    } catch (err) {
      console.error("⚠️ Error verifying session:", err);
      clearPermissions();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("🔁 Token found, restoring user and permissions...");
      fetchUserAndPermissions(storedToken);
    } else {
      console.log("🚫 No token found — clearing permissions");
      clearPermissions();
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      permissions,
      loading,
      saveToken,
      updatePermissions,
      clearPermissions,
    }),
    [token, user, permissions, loading]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// --------------------
// ✅ Hook
// --------------------
export const usePermission = (): PermissionContextType =>
  useContext(PermissionContext);

//=======================================//























// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// const PermissionContext = createContext({});

// export const PermissionProvider = ({ children }) => {
//   // ✅ Get token from localStorage
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [user, setUser] = useState(null);
//   const [permissions, setPermissions] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ✅ Use the Vite environment variable
//   const BASE_URL = import.meta.env.VITE_BASE_URL;

//   // ✅ Save token persistently (in localStorage only)
//   const saveToken = (newToken) => {
//     console.log("💾 Token saved:", newToken);
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   // ✅ Update permissions (in memory only)
//   const updatePermissions = (roleData = {}) => {
//     const roleConfig = roleData.roleConfig || {};
//     const rolePerms = roleData.permissions || {};
//     const finalPerms = Object.keys(roleConfig).length ? roleConfig : rolePerms;

//     console.log("🔐 Permissions updated (in memory only):", finalPerms);
//     setPermissions(finalPerms);
//   };

//   // ✅ Clear all authentication info (logout)
//   const clearPermissions = () => {
//     console.log("🧹 Clearing all authentication data...");
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     setPermissions({});
//   };

//   // ✅ Fetch user & permissions from backend using existing token
//   const fetchUserAndPermissions = async (authToken) => {
//     try {
//       setLoading(true);
//       console.log("🌐 Verifying token and loading permissions...");

//       // ✅ Correct API endpoint & base URL for Vite
//       const res = await fetch(`${BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         // optional body: only needed if backend expects token in body
//         body: JSON.stringify({ token: authToken }),
//       });

//       const data = await res.json();

//       console.log("🧭 Login/verify API response: fetch user funtion ", data);

//       // ✅ Update user & permissions if success
//       if (data.success || data.status) {
//         const userData = data.data?.user || data.user || {};
//         const roleData =
//           data.data?.user?.role || data.data?.roleData || data.roleData || {};

//         console.log("✅ Session restored successfully:", {
//           user: userData,
//           role: roleData,
//         });

//         setUser(userData);
//         updatePermissions(roleData);
//       } else {
//         console.warn("❌ Token invalid or expired. Clearing session...");
//         clearPermissions();
//       }
//     } catch (err) {
//       console.error("⚠️ Error verifying session:", err);
//       clearPermissions();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ On refresh — if token exists, re-fetch permissions
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       console.log("🔁 Token found, restoring user and permissions...");
//       fetchUserAndPermissions(storedToken);
//     } else {
//       console.log("🚫 No token found — clearing permissions");
//       clearPermissions();
//     }
//   }, []);

//   // ✅ Memoized context value
//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       permissions,
//       loading,
//       saveToken,
//       updatePermissions,
//       clearPermissions,
//     }),
//     [token, user, permissions, loading]
//   );

//   return (
//     <PermissionContext.Provider value={value}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => useContext(PermissionContext);

// const PermissionContext = createContext({});

// export const PermissionProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [user, setUser] = useState(null);
//   const [permissions, setPermissions] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ✅ Save token persistently (localStorage)
//   const saveToken = (newToken) => {
//     console.log("💾 Token saved in localStorage:", newToken);
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   // ✅ Save permissions only in memory (context)
//   const updatePermissions = (roleData = {}) => {
//     const roleConfig = roleData.roleConfig || {};
//     const rolePerms = roleData.permissions || {};
//     const finalPerms = Object.keys(roleConfig).length ? roleConfig : rolePerms;

//     console.log("🔐 Permissions saved in memory only:", finalPerms);
//     setPermissions(finalPerms);
//   };

//   // ✅ Clear all auth info (logout)
//   const clearPermissions = () => {
//     console.log("🧹 Clearing token and permissions...");
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     setPermissions({});
//   };

//   // ✅ On refresh — keep user logged in using token, but no verify API call
//   useEffect(() => {
//     if (token) {
//       console.log("🔁 Token found in localStorage, restoring session...");
//       setUser({ loggedIn: true }); // fake user for session restore
//     } else {
//       console.log("🚫 No token found — user logged out");
//       clearPermissions();
//     }
//   }, [token]);

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       permissions,
//       loading,
//       saveToken,
//       updatePermissions,
//       clearPermissions,
//     }),
//     [token, user, permissions, loading]
//   );

//   return (
//     <PermissionContext.Provider value={value}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => useContext(PermissionContext);
