import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import ChatPanel from "../../components/ChatPanel";
import ExpiryTimer from "../../components/ExpiryTimer";
import {
  getMyDonations,
  cancelDonation,
  getRequestsForDonation,
  acceptRequest,
  rejectRequest,
} from "../../api/donationApi";
import { getRatingsForUser } from "../../api/ratingApi";

const STAGES = [
  { key: "AVAILABLE", label: "Posted" },
  { key: "REQUESTED", label: "Requested" },
  { key: "ASSIGNED", label: "Accepted" },
  { key: "PICKED_UP", label: "Picked up" },
  { key: "IN_TRANSIT", label: "In transit" },
  { key: "DELIVERED", label: "Delivered" },
];

function ProgressTracker({ status }) {
  if (status === "CANCELLED") {
    return <p className="meta" style={{ marginTop: 12 }}>This donation was cancelled.</p>;
  }
  const currentIndex = STAGES.findIndex((s) => s.key === status);
  return (
    <div className="progress-track">
      {STAGES.map((stage, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div className="progress-step" key={stage.key}>
            {i < STAGES.length - 1 && <div className={`progress-line ${isDone ? "done" : ""}`} />}
            <div className={`progress-dot ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`} />
            <span className={`progress-label ${isCurrent ? "active" : ""}`}>{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function MyDonations() {
  const { user } = useAuth();
  const { refreshSignal } = useNotifications() || {};

  const [donations, setDonations] = useState([]);
  const [ratingsByDonation, setRatingsByDonation] = useState({}); // donationId -> RatingResponse
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedDonationId, setExpandedDonationId] = useState(null);
  const [requestsByDonation, setRequestsByDonation] = useState({});
  const [openChatId, setOpenChatId] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const loadDonations = async () => {
    try {
      const res = await getMyDonations();
      setDonations(res.data);

      if (user?.userId) {
        const ratingsRes = await getRatingsForUser(user.userId);
        const grouped = {};
        ratingsRes.data.forEach((r) => {
          grouped[r.donationId] = r;
        });
        setRatingsByDonation(grouped);
      }
    } catch {
      setError("Failed to load your donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    if (expandedDonationId) refreshRequests(expandedDonationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  const handleCancel = async (donationId) => {
    try {
      await cancelDonation(donationId);
      await loadDonations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel donation.");
    }
  };

  const refreshRequests = async (donationId) => {
    try {
      const res = await getRequestsForDonation(donationId);
      setRequestsByDonation((prev) => ({ ...prev, [donationId]: res.data }));
    } catch {
      // ignore
    }
  };

  const toggleRequests = async (donationId) => {
    if (expandedDonationId === donationId) {
      setExpandedDonationId(null);
      return;
    }
    setExpandedDonationId(donationId);
    setRequestsLoading(true);
    await refreshRequests(donationId);
    setRequestsLoading(false);
  };

  const handleAccept = async (requestId, donationId) => {
    try {
      await acceptRequest(requestId);
      await loadDonations();
      await refreshRequests(donationId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept request.");
    }
  };

  const handleReject = async (requestId, donationId) => {
    try {
      await rejectRequest(requestId);
      await loadDonations();
      await refreshRequests(donationId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject request.");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}

      {loading ? (
        <p className="meta">Loading...</p>
      ) : donations.length === 0 ? (
        <div className="card empty-state">You haven't posted any donations yet.</div>
      ) : (
        donations.map((d) => {
          const rating = ratingsByDonation[d.id];
          return (
            <div key={d.id} className="card">
              {d.imageUrl && <img src={d.imageUrl} alt={d.description} className="donation-image-banner" />}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <strong>{d.category}</strong>
                    <ExpiryTimer expiresAt={d.expiresAt} isUrgent={d.isUrgent} />
                  </div>
                  <div>{d.description || "No description"}</div>
                  <div className="meta" style={{ marginTop: 4 }}>Qty: {d.quantity || "N/A"}</div>
                </div>
                <span className={`status status-${d.status.toLowerCase()}`}>
                  <span className="status-dot" />
                  {d.status}
                </span>
              </div>

              <ProgressTracker status={d.status} />

              {rating && (
                <div className="meta" style={{ marginTop: 10, color: "var(--gold-dark)" }}>
                  Rated by {rating.raterName}: {"★".repeat(rating.stars)}{"☆".repeat(5 - rating.stars)}
                  {rating.comment ? ` — "${rating.comment}"` : ""}
                </div>
              )}

              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                {d.status === "REQUESTED" && (
                  <button className="btn btn-outline btn-sm" onClick={() => toggleRequests(d.id)}>
                    {expandedDonationId === d.id ? "Hide requests" : "View requests"}
                  </button>
                )}
                {(d.status === "AVAILABLE" || d.status === "REQUESTED") && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleCancel(d.id)}>
                    Cancel
                  </button>
                )}
                {d.deliveryId && (
                  <button className="btn btn-outline btn-sm" onClick={() => setOpenChatId(openChatId === d.id ? null : d.id)}>
                    {openChatId === d.id ? "Hide chat" : "Chat"}
                  </button>
                )}
              </div>

              {openChatId === d.id && (
                <ChatPanel deliveryId={d.deliveryId} onClose={() => setOpenChatId(null)} />
              )}

              {expandedDonationId === d.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  {requestsLoading ? (
                    <p className="meta">Loading requests...</p>
                  ) : (requestsByDonation[d.id] || []).length === 0 ? (
                    <p className="meta">No requests yet.</p>
                  ) : (
                    requestsByDonation[d.id].map((r) => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>{r.orphanageName}</span>
                        {r.status === "PENDING" ? (
                          <span style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-gold btn-sm" onClick={() => handleAccept(r.id, d.id)}>Accept</button>
                            <button className="btn btn-outline btn-sm" onClick={() => handleReject(r.id, d.id)}>Reject</button>
                          </span>
                        ) : (
                          <span className={`status status-${r.status.toLowerCase()}`}>
                            <span className="status-dot" />
                            {r.status}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
