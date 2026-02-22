'use client';

import React, { useEffect, useState } from 'react';
import { Table, Select, Popconfirm, Button, Tag, App, Space } from 'antd';
import { DeleteOutlined, PhoneFilled, MailOutlined } from '@ant-design/icons';
import { leadService, Lead } from '@/services/lead.service';

const statusOptions = [
  { value: 'NEW', label: 'Mới', color: 'blue' },
  { value: 'CONTACTED', label: 'Đang tư vấn', color: 'processing' },
  { value: 'CLOSED', label: 'Đã chốt', color: 'success' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'default' },
];

const serviceTypeMap: Record<string, string> = {
  LAI_THU: 'Lái thử',
  BAO_GIA: 'Báo giá',
  MUA_BAO_HIEM: 'Mua bảo hiểm',
  THUE_XE: 'Thuê xe',
  TRA_GOP: 'Tư vấn trả góp',
  THUE_PIN: 'Thuê pin',
};

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getAll();
      setLeads(data);
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await leadService.updateStatus(id, status);
      message.success('Cập nhật trạng thái thành công');
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await leadService.delete(id);
      message.success('Xóa khách hàng thành công');
      fetchLeads();
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
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_: any, record: Lead) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <PhoneFilled className="text-green-500 -scale-x-100" />
            <a href={`tel:${record.phone}`} className="text-blue-600 hover:underline">{record.phone}</a>
          </div>
          {record.email && (
            <div className="flex items-center gap-1 text-sm">
              <MailOutlined className="text-blue-500" />
              <span className="text-gray-500">{record.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Nhu cầu',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (type: string) => (
        <Tag color="geekblue">{serviceTypeMap[type] || type}</Tag>
      ),
    },
    {
      title: 'Xe quan tâm',
      dataIndex: 'carInterest',
      key: 'carInterest',
      render: (car: string) => car || <span className="text-gray-400">—</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Lead) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 150 }}
          options={statusOptions.map(s => ({
            value: s.value,
            label: <Tag color={s.color}>{s.label}</Tag>,
          }))}
        />
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: any, record: Lead) => (
        <Space>
          <Popconfirm
            title="Xóa khách hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Khách hàng (Leads)</h1>
        <span className="text-gray-500">{leads.length} khách hàng</span>
      </div>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 15 }}
        scroll={{ x: 900 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 p-2">
              {record.location && <div><strong>Địa điểm:</strong> {record.location}</div>}
              {record.preferredDate && <div><strong>Ngày hẹn:</strong> {new Date(record.preferredDate).toLocaleDateString('vi-VN')}</div>}
              {record.notes && <div className="col-span-2"><strong>Ghi chú:</strong> {record.notes}</div>}
              {record.utmSource && <div><strong>UTM Source:</strong> {record.utmSource}</div>}
              {record.utmCampaign && <div><strong>UTM Campaign:</strong> {record.utmCampaign}</div>}
            </div>
          ),
          rowExpandable: (record) => !!(record.location || record.preferredDate || record.notes || record.utmSource),
        }}
      />
    </div>
  );
};

export default LeadManagement;
