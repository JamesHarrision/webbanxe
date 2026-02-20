'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Image as AntImage, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { postService, Post } from '@/services/post.service';
import Link from 'next/link';

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getAll({ view: 'admin' });
      setPosts(data);
    } catch (error) {
      message.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await postService.delete(id);
      message.success('Xóa bài viết thành công');
      fetchPosts();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const categoryMap: Record<string, { label: string; color: string }> = {
    news: { label: 'Tin tức', color: 'blue' },
    promotion: { label: 'Khuyến mãi', color: 'red' },
    review: { label: 'Đánh giá xe', color: 'purple' },
    guide: { label: 'Hướng dẫn', color: 'cyan' },
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (src: string) => <AntImage src={src || '/placeholder.svg'} width={80} />,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => {
        const info = categoryMap[cat] || { label: cat, color: 'default' };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (published: boolean) => (
        <Tag color={published ? 'success' : 'warning'}>
          {published ? 'Đã xuất bản' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Post) => (
        <Space size="middle">
          <Link href={`/admin/posts/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            description="Tất cả ảnh liên quan sẽ bị xóa khỏi Cloudinary."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tin tức / Bài viết</h1>
        <Link href="/admin/posts/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm bài viết
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PostManagement;
