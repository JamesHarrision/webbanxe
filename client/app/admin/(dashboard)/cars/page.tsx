'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Image as AntImage } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { carService, Car } from '@/services/car.service';
import Link from 'next/link';

const CarManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAll(true);
      setCars(data);
    } catch (error) {
      message.error('Không thể tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await carService.delete(id);
      message.success('Xóa xe thành công');
      fetchCars();
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
      render: (src: string) => <AntImage src={src || '/placeholder.svg'} width={80} />,
    },
    {
      title: 'Tên xe',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => (
        <Tag color={cat === 'car' ? 'blue' : 'green'}>
          {cat === 'car' ? 'Ô tô' : 'Xe máy'}
        </Tag>
      ),
    },
    {
      title: 'Giá niêm yết',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
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
      render: (_: any, record: Car) => (
        <Space size="middle">
          <Link href={`/admin/cars/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
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
        <h1 className="text-2xl font-bold">Quản lý Xe</h1>
        <Link href="/admin/cars/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm xe mới
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={cars}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CarManagement;
