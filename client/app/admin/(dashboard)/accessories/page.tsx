'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, App, Popconfirm, Tag, Image as AntImage } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { accessoryService, Accessory } from '@/services/accessory.service';
import Link from 'next/link';

const AccessoryManagement = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      const data = await accessoryService.getAccessories();
      setAccessories(data);
    } catch (error) {
      message.error('Không thể tải danh sách phụ kiện');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await accessoryService.delete(id);
      message.success('Xóa phụ kiện thành công');
      fetchAccessories();
    } catch (error) {
      message.error('Xóa thất bại');
    }
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
      render: (src: string) => <AntImage src={src || '/placeholder.svg'} width={60} height={60} className="object-cover rounded" />,
    },
    {
      title: 'Tên phụ kiện',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      key: 'price',
      render: (_: any, record: Accessory) => (
        <div>
          {record.salePrice ? (
            <>
              <div className="text-red-500 font-bold">{record.salePrice}</div>
              <div className="text-gray-400 line-through text-xs">{record.price}</div>
            </>
          ) : (
            <div className="font-bold">{record.price || 'Liên hệ'}</div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'warning'}>
          {active ? 'Hiển thị' : 'Đã ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Accessory) => (
        <Space size="middle">
          <Link href={`/admin/accessories/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <a href={record.affiliateUrl} target="_blank" rel="noopener noreferrer">
            <Button icon={<ShoppingOutlined />} title="Xem trên Shopee" />
          </a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
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
        <h1 className="text-2xl font-bold">Quản lý Phụ kiện (Shopee)</h1>
        <Link href="/admin/accessories/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm phụ kiện mới
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={accessories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AccessoryManagement;
