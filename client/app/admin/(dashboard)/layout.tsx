'use client';

import React, { useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
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
  const { isAuthenticated, logout, user } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Prevent flash of content
  }

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
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
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: <Link href="/admin/settings">Cài đặt</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between items-center px-4">
          <h2 className="text-lg font-semibold ml-4">Xin chào, {user?.role}</h2>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="mr-4"
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
