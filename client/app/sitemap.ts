import { MetadataRoute } from 'next';
import { carService } from '@/services/car.service';
import { postService } from '@/services/post.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vinfasttiengiang.net.vn';

  // Fetch data
  let cars: any[] = [];
  let posts: any[] = [];
  try {
    cars = await carService.getAll({ view: 'public' });
    posts = await postService.getAll({ view: 'public' });
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  // Map cars
  const carUrls = (cars || []).map((car) => ({
    url: `${baseUrl}/cars/${car.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Map posts
  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Static routes
  const staticUrls = [
    '',
    '/news',
    '/contact',
    '/installment',
    '/cost-estimate',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return [...staticUrls, ...carUrls, ...postUrls];
}
