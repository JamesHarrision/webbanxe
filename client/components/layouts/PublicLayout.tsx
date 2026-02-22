import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import PublicLayoutClient from './PublicLayoutClient';
import { PublicSettings } from '@/services/setting.service';
import { Car } from '@/services/car.service';

interface PublicLayoutProps {
  children: React.ReactNode;
  settings?: PublicSettings;
  cars?: Car[];
}

const PublicLayout = ({ children, settings, cars }: PublicLayoutProps) => {
  return (
    <PublicLayoutClient
      header={<PublicHeader settings={settings} cars={cars} />}
      footer={<PublicFooter settings={settings} cars={cars} />}
    >
      {children}
    </PublicLayoutClient>
  );
};

export default PublicLayout;
