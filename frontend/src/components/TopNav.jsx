import { useAuth } from "../context/AuthContext";

const ROLE_LABEL = {
  DONOR: "Donor",
  VOLUNTEER: "Volunteer",
  ORPHANAGE: "Orphanage",
};

export default function TopNav() {
  const { user, logout } = useAuth();

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div className="brand">
          <span className="brand-mark" />
          Setu
        </div>
        <div className="user-block">
          <span className="role-chip">{ROLE_LABEL[user?.role] || user?.role}</span>
          <span className="user-name">{user?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
