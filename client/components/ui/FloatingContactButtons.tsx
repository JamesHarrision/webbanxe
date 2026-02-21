'use client';

import React from 'react';
import { PhoneFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { settingService, PublicSettings } from '@/services/setting.service';

const FloatingContactButtons = () => {
  const { data: settings } = useQuery<PublicSettings>({
    queryKey: ['publicSettings'],
    queryFn: () => settingService.getPublicSettings(),
  });

  const hotline = settings?.HOTLINE || '0939508085';
  const cleanHotline = hotline.replace(/\./g, '').replace(/\s/g, '');
  const zaloUrl = settings?.ZALO_URL || `https://zalo.me/${cleanHotline}`;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-4">
      {/* Phone Button */}
      <div className="group relative flex items-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping-custom opacity-75"></div>
        <a
          href={`tel:${cleanHotline}`}
          className="relative flex items-center justify-center w-12 h-12 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
        >
          <PhoneFilled className="text-xl" />
        </a>
        <span className="ml-3 bg-white px-3 py-1 rounded-full shadow-md text-sm font-semibold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 whitespace-nowrap">
          {hotline}
        </span>
      </div>

      {/* Zalo Button */}
      <div className="group relative flex items-center">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping-custom opacity-75 delay-300"></div>
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors overflow-hidden cursor-pointer"
        >
          <span className="font-bold text-xl italic">Z</span>
        </a>
        <span className="ml-3 bg-white px-3 py-1 rounded-full shadow-md text-sm font-semibold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 whitespace-nowrap">
          Chat Zalo
        </span>
      </div>
    </div>
  );
};

export default FloatingContactButtons;
