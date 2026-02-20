'use client';

import React, { useEffect, useState } from 'react';
import PostForm from '@/components/admin/PostForm';
import { postService, Post } from '@/services/post.service';
import { message, Spin } from 'antd';
import { useParams } from 'next/navigation';

const EditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await postService.getByIdOrSlug(Number(id));
          setPost(data);
        } catch (error) {
          message.error('Không tìm thấy bài viết');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  if (loading) return <div className="text-center p-12"><Spin size="large" /></div>;
  if (!post) return <div>Không tìm thấy bài viết</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa: {post.title}</h1>
      <PostForm initialValues={post} isEdit={true} />
    </div>
  );
};

export default EditPostPage;
