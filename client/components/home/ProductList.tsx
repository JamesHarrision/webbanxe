'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/services/car.service';
import { Accessory } from '@/services/accessory.service';
import { Insurance } from '@/services/insurance.service';
import { useModal } from '@/context/ModalContext';
import { optimizeImage } from '@/lib/format';
import { RightOutlined } from '@ant-design/icons';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') return 'Liên hệ';

  // Clean up string to get raw number
  const cleanStr = String(value).replace(/[^\d]/g, '');
  const num = parseInt(cleanStr, 10);

  if (isNaN(num)) return String(value);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
};

const getNumericPrice = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const CarCard: React.FC<{ car: any; openModal: (args: any) => void }> = ({ car, openModal }) => {
  const priceNum = getNumericPrice(car.price);
  const salePriceNum = car.salePrice ? getNumericPrice(car.salePrice) : 0;
  const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg flex flex-col h-full border border-gray-100 transition-all duration-300">
      <Link href={`/cars/${car.slug || car.id}`} className="block relative w-full h-44 bg-gray-50 overflow-hidden flex-shrink-0 cursor-pointer">
        <Image
          alt={car.name}
          src={optimizeImage(car.thumbnail || car.image)}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase">
            Khuyến mãi
          </div>
        )}
      </Link>
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/cars/${car.slug || car.id}`} className="block hover:no-underline mb-2">
          <h4 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#0f4c81] transition-colors">{car.name}</h4>
        </Link>
        <div className="mb-4 flex-1">
          {hasDiscount ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through text-xs">{formatCurrency(car.price)}</span>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  Tiết kiệm {formatCurrency(priceNum - salePriceNum)}
                </span>
              </div>
              <div className="text-orange-500 font-extrabold text-lg leading-tight">{formatCurrency(car.salePrice)}</div>
            </>
          ) : (
            <div className="text-orange-500 font-extrabold text-lg leading-tight">{formatCurrency(car.price)}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
            className="flex-1 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
          >
            BÁO GIÁ
          </button>
          <Link
            href={`/cars/${car.slug || car.id}`}
            className="flex-1 border border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white text-xs font-bold py-2 rounded-xl transition-all text-center"
          >
            CHI TIẾT
          </Link>
        </div>
      </div>
    </div>
  );
};

const AccessoryCard: React.FC<{ item: Accessory }> = ({ item }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg flex flex-col h-full border border-gray-100 transition-all duration-300">
      <div className="block relative w-full h-40 bg-gray-50 overflow-hidden flex-shrink-0">
        <Image
          alt={item.name}
          src={optimizeImage(item.thumbnail)}
          fill
          className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
          sizes="25vw"
        />
      </div>
      <div className="flex flex-col flex-1 p-3">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#0f4c81] transition-colors mb-2">{item.name}</h4>
        <div className="mb-3 flex-1">
          <div className="text-orange-500 font-bold text-base">
            {formatCurrency(item.salePrice || item.price)}
          </div>
          {item.salePrice && item.price && (
            <div className="text-gray-400 line-through text-xs">
              {formatCurrency(item.price)}
            </div>
          )}
        </div>
        <a
          href={item.affiliateUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#0f4c81] hover:bg-[#1a6ab5] text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors text-center block"
        >
          XEM NGAY
        </a>
      </div>
    </div>
  );
};

const InsuranceCard: React.FC<{ item: Insurance }> = ({ item }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg flex flex-col h-full border border-gray-100 transition-all duration-300">
      <div className="block relative w-full h-40 bg-gray-50 overflow-hidden flex-shrink-0">
        <Image
          alt={item.name}
          src={optimizeImage(item.thumbnail)}
          fill
          className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
          sizes="25vw"
        />
      </div>
      <div className="flex flex-col flex-1 p-3">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#0f4c81] transition-colors mb-1">{item.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-1">{item.shortSummary}</p>
        <div className="mb-3">
          <span className="text-orange-500 font-bold text-base">
            {formatCurrency(item.price)}
          </span>
          {item.duration && (
            <span className="text-gray-500 text-sm font-medium ml-1">
              / {item.duration}
            </span>
          )}
        </div>
        <Link
          href={`/insurances/${item.slug}`}
          className="w-full border border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white text-[10px] font-bold py-1.5 rounded-lg transition-all text-center block"
        >
          CHI TIẾT
        </Link>
      </div>
    </div>
  );
};

interface ProductListProps {
  cars: Car[];
  accessories: Accessory[];
  insurances: Insurance[];
}

const ProductList: React.FC<ProductListProps> = ({ cars = [], accessories = [], insurances = [] }) => {
  const { openModal } = useModal();

  const personalCars = cars.filter(c => c.category === 'car' || c.category === 'Dòng xe cá nhân');
  const greenCars = cars.filter(c => c.category === 'greencar' || c.category === 'Dòng xe VinFast Green');

  const renderSection = (title: string, list: any[], CardComponent: React.ComponentType<any>, cardPropName: string, viewAllUrl: string, fullWidth: boolean = false) => {
    return (
      <div className={fullWidth ? "w-full mb-16" : "w-full lg:w-1/2 mb-12"}>
        <div className="flex flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h2 className={`font-bold uppercase text-[#0f4c81] break-words ${fullWidth ? 'text-xl md:text-2xl tracking-tight' : 'text-lg'}`}>
              {title}
            </h2>
            <div className="flex-1 h-px bg-gray-100 hidden md:block" />
          </div>
          <Link
            href={viewAllUrl}
            className="flex items-center gap-1.5 text-[#0f4c81] hover:text-blue-600 font-bold text-sm transition-colors group shrink-0"
          >
            <span className="hidden sm:inline">Xem tất cả</span>
            <span className="sm:hidden text-xs">Tất cả</span>
            <RightOutlined className="text-[10px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {list.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
              380: { slidesPerView: 1.3 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: fullWidth ? 3 : 2 },
              1024: { slidesPerView: fullWidth ? 4 : 2 }
            }}
            navigation
            pagination={{ clickable: true }}
            grabCursor={true}
            className="!pb-12 product-swiper"
          >
            {list.map((item) => (
              <SwiperSlide key={item.id} className="!h-auto">
                <CardComponent {...{ [cardPropName]: item }} openModal={openModal} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-12 border border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-gray-900 font-bold mb-1">Sản phẩm sắp ra mắt</h4>
            <p className="text-gray-500 text-sm max-w-[200px]">Đang được cập nhật, vui lòng quay lại sau.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Full-width sections for cars */}
        {renderSection('Dòng xe cá nhân', personalCars, CarCard, 'car', '/categories/car', true)}
        {renderSection('Dòng xe VinFast Green', greenCars, CarCard, 'car', '/categories/greencar', true)}

        {/* Half-width sections for accessories & insurance */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          {renderSection('Phụ kiện xe', accessories, AccessoryCard, 'item', '/accessories')}
          {renderSection('Bảo hiểm ô tô', insurances, InsuranceCard, 'item', '/insurances')}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
