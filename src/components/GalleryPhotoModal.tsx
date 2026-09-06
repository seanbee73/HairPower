import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types';
import { Icon } from './Icon';
import { compressAndReadFile, formatBytes, normalizeImageUrl, FALLBACK_GALLERY_IMAGE } from '../utils/imageUtils';

interface GalleryPhotoModalProps {
  isOpen: boolean;
  itemToEdit: GalleryItem | null; // null if adding new photo
  onClose: () => void;
  onSave: (item: Omit<GalleryItem, 'id'>, id?: string) => void;
}

export const HAIR_POWER_GALLERY_PRESETS = [
  {
    title: 'Master Layered Haircut',
    category: 'Cutting' as const,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop',
    description: 'Precision haircut with razor texturizing and blowout by Frank Commisso.',
    heightClass: 'h-auto'
  },
  {
    title: 'Dimensional Golden Balayage',
    category: 'Color' as const,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1780&auto=format&fit=crop',
    description: 'Seamless balayage blending with bright face-framing money piece.',
    heightClass: 'h-80'
  },
  {
    title: 'Bridal Updo Perfection',
    category: 'Bridal' as const,
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1978&auto=format&fit=crop',
    description: 'Romantic bridal updo with soft tendrils and veil securing.',
    heightClass: 'h-64'
  },
  {
    title: 'Full Head Platinum Foil Highlights',
    category: 'Color' as const,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop',
    description: 'Full head foil highlights with custom gloss toner.',
    heightClass: 'h-auto'
  },
  {
    title: "Precision Men's Fade & Style",
    category: 'Grooming' as const,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
    description: 'Classic barber fade, line-up, and textured top finish.',
    heightClass: 'h-72'
  },
  {
    title: 'Sustainable Salon Styling Station',
    category: 'Interior' as const,
    imageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=2059&auto=format&fit=crop',
    description: 'Green Circle certified salon atmosphere at 565 Dundas St, Woodstock.',
    heightClass: 'h-80'
  }
];

export const GalleryPhotoModal: React.FC<GalleryPhotoModalProps> = ({
  isOpen,
  itemToEdit,
  onClose,
  onSave
}) => {
  const [sourceMode, setSourceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  
  const [title, setTitle] = useState(itemToEdit ? itemToEdit.title : '');
  const [category, setCategory] = useState<GalleryItem['category']>(itemToEdit ? itemToEdit.category : 'Cutting');
  const [imageUrl, setImageUrl] = useState(itemToEdit ? itemToEdit.imageUrl : '');
  const [heightClass, setHeightClass] = useState(itemToEdit?.heightClass || 'h-auto');
  const [description, setDescription] = useState(itemToEdit ? itemToEdit.description : '');

  // File upload state
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    originalSize: number;
    compressedSize: number;
    fileName: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if itemToEdit changes
  React.useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setCategory(itemToEdit.category);
      setImageUrl(itemToEdit.imageUrl);
      setHeightClass(itemToEdit.heightClass || 'h-auto');
      setDescription(itemToEdit.description || '');
      setUploadStats(null);
      // If the current URL starts with data: it's an uploaded file
      if (itemToEdit.imageUrl.startsWith('data:')) {
        setSourceMode('upload');
      } else {
        setSourceMode('url');
      }
    } else {
      // New item defaults
      setTitle('');
      setCategory('Cutting');
      setImageUrl('');
      setHeightClass('h-auto');
      setDescription('');
      setUploadStats(null);
      setSourceMode('upload');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    try {
      setIsProcessingFile(true);
      const result = await compressAndReadFile(file);
      setImageUrl(result.dataUrl);
      setUploadStats({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        fileName: result.fileName
      });
      // Pre-fill title if empty
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err: any) {
      alert(err?.message || 'Error loading image file');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('Please upload a photo from your computer or provide an image URL.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title for the photo.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        imageUrl: normalizeImageUrl(imageUrl.trim()),
        heightClass,
        description: description.trim()
      },
      itemToEdit?.id
    );
  };

  return (
    <div
      id="gallery-photo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn text-stone-100"
    >
      <div
        id="gallery-photo-modal-card"
        className="bg-[#1C1917] border border-stone-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A065] text-stone-950 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              <Icon name={itemToEdit ? "solar:pen-2-bold" : "solar:gallery-add-bold"} className="text-xl" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-white font-medium tracking-tight">
                {itemToEdit ? `Edit Photo: ${itemToEdit.title}` : 'Add New Portfolio Photo'}
              </h2>
              <p className="text-xs text-stone-400">
                Upload from your computer or link from web • Instantly updates live gallery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Close dialog"
          >
            <Icon name="solar:close-circle-linear" className="text-2xl" />
          </button>
        </div>

        {/* Modal Body: Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="gallery-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Source Selection Tabs */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold">
                1. Choose Photo Source
              </label>
              <div className="grid grid-cols-3 gap-2 bg-stone-950 p-1.5 rounded-lg border border-stone-800">
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    sourceMode === 'upload'
                      ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon name="solar:upload-track-2-linear" className="text-base" />
                  <span>Upload From Computer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceMode('url')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    sourceMode === 'url'
                      ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon name="solar:link-linear" className="text-base" />
                  <span>Paste Web URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceMode('presets')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    sourceMode === 'presets'
                      ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon name="solar:magic-stick-3-linear" className="text-base" />
                  <span>Salon Presets</span>
                </button>
              </div>
            </div>

            {/* TAB 1: File Upload Box */}
            {sourceMode === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
                  onChange={handleFileChange}
                  className="hidden"
                  id="admin-gallery-file-input"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-[#C5A065] bg-[#C5A065]/10'
                      : 'border-stone-700 hover:border-[#C5A065]/60 bg-stone-950/60 hover:bg-stone-950'
                  }`}
                >
                  {isProcessingFile ? (
                    <div className="flex flex-col items-center gap-2 py-4 text-stone-300">
                      <Icon name="solar:refresh-circle-bold" className="text-3xl text-[#C5A065] animate-spin" />
                      <p className="text-sm font-medium">Optimizing & compressing image for fast web performance...</p>
                    </div>
                  ) : imageUrl && imageUrl.startsWith('data:') ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
                      <img
                        src={imageUrl}
                        alt="Uploaded file preview"
                        className="w-24 h-24 object-cover rounded-lg border border-[#C5A065]/60 shadow-md"
                      />
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 text-[#C5A065] text-xs font-semibold uppercase tracking-wider">
                          <Icon name="solar:check-circle-bold" className="text-base" />
                          <span>Photo Loaded from Device</span>
                        </div>
                        <p className="text-xs text-stone-200 font-medium">
                          {uploadStats?.fileName || 'Custom Device Image'}
                        </p>
                        {uploadStats && (
                          <p className="text-[11px] text-stone-400">
                            Optimized: {formatBytes(uploadStats.originalSize)} ➔{' '}
                            <span className="text-emerald-400 font-semibold">{formatBytes(uploadStats.compressedSize)}</span>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="mt-2 text-xs text-[#C5A065] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Icon name="solar:refresh-linear" />
                          <span>Choose a different photo from computer</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-stone-800 text-[#C5A065] flex items-center justify-center text-2xl shadow-inner">
                        <Icon name="solar:upload-square-bold" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white">Click to browse your computer</span>
                        <span className="text-xs text-stone-400 block">or drag and drop photo file here</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Supports JPEG, PNG, WEBP, HEIC from iPhone, Android, or PC • Automatically compressed for speed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: URL Input Box */}
            {sourceMode === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                    Image Web URL or Project Path (e.g., https://... or /assets/photo.jpg) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or /assets/hair-cut.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded-lg focus:border-[#C5A065] focus:outline-none font-mono text-xs"
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg cursor-pointer"
                        title="Clear URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-lg text-xs text-stone-400 flex items-start gap-2.5">
                  <Icon name="solar:info-circle-linear" className="text-base text-[#C5A065] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>
                      <strong>Vercel & Netlify Tip:</strong> You can paste hosted image URLs (Unsplash, Cloudinary, Imgur) or local paths from your repo (e.g. <code className="text-stone-300 bg-stone-900 px-1 py-0.5 rounded">/assets/photo.jpg</code> placed in <code className="text-stone-300 bg-stone-900 px-1 py-0.5 rounded">public/assets/</code>).
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Auto-normalizes <code className="text-stone-400">public/assets/...</code> to <code className="text-stone-400">/assets/...</code> for Vite compatibility.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Stock Salon Presets */}
            {sourceMode === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-400">
                  Click any high-resolution curated Hair Power salon look below to apply its photo, title, and styling category:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {HAIR_POWER_GALLERY_PRESETS.map((preset, idx) => {
                    const isSelected = imageUrl === preset.imageUrl;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setImageUrl(preset.imageUrl);
                          setTitle(preset.title);
                          setCategory(preset.category);
                          setDescription(preset.description);
                          setHeightClass(preset.heightClass);
                          setUploadStats(null);
                        }}
                        className={`cursor-pointer group relative rounded-lg border overflow-hidden transition-all ${
                          isSelected
                            ? 'border-[#C5A065] ring-2 ring-[#C5A065]/50 scale-[1.02]'
                            : 'border-stone-800 hover:border-stone-600'
                        }`}
                      >
                        <img
                          src={preset.imageUrl}
                          alt={preset.title}
                          className="h-24 w-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="p-1.5 bg-stone-950 text-[11px] text-stone-200 truncate font-medium">
                          {preset.title}
                        </div>
                        <div className="px-1.5 pb-1 bg-stone-950 text-[9px] text-[#C5A065] uppercase font-semibold">
                          {preset.category}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Details Section */}
            <div className="pt-2 border-t border-stone-800 space-y-4">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold">
                2. Photo Details & Portfolio Placement
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Look Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                    Look Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honey Highlights & Loose Curls"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded-lg focus:border-[#C5A065] focus:outline-none"
                  />
                </div>

                {/* Portfolio Category */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                    Category Filter *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded-lg focus:border-[#C5A065] focus:outline-none"
                  >
                    <option value="Cutting">Cutting & Master Blowouts</option>
                    <option value="Color">Color, Balayage & Highlights</option>
                    <option value="Styling">Styling & Silk Press</option>
                    <option value="Bridal">Bridal & Formal Updos</option>
                    <option value="Grooming">Men's Grooming & Fades</option>
                    <option value="Interior">Salon Interior & Atmosphere</option>
                  </select>
                </div>

                {/* Aspect Height */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                    Card Height Ratio
                  </label>
                  <select
                    value={heightClass}
                    onChange={(e) => setHeightClass(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded-lg focus:border-[#C5A065] focus:outline-none"
                  >
                    <option value="h-auto">Auto (Standard 1:1)</option>
                    <option value="h-64">Compact (256px)</option>
                    <option value="h-72">Medium (288px)</option>
                    <option value="h-80">Tall Showcase (320px)</option>
                  </select>
                </div>
              </div>

              {/* Stylist Notes / Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                  Stylist Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Special details about product used, styling technique by Frank Commisso, client before/after, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-sm text-stone-100 rounded-lg focus:border-[#C5A065] focus:outline-none"
                />
              </div>
            </div>

            {/* Real-Time Live Preview Box */}
            {imageUrl && (
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#C5A065] font-semibold flex items-center gap-1.5">
                    <Icon name="solar:eye-bold" /> Live Website Gallery Card Preview
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {imageUrl.startsWith('data:') ? 'Uploaded local file' : 'Web URL link'}
                  </span>
                </div>

                <div className="max-w-sm mx-auto bg-stone-900 border border-stone-700 rounded-lg overflow-hidden shadow-xl">
                  <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                    <img
                      src={normalizeImageUrl(imageUrl)}
                      alt={title || 'Preview'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_GALLERY_IMAGE;
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-stone-950/85 text-[#C5A065] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                      {category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif text-sm text-white font-medium">
                      {title || 'Untitled Look'}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {description || 'No stylist notes provided.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!imageUrl.trim() || !title.trim() || isProcessingFile}
            className="px-6 py-2.5 bg-[#C5A065] hover:bg-[#b58f55] text-stone-950 disabled:opacity-50 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <Icon name="solar:check-circle-bold" className="text-base" />
            <span>{itemToEdit ? 'Save Photo Changes' : 'Add Photo to Live Gallery'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
