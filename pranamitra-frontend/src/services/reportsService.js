import api from "../api/axios";

const reportsService = {
  async getBloodGroups() {
    const response = await api.get("/admin/reports/blood-groups");
    return response.data;
  },

  async getRequestStatus() {
    const response = await api.get("/admin/reports/request-status");
    return response.data;
  },

  async getEmergencyLevel() {
    const response = await api.get("/admin/reports/emergency-level");
    return response.data;
  },

  async getCities() {
    const response = await api.get("/admin/reports/cities");
    return response.data;
  },

  async getActiveBloodBanks() {
    const response = await api.get("/admin/reports/active-blood-banks");
    return response.data;
  },

  async getTwentyFourHourBloodBanks() {
    const response = await api.get("/admin/reports/twenty-four-hours");
    return response.data;
  },
};

export default reportsService;
