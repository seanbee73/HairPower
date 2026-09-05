import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsapp } from './components/FloatingWhatsapp';
import { ServiceModal } from './components/ServiceModal';
import { LightboxModal } from './components/LightboxModal';
import { SeoPanel } from './components/SeoPanel';
import { AdminDashboard } from './components/AdminDashboard';

import { SALON_INFO, SERVICES_DATA, GALLERY_DATA, INITIAL_INQUIRIES } from './data/salonData';
import { SalonInfo, ServiceItem, GalleryItem, CustomerInquiry } from './types';

export default function App() {
  const [salonInfo, setSalonInfo] = useState<SalonInfo>(() => {
    try {
      const saved = localStorage.getItem('hairpower_salon_info') || localStorage.getItem('spencer_salon_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...SALON_INFO,
          ...parsed,
          heroImageUrl: parsed.heroImageUrl || SALON_INFO.heroImageUrl,
          founderImageUrl: parsed.founderImageUrl || SALON_INFO.founderImageUrl
        };
      }
    } catch (e) {
      console.error('Failed to load salon info from localStorage:', e);
    }
    return SALON_INFO;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('hairpower_salon_services') || localStorage.getItem('spencer_salon_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load services from localStorage:', e);
    }
    return SERVICES_DATA;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('hairpower_salon_gallery') || localStorage.getItem('spencer_salon_gallery');
      if (saved) {
        const parsed: GalleryItem[] = JSON.parse(saved);
        return parsed.map(item => {
          if (item.id === 'gallery-5' || item.category === 'Interior' || item.imageUrl.includes('photo-1605980776566-0486c3ac7617')) {
            return { ...item, imageUrl: 'https://ik.imagekit.io/kevfun/IMG-20260905-WA6540.jpg' };
          }
          return item;
        });
      }
    } catch (e) {
      console.error('Failed to load gallery from localStorage:', e);
    }
    return GALLERY_DATA;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('hairpower_customer_inquiries');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse saved inquiries:', err);
    }
    return INITIAL_INQUIRIES;
  });

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('womens-cut');
  const [isSeoOpen, setIsSeoOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Sync state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hairpower_salon_info', JSON.stringify(salonInfo));
    } catch (err) {
      console.error('Failed to save salonInfo to localStorage:', err);
    }
  }, [salonInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('hairpower_salon_services', JSON.stringify(services));
    } catch (err) {
      console.error('Failed to save services to localStorage:', err);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('hairpower_salon_gallery', JSON.stringify(gallery));
    } catch (err) {
      console.error('Failed to save gallery to localStorage:', err);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem('hairpower_customer_inquiries', JSON.stringify(inquiries));
    } catch (err) {
      console.error('Failed to save inquiries to localStorage:', err);
    }
  }, [inquiries]);

  const handleAddInquiry = (newInquiry: CustomerInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const handleResetToDefaults = () => {
    setSalonInfo(SALON_INFO);
    setServices(SERVICES_DATA);
    setGallery(GALLERY_DATA);
    setInquiries(INITIAL_INQUIRIES);
    localStorage.removeItem('hairpower_salon_info');
    localStorage.removeItem('hairpower_salon_services');
    localStorage.removeItem('hairpower_salon_gallery');
    localStorage.removeItem('spencer_salon_info');
    localStorage.removeItem('spencer_salon_services');
    localStorage.removeItem('spencer_salon_gallery');
    localStorage.removeItem('hairpower_customer_inquiries');
  };

  // Midnight Glam Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('spencer_salon_theme');
    return saved ? saved === 'midnight' : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('spencer_salon_theme', 'midnight');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('spencer_salon_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [services, gallery]);

  const scrollToContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookServiceFromModal = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    scrollToContact();
  };

  const handleInquireStyle = (_styleTitle: string) => {
    scrollToContact();
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0C0A09] text-stone-100' : 'bg-[#FDFBF7] text-stone-700'} antialiased selection:bg-[#C5A065] selection:text-white`}>
      {/* Sticky Top Header */}
      <Navbar
        onOpenBooking={scrollToContact}
        onToggleSeo={() => setIsSeoOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        salonInfo={salonInfo}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenBooking={scrollToContact} salonInfo={salonInfo} />
        <About salonInfo={salonInfo} />
        <Services services={services} onSelectService={(service) => setSelectedService(service)} />
        <Gallery gallery={gallery} onSelectGalleryItem={(item) => setSelectedGalleryItem(item)} />
        <Testimonials />
        <ContactSection
          salonInfo={salonInfo}
          services={services}
          preselectedServiceId={preselectedServiceId}
          onAddInquiry={handleAddInquiry}
        />
      </main>

      {/* Footer */}
      <Footer salonInfo={salonInfo} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Action WhatsApp */}
      <FloatingWhatsapp />

      {/* Interactive Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={handleBookServiceFromModal}
      />

      {/* Photo Lightbox Modal */}
      <LightboxModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onInquireStyle={handleInquireStyle}
      />

      {/* Live SEO Optimization & Meta Inspector Panel */}
      <SeoPanel
        isOpen={isSeoOpen}
        onClose={() => setIsSeoOpen(false)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        salonInfo={salonInfo}
        services={services}
        gallery={gallery}
        inquiries={inquiries}
        onUpdateSalonInfo={setSalonInfo}
        onUpdateServices={setServices}
        onUpdateGallery={setGallery}
        onUpdateInquiries={setInquiries}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
