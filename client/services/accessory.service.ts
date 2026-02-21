import axios from '@/lib/axios';

export interface Accessory {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price?: string;
  salePrice?: string;
  affiliateUrl: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const accessoryService = {
  getAccessories: async () => {
    const response = await axios.get('/accessories');
    return response.data.data;
  },

  getAccessory: async (identifier: string | number) => {
    const response = await axios.get(`/accessories/${identifier}`);
    return response.data.data;
  },

  create: async (data: Partial<Accessory>) => {
    const response = await axios.post('/accessories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Accessory>) => {
    const response = await axios.put(`/accessories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/accessories/${id}`);
    return response.data;
  }
};
