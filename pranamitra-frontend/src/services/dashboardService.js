import api from "../api/axios";

const dashboardService = {

  async getDashboardStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  }

};

export default dashboardService;