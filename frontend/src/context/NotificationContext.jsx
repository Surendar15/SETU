import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

// Web Audio API synthesizer for notification chime
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch (e) {
    // ignore autoplay policy blocks
  }
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("setu_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [stompClient, setStompClient] = useState(null); // exposed for chat to reuse
  const clientRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("setu_notifications", JSON.stringify(notifications.slice(0, 30)));
    } catch (e) {
      // ignore quota
    }
  }, [notifications]);

  useEffect(() => {
    if (!user) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setStompClient(null);
      }
      return;
    }

    const token = localStorage.getItem("token");

    const handleIncoming = (message) => {
      const body = JSON.parse(message.body);
      const newNotif = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...body,
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 30));
      setUnreadCount((prev) => prev + 1);
      setRefreshSignal((prev) => prev + 1);

      if (soundEnabled) {
        playNotificationChime();
      }
    };

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/notifications", handleIncoming);

        if (user.role === "VOLUNTEER") {
          client.subscribe("/topic/open-deliveries", handleIncoming);
        }
        if (user.role === "ORPHANAGE") {
          client.subscribe("/topic/new-donations", handleIncoming);
        }

        setStompClient(client); // only expose once actually connected
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setStompClient(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, soundEnabled]);

  const markAllRead = () => setUnreadCount(0);
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("setu_notifications");
  };
  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        clearNotifications,
        soundEnabled,
        toggleSound,
        refreshSignal,
        stompClient,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
