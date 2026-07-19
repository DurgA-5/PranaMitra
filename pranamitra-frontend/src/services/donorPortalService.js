import api from "../api/axios";

const donorPortalService = {
  getDashboardData: async (userId) => {
    const response = await api.get(`/donor-portal/dashboard/${userId}`);
    return response.data?.data ?? response.data;
  },

  getProfile: async (userId) => {
    const response = await api.get(`/donor-portal/profile/${userId}`);
    return response.data?.data ?? response.data;
  },

  updateProfile: async (userId, data) => {
    const response = await api.put(`/donor-portal/profile/${userId}`, data);
    return response.data?.data ?? response.data;
  },

  updatePassword: async (userId, data) => {
    const response = await api.put(`/donor-portal/password/${userId}`, data);
    return response.data;
  },

  toggleAvailability: async (userId, available) => {
    const response = await api.put(`/donor-portal/availability/${userId}?available=${available}`);
    return response.data?.data ?? response.data;
  },

  getMatchingRequests: async (userId) => {
    const response = await api.get(`/donor-portal/matching-requests/${userId}`);
    return response.data?.data ?? response.data;
  },

  acceptRequest: async (requestId, userId) => {
    const response = await api.post(`/donor-portal/requests/${requestId}/accept/${userId}`);
    return response.data;
  },

  declineRequest: async (requestId, userId) => {
    const response = await api.post(`/donor-portal/requests/${requestId}/decline/${userId}`);
    return response.data;
  },

  getAcceptedRequests: async (userId) => {
    const response = await api.get(`/donor-portal/accepted-requests/${userId}`);
    return response.data?.data ?? response.data;
  },

  completeDonation: async (donationId, userId) => {
    const response = await api.put(`/donor-portal/donations/${donationId}/complete/${userId}`);
    return response.data;
  },

  cancelDonation: async (donationId, userId) => {
    const response = await api.put(`/donor-portal/donations/${donationId}/cancel/${userId}`);
    return response.data;
  },

  getDonationHistory: async (userId) => {
    const response = await api.get(`/donor-portal/donation-history/${userId}`);
    return response.data?.data ?? response.data;
  },

  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data?.data ?? response.data;
  },
};

export default donorPortalService;
