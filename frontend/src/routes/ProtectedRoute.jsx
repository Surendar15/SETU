import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap a page with this to require login, and optionally restrict to
 * specific roles.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={["DONOR"]}>
 *     <DonorDashboard />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
