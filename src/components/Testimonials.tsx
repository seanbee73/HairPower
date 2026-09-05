import React from 'react';
import { TESTIMONIALS_DATA } from '../data/salonData';
import { Icon } from './Icon';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-[#FDFBF7] to-[#F5F5F4] dark:from-[#0C0A09] dark:to-[#141210] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll is-visible">
          <span className="text-[#C5A065] text-xs font-semibold tracking-[0.2em] uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mt-2 text-[#1C1917] dark:text-stone-100 tracking-tight">
            Client Love
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto mt-2 font-light">
            Real reviews from 1,090+ satisfied clients across Woodstock and Oxford County.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#181513] p-8 shadow-sm dark:shadow-2xl hover:shadow-lg transition-all duration-300 reveal-on-scroll is-visible border border-stone-100 dark:border-stone-800/90 flex flex-col justify-between ${
                idx === 1 ? 'reveal-delay-100' : idx === 2 ? 'reveal-delay-200' : ''
              }`}
            >
              <div>
                {/* Gold Stars */}
                <div className="flex text-[#C5A065] mb-4 gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Icon key={i} name="solar:star-bold" className="text-lg" />
                  ))}
                </div>

                <p className="text-stone-600 dark:text-stone-300 font-light italic mb-6 leading-relaxed">
                  {item.quote}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                <div className="w-10 h-10 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] dark:text-stone-100 text-sm">{item.name}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
