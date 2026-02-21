import axios from '@/lib/axios';

export interface Lead {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  serviceType: string;
  carInterest?: string;
  preferredDate?: string;
  location?: string;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const leadService = {
  getAll: async (filters?: { status?: string; serviceType?: string }): Promise<Lead[]> => {
    const response = await axios.get('/leads', { params: filters });
    return response.data.data;
  },

  getById: async (id: number): Promise<Lead> => {
    const response = await axios.get(`/leads/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: number, status: string, notes?: string) => {
    const response = await axios.patch(`/leads/${id}/status`, { status, notes });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/leads/${id}`);
    return response.data;
  },

  submit: async (data: Partial<Lead>) => {
    const response = await axios.post('/leads', data);
    return response.data;
  },
};
