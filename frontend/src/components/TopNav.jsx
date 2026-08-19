import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const ROLE_LABEL = {
  DONOR: "Donor",
  VOLUNTEER: "Volunteer",
  ORPHANAGE: "Orphanage",
};

export default function TopNav() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications() || {};
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) markAllRead?.();
  };

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div className="brand">
          <span className="brand-mark" />
          Setu
        </div>
        <div className="user-block">
          <div style={{ position: "relative" }}>
            <button className="btn btn-outline btn-sm" onClick={toggleOpen} style={{ position: "relative" }}>
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "var(--clay)",
                    color: "#fff",
                    borderRadius: "100px",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 320,
                  maxHeight: 360,
                  overflowY: "auto",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                  zIndex: 50,
                }}
              >
                {(!notifications || notifications.length === 0) ? (
                  <div className="empty-state" style={{ padding: 24 }}>No notifications yet</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

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