import axios from '@/lib/axios';

export interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt?: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const postService = {
  getAll: async (options?: { view?: 'public' | 'admin' }): Promise<Post[]> => {
    const params = options?.view ? { view: options.view } : {};
    const response = await axios.get('/posts', { params });
    return response.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string | number): Promise<Post> => {
    const response = await axios.get(`/posts/${idOrSlug}`);
    return response.data.data;
  },

  create: async (data: any) => {
    const response = await axios.post('/posts', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await axios.put(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/posts/${id}`);
    return response.data;
  },
};
