'use client';

import React from 'react';
import { CarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { carService, Car } from '@/services/car.service';
import { useModal } from '@/context/ModalContext';

// Mock data if fetch fails or for initial SSR
const MOCK_CARS = [
  { id: 1, name: "VinFast VF 3", price: "235.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 2, name: "VinFast VF 5 Plus", price: "468.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 3, name: "VinFast VF 6", price: "675.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 4, name: "VinFast VF 7", price: "850.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 5, name: "VinFast VF 8", price: "1.090.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 6, name: "VinFast VF 9", price: "1.491.000.000 VNĐ", image: "/placeholder.svg", category: "car" },
  { id: 7, name: "Klara S (2022)", price: "35.000.000 VNĐ", image: "/placeholder.svg", category: "scooter" },
  { id: 8, name: "Feliz S", price: "27.000.000 VNĐ", image: "/placeholder.svg", category: "scooter" },
];

const ProductList = () => {
  const [cars, setCars] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { openModal } = useModal();

  // Helper to format currency
  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') return '';

    // parseFloat handles both JS numbers and Prisma Decimal strings ("100000000.00")
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
    if (isNaN(num)) return String(value);

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Helper to get raw number for comparison
  const getNumericPrice = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Prisma Decimal comes as "100000000.00" — parseFloat handles this correctly
      const parsed = parseFloat(value.replace(/,/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAll({ view: 'public' });
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const displayCars = cars.length > 0 ? cars : MOCK_CARS;

  // Split into categories
  const personalCars = displayCars.filter(c => c.category === 'car' || c.category === 'Dòng xe cá nhân');
  const greenCars = displayCars.filter(c => c.category === 'scooter' || c.category === 'Dòng xe VinFast Green');

  const renderProductSection = (title: string, productList: any[]) => {
    if (productList.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold uppercase text-[#0f4c81] mb-3">{title}</h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((car) => {
            const priceNum = getNumericPrice(car.price);
            const salePriceNum = car.salePrice ? getNumericPrice(car.salePrice) : 0;
            const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

            return (
              <div
                key={car.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl flex flex-col"
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {/* Image area */}
                <div className="relative w-full h-52 bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">
                  <Image
                    alt={car.name}
                    src={car.thumbnail || car.image || '/placeholder.svg'}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f4c81]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide">
                      Khuyến mãi
                    </div>
                  )}

                  {/* Brand tag */}
                  <div className="absolute top-3 right-3 bg-[#0f4c81]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    VinFast
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <h4 className="text-base font-bold text-gray-900 text-center mb-3 group-hover:text-[#0f4c81] transition-colors line-clamp-2">
                    {car.name}
                  </h4>

                  {/* Price block */}
                  <div className="text-center mb-4 flex-1 flex flex-col justify-center">
                    {hasDiscount ? (
                      <>
                        <div className="text-gray-400 line-through text-sm font-medium mb-0.5">
                          {formatCurrency(car.price)}
                        </div>
                        <div className="text-orange-500 font-extrabold text-xl leading-tight">
                          {formatCurrency(car.salePrice)}
                        </div>
                        <div className="text-green-600 text-xs font-semibold mt-1">
                          Tiết kiệm {formatCurrency(priceNum - salePriceNum)}
                        </div>
                      </>
                    ) : (
                      <div className="text-orange-500 font-extrabold text-xl">
                        {formatCurrency(car.price)}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mb-3" />

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
                      className="flex-1 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white text-sm font-semibold py-2 px-3 rounded-xl transition-colors duration-200 cursor-pointer"
                    >
                      Báo giá
                    </button>
                    <Link href={`/cars/${car.slug || car.id}`} className="flex-1">
                      <button className="w-full border-2 border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white text-sm font-semibold py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer">
                        Chi tiết
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase text-[#0f4c81] mb-2">Sản Phẩm VinFast</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Khám phá các dòng xe ô tô điện và xe máy điện thông minh, hiện đại và thân thiện với môi trường của VinFast.
          </p>
        </div>

        {renderProductSection("Dòng xe cá nhân", personalCars)}
        {renderProductSection("Dòng xe VinFast Green", greenCars)}
      </div>
    </section>
  );
};

export default ProductList;
