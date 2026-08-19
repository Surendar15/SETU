import api from "./axiosInstance";

export const getImpactStats = () => api.get("/stats/impact");
