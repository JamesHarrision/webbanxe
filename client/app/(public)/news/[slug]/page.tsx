import { Metadata } from 'next';
import { postService } from '@/services/post.service';
import NewsDetailClient from './NewsDetailClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await postService.getByIdOrSlug(slug);
    if (!post) return { title: 'Không tìm thấy bài viết' };

    // Strip HTML tags for description and clean up whitespace
    const plainDescription = post.content
      ? post.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().substring(0, 160) + '...'
      : `Đọc bài viết ${post.title} tại VinFast Tiền Giang.`;

    const title = `${post.title} - VinFast Tiền Giang`;

    return {
      title,
      description: plainDescription,
      openGraph: {
        title,
        description: plainDescription,
        url: `https://vinfasttiengiang.net.vn/news/${post.slug}`,
        siteName: 'VinFast Tiền Giang',
        type: 'article',
        publishedTime: post.createdAt,
        images: post.thumbnail ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: plainDescription,
        images: post.thumbnail ? [post.thumbnail] : [],
      },
    };
  } catch (error) {
    return { title: 'Tin tức - VinFast Tiền Giang' };
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <NewsDetailClient slug={slug} />;
}
