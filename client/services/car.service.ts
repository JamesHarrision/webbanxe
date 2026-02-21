
import axios from '@/lib/axios';

export interface CarColor {
  id: number;
  colorName: string;
  colorHex: string;
  imageUrl: string;
}

export interface Car {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  salePrice?: number | string;
  category: string;
  thumbnail: string;
  images?: string[]; // Gallery image URLs
  description?: string;
  isActive: boolean;
  colors?: CarColor[];
  createdAt?: string;
  updatedAt?: string;
}

export const carService = {
  getAll: async (options?: { view?: 'public' | 'admin' }): Promise<Car[]> => {
    const params = options?.view ? { view: options.view } : {};
    const response = await axios.get('/cars', { params });
    return response.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string | number): Promise<Car> => {
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
