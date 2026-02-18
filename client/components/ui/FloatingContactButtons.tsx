'use client';

import React from 'react';
import { PhoneOutlined } from '@ant-design/icons';
import Image from 'next/image';

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-4">
      {/* Phone Button */}
      <div className="group relative flex items-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <a
          href="tel:0939508085"
          className="relative flex items-center justify-center w-12 h-12 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-colors"
        >
          <PhoneOutlined className="text-xl rotate-90" />
        </a>
        <span className="ml-3 bg-white px-3 py-1 rounded-full shadow-md text-sm font-semibold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 whitespace-nowrap">
          0939.508.085
        </span>
      </div>

      {/* Zalo Button */}
      <div className="group relative flex items-center">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 delay-300"></div>
        <a
          href="https://zalo.me/0939508085"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors overflow-hidden"
        >
          {/* Using a text placeholder "Z" since we don't have the Zalo icon asset yet, or use an image if available */}
          <span className="font-bold text-xl italic">Z</span>
        </a>
        <span className="ml-3 bg-white px-3 py-1 rounded-full shadow-md text-sm font-semibold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 whitespace-nowrap">
          Chat Zalo
        </span>
      </div>
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingContactButtons;
