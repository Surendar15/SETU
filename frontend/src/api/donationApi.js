import api from "./axiosInstance";

export const createDonation = (payload) => api.post("/donations", payload);

export const getMyDonations = () => api.get("/donations/my");

export const cancelDonation = (donationId) => api.patch(`/donations/${donationId}/cancel`);

export const getRequestsForDonation = (donationId) =>
  api.get(`/requests/donation/${donationId}`);

export const acceptRequest = (requestId) => api.patch(`/requests/${requestId}/accept`);

export const rejectRequest = (requestId) => api.patch(`/requests/${requestId}/reject`);
