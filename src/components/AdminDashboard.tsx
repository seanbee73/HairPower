import React, { useState, useEffect } from 'react';
import { SalonInfo, ServiceItem, GalleryItem, CustomerInquiry } from '../types';
import { Icon } from './Icon';
import { InquiriesManager } from './InquiriesManager';
import { AdminAuth } from './AdminAuth';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  salonInfo: SalonInfo;
  onUpdateSalonInfo: (updated: SalonInfo) => void;
  services: ServiceItem[];
  onUpdateServices: (updated: ServiceItem[]) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (updated: GalleryItem[]) => void;
  inquiries: CustomerInquiry[];
  onUpdateInquiries: (updated: CustomerInquiry[]) => void;
  onResetToDefaults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  salonInfo,
  onUpdateSalonInfo,
  services,
  onUpdateServices,
  gallery,
  onUpdateGallery,
  inquiries,
  onUpdateInquiries,
  onResetToDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'info' | 'services' | 'gallery' | 'data'>('inquiries');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hairpower_admin_auth');
      if (saved) return true;
      const session = sessionStorage.getItem('hairpower_admin_session');
      if (session) return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const [adminUserEmail, setAdminUserEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hairpower_admin_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || 'admin@hairpower.ca';
      }
      const session = sessionStorage.getItem('hairpower_admin_session');
      if (session) return session;
    } catch (e) {
      console.error(e);
    }
    return 'admin@hairpower.ca';
  });

  // Count new inquiries
  const newInquiriesCount = (inquiries || []).filter(i => i.status === 'New').length;

  const handleLogout = () => {
    try {
      localStorage.removeItem('hairpower_admin_auth');
      sessionStorage.removeItem('hairpower_admin_session');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    showNotification('Logged out from staff portal');
  };

  // --- Salon Info Form State ---
  const [infoForm, setInfoForm] = useState<SalonInfo>(salonInfo);

  // Sync infoForm if salonInfo prop updates
  useEffect(() => {
    setInfoForm(salonInfo);
  }, [salonInfo]);

  // --- Services Edit/Add State ---
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');

  const [newServiceForm, setNewServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    price: 'from GH₵ 200',
    startingAmount: 200,
    description: '',
    details: ['Personalized consultation', 'Premium scalp treatment'],
    icon: 'solar:scissors-linear',
    category: 'cutting'
  });

  const [newDetailInput, setNewDetailInput] = useState('');

  // --- Gallery Edit/Add State ---
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');

  const [newGalleryForm, setNewGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'Styling',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop',
    description: '',
    heightClass: 'h-auto'
  });

  // --- Data Import JSON State ---
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Icon preset suggestions
  const ICON_PRESETS = [
    { label: 'Scissors', name: 'solar:scissors-linear' },
    { label: 'Sparkles', name: 'solar:star-shine-linear' },
    { label: 'Heart', name: 'solar:heart-linear' },
    { label: 'Cosmetics', name: 'solar:cosmetic-linear' },
    { label: 'Layers/Wigs', name: 'solar:layers-linear' },
    { label: 'Massage', name: 'solar:user-hand-up-linear' },
    { label: 'Crown', name: 'solar:crown-minimalistic-linear' },
    { label: 'Sparkle Star', name: 'solar:magic-stick-3-linear' },
    { label: 'Comb/Brush', name: 'solar:tuning-linear' }
  ];

  // Curated Unsplash Beauty Preset Images
  const GALLERY_IMAGE_PRESETS = [
    {
      title: 'Goddess Knotless Braids',
      category: 'Braids & Twists' as const,
      imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2002&auto=format&fit=crop',
      description: 'Neat & lightweight goddess braids with curls.'
    },
    {
      title: 'Hollywood Silk Press',
      category: 'Styling' as const,
      imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1978&auto=format&fit=crop',
      description: 'High-shine glass finish silk press.'
    },
    {
      title: 'Bronzed Bridal Glam',
      category: 'Glam Makeup' as const,
      imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop',
      description: 'Sweatproof wedding makeup with soft glow.'
    },
    {
      title: 'Honey Blonde Balayage',
      category: 'Color' as const,
      imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop',
      description: 'Seamless dimensional blonde highlights.'
    },
    {
      title: 'Luxury Styling Station',
      category: 'Interior' as const,
      imageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=2059&auto=format&fit=crop',
      description: 'Clean luxury interior at Blohum Road.'
    },
    {
      title: 'Crown Bridal Updo',
      category: 'Bridal' as const,
      imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1780&auto=format&fit=crop',
      description: 'Classic wedding updo with veil.'
    }
  ];

  // --- Handlers: Salon Info ---
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSalonInfo(infoForm);
    showNotification('Salon Information updated successfully!');
  };

  // --- Handlers: Services ---
  const handleSaveServiceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.map(s => s.id === editingService.id ? editingService : s);
    onUpdateServices(updated);
    setEditingService(null);
    showNotification(`Service "${editingService.title}" updated!`);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'service-' + Date.now();
    const itemToAdd: ServiceItem = {
      ...newServiceForm,
      id: newId
    };
    onUpdateServices([...services, itemToAdd]);
    setIsAddingService(false);
    setNewServiceForm({
      title: '',
      price: 'from GH₵ 200',
      startingAmount: 200,
      description: '',
      details: ['Personalized consultation'],
      icon: 'solar:scissors-linear',
      category: 'cutting'
    });
    showNotification('New service added to menu!');
  };

  const handleDeleteService = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const filtered = services.filter(s => s.id !== id);
      onUpdateServices(filtered);
      showNotification(`Deleted "${title}".`);
    }
  };

  const handleAddDetailToNewService = () => {
    if (!newDetailInput.trim()) return;
    setNewServiceForm({
      ...newServiceForm,
      details: [...newServiceForm.details, newDetailInput.trim()]
    });
    setNewDetailInput('');
  };

  const handleRemoveDetailFromNewService = (index: number) => {
    setNewServiceForm({
      ...newServiceForm,
      details: newServiceForm.details.filter((_, idx) => idx !== index)
    });
  };

  // --- Handlers: Gallery ---
  const handleSaveGalleryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    const updated = gallery.map(item => item.id === editingGalleryItem.id ? editingGalleryItem : item);
    onUpdateGallery(updated);
    setEditingGalleryItem(null);
    showNotification(`Gallery image "${editingGalleryItem.title}" updated!`);
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'gallery-' + Date.now();
    const itemToAdd: GalleryItem = {
      ...newGalleryForm,
      id: newId
    };
    onUpdateGallery([itemToAdd, ...gallery]);
    setIsAddingGallery(false);
    setNewGalleryForm({
      title: '',
      category: 'Styling',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop',
      description: '',
      heightClass: 'h-auto'
    });
    showNotification('New image added to portfolio gallery!');
  };

  const handleDeleteGalleryItem = (id: string, title: string) => {
    if (window.confirm(`Delete photo "${title}" from gallery?`)) {
      const filtered = gallery.filter(item => item.id !== id);
      onUpdateGallery(filtered);
      showNotification(`Photo "${title}" deleted.`);
    }
  };

  // --- Handlers: JSON Backup ---
  const handleExportJson = () => {
    const fullData = {
      salonInfo,
      services,
      gallery
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hair-power-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported complete salon data backup JSON!');
  };

  const handleImportJson = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.salonInfo && Array.isArray(parsed.services) && Array.isArray(parsed.gallery)) {
        onUpdateSalonInfo(parsed.salonInfo);
        onUpdateServices(parsed.services);
        onUpdateGallery(parsed.gallery);
        setImportJsonText('');
        showNotification('Data successfully imported and applied!');
      } else {
        setImportError('Invalid JSON structure. Must contain salonInfo, services, and gallery fields.');
      }
    } catch (err: any) {
      setImportError('JSON Syntax Error: ' + err.message);
    }
  };

  // Filtered Services
  const filteredServices = services.filter(s => {
    const matchesCat = serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
    const matchesSearch = s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                          s.description.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Gallery
  const filteredGallery = gallery.filter(item => {
    return galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter;
  });

  if (!isOpen) return null;

  // Unauthenticated Staff Sign-In Modal View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
        {/* Toast Notification */}
        {saveToast && (
          <div className="fixed top-4 right-4 z-50 bg-[#C5A065] text-stone-950 px-4 py-2.5 rounded shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
            <Icon name="solar:check-circle-bold" className="text-lg" />
            <span>{saveToast}</span>
          </div>
        )}
        <AdminAuth
          onLoginSuccess={(email) => {
            setIsAuthenticated(true);
            setAdminUserEmail(email);
            showNotification(`Signed in as ${email}`);
          }}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/90 backdrop-blur-md overflow-hidden text-stone-100">
      <div id="admin-dashboard-panel" className="bg-[#1C1917] border border-stone-800 rounded-lg shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col relative overflow-hidden">
        
        {/* Toast Notification */}
        {saveToast && (
          <div className="absolute top-4 right-4 z-50 bg-[#C5A065] text-stone-950 px-4 py-2.5 rounded shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
            <Icon name="solar:check-circle-bold" className="text-lg" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-stone-900/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A065] text-stone-950 rounded flex items-center justify-center font-serif text-xl font-bold shadow-sm">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg md:text-xl text-white font-medium tracking-tight">
                  Hair Power Admin Portal
                </h2>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-wider rounded">
                  Live Management
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-stone-800 text-stone-300 text-[11px] rounded border border-stone-700 font-mono">
                  <Icon name="solar:user-circle-linear" className="text-xs text-[#C5A065]" />
                  <span>{adminUserEmail}</span>
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Track customer inquiries, trigger email summaries, and update salon pricing in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 border border-stone-700"
              title="Log out from staff portal"
            >
              <Icon name="solar:logout-2-linear" className="text-sm" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 rounded shadow-sm"
            >
              <Icon name="solar:eye-linear" className="text-base" />
              <span>View Site</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
              title="Close Admin Panel"
            >
              <Icon name="solar:close-circle-linear" className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-stone-900 border-b border-stone-800 px-6 flex flex-wrap gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-[#C5A065] text-[#C5A065] bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Icon name="solar:inbox-linear" className="text-base" />
            <span>1. Inquiries & Bookings</span>
            {newInquiriesCount > 0 ? (
              <span className="px-1.5 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full animate-pulse">
                {newInquiriesCount} New
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-stone-800 text-stone-400 text-[10px] font-bold rounded-full">
                {inquiries?.length || 0}
              </span>
            )}
          </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'border-[#C5A065] text-[#C5A065] bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon name="solar:shop-linear" className="text-base" />
                <span>2. Salon Info & Hours</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'border-[#C5A065] text-[#C5A065] bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon name="solar:scissors-linear" className="text-base" />
                <span>3. Services & Menu ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'border-[#C5A065] text-[#C5A065] bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon name="solar:gallery-wide-linear" className="text-base" />
                <span>4. Portfolio Gallery ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('data')}
                className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'data'
                    ? 'border-[#C5A065] text-[#C5A065] bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon name="solar:settings-linear" className="text-base" />
                <span>5. Backup & Export</span>
              </button>
            </div>

            {/* Tab Body Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 0: INQUIRIES & LEADS MANAGEMENT */}
              {activeTab === 'inquiries' && (
                <InquiriesManager
                  inquiries={inquiries || []}
                  onUpdateInquiries={onUpdateInquiries}
                  onShowNotification={showNotification}
                  salonInfo={salonInfo}
                  services={services}
                />
              )}

              {/* TAB 1: SALON INFO FORM */}
              {activeTab === 'info' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              <form onSubmit={handleSaveInfo} className="space-y-6">
                
                {/* Basic Identity Box */}
                <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                  <h3 className="font-serif text-lg text-[#C5A065] flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Icon name="solar:info-circle-linear" />
                    <span>Brand Identity & Headlines</span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Salon Name
                      </label>
                      <input
                        type="text"
                        required
                        value={infoForm.name}
                        onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Lead Stylist / Founder Name
                      </label>
                      <input
                        type="text"
                        value={infoForm.leadStylist}
                        onChange={e => setInfoForm({ ...infoForm, leadStylist: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Main Hero Tagline
                      </label>
                      <input
                        type="text"
                        value={infoForm.tagline}
                        onChange={e => setInfoForm({ ...infoForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Sub Tagline
                      </label>
                      <input
                        type="text"
                        value={infoForm.taglineSub}
                        onChange={e => setInfoForm({ ...infoForm, taglineSub: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Motto / Quote
                    </label>
                    <input
                      type="text"
                      value={infoForm.quote}
                      onChange={e => setInfoForm({ ...infoForm, quote: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none italic"
                    />
                  </div>
                </div>

                {/* Contact & Hours Box */}
                <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                  <h3 className="font-serif text-lg text-[#C5A065] flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Icon name="solar:phone-calling-linear" />
                    <span>Location, Contact & Operating Hours</span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Physical Address
                      </label>
                      <input
                        type="text"
                        value={infoForm.address}
                        onChange={e => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Display Phone Number
                      </label>
                      <input
                        type="text"
                        value={infoForm.phone}
                        onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Raw Phone (digits only for tel: link)
                      </label>
                      <input
                        type="text"
                        value={infoForm.phoneRaw}
                        onChange={e => setInfoForm({ ...infoForm, phoneRaw: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Mon - Sat Opening Hours
                      </label>
                      <input
                        type="text"
                        value={infoForm.hoursMonSat}
                        onChange={e => setInfoForm({ ...infoForm, hoursMonSat: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Sun Opening Hours
                      </label>
                      <input
                        type="text"
                        value={infoForm.hoursSun}
                        onChange={e => setInfoForm({ ...infoForm, hoursSun: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        WhatsApp Link URL
                      </label>
                      <input
                        type="text"
                        value={infoForm.whatsappUrl}
                        onChange={e => setInfoForm({ ...infoForm, whatsappUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Instagram Profile URL
                      </label>
                      <input
                        type="text"
                        value={infoForm.instagramUrl}
                        onChange={e => setInfoForm({ ...infoForm, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* About Paragraphs */}
                <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                  <h3 className="font-serif text-lg text-[#C5A065] flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Icon name="solar:document-text-linear" />
                    <span>About Us Story Paragraphs</span>
                  </h3>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      About Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={infoForm.aboutText1}
                      onChange={e => setInfoForm({ ...infoForm, aboutText1: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      About Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={infoForm.aboutText2}
                      onChange={e => setInfoForm({ ...infoForm, aboutText2: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#C5A065] text-stone-950 font-semibold text-xs uppercase tracking-widest hover:bg-[#B08955] transition-all rounded shadow-md flex items-center justify-center gap-2"
                  >
                    <Icon name="solar:check-read-linear" className="text-lg" />
                    <span>Save All Salon Information</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SERVICES & PRICING MENU */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Service Actions & Filter Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900/60 p-4 border border-stone-800 rounded">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Icon name="solar:magnifer-linear" className="absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={e => setServiceSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 text-xs text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  <select
                    value={serviceCategoryFilter}
                    onChange={e => setServiceCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-stone-950 border border-stone-700 text-xs text-stone-200 rounded focus:border-[#C5A065] focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="cutting">Haircuts & Styling</option>
                    <option value="coloring">Coloring</option>
                    <option value="bridal">Bridal & Events</option>
                    <option value="makeup">Makeup</option>
                    <option value="extensions">Extensions & Wigs</option>
                    <option value="treatment">Hair Treatment</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddingService(true)}
                  className="px-4 py-2 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Icon name="solar:add-circle-linear" className="text-base" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Modal or Form to Add New Service */}
              {isAddingService && (
                <form onSubmit={handleCreateService} className="p-6 bg-stone-900 border border-[#C5A065]/50 rounded space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:add-square-linear" />
                      <span>Create New Menu Service</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingService(false)}
                      className="text-stone-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Silk Press & Scalp Detox"
                        value={newServiceForm.title}
                        onChange={e => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Display Price *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. from GH₵ 250"
                        value={newServiceForm.price}
                        onChange={e => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Starting Amount (GH₵)
                      </label>
                      <input
                        type="number"
                        required
                        value={newServiceForm.startingAmount}
                        onChange={e => setNewServiceForm({ ...newServiceForm, startingAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Category
                      </label>
                      <select
                        value={newServiceForm.category}
                        onChange={e => setNewServiceForm({ ...newServiceForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      >
                        <option value="cutting">Cutting & Styling</option>
                        <option value="coloring">Coloring</option>
                        <option value="bridal">Bridal & Events</option>
                        <option value="makeup">Makeup Artistry</option>
                        <option value="extensions">Extensions & Wigs</option>
                        <option value="treatment">Hair Treatment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Icon (Solar Name or Preset)
                      </label>
                      <input
                        type="text"
                        value={newServiceForm.icon}
                        onChange={e => setNewServiceForm({ ...newServiceForm, icon: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {ICON_PRESETS.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setNewServiceForm({ ...newServiceForm, icon: preset.name })}
                            className={`px-2 py-0.5 text-[10px] rounded border flex items-center gap-1 transition-colors ${
                              newServiceForm.icon === preset.name
                                ? 'bg-[#C5A065] text-stone-950 border-[#C5A065]'
                                : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            <Icon name={preset.name} className="text-xs" />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview of what client receives during appointment..."
                      value={newServiceForm.description}
                      onChange={e => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  {/* Included Treatment Steps List */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Treatment Details Included
                    </label>
                    <div className="space-y-2 mb-2">
                      {newServiceForm.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded border border-stone-800 text-xs text-stone-300">
                          <Icon name="solar:check-read-linear" className="text-[#C5A065]" />
                          <span className="flex-1">{detail}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetailFromNewService(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Icon name="solar:trash-bin-trash-linear" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add step detail e.g. 'Deep steam conditioning'"
                        value={newDetailInput}
                        onChange={e => setNewDetailInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-700 text-xs text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddDetailToNewService}
                        className="px-3 py-1.5 bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-medium rounded"
                      >
                        + Add Step
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingService(false)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold uppercase rounded hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#C5A065] text-stone-950 text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#B08955] shadow"
                    >
                      Save Service
                    </button>
                  </div>
                </form>
              )}

              {/* Service Editing Modal */}
              {editingService && (
                <form onSubmit={handleSaveServiceEdit} className="p-6 bg-stone-900 border border-[#C5A065] rounded space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:pen-2-linear" />
                      <span>Edit Service: {editingService.title}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="text-stone-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Display Price
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.price}
                        onChange={e => setEditingService({ ...editingService, price: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Starting Amount (GH₵)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingService.startingAmount}
                        onChange={e => setEditingService({ ...editingService, startingAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Category
                      </label>
                      <select
                        value={editingService.category}
                        onChange={e => setEditingService({ ...editingService, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      >
                        <option value="cutting">Cutting & Styling</option>
                        <option value="coloring">Coloring</option>
                        <option value="bridal">Bridal & Events</option>
                        <option value="makeup">Makeup Artistry</option>
                        <option value="extensions">Extensions & Wigs</option>
                        <option value="treatment">Hair Treatment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Icon Name
                      </label>
                      <input
                        type="text"
                        value={editingService.icon}
                        onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingService.description}
                      onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold uppercase rounded hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#C5A065] text-stone-950 text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#B08955]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Services List Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    className="p-5 bg-stone-900/80 border border-stone-800 rounded hover:border-stone-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#C5A065]/10 text-[#C5A065] rounded flex items-center justify-center">
                            <Icon name={service.icon} className="text-2xl" />
                          </div>
                          <div>
                            <h4 className="font-serif text-base text-white font-medium">
                              {service.title}
                            </h4>
                            <span className="text-[10px] text-[#C5A065] font-mono uppercase tracking-wider bg-[#C5A065]/10 px-2 py-0.5 rounded">
                              {service.category}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-stone-200 bg-stone-800 px-2.5 py-1 rounded">
                          {service.price}
                        </span>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed mb-3">
                        {service.description}
                      </p>

                      <div className="space-y-1 mb-4">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          Included Details ({service.details.length}):
                        </p>
                        <ul className="text-xs text-stone-300 list-disc list-inside space-y-0.5">
                          {service.details.slice(0, 3).map((d, idx) => (
                            <li key={idx} className="truncate">{d}</li>
                          ))}
                          {service.details.length > 3 && (
                            <li className="text-[10px] text-stone-500 italic">
                              + {service.details.length - 3} more treatment steps
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="px-3 py-1.5 bg-stone-800 text-stone-200 hover:bg-[#C5A065] hover:text-stone-950 text-xs font-medium rounded transition-colors flex items-center gap-1"
                      >
                        <Icon name="solar:pen-2-linear" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        className="px-3 py-1.5 bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900/80 hover:text-white text-xs font-medium rounded transition-colors flex items-center gap-1"
                      >
                        <Icon name="solar:trash-bin-trash-linear" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: GALLERY & PORTFOLIO IMAGES */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Category Filter & Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900/60 p-4 border border-stone-800 rounded">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  {['all', 'Styling', 'Braids & Twists', 'Glam Makeup', 'Color', 'Interior', 'Bridal'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider transition-all whitespace-nowrap ${
                        galleryCategoryFilter === cat
                          ? 'bg-[#C5A065] text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {cat === 'all' ? 'All Portfolio' : cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddingGallery(true)}
                  className="px-4 py-2 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Icon name="solar:add-circle-linear" className="text-base" />
                  <span>Add Gallery Image</span>
                </button>
              </div>

              {/* Add Gallery Form */}
              {isAddingGallery && (
                <form onSubmit={handleCreateGalleryItem} className="p-6 bg-stone-900 border border-[#C5A065]/50 rounded space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:gallery-add-linear" />
                      <span>Add Image to Salon Gallery</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingGallery(false)}
                      className="text-stone-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Preset Quick Chooser */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                      Or Choose From High-Res Salon Stock Presets:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {GALLERY_IMAGE_PRESETS.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setNewGalleryForm({
                            title: preset.title,
                            category: preset.category,
                            imageUrl: preset.imageUrl,
                            description: preset.description,
                            heightClass: 'h-72'
                          })}
                          className="cursor-pointer group relative rounded border border-stone-800 overflow-hidden hover:border-[#C5A065] transition-all"
                        >
                          <img src={preset.imageUrl} alt={preset.title} className="h-20 w-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="p-1 bg-stone-950 text-[10px] text-stone-300 truncate font-medium">
                            {preset.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Look Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Honey Highlights & Loose Curls"
                        value={newGalleryForm.title}
                        onChange={e => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Category
                      </label>
                      <select
                        value={newGalleryForm.category}
                        onChange={e => setNewGalleryForm({ ...newGalleryForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      >
                        <option value="Styling">Styling</option>
                        <option value="Braids & Twists">Braids & Twists</option>
                        <option value="Glam Makeup">Glam Makeup</option>
                        <option value="Color">Color</option>
                        <option value="Interior">Interior</option>
                        <option value="Bridal">Bridal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Card Height Aspect
                      </label>
                      <select
                        value={newGalleryForm.heightClass || 'h-auto'}
                        onChange={e => setNewGalleryForm({ ...newGalleryForm, heightClass: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      >
                        <option value="h-auto">Auto Standard</option>
                        <option value="h-64">Compact (256px)</option>
                        <option value="h-72">Medium (288px)</option>
                        <option value="h-80">Tall (320px)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Image URL (Unsplash or Direct Link) *
                    </label>
                    <input
                      type="url"
                      required
                      value={newGalleryForm.imageUrl}
                      onChange={e => setNewGalleryForm({ ...newGalleryForm, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Styling Notes / Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special details about product used, client hair texture, etc."
                      value={newGalleryForm.description}
                      onChange={e => setNewGalleryForm({ ...newGalleryForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  {/* Thumbnail Preview */}
                  {newGalleryForm.imageUrl && (
                    <div className="flex items-center gap-4 bg-stone-950 p-3 rounded border border-stone-800">
                      <img
                        src={newGalleryForm.imageUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border border-stone-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop';
                        }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-stone-200">Image Live Preview</p>
                        <p className="text-[10px] text-stone-500">{newGalleryForm.title || 'Untitled'}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGallery(false)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold uppercase rounded hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#C5A065] text-stone-950 text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#B08955] shadow"
                    >
                      Add Photo to Gallery
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Gallery Item Modal */}
              {editingGalleryItem && (
                <form onSubmit={handleSaveGalleryEdit} className="p-6 bg-stone-900 border border-[#C5A065] rounded space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:pen-2-linear" />
                      <span>Edit Gallery Photo: {editingGalleryItem.title}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingGalleryItem(null)}
                      className="text-stone-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingGalleryItem.title}
                        onChange={e => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Category
                      </label>
                      <select
                        value={editingGalleryItem.category}
                        onChange={e => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                      >
                        <option value="Styling">Styling</option>
                        <option value="Braids & Twists">Braids & Twists</option>
                        <option value="Glam Makeup">Glam Makeup</option>
                        <option value="Color">Color</option>
                        <option value="Interior">Interior</option>
                        <option value="Bridal">Bridal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        required
                        value={editingGalleryItem.imageUrl}
                        onChange={e => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingGalleryItem.description}
                      onChange={e => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingGalleryItem(null)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold uppercase rounded hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#C5A065] text-stone-950 text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#B08955]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Gallery Grid Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredGallery.map(item => (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 rounded overflow-hidden hover:border-stone-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-stone-950 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 right-2 bg-stone-950/80 text-[#C5A065] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-serif text-base text-white font-medium mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          {item.description || 'No description added.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border-t border-stone-800 bg-stone-900/50 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingGalleryItem(item)}
                        className="px-3 py-1.5 bg-stone-800 text-stone-200 hover:bg-[#C5A065] hover:text-stone-950 text-xs font-medium rounded transition-colors flex items-center gap-1"
                      >
                        <Icon name="solar:pen-2-linear" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                        className="px-3 py-1.5 bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900/80 hover:text-white text-xs font-medium rounded transition-colors flex items-center gap-1"
                      >
                        <Icon name="solar:trash-bin-trash-linear" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: BACKUP & EXPORT */}
          {activeTab === 'data' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              
              {/* Backup / Export Box */}
              <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:file-download-linear" />
                      <span>Export Data Backup</span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Download a JSON file of your current salon info, menu, and gallery.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow"
                  >
                    <Icon name="solar:download-minimalistic-linear" className="text-base" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              {/* Import Box */}
              <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2 border-b border-stone-800 pb-3">
                  <Icon name="solar:file-check-linear" />
                  <span>Import JSON Configuration</span>
                </h3>

                <p className="text-xs text-stone-400">
                  Paste JSON content below to bulk update salon information, services, and gallery.
                </p>

                {importError && (
                  <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded">
                    {importError}
                  </div>
                )}

                <textarea
                  rows={6}
                  placeholder={`{\n  "salonInfo": { ... },\n  "services": [ ... ],\n  "gallery": [ ... ]\n}`}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-xs text-stone-200 font-mono rounded focus:border-[#C5A065] focus:outline-none"
                />

                <button
                  onClick={handleImportJson}
                  disabled={!importJsonText.trim()}
                  className="w-full py-2.5 bg-stone-800 text-stone-200 hover:bg-[#C5A065] hover:text-stone-950 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Apply Imported JSON
                </button>
              </div>

              {/* Factory Reset Box */}
              <div className="p-6 bg-red-950/20 border border-red-900/40 rounded space-y-3">
                <h3 className="font-serif text-base text-red-400 font-medium flex items-center gap-2">
                  <Icon name="solar:danger-triangle-linear" />
                  <span>Reset to Factory Defaults</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Restore all salon text, services menu, and gallery photos to original default Hair Power template values.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all salon information, services, and gallery images to original defaults?')) {
                      onResetToDefaults();
                      showNotification('All salon data reset to factory defaults.');
                    }
                  }}
                  className="px-4 py-2 bg-red-900/80 text-white hover:bg-red-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Reset Factory Defaults
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-3 bg-stone-900 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
          <span>Hair Power Owner Panel • Local Storage Persisted</span>
          <span>Changes take effect immediately on live site</span>
        </div>

      </div>
    </div>
  );
};
