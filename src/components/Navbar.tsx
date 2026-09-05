import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { SalonInfo } from '../types';

interface NavbarProps {
  onOpenBooking: () => void;
  onToggleSeo: () => void;
  onOpenAdmin?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  salonInfo: SalonInfo;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onToggleSeo,
  onOpenAdmin,
  isDarkMode = false,
  onToggleTheme,
  salonInfo
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Track page scroll for navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = [
    { name: 'About', href: '#about', icon: 'solar:user-heart-linear', subtitle: '35+ Years of Excellence' },
    { name: 'Services & Pricing', href: '#services', icon: 'solar:scissors-linear', subtitle: 'Cuts, Color & Styling' },
    { name: 'Gallery', href: '#gallery', icon: 'solar:gallery-wide-linear', subtitle: 'Real Transformations' },
    { name: 'Reviews', href: '#testimonials', icon: 'solar:star-fall-linear', subtitle: '5-Star Client Praise' },
    { name: 'Contact & Location', href: '#contact', icon: 'solar:map-point-wave-linear', subtitle: '565 Dundas St, Woodstock' },
  ];

  const handleLinkClick = (href: string) => {
    setDrawerOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed w-full top-0 z-40 transition-all duration-300 py-3.5 border-b ${
          isScrolled
            ? 'bg-[#1C1917]/95 backdrop-blur-md shadow-xl border-stone-800/80 py-2.5'
            : 'bg-stone-950/70 backdrop-blur-sm border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Brand Logo */}
          <a
            href="#"
            className="group text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2.5 uppercase"
          >
            <span className="w-8 h-8 rounded bg-[#C5A065] text-stone-950 flex items-center justify-center font-serif text-base font-bold shadow-sm group-hover:scale-105 transition-transform">
              H
            </span>
            <span className="font-medium tracking-wider">{salonInfo.name}</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-stone-300 hover:text-[#C5A065] transition-colors tracking-widest uppercase relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C5A065] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name.split(' & ')[0]}
              </a>
            ))}
          </nav>

          {/* Controls & Actions Group */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 1. Light/Dark Theme Toggle */}
            {onToggleTheme && (
              <button
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 shadow-md ${
                  isDarkMode
                    ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 ring-1 ring-amber-300/50'
                    : 'bg-stone-900/90 text-amber-300 hover:bg-stone-800 border border-amber-500/30'
                }`}
                title={isDarkMode ? "Switch to Light Aesthetic" : "Switch to Midnight Glam Mode"}
                aria-label={isDarkMode ? "Switch to Light Aesthetic" : "Switch to Midnight Glam Mode"}
              >
                <Icon
                  name={isDarkMode ? "solar:sun-bold-duotone" : "solar:moon-stars-bold-duotone"}
                  className={`text-sm ${isDarkMode ? 'text-stone-950' : 'text-amber-400'}`}
                />
                <span className="hidden sm:inline uppercase text-[11px]">
                  {isDarkMode ? "Light" : "Midnight"}
                </span>
              </button>
            )}

            {/* 2. Hamburger Menu Button - Placed right next to the Light/Dark Toggle */}
            <button
              id="header-hamburger-menu-btn"
              onClick={() => setDrawerOpen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 shadow-md border ${
                drawerOpen
                  ? 'bg-[#C5A065] text-stone-950 border-[#C5A065]'
                  : 'bg-stone-900/90 text-stone-200 hover:text-white hover:bg-stone-800 border-stone-700/80 hover:border-[#C5A065]/50'
              }`}
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={drawerOpen}
              title={drawerOpen ? "Close Menu" : "Open Menu"}
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-center relative py-0.5">
                <span
                  className={`block h-0.5 w-3.5 bg-current transition-all duration-300 rounded-full ${
                    drawerOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-3.5 bg-current transition-opacity duration-200 rounded-full ${
                    drawerOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-3.5 bg-current transition-all duration-300 rounded-full ${
                    drawerOpen ? '-rotate-45 -translate-y-1' : ''
                  }`}
                />
              </div>
              <span className="uppercase text-[11px] font-bold tracking-wider">
                {drawerOpen ? "Close" : "Menu"}
              </span>
            </button>

            {/* 3. SEO Inspector button (Desktop only) */}
            <button
              id="header-seo-inspector-btn"
              onClick={onToggleSeo}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-stone-300 bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
              title="View Live SEO Meta Tags & Schema status"
            >
              <Icon name="solar:star-shine-linear" className="text-amber-400 text-xs" />
              <span>SEO</span>
            </button>

            {/* 4. Book Now CTA */}
            <button
              id="header-book-now-btn"
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#C5A065] text-stone-950 text-xs font-bold tracking-wider uppercase hover:bg-[#b58f55] transition-all duration-200 shadow-md rounded-full active:scale-95"
            >
              <span>Book</span>
              <Icon name="solar:calendar-linear" className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Hamburger Navigation Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        ref={drawerRef}
        id="hamburger-navigation-drawer"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out text-stone-100 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A065] text-stone-950 flex items-center justify-center font-serif text-lg font-bold shadow-md">
              H
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-white tracking-tight">
                {salonInfo.name}
              </h3>
              <p className="text-[11px] text-[#C5A065] font-medium tracking-wider uppercase">
                Oxford County • Est. 1989
              </p>
            </div>
          </div>

          <button
            id="drawer-close-btn"
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Close menu"
            aria-label="Close menu"
          >
            <Icon name="solar:close-circle-linear" className="text-2xl" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Booking Action Banner */}
          <div className="p-4 bg-gradient-to-br from-stone-800/90 to-stone-800/40 rounded-xl border border-stone-700/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A065] flex items-center gap-1.5">
                <Icon name="solar:sparkles-bold" className="text-amber-400" />
                Appointments & Inquiries
              </span>
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded text-[10px] font-semibold">
                Accepting Clients
              </span>
            </div>

            <button
              id="drawer-book-appointment-btn"
              onClick={() => {
                setDrawerOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-[#C5A065] hover:bg-[#b58f55] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Icon name="solar:calendar-bold" className="text-base" />
              <span>Book / Request Appointment</span>
            </button>

            <a
              href={`tel:${salonInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white text-xs font-semibold tracking-wider rounded-lg border border-stone-700/80 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="solar:phone-calling-linear" className="text-base text-[#C5A065]" />
              <span>Call Salon: {salonInfo.phone}</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2 mb-2 block">
              Menu Navigation
            </span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="flex items-center justify-between p-3 rounded-lg text-stone-200 hover:text-[#C5A065] hover:bg-stone-800/70 border border-transparent hover:border-stone-700/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-400 group-hover:text-[#C5A065] group-hover:bg-stone-700/70 flex items-center justify-center transition-colors">
                    <Icon name={link.icon} className="text-lg" />
                  </div>
                  <div>
                    <div className="text-sm font-medium tracking-wide">
                      {link.name}
                    </div>
                    <div className="text-[11px] text-stone-400 group-hover:text-stone-300">
                      {link.subtitle}
                    </div>
                  </div>
                </div>
                <Icon
                  name="solar:alt-arrow-right-linear"
                  className="text-stone-500 group-hover:text-[#C5A065] group-hover:translate-x-0.5 transition-all text-base"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Drawer Footer with Social & Copyright */}
        <div className="p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <a
              href="https://www.fresha.com/a/hair-power-woodstock-565-dundas-street-fd7d9361"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#C5A065] transition-colors"
              title="Book on Fresha"
            >
              <Icon name="solar:link-circle-linear" className="text-lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#C5A065] transition-colors"
              title="Instagram"
            >
              <Icon name="solar:camera-linear" className="text-lg" />
            </a>
            <a
              href={`mailto:${salonInfo.email}`}
              className="text-stone-400 hover:text-[#C5A065] transition-colors"
              title="Email Salon"
            >
              <Icon name="solar:letter-linear" className="text-lg" />
            </a>
          </div>

          <span className="text-[11px] text-stone-400 font-serif">
            Hair Power • Woodstock, ON
          </span>
        </div>
      </div>
    </>
  );
};

