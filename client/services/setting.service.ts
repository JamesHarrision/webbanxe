import axios from '@/lib/axios';

export const settingService = {
  getAll: async (): Promise<Record<string, string>> => {
    const response = await axios.get('/settings');
    return response.data.data;
  },

  update: async (settings: { key: string; value: string }[]) => {
    const response = await axios.put('/settings', { settings });
    return response.data;
  },
};
