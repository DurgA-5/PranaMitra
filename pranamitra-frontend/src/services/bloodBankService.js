import api from "../api/axios";

const bloodBankService = {
  async getAllBloodBanks() {
    const response = await api.get("/blood-banks");
    return response.data;
  },

  async getBloodBank(id) {
    const response = await api.get(`/blood-banks/${id}`);
    return response.data;
  },

  async createBloodBank(payload) {
    const response = await api.post("/blood-banks", payload);
    return response.data;
  },

  async updateBloodBank(id, payload) {
    const response = await api.put(`/blood-banks/${id}`, payload);
    return response.data;
  },

  async deleteBloodBank(id) {
    const response = await api.delete(`/blood-banks/${id}`);
    return response.data;
  },
};

export default bloodBankService;
