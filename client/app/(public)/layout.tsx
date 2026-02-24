import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { settingService } from '@/services/setting.service';
import { carService } from '@/services/car.service';

const PublicLayoutWrapper = async ({ children }: { children: React.ReactNode }) => {
  const [settings, cars] = await Promise.all([
    settingService.getPublicSettings(),
    carService.getAll({ view: 'public' }),
  ]);

  return (
    <PublicLayout settings={settings} cars={cars}>
      {children}
    </PublicLayout>
  );
};

export default PublicLayoutWrapper;
