import React, { useState } from 'react';
import { SalonInfo } from '../types';
import { Icon } from './Icon';

interface FooterProps {
  salonInfo: SalonInfo;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ salonInfo, onOpenAdmin }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#1C1917] dark:bg-[#070605] text-stone-400 py-16 border-t border-white/5 dark:border-amber-500/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <a href="#" className="text-2xl font-serif text-white tracking-tight block mb-6 uppercase">
              {salonInfo.name}
            </a>
            <p className="text-sm font-light leading-relaxed mb-6">
              Oxford County's premier eco-friendly beauty salon in Woodstock, Ontario. Look Great, Feel Empowered.
            </p>
            <div className="flex gap-3 text-[#C5A065]">
              <a href={salonInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#C5A065] hover:text-white transition-colors">
                <Icon name="solar:camera-linear" className="text-lg" />
              </a>
              <a href={salonInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#25D366] hover:text-white transition-colors">
                <Icon name="solar:chat-round-dots-linear" className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium uppercase text-xs tracking-widest mb-6">Menu</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#about" className="hover:text-[#C5A065] transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-[#C5A065] transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-[#C5A065] transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-[#C5A065] transition-colors">Book Now</a></li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#C5A065] hover:underline transition-colors flex items-center gap-1 text-xs font-semibold uppercase mt-2"
                  >
                    <Icon name="solar:settings-linear" />
                    <span>Admin</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium uppercase text-xs tracking-widest mb-6">Services</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#services" className="hover:text-[#C5A065] transition-colors">Bridal Styling</a></li>
              <li><a href="#services" className="hover:text-[#C5A065] transition-colors">Wigs & Weaves</a></li>
              <li><a href="#services" className="hover:text-[#C5A065] transition-colors">Natural Hair Care</a></li>
              <li><a href="#services" className="hover:text-[#C5A065] transition-colors">Makeup</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium uppercase text-xs tracking-widest mb-6">Contact</h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-center gap-2">
                <Icon name="solar:phone-calling-linear" className="text-[#C5A065]" />
                <span>{salonInfo.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="solar:map-point-linear" className="text-[#C5A065] mt-1" />
                <span>{salonInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="solar:clock-circle-linear" className="text-[#C5A065]" />
                <span>Mon-Sat: {salonInfo.hoursMonSat}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light">
          <p>© {new Date().getFullYear()} {salonInfo.name}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1917] text-white p-6 max-w-lg w-full rounded border border-white/10 relative">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <Icon name="solar:close-circle-linear" className="text-xl" />
            </button>
            
            <h3 className="font-serif text-xl text-[#C5A065] mb-3">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
            
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              At {salonInfo.name} ({salonInfo.address}), client privacy and satisfaction are paramount. Customer inquiry information submitted through our site is strictly used for booking confirmations and beauty consultation services. We never share your personal phone or email details with third parties.
            </p>

            <button
              onClick={() => setLegalModal(null)}
              className="w-full py-2 bg-[#C5A065] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
