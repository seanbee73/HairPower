import React from 'react';
import { Icon } from './Icon';
import { SalonInfo } from '../types';

interface HeroProps {
  onOpenBooking: () => void;
  salonInfo: SalonInfo;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, salonInfo }) => {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop"
          alt={`${salonInfo.name} Eco-Friendly Salon Woodstock`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/60 to-[#C5A065]/20 dark:from-[#0C0A09]/95 dark:via-[#0C0A09]/80 dark:to-[#1A150D]/60 transition-colors duration-500"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
        <div className="max-w-2xl reveal-on-scroll is-visible">
          <p className="text-[#C5A065] text-sm md:text-base uppercase tracking-[0.2em] mb-4 font-semibold">
            {salonInfo.tagline}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
            Look Great, <br />
            <span className="italic text-[#C5A065]">Feel Empowered.</span>
          </h1>
          <p className="text-stone-200 text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg">
            Oxford County's premier eco-friendly beauty salon. Serving Woodstock and surrounding communities with master haircuts, creative color, balayage, and sustainable hair care for over 35 years.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenBooking}
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-[#C5A065] text-white text-sm tracking-wide font-medium hover:bg-[#B08955] hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <Icon name="solar:phone-calling-linear" className="text-lg" />
              <span>Book Appointment</span>
            </button>

            <a
              href={salonInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 border border-white/30 text-white backdrop-blur-sm text-sm tracking-wide font-medium hover:bg-white hover:text-[#1C1917] transition-all duration-300"
            >
              <Icon name="solar:camera-linear" className="text-lg" />
              <span>View Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50 hover:text-white transition-colors"
        aria-label="Scroll to About Section"
      >
        <Icon name="solar:alt-arrow-down-linear" className="text-2xl" />
      </a>
    </section>
  );
};
