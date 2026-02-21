'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { accessoryService, Accessory } from '@/services/accessory.service';
import AccessoryForm from '@/components/admin/AccessoryForm';
import { Spin } from 'antd';

const EditAccessoryPage = () => {
  const { id } = useParams();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const data = await accessoryService.getAccessory(Number(id));
        setAccessory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccessory();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {accessory && <AccessoryForm initialValues={accessory} isEdit={true} />}
    </div>
  );
};

export default EditAccessoryPage;
