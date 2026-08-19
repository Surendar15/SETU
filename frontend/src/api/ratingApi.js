import api from "./axiosInstance";

export const submitRating = (deliveryId, rateeRole, stars, comment) =>
  api.post("/ratings", { deliveryId, rateeRole, stars, comment });

export const getRatingsForDelivery = (deliveryId) => api.get(`/ratings/delivery/${deliveryId}`);

export const getRatingsForUser = (userId) => api.get(`/ratings/user/${userId}`);

export const getRatingSummary = (userId) => api.get(`/ratings/user/${userId}/summary`);