import api from "./axiosInstance";

export const sendChatMessage = (deliveryId, content) =>
  api.post("/chat/send", { deliveryId, content });

export const getChatHistory = (deliveryId) => api.get(`/chat/delivery/${deliveryId}`);
