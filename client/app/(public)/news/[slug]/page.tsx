import { Metadata } from 'next';
import { postService } from '@/services/post.service';
import NewsDetailClient from './NewsDetailClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await postService.getByIdOrSlug(slug);
    if (!post) return { title: 'Không tìm thấy bài viết' };

    // Strip HTML tags for description
    const plainDescription = post.content
      ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
      : `Đọc bài viết ${post.title} tại VinFast Tiền Giang.`;

    return {
      title: `${post.title} - VinFast Tiền Giang`,
      description: plainDescription,
      openGraph: {
        title: `${post.title} - VinFast Tiền Giang`,
        description: plainDescription,
        images: post.thumbnail ? [{ url: post.thumbnail }] : [],
      },
    };
  } catch (error) {
    return { title: 'VinFast Tiền Giang' };
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <NewsDetailClient slug={slug} />;
}
