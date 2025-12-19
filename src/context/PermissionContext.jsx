import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PermissionContext = createContext({});

export const PermissionProvider = ({ children }) => {
  // ✅ Get token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Use the Vite environment variable
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ✅ Save token persistently (in localStorage only)
  const saveToken = (newToken) => {
    console.log("💾 Token saved:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // ✅ Update permissions (in memory only)
  const updatePermissions = (roleData = {}) => {
    const roleConfig = roleData.roleConfig || {};
    const rolePerms = roleData.permissions || {};
    const finalPerms = Object.keys(roleConfig).length ? roleConfig : rolePerms;

    console.log("🔐 Permissions updated (in memory only):", finalPerms);
    setPermissions(finalPerms);
  };

  // ✅ Clear all authentication info (logout)
  const clearPermissions = () => {
    console.log("🧹 Clearing all authentication data...");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPermissions({});
  };

  // ✅ Verify token API (same structure, just using /auth/verify)
  const verifyToken = async (authToken) => {
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
    } catch (error) {
      console.error("❌ Verify Token API error:", error);
      return { success: false, message: error.message };
    }
  };

  // ✅ Fetch user & permissions from backend using verifyToken API
  const fetchUserAndPermissions = async (authToken) => {
    try {
      setLoading(true);
      console.log("🌐 Verifying token and loading permissions...");

      const data = await verifyToken(authToken);

      // ✅ Update user & permissions if success
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

  // ✅ On refresh — if token exists, re-fetch permissions
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

  // ✅ Memoized context value
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

export const usePermission = () => useContext(PermissionContext);
