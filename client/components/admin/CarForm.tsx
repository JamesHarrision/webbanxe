'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, Button, Upload, App, Image as AntImage, Spin, Divider, Card } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { carService, Car } from '@/services/car.service';
import { uploadService } from '@/services/upload.service';
import RichTextEditor from './RichTextEditor';

const { Option } = Select;
const { TextArea } = Input;

// ── Custom color hex picker compatible with Ant Design Form.Item ──
const ColorHexPicker: React.FC<{ value?: string; onChange?: (val: string) => void }> = ({ value = '#000000', onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-10 h-10 rounded cursor-pointer border border-gray-300 p-0.5"
    />
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="#FF0000"
      className="flex-1"
    />
  </div>
);

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

  // ── Gallery images state (Car Image Gallery) ──
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialValues?.images || []);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ── Color variant state ──
  // Tracks uploaded image URLs per Form.List row key
  const [colorImageUrls, setColorImageUrls] = useState<Record<number, string>>({});
  // Tracks upload-in-progress per row key
  const [colorUploading, setColorUploading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialValues) {
      // Pre-populate color variants when editing
      const colorsData = initialValues.colors?.map((c) => ({
        colorName: c.colorName,
        colorHex: c.colorHex,
      })) || [];

      form.setFieldsValue({
        ...initialValues,
        price: initialValues.price ? Number(initialValues.price) : undefined,
        salePrice: initialValues.salePrice ? Number(initialValues.salePrice) : undefined,
        colors: colorsData,
      });
      setThumbnailUrl(initialValues.thumbnail || '');
      // Pre-populate gallery images
      setGalleryUrls(Array.isArray(initialValues.images) ? initialValues.images : []);

      // Pre-populate image URLs from existing color variants
      if (initialValues.colors) {
        const urls: Record<number, string> = {};
        initialValues.colors.forEach((c, index) => {
          if (c.imageUrl) urls[index] = c.imageUrl;
        });
        setColorImageUrls(urls);
      }
    }
  }, [initialValues, form]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        thumbnail: thumbnailUrl,
        images: galleryUrls,
        price: Number(values.price),
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        // Map colors from form values + uploaded image URLs
        colors: (values.colors || []).map((color: any, index: number) => ({
          colorName: color.colorName,
          colorHex: color.colorHex,
          imageUrl: colorImageUrls[index] || '',
        })),
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

  // ── Gallery: upload one or multiple images ──
  const galleryUploadRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setGalleryUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      const url = response.url || response;
      setGalleryUrls((prev) => [...prev, url]);
      onSuccess('Ok');
      message.success('Upload ảnh gallery thành công');
    } catch (err) {
      onError({ err });
      message.error('Upload ảnh gallery thất bại');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  };

  // ── Per-color-row upload handler ──
  const createColorUploadRequest = (fieldKey: number) => async (options: any) => {
    const { onSuccess, onError, file } = options;
    setColorUploading((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const response = await uploadService.uploadImage(file);
      const url = response.url || response;
      setColorImageUrls((prev) => ({ ...prev, [fieldKey]: url }));
      onSuccess("Ok");
      message.success(`Upload ảnh màu thành công`);
    } catch (err) {
      onError({ err });
      message.error('Upload ảnh màu thất bại');
    } finally {
      setColorUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  // When a color row is removed, shift image URLs to keep indices in sync
  const handleRemoveColor = (removeFn: (index: number) => void, fieldName: number, fields: any[]) => {
    removeFn(fieldName);

    // Rebuild colorImageUrls with shifted indices
    setColorImageUrls((prev) => {
      const newUrls: Record<number, string> = {};
      const sortedKeys = Object.keys(prev).map(Number).sort((a, b) => a - b);

      let newIndex = 0;
      for (const key of sortedKeys) {
        if (key === fieldName) continue; // skip the removed row
        newUrls[newIndex] = prev[key];
        newIndex++;
      }
      return newUrls;
    });

    // Also clean up uploading state
    setColorUploading((prev) => {
      const newState: Record<number, boolean> = {};
      const sortedKeys = Object.keys(prev).map(Number).sort((a, b) => a - b);

      let newIndex = 0;
      for (const key of sortedKeys) {
        if (key === fieldName) continue;
        newState[newIndex] = prev[key];
        newIndex++;
      }
      return newState;
    });
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
              min={0}
              controls={false}
              suffix="₫"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => (Number(value?.split('.').join('') || 0)) as any}
            />
          </Form.Item>

          <Form.Item
            name="salePrice"
            label="Giá khuyến mãi (nếu có)"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              controls={false}
              addonAfter="₫"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => (Number(value?.split('.').join('') || 0)) as any}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="car">Dòng xe cá nhân</Option>
              <Option value="scooter">Dòng xe VinFast Green</Option>
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

        {/* ══════════════════════════════════════════════════════ */}
        {/* ═══ Car Image Gallery Section ═══                    */}
        {/* ══════════════════════════════════════════════════════ */}
        <Divider titlePlacement="left" style={{ borderColor: '#d1d5db' }}>
          <span className="text-base font-semibold text-gray-700">🖼️ Gallery ảnh xe</span>
        </Divider>

        <Form.Item label="Bộ ảnh xe (nhiều ảnh)">
          <div className="flex flex-col gap-4">
            {/* Preview grid */}
            {galleryUrls.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {galleryUrls.map((url) => (
                  <div key={url} className="relative w-32 h-24 border rounded overflow-hidden group">
                    <AntImage src={url} alt="gallery" width={128} height={96} className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Upload
              customRequest={galleryUploadRequest}
              showUploadList={false}
              accept="image/*"
              multiple
              disabled={galleryUploading}
            >
              <Button icon={galleryUploading ? <LoadingOutlined /> : <PlusOutlined />} loading={galleryUploading}>
                {galleryUploading ? 'Đang tải lên...' : 'Thêm ảnh vào gallery'}
              </Button>
            </Upload>
            {galleryUrls.length > 0 && (
              <p className="text-xs text-gray-400">Di chuột vào ảnh và nhấn ✕ để xóa khỏi gallery</p>
            )}
          </div>
        </Form.Item>

        {/* ══════════════════════════════════════════════════════ */}
        <Divider titlePlacement="left" style={{ borderColor: '#d1d5db' }}>
          <span className="text-base font-semibold text-gray-700">🎨 Biến thể màu sắc</span>
        </Divider>

        <Form.List name="colors">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <Card
                  key={field.key}
                  size="small"
                  className="border-gray-200 bg-gray-50/50"
                  styles={{ body: { padding: '16px' } }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Color Name */}
                    <div className="md:col-span-4">
                      <Form.Item
                        name={[field.name, 'colorName']}
                        label="Tên màu"
                        rules={[{ required: true, message: 'Nhập tên màu' }]}
                        className="mb-0"
                      >
                        <Input placeholder="VD: Đỏ Mystique" />
                      </Form.Item>
                    </div>

                    {/* Color Hex Picker */}
                    <div className="md:col-span-3">
                      <Form.Item
                        name={[field.name, 'colorHex']}
                        label="Mã màu"
                        rules={[{ required: true, message: 'Chọn mã màu' }]}
                        className="mb-0"
                      >
                        <ColorHexPicker />
                      </Form.Item>
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-4">
                      <div className="mb-0">
                        <label className="block text-sm mb-1.5 font-medium">Ảnh màu xe</label>
                        <div className="flex items-center gap-3">
                          {colorUploading[field.name] ? (
                            <div className="w-16 h-16 border rounded flex justify-center items-center bg-white">
                              <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                            </div>
                          ) : colorImageUrls[field.name] ? (
                            <div className="w-16 h-16 border rounded overflow-hidden flex-shrink-0">
                              <AntImage
                                src={colorImageUrls[field.name]}
                                alt="Color"
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 border rounded border-dashed flex justify-center items-center bg-white text-gray-300">
                              <UploadOutlined style={{ fontSize: 20 }} />
                            </div>
                          )}
                          <Upload
                            customRequest={createColorUploadRequest(field.name)}
                            showUploadList={false}
                            accept="image/*"
                            disabled={colorUploading[field.name]}
                          >
                            <Button
                              size="small"
                              icon={<UploadOutlined />}
                              loading={colorUploading[field.name]}
                            >
                              {colorUploading[field.name] ? 'Đang tải...' : 'Chọn ảnh'}
                            </Button>
                          </Upload>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex items-end justify-end md:justify-center pb-1">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveColor(remove, field.name, fields)}
                        title="Xóa biến thể"
                        className="mt-6"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ colorName: '', colorHex: '#000000' })}
                icon={<PlusOutlined />}
                className="w-full md:w-auto"
              >
                Thêm biến thể màu
              </Button>
            </div>
          )}
        </Form.List>

        <Divider style={{ borderColor: '#d1d5db' }} />

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <RichTextEditor placeholder="Mô tả chi tiết về xe..." />
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
