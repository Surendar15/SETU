import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ROLE_HERO_CONFIG = {
  DONOR: {
    title: "🎁 Donor Hub — Share Clothes, Food & Supplies",
    subtitle: "Your spare items become someone else's direct relief. List items, geocode pickup addresses, and track real-time fulfillment.",
    bgGradient: "linear-gradient(135deg, #0F4C3A 0%, #166534 100%)",
    accentColor: "#A7F3D0",
    actions: [
      { to: "/donor/post", label: "➕ Post New Donation", isPrimary: true },
      { to: "/donor/donations", label: "📦 View My Donations", isPrimary: false },
    ],
  },
  VOLUNTEER: {
    title: "🚚 Volunteer Mission Control — Last Mile Hero",
    subtitle: "Connect donors with orphanages. Accept open deliveries, navigate optimized routes, and move donations start to finish.",
    bgGradient: "linear-gradient(135deg, #78350F 0%, #D97706 100%)",
    accentColor: "#FDE68A",
    actions: [
      { to: "/volunteer/open", label: "🚚 Browse Open Deliveries", isPrimary: true },
      { to: "/volunteer/my", label: "📦 Track Active Deliveries", isPrimary: false },
    ],
  },
  ORPHANAGE: {
    title: "🏠 Orphanage Resource Center — Direct Support Network",
    subtitle: "Request essential donations posted by generous donors in your area and track live incoming deliveries step-by-step.",
    bgGradient: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
    accentColor: "#BFDBFE",
    actions: [
      { to: "/orphanage/browse", label: "🔍 Browse Donations", isPrimary: true },
      { to: "/orphanage/incoming", label: "🚚 Live Incoming Shipments", isPrimary: false },
    ],
  },
};

export default function RoleHeroBanner() {
  const { user } = useAuth();
  if (!user || !ROLE_HERO_CONFIG[user.role]) return null;

  const config = ROLE_HERO_CONFIG[user.role];

  return (
    <div
      style={{
        background: config.bgGradient,
        color: "#FFFFFF",
        borderRadius: "var(--radius-lg)",
        padding: "28px 32px",
        marginBottom: 24,
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 640, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: config.accentColor, marginBottom: 6 }}>
          Welcome Back, {user.name} 👋
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", marginBottom: 8, lineHeight: 1.2 }}>
          {config.title}
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.5, marginBottom: 20 }}>
          {config.subtitle}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {config.actions.map((act) => (
            <Link
              key={act.to}
              to={act.to}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                background: act.isPrimary ? "#FFFFFF" : "rgba(255, 255, 255, 0.15)",
                color: act.isPrimary ? "#0F172A" : "#FFFFFF",
                border: act.isPrimary ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {act.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
