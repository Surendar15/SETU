import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { getMyRequests } from "../../api/deliveryApi";

export default function MyRequests() {
  const { refreshSignal } = useNotifications() || {};
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyRequests()
      .then((res) => setMyRequests(res.data))
      .catch(() => setError("Failed to load requests."))
      .finally(() => setLoading(false));
  }, [refreshSignal]);

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : myRequests.length === 0 ? (
        <div className="card empty-state">You haven't requested any donations yet.</div>
      ) : (
        myRequests.map((r) => (
          <div key={r.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{r.donationDescription || "Donation #" + r.donationId}</span>
              <span className={`status status-${r.status.toLowerCase()}`}>
                <span className="status-dot" />
                {r.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
