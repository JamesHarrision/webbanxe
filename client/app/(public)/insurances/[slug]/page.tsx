'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { insuranceService, Insurance } from '@/services/insurance.service';
import Image from 'next/image';
import { Spin, Breadcrumb } from 'antd';
import Link from 'next/link';
import LeadForm from '@/components/forms/LeadForm';

const InsuranceDetailPage = () => {
  const { slug } = useParams();
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const data = await insuranceService.getInsurance(slug as string);
        setInsurance(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchInsurance();
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  if (!insurance) return <div className="text-center py-12 text-2xl text-gray-500 font-medium">Không tìm thấy gói bảo hiểm</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={insurance.thumbnail}
          alt={insurance.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{insurance.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">{insurance.shortSummary}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Breadcrumb
          items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: <Link href="/insurances">Bảo hiểm</Link> },
            { title: insurance.name },
          ]}
          className="mb-10 text-lg"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white">
              <h2 className="text-3xl font-extrabold text-[#0f4c81] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1.5 after:bg-[#0f4c81] after:rounded-full">
                Thông tin & Quyền lợi chi tiết
              </h2>
              <div className="prose prose-lg prose-blue max-w-none prose-headings:text-[#0f4c81]" dangerouslySetInnerHTML={{ __html: insurance.description || '' }} />

              <div className="mt-12 p-8 bg-blue-50 rounded-2xl border-l-8 border-[#0f4c81]">
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-4">Tư vấn miễn phí</h3>
                <p className="text-gray-700 text-lg mb-2">Đội ngũ chuyên viên tư vấn bảo hiểm của VinFast Tiền Giang luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc và cung cấp báo giá chi tiết nhất phù hợp với dòng xe bạn đang sở hữu.</p>
                <div className="text-xl font-bold text-[#ee4d2d]">Hotline: 09xx.xxx.xxx</div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Lead Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#f8fbff] p-8 rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-extrabold text-[#0f4c81] mb-2 uppercase tracking-tight">Đăng ký tư vấn</h3>
                  <p className="text-gray-500 font-medium">Chúng tôi sẽ gọi lại trong vòng 15 phút</p>
                </div>
                <LeadForm
                  initialValues={{
                    serviceType: 'MUA_BAO_HIEM',
                    notes: `Yêu cầu tư vấn gói: ${insurance.name}`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetailPage;
