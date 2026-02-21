'use client';

import React from 'react';
import { Layout, Form, Input, Button, App, Space } from 'antd';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  PhoneFilled,
  MailOutlined,
  GlobalOutlined,
  FacebookFilled,
  YoutubeFilled,
  EnvironmentFilled,
  ClockCircleFilled,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { settingService, PublicSettings } from '@/services/setting.service';
import { carService } from '@/services/car.service';
import { leadService } from '@/services/lead.service';
import logo from '@/app/logo.png';

const { Footer } = Layout;

// Custom TikTok icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" className="inline-block align-middle">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const PublicFooter: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch settings
  const { data: settings } = useQuery<PublicSettings>({
    queryKey: ['publicSettings'],
    queryFn: () => settingService.getPublicSettings(),
  });

  // Fetch cars for product list
  const { data: cars = [] } = useQuery({
    queryKey: ['publicCars'],
    queryFn: () => carService.getAll({ view: 'public' }),
  });

  const branches: string[] = settings?.BRANCHES ? JSON.parse(settings.BRANCHES) : [];

  const handleFinish = async (values: { fullName: string; phone: string }) => {
    setSubmitting(true);
    try {
      await leadService.submit({
        ...values,
        serviceType: 'BAO_GIA',
        notes: 'Đăng ký nhận báo giá từ footer',
      });
      message.success('Đăng ký nhận báo giá thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
      form.resetFields();
    } catch {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Footer
      className="py-12 px-6 md:px-12 mt-auto"
      style={{ backgroundColor: '#1a1a1a', color: '#fff', borderTop: 'none' }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Info */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <NextImage
                src={logo}
                alt="VinFast Logo"
                className="h-16 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>

            <div className="space-y-4 text-gray-400 text-sm">
              <h3 className="text-white font-bold text-base uppercase tracking-wider mb-2">
                {settings?.WEBSITE_NAME || 'VINFAST TIỀN GIANG'}
              </h3>

              <div className="flex items-start gap-3">
                <PhoneFilled className="text-[#1890ff] mt-1 -scale-x-100" />
                <span>Hotline: {settings?.HOTLINE}</span>
              </div>

              <div className="flex items-start gap-3">
                <MailOutlined className="text-[#1890ff] mt-1" />
                <span>Email: {settings?.CONTACT_EMAIL}</span>
              </div>

              <div className="flex items-start gap-3">
                <GlobalOutlined className="text-[#1890ff] mt-1" />
                <span>Website: {typeof window !== 'undefined' ? window.location.hostname : 'vinfasttiengiang.net.vn'}</span>
              </div>

              <div className="flex items-start gap-3">
                <EnvironmentFilled className="text-[#1890ff] mt-1" />
                <div>
                  <div className="font-semibold text-gray-300">Trụ sở chính:</div>
                  <div className="text-gray-400">{settings?.ADDRESS}</div>
                </div>
              </div>

              {settings?.ABOUT_TEXT && (
                <p className="text-gray-400 italic leading-relaxed">
                  "{settings.ABOUT_TEXT}"
                </p>
              )}

              {settings?.FOUNDER_NAME && (
                <div className="pt-2">
                  <p className="text-white font-semibold mb-0">{settings.FOUNDER_NAME}</p>
                  <p className="text-[#1890ff] text-xs font-medium uppercase tracking-wider">{settings.ROLE || 'Đại diện kinh doanh'}</p>
                </div>
              )}

              {branches.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="font-semibold text-gray-300 flex items-center gap-2">
                    <EnvironmentFilled className="text-[#1890ff] text-xs" />
                    <span>Các chi nhánh khác:</span>
                  </div>
                  {branches.map((branch, idx) => (
                    <div key={idx} className="flex items-start gap-3 pl-6">
                      <span className="text-[#1890ff] text-xs mt-1">•</span>
                      <div className="text-gray-400 text-xs">
                        {branch}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-white font-bold text-base border-b border-gray-700 pb-2 mb-4 inline-block">Giờ mở cửa</h3>
                <div className="flex items-center gap-3">
                  <ClockCircleFilled className="text-[#1890ff]" />
                  <span className="text-gray-400">{settings?.OPENING_HOURS || 'Từ 08:00 đến 17:00 (Hoạt động cả tuần)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Sản phẩm
              <span className="absolute bottom-[-8px] left-0 w-12 h-0.5 bg-[#1890ff]"></span>
            </h3>
            <ul className="space-y-3 m-0 p-0 list-none">
              {cars.map((car) => (
                <li key={car.id}>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="text-gray-400 hover:text-[#1890ff] transition-colors"
                  >
                    {car.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Registration & Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Đăng ký nhận báo giá
              <span className="absolute bottom-[-8px] left-0 w-12 h-0.5 bg-[#1890ff]"></span>
            </h3>

            <Form form={form} onFinish={handleFinish} className="mb-8">
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input
                  placeholder="Họ và tên"
                  style={{ backgroundColor: '#2a2a2a', border: 'none', color: '#fff', height: '44px' }}
                  className="placeholder:text-gray-500"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9+]{10,12}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input
                  placeholder="Số điện thoại"
                  style={{ backgroundColor: '#2a2a2a', border: 'none', color: '#fff', height: '44px' }}
                  className="placeholder:text-gray-500"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="w-full h-14 bg-[#0c4da2] hover:bg-[#0e5cbf] border-none text-lg font-bold rounded-full uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(12,77,162,0.3)] flex items-center justify-center"
                >
                  ĐĂNG KÝ
                </Button>
              </Form.Item>
            </Form>

            <h3 className="text-white font-semibold text-base mb-4">Liên kết mạng xã hội</h3>
            <div className="flex gap-4">
              {settings?.FACEBOOK_URL && (
                <a href={settings.FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3b5998] flex items-center justify-center rounded-full text-white text-xl transition-transform hover:scale-110">
                  <FacebookFilled />
                </a>
              )}
              {settings?.TIKTOK_URL && (
                <a href={settings.TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black border border-gray-800 flex items-center justify-center rounded-full text-white text-lg transition-transform hover:scale-110">
                  <TikTokIcon />
                </a>
              )}
              {settings?.YOUTUBE_URL && (
                <a href={settings.YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#ff0000] flex items-center justify-center rounded-full text-white text-xl transition-transform hover:scale-110">
                  <YoutubeFilled />
                </a>
              )}
            </div>

            <p className="mt-8 text-xs text-gray-500 leading-relaxed italic">
              {settings?.DISCLAIMER || 'vinfasttiengiang.net.vn là website của đội ngũ tư vấn, không phải website chính thức của VinFast Auto.'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.WEBSITE_NAME || 'VinFast Tiền Giang'}. All Rights Reserved.</p>
        </div>
      </div>
    </Footer>
  );
};

export default PublicFooter;
