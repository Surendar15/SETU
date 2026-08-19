import { useEffect, useState } from "react";
import RatingRow from "../../components/RatingRow";
import ChatPanel from "../../components/ChatPanel";
import { useNotifications } from "../../context/NotificationContext";
import { getIncomingDeliveries } from "../../api/deliveryApi";
import { submitRating, getRatingsForDelivery } from "../../api/ratingApi";

export default function Incoming() {
  const { refreshSignal } = useNotifications() || {};
  const [incoming, setIncoming] = useState([]);
  const [deliveryRatings, setDeliveryRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openChatId, setOpenChatId] = useState(null);

  const load = async () => {
    setError("");
    try {
      const res = await getIncomingDeliveries();
      setIncoming(res.data);

      const deliveredIds = res.data.filter((d) => d.status === "DELIVERED").map((d) => d.id);
      const ratingsEntries = await Promise.all(
        deliveredIds.map((id) => getRatingsForDelivery(id).then((r) => [id, r.data]).catch(() => [id, []]))
      );
      setDeliveryRatings(Object.fromEntries(ratingsEntries));
    } catch {
      setError("Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  const getExistingRating = (delivery, role) => {
    const ratings = deliveryRatings[delivery.id] || [];
    const targetId = role === "DONOR" ? delivery.donorId : delivery.volunteerId;
    return ratings.find((r) => r.rateeId === targetId) || null;
  };

  const handleRatingSubmit = async (delivery, role, stars, comment) => {
    const res = await submitRating(delivery.id, role, stars, comment);
    setDeliveryRatings((prev) => ({
      ...prev,
      [delivery.id]: [...(prev[delivery.id] || []), res.data],
    }));
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : incoming.length === 0 ? (
        <div className="card empty-state">No incoming deliveries yet.</div>
      ) : (
        incoming.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                <div className="meta" style={{ marginTop: 4 }}>
                  Volunteer: {d.volunteerName || "Not yet assigned"}
                </div>
              </div>
              <span className={`status status-${d.status.toLowerCase()}`}>
                <span className="status-dot" />
                {d.status}
              </span>
            </div>

            <div style={{ marginTop: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setOpenChatId(openChatId === d.id ? null : d.id)}>
                {openChatId === d.id ? "Hide chat" : "Chat"}
              </button>
            </div>

            {openChatId === d.id && (
              <ChatPanel deliveryId={d.id} onClose={() => setOpenChatId(null)} />
            )}

            {d.status === "DELIVERED" && (
              <div>
                <RatingRow
                  delivery={d}
                  role="DONOR"
                  name={d.donorName}
                  existingRating={getExistingRating(d, "DONOR")}
                  onSubmit={handleRatingSubmit}
                />
                {d.volunteerId && (
                  <RatingRow
                    delivery={d}
                    role="VOLUNTEER"
                    name={d.volunteerName}
                    existingRating={getExistingRating(d, "VOLUNTEER")}
                    onSubmit={handleRatingSubmit}
                  />
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
