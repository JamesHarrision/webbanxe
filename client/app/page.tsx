'use client';

import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import LeadForm from '@/components/forms/LeadForm';
import { Button } from 'antd';
import { ThunderboltOutlined, SafetyCertificateOutlined, DollarOutlined } from '@ant-design/icons';
import HeroSlider from '@/components/home/HeroSlider';
import ProductList from '@/components/home/ProductList';
import Testimonials from '@/components/home/Testimonials';


export default function Home() {
  return (
    <PublicLayout>
      <HeroSlider />

      <ProductList />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <ThunderboltOutlined className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#0f4c81]">Công nghệ tiên tiến</h3>
              <p className="text-gray-600">Trải nghiệm lái xe thông minh với các tính năng ADAS và Smart Services vượt trội.</p>
            </div>
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <SafetyCertificateOutlined className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#0f4c81]">An toàn hàng đầu</h3>
              <p className="text-gray-600">Đạt tiêu chuẩn an toàn cao nhất từ ASEAN NCAP, EURO NCAP và NHTSA.</p>
            </div>
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <DollarOutlined className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#0f4c81]">Chính sách hậu mãi</h3>
              <p className="text-gray-600">Bảo hành 10 năm, cứu hộ 24/7 và hệ thống trạm sạc phủ khắp toàn quốc.</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Lead Form Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-[#0f4c81]">Đăng ký lái thử & Nhận báo giá</h2>
              <p className="text-lg text-gray-600 mb-8">
                Hãy để lại thông tin, đội ngũ tư vấn của VinFast Tiền Giang sẽ liên hệ với bạn trong thời gian sớm nhất để hỗ trợ tư vấn các dòng xe phù hợp và các chương trình khuyến mãi hiện hành.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <h4 className="font-bold text-gray-800 mb-2 uppercase">Hotline Kinh Doanh</h4>
                <p className="text-3xl font-bold text-orange-600">0939.508.085</p>
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
