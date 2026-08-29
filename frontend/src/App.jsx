import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";

import DonorLayout from "./pages/donor/DonorLayout";
import DonorHome from "./pages/donor/DonorHome";
import PostDonation from "./pages/donor/PostDonation";
import MyDonations from "./pages/donor/MyDonations";

import VolunteerLayout from "./pages/volunteer/VolunteerLayout";
import VolunteerHome from "./pages/volunteer/VolunteerHome";
import OpenDeliveries from "./pages/volunteer/OpenDeliveries";
import MyDeliveries from "./pages/volunteer/MyDeliveries";

import OrphanageLayout from "./pages/orphanage/OrphanageLayout";
import OrphanageHome from "./pages/orphanage/OrphanageHome";
import Browse from "./pages/orphanage/Browse";
import MyRequests from "./pages/orphanage/MyRequests";
import Incoming from "./pages/orphanage/Incoming";

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
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/donor"
              element={
                <ProtectedRoute allowedRoles={["DONOR"]}>
                  <DonorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DonorHome />} />
              <Route path="home" element={<DonorHome />} />
              <Route path="post" element={<PostDonation />} />
              <Route path="donations" element={<MyDonations />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="/volunteer"
              element={
                <ProtectedRoute allowedRoles={["VOLUNTEER"]}>
                  <VolunteerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<VolunteerHome />} />
              <Route path="home" element={<VolunteerHome />} />
              <Route path="open" element={<OpenDeliveries />} />
              <Route path="my" element={<MyDeliveries />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="/orphanage"
              element={
                <ProtectedRoute allowedRoles={["ORPHANAGE"]}>
                  <OrphanageLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OrphanageHome />} />
              <Route path="home" element={<OrphanageHome />} />
              <Route path="browse" element={<Browse />} />
              <Route path="requests" element={<MyRequests />} />
              <Route path="incoming" element={<Incoming />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
