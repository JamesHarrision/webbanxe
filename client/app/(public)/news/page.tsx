'use client';

import React from 'react';
export const dynamic = 'force-dynamic';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from 'antd';
import { CalendarOutlined, ArrowRightOutlined, ReadOutlined } from '@ant-design/icons';
import { postService, Post } from '@/services/post.service';

// ─── Loading Skeleton ────────────────────────────────────
const NewsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton active paragraph={{ rows: 1 }} className="mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <Skeleton.Image active style={{ width: '100%', height: 200 }} />
          <div className="p-5">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const categoryMap: Record<string, { label: string; color: string }> = {
  news: { label: 'Tin tức', color: 'bg-blue-500' },
  promotion: { label: 'Khuyến mãi', color: 'bg-red-500' },
  review: { label: 'Đánh giá xe', color: 'bg-purple-500' },
  guide: { label: 'Hướng dẫn', color: 'bg-cyan-500' },
};

export default function NewsPage() {
  const {
    data: posts,
    isLoading,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => postService.getAll(),
  });

  if (isLoading) return <NewsSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a6ab5] text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">
            <ReadOutlined className="mr-3" />
            Tin tức & Khuyến mãi
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về VinFast, chương trình khuyến mãi và hướng dẫn hữu ích.
          </p>
        </div>
      </div>

      {/* ─── Post Grid ─── */}
      <div className="container mx-auto px-4 py-10 lg:py-14">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <ReadOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const catInfo = categoryMap[post.category] || { label: post.category, color: 'bg-gray-500' };
              return (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
                    transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.thumbnail || '/placeholder.svg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Category badge */}
                    <div className={`absolute top-3 left-3 ${catInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {catInfo.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0f4c81] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <CalendarOutlined />
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                          : ''}
                      </span>
                      <span className="text-[#0f4c81] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc thêm <ArrowRightOutlined />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
