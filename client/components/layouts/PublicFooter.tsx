'use client';

import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const PublicFooter: React.FC = () => {
  return (
    <Footer className="text-center bg-gray-50 text-gray-600 py-8">
      <div className="container mx-auto">
        <p className="mb-2">VinFast Tiền Giang - Đại lý ủy quyền chính thức của VinFast</p>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </Footer>
  );
};

export default PublicFooter;
