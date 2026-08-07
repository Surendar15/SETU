import api from "./axiosInstance";

export const sendOtp = (email) => api.post("/auth/send-otp", { email });

export const verifyOtp = (email, otp) => api.post("/auth/verify-otp", { email, otp });
