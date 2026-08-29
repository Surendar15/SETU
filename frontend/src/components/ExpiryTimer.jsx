import { useState, useEffect } from "react";

export default function ExpiryTimer({ expiresAt, isUrgent }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTime = () => {
      const target = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      setIsExpired(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h remaining`);
      } else {
        const pad = (n) => String(n).padStart(2, "0");
        setTimeLeft(`${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt && !isUrgent) return null;

  const isCritical = isExpired || (timeLeft && !timeLeft.includes("d") && parseInt(timeLeft.slice(0, 2)) < 2);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 8px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "var(--font-mono)",
        background: isExpired
          ? "#fee2e2"
          : isCritical
          ? "#fef3c7"
          : "rgba(234, 179, 8, 0.12)",
        color: isExpired
          ? "#dc2626"
          : isCritical
          ? "#b45309"
          : "#854d0e",
        border: `1px solid ${
          isExpired ? "#fca5a5" : isCritical ? "#fcd34d" : "rgba(234, 179, 8, 0.3)"
        }`,
      }}
    >
      {isUrgent && <span style={{ animation: "pulse 1.5s infinite" }}>⚡ URGENT</span>}
      {expiresAt && (
        <span>
          {isExpired ? "⚠️ EXPIRED" : `⏳ ${timeLeft}`}
        </span>
      )}
    </div>
  );
}
