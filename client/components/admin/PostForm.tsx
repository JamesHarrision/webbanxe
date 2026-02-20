'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, Button, Upload, App, Image as AntImage, Spin } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { postService, Post } from '@/services/post.service';
import { uploadService } from '@/services/upload.service';
import RichTextEditor from './RichTextEditor';

const { Option } = Select;

interface PostFormProps {
  initialValues?: Partial<Post>;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialValues, isEdit = false }) => {
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        thumbnail: thumbnailUrl,
      };

      if (isEdit && initialValues?.id) {
        await postService.update(initialValues.id, payload);
        message.success('Cập nhật bài viết thành công');
      } else {
        await postService.create(payload);
        message.success('Thêm bài viết thành công');
      }
      router.push('/admin/posts');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
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
        <h2 className="text-xl font-bold">{isEdit ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isPublished: true, category: 'news' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Tiêu đề bài viết" onChange={(e) => {
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
            <Input placeholder="tieu-de-bai-viet" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="news">Tin tức</Option>
              <Option value="promotion">Khuyến mãi</Option>
              <Option value="review">Đánh giá xe</Option>
              <Option value="guide">Hướng dẫn</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isPublished"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Xuất bản" unCheckedChildren="Nháp" />
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
          name="excerpt"
          label="Mô tả ngắn (SEO)"
        >
          <Input.TextArea rows={3} placeholder="Tóm tắt nội dung bài viết..." />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung bài viết"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <RichTextEditor placeholder="Viết nội dung bài viết tại đây..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            {isEdit ? 'Cập nhật' : 'Đăng bài'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PostForm;
