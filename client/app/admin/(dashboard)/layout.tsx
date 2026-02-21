'use client';

import React, { useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  PictureOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, user, _hasHydrated } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // Chờ hydration xong mới kiểm tra, tránh redirect sai khi reload trang
  if (!_hasHydrated) {
    return null; // Đang load session từ localStorage
  }

  if (!isAuthenticated) {
    return null; // Chưa login, sẽ redirect
  }

  return (
    <Layout className="h-screen text-slate-900" style={{ background: '#f0f2f5' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ height: '100vh', position: 'sticky', top: 0, left: 0, overflow: 'auto' }}>
        <div className="demo-logo-vertical p-4 text-white text-xl font-bold text-center">
          VinFast Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={[
            {
              key: '/admin/dashboard',
              icon: <DashboardOutlined />,
              label: <Link href="/admin/dashboard">Dashboard</Link>,
            },
            {
              key: '/admin/cars',
              icon: <CarOutlined />,
              label: <Link href="/admin/cars">Quản lý Xe</Link>,
            },
            {
              key: '/admin/leads',
              icon: <UserOutlined />,
              label: <Link href="/admin/leads">Khách hàng (Leads)</Link>,
            },
            {
              key: '/admin/posts',
              icon: <FileTextOutlined />,
              label: <Link href="/admin/posts">Tin tức / Bài viết</Link>,
            },
            {
              key: '/admin/hero-slides',
              icon: <PictureOutlined />,
              label: <Link href="/admin/hero-slides">Hero Slider</Link>,
            },
            {
              key: '/admin/testimonials',
              icon: <StarOutlined />,
              label: <Link href="/admin/testimonials">Đánh giá KH</Link>,
            },
            {
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: <Link href="/admin/settings">Cài đặt</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ background: '#f0f2f5', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header style={{ padding: 0, background: colorBgContainer, flexShrink: 0 }} className="flex justify-between items-center px-4 shadow-sm z-10">
          <h2 className="text-lg font-semibold ml-4">Xin chào, {user?.email}</h2>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="mr-4"
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', flex: 1, overflow: 'auto' }}>
          <div
            style={{
              padding: 24,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
