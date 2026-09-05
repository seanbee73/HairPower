import React from 'react';
import { GalleryItem } from '../types';
import { Icon } from './Icon';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onInquireStyle: (title: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose, onInquireStyle }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-4xl w-full bg-[#1C1917] rounded-sm overflow-hidden shadow-2xl relative border border-white/10 flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
          aria-label="Close photo preview"
        >
          <Icon name="solar:close-circle-linear" className="text-2xl" />
        </button>

        {/* Photo view */}
        <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[480px]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>

        {/* Details view */}
        <div className="md:w-2/5 p-6 md:p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#C5A065] font-semibold uppercase tracking-widest block mb-2">
              {item.category} Look
            </span>
            <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
            <p className="text-stone-300 text-sm font-light leading-relaxed mb-6">
              {item.description}
            </p>

            <div className="p-4 bg-white/5 border border-white/10 rounded mb-6">
              <p className="text-xs text-stone-400">Location:</p>
              <p className="text-xs text-stone-200 font-medium">Hair Power Salon, 565 Dundas St, Woodstock, ON</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onInquireStyle(item.title);
                onClose();
              }}
              className="w-full py-3 bg-[#C5A065] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B08955] transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="solar:chat-round-dots-linear" className="text-base" />
              <span>Inquire About This Style</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 bg-white/10 text-stone-300 text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
