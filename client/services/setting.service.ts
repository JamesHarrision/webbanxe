import axios from '@/lib/axios';

export interface PublicSettings {
  HOTLINE?: string;
  CONTACT_EMAIL?: string;
  ADDRESS?: string;
  ZALO_URL?: string;
  FACEBOOK_URL?: string;
  WEBSITE_NAME?: string;
  FOUNDER_NAME?: string;
  ROLE?: string;
  ABOUT_TEXT?: string;
  DISCLAIMER?: string;
  BRANCHES?: string; // JSON string array
}

export const settingService = {
  // Admin-only: requires auth cookie
  getAll: async (): Promise<Record<string, string>> => {
    const response = await axios.get('/settings');
    return response.data.data;
  },

  update: async (settings: { key: string; value: string }[]) => {
    const response = await axios.put('/settings', { settings });
    return response.data;
  },

  // Public: safe endpoint - no auth, no SMTP fields
  getPublicSettings: async (): Promise<PublicSettings> => {
    const response = await axios.get('/settings/public');
    return response.data.data;
  },
};
