'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ModalData {
  type?: 'TEST_DRIVE' | 'QUOTE' | 'CONSULTATION';
  carModel?: string;
  [key: string]: any;
}

interface ModalContextType {
  isOpen: boolean;
  modalData: ModalData | null;
  openModal: (data?: ModalData) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = useCallback((data?: ModalData) => {
    setModalData(data || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
