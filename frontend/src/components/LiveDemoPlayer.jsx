import { useState, useEffect } from "react";

const DEMO_SCENES = [
  {
    title: "Donor Overview & Stats",
    image: "/demo/donor_dashboard_1788005505196.png",
    duration: 3500,
  },
  {
    title: "1-Tap GPS Pickup Listing",
    image: "/demo/donor_post_donation_blank_1788005661712.png",
    duration: 3800,
  },
  {
    title: "Volunteer Open Pickups",
    image: "/demo/volunteer_open_deliveries_1788005942971.png",
    duration: 3500,
  },
  {
    title: "Active Live Route Tracking",
    image: "/demo/volunteer_my_deliveries_1788006009300.png",
    duration: 3500,
  },
  {
    title: "Care Center Resource Hub",
    image: "/demo/orphanage_available_donations_1788006236862.png",
    duration: 3500,
  },
  {
    title: "Incoming Aid Deliveries",
    image: "/demo/orphanage_incoming_deliveries_1788006390971.png",
    duration: 3500,
  },
  {
    title: "Transparent Impact Metrics",
    image: "/demo/landing_page_impact_stats_1788005014382.png",
    duration: 3500,
  },
  {
    title: "Community Champions",
    image: "/demo/landing_page_leaderboard_1788005057718.png",
    duration: 3500,
  },
];

export default function LiveDemoPlayer() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scene = DEMO_SCENES[sceneIndex];

  // Continuous smooth scene progression
  useEffect(() => {
    if (!isPlaying) return;

    setIsTransitioning(false);

    // Trigger smooth fade transition right before switching
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(true);
    }, scene.duration - 400);

    // Advance to next scene
    const advanceTimer = setTimeout(() => {
      setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
      setIsTransitioning(false);
    }, scene.duration);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(advanceTimer);
    };
  }, [sceneIndex, isPlaying]);

  const handleSeek = (idx) => {
    setSceneIndex(idx);
    setIsTransitioning(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Notion/Figma Style Clean Header & Description */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#34D399",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
          Interactive Product Tour
        </div>
        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.8)", margin: 0, lineHeight: 1.45 }}>
          See how Setu connects donors, volunteers, and orphanages in real time — from post to verified delivery.
        </p>
      </div>

      {/* Main Video Cinema Container */}
      <div
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.15)",
          border: "1.5px solid rgba(255, 255, 255, 0.2)",
          background: "#030A07",
          position: "relative",
          aspectRatio: "16 / 10",
          userSelect: "none",
        }}
      >
        {/* Full-View Image Display with Contain Mode */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            background: "#040D0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            key={scene.image}
            src={scene.image}
            alt={scene.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              transition: isTransitioning
                ? "opacity 0.4s ease-out, transform 0.4s ease-out"
                : "opacity 0.4s ease-in, transform 0.4s ease-in",
              opacity: isTransitioning ? 0.35 : 1,
              filter: "contrast(1.02) saturate(1.04)",
            }}
          />

          {/* Video Timeline Navigation Pill Indicators */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              display: "flex",
              gap: 4,
              zIndex: 15,
            }}
          >
            {DEMO_SCENES.map((_, idx) => (
              <div
                key={idx}
                onClick={() => handleSeek(idx)}
                style={{
                  width: idx === sceneIndex ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    idx === sceneIndex
                      ? "#10B981"
                      : idx < sceneIndex
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(255, 255, 255, 0.25)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: idx === sceneIndex ? "0 0 6px rgba(16, 185, 129, 0.6)" : "none",
                }}
                title={`Jump to Scene ${idx + 1}`}
              />
            ))}
          </div>

          {/* Bottom HUD: Progress Scrub Line & Bottom-Left Play Button */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(5, 15, 12, 0.95) 0%, rgba(5, 15, 12, 0.35) 60%, transparent 100%)",
              padding: "20px 14px 12px",
              zIndex: 15,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/* Interactive Video Scrub Progress Bar */}
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                position: "relative",
                cursor: "pointer",
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                const targetIdx = Math.min(
                  DEMO_SCENES.length - 1,
                  Math.floor(ratio * DEMO_SCENES.length)
                );
                handleSeek(targetIdx);
              }}
            >
              <div
                style={{
                  width: `${((sceneIndex + 1) / DEMO_SCENES.length) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #10B981, #34D399)",
                  borderRadius: 2,
                  boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            {/* Bottom-Left Play/Pause Button */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.5)",
                  transition: "all 0.2s ease",
                }}
                title={isPlaying ? "Pause Video" : "Play Video"}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
