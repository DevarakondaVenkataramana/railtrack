import api from './api';

export const journeyService = {
  async startJourney(data) {
    const response = await api.post('/journeys', data);
    return response.data;
  },

  async getMyJourneys() {
    const response = await api.get('/journeys/my');
    return response.data;
  },

  async getJourneyById(id) {
    const response = await api.get(`/journeys/${id}`);
    return response.data;
  },

  async updateJourney(id, data) {
    const response = await api.put(`/journeys/${id}`, data);
    return response.data;
  },

  async deleteJourney(id) {
    const response = await api.delete(`/journeys/${id}`);
    return response.data;
  },
};
