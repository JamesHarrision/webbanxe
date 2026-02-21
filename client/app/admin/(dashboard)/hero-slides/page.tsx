'use client';

import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Popconfirm, Tag, Image as AntImage, Modal, Form,
  Input, InputNumber, Switch, Upload, App, Spin, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, LoadingOutlined,
} from '@ant-design/icons';
import { heroSlideService, HeroSlide } from '@/services/heroSlide.service';
import { uploadService } from '@/services/upload.service';

const HeroSlideManagement = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await heroSlideService.getAll();
      setSlides(data);
    } catch {
      message.error('Không thể tải danh sách slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const openCreate = () => {
    setEditingSlide(null);
    setImageUrl('');
    form.resetFields();
    form.setFieldsValue({ isActive: true, order: 0 });
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setImageUrl(slide.imageUrl);
    form.setFieldsValue({
      title: slide.title,
      link: slide.link,
      order: slide.order,
      isActive: slide.isActive,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await heroSlideService.delete(id);
      message.success('Xóa slide thành công');
      fetchSlides();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const customUploadRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      const url = response.url || response;
      setImageUrl(url);
      onSuccess('Ok');
      message.success('Upload ảnh thành công');
    } catch (err) {
      onError({ err });
      message.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!imageUrl) {
      message.warning('Vui lòng upload ảnh cho slide');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...values, imageUrl };
      if (editingSlide) {
        await heroSlideService.update(editingSlide.id, payload);
        message.success('Cập nhật slide thành công');
      } else {
        await heroSlideService.create(payload);
        message.success('Tạo slide thành công');
      }
      setModalOpen(false);
      fetchSlides();
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (src: string) => (
        <AntImage src={src || '/placeholder.svg'} width={120} height={67} className="object-cover rounded" />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (t: string) => t || <span className="text-gray-400 italic">Không có tiêu đề</span>,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (l: string) => l
        ? <a href={l} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">{l}</a>
        : <span className="text-gray-400 italic">—</span>,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a: HeroSlide, b: HeroSlide) => a.order - b.order,
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
      render: (_: any, record: HeroSlide) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa slide này?"
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
        <h1 className="text-2xl font-bold">Quản lý Hero Slider</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm slide mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={slides}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSlide ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          {/* Image Upload */}
          <Form.Item label="Hình ảnh Slide" required>
            <div className="flex flex-col gap-3">
              {uploading ? (
                <div className="w-full h-40 border rounded flex justify-center items-center bg-gray-50">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
              ) : imageUrl ? (
                <div className="w-full h-40 border rounded overflow-hidden">
                  <AntImage src={imageUrl} alt="Slide" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-full h-40 border border-dashed rounded flex justify-center items-center bg-gray-50 text-gray-400">
                  Chưa có ảnh
                </div>
              )}
              <Upload customRequest={customUploadRequest} showUploadList={false} accept="image/*" disabled={uploading}>
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploading ? 'Đang tải lên...' : 'Chọn ảnh'}
                </Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="title" label="Tiêu đề (tuỳ chọn)">
            <Input placeholder="VD: Xe VinFast VF 8 - Khám phá ngay" />
          </Form.Item>

          <Form.Item name="link" label="Đường dẫn khi click (tuỳ chọn)">
            <Input placeholder="https://... hoặc /cars/vinfast-vf-8" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="order" label="Thứ tự hiển thị">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
            <Form.Item name="isActive" label="Hiển thị" valuePropName="checked">
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingSlide ? 'Lưu thay đổi' : 'Tạo slide'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HeroSlideManagement;
