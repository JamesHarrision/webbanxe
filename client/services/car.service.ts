
import axiosContext from '@/lib/axios';

export const carService = {
  getAll: async () => {
    // Public endpoint, no need for admin axios instance usually, but let's use the base one if exists or just fetch
    // If the public endpoint /cars doesn't require auth, we can use a standard axios instance or fetch.
    // Assuming backend is at NEXT_PUBLIC_API_URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, { cache: 'no-store' });
    if (!response.ok) {
      // Return empty array or throw, but for homepage let's return mock if fail or handle gracefully
      return [];
    }
    return response.json();
  },

  getFeatured: async () => {
    // Mock for now if endpoint doesn't support filtering
    const cars = await carService.getAll();
    return cars.slice(0, 8);
  }
};
