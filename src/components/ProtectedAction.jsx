import { usePermission } from "../context/PermissionContext";

export default function ProtectedAction({ module, action, children }) {
  const { permissions } = usePermission();
  const allowed = permissions?.[module]?.[action];
  if (!allowed) return null;
  // return children;
  return typeof children === "function"
    ? children(allowed)
    : children;
}
