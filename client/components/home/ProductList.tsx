'use client';

import React from 'react';
import { Card, Button, Tag, Row, Col } from 'antd';
import { CarOutlined, ThunderboltFilled } from '@ant-design/icons';
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

  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        // Use carService.getAll, which defaults to client-side fetch from /api/v1/cars
        // We might want to use a specific public endpoint or just getAll(false)
        const data = await carService.getAll();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        // Fallback to mock or empty
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Use mock if no cars fetched (optional, or just show empty)
  const displayCars = cars.length > 0 ? cars : MOCK_CARS;

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

        <Row gutter={[24, 24]}>
          {displayCars.map((car) => (
            <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
              <Card
                hoverable
                cover={
                  <div className="p-4 bg-white h-48 flex items-center justify-center overflow-hidden">
                    {/* Use generic placeholder if image fails, but assume these URLs work or break gracefully */}
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
                <Card.Meta // Re-using Card.Meta or just custom content
                  title={<div className="text-lg font-bold text-gray-800 text-center">{car.name}</div>}
                  description={
                    <div className="text-center mt-2">
                      <div className="text-orange-600 font-bold text-base mb-2">
                        {typeof car.price === 'number'
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.price)
                          : car.price}
                      </div>
                      <Tag color={car.category === 'car' ? 'blue' : 'green'} icon={car.category === 'car' ? <CarOutlined /> : <ThunderboltFilled />}>
                        {car.category === 'car' ? 'Ô tô điện' : 'Xe máy điện'}
                      </Tag>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-12">
          <Link href="/cars">
            <Button size="large" className="px-10 h-12 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold transition-all">
              XEM TẤT CẢ SẢN PHẨM
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
