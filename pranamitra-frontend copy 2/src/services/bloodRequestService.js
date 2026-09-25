import api from "../api/axios";

const bloodRequestService = {
  async getAllRequests() {
    const response = await api.get("/admin/blood-requests");
    return response.data;
  },

  async getRequest(id) {
    const response = await api.get(`/admin/blood-requests/${id}`);
    return response.data;
  },

  async createRequest(requestData) {
    const response = await api.post("/blood-requests", requestData);
    return response.data;
  },

  async updateRequest(id, requestData) {
    const response = await api.put(`/blood-requests/${id}`, requestData);
    return response.data;
  },

  async deleteRequest(id) {
    const response = await api.delete(`/blood-requests/${id}`);
    return response.data;
  },

  async approveRequest(id) {
    const response = await api.put(`/admin/blood-requests/${id}/approve`);
    return response.data;
  },

  async rejectRequest(id) {
    const response = await api.put(`/admin/blood-requests/${id}/reject`);
    return response.data;
  },

  async completeRequest(id) {
    const response = await api.put(`/admin/blood-requests/${id}/complete`);
    return response.data;
  },

  async cancelRequest(id) {
    const response = await api.put(`/admin/blood-requests/${id}/cancel`);
    return response.data;
  },
};

export default bloodRequestService;
