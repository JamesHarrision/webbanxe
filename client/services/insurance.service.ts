import axios from '@/lib/axios';

export interface Insurance {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  shortSummary?: string;
  description?: string;
  price?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const insuranceService = {
  getInsurances: async () => {
    const response = await axios.get('/insurances');
    return response.data.data;
  },

  getInsurance: async (identifier: string | number) => {
    const response = await axios.get(`/insurances/${identifier}`);
    return response.data.data;
  },

  create: async (data: Partial<Insurance>) => {
    const response = await axios.post('/insurances', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Insurance>) => {
    const response = await axios.put(`/insurances/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/insurances/${id}`);
    return response.data;
  }
};
