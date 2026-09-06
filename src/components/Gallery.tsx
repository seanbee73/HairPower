import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Icon } from './Icon';
import { normalizeImageUrl, FALLBACK_GALLERY_IMAGE } from '../utils/imageUtils';

interface GalleryProps {
  gallery: GalleryItem[];
  onSelectGalleryItem: (item: GalleryItem) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ gallery, onSelectGalleryItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Cutting', 'Styling', 'Color', 'Bridal', 'Grooming', 'Interior'];

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#FDFBF7] dark:bg-[#0C0A09] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 reveal-on-scroll is-visible gap-4">
          <div>
            <span className="text-[#C5A065] text-xs font-semibold tracking-[0.2em] uppercase">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mt-3 text-[#1C1917] dark:text-stone-100 tracking-tight">
              Our Recent Work
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] dark:text-stone-200 border-b border-[#C5A065] pb-1 hover:text-[#C5A065] dark:hover:text-[#C5A065] transition-colors"
          >
            <span>Follow on Instagram</span>
            <Icon name="solar:arrow-right-up-linear" />
          </a>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-stone-200 dark:border-stone-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1C1917] dark:bg-[#C5A065] text-[#C5A065] dark:text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Columns Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectGalleryItem(item)}
              className={`break-inside-avoid relative group overflow-hidden cursor-pointer rounded-sm shadow-md reveal-on-scroll is-visible bg-stone-900 ${
                idx % 3 === 1 ? 'reveal-delay-100' : idx % 3 === 2 ? 'reveal-delay-200' : ''
              }`}
            >
              <img
                src={normalizeImageUrl(item.imageUrl)}
                alt={item.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== FALLBACK_GALLERY_IMAGE) {
                    target.src = FALLBACK_GALLERY_IMAGE;
                  }
                }}
                className={`w-full ${item.heightClass || 'h-auto'} object-cover transition-transform duration-700 group-hover:scale-110`}
              />
              <div className="absolute inset-0 bg-[#1C1917]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-xs text-[#C5A065] uppercase tracking-widest font-semibold mb-1">
                  {item.category}
                </span>
                <p className="text-white font-serif text-xl tracking-wide">
                  {item.title}
                </p>
                <span className="mt-3 text-xs text-stone-200 border border-white/30 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Icon name="solar:eye-linear" className="text-sm" /> View Look
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
