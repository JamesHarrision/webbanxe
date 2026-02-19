'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, Button, Upload, App, Space, Image as AntImage, Spin } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { carService, Car } from '@/services/car.service';
import { uploadService } from '@/services/upload.service';
import Image from 'next/image';

const { Option } = Select;
const { TextArea } = Input;

interface CarFormProps {
  initialValues?: Partial<Car>;
  isEdit?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ initialValues, isEdit = false }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialValues?.thumbnail || '');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setThumbnailUrl(initialValues.thumbnail || '');
    }
  }, [initialValues, form]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        thumbnail: thumbnailUrl,
      };

      if (isEdit && initialValues?.id) {
        await carService.update(initialValues.id, payload);
        message.success('Cập nhật xe thành công');
      } else {
        await carService.create(payload);
        message.success('Thêm xe thành công');
      }
      router.push('/admin/cars');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleUpload = async (info: any) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      // Antd upload default behavior
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const customUploadRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      // Assuming response is the URL string or { url: ... }
      const url = response.url || response;
      setThumbnailUrl(url);
      onSuccess("Ok");
      message.success('Upload ảnh thành công');
    } catch (err) {
      onError({ err });
      message.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{isEdit ? 'Cập nhật xe' : 'Thêm xe mới'}</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true, category: 'car' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: 'Vui lòng nhập tên xe' }]}
          >
            <Input placeholder="VinFast VF 8" onChange={(e) => {
              if (!isEdit) {
                const slug = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                form.setFieldsValue({ slug });
              }
            }} />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="vinfast-vf-8" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá niêm yết"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'}
              parser={value => value?.replace(/\$\s?|(,*)|(\s?VND)/g, '') as unknown as number}
            />
          </Form.Item>

          <Form.Item
            name="salePrice"
            label="Giá khuyến mãi (nếu có)"
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'}
              parser={value => value?.replace(/\$\s?|(,*)|(\s?VND)/g, '') as unknown as number}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="car">Ô tô điện</Option>
              <Option value="scooter">Xe máy điện</Option>
              <Option value="accessory">Phụ kiện</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </div>

        <Form.Item label="Hình ảnh đại diện (Thumbnail)">
          <div className="flex flex-col gap-4">
            {uploading ? (
              <div className="w-40 h-40 border rounded flex justify-center items-center bg-gray-50">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              </div>
            ) : thumbnailUrl ? (
              <div className="relative w-40 h-40 border rounded overflow-hidden">
                <AntImage
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            ) : null}
            <Upload
              customRequest={customUploadRequest}
              showUploadList={false}
              accept="image/*"
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? 'Đang tải lên...' : 'Chọn ảnh'}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={6} placeholder="Mô tả chi tiết về xe..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CarForm;
