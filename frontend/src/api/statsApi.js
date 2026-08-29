import api from "./axiosInstance";

export const getImpactStats = () => api.get("/stats/impact");
export const getAnalyticsStats = () => api.get("/stats/analytics");
export const getLeaderboardStats = () => api.get("/stats/leaderboard");
