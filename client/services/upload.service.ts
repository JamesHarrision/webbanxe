import axios from '@/lib/axios';

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Backend returns { success: true, url: ..., ... }
  },

  // Upload ảnh từ TinyMCE editor — trả về URL để TinyMCE render inline
  uploadTinymceImage: async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob);

    const response = await axios.post('/upload/tinymce', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.location; // TinyMCE expects a URL string
  },
};
