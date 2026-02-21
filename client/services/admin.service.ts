import axios from '@/lib/axios';

export interface DashboardStats {
  totalCars: number;
  totalPosts: number;
  totalLeads: number;
  newLeads: number;
}

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/admin/stats');
    return response.data.data;
  },
};
