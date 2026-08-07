import api from "./axiosInstance";

// Orphanage side
export const getAvailableDonations = () => api.get("/donations");
export const createRequest = (donationId) => api.post("/requests", { donationId });
export const getMyRequests = () => api.get("/requests/my");
export const getIncomingDeliveries = () => api.get("/deliveries/incoming");

// Volunteer side
export const getOpenDeliveries = () => api.get("/deliveries/open");
export const getMyDeliveries = () => api.get("/deliveries/my");
export const acceptDelivery = (deliveryId) => api.patch(`/deliveries/${deliveryId}/accept`);
export const updateDeliveryStatus = (deliveryId, status) =>
  api.patch(`/deliveries/${deliveryId}/status`, { status });
