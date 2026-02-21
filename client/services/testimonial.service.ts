import axios from '@/lib/axios';

export interface Testimonial {
  id: number;
  customerName: string;
  avatar?: string;
  deliveryImage?: string;
  content: string;
  carModel?: string;
  rating: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const testimonialService = {
  // Admin: get all testimonials
  getAll: async (): Promise<Testimonial[]> => {
    const response = await axios.get('/testimonials');
    return response.data.data;
  },

  // Public: only active testimonials
  getPublic: async (): Promise<Testimonial[]> => {
    const response = await axios.get('/testimonials/public');
    return response.data.data;
  },

  create: async (data: Partial<Testimonial>) => {
    const response = await axios.post('/testimonials', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Testimonial>) => {
    const response = await axios.put(`/testimonials/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/testimonials/${id}`);
    return response.data;
  },
};
