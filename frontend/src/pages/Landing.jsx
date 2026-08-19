import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImpactStats } from "../api/statsApi";

export default function Landing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getImpactStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="page-shell">
      <div className="topnav">
        <div className="topnav-inner">
          <div className="brand">
            <span className="brand-mark" />
            Setu
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        </div>
      </div>

      <div className="auth-visual" style={{ minHeight: 460, padding: "72px 24px" }}>
        <div className="container" style={{ maxWidth: 1040, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span className="auth-eyebrow">Setu · A donation logistics network</span>
            <h1 style={{ fontSize: 42 }}>The gap between giving and receiving is usually just logistics.</h1>
            <p style={{ maxWidth: 480 }}>
              Setu connects three people who rarely meet: someone with clothes or food
              to give, someone willing to carry it, and an orphanage that needs it.
              Every donation moves through a visible chain, start to finish.
            </p>
            <div className="waypoint-chain">
              <div className="waypoint">
                <span className="waypoint-dot active" />
                <span className="waypoint-label">DONOR GIVES</span>
              </div>
              <span className="waypoint-line" />
              <div className="waypoint">
                <span className="waypoint-dot active" />
                <span className="waypoint-label">VOLUNTEER CARRIES</span>
              </div>
              <span className="waypoint-line" />
              <div className="waypoint">
                <span className="waypoint-dot active" />
                <span className="waypoint-label">ORPHANAGE RECEIVES</span>
              </div>
            </div>
            <div style={{ marginTop: 36 }}>
              <Link to="/register" className="btn btn-gold">Join Setu — it's free</Link>
            </div>
          </div>

          {/* Small demo video panel - drop your own screen recording at
              frontend/public/demo-video.mp4 to replace the poster image */}
          <div className="demo-video-box">
            <video
              controls
              muted
              loop
              poster="https://picsum.photos/seed/setu-demo/480/300"
              style={{ width: "100%", display: "block", borderRadius: "var(--radius)" }}
            >
              <source src="/demo-video.mp4" type="video/mp4" />
            </video>
            <div className="demo-video-caption">See Setu in action — 60 second walkthrough</div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="container" style={{ paddingTop: 48 }}>
          <div className="stats-grid">
            <div className="stat-cell">
              <div className="stat-number">{stats.totalDonationsPosted}</div>
              <div className="stat-label">Donations posted</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">{stats.totalDonationsDelivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">{stats.activeDeliveriesCount}</div>
              <div className="stat-label">In progress now</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">
                {stats.totalDonorsCount + stats.totalVolunteersCount + stats.totalOrphanagesCount}
              </div>
              <div className="stat-label">People on Setu</div>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 56, paddingBottom: 72 }}>
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: 40 }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <img src="https://picsum.photos/seed/setu-donor/500/280" alt="A donor packing items to give away" style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 20 }}>
              <span className="auth-eyebrow" style={{ color: "var(--pine)" }}>For donors</span>
              <h3 style={{ fontSize: 18, marginTop: 8 }}>Post what you're giving away</h3>
              <p className="meta" style={{ marginTop: 8 }}>
                List clothes, food, books, or medicine with a pickup address.
                Review requests from orphanages and accept the ones that fit.
              </p>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <img src="https://picsum.photos/seed/setu-volunteer/500/280" alt="A volunteer carrying a delivery" style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 20 }}>
              <span className="auth-eyebrow" style={{ color: "var(--gold-dark)" }}>For volunteers</span>
              <h3 style={{ fontSize: 18, marginTop: 8 }}>Carry a donation, start to finish</h3>
              <p className="meta" style={{ marginTop: 8 }}>
                Browse open deliveries near you, accept one, and move it through
                pickup, transit, and drop-off — all tracked in one place.
              </p>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <img src="https://picsum.photos/seed/setu-orphanage/500/280" alt="A community organization receiving support" style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 20 }}>
              <span className="auth-eyebrow" style={{ color: "#3E6FA8" }}>For orphanages</span>
              <h3 style={{ fontSize: 18, marginTop: 8 }}>Request what you actually need</h3>
              <p className="meta" style={{ marginTop: 8 }}>
                Browse available donations, request them, and track incoming
                deliveries — no more relying on word of mouth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
