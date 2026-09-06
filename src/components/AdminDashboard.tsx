import React, { useState, useEffect } from 'react';
import { SalonInfo, ServiceItem, GalleryItem, CustomerInquiry } from '../types';
import { Icon } from './Icon';
import { InquiriesManager } from './InquiriesManager';
import { AdminAuth } from './AdminAuth';
import { GalleryPhotoModal } from './GalleryPhotoModal';

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

  // --- Data Import JSON State ---
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // --- GitHub / Vercel / Netlify Sync & Code Export Modals ---
  const [showDeployGuideModal, setShowDeployGuideModal] = useState(false);
  const [codeModalData, setCodeModalData] = useState<{ title: string; subtitle: string; code: string; filename: string } | null>(null);
  const [copiedCodeToast, setCopiedCodeToast] = useState(false);

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
  const handleSaveGalleryPhoto = (photoData: Omit<GalleryItem, 'id'>, id?: string) => {
    if (id) {
      // Edit existing photo
      const updated = gallery.map(item => (item.id === id ? { ...photoData, id } : item));
      onUpdateGallery(updated);
      setEditingGalleryItem(null);
      setIsAddingGallery(false);
      showNotification(`Gallery photo "${photoData.title}" updated successfully!`);
    } else {
      // Create new photo
      const newId = 'gallery-' + Date.now();
      const newItem: GalleryItem = {
        ...photoData,
        id: newId
      };
      onUpdateGallery([newItem, ...gallery]);
      setIsAddingGallery(false);
      setEditingGalleryItem(null);
      showNotification(`New photo "${photoData.title}" added to portfolio gallery!`);
    }
  };

  const handleDeleteGalleryItem = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete photo "${title}" from the gallery?`)) {
      const filtered = gallery.filter(item => item.id !== id);
      onUpdateGallery(filtered);
      showNotification(`Photo "${title}" deleted.`);
    }
  };

  // --- Handlers: TypeScript Source Code Generation for GitHub / Vercel / Netlify ---
  const generateSalonDataTsCode = () => {
    return `import { SalonInfo, ServiceItem, GalleryItem, Testimonial } from '../types';

export const SALON_INFO: SalonInfo = ${JSON.stringify(salonInfo, null, 2)};

export const SERVICES_DATA: ServiceItem[] = ${JSON.stringify(services, null, 2)};

export const GALLERY_DATA: GalleryItem[] = ${JSON.stringify(gallery, null, 2)};

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Mary Parent',
    role: 'Woodstock Client (8 Reviews)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    quote: '"FRANK IS AMAZING! MY HAIR HAS NEVER LOOKED SO GREAT AND HEALTHY! HE IS VERY TALENTED AND PROFESSIONAL!"',
    rating: 5,
    date: '4 months ago'
  },
  {
    id: 'test-2',
    name: 'Louise Masters',
    role: 'Mother of the Bride',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
    quote: '"I had such a wonderful experience having my hair done by Frank for my daughter\\'s wedding. He did a phenomenal job with my hair, very stylish, trendy, and it held all day and night. I can\\'t thank him enough!"',
    rating: 5,
    date: '1 year ago'
  },
  {
    id: 'test-3',
    name: 'Krysia Hawke',
    role: 'Local Guide',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    quote: '"I have had my hair cut twice here now and both times have been a lovely experience. I really like that they are a sustainable salon! 10/10 will continue to come here to get my hair cut!"',
    rating: 5,
    date: '3 years ago'
  },
  {
    id: 'test-4',
    name: 'Deb D.',
    role: 'Satisfied Client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    quote: '"Frank understands hair! He is truly talented with his various tools of the trade, and I always leave his shop very happy with the cut I asked for."',
    rating: 5,
    date: '1 month ago'
  }
];

export const INITIAL_INQUIRIES: import('../types').CustomerInquiry[] = [
  {
    id: 'inq-1',
    referenceCode: 'HP-842910',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'booking',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '(519) 788-3412',
    serviceId: 'balayage-color',
    serviceTitle: 'Dimensional Balayage & Foil',
    preferredDate: '2025-05-14',
    preferredTime: '2:00 PM',
    notes: 'Would like subtle golden blonde tones for summer. Hair length is past shoulders.',
    status: 'New'
  },
  {
    id: 'inq-2',
    referenceCode: 'HP-739102',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'booking',
    fullName: 'Robert MacLeod',
    email: 'r.macleod@rogers.com',
    phone: '(519) 539-1184',
    serviceId: 'mens-grooming',
    serviceTitle: "Men's Cut & Grooming",
    preferredDate: '2025-05-12',
    preferredTime: '11:00 AM',
    notes: 'Fade haircut and beard line-up.',
    status: 'Confirmed',
    staffNotes: 'Confirmed via phone on May 8. Frank assigned.'
  }
];
`;
  };

  const generateGalleryDataOnlyCode = () => {
    return `export const GALLERY_DATA: GalleryItem[] = ${JSON.stringify(gallery, null, 2)};`;
  };

  const handleDownloadSalonDataTs = () => {
    const code = generateSalonDataTsCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salonData.ts';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded salonData.ts file ready for your src/data/ folder!');
  };

  const handleOpenCodeModal = (type: 'all' | 'gallery') => {
    if (type === 'gallery') {
      setCodeModalData({
        title: 'Export GALLERY_DATA Code',
        subtitle: 'Copy and replace the GALLERY_DATA constant in src/data/salonData.ts, then git commit & push.',
        code: generateGalleryDataOnlyCode(),
        filename: 'src/data/salonData.ts (GALLERY_DATA section)'
      });
    } else {
      setCodeModalData({
        title: 'Complete salonData.ts Source Code',
        subtitle: 'Copy and replace the full contents of src/data/salonData.ts in your project repository.',
        code: generateSalonDataTsCode(),
        filename: 'src/data/salonData.ts'
      });
    }
  };

  const handleCopyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeToast(true);
    setTimeout(() => setCopiedCodeToast(false), 3000);
    showNotification('Code copied to clipboard!');
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
              
              {/* GitHub / Vercel / Netlify Sync Notice Card */}
              <div className="p-4 bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 border border-[#C5A065]/40 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#C5A065]/10 rounded border border-[#C5A065]/30 text-[#C5A065] shrink-0 mt-0.5">
                    <Icon name="solar:cloud-upload-linear" className="text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-100">
                        Deploying Updated Photos to Vercel or Netlify?
                      </h4>
                      <span className="text-[10px] font-bold bg-[#C5A065] text-stone-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Important
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Changes made in the browser are saved to local storage. To display on your live Vercel/Netlify site for all visitors, export the code into <code className="text-stone-300 bg-stone-950 px-1 py-0.5 rounded">src/data/salonData.ts</code> and push to GitHub.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenCodeModal('gallery')}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export GALLERY_DATA for salonData.ts"
                  >
                    <Icon name="solar:copy-linear" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSalonDataTs}
                    className="px-3 py-2 bg-[#C5A065] hover:bg-[#B08955] text-stone-950 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                    title="Download updated salonData.ts file"
                  >
                    <Icon name="solar:download-linear" />
                    <span>Download salonData.ts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeployGuideModal(true)}
                    className="px-2.5 py-2 bg-stone-900 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white text-xs rounded transition-colors cursor-pointer"
                    title="Read deployment instructions"
                  >
                    <Icon name="solar:question-circle-linear" className="text-base" />
                  </button>
                </div>
              </div>

              {/* Category Filter & Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900/60 p-4 border border-stone-800 rounded-lg">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {['all', 'Cutting', 'Color', 'Styling', 'Bridal', 'Grooming', 'Interior'].map(cat => {
                    const count = cat === 'all' ? gallery.length : gallery.filter(g => g.category.toLowerCase() === cat.toLowerCase() || g.category.includes(cat)).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setGalleryCategoryFilter(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          galleryCategoryFilter === cat
                            ? 'bg-[#C5A065] text-stone-950 font-bold shadow-sm'
                            : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-700/80'
                        }`}
                      >
                        <span>{cat === 'all' ? 'All Portfolio' : cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${galleryCategoryFilter === cat ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-900 text-stone-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  id="admin-add-gallery-photo-btn"
                  onClick={() => {
                    setEditingGalleryItem(null);
                    setIsAddingGallery(true);
                  }}
                  className="px-4 py-2.5 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 shadow-md hover:shadow-lg w-full md:w-auto justify-center cursor-pointer"
                >
                  <Icon name="solar:gallery-add-linear" className="text-base" />
                  <span>Add Photo to Gallery</span>
                </button>
              </div>

              {/* Gallery Grid Display */}
              {filteredGallery.length === 0 ? (
                <div className="p-12 text-center bg-stone-900/40 border border-stone-800 rounded-lg space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-stone-800 flex items-center justify-center text-[#C5A065]">
                    <Icon name="solar:gallery-linear" className="text-2xl" />
                  </div>
                  <h4 className="text-stone-200 font-medium">No photos found in this category</h4>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Add new looks from your computer or using image URLs to showcase your best styling work.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGalleryItem(null);
                      setIsAddingGallery(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A065] text-stone-950 text-xs font-semibold rounded uppercase tracking-wider hover:bg-[#B08955] transition-colors"
                  >
                    <Icon name="solar:add-circle-linear" />
                    <span>Upload First Photo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredGallery.map(item => (
                    <div
                      key={item.id}
                      className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-[#C5A065]/50 transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        <div className="relative h-52 w-full bg-stone-950 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2002&auto=format&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />
                          <span className="absolute top-2.5 right-2.5 bg-stone-950/85 text-[#C5A065] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs border border-stone-700/50 shadow">
                            {item.category}
                          </span>
                          {item.imageUrl.startsWith('data:image') && (
                            <span className="absolute top-2.5 left-2.5 bg-emerald-950/85 text-emerald-300 border border-emerald-800/50 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                              <Icon name="solar:upload-track-2-linear" className="text-[10px]" />
                              <span>Local Upload</span>
                            </span>
                          )}
                        </div>

                        <div className="p-4 space-y-1.5">
                          <h4 className="font-serif text-base text-white font-medium group-hover:text-[#C5A065] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                            {item.description || 'No description added.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 border-t border-stone-800/80 bg-stone-950/40 flex justify-end gap-2">
                        <button
                          type="button"
                          id={`edit-gallery-${item.id}`}
                          onClick={() => {
                            setEditingGalleryItem(item);
                            setIsAddingGallery(false);
                          }}
                          className="px-3 py-1.5 bg-stone-800 text-stone-200 hover:bg-[#C5A065] hover:text-stone-950 text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit this gallery photo (change photo, url, or description)"
                        >
                          <Icon name="solar:pen-2-linear" className="text-sm" />
                          <span>Edit Photo</span>
                        </button>
                        <button
                          type="button"
                          id={`delete-gallery-${item.id}`}
                          onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                          className="px-3 py-1.5 bg-red-950/30 border border-red-900/40 text-red-300 hover:bg-red-900 hover:text-white text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer"
                          title="Delete photo from gallery"
                        >
                          <Icon name="solar:trash-bin-trash-linear" className="text-sm" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: BACKUP & EXPORT */}
          {activeTab === 'data' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              
              {/* Vercel & Netlify GitHub Code Sync Card */}
              <div className="p-6 bg-gradient-to-br from-stone-900 via-[#1C1917] to-stone-900 border border-[#C5A065]/50 rounded-lg space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#C5A065]/10 rounded border border-[#C5A065]/30 text-[#C5A065] shrink-0">
                      <Icon name="solar:server-square-linear" className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                        <span>Deploy to Vercel & Netlify (GitHub Source Code Sync)</span>
                      </h3>
                      <p className="text-xs text-stone-400 mt-1">
                        Export your live browser edits directly into your repository source code so that all visitors on Vercel and Netlify see your updated gallery photos and salon information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenCodeModal('all')}
                    className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-[#C5A065] rounded-lg text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#C5A065] text-xs font-bold uppercase tracking-wider mb-1">
                      <Icon name="solar:copy-linear" className="text-base" />
                      <span>Copy Full Code</span>
                    </div>
                    <p className="text-[11px] text-stone-400 group-hover:text-stone-300">
                      View and copy complete <code className="text-stone-300">src/data/salonData.ts</code>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSalonDataTs}
                    className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-[#C5A065] rounded-lg text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#C5A065] text-xs font-bold uppercase tracking-wider mb-1">
                      <Icon name="solar:download-minimalistic-linear" className="text-base" />
                      <span>Download File</span>
                    </div>
                    <p className="text-[11px] text-stone-400 group-hover:text-stone-300">
                      Download <code className="text-stone-300">salonData.ts</code> ready to drop into <code className="text-stone-300">src/data/</code>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeployGuideModal(true)}
                    className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-[#C5A065] rounded-lg text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-stone-200 text-xs font-bold uppercase tracking-wider mb-1">
                      <Icon name="solar:book-linear" className="text-base text-[#C5A065]" />
                      <span>Step-by-Step Guide</span>
                    </div>
                    <p className="text-[11px] text-stone-400 group-hover:text-stone-300">
                      Learn how images, GitHub, and Vercel/Netlify builds work
                    </p>
                  </button>
                </div>
              </div>

              {/* Backup / Export Box */}
              <div className="p-6 bg-stone-900/60 border border-stone-800 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="font-serif text-lg text-[#C5A065] font-medium flex items-center gap-2">
                      <Icon name="solar:file-download-linear" />
                      <span>Export Data Backup (JSON)</span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Download a raw JSON snapshot of your current salon info, menu, and gallery.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow cursor-pointer"
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
                  className="w-full py-2.5 bg-stone-800 text-stone-200 hover:bg-[#C5A065] hover:text-stone-950 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
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
                  className="px-4 py-2 bg-red-900/80 text-white hover:bg-red-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
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

      {/* Modern Add / Edit Gallery Photo Modal */}
      <GalleryPhotoModal
        isOpen={isAddingGallery || !!editingGalleryItem}
        itemToEdit={editingGalleryItem}
        onClose={() => {
          setIsAddingGallery(false);
          setEditingGalleryItem(null);
        }}
        onSave={handleSaveGalleryPhoto}
      />

      {/* GitHub & Vercel / Netlify Deployment Guide Modal */}
      {showDeployGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full bg-stone-900 border border-[#C5A065]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C5A065]/10 rounded border border-[#C5A065]/30 text-[#C5A065]">
                  <Icon name="solar:cloud-upload-bold" className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-medium">
                    Why Images on Vercel & Netlify Need Code Sync
                  </h3>
                  <p className="text-xs text-stone-400">
                    How data flows between your browser, GitHub, and your hosting provider
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeployGuideModal(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Icon name="solar:close-circle-linear" className="text-2xl" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs text-stone-300 leading-relaxed">
              <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-lg space-y-2">
                <h4 className="font-semibold text-[#C5A065] text-sm flex items-center gap-2">
                  <Icon name="solar:lightbulb-bolt-bold" />
                  <span>The Root Cause</span>
                </h4>
                <p>
                  When you edit or upload photos using this admin panel, your browser saves them in <strong>localStorage</strong> on your current device. When Vercel or Netlify builds your website, it builds directly from the source code file at <code className="text-[#C5A065] bg-stone-900 px-1 py-0.5 rounded font-mono">src/data/salonData.ts</code>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                  3 Easy Steps to Sync Images to Vercel & Netlify:
                </h4>

                <div className="p-3 bg-stone-950/40 border border-stone-800 rounded-lg space-y-1.5">
                  <span className="font-bold text-[#C5A065] text-xs">Step 1. Export Updated Code</span>
                  <p className="text-stone-400">
                    Click <strong>"Download salonData.ts"</strong> or <strong>"Copy Full Code"</strong> in the Backup & Export tab.
                  </p>
                </div>

                <div className="p-3 bg-stone-950/40 border border-stone-800 rounded-lg space-y-1.5">
                  <span className="font-bold text-[#C5A065] text-xs">Step 2. Place Local Images in the Public Folder (Optional)</span>
                  <p className="text-stone-400">
                    If you used custom image files from your computer, put the image files inside your repository's <code className="text-stone-200 font-mono">public/assets/</code> directory (e.g. <code className="text-stone-200 font-mono">public/assets/new-look.jpg</code>), and reference them as <code className="text-stone-200 font-mono">/assets/new-look.jpg</code> in the code. Or use direct hosted URLs (Unsplash, Cloudinary, Imgur).
                  </p>
                </div>

                <div className="p-3 bg-stone-950/40 border border-stone-800 rounded-lg space-y-1.5">
                  <span className="font-bold text-[#C5A065] text-xs">Step 3. Commit & Push to GitHub</span>
                  <p className="text-stone-400">
                    Replace your project's <code className="text-stone-200 font-mono">src/data/salonData.ts</code> with the exported code. Run <code className="text-stone-200 font-mono bg-stone-900 px-1 py-0.5 rounded">git add . && git commit -m "Update salon gallery" && git push</code>. Vercel and Netlify will automatically rebuild and your new images will appear instantly for all visitors!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeployGuideModal(false);
                  handleOpenCodeModal('all');
                }}
                className="px-4 py-2 bg-[#C5A065] hover:bg-[#B08955] text-stone-950 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Copy salonData.ts Code Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Export Modal */}
      {codeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-3xl w-full bg-stone-900 border border-[#C5A065]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-[#C5A065] font-medium">
                  {codeModalData.title}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Target file: <code className="text-stone-300 font-mono bg-stone-900 px-1 py-0.5 rounded">{codeModalData.filename}</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCodeModalData(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Icon name="solar:close-circle-linear" className="text-2xl" />
              </button>
            </div>

            <div className="p-4 bg-stone-950/40 border-b border-stone-800 text-xs text-stone-300 flex items-center justify-between">
              <span>{codeModalData.subtitle}</span>
              <button
                type="button"
                onClick={() => handleCopyCodeToClipboard(codeModalData.code)}
                className="px-3 py-1.5 bg-[#C5A065] hover:bg-[#B08955] text-stone-950 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow"
              >
                <Icon name={copiedCodeToast ? "solar:check-circle-bold" : "solar:copy-linear"} />
                <span>{copiedCodeToast ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-stone-950">
              <pre className="text-xs font-mono text-stone-300 whitespace-pre overflow-x-auto p-4 bg-stone-900/80 border border-stone-800 rounded-lg">
                {codeModalData.code}
              </pre>
            </div>

            <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs">
              <span className="text-stone-500">
                Ready to paste into your local editor
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCodeToClipboard(codeModalData.code)}
                  className="px-4 py-2 bg-[#C5A065] hover:bg-[#B08955] text-stone-950 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow"
                >
                  {copiedCodeToast ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                </button>
                <button
                  type="button"
                  onClick={() => setCodeModalData(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
