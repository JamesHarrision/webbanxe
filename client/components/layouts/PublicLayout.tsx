'use client';

import React, { useEffect, useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';
import { Layout } from 'antd';
import { ModalProvider, useModal } from '@/context/ModalContext';
import LeadModal from '@/components/modals/LeadModal';
import CarLoading from '@/components/ui/CarLoading'; // Import Splash Screen

const { Content } = Layout;

const AutoOpenModalHandler = () => {
  const { openModal } = useModal();

  useEffect(() => {
    // Check if user has already seen the modal in this session
    // Using v2 key to reset for user testing
    const hasSeenModal = sessionStorage.getItem('has_seen_lead_modal_v2');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        openModal({ type: 'QUOTE' }); // Default to Quote or Consultation
        sessionStorage.setItem('has_seen_lead_modal_v2', 'true');
      }, 3000); // 3 seconds wait before opening for better UX testing

      return () => clearTimeout(timer);
    }
  }, [openModal]);

  return null;
};

const PublicLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds for "smooth" feel

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CarLoading />;
  }

  return (
    <Layout className="min-h-screen flex flex-col">
      <PublicHeader />
      <Content className="flex-grow bg-white">
        {children}
      </Content>
      <FloatingContactButtons />
      <PublicFooter />
      <LeadModal />
      <AutoOpenModalHandler />
    </Layout>
  );
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </ModalProvider>
  );
};

export default PublicLayout;
