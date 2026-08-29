import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpiryTimer from "../../components/ExpiryTimer";
import { useNotifications } from "../../context/NotificationContext";
import { getOpenDeliveries, acceptDelivery } from "../../api/deliveryApi";

export default function OpenDeliveries() {
  const navigate = useNavigate();
  const { refreshSignal } = useNotifications() || {};
  const [openDeliveries, setOpenDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);
  const [urgentOnly, setUrgentOnly] = useState(false);

  const load = async () => {
    try {
      const res = await getOpenDeliveries();
      setOpenDeliveries(res.data);
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

  const handleAccept = async (deliveryId) => {
    setActingId(deliveryId);
    setError("");
    try {
      await acceptDelivery(deliveryId);
      navigate("/volunteer/my");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept delivery.");
    } finally {
      setActingId(null);
    }
  };

  const filteredDeliveries = urgentOnly
    ? openDeliveries.filter((d) => d.isUrgent)
    : [...openDeliveries].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Open Deliveries</h2>
        <button
          className={`btn btn-sm ${urgentOnly ? "btn-primary" : "btn-outline"}`}
          onClick={() => setUrgentOnly((prev) => !prev)}
        >
          {urgentOnly ? "⚡ Showing Urgent Only" : "⚡ Filter Urgent First"}
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : filteredDeliveries.length === 0 ? (
        <div className="card empty-state">No open deliveries right now.</div>
      ) : (
        filteredDeliveries.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                  <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                  <ExpiryTimer expiresAt={d.expiresAt} isUrgent={d.isUrgent} />
                </div>
                <div className="meta" style={{ marginTop: 4 }}>Pickup: {d.pickupAddress}</div>
                <div className="meta">Deliver to: {d.orphanageName}</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => handleAccept(d.id)} disabled={actingId === d.id}>
                {actingId === d.id ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
