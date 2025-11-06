import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import { isAuthenticated, getUserRole } from "../../utils/auth";

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   allowedRoles?: string[]; // roles allowed to access this route
// }
// const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
//   if (!isAuthenticated()) return <Navigate to="/signin" replace />;
//   if (allowedRoles && allowedRoles.length > 0) {
//     const role = getUserRole();
//     if (!role || !allowedRoles.includes(role)) {
//       return <Navigate to="/" replace />; // redirect to fallback (Admin dashboard)
//     }
//   }
//   return children;
// };
// export default ProtectedRoute;

