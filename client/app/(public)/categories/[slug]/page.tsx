import React from 'react';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { carService } from '@/services/car.service';
import CategoryClient from './CategoryClient';

interface Props {
  params: { slug: string };
}

const getCategoryName = (slug: string) => {
  if (slug === 'car') return 'Dòng xe cá nhân';
  if (slug === 'greencar') return 'Dòng xe VinFast Green';
  return 'Danh mục xe';
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = getCategoryName(slug);
  const description = `Khám phá danh sách ${categoryName} tại VinFast Tiền Giang. Ưu đãi chiết khấu tốt nhất, hỗ trợ trả góp nhanh chóng.`;

  return {
    title: `${categoryName} - VinFast Tiền Giang`,
    description: description,
    openGraph: {
      title: `${categoryName} - VinFast Tiền Giang`,
      description: description,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = getCategoryName(slug);

  const allCars = await carService.getAll({ view: 'public' });
  const filteredCars = allCars.filter(c => {
    if (slug === 'car') return c.category === 'car' || c.category === 'Dòng xe cá nhân';
    if (slug === 'greencar') return c.category === 'greencar' || c.category === 'Dòng xe VinFast Green';
    return true;
  });

  return <CategoryClient cars={filteredCars} categoryName={categoryName} />;
}
