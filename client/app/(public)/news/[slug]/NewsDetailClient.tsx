'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from 'antd';
import {
  LeftOutlined,
  CalendarOutlined,
  TagOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { postService, Post } from '@/services/post.service';

// ─── Loading Skeleton ────────────────────────────────────
const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <Skeleton.Button active size="small" style={{ width: 200, marginBottom: 24 }} />
    <Skeleton.Image active style={{ width: '100%', height: 400 }} />
    <Skeleton active paragraph={{ rows: 12 }} className="mt-6" />
  </div>
);

// ─── Error State ─────────────────────────────────────────
const DetailError = () => (
  <div className="container mx-auto px-4 py-20 text-center">
    <div className="max-w-md mx-auto">
      <InfoCircleOutlined className="text-6xl text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Không tìm thấy bài viết</h2>
      <p className="text-gray-500 mb-8">
        Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href="/news"
        className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#1a6ab5] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <LeftOutlined />
        Quay lại tin tức
      </Link>
    </div>
  </div>
);

const categoryMap: Record<string, string> = {
  news: 'Tin tức',
  promotion: 'Khuyến mãi',
  review: 'Đánh giá xe',
  guide: 'Hướng dẫn',
};

export default function NewsDetailClient({ slug }: { slug: string }) {
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ['post', slug],
    queryFn: () => postService.getByIdOrSlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError || !post) return <DetailError />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500 gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#0f4c81] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-[#0f4c81] transition-colors">
              Tin tức
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Article ─── */}
      <article className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1.5">
            <CalendarOutlined />
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <TagOutlined />
            {categoryMap[post.category] || post.category}
          </span>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md mb-10">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-600 italic border-l-4 border-[#0f4c81] pl-4 mb-10">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100
            prose prose-sm md:prose-base lg:prose-lg max-w-none prose-img:rounded-xl prose-img:mx-auto rich-text-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#0f4c81] hover:text-[#1a6ab5] font-semibold transition-colors"
          >
            <LeftOutlined />
            Quay lại tất cả bài viết
          </Link>
        </div>
      </article>
    </div>
  );
}
