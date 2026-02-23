import React from 'react';
export const dynamic = 'force-dynamic';
import Script from 'next/script';
import { Metadata } from 'next';
import PublicLayout from '@/components/layouts/PublicLayout';
import { ThunderboltOutlined, SafetyCertificateOutlined, DollarOutlined } from '@ant-design/icons';
import HeroSlider from '@/components/home/HeroSlider';
import ProductList from '@/components/home/ProductList';
import HomeDynamicSections from '@/components/home/HomeDynamicSections';

import HomeClient from '@/components/home/HomeClient';
import { carService } from '@/services/car.service';
import { settingService } from '@/services/setting.service';
import { heroSlideService } from '@/services/heroSlide.service';
import { accessoryService } from '@/services/accessory.service';
import { insuranceService } from '@/services/insurance.service';
import { testimonialService } from '@/services/testimonial.service';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingService.getPublicSettings();
  const siteName = settings?.WEBSITE_NAME || 'VINFAST TIỀN GIANG';
  const description = settings?.ABOUT_TEXT || 'Đại lý ủy quyền VinFast tại Tiền Giang. Cung cấp các dòng xe điện thông minh, an toàn và bền vững.';

  return {
    title: `${siteName} - Niềm Tin Khách Hàng`,
    description: description,
    openGraph: {
      title: siteName,
      description: description,
      url: 'https://vinfasttiengiang.net.vn',
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
    },
  };
}

export default async function Home() {
  // Fetch all data on the server
  const [
    settings,
    cars,
    slides,
    accessories,
    insurances,
    testimonials
  ] = await Promise.all([
    settingService.getPublicSettings(),
    carService.getAll({ view: 'public' }),
    heroSlideService.getPublic(),
    accessoryService.getAccessories(),
    insuranceService.getInsurances(),
    testimonialService.getPublic(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    'name': settings?.WEBSITE_NAME || 'VinFast Tiền Giang',
    'image': 'https://vinfasttiengiang.net.vn/logo.png',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings?.ADDRESS || 'Tiền Giang',
      'addressLocality': 'Mỹ Tho',
      'addressRegion': 'Tiền Giang',
      'addressCountry': 'VN'
    },
    'telephone': settings?.HOTLINE || '0939.508.085',
    'url': 'https://vinfasttiengiang.net.vn',
    'priceRange': 'VND',
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '08:00',
      'closes': '17:00'
    }
  };

  return (
    <PublicLayout settings={settings} cars={cars}>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />

      <HeroSlider slides={slides} />

      <ProductList
        cars={cars}
        accessories={accessories}
        insurances={insurances}
      />

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4 uppercase tracking-tight">Tại sao nên chọn VinFast?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              VinFast không chỉ là một chiếc xe, đó là một hệ sinh thái thông minh, an toàn và bền vững cho cuộc sống hiện đại.
            </p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <ThunderboltOutlined className="text-4xl text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f4c81]">Công nghệ tiên tiến</h3>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống hỗ trợ lái nâng cao ADAS cùng các tính năng thông minh Smart Services giúp chuyến đi của bạn trở nên thú vị và an toàn hơn bao giờ hết.
              </p>
            </div>

            <div className="p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <SafetyCertificateOutlined className="text-4xl text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f4c81]">An toàn hàng đầu</h3>
              <p className="text-gray-600 leading-relaxed">
                Các dòng xe VinFast được thiết kế theo tiêu chuẩn an toàn quốc tế, đạt chứng nhận từ ASEAN NCAP đến EURO NCAP, bảo vệ tối đa cho mọi hành khách.
              </p>
            </div>

            <div className="p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <DollarOutlined className="text-4xl text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f4c81]">Chính sách hậu mãi</h3>
              <p className="text-gray-600 leading-relaxed">
                Chế độ bảo hành lên đến 10 năm, hệ thống cứu hộ 24/7 và mạng lưới trạm sạc rộng khắp cả nước mang lại sự an tâm tuyệt đối trên mọi hành trình.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeDynamicSections
        testimonials={testimonials}
        hotline={settings?.HOTLINE}
      />
    </PublicLayout>
  );
}
