'use client';

import React from 'react';
import { Card, Button, Row, Col } from 'antd';
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
  const formatCurrency = (value: number | string) => {
    if (value === undefined || value === null) return '';

    // Handle string inputs carefully
    let numValue = value;
    if (typeof value === 'string') {
      const clean = value.replace(/\D/g, '');
      if (clean) {
        numValue = parseInt(clean, 10);
      } else {
        return value;
      }
    }

    if (typeof numValue === 'number' && !isNaN(numValue)) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numValue);
    }

    return String(value);
  };

  // Helper to get raw number for comparison
  const getNumericPrice = (value: number | string): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const clean = value.replace(/\D/g, '');
      return parseInt(clean, 10) || 0;
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
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold uppercase text-[#0f4c81] mb-2">{title}</h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>
        <Row gutter={[24, 24]}>
          {productList.map((car) => {
            const priceNum = getNumericPrice(car.price);
            const salePriceNum = car.salePrice ? getNumericPrice(car.salePrice) : 0;
            const hasDiscount = salePriceNum > 0 && salePriceNum < priceNum;

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
                <Card
                  hoverable
                  cover={
                    <div className="p-4 bg-white h-48 flex items-center justify-center overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          alt={car.name}
                          src={car.thumbnail || car.image || '/placeholder.svg'}
                          fill
                          className="object-contain hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  }
                  className="h-full flex flex-col justify-between shadow-sm hover:shadow-xl border-t-2 border-transparent hover:border-blue-500 transition-all"
                  actions={[
                    <Button
                      type="link"
                      key="quote"
                      className="text-blue-600 font-semibold hover:text-blue-800"
                      onClick={() => openModal({ type: 'QUOTE', carModel: car.name })}
                    >
                      Báo giá
                    </Button>,
                    <Link href={`/cars/${car.slug || car.id}`} key="detail">
                      <Button type="link" className="text-gray-500 hover:text-blue-600">Chi tiết</Button>
                    </Link>,
                  ]}
                >
                  <Card.Meta
                    title={<div className="text-lg font-bold text-gray-800 text-center">{car.name}</div>}
                    description={
                      <div className="text-center mt-2 h-16 flex flex-col justify-center">
                        {/* Price Display Logic */}
                        {hasDiscount && (
                          <div className="text-gray-400 line-through text-sm">
                            {formatCurrency(car.price)}
                          </div>
                        )}
                        <div className="text-orange-600 font-bold text-xl">
                          {formatCurrency(hasDiscount ? car.salePrice : car.price)}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
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
