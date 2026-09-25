import api from './api';

export const trainService = {
  async getAllTrains() {
    const response = await api.get('/trains');
    return response.data;
  },

  async searchTrains(from = '', to = '', date = '') {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);

    const response = await api.get(`/trains/search?${params.toString()}`);
    return response.data;
  },

  async getTrainById(id) {
    const response = await api.get(`/trains/${id}`);
    return response.data;
  },

  async getAllStations() {
    const response = await api.get('/trains/stations');
    return response.data;
  },

  async createTrain(trainData) {
    const response = await api.post('/trains', trainData);
    return response.data;
  },

  async updateTrain(id, trainData) {
    const response = await api.put(`/trains/${id}`, trainData);
    return response.data;
  },

  async deleteTrain(id) {
    const response = await api.delete(`/trains/${id}`);
    return response.data;
  },

  async updateTrainStatus(id, statusData) {
    const response = await api.put(`/trains/${id}/status`, statusData);
    return response.data;
  },
};
