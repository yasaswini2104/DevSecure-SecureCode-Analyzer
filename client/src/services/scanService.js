import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 45_000,
});

export const scanCode = async (code, language) => {
  const response = await apiClient.post('/scan', { code, language });
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const exportResultsAsJson = (results) => {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `securecode-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
