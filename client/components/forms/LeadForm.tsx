'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message, ConfigProvider, theme } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserOutlined, PhoneFilled } from '@ant-design/icons';
import axios from '@/lib/axios';
import { carService } from '@/services/car.service';

const { Option } = Select;
const { TextArea } = Input;

export interface LeadFormData {
  fullName: string;
  phone: string;
  serviceType: 'LAI_THU' | 'BAO_GIA' | 'MUA_BAO_HIEM' | 'THUE_XE' | 'TRA_GOP' | 'THUE_PIN';
  carInterest?: string;
  notes?: string;
  email?: string;
}

interface LeadFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<LeadFormData>;
  formName?: string;
  variant?: 'default' | 'dark';
}

const LeadForm: React.FC<LeadFormProps> = ({ onSuccess, initialValues, formName = 'lead_form', variant = 'default' }) => {
  const [form] = Form.useForm();

  // Lấy danh sách xe động từ API
  const { data: cars = [] } = useQuery({
    queryKey: ['cars-public'],
    queryFn: () => carService.getAll({ view: 'public' }),
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        serviceType: 'BAO_GIA',
        ...initialValues
      });
    }
  }, [initialValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await axios.post('/leads', data);
      return response.data;
    },
    onSuccess: () => {
      message.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      form.resetFields();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    },
  });

  const onFinish = (values: LeadFormData) => {
    mutation.mutate(values);
  };

  const content = (
    <div className={`${variant === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-100 shadow-sm'} p-6 rounded-lg border`}>
      <h3 className={`text-xl font-bold mb-4 ${variant === 'dark' ? 'text-white' : 'text-blue-800'} uppercase text-center`}>Đăng ký lái thử / Báo giá</h3>
      <Form
        form={form}
        name={formName}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ serviceType: 'BAO_GIA', ...initialValues }}
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Họ và tên" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input prefix={<PhoneFilled className="-scale-x-100" />} placeholder="Số điện thoại" size="large" />
        </Form.Item>

        <Form.Item name="serviceType" label="Nhu cầu" rules={[{ required: true }]}>
          <Select size="large">
            <Option value="LAI_THU">Đăng ký lái thử</Option>
            <Option value="BAO_GIA">Nhận báo giá</Option>
            <Option value="TRA_GOP">Tư vấn trả góp</Option>
            <Option value="THUE_PIN">Thuê pin</Option>
            <Option value="MUA_BAO_HIEM">Mua bảo hiểm</Option>
            <Option value="THUE_XE">Thuê xe</Option>
          </Select>
        </Form.Item>

        <Form.Item name="carInterest" label="Dòng xe quan tâm">
          <Select size="large" placeholder="Chọn dòng xe" allowClear>
            {cars.map((car: any) => (
              <Option key={car.id} value={car.name}>{car.name}</Option>
            ))}
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item name="notes">
          <TextArea placeholder="Ghi chú thêm..." rows={3} />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={mutation.isPending}
            className={`h-12 font-bold text-lg ${variant === 'dark' ? 'bg-[#1890ff] hover:bg-[#40a9ff]' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            GỬI YÊU CẦU
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  if (variant === 'dark') {
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
            colorBgContainer: '#262626',
            colorBorder: '#434343',
            colorTextPlaceholder: 'rgba(255, 255, 255, 0.45)',
          },
        }}
      >
        {content}
      </ConfigProvider>
    );
  }

  return content;
};

export default LeadForm;
