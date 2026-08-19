import { NavLink, Outlet } from "react-router-dom";
import TopNav from "../../components/TopNav";

export default function DonorLayout() {
  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="tabs">
          <NavLink to="/donor/post" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Post a donation
          </NavLink>
          <NavLink to="/donor/donations" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Your donations
          </NavLink>
          <NavLink to="/donor/profile" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Profile
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
