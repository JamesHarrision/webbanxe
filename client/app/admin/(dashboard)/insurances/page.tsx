'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, App, Popconfirm, Tag, Image as AntImage } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { insuranceService, Insurance } from '@/services/insurance.service';
import Link from 'next/link';

const InsuranceManagement = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const data = await insuranceService.getInsurances();
      setInsurances(data);
    } catch (error) {
      message.error('Không thể tải danh sách gói bảo hiểm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await insuranceService.delete(id);
      message.success('Xóa gói bảo hiểm thành công');
      fetchInsurances();
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
      title: 'Tên gói bảo hiểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá tham khảo',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => <span className="font-semibold text-blue-600">{price || 'Liên hệ'}</span>
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
      render: (_: any, record: Insurance) => (
        <Space size="middle">
          <Link href={`/admin/insurances/edit/${record.id}`}>
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
        <h1 className="text-2xl font-bold">Quản lý Gói Bảo hiểm</h1>
        <Link href="/admin/insurances/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm gói mới
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={insurances}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default InsuranceManagement;
