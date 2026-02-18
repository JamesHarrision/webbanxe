'use client';

import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import Link from 'next/link';
import {
  PhoneOutlined,
  MailOutlined,
  FacebookFilled,
  YoutubeFilled,
  TikTokFilled, // Antd might not have TikTok, check or use placeholder
  MenuOutlined,
  DownOutlined
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';

const { Header } = Layout;

// Custom TikTok icon if needed, or use a placeholder
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" className="inline-block align-middle">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { key: '/', label: 'Trang chủ' },
    {
      key: '/cars', label: 'Xe VinFast', children: [
        { key: '/cars/vf3', label: 'VinFast VF 3' },
        { key: '/cars/vf5', label: 'VinFast VF 5 Plus' },
        { key: '/cars/vf6', label: 'VinFast VF 6' },
        { key: '/cars/vfe34', label: 'VinFast VF e34' },
        { key: '/cars/vf7', label: 'VinFast VF 7' },
        { key: '/cars/vf8', label: 'VinFast VF 8' },
        { key: '/cars/vf9', label: 'VinFast VF 9' },
      ]
    },
    {
      key: '/scooter', label: 'Xe Máy Điện', children: [ // "Dòng xe VinFast Green" mapped to Scooter/Green for now or just generic
        { key: '/scooter/evo200', label: 'Evo200' },
        { key: '/scooter/feliz', label: 'Feliz S' },
        { key: '/scooter/klara', label: 'Klara S' },
      ]
    },
    { key: '/installment', label: 'Trả góp' },
    { key: '/cost-estimate', label: 'Dự toán chi phí' },
    { key: '/news', label: 'Tin tức' },
    { key: '/contact', label: 'Liên hệ' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#0f4c81] text-white text-sm py-2 px-4 md:px-8 hidden md:flex justify-between items-center">
        <div className="flex gap-6">
          <a href="mailto:thanhphuong129809@gmail.com" className="hover:text-gray-200 flex items-center gap-2">
            <MailOutlined /> thanhphuong129809@gmail.com
          </a>
          <a href="tel:0939508085" className="hover:text-gray-200 flex items-center gap-2">
            <PhoneOutlined /> 0939508085
          </a>
        </div>
        <div className="flex gap-4 text-lg">
          <a href="#" className="hover:text-gray-200"><FacebookFilled /></a>
          <a href="#" className="hover:text-gray-200"><TikTokIcon /></a>
          <a href="#" className="hover:text-gray-200"><YoutubeFilled /></a>
        </div>
      </div>

      {/* Main Header */}
      <Header className="bg-white shadow-md px-4 md:px-8 h-auto sticky top-0 z-40 flex items-center justify-between py-2">
        {/* Logo Section */}
        <Link href="/" className="flex flex-col items-center leading-none mr-8">
          <img
            src="https://vinfasttiengiang.net.vn/wp-content/uploads/2023/04/Logo-VinFast-so-ngang-xanh-duong-1.png"
            alt="VinFast Tiền Giang"
            className="h-12 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex flex-1 justify-end">
          <ul className="flex gap-1 items-center m-0 p-0 list-none">
            {menuItems.map((item) => (
              <li key={item.key} className="relative group">
                {item.children ? (
                  <span className="px-4 py-3 cursor-pointer text-gray-700 font-medium hover:text-[#1890ff] flex items-center gap-1 transition-colors">
                    {item.label} <DownOutlined className="text-xs" />
                  </span>
                ) : (
                  <Link
                    href={item.key}
                    className={`px-4 py-3 block text-gray-700 font-medium hover:text-[#1890ff] transition-colors ${pathname === item.key ? 'text-[#1890ff]' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-md py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border-t-2 border-[#1890ff]">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.key}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#1890ff]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          className="lg:hidden"
          icon={<MenuOutlined className="text-2xl" />}
          onClick={() => setMobileMenuOpen(true)}
        />
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            label: item.children ? item.label : <Link href={item.key} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>,
            children: item.children?.map(child => ({
              key: child.key,
              label: <Link href={child.key} onClick={() => setMobileMenuOpen(false)}>{child.label}</Link>
            }))
          }))}
        />
      </Drawer>
    </>
  );
};

export default PublicHeader;
