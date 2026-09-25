import api from "../api/axios";

const notificationService = {
  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data.data; // List of Notification objects
  },

  getUnreadCount: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    return response.data.data; // Long count value
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (userId) => {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
