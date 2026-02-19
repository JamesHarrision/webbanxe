'use client';

import React from 'react';
import CarForm from '@/components/admin/CarForm';

const CreateCarPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thêm Xe Mới</h1>
      <CarForm />
    </div>
  );
};

export default CreateCarPage;
