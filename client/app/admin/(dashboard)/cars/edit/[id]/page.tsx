'use client';

import React, { useEffect, useState } from 'react';
import CarForm from '@/components/admin/CarForm';
import { carService, Car } from '@/services/car.service';
import { message, Spin } from 'antd';
import { useParams } from 'next/navigation';

const EditCarPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        try {
          const data = await carService.getByIdOrSlug(Number(id));
          setCar(data);
        } catch (error) {
          message.error('Không tìm thấy xe');
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id]);

  if (loading) return <div className="text-center p-12"><Spin size="large" /></div>;
  if (!car) return <div>Không tìm thấy xe</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Xe: {car.name}</h1>
      <CarForm initialValues={car} isEdit={true} />
    </div>
  );
};

export default EditCarPage;
