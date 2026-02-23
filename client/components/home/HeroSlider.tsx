'use client';

import React from 'react';
import NextImage from 'next/image';
import { HeroSlide } from '@/services/heroSlide.service';
import { optimizeImage } from '@/lib/format';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides = [] }) => {
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
        className="h-[350px] md:h-[600px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full flex items-center bg-black">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <NextImage
                  src={optimizeImage(slide.imageUrl)}
                  alt={slide.title || 'VinFast Slider'}
                  fill
                  className="object-contain object-center"
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
