'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { insuranceService, Insurance } from '@/services/insurance.service';
import InsuranceForm from '@/components/admin/InsuranceForm';
import { Spin } from 'antd';

const EditInsurancePage = () => {
  const { id } = useParams();
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const data = await insuranceService.getInsurance(Number(id));
        setInsurance(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInsurance();
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
      {insurance && <InsuranceForm initialValues={insurance} isEdit={true} />}
    </div>
  );
};

export default EditInsurancePage;
