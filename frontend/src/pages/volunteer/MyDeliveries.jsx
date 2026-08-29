import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import ChatPanel from "../../components/ChatPanel";
import { getMyDeliveries, updateDeliveryStatus } from "../../api/deliveryApi";
import { getRatingsForUser } from "../../api/ratingApi";

const nextStatus = { PENDING_PICKUP: "PICKED_UP", PICKED_UP: "IN_TRANSIT", IN_TRANSIT: "DELIVERED" };
const nextActionLabel = {
  PENDING_PICKUP: "Mark picked up",
  PICKED_UP: "Mark in transit",
  IN_TRANSIT: "Mark delivered",
};

export default function MyDeliveries() {
  const { user } = useAuth();
  const { refreshSignal } = useNotifications() || {};
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [ratingsByDonation, setRatingsByDonation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);
  const [openChatId, setOpenChatId] = useState(null);

  const load = async () => {
    try {
      const res = await getMyDeliveries();
      setMyDeliveries(res.data);

      if (user?.userId) {
        const ratingsRes = await getRatingsForUser(user.userId);
        const grouped = {};
        ratingsRes.data.forEach((r) => {
          grouped[r.donationId] = r;
        });
        setRatingsByDonation(grouped);
      }
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

  const handleAdvanceStatus = async (deliveryId, currentStatus) => {
    const newStatus = nextStatus[currentStatus];
    if (!newStatus) return;
    setActingId(deliveryId);
    setError("");
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : myDeliveries.length === 0 ? (
        <div className="card empty-state">You haven't accepted any deliveries yet.</div>
      ) : (
        myDeliveries.map((d) => {
          const rating = ratingsByDonation[d.donationId];
          return (
            <div key={d.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div>
                  <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                  <div className="meta" style={{ marginTop: 4 }}>Pickup: {d.pickupAddress}</div>
                  <div className="meta">Deliver to: {d.orphanageName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`status status-${d.status.toLowerCase()}`} style={{ marginBottom: 8, display: "inline-flex" }}>
                    <span className="status-dot" />
                    {d.status}
                  </span>
                  {nextStatus[d.status] && (
                    <div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAdvanceStatus(d.id, d.status)} disabled={actingId === d.id}>
                        {actingId === d.id ? "Updating..." : nextActionLabel[d.status]}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" onClick={() => setOpenChatId(openChatId === d.id ? null : d.id)}>
                  {openChatId === d.id ? "Hide chat" : "💬 Delivery Chat"}
                </button>
              </div>

              {openChatId === d.id && (
                <ChatPanel deliveryId={d.id} onClose={() => setOpenChatId(null)} />
              )}

              {rating && (
                <div className="meta" style={{ marginTop: 10, color: "var(--gold-dark)" }}>
                  Rated by {rating.raterName}: {"★".repeat(rating.stars)}{"☆".repeat(5 - rating.stars)}
                  {rating.comment ? ` — "${rating.comment}"` : ""}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
