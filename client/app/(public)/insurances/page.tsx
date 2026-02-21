'use client';

import React, { useEffect, useState } from 'react';
import { insuranceService, Insurance } from '@/services/insurance.service';
import Link from 'next/link';
import Image from 'next/image';
import { Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/lib/format';

const InsurancesPage = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const data = await insuranceService.getInsurances();
        setInsurances(data.filter((i: Insurance) => i.isActive));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurances();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0f4c81] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Dịch vụ Bảo hiểm VinFast</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">An tâm trên mọi hành trình với các gói bảo hiểm tối ưu, bảo vệ toàn diện cho chiếc xe của bạn.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insurances.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
              <div className="relative h-56">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.name}</h2>
                <p className="text-gray-600 mb-6 line-clamp-3">{item.shortSummary}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#0f4c81] font-bold text-lg">{formatCurrency(item.price)}</span>
                    {item.duration && <span className="text-gray-500 text-sm">/ {item.duration}</span>}
                  </div>
                  <Link href={`/insurances/${item.slug}`} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Chi tiết <RightOutlined className="ml-2 text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsurancesPage;
