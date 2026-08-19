import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [stompClient, setStompClient] = useState(null); // exposed for chat to reuse
  const clientRef = useRef(null);

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
      setNotifications((prev) => [{ id: Date.now() + Math.random(), ...body }, ...prev].slice(0, 20));
      setUnreadCount((prev) => prev + 1);
      setRefreshSignal((prev) => prev + 1);
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
  }, [user?.userId]);

  const markAllRead = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, refreshSignal, stompClient }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
