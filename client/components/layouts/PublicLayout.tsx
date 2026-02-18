'use client';

import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';
import { Layout } from 'antd';

const { Content } = Layout;

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <PublicHeader />
      <Content className="flex-grow bg-white">
        {children}
      </Content>
      <FloatingContactButtons />
      <PublicFooter />
    </Layout>
  );
};

export default PublicLayout;
