import React from 'react';
import { SALON_INFO } from '../data/salonData';
import { Icon } from './Icon';

export const FloatingWhatsapp: React.FC = () => {
  return (
    <a
      href={SALON_INFO.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp with Hair Power"
    >
      <Icon name="solar:chat-round-dots-linear" className="text-2xl" />
      <span className="absolute right-full mr-4 bg-white text-[#1C1917] px-3 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-stone-100">
        Chat on WhatsApp
      </span>
    </a>
  );
};
