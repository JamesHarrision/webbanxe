'use client';

import React, { useEffect } from 'react';
import { useModal } from '@/context/ModalContext';

export default function HomeClient() {
  const { openModal } = useModal();

  useEffect(() => {
    // Auto open modal after 5 seconds for first time users in this session
    // The main logic is already in PublicLayoutClient, but page.tsx had its own timer.
    // We'll keep this one too if it's meant to be additional or more specific.
    const timer = setTimeout(() => {
      openModal({ type: 'QUOTE' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [openModal]);

  return null;
}
