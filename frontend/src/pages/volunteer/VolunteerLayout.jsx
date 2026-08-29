import { Outlet } from "react-router-dom";
import TopNav from "../../components/TopNav";

export default function VolunteerLayout() {
  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <Outlet />
      </div>
    </div>
  );
}
