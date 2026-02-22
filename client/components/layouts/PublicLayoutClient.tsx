'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { ModalProvider, useModal } from '@/context/ModalContext';
import LeadModal from '@/components/modals/LeadModal';
import CarLoading from '@/components/ui/CarLoading';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';

const { Content } = Layout;

const AutoOpenModalHandler = () => {
  const { openModal } = useModal();

  useEffect(() => {
    // Check if user has already seen the modal in this session
    const hasSeenModal = sessionStorage.getItem('has_seen_lead_modal_v2');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        openModal({ type: 'QUOTE' });
        sessionStorage.setItem('has_seen_lead_modal_v2', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [openModal]);

  return null;
};

const PublicLayoutWrapper = ({
  children,
  header,
  footer
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CarLoading />;
  }

  return (
    <Layout className="min-h-screen flex flex-col bg-white">
      {header}
      <Content className="flex-grow bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </Content>
      <FloatingContactButtons />
      {footer}
      <LeadModal />
      <AutoOpenModalHandler />
    </Layout>
  );
};

export default function PublicLayoutClient({
  children,
  header,
  footer
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <PublicLayoutWrapper header={header} footer={footer}>
        {children}
      </PublicLayoutWrapper>
    </ModalProvider>
  );
}
