'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Card, App, Spin, Divider } from 'antd';
import { SaveOutlined, MailOutlined, LockOutlined, CloudServerOutlined } from '@ant-design/icons';
import { settingService } from '@/services/setting.service';

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingService.getAll();
        form.setFieldsValue({
          SMTP_HOST: data.SMTP_HOST || 'smtp.gmail.com',
          SMTP_PORT: data.SMTP_PORT ? Number(data.SMTP_PORT) : 587,
          SMTP_USER: data.SMTP_USER || '',
          SMTP_PASS: data.SMTP_PASS || '',
          ADMIN_EMAIL: data.ADMIN_EMAIL || '',
        });
      } catch (error) {
        message.error('Không thể tải cài đặt');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form, message]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      await settingService.update(settings);
      message.success('Lưu cài đặt thành công!');
    } catch (error) {
      message.error('Lưu cài đặt thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-12"><Spin size="large" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>

      <Card
        title={
          <div className="flex items-center gap-2">
            <CloudServerOutlined className="text-blue-500" />
            <span>Cấu hình Email (SMTP)</span>
          </div>
        }
        variant="borderless"
        className="shadow-sm max-w-2xl"
      >
        <p className="text-gray-500 text-sm mb-6">
          Cấu hình tài khoản email dùng để gửi thông báo khi có khách hàng mới đăng ký.
          Nếu bạn dùng Gmail, hãy tạo <strong>App Password</strong> trong cài đặt tài khoản Google.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Divider plain>
            <span className="text-sm text-gray-400">Thông tin máy chủ</span>
          </Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="SMTP_HOST"
              label="SMTP Host"
              rules={[{ required: true, message: 'Vui lòng nhập SMTP Host' }]}
            >
              <Input placeholder="smtp.gmail.com" />
            </Form.Item>

            <Form.Item
              name="SMTP_PORT"
              label="SMTP Port"
              rules={[{ required: true, message: 'Vui lòng nhập Port' }]}
            >
              <InputNumber placeholder="587" style={{ width: '100%' }} min={1} max={65535} />
            </Form.Item>
          </div>

          <Divider plain>
            <span className="text-sm text-gray-400">Tài khoản đăng nhập</span>
          </Divider>

          <Form.Item
            name="SMTP_USER"
            label="Email gửi (SMTP User)"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="your-email@gmail.com" />
          </Form.Item>

          <Form.Item
            name="SMTP_PASS"
            label="Mật khẩu ứng dụng (App Password)"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="xxxx xxxx xxxx xxxx" />
          </Form.Item>

          <Divider plain>
            <span className="text-sm text-gray-400">Email nhận thông báo</span>
          </Divider>

          <Form.Item
            name="ADMIN_EMAIL"
            label="Email nhận thông báo Lead mới"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="admin@company.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
