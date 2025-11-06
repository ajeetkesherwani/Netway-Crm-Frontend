import React, { createContext, useContext, useMemo } from "react";

const PermissionContext = createContext({});

export const PermissionProvider = ({ children }) => {
  const storedPermissions = localStorage.getItem("rolePermission");
  const permissions = useMemo(() => {
    try {
      return storedPermissions ? JSON.parse(storedPermissions) : {};
    } catch {
      return {};
    }
  }, [storedPermissions]);
  console.log("Permissions loaded:", permissions);
  return (
    <PermissionContext.Provider value={{ permissions }}>
      {children}
    </PermissionContext.Provider>
  );
};
export const usePermission = () => useContext(PermissionContext);
