import api from "./axiosInstance";

export const getMyProfile = () => api.get("/users/me");

export const updateMyProfile = (payload) => api.patch("/users/me", payload);
