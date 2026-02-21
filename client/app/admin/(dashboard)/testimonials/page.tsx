'use client';

import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Popconfirm, Tag, Image as AntImage, Modal, Form,
  Input, Switch, Upload, App, Spin, Rate, Avatar, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, LoadingOutlined,
  UserOutlined, CameraOutlined,
} from '@ant-design/icons';
import { testimonialService, Testimonial } from '@/services/testimonial.service';
import { uploadService } from '@/services/upload.service';

const { TextArea } = Input;

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingDelivery, setUploadingDelivery] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch {
      message.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openCreate = () => {
    setEditingItem(null);
    setAvatarUrl('');
    setDeliveryUrl('');
    form.resetFields();
    form.setFieldsValue({ isActive: true, rating: 5 });
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setAvatarUrl(item.avatar || '');
    setDeliveryUrl(item.deliveryImage || '');
    form.setFieldsValue({
      customerName: item.customerName,
      carModel: item.carModel,
      content: item.content,
      rating: item.rating,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await testimonialService.delete(id);
      message.success('Xóa đánh giá thành công');
      fetchTestimonials();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createUploadHandler = (
    setUrl: (url: string) => void,
    setUploading: (v: boolean) => void,
    label: string,
  ) => async (options: any) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      setUrl(response.url || response);
      onSuccess('Ok');
      message.success(`Upload ${label} thành công`);
    } catch (err) {
      onError({ err });
      message.error(`Upload ${label} thất bại`);
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        avatar: avatarUrl || undefined,
        deliveryImage: deliveryUrl || undefined,
      };
      if (editingItem) {
        await testimonialService.update(editingItem.id, payload);
        message.success('Cập nhật đánh giá thành công');
      } else {
        await testimonialService.create(payload);
        message.success('Thêm đánh giá thành công');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, r: Testimonial) => (
        <div className="flex items-center gap-3">
          <Avatar src={r.avatar} icon={<UserOutlined />} size={40} />
          <div>
            <div className="font-medium">{r.customerName}</div>
            {r.carModel && <div className="text-xs text-gray-400">{r.carModel}</div>}
          </div>
        </div>
      ),
    },
    {
      title: 'Ảnh bàn giao',
      dataIndex: 'deliveryImage',
      key: 'deliveryImage',
      render: (src: string) => src
        ? <AntImage src={src} width={80} height={60} className="object-cover rounded" />
        : <span className="text-gray-300 text-xs italic">Chưa có</span>,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: number) => <Rate disabled value={r} />,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (c: string) => (
        <Tooltip title={c}>
          <span className="text-sm">{c.length > 60 ? c.slice(0, 60) + '…' : c}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Hiển thị' : 'Ẩn'}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Testimonial) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Xóa đánh giá này?"
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
        <h1 className="text-2xl font-bold">Quản lý Đánh giá khách hàng</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm đánh giá mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={testimonials}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item name="carModel" label="Dòng xe đã mua">
              <Input placeholder="VD: VinFast VF 8" />
            </Form.Item>
          </div>

          <Form.Item name="rating" label="Số sao đánh giá">
            <Rate />
          </Form.Item>

          <Form.Item name="content" label="Nội dung đánh giá" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TextArea rows={3} placeholder="Chia sẻ cảm nhận của khách hàng..." />
          </Form.Item>

          {/* Avatar Upload */}
          <Form.Item label="Ảnh đại diện khách hàng (tuỳ chọn)">
            <div className="flex items-center gap-4">
              {uploadingAvatar ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : avatarUrl ? (
                <Avatar src={avatarUrl} size={56} />
              ) : (
                <Avatar icon={<UserOutlined />} size={56} />
              )}
              <Upload
                customRequest={createUploadHandler(setAvatarUrl, setUploadingAvatar, 'avatar')}
                showUploadList={false}
                accept="image/*"
                disabled={uploadingAvatar}
              >
                <Button icon={<UploadOutlined />} size="small" loading={uploadingAvatar}>
                  {uploadingAvatar ? 'Đang tải...' : 'Chọn ảnh đại diện'}
                </Button>
              </Upload>
            </div>
          </Form.Item>

          {/* Delivery Photo Upload — The trust-builder */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <label className="block text-sm font-semibold mb-1 text-amber-800">
              <CameraOutlined className="mr-1" />
              Ảnh bàn giao xe thực tế <span className="text-amber-600">(Tăng uy tín, khuyến nghị có)</span>
            </label>
            <p className="text-xs text-amber-600 mb-3">
              Ảnh chụp thực tế lúc nhận xe sẽ giúp tăng độ tin tưởng cho khách hàng tiềm năng.
            </p>
            <div className="flex flex-col gap-3">
              {uploadingDelivery ? (
                <div className="w-full h-32 border rounded flex justify-center items-center bg-white">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
              ) : deliveryUrl ? (
                <AntImage src={deliveryUrl} alt="Delivery" className="rounded max-h-40 object-cover" />
              ) : (
                <div className="w-full h-32 border border-dashed border-amber-300 rounded flex justify-center items-center bg-white text-amber-400">
                  Chưa có ảnh bàn giao
                </div>
              )}
              <Upload
                customRequest={createUploadHandler(setDeliveryUrl, setUploadingDelivery, 'ảnh bàn giao')}
                showUploadList={false}
                accept="image/*"
                disabled={uploadingDelivery}
              >
                <Button icon={<CameraOutlined />} loading={uploadingDelivery}>
                  {uploadingDelivery ? 'Đang tải...' : 'Upload ảnh bàn giao xe'}
                </Button>
              </Upload>
            </div>
          </div>

          <Form.Item name="isActive" label="Hiển thị trên trang chủ" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingItem ? 'Lưu thay đổi' : 'Thêm đánh giá'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TestimonialManagement;
