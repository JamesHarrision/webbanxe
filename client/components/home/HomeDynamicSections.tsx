'use client';

import React from 'react';
import nextDynamic from 'next/dynamic';

const Testimonials = nextDynamic(() => import('@/components/home/Testimonials'), {
  ssr: true,
  loading: () => <div className="h-96 animate-pulse bg-gray-50 rounded-3xl" />
});
const LeadForm = nextDynamic(() => import('@/components/forms/LeadForm'), { ssr: false });

interface HomeDynamicSectionsProps {
  testimonials: any[];
  hotline?: string;
}

export default function HomeDynamicSections({ testimonials, hotline }: HomeDynamicSectionsProps) {
  return (
    <>
      <Testimonials reviews={testimonials} />

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
                <p className="text-3xl font-bold text-orange-600">{hotline || '0939.508.085'}</p>
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <LeadForm formName="lead_form_page" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
