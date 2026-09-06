import React from 'react';
import { Icon } from './Icon';
import { SalonInfo } from '../types';

interface AboutProps {
  salonInfo: SalonInfo;
}

export const About: React.FC<AboutProps> = ({ salonInfo }) => {
  return (
    <section id="about" className="py-24 bg-[#FDFBF7] dark:bg-[#0C0A09] transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Container */}
          <div className="relative reveal-on-scroll is-visible order-2 lg:order-1">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#C5A065]/10 dark:bg-[#C5A065]/20 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#1C1917]/5 dark:bg-amber-500/5 z-0"></div>
            
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2070&auto=format&fit=crop"
              alt={`${salonInfo.name} Team at work`}
              className="relative z-10 w-full h-[500px] object-cover shadow-2xl transition-all duration-700 rounded-sm dark:brightness-95"
            />

            {/* Quote Card */}
            <div className="absolute -bottom-8 left-8 md:right-8 md:left-auto max-w-xs p-6 bg-white dark:bg-[#1A1715] shadow-xl z-20 border-l-4 border-[#C5A065] dark:border-[#D4AF37]">
              <p className="font-serif italic text-stone-800 dark:text-stone-200 text-lg">
                {salonInfo.quote}
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="reveal-on-scroll is-visible reveal-delay-200 order-1 lg:order-2">
            <h2 className="text-[#C5A065] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              About Us
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-[#1C1917] dark:text-stone-100 mb-6 tracking-tight">
              The {salonInfo.name} Standard
            </h3>
            <p className="text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-6">
              {salonInfo.aboutText1}
            </p>
            <p className="text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-6">
              {salonInfo.aboutText2}
            </p>

            {/* Green Circle Salon Eco Highlight */}
            <div className="mb-8 p-5 bg-[#C5A065]/10 dark:bg-amber-500/10 border border-[#C5A065]/30 rounded-lg flex items-start gap-4">
              <div className="p-2.5 bg-[#C5A065] text-white rounded-full shrink-0 mt-0.5 shadow-sm">
                <Icon name="solar:leaf-bold" className="text-xl" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1C1917] dark:text-amber-200 uppercase tracking-wider">
                  Certified Sustainable Salon
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  Partnered with Green Circle Salons to divert up to 95% of beauty waste (color foils, tubes, hair clippings & plastics) from landfills and waterways. #makebeautybeautiful
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 bg-[#1C1917] dark:bg-[#26221F] text-[#C5A065] rounded-full flex items-center justify-center font-serif text-xl font-bold border border-[#C5A065]/30">
                {salonInfo.name.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-serif text-[#1C1917] dark:text-stone-100 text-lg">Lead Stylist & Founder</p>
                <p className="text-xs text-[#C5A065] uppercase tracking-wide font-medium">
                  {salonInfo.leadStylist}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
