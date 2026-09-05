import React from 'react';
import { ServiceItem } from '../types';
import { Icon } from './Icon';

interface ServicesProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectService }) => {
  return (
    <section id="services" className="py-24 bg-[#1C1917] dark:bg-[#070605] text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll is-visible">
          <span className="text-[#C5A065] text-xs font-semibold tracking-[0.2em] uppercase">
            Our Menu
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mt-3 tracking-tight">
            Signature Services
          </h2>
          <p className="text-stone-400 text-sm max-w-md mx-auto mt-3 font-light">
            Crafted with artistic care and top-tier products. Click any service to explore included treatments & book.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`group p-8 border border-white/5 dark:border-amber-500/10 bg-white/5 dark:bg-[#12100E] hover:bg-[#C5A065] dark:hover:bg-[#C5A065] cursor-pointer transition-all duration-500 reveal-on-scroll is-visible ${
                index % 3 === 1 ? 'reveal-delay-100' : index % 3 === 2 ? 'reveal-delay-200' : ''
              }`}
            >
              <div className="w-12 h-12 mb-6 text-[#C5A065] group-hover:text-white transition-colors duration-500 flex items-center justify-center">
                <Icon name={service.icon} className="text-5xl" />
              </div>
              
              <div className="flex justify-between items-end mb-3 gap-2">
                <h3 className="text-xl font-serif group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <span className="text-xs opacity-60 group-hover:text-white whitespace-nowrap font-medium">
                  {service.price}
                </span>
              </div>
              
              <p className="text-sm font-light text-stone-400 group-hover:text-white/90 leading-relaxed mb-4">
                {service.description}
              </p>

              <div className="inline-flex items-center gap-1.5 text-xs text-[#C5A065] group-hover:text-white font-medium tracking-wider uppercase pt-2 transition-colors">
                <span>View Treatment Details</span>
                <Icon name="solar:arrow-right-up-linear" className="text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
