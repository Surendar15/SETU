import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapPreview from "../../components/MapPreview";
import { useNotifications } from "../../context/NotificationContext";
import { getOpenDeliveries, acceptDelivery } from "../../api/deliveryApi";

export default function OpenDeliveries() {
  const navigate = useNavigate();
  const { refreshSignal } = useNotifications() || {};
  const [openDeliveries, setOpenDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

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

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : openDeliveries.length === 0 ? (
        <div className="card empty-state">No open deliveries right now.</div>
      ) : (
        openDeliveries.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div>
                <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                <div className="meta" style={{ marginTop: 4 }}>Pickup: {d.pickupAddress}</div>
                <div className="meta">Deliver to: {d.orphanageName}</div>
                <MapPreview latitude={d.latitude} longitude={d.longitude} label={d.pickupAddress} />
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
