'use client';

import React from 'react';
import { Carousel, Avatar, Card } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';

const REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    car: "VinFast VF 8",
    comment: "Xe chạy rất êm, công nghệ ADAS hỗ trợ lái tuyệt vời. Nhân viên VinFast Tiền Giang tư vấn rất nhiệt tình và chu đáo.",
    rating: 5,
    avatar: null
  },
  {
    id: 2,
    name: "Trần Thị B",
    car: "VinFast VF 5 Plus",
    comment: "Chiếc xe nhỏ gọn, linh hoạt, rất phù hợp đi trong phố. Chi phí vận hành rẻ hơn nhiều so với xe xăng.",
    rating: 5,
    avatar: null
  },
  {
    id: 3,
    name: "Lê Văn C",
    car: "VinFast VF 9",
    comment: "Đẳng cấp thương gia. Không gian rộng rãi, sang trọng. Cảm giác lái rất đầm chắc.",
    rating: 5,
    avatar: null
  }
];

const Testimonials = () => {
  // Custom settings for responsive carousel if needed, default Antd Carousel corresponds to slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase text-[#0f4c81] mb-2">Khách Hàng Nói Về Chúng Tôi</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="px-4 md:px-12">
          <Carousel autoplay {...settings}>
            {REVIEWS.map((review) => (
              <div key={review.id} className="px-3 pb-8 pt-2">
                <Card className="h-full shadow-md hover:shadow-lg transition-shadow border-none bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <Avatar size={64} icon={<UserOutlined />} className="mb-4 bg-blue-200 text-blue-600" />
                    <h4 className="font-bold text-lg text-gray-800">{review.name}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-4">{review.car}</p>
                    <div className="flex justify-center mb-4 gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarFilled key={i} className="text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">&quot;{review.comment}&quot;</p>
                  </div>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
