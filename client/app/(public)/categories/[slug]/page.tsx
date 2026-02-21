'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { carService, Car } from '@/services/car.service';
import Image from 'next/image';
import NextLink from 'next/link';
import { useModal } from '@/context/ModalContext';
import { Spin, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

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

const CarCard = ({ car, openModal }: { car: any; openModal: (args: any) => void }) => {
  const priceNum = getNumericPrice(car.price);
  const salePriceNum = car.salePrice ? getNumericPrice(car.salePrice) : 0;
  const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      <NextLink href={`/cars/${car.slug || car.id}`} className="block relative w-full h-48 bg-gray-50 overflow-hidden">
        <Image
          alt={car.name}
          src={car.thumbnail || '/placeholder.svg'}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Khuyến mãi
          </div>
        )}
      </NextLink>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#0f4c81] transition-colors line-clamp-1">
          {car.name}
        </h4>
        <div className="mb-4 flex-1">
          {hasDiscount ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through text-xs">{formatCurrency(car.price)}</span>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  Tiết kiệm {formatCurrency(priceNum - salePriceNum)}
                </span>
              </div>
              <div className="text-orange-500 font-bold text-lg leading-tight">{formatCurrency(car.salePrice)}</div>
            </>
          ) : (
            <div className="text-orange-500 font-bold text-lg leading-tight">{formatCurrency(car.price)}</div>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
            className="flex-1 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white text-xs font-bold py-2 rounded-lg transition-colors"
          >
            BÁO GIÁ
          </button>
          <NextLink
            href={`/cars/${car.slug || car.id}`}
            className="flex-1 border border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white text-xs font-bold py-2 rounded-lg transition-all text-center"
          >
            CHI TIẾT
          </NextLink>
        </div>
      </div>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  const categoryName = slug === 'car' ? 'Dòng xe cá nhân' : slug === 'greencar' ? 'Dòng xe VinFast Green' : 'Danh mục xe';

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAll({ view: 'public' });
        const filtered = data.filter(c => {
          if (slug === 'car') return c.category === 'car' || c.category === 'Dòng xe cá nhân';
          if (slug === 'greencar') return c.category === 'greencar' || c.category === 'Dòng xe VinFast Green';
          return true;
        });
        setCars(filtered);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [slug]);

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumb
          className="mb-8 font-medium"
          items={[
            { title: <NextLink href="/" className="hover:text-[#0f4c81]"><HomeOutlined /> Trang chủ</NextLink> },
            { title: categoryName },
          ]}
        />

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold uppercase text-[#0f4c81] mb-2 tracking-tight">{categoryName}</h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spin size="large" tip="Đang tải danh sách..." />
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} openModal={openModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="mb-6 relative w-24 h-24 mx-auto opacity-20">
              <HomeOutlined className="text-8xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sản phẩm sắp ra mắt</h3>
            <p className="text-gray-500 mb-8 px-6">Chúng tôi đang cập nhật các dòng xe mới nhất cho danh mục này. Vui lòng quay lại sau hoặc liên hệ Hotline để được tư vấn.</p>
            <NextLink href="/" className="bg-[#0f4c81] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a6ab5] transition-colors inline-block shadow-md">
              Quay lại trang chủ
            </NextLink>
          </div>
        )}
      </div>
    </div>
  );
}
