import React from 'react';
import { ServiceItem } from '../types';
import { Icon } from './Icon';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (serviceId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onBookService }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white max-w-xl w-full p-6 md:p-8 rounded-sm shadow-2xl relative border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors p-1"
          aria-label="Close modal"
        >
          <Icon name="solar:close-circle-linear" className="text-2xl" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#1C1917] text-[#C5A065] rounded flex items-center justify-center flex-shrink-0">
            <Icon name={service.icon} className="text-2xl" />
          </div>
          <div>
            <span className="text-[10px] text-[#C5A065] font-semibold uppercase tracking-widest">
              Signature Service
            </span>
            <h3 className="text-2xl font-serif text-[#1C1917]">{service.title}</h3>
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-4 rounded border border-stone-100 mb-6 flex justify-between items-center">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">Pricing</span>
          <span className="font-serif text-lg text-[#C5A065] font-bold">{service.price}</span>
        </div>

        <p className="text-stone-600 text-sm font-light mb-6 leading-relaxed">
          {service.description}
        </p>

        <div className="mb-6">
          <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-3">
            What's Included in Your Session:
          </h4>
          <ul className="space-y-2">
            {service.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                <Icon name="solar:check-read-linear" className="text-[#C5A065] text-base flex-shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
          <button
            onClick={() => {
              onBookService(service.id);
              onClose();
            }}
            className="flex-1 py-3 bg-[#C5A065] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#B08955] transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Icon name="solar:calendar-linear" className="text-base" />
            <span>Select & Book Service</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-stone-100 text-stone-700 text-xs font-medium hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
