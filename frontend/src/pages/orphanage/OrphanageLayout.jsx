import { NavLink, Outlet } from "react-router-dom";
import TopNav from "../../components/TopNav";

export default function OrphanageLayout() {
  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="tabs">
          <NavLink to="/orphanage/browse" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Browse
          </NavLink>
          <NavLink to="/orphanage/requests" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            My requests
          </NavLink>
          <NavLink to="/orphanage/incoming" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Incoming
          </NavLink>
          <NavLink to="/orphanage/profile" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Profile
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
