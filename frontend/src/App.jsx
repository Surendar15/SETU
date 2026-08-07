import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DonorDashboard from "./pages/donor/DonorDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import OrphanageDashboard from "./pages/orphanage/OrphanageDashboard";

function Unauthorized() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>403 - Not authorized to view this page</h2>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["DONOR"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/volunteer"
            element={
              <ProtectedRoute allowedRoles={["VOLUNTEER"]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orphanage"
            element={
              <ProtectedRoute allowedRoles={["ORPHANAGE"]}>
                <OrphanageDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
