import axios from '@/lib/axios';

export interface HeroSlide {
  id: number;
  imageUrl: string;
  title?: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const heroSlideService = {
  // Admin: get all slides
  getAll: async (): Promise<HeroSlide[]> => {
    const response = await axios.get('/hero-slides');
    return response.data.data;
  },

  // Public: only active slides sorted by order
  getPublic: async (): Promise<HeroSlide[]> => {
    const response = await axios.get('/hero-slides/public');
    return response.data.data;
  },

  create: async (data: Partial<HeroSlide>) => {
    const response = await axios.post('/hero-slides', data);
    return response.data;
  },

  update: async (id: number, data: Partial<HeroSlide>) => {
    const response = await axios.put(`/hero-slides/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/hero-slides/${id}`);
    return response.data;
  },
};
