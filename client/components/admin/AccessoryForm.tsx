'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, Button, Upload, App, Image as AntImage, Spin } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { accessoryService, Accessory } from '@/services/accessory.service';
import { uploadService } from '@/services/upload.service';
import RichTextEditor from './RichTextEditor';

interface AccessoryFormProps {
  initialValues?: Partial<Accessory>;
  isEdit?: boolean;
}

const AccessoryForm: React.FC<AccessoryFormProps> = ({ initialValues, isEdit = false }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialValues?.thumbnail || '');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ ...initialValues });
      setThumbnailUrl(initialValues.thumbnail || '');
    }
  }, [initialValues, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        thumbnail: thumbnailUrl,
      };

      if (isEdit && initialValues?.id) {
        await accessoryService.update(initialValues.id, payload);
        message.success('Cập nhật phụ kiện thành công');
      } else {
        await accessoryService.create(payload);
        message.success('Thêm phụ kiện thành công');
      }
      router.push('/admin/accessories');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const customUploadRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
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
        <h2 className="text-xl font-bold">{isEdit ? 'Cập nhật phụ kiện' : 'Thêm phụ kiện mới'}</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="name"
            label="Tên phụ kiện"
            rules={[{ required: true, message: 'Vui lòng nhập tên phụ kiện' }]}
          >
            <Input placeholder="VD: Thảm lót sàn VF 5" onChange={(e) => {
              if (!isEdit) {
                const slug = e.target.value.toLowerCase()
                  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                  .replace(/[đĐ]/g, 'd')
                  .replace(/ /g, '-')
                  .replace(/[^\w-]+/g, '');
                form.setFieldsValue({ slug });
              }
            }} />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="tham-lot-san-vf-5" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá niêm yết (Hiển thị văn bản)"
          >
            <Input placeholder="VD: 1.200.000đ" />
          </Form.Item>

          <Form.Item
            name="salePrice"
            label="Giá khuyến mãi"
          >
            <Input placeholder="VD: 990.000đ" />
          </Form.Item>

          <Form.Item
            name="affiliateUrl"
            label="Link Shopee (Affiliate)"
            rules={[{ required: true, message: 'Vui lòng nhập link Shopee' }]}
            className="md:col-span-2"
          >
            <Input placeholder="https://shope.ee/..." />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </div>

        <Form.Item label="Hình ảnh đại diện (Thumbnail)" required>
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
            {!thumbnailUrl && !uploading && <div className="text-red-500 text-sm">Vui lòng tải lên ảnh đại diện</div>}
          </div>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <RichTextEditor placeholder="Mô tả chi tiết sản phẩm, chất lượng, cách lắp đặt..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large" disabled={!thumbnailUrl}>
            {isEdit ? 'Cập nhật' : 'Lưu phụ kiện'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccessoryForm;
