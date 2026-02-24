'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { accessoryService, Accessory } from '@/services/accessory.service';
import Image from 'next/image';
import { Spin, Breadcrumb, Image as AntImage } from 'antd';
import Link from 'next/link';

const AccessoryDetailPage = () => {
  const { slug } = useParams();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const data = await accessoryService.getAccessory(slug as string);
        setAccessory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchAccessory();
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  if (!accessory) return <div className="text-center py-12">Không tìm thấy sản phẩm</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: <Link href="/accessories">Phụ kiện</Link> },
            { title: accessory.name },
          ]}
          className="mb-8"
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Left: Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-inner border border-gray-50 flex items-center justify-center bg-white cursor-zoom-in">
              <AntImage
                src={accessory.thumbnail}
                alt={accessory.name}
                className="!w-full !h-full object-contain p-4"
              // AntImage has built-in preview/zoom functionality by default.
              // No need to explicitly set preview={true} or add custom onClick for a single image.
              // If preview={false} was intended, it would disable the zoom.
              // Assuming "update with zoom" means enabling the default AntImage preview.
              />
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{accessory.name}</h1>

              <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
                <div>
                  <div className="text-gray-500 text-sm mb-1 font-medium text-uppercase tracking-wider">GIÁ ƯU ĐÃI</div>
                  <div className="text-3xl font-extrabold text-[#0f4c81]">{accessory.salePrice || accessory.price || 'Liên hệ'}</div>
                </div>
                {accessory.salePrice && accessory.price && (
                  <div className="border-l border-gray-200 pl-4">
                    <div className="text-gray-400 text-sm mb-1 line-through">Giá gốc: {accessory.price}</div>
                    <div className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded">TIẾT KIỆM HƠN</div>
                  </div>
                )}
              </div>

              {/* Pulsing Button */}
              <a
                href={accessory.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#ee4d2d] rounded-full group overflow-hidden transition-all duration-300 hover:bg-[#d73211] shadow-lg hover:shadow-orange-200"
              >
                <span className="absolute w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M4.53 4.47l.47 2.03h14l.47-2.03H4.53zM1 2l1.6 7h16.8L21 9V7.63l-1.07-4.66c-.15-.65-.73-1.12-1.4-1.12H5.47c-.67 0-1.25.47-1.4 1.12L3.07 7.63V9L1.6 9c-.83 0-1.5-.67-1.5-1.5S.77 6 1.6 6H2V2H1zm3.7 13.9c-.3.44-.45.98-.45 1.6 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-.62-.15-1.16-.45-1.6l-1.55-2.4H6.25l-1.55 2.4zm10 0c-.3.44-.45.98-.45 1.6 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-.62-.15-1.16-.45-1.6l-1.55-2.4h-4.5l-1.55 2.4z" />
                  </svg>
                  MUA NGAY TRÊN SHOPEE
                </span>
                <span className="absolute inset-0 rounded-full border-4 border-[#ee4d2d] animate-ping opacity-25"></span>
              </a>

              <p className="mt-8 text-gray-600 leading-relaxed italic border-l-4 border-[#0f4c81] pl-4">
                * Click vào nút phía trên để chuyển hướng sang Shopee - Kênh phân phối chính hãng các sản phẩm phụ kiện VinFast.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#0f4c81] rounded-full"></span>
              Thông tin chi tiết
            </h2>
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: accessory.description || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryDetailPage;
