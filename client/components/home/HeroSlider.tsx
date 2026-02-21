'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Spin } from 'antd';
import { RightOutlined, LoadingOutlined } from '@ant-design/icons';
import NextImage from 'next/image';
import Link from 'next/link';
import { heroSlideService, HeroSlide } from '@/services/heroSlide.service';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const { data: slides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['publicHeroSlides'],
    queryFn: () => heroSlideService.getPublic(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="h-[500px] md:h-[600px] w-full flex items-center justify-center bg-gray-900">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#f97316' }} spin />} />
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative hero-slider group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-[500px] md:h-[600px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full flex items-center bg-black">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <NextImage
                  src={slide.imageUrl}
                  alt={slide.title || 'VinFast Slider'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>

              <div className="container mx-auto px-4 z-10 relative text-white cursor-default">
                <div className="max-w-2xl">
                  {slide.title && (
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight animate-fade-in-up drop-shadow-lg">
                      {slide.title}
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default HeroSlider;
