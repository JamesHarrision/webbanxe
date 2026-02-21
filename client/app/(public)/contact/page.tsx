'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserOutlined } from '@ant-design/icons';
import { settingService } from '@/services/setting.service';
import LeadForm from '@/components/forms/LeadForm';

// SVG Icons
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ZaloIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 48 48" fill="currentColor">
    <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2.5 28.5H15v-2l5.5-7H15v-2h6.5v2l-5.5 7h5.5v2zm5.5 0h-2.5V17.5H27V32.5zm8.5 0h-7v-15h2.5v12.5H35.5V32.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function ContactPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: () => settingService.getPublicSettings(),
    staleTime: 10 * 60 * 1000,
  });

  // Parse branches safely
  const branches: string[] = React.useMemo(() => {
    if (!settings?.BRANCHES) return [];
    try {
      return JSON.parse(settings.BRANCHES);
    } catch (e) {
      console.error('Error parsing branches:', e);
      return [];
    }
  }, [settings?.BRANCHES]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0f4c81] via-[#1a6ab5] to-[#0f4c81] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Liên hệ với chúng tôi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {isLoading ? '...' : (settings?.WEBSITE_NAME || 'VinFast Tiền Giang')}
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            {settings?.ROLE || 'Đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn 24/7'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Column 1: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-2">Thông Tin Liên Hệ</h2>
              <div className="w-12 h-1 bg-orange-500 mb-6" />

              {/* Founder / About Intro */}
              {(settings?.FOUNDER_NAME || settings?.ABOUT_TEXT) && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0f4c81]">
                      <UserOutlined className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{settings?.FOUNDER_NAME || 'Chuyên viên tư vấn'}</h3>
                      <p className="text-xs text-orange-500 font-medium uppercase tracking-wider">{settings?.ROLE || 'Tư vấn bán hàng'}</p>
                    </div>
                  </div>
                  {settings?.ABOUT_TEXT && (
                    <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-blue-100 pl-4 py-1">
                      "{settings.ABOUT_TEXT}"
                    </p>
                  )}
                </div>
              )}

              <p className="text-gray-600 leading-relaxed">
                Ghé thăm showroom của chúng tôi hoặc liên hệ trực tiếp để được tư vấn về dòng xe VinFast phù hợp nhất với nhu cầu của bạn.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Hotline */}
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-[#0f4c81] rounded-xl flex items-center justify-center">
                  <PhoneIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hotline</p>
                  {isLoading ? (
                    <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                  ) : settings?.HOTLINE ? (
                    <a href={`tel:${settings.HOTLINE}`} className="text-xl font-bold text-[#0f4c81] hover:text-orange-500 transition-colors">
                      {settings.HOTLINE}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic text-sm">Chưa có thông tin</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <EmailIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  {isLoading ? (
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  ) : settings?.CONTACT_EMAIL ? (
                    <a href={`mailto:${settings.CONTACT_EMAIL}`} className="text-lg font-semibold text-gray-800 hover:text-[#0f4c81] transition-colors break-all">
                      {settings.CONTACT_EMAIL}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic text-sm">Chưa có thông tin</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Địa chỉ Chính</p>
                  {isLoading ? (
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  ) : settings?.ADDRESS ? (
                    <p className="text-gray-800 font-medium leading-relaxed">{settings.ADDRESS}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">Chưa có thông tin</p>
                  )}
                </div>
              </div>

              {/* Dynamic Branches Section */}
              {branches.length > 0 && (
                <div className="pt-4">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Hệ thống Chi nhánh</p>
                  <div className="space-y-3">
                    {branches.map((branch, index) => (
                      <div key={index} className="flex items-start gap-3 bg-gray-100/50 p-4 rounded-xl border border-dashed border-gray-200">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                        <p className="text-sm text-gray-700">{branch}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(settings?.ZALO_URL || settings?.FACEBOOK_URL) && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Kết nối với chúng tôi</p>
                <div className="flex gap-3">
                  {settings?.ZALO_URL && (
                    <a
                      href={settings.ZALO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0068ff] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <ZaloIcon />
                      Zalo
                    </a>
                  )}
                  {settings?.FACEBOOK_URL && (
                    <a
                      href={settings.FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <FacebookIcon />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Working Hours */}
            <div className="bg-gradient-to-br from-[#0f4c81] to-[#1a6ab5] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">⏰ Giờ Làm Việc</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Thứ 2 – Chủ nhật</span>
                  <span className="font-semibold">08:00 – 17:00</span>
                </div>
              </div>
            </div>

            {/* Disclaimer Section */}
            {settings?.DISCLAIMER && (
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                <p className="text-[11px] text-gray-500 leading-relaxed italic">
                  <span className="font-bold uppercase text-[10px] block mb-1 not-italic text-gray-400">Ghi chú pháp lý (Disclaimer):</span>
                  {settings.DISCLAIMER}
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Lead Form */}
          <div className="lg:sticky lg:top-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-2">Đăng Ký Tư Vấn</h2>
              <div className="w-12 h-1 bg-orange-500 mb-6" />
              <p className="text-gray-600">
                Điền thông tin bên dưới, chuyên viên của chúng tôi sẽ liên hệ trong vòng <strong>30 phút</strong>.
              </p>
            </div>
            <LeadForm
              formName="contact_page_form"
              initialValues={{ serviceType: 'BAO_GIA' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
