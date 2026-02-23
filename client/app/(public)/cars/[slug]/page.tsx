import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { carService } from '@/services/car.service';
import CarDetailClient from './CarDetailClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const car = await carService.getByIdOrSlug(slug);
    if (!car) return { title: 'Không tìm thấy xe' };

    // Strip HTML tags for description
    const plainDescription = car.description
      ? car.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
      : `Thông tin chi tiết về xe ${car.name} tại VinFast Tiền Giang.`;

    return {
      title: `${car.name} - VinFast Tiền Giang`,
      description: plainDescription,
      openGraph: {
        title: `${car.name} - VinFast Tiền Giang`,
        description: plainDescription,
        images: car.thumbnail ? [{ url: car.thumbnail }] : [],
      },
    };
  } catch (error) {
    return { title: 'VinFast Tiền Giang' };
  }
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <CarDetailClient slug={slug} />;
}
