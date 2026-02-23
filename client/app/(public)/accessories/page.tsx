'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { accessoryService, Accessory } from '@/services/accessory.service';
import Link from 'next/link';
import Image from 'next/image';
import { Spin } from 'antd';
import { formatCurrency } from '@/lib/format';

const AccessoriesPage = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const data = await accessoryService.getAccessories();
        setAccessories(data.filter((a: Accessory) => a.isActive));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#0f4c81]">Phụ kiện VinFast (Shopee Affiliate)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {accessories.map((item) => (
          <Link key={item.id} href={`/accessories/${item.slug}`} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#0f4c81] transition-colors">{item.name}</h2>
              <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-red-600 font-bold text-lg">{formatCurrency(item.salePrice || item.price)}</span>
                  {item.salePrice && item.price && (
                    <span className="text-gray-400 line-through text-sm">{formatCurrency(item.price)}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesPage;
