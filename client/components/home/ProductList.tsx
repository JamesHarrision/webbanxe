'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carService, Car } from '@/services/car.service';
import { useModal } from '@/context/ModalContext';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mock data fallback
const MOCK_CARS = [
  { id: 1, name: 'VinFast VF 3', price: '235000000', image: '/placeholder.svg', category: 'car', slug: 'vf-3' },
  { id: 2, name: 'VinFast VF 5 Plus', price: '468000000', image: '/placeholder.svg', category: 'car', slug: 'vf-5-plus' },
  { id: 3, name: 'VinFast VF 6', price: '675000000', image: '/placeholder.svg', category: 'car', slug: 'vf-6' },
  { id: 4, name: 'VinFast VF 7', price: '850000000', image: '/placeholder.svg', category: 'car', slug: 'vf-7' },
  { id: 5, name: 'VinFast VF 8', price: '1090000000', image: '/placeholder.svg', category: 'car', slug: 'vf-8' },
  { id: 6, name: 'VinFast VF 9', price: '1491000000', image: '/placeholder.svg', category: 'car', slug: 'vf-9' },
  { id: 7, name: 'Klara S (2022)', price: '35000000', image: '/placeholder.svg', category: 'greencar', slug: 'klara-s' },
  { id: 8, name: 'Feliz S', price: '27000000', image: '/placeholder.svg', category: 'greencar', slug: 'feliz-s' },
];

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const getNumericPrice = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

interface CarCardProps {
  car: any;
  openModal: (args: any) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, openModal }) => {
  const priceNum = getNumericPrice(car.price);
  const salePriceNum = car.salePrice ? getNumericPrice(car.salePrice) : 0;
  const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl flex flex-col h-full"
      style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Image */}
      <Link href={`/cars/${car.slug || car.id}`} className="block relative w-full h-52 bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden flex-shrink-0 cursor-pointer">
        <Image
          alt={car.name}
          src={car.thumbnail || car.image || '/placeholder.svg'}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f4c81]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide">
            Khuyến mãi
          </div>
        )}
        <div className="absolute top-3 right-3 bg-[#0f4c81]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          VinFast
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/cars/${car.slug || car.id}`} className="block hover:no-underline">
          <h4 className="text-base font-bold text-gray-900 text-center mb-3 group-hover:text-[#0f4c81] transition-colors line-clamp-2 cursor-pointer">
            {car.name}
          </h4>
        </Link>
        <div className="text-center mb-4 flex-1 flex flex-col justify-center">
          {hasDiscount ? (
            <>
              <div className="text-gray-400 line-through text-sm font-medium mb-0.5">{formatCurrency(car.price)}</div>
              <div className="text-orange-500 font-extrabold text-xl leading-tight">{formatCurrency(car.salePrice)}</div>
              <div className="text-green-600 text-xs font-semibold mt-1">Tiết kiệm {formatCurrency(priceNum - salePriceNum)}</div>
            </>
          ) : (
            <div className="text-orange-500 font-extrabold text-xl">{formatCurrency(car.price)}</div>
          )}
        </div>
        <div className="h-px bg-gray-100 mb-3" />
        <div className="flex gap-2">
          <button
            onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
            className="flex-1 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white text-sm font-semibold py-2 px-3 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Báo giá
          </button>
          <Link
            href={`/cars/${car.slug || car.id}`}
            className="flex-1 border-2 border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white text-sm font-semibold py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center text-center"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [cars, setCars] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { openModal } = useModal();

  React.useEffect(() => {
    carService.getAll({ view: 'public' })
      .then(data => setCars(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const displayCars = cars.length > 0 ? cars : MOCK_CARS;
  const personalCars = displayCars.filter(c => c.category === 'car' || c.category === 'Dòng xe cá nhân');
  const greenCars = displayCars.filter(c => c.category === 'greencar' || c.category === 'Dòng xe VinFast Green');

  const renderSection = (title: string, list: any[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold uppercase text-[#0f4c81] mb-3">{title}</h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md h-80 animate-pulse">
                <div className="h-52 bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            navigation
            pagination={{ clickable: true }}
            grabCursor={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="product-swiper !pb-12"
          >
            {list.map((car) => (
              <SwiperSlide key={car.id} className="!h-auto">
                <CarCard car={car} openModal={openModal} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase text-[#0f4c81] mb-2">Sản Phẩm VinFast</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Khám phá các dòng xe ô tô điện và xe máy điện thông minh, hiện đại và thân thiện với môi trường của VinFast.
          </p>
        </div>

        {renderSection('Dòng xe cá nhân', personalCars)}
        {renderSection('Dòng xe VinFast Green', greenCars)}
      </div>

    </section>
  );
};

export default ProductList;
