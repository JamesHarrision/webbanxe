'use strict';
'use client';

import React from 'react';
import { Carousel, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Image from 'next/image';

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "MUA 1 TẶNG 1",
      subtitle: "TỔNG GIÁ TRỊ ƯU ĐÃI LÊN ĐẾN 268 TRIỆU ĐỒNG",
      description: "Sở hữu VinFast VF 8 - Nhận ngay Evo200 Lite. Áp dụng từ 03-31/10/2025.",
      image: "https://vinfasttiengiang.net.vn/wp-content/uploads/2023/10/banner-vf8-thang-10-2023.jpg", // Placeholder or real URL if available. Using a generic VinFast banner logic.
      bgColor: "bg-blue-900"
    },
    {
      id: 2,
      title: "VINFAST VF 9",
      subtitle: "MÃNH LIỆT TINH THẦN VIỆT NAM",
      description: "Mẫu SUV điện hạng sang cỡ lớn 7 chỗ ngồi.",
      image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw86444855/images/LadingPage/VF9/VF9_banner_pc.jpg",
      bgColor: "bg-black"
    },
    {
      id: 3,
      title: "VINFAST VF 6",
      subtitle: "GHI DẤU TỪNG KHOẢNH KHẮC",
      description: "Tuyệt tác thiết kế - Công nghệ thông minh.",
      image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw18544257/images/LadingPage/VF6/VF6_banner_pc.jpg",
      bgColor: "bg-orange-700"
    }
  ];

  return (
    <div className="relative hero-slider">
      <Carousel autoplay effect="fade" autoplaySpeed={5000}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className={`relative h-[500px] md:h-[600px] w-full flex items-center ${slide.bgColor}`}>
              {/* Background Image Overlay */}
              <div className="absolute inset-0 z-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              </div>

              <div className="container mx-auto px-4 z-10 relative text-white">
                <div className="max-w-2xl animate-fade-in-up">
                  <h3 className="text-xl md:text-2xl font-bold text-orange-400 mb-2 uppercase tracking-wide">
                    {slide.subtitle}
                  </h3>
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex gap-4">
                    <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 border-none h-12 px-8 font-bold text-lg rounded-none">
                      ĐĂNG KÝ LÁI THỬ
                    </Button>
                    <Button ghost size="large" className="h-12 px-8 font-bold text-lg rounded-none hover:text-blue-400 hover:border-blue-400">
                      XEM CHI TIẾT <RightOutlined />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider;
