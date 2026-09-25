import api from "../api/axios";

const studentDonorService = {
  async getAllDonors() {
    const response = await api.get("/admin/donors");
    return response.data;
  },

  async getDonor(id) {
    const response = await api.get(`/admin/donors/${id}`);
    return response.data;
  },

  async createDonor(donorData) {
    const response = await api.post("/admin/donors", donorData);
    return response.data;
  },

  async updateDonor(id, donorData) {
    const response = await api.put(`/donors/${id}`, donorData);
    return response.data;
  },

  async deleteDonor(id) {
    const response = await api.delete(`/admin/donors/${id}`);
    return response.data;
  },

  async verifyDonor(id) {
    const response = await api.put(`/admin/donors/${id}/verify`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.put(`/admin/donors/${id}/activate`);
    return response.data;
  },

  async getAvailableUsers() {
    const response = await api.get("/admin/available-users");
    return response.data;
  },
};

export default studentDonorService;
