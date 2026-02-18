'use client';

import React from 'react';
import { CarOutlined } from '@ant-design/icons';

const CarLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative w-64 h-32 flex items-end justify-center overflow-hidden">
        {/* Road */}
        <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>
        <div className="absolute bottom-0 w-full h-1 bg-gray-400 animate-slide-road"></div>

        {/* Car */}
        <div className="mb-2 animate-bounce-custom">
          <CarOutlined className="text-6xl text-blue-600 animate-drive" />
        </div>

        {/* Speed lines */}
        <div className="absolute top-10 right-0 w-10 h-0.5 bg-gray-300 animate-wind delay-100"></div>
        <div className="absolute top-12 right-0 w-16 h-0.5 bg-gray-300 animate-wind delay-200"></div>
        <div className="absolute top-14 right-0 w-8 h-0.5 bg-gray-300 animate-wind delay-300"></div>
      </div>
      <p className="mt-4 text-blue-600 font-semibold animate-pulse">Đang tải...</p>

      <style jsx>{`
        @keyframes drive {
          0% { transform: translateX(-100px); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100px); opacity: 0; }
        }
        @keyframes slide-road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes wind {
           0% { transform: translateX(100%); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translateX(-200%); opacity: 0; }
        }
         @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-drive {
          animation: drive 2s linear infinite;
        }
        .animate-slide-road {
          animation: slide-road 1s linear infinite;
        }
         .animate-wind {
          animation: wind 0.8s linear infinite;
        }
         .animate-bounce-custom {
          animation: bounce-custom 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CarLoading;
