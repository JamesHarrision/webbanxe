'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StarFilled, UserOutlined, LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import { Spin, Avatar } from 'antd';
import Image from 'next/image';
import { testimonialService, Testimonial } from '@/services/testimonial.service';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const { data: reviews, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['publicTestimonials'],
    queryFn: () => testimonialService.getPublic(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Niềm Tin Khách Hàng
          </div>
          <h2 className="text-3xl font-bold uppercase text-[#0f4c81] mb-2">Đánh Giá Từ Chủ Xe VinFast</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto" />
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          spaceBetween={24}
          grabCursor={true}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          loop={reviews.length > 3}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper !pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="!h-auto">
              <div className="h-full bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">

                {/* Real Delivery Photo - Hero of the card */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  {review.deliveryImage ? (
                    <Image
                      src={review.deliveryImage}
                      alt={`Bàn giao xe ${review.customerName}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <CameraOutlined className="text-4xl" />
                      <span className="text-xs italic uppercase tracking-widest">Khoảnh khắc bàn giao</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 flex flex-col flex-1 relative">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarFilled
                        key={i}
                        className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 leading-relaxed flex-1 mb-6 italic text-sm md:text-base">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <Avatar
                      src={review.avatar}
                      size={48}
                      icon={<UserOutlined />}
                      className="flex-shrink-0 bg-blue-50 text-blue-600"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{review.customerName}</p>
                      {review.carModel && (
                        <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-tighter">
                          {review.carModel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonial-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #f97316;
          width: 24px;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
