import api from "../api/axios";

const authService = {

  login: async (email, password) => {

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/auth/stats");
    return response.data;
  },

  getBloodBanks: async () => {
    const response = await api.get("/auth/blood-banks");
    return response.data;
  },

  getBloodBanksByCity: async (city) => {
    const response = await api.get(`/auth/blood-banks/city/${city}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

};

export default authService;
