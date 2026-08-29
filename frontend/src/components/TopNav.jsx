import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const ROLE_LABEL = {
  DONOR: "Donor",
  VOLUNTEER: "Volunteer",
  ORPHANAGE: "Orphanage",
};

const ROLE_NAV_ITEMS = {
  DONOR: [
    { to: "/donor/home", label: "Home", icon: "🏠" },
    { to: "/donor/post", label: "Post Donation", icon: "➕" },
    { to: "/donor/donations", label: "My Donations", icon: "📦" },
    { to: "/donor/profile", label: "Profile", icon: "👤" },
  ],
  VOLUNTEER: [
    { to: "/volunteer/home", label: "Home", icon: "🏠" },
    { to: "/volunteer/open", label: "Open Deliveries", icon: "🚚" },
    { to: "/volunteer/my", label: "My Deliveries", icon: "📦" },
    { to: "/volunteer/profile", label: "Profile", icon: "👤" },
  ],
  ORPHANAGE: [
    { to: "/orphanage/home", label: "Home", icon: "🏠" },
    { to: "/orphanage/browse", label: "Browse", icon: "🔍" },
    { to: "/orphanage/requests", label: "My Requests", icon: "📋" },
    { to: "/orphanage/incoming", label: "Incoming", icon: "🚚" },
    { to: "/orphanage/profile", label: "Profile", icon: "👤" },
  ],
};

export default function TopNav() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, clearNotifications, soundEnabled, toggleSound } = useNotifications() || {};
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleNotifOpen = () => {
    setNotifOpen((prev) => !prev);
    setMenuOpen(false);
    if (!notifOpen) markAllRead?.();
  };

  const toggleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
    setNotifOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const rolePath = user?.role?.toLowerCase() || "";
  const navItems = ROLE_NAV_ITEMS[user?.role] || [];

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to={`/${rolePath}`} className="brand" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Setu Logo" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6 }} />
            Setu
          </Link>

          {/* 3-Line Hamburger Box Button */}
          {navItems.length > 0 && (
            <div style={{ position: "relative" }}>
              <button className="hamburger-btn" onClick={toggleMenuOpen} title="Switch Section Menu">
                <div className="hamburger-icon">
                  <span className="hamburger-line" />
                  <span className="hamburger-line" />
                  <span className="hamburger-line" />
                </div>
                <span>Menu</span>
              </button>

              {/* Hamburger Role Switching Dropdown Drawer */}
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "calc(100% + 10px)",
                    width: 260,
                    background: "var(--surface)",
                    border: "1.5px solid var(--line)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-lg)",
                    padding: "8px",
                    zIndex: 120,
                    animation: "fadeIn 0.2s ease-out",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-dim)",
                      borderBottom: "1px solid var(--line)",
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{user?.role} NAVIGATION</span>
                    <span style={{ fontSize: 10, background: "var(--brand-tint)", color: "var(--brand-dark)", padding: "2px 6px", borderRadius: 4 }}>
                      {ROLE_LABEL[user?.role]}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => `nav-role-item ${isActive ? "active" : ""}`}
                        style={{
                          borderRadius: "var(--radius-sm)",
                          padding: "10px 12px",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="user-block">
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={toggleNotifOpen}
              style={{ position: "relative", borderRadius: "50%", width: 36, height: 36, padding: 0 }}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    background: "var(--clay)",
                    color: "#fff",
                    borderRadius: "100px",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  width: 340,
                  maxHeight: 400,
                  overflowY: "auto",
                  background: "var(--surface)",
                  border: "1.5px solid var(--line)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 120,
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--surface-hover)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Notifications
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, padding: "2px 8px" }}
                      onClick={toggleSound}
                      title={soundEnabled ? "Mute alert chime" : "Unmute alert chime"}
                    >
                      {soundEnabled ? "🔊 Sound" : "🔇 Muted"}
                    </button>
                    {notifications && notifications.length > 0 && (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: "2px 8px" }}
                        onClick={clearNotifications}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {(!notifications || notifications.length === 0) ? (
                  <div className="empty-state" style={{ padding: 24 }}>No notifications yet</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                      <div>{n.message}</div>
                      {n.timestamp && (
                        <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                          {n.timestamp}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <span className="role-chip">{ROLE_LABEL[user?.role] || user?.role}</span>

          <Link
            to={`/${rolePath}/profile`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--brand-tint)",
                border: "1.5px solid var(--brand-light)",
                color: "var(--brand-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
            >
              {getInitials(user?.name)}
            </div>
            <span className="user-name">{user?.name}</span>
          </Link>

          <button className="btn btn-outline btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}