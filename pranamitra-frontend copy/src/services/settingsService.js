import api from "../api/axios";

const settingsService = {
  async getUserProfile(id) {
    const response = await api.get(`/users/${id}`);
    return response.data; // Response contains ApiResponse { success, message, data }
  },

  async updateUserProfile(id, payload) {
    const response = await api.put(`/users/${id}`, payload);
    return response.data; // Response contains ApiResponse { success, message, data }
  },
};

export default settingsService;
