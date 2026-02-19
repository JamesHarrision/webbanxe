'use client';

import React from 'react';
import { Modal } from 'antd';
import LeadForm, { LeadFormData } from '@/components/forms/LeadForm';
import { useModal } from '@/context/ModalContext';

const LeadModal: React.FC = () => {
  const { isOpen, closeModal, modalData } = useModal();

  const handleSuccess = () => {
    // Optional: Add delay or animation before closing?
    // For now, close immediately or let user see success message in form?
    // The form shows a success message. We can close after a short delay or immediately.
    // Let's keep it open for a moment so they see "Success" inside the form, 
    // OR close it and let the global message be enough. 
    // Antd message is global, so closing modal is fine.
    closeModal();
  };

  const initialValues: Partial<LeadFormData> = {
    type: modalData?.type || 'QUOTE',
    carModel: modalData?.carModel,
  };

  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null} // No default footer, the form has the submit button
      destroyOnClose={true}
      centered
      width={600}
      className="lead-modal"
    >
      {/* We pass initialValues from modalData */}
      <LeadForm onSuccess={handleSuccess} initialValues={initialValues} />
    </Modal>
  );
};

export default LeadModal;
