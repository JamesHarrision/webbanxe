'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from '@/lib/axios';

const { Option } = Select;
const { TextArea } = Input;

export interface LeadFormData {
  fullName: string;
  phone: string;
  type: 'TEST_DRIVE' | 'QUOTE' | 'CONSULTATION';
  carModel?: string;
  notes?: string;
  email?: string; // Optional email if needed
}

interface LeadFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<LeadFormData>;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSuccess, initialValues }) => {
  const [form] = Form.useForm();

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        type: 'QUOTE',
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-blue-800 uppercase text-center">Đăng ký lái thử / Báo giá</h3>
      <Form
        form={form}
        name="lead_form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ type: 'QUOTE', ...initialValues }}
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
            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
        </Form.Item>

        <Form.Item name="type" label="Nhu cầu" rules={[{ required: true }]}>
          <Select size="large">
            <Option value="TEST_DRIVE">Đăng ký lái thử</Option>
            <Option value="QUOTE">Nhận báo giá</Option>
            <Option value="CONSULTATION">Tư vấn chung</Option>
          </Select>
        </Form.Item>

        <Form.Item name="carModel" label="Dòng xe quan tâm">
          <Select size="large" placeholder="Chọn dòng xe" allowClear>
            <Option value="VF3">VinFast VF 3</Option>
            <Option value="VF5">VinFast VF 5 Plus</Option>
            <Option value="VF6">VinFast VF 6</Option>
            <Option value="VFe34">VinFast VF e34</Option>
            <Option value="VF7">VinFast VF 7</Option>
            <Option value="VF8">VinFast VF 8</Option>
            <Option value="VF9">VinFast VF 9</Option>
            <Option value="FelixS">Feliz S</Option>
            <Option value="KlaraS">Klara S (2022)</Option>
            <Option value="VentoS">Vento S</Option>
            <Option value="TheonS">Theon S</Option>
            <Option value="Evo200">Evo200</Option>
          </Select>
        </Form.Item>

        <Form.Item name="notes">
          <TextArea placeholder="Ghi chú thêm..." rows={3} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 h-12 font-bold text-lg"
          >
            GỬI YÊU CẦU
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LeadForm;
