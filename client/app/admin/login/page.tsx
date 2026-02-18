'use client';

import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from '@/lib/axios';

const AdminLogin = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axios.post('/admin/login', values);
      // const { token, user } = response.data;

      // Mock Login
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (values.username === 'admin' && values.password === 'admin') {
        login('mock-jwt-token', { id: '1', email: 'admin@vinfast.vn', role: 'admin' });
        message.success('Đăng nhập thành công!');
        router.push('/admin/dashboard');
      } else {
        throw new Error('Sai tài khoản hoặc mật khẩu');
      }

    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Quản trị viên Đăng nhập" className="w-96 shadow-lg">
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
