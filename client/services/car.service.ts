
import axios from '@/lib/axios';

export interface Car {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  category: string;
  thumbnail: string;
  description?: string;
  isActive: boolean;
  // colors?: CarColor[];
  createdAt?: string;
}

export const carService = {
  getAll: async (_isAdmin = false) => {
    // Admin uses the same endpoint but might get different data if backend handles it
    // Actually backend `getCars` checks `req.admin`. 
    // If we use `axios` (instance with interceptor), it will send token.
    const response = await axios.get('/cars');
    return response.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string | number) => {
    const response = await axios.get(`/cars/${idOrSlug}`);
    return response.data.data;
  },

  create: async (data: any) => {
    const response = await axios.post('/cars', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await axios.put(`/cars/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/cars/${id}`);
    return response.data;
  }
};
