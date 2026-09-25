import api from "../api/axios";

const patientPortalService = {
  // Dashboard
  getDashboardData: async (userId) => {
    const response = await api.get(`/patient-portal/dashboard/${userId}`);
    return response.data?.data ?? response.data;
  },

  // Profile
  getProfile: async (userId) => {
    const response = await api.get(`/patient-portal/profile/${userId}`);
    return response.data?.data ?? response.data;
  },

  updateProfile: async (userId, data) => {
    const response = await api.put(`/patient-portal/profile/${userId}`, data);
    return response.data?.data ?? response.data;
  },

  updatePassword: async (userId, data) => {
    const response = await api.put(`/patient-portal/password/${userId}`, data);
    return response.data;
  },

  // Blood Requests
  createBloodRequest: async (userId, data) => {
    const response = await api.post(`/patient-portal/blood-requests/${userId}`, data);
    return response.data?.data ?? response.data;
  },

  getMyBloodRequests: async (userId) => {
    const response = await api.get(`/patient-portal/blood-requests/${userId}`);
    return response.data?.data ?? response.data;
  },

  getBloodRequestById: async (userId, requestId) => {
    const response = await api.get(`/patient-portal/blood-requests/${userId}/${requestId}`);
    return response.data?.data ?? response.data;
  },

  cancelBloodRequest: async (userId, requestId) => {
    const response = await api.put(`/patient-portal/blood-requests/${userId}/${requestId}/cancel`);
    return response.data;
  },

  // Blood Banks
  getAllBloodBanks: async () => {
    const response = await api.get("/patient-portal/blood-banks");
    return response.data?.data ?? response.data;
  },

  getBloodBanksByCity: async (city) => {
    const response = await api.get(`/patient-portal/blood-banks/city/${city}`);
    return response.data?.data ?? response.data;
  },

  // Notifications
  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data?.data ?? response.data;
  },
};

export default patientPortalService;
