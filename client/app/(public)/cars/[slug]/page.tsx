'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from 'antd';
import {
  LeftOutlined,
  PhoneOutlined,
  CarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { carService, Car, CarColor } from '@/services/car.service';
import { useModal } from '@/context/ModalContext';
import { formatCurrency, getNumericPrice } from '@/lib/format';

// ─── Loading Skeleton ────────────────────────────────────
const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton.Button active size="small" style={{ width: 200, marginBottom: 24 }} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <Skeleton.Image active style={{ width: '100%', height: 400 }} />
        <div className="flex gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton.Avatar key={i} active size={40} shape="circle" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  </div>
);

// ─── Error State ─────────────────────────────────────────
const DetailError = () => (
  <div className="container mx-auto px-4 py-20 text-center">
    <div className="max-w-md mx-auto">
      <InfoCircleOutlined className="text-6xl text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Không tìm thấy xe</h2>
      <p className="text-gray-500 mb-8">
        Xe bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <LeftOutlined />
        Quay lại trang chủ
      </Link>
    </div>
  </div>
);

// ─── Main Page Component ────────────────────────────────
export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { openModal } = useModal();

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery<Car>({
    queryKey: ['car', slug],
    queryFn: () => carService.getByIdOrSlug(slug),
    enabled: !!slug,
  });

  // ── Color selection state ──
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  // Determine which image to show based on selected color
  const displayImage = useMemo(() => {
    if (!car) return '/placeholder.svg';
    if (selectedColorId && car.colors) {
      const color = car.colors.find((c) => c.id === selectedColorId);
      if (color?.imageUrl) return color.imageUrl;
    }
    return car.thumbnail || '/placeholder.svg';
  }, [car, selectedColorId]);

  const selectedColorName = useMemo(() => {
    if (!car?.colors || !selectedColorId) return null;
    return car.colors.find((c) => c.id === selectedColorId)?.colorName ?? null;
  }, [car, selectedColorId]);

  // ── Price helpers ──
  const priceNum = car ? getNumericPrice(car.price) : 0;
  const salePriceNum = car?.salePrice ? getNumericPrice(car.salePrice) : 0;
  const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

  // ── Render ──
  if (isLoading) return <DetailSkeleton />;
  if (isError || !car) return <DetailError />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500 gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#0f4c81] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{car.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ═══ LEFT: Image Gallery ═══ */}
          <div>
            {/* Main image */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={displayImage}
                alt={car.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                  Khuyến mãi
                </div>
              )}
            </div>

            {/* Color swatches (below image on mobile, part of image area) */}
            {car.colors && car.colors.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Màu sắc{selectedColorName && (
                    <span className="font-normal text-gray-400"> — {selectedColorName}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-3">
                  {car.colors.map((color) => {
                    const isActive = selectedColorId === color.id;
                    return (
                      <button
                        key={color.id}
                        title={color.colorName}
                        onClick={() => setSelectedColorId(isActive ? null : color.id)}
                        className={`
                          w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer
                          hover:scale-110 hover:shadow-md
                          ${isActive
                            ? 'border-[#0f4c81] ring-2 ring-[#0f4c81]/30 scale-110'
                            : 'border-gray-200'
                          }
                        `}
                        style={{ backgroundColor: color.colorHex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Thumbnail gallery of all color images */}
            {car.colors && car.colors.length > 1 && (
              <div className="mt-5 grid grid-cols-4 sm:grid-cols-5 gap-2">
                {/* Thumbnail for default image */}
                <button
                  onClick={() => setSelectedColorId(null)}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                    ${selectedColorId === null ? 'border-[#0f4c81] shadow-md' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <Image
                    src={car.thumbnail || '/placeholder.svg'}
                    alt="Mặc định"
                    fill
                    className="object-contain p-1 bg-gray-50"
                    sizes="100px"
                  />
                </button>
                {car.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColorId(color.id)}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                      ${selectedColorId === color.id ? 'border-[#0f4c81] shadow-md' : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <Image
                      src={color.imageUrl}
                      alt={color.colorName}
                      fill
                      className="object-contain p-1 bg-gray-50"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Car Info ═══ */}
          <div className="flex flex-col">
            {/* Car name */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {car.name}
            </h1>

            {/* Price section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">
                Giá niêm yết
              </p>
              {hasDiscount ? (
                <div>
                  <div className="text-gray-400 line-through text-lg font-medium">
                    {formatCurrency(car.price)}
                  </div>
                  <div className="text-orange-500 font-extrabold text-3xl lg:text-4xl mt-1">
                    {formatCurrency(car.salePrice)}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-sm font-semibold px-3 py-1 rounded-full mt-2">
                    <CheckCircleOutlined />
                    Tiết kiệm {formatCurrency(priceNum - salePriceNum)}
                  </div>
                </div>
              ) : (
                <div className="text-orange-500 font-extrabold text-3xl lg:text-4xl">
                  {formatCurrency(car.price)}
                </div>
              )}
            </div>

            {/* Color selector (compact, right side - desktop only) */}
            {car.colors && car.colors.length > 0 && (
              <div className="hidden lg:block mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  {car.colors.length} màu sắc có sẵn
                </p>
                <div className="flex flex-wrap gap-2">
                  {car.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() =>
                        setSelectedColorId(selectedColorId === color.id ? null : color.id)
                      }
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer
                        ${selectedColorId === color.id
                          ? 'border-[#0f4c81] bg-[#0f4c81]/5 text-[#0f4c81] font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      {color.colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white font-bold py-4 px-6 rounded-xl transition-colors text-base cursor-pointer shadow-lg shadow-[#0f4c81]/20"
              >
                <PhoneOutlined className="text-lg" />
                Liên hệ tư vấn
              </button>
              <button
                onClick={() => openModal({ type: 'TEST_DRIVE', carModel: car.name })}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white font-bold py-4 px-6 rounded-xl transition-all text-base cursor-pointer"
              >
                <CarOutlined className="text-lg" />
                Đăng ký lái thử
              </button>
            </div>
          </div>
        </div>

        {/* ─── Description Section ─── */}
        {car.description && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 flex items-center gap-2">
              <InfoCircleOutlined />
              Thông tin chi tiết
            </h2>
            <div
              className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100
                prose prose-lg max-w-none
                prose-headings:text-[#0f4c81] prose-headings:font-bold
                prose-a:text-[#0f4c81] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: car.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
