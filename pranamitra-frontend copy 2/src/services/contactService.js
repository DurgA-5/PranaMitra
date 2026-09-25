import api from "../api/axios";

const contactService = {
  submitQuery: async (queryData) => {
    const response = await api.post("/contact", queryData);
    return response.data;
  },

  getAllQueries: async () => {
    const response = await api.get("/admin/contact");
    return response.data?.data ?? response.data;
  },

  getQueryById: async (id) => {
    const response = await api.get(`/admin/contact/${id}`);
    return response.data?.data ?? response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/admin/contact/${id}/status?status=${status}`);
    return response.data?.data ?? response.data;
  },

  deleteQuery: async (id) => {
    const response = await api.delete(`/admin/contact/${id}`);
    return response.data;
  }
};

export default contactService;
