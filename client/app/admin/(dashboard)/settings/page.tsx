'use client';

import React, { useEffect, useState } from 'react';
import {
  Form, Input, InputNumber, Button, App, Spin, Tabs, Divider, Switch,
} from 'antd';
import {
  SaveOutlined, MailOutlined, LockOutlined, CloudServerOutlined,
  UserOutlined, GlobalOutlined, PhoneFilled, BranchesOutlined, PlusOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { settingService } from '@/services/setting.service';

const { TextArea } = Input;

const SettingsPage = () => {
  const [generalForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [smtpForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingService.getAll();
        generalForm.setFieldsValue({
          WEBSITE_NAME: data.WEBSITE_NAME || '',
          FOUNDER_NAME: data.FOUNDER_NAME || '',
          ROLE: data.ROLE || '',
          ABOUT_TEXT: data.ABOUT_TEXT || '',
          DISCLAIMER: data.DISCLAIMER || '',
        });
        contactForm.setFieldsValue({
          HOTLINE: data.HOTLINE || '',
          CONTACT_EMAIL: data.CONTACT_EMAIL || '',
          ADDRESS: data.ADDRESS || '',
          ZALO_URL: data.ZALO_URL || '',
          FACEBOOK_URL: data.FACEBOOK_URL || '',
          TIKTOK_URL: data.TIKTOK_URL || '',
          YOUTUBE_URL: data.YOUTUBE_URL || '',
          BRANCHES: data.BRANCHES ? JSON.parse(data.BRANCHES) : [''],
        });
        smtpForm.setFieldsValue({
          SMTP_HOST: data.SMTP_HOST || 'smtp.gmail.com',
          SMTP_PORT: data.SMTP_PORT ? Number(data.SMTP_PORT) : 587,
          SMTP_USER: data.SMTP_USER || '',
          SMTP_PASS: data.SMTP_PASS || '',
          ADMIN_EMAIL: data.ADMIN_EMAIL || '',
        });
      } catch {
        message.error('Không thể tải cài đặt');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [generalForm, contactForm, smtpForm, message]);

  const handleSave = async (values: Record<string, any>, extraTransform?: (v: Record<string, any>) => Record<string, any>) => {
    setSaving(true);
    try {
      const transformed = extraTransform ? extraTransform(values) : values;
      const settings = Object.entries(transformed).map(([key, value]) => ({
        key,
        value: value === null || value === undefined ? '' : String(value),
      }));
      await settingService.update(settings);
      message.success('Lưu cài đặt thành công!');
    } catch {
      message.error('Lưu cài đặt thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-20"><Spin size="large" /></div>;

  const tabItems = [
    {
      key: 'general',
      label: <span className="flex items-center gap-1"><UserOutlined /> Thông tin chung</span>,
      children: (
        <Form form={generalForm} layout="vertical" onFinish={(v) => handleSave(v)} className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="WEBSITE_NAME" label="Tên website">
              <Input prefix={<GlobalOutlined className="text-gray-400" />} placeholder="VinFast Tiền Giang" />
            </Form.Item>
            <Form.Item name="FOUNDER_NAME" label="Họ và tên">
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Thành Phương" />
            </Form.Item>
          </div>
          <Form.Item name="ROLE" label="Chức danh / Vai trò">
            <Input placeholder="Nhân viên Tư vấn Bán hàng" />
          </Form.Item>
          <Form.Item name="ABOUT_TEXT" label="Giới thiệu bản thân (About)">
            <TextArea rows={4} placeholder="Giới thiệu về nhân viên tư vấn, kinh nghiệm, cam kết..." />
          </Form.Item>
          <Form.Item name="DISCLAIMER" label="Disclaimer / Ghi chú pháp lý">
            <TextArea rows={3} placeholder="Giá xe có thể thay đổi theo thời điểm. Vui lòng liên hệ để được báo giá chính xác." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
              Lưu thông tin chung
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'contact',
      label: <span className="flex items-center gap-1"><PhoneFilled className="-scale-x-100" /> Liên hệ & Chi nhánh</span>,
      children: (
        <Form
          form={contactForm}
          layout="vertical"
          onFinish={(v) => handleSave(v, (vals) => ({
            ...vals,
            // Serialize branches array to JSON string
            BRANCHES: JSON.stringify((vals.BRANCHES as string[]).filter(Boolean)),
          }))}
          className="max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="HOTLINE" label="Số hotline">
              <Input prefix={<PhoneFilled className="text-gray-400 -scale-x-100" />} placeholder="0909 123 456" />
            </Form.Item>
            <Form.Item name="CONTACT_EMAIL" label="Email liên hệ">
              <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="contact@vinfasttg.vn" />
            </Form.Item>
          </div>
          <Form.Item name="ADDRESS" label="Địa chỉ chính">
            <Input placeholder="123 Đường ABC, Phường XYZ, TP. Mỹ Tho, Tiền Giang" />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="ZALO_URL" label="Link Zalo OA">
              <Input placeholder="https://zalo.me/..." />
            </Form.Item>
            <Form.Item name="FACEBOOK_URL" label="Link Facebook Page">
              <Input placeholder="https://facebook.com/..." />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="TIKTOK_URL" label="Link TikTok">
              <Input placeholder="https://tiktok.com/@..." />
            </Form.Item>
            <Form.Item name="YOUTUBE_URL" label="Link YouTube">
              <Input placeholder="https://youtube.com/@..." />
            </Form.Item>
          </div>

          <Divider titlePlacement="left">
            <span className="flex items-center gap-1 text-sm"><BranchesOutlined /> Danh sách chi nhánh</span>
          </Divider>

          <Form.List name="BRANCHES">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-3 mb-4">
                {fields.map((field, index) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <Form.Item name={field.name} className="flex-1 mb-0">
                      <Input placeholder={`Địa chỉ chi nhánh ${index + 1}`} />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add('')}
                  icon={<PlusOutlined />}
                  className="w-full md:w-auto"
                >
                  Thêm chi nhánh
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
              Lưu thông tin liên hệ
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'smtp',
      label: <span className="flex items-center gap-1"><CloudServerOutlined /> Cấu hình Gửi Mail</span>,
      children: (
        <Form form={smtpForm} layout="vertical" onFinish={(v) => handleSave(v)} className="max-w-2xl">
          <p className="text-gray-500 text-sm mb-6">
            Cấu hình tài khoản email dùng để gửi thông báo khi có khách hàng mới.
            Nếu dùng Gmail, hãy tạo <strong>App Password</strong> trong cài đặt tài khoản Google.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item name="SMTP_HOST" label="SMTP Host" rules={[{ required: true }]}>
              <Input placeholder="smtp.gmail.com" />
            </Form.Item>
            <Form.Item name="SMTP_PORT" label="SMTP Port" rules={[{ required: true }]}>
              <InputNumber placeholder="587" style={{ width: '100%' }} min={1} max={65535} />
            </Form.Item>
          </div>
          <Form.Item name="SMTP_USER" label="Email gửi (SMTP User)" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="your-email@gmail.com" />
          </Form.Item>
          <Form.Item name="SMTP_PASS" label="Mật khẩu ứng dụng (App Password)">
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="xxxx xxxx xxxx xxxx" />
          </Form.Item>
          <Divider plain><span className="text-sm text-gray-400">Email nhận thông báo</span></Divider>
          <Form.Item name="ADMIN_EMAIL" label="Email nhận thông báo Lead mới" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="admin@company.com" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
              Lưu cấu hình SMTP
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Tabs defaultActiveKey="general" items={tabItems} size="large" />
      </div>
    </div>
  );
};

export default SettingsPage;
