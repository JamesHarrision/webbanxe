'use client';

import React from 'react';
import PostForm from '@/components/admin/PostForm';

const CreatePostPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thêm Bài Viết Mới</h1>
      <PostForm />
    </div>
  );
};

export default CreatePostPage;
