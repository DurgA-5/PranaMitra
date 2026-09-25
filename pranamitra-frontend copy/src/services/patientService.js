import api from "../api/axios";

const patientService = {
  async getAllPatients() {
    const response = await api.get("/admin/patients");
    return response.data;
  },

  async getPatient(id) {
    const response = await api.get(`/admin/patients/${id}`);
    return response.data;
  },

  async createPatient(patientData) {
    const response = await api.post("/patients", patientData);
    return response.data;
  },

  async updatePatient(id, patientData) {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  async deletePatient(id) {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  },
};

export default patientService;
