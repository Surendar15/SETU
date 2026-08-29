import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImpactStats } from "../api/statsApi";
import AnalyticsChart from "../components/AnalyticsChart";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";
import LiveDemoPlayer from "../components/LiveDemoPlayer";

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [activeRoleTab, setActiveRoleTab] = useState("DONOR");

  useEffect(() => {
    getImpactStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const roleHighlights = {
    DONOR: {
      title: "Give directly to verified orphanages near you.",
      desc: "List surplus food, clothing, books, or medicine in under 60 seconds. Setu matches your donation with nearby orphanages and dispatches a verified volunteer driver for pickup.",
      cta: "Post a Donation Now",
      link: "/register?role=DONOR",
      badge: "🤲 DONOR NETWORK",
    },
    VOLUNTEER: {
      title: "Power the last-mile logistics of social good.",
      desc: "Browse available pickup and drop-off requests along your routine routes. Accept a trip, transport supplies safely, and earn community trust badges for every delivery completed.",
      cta: "Become a Volunteer Driver",
      link: "/register?role=VOLUNTEER",
      badge: "🚚 VOLUNTEER CORPS",
    },
    ORPHANAGE: {
      title: "Receive essential supplies without administrative friction.",
      desc: "Browse live donation postings or submit specific resource requests for your care center. Track incoming shipments with real-time status updates from pickup to drop-off.",
      cta: "Register Your Care Center",
      link: "/register?role=ORPHANAGE",
      badge: "🏠 VERIFIED ORGANIZATIONS",
    },
  };

  const currentRole = roleHighlights[activeRoleTab];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="page-shell" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Top Glassmorphic Navigation */}
      <div className="topnav" style={{ backdropFilter: "blur(14px)", background: "rgba(11, 26, 21, 0.92)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="topnav-inner">
          <div
            className="brand"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/logo.png"
              alt="Setu Logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                objectFit: "contain",
                boxShadow: "0 0 12px rgba(16, 185, 129, 0.4)",
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
              }}
            >
              Setu
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={(e) => scrollToSection(e, "how-it-works")}
              style={{
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.85)",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#34D399"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)"; e.currentTarget.style.background = "none"; }}
            >
              How It Works
            </button>
            <button
              onClick={(e) => scrollToSection(e, "analytics-section")}
              style={{
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.85)",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#34D399"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)"; e.currentTarget.style.background = "none"; }}
            >
              Impact Stats
            </button>
            <Link to="/login" className="btn btn-glass btn-sm" style={{ padding: "8px 18px", fontSize: 13 }}>
              Log in
            </Link>
            <Link to="/register" className="btn btn-gold btn-sm" style={{ padding: "8px 20px", fontSize: 13 }}>
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div
        style={{
          background: "linear-gradient(145deg, #092C22 0%, #0F4C3A 50%, #071E17 100%)",
          color: "#FFFFFF",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow backdrop circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(245, 158, 11, 0.12)", filter: "blur(80px)" }} />

        <div className="container" style={{ maxWidth: 1200, position: "relative", zIndex: 2 }}>
          {/* Centered Hero Content */}
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "6px 14px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                color: "#34D399",
                letterSpacing: "0.06em",
                marginBottom: 20,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
              NEXT-GEN SOCIAL IMPACT LOGISTICS
            </div>

            <h1 style={{ fontSize: 52, lineHeight: 1.12, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
              Bridge the gap between <span style={{ background: "linear-gradient(135deg, #34D399, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>giving and receiving.</span>
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255, 255, 255, 0.85)", maxWidth: 640, marginTop: 18 }}>
              Setu connects donors with surplus goods, volunteer drivers with routine routes, and orphanages with essential supplies in one transparent, real-time logistics chain.
            </p>

            {/* Role Switcher Pills */}
            <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap", justifyContent: "center" }}>
              {["DONOR", "VOLUNTEER", "ORPHANAGE"].map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRoleTab(r)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 100,
                    border: activeRoleTab === r ? "1.5px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.2)",
                    background: activeRoleTab === r ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    color: activeRoleTab === r ? "#FBBF24" : "rgba(255, 255, 255, 0.85)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: activeRoleTab === r ? "0 4px 14px rgba(245, 158, 11, 0.25)" : "none",
                  }}
                >
                  {r === "DONOR" ? "🤲 For Donors" : r === "VOLUNTEER" ? "🚚 For Volunteers" : "🏠 For Orphanages"}
                </button>
              ))}
            </div>

            {/* Dynamic Role Highlight Card */}
            <div
              style={{
                marginTop: 22,
                padding: "20px 26px",
                background: "rgba(255, 255, 255, 0.07)",
                backdropFilter: "blur(12px)",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                maxWidth: 620,
                width: "100%",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#FBBF24" }}>{currentRole.badge}</div>
              <h3 style={{ fontSize: 20, color: "#FFFFFF", marginTop: 6 }}>{currentRole.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", marginTop: 6, lineHeight: 1.55 }}>{currentRole.desc}</p>
            </div>

            {/* Action CTA Buttons */}
            <div style={{ marginTop: 28, display: "flex", gap: 14, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to={currentRole.link} className="btn btn-gold" style={{ padding: "14px 32px", fontSize: 15, fontWeight: 700 }}>
                {currentRole.cta} →
              </Link>
              <Link to="/login" className="btn btn-glass" style={{ padding: "14px 28px", fontSize: 15, fontWeight: 600 }}>
                Log In to Platform
              </Link>
            </div>
          </div>

          {/* Full-Width Expansive Video Player (Notion Style) */}
          <div style={{ maxWidth: 1040, margin: "52px auto 0", width: "100%" }}>
            <LiveDemoPlayer />
          </div>
        </div>
      </div>

      {/* Trust Metrics Bar */}
      <div className="container" style={{ maxWidth: 1280, marginTop: -40, position: "relative", zIndex: 10 }}>
        <div
          className="stats-grid"
          style={{
            background: "var(--surface)",
            padding: "24px 32px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--line)",
          }}
        >
          <div className="stat-cell">
            <div className="stat-number">{stats ? stats.totalDonationsPosted : "1,250+"}</div>
            <div className="stat-label">Donations Posted</div>
          </div>
          <div className="stat-cell">
            <div className="stat-number">{stats ? stats.totalDonationsDelivered : "1,180+"}</div>
            <div className="stat-label">Deliveries Completed</div>
          </div>
          <div className="stat-cell">
            <div className="stat-number">{stats ? stats.activeDeliveriesCount : "24"}</div>
            <div className="stat-label">Active In-Transit</div>
          </div>
          <div className="stat-cell">
            <div className="stat-number">
              {stats ? stats.totalDonorsCount + stats.totalVolunteersCount + stats.totalOrphanagesCount : "450+"}
            </div>
            <div className="stat-label">Verified Members</div>
          </div>
        </div>
      </div>

      {/* Platform Capabilities & Features Grid */}
      <div className="container" style={{ maxWidth: 1280, paddingTop: 80 }} id="how-it-works">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <span className="auth-eyebrow" style={{ color: "var(--brand)" }}>BUILT FOR EFFICIENCY & TRUST</span>
          <h2 style={{ fontSize: 32, marginTop: 6, fontWeight: 800 }}>Engineered for Seamless Social Impact</h2>
          <p className="meta" style={{ fontSize: 15, marginTop: 8 }}>
            Setu replaces fragmented group chats and word-of-mouth coordination with automated logistics, status tracking, and verified trust.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Real-Time Lifecycle Tracking</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Every item moves through explicit state transitions: Posted → Accepted → In Transit → Delivered. Both donor and recipient stay informed every step of the way.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Verified Organization Screening</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Orphanages and care centers register with official government NGO IDs, ensuring donations reach genuine non-profit organizations.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Smart Geolocation Detection</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Donors can auto-detect their exact pickup coordinates with one click, eliminating manual address typing errors and aiding swift driver pickup.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Volunteer Recognition & Ratings</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Volunteers earn peer reviews, delivery badges, and positions on the community leaderboard after every successfully completed delivery.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Transparent Impact Analytics</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Visualize network throughput with live category charts (Food, Clothes, Books, Medicine) showing real community impact over time.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Instant STOMP Alerts</h3>
            <p className="meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Receive instant in-app alerts when a volunteer accepts your pickup, or when an orphanage accepts your posted item.
            </p>
          </div>
        </div>
      </div>

      {/* How Setu Serves Each Role (High-Res Photos Section) */}
      <div className="container" style={{ maxWidth: 1280, paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <span className="auth-eyebrow" style={{ color: "var(--gold-dark)" }}>THREE ROLES, ONE NETWORK</span>
          <h2 style={{ fontSize: 32, marginTop: 6, fontWeight: 800 }}>Designed for Everyone in the Chain</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 28 }}>
          {/* Card 1: Donor */}
          <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src="/images/donor_card_img.jpg" alt="Donor packing supplies" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            <div style={{ padding: 24 }}>
              <span className="auth-eyebrow" style={{ color: "var(--brand)" }}>FOR DONORS</span>
              <h3 style={{ fontSize: 20, marginTop: 6, fontWeight: 700 }}>Turn Surplus into Instant Support</h3>
              <p className="meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                Post items with photos, expiry times for perishable meals, and auto-detected pickup addresses. Accept requests from verified orphanages with confidence.
              </p>
              <div style={{ marginTop: 18 }}>
                <Link to="/register?role=DONOR" className="btn btn-outline btn-sm">Start Giving →</Link>
              </div>
            </div>
          </div>

          {/* Card 2: Volunteer */}
          <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src="/images/volunteer_card_img.jpg" alt="Volunteer driver loading van" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            <div style={{ padding: 24 }}>
              <span className="auth-eyebrow" style={{ color: "var(--gold-dark)" }}>FOR VOLUNTEERS</span>
              <h3 style={{ fontSize: 20, marginTop: 6, fontWeight: 700 }}>Deliver Goodness Along Your Route</h3>
              <p className="meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                Browse open pickups in your district, accept deliveries matching your vehicle type, and guide shipments safely to children's care centers.
              </p>
              <div style={{ marginTop: 18 }}>
                <Link to="/register?role=VOLUNTEER" className="btn btn-outline btn-sm">Become a Driver →</Link>
              </div>
            </div>
          </div>

          {/* Card 3: Orphanage */}
          <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src="/images/orphanage_card_img.jpg" alt="Children receiving books and food" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            <div style={{ padding: 24 }}>
              <span className="auth-eyebrow" style={{ color: "#2563EB" }}>FOR ORPHANAGES</span>
              <h3 style={{ fontSize: 20, marginTop: 6, fontWeight: 700 }}>Get What Your Children Need</h3>
              <p className="meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                Browse available clothes, books, and hot meals posted nearby. Request items directly and track incoming volunteer shipments on your live dashboard.
              </p>
              <div style={{ marginTop: 18 }}>
                <Link to="/register?role=ORPHANAGE" className="btn btn-outline btn-sm">Register Center →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Leaderboard Section */}
      <div className="container" style={{ maxWidth: 1280, paddingTop: 40, paddingBottom: 60 }} id="analytics-section">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 36px" }}>
          <span className="auth-eyebrow" style={{ color: "var(--brand)" }}>COMMUNITY METRICS</span>
          <h2 style={{ fontSize: 32, marginTop: 6, fontWeight: 800 }}>Real-Time Impact Analytics</h2>
        </div>

        <AnalyticsChart />
        <div style={{ marginTop: 32 }}>
          <Leaderboard />
        </div>
      </div>

      {/* High-Impact Gradient CTA Section */}
      <div className="container" style={{ maxWidth: 1280, paddingBottom: 80 }}>
        <div
          style={{
            background: "linear-gradient(135deg, #0B3B2D 0%, #0F4C3A 60%, #15624C 100%)",
            color: "#FFFFFF",
            padding: "56px 40px",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#FBBF24", textTransform: "uppercase" }}>
            JOIN THE MOVEMENT TODAY
          </div>
          <h2 style={{ fontSize: 36, marginTop: 10, fontWeight: 800, color: "#FFFFFF" }}>
            Ready to complete the chain of giving?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.85)", maxWidth: 580, margin: "14px auto 32px" }}>
            Whether you have surplus items, a vehicle and free time, or manage a children's shelter, Setu is free for everyone.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register?role=DONOR" className="btn btn-gold" style={{ padding: "14px 28px", fontSize: 15 }}>
              🤲 Join as a Donor
            </Link>
            <Link to="/register?role=VOLUNTEER" className="btn btn-glass" style={{ padding: "14px 28px", fontSize: 15 }}>
              🚚 Join as a Volunteer
            </Link>
            <Link to="/register?role=ORPHANAGE" className="btn btn-glass" style={{ padding: "14px 28px", fontSize: 15 }}>
              🏠 Register Orphanage
            </Link>
          </div>
        </div>
      </div>

      {/* Main Public Landing Footer */}
      <Footer />
    </div>
  );
}
