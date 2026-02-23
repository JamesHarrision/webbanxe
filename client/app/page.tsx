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
  const description = "VinFast Tiền Giang - Đại lý ủy quyền chính thức chuyên cung cấp các dòng xe điện thông minh VF3, VF5, VFe34, VF8, VF9. Hỗ trợ trả góp lãi suất thấp, lái thử tận nhà.";

  return {
    title: `${siteName} | Showroom Xe Điện VinFast Chính Hãng`,
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

      <h1 className="sr-only">VinFast Tiền Giang - Đại lý ủy quyền xe điện VinFast chính hãng</h1>

      <HeroSlider slides={slides} />

      {/* Introduction Section for SEO */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6 uppercase tracking-tight">Chào mừng đến với VinFast Tiền Giang</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                VinFast Tiền Giang tự hào là đại lý ủy quyền chính thức của VinFast tại khu vực miền Tây. Chúng tôi cam kết mang đến cho quý khách hàng những dòng xe điện thông minh, hiện đại và bền vững nhất như VinFast VF 3, VF 5 Plus, VF 6, VF 7, VF 8 và VF 9.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Với đội ngũ nhân viên chuyên nghiệp, tận tâm và hệ thống xưởng dịch vụ đạt tiêu chuẩn 3S, VinFast Tiền Giang không chỉ bán xe mà còn đồng hành cùng bạn trên mọi nẻo đường với chính sách hậu mãi số 1 Việt Nam, bảo hành lên đến 10 năm và hệ thống trạm sạc rộng khắp.
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-200">Uy tín hàng đầu</div>
                <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-orange-200">Dịch vụ tận tâm</div>
              </div>
            </div>
            <div className="md:w-1/2 relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
                alt="Showroom VinFast Tiền Giang"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <ProductList
        cars={cars}
        accessories={accessories}
        insurances={insurances}
      />

      {/* Features Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4 uppercase tracking-tight">Cùng VinFast Tiền Giang kiến tạo tương lai xanh</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Lựa chọn xe điện VinFast là bạn đang góp phần bảo vệ môi trường và tận hưởng những công nghệ hỗ trợ lái tiên tiến nhất thế giới.
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
