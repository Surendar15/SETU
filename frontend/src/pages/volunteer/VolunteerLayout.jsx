import { NavLink, Outlet } from "react-router-dom";
import TopNav from "../../components/TopNav";

export default function VolunteerLayout() {
  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="tabs">
          <NavLink to="/volunteer/open" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Open deliveries
          </NavLink>
          <NavLink to="/volunteer/my" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            My deliveries
          </NavLink>
          <NavLink to="/volunteer/profile" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Profile
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
