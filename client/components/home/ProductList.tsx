'use client';

import React from 'react';
import { Card, Button, Tag, Row, Col } from 'antd';
import { CarOutlined, ThunderboltFilled } from '@ant-design/icons';
import Link from 'next/link';

// Mock data if fetch fails or for initial SSR
const MOCK_CARS = [
  { id: 1, name: "VinFast VF 3", price: "235.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw15545555/images/LadingPage/VF3/thumb_vf3.png", category: "car" },
  { id: 2, name: "VinFast VF 5 Plus", price: "468.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw3d155555/images/LadingPage/VF5/thumb_vf5.png", category: "car" },
  { id: 3, name: "VinFast VF 6", price: "675.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwc8115555/images/LadingPage/VF6/thumb_vf6.png", category: "car" },
  { id: 4, name: "VinFast VF 7", price: "850.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw81155555/images/LadingPage/VF7/thumb_vf7.png", category: "car" },
  { id: 5, name: "VinFast VF 8", price: "1.090.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw91155555/images/LadingPage/VF8/thumb_vf8.png", category: "car" },
  { id: 6, name: "VinFast VF 9", price: "1.491.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa1155555/images/LadingPage/VF9/thumb_vf9.png", category: "car" },
  { id: 7, name: "Klara S (2022)", price: "35.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwb1155555/images/LadingPage/KlaraS/thumb_klaras.png", category: "scooter" },
  { id: 8, name: "Feliz S", price: "27.000.000 VNĐ", image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwc1155555/images/LadingPage/FelizS/thumb_felizs.png", category: "scooter" },
];

const ProductList = () => {
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
          {MOCK_CARS.map((car) => (
            <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
              <Card
                hoverable
                cover={
                  <div className="p-4 bg-white h-48 flex items-center justify-center overflow-hidden">
                    {/* Use generic placeholder if image fails, but assume these URLs work or break gracefully */}
                    <img alt={car.name} src={car.image} className="max-h-full object-contain hover:scale-110 transition-transform duration-500" />
                  </div>
                }
                className="h-full flex flex-col justify-between shadow-sm hover:shadow-xl border-t-2 border-transparent hover:border-blue-500 transition-all"
                actions={[
                  <Button type="link" key="quote" className="text-blue-600 font-semibold hover:text-blue-800">Báo giá</Button>,
                  <Button type="link" key="detail" className="text-gray-500 hover:text-blue-600">Chi tiết</Button>,
                ]}
              >
                <Card.Meta // Re-using Card.Meta or just custom content
                  title={<div className="text-lg font-bold text-gray-800 text-center">{car.name}</div>}
                  description={
                    <div className="text-center mt-2">
                      <div className="text-orange-600 font-bold text-base mb-2">{car.price}</div>
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
