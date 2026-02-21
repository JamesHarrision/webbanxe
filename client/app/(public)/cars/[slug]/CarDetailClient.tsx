'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from 'antd';
import {
  LeftOutlined,
  PhoneFilled,
  CarOutlined,
  InfoCircleOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { carService, Car } from '@/services/car.service';
import { useModal } from '@/context/ModalContext';
import { formatCurrency, getNumericPrice } from '@/lib/format';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// Move static Swiper modules outside component to prevent instability
const swiperModules = [FreeMode, Navigation, Thumbs, Pagination];
const thumbModules = [FreeMode, Navigation, Thumbs];

// --- Skeleton Component ---
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

// --- Error Component ---
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
        className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
      >
        <LeftOutlined />
        Quay lại trang chủ
      </Link>
    </div>
  </div>
);

export default function CarDetailClient({ slug }: { slug: string }) {
  const { openModal } = useModal();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery<Car>({
    queryKey: ['car', slug],
    queryFn: () => carService.getByIdOrSlug(slug),
    enabled: !!slug,
  });

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  // Memoize the master gallery: thumbnail + gallery + colors
  const allImages = useMemo(() => {
    if (!car) return [];
    const images: { url: string; type: 'thumbnail' | 'gallery' | 'color'; colorId?: number }[] = [
      { url: car.thumbnail, type: 'thumbnail' }
    ];

    if (Array.isArray(car.images)) {
      car.images.forEach(img => images.push({ url: img, type: 'gallery' }));
    }

    if (Array.isArray(car.colors)) {
      car.colors.forEach(col => images.push({ url: col.imageUrl, type: 'color', colorId: col.id }));
    }

    return images;
  }, [car]);

  // Handle color selection
  const handleColorClick = (colorId: number) => {
    if (selectedColorId === colorId) {
      setSelectedColorId(null);
      if (mainSwiper) mainSwiper.slideTo(0);
    } else {
      setSelectedColorId(colorId);
      const colorIndex = allImages.findIndex(img => img.colorId === colorId);
      if (colorIndex !== -1 && mainSwiper) {
        mainSwiper.slideTo(colorIndex);
      }
    }
  };

  const selectedColorName = useMemo(() => {
    if (!Array.isArray(car?.colors) || !selectedColorId) return null;
    return car.colors.find((c) => c.id === selectedColorId)?.colorName ?? null;
  }, [car, selectedColorId]);

  const priceNum = car ? getNumericPrice(car.price) : 0;
  const salePriceNum = car?.salePrice ? getNumericPrice(car.salePrice) : 0;
  const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

  // Memoize Swiper settings for stability
  const swiperPagination = useMemo(() => ({ type: 'fraction' as const }), []);
  const swiperBreakpoints = useMemo(() => ({
    640: { slidesPerView: 5 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  }), []);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !car) return <DetailError />;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500 gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#0f4c81] transition-colors cursor-pointer">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative group">
              <Swiper
                onSwiper={setMainSwiper}
                spaceBetween={10}
                navigation={true}
                pagination={swiperPagination}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={swiperModules}
                className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx} className="relative w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={img.url}
                      alt={car.name}
                      fill
                      className="object-contain p-4 md:p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={idx === 0}
                    />
                  </SwiperSlide>
                ))}

                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                    Ưu đãi đặc biệt
                  </div>
                )}

                <button className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-[#0f4c81] transition-colors md:hidden cursor-pointer">
                  <FullscreenOutlined />
                </button>
              </Swiper>
            </div>

            {allImages.length > 1 && (
              <div className="thumbs-container">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={thumbModules}
                  breakpoints={swiperBreakpoints}
                  className="h-20 md:h-24"
                >
                  {allImages.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-pointer">
                      <div className="w-full h-full relative rounded-xl border-2 border-transparent transition-all overflow-hidden bg-gray-50">
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${idx}`}
                          fill
                          className="object-contain p-2"
                          sizes="100px"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Car Info Column */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {car.name}
              </h1>
            </div>

            <div className="bg-gradient-to-br from-[#0f4c81] to-[#1a6ab5] rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-blue-900/10 mb-8 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
              <p className="text-blue-100/70 text-sm font-medium mb-2 uppercase tracking-wide">Giá bán</p>

              {hasDiscount ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl lg:text-5xl font-black">
                      {formatCurrency(car.salePrice)}
                    </span>
                    <span className="text-lg text-blue-200/60 line-through">
                      {formatCurrency(car.price)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      TIẾT KIỆM {formatCurrency(priceNum - salePriceNum)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-4xl lg:text-5xl font-black">
                  {formatCurrency(car.price)}
                </div>
              )}
            </div>

            {Array.isArray(car.colors) && car.colors.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  Lựa chọn màu sắc {selectedColorName && <span className="text-gray-400 font-medium">- {selectedColorName}</span>}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {car.colors.map((color) => {
                    const isActive = selectedColorId === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => handleColorClick(color.id)}
                        className="group relative flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
                      >
                        <div
                          className={`
                            w-12 h-12 rounded-full border-4 transition-all duration-300 p-0.5
                            ${isActive ? 'border-[#0f4c81] scale-110 shadow-lg' : 'border-white hover:border-gray-300'}
                          `}
                        >
                          <div
                            className="w-full h-full rounded-full shadow-inner"
                            style={{ backgroundColor: color.colorHex }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-[#0f4c81]' : 'text-gray-400'}`}>
                          {color.colorName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <button
                onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
                className="group relative flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm cursor-pointer"
              >
                <PhoneFilled className="text-xl animate-pulse -scale-x-100" />
                Nhận báo giá ngay
              </button>
              <button
                onClick={() => openModal({ type: 'TEST_DRIVE', carModel: car.name })}
                className="flex items-center justify-center gap-3 border-2 border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white font-black py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
              >
                <CarOutlined className="text-xl" />
                Đăng ký lái thử
              </button>
            </div>
          </div>
        </div>

        {car.description && (
          <div className="mt-16 lg:mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-[#0f4c81] uppercase tracking-tight">Thông số & Chi tiết</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div
              className="bg-white rounded-[2rem] p-8 lg:p-16 shadow-xl shadow-gray-200/50 border border-gray-100
                prose prose-sm md:prose-base lg:prose-lg max-w-none prose-img:rounded-xl prose-img:mx-auto rich-text-content"
              dangerouslySetInnerHTML={{ __html: car.description }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
