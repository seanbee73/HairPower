import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { compressAndReadFile, formatBytes } from '../utils/imageUtils';

export interface PhotoPreset {
  label: string;
  url: string;
  description: string;
}

interface PhotoFieldControllerProps {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  value: string;
  defaultValue: string;
  aspectRatio?: 'video' | 'portrait' | 'square';
  presets: PhotoPreset[];
  onChange: (url: string) => void;
  onNotification?: (msg: string) => void;
}

export const PhotoFieldController: React.FC<PhotoFieldControllerProps> = ({
  id,
  title,
  subtitle,
  badge,
  value,
  defaultValue,
  aspectRatio = 'video',
  presets,
  onChange,
  onNotification
}) => {
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileStats, setFileStats] = useState<{ name: string; orig: number; comp: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, or AVIF).');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await compressAndReadFile(file, 1920, 1920, 0.85);
      onChange(result.dataUrl);
      setUrlInput(result.dataUrl);
      setFileStats({
        name: result.fileName,
        orig: result.originalSize,
        comp: result.compressedSize
      });
      if (onNotification) {
        onNotification(`Image uploaded and optimized (${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)})`);
      }
    } catch (err: any) {
      alert('Failed to process image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
      setFileStats(null);
      if (onNotification) {
        onNotification(`Photo updated via URL`);
      }
    }
  };

  const handleSelectPreset = (presetUrl: string, label: string) => {
    onChange(presetUrl);
    setUrlInput(presetUrl);
    setFileStats(null);
    if (onNotification) {
      onNotification(`Selected preset: ${label}`);
    }
  };

  const handleResetToDefault = () => {
    onChange(defaultValue);
    setUrlInput(defaultValue);
    setFileStats(null);
    if (onNotification) {
      onNotification(`Reset to default image`);
    }
  };

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[4/5] max-h-64'
      : aspectRatio === 'square'
      ? 'aspect-square max-h-64'
      : 'aspect-video max-h-60';

  return (
    <div className="p-5 bg-stone-900/80 border border-stone-800 rounded-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base text-stone-100 font-medium">
              {title}
            </h4>
            {badge && (
              <span className="px-2 py-0.5 bg-[#C5A065]/10 text-[#C5A065] border border-[#C5A065]/30 text-[10px] font-semibold uppercase tracking-wider rounded">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60"
          title="Restore factory default photo"
        >
          <Icon name="solar:restart-linear" className="text-xs" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Main Grid: Preview & Controls */}
      <div className="grid md:grid-cols-12 gap-5 items-start">
        {/* Left: Live Visual Preview */}
        <div className="md:col-span-5 flex flex-col space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Live Preview
          </span>
          
          <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shadow-inner group`}>
            {value ? (
              <img
                src={value}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultValue;
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 p-4 text-center">
                <Icon name="solar:gallery-wide-linear" className="text-3xl mb-1 text-stone-700" />
                <span className="text-xs">No image selected</span>
              </div>
            )}

            {/* Hover Indicator */}
            <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center pointer-events-none">
              <span className="text-xs text-white bg-stone-900/90 px-3 py-1.5 rounded-full border border-stone-700 shadow-md flex items-center gap-1.5">
                <Icon name="solar:eye-linear" />
                <span>Live View Target</span>
              </span>
            </div>

            {value && value.startsWith('data:') && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono rounded">
                Custom Upload
              </span>
            )}
          </div>

          {fileStats && (
            <div className="text-[11px] text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded flex items-center justify-between">
              <span className="truncate max-w-[140px] font-mono">{fileStats.name}</span>
              <span className="font-mono">
                {formatBytes(fileStats.comp)} <span className="text-stone-400 line-through text-[10px]">{formatBytes(fileStats.orig)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: Source Mode Controls */}
        <div className="md:col-span-7 space-y-3">
          {/* Mode Switcher */}
          <div className="flex bg-stone-950 p-1 rounded-md border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition-all flex items-center justify-center gap-1.5 ${
                mode === 'upload'
                  ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon name="solar:upload-track-2-linear" className="text-sm" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition-all flex items-center justify-center gap-1.5 ${
                mode === 'url'
                  ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon name="solar:link-linear" className="text-sm" />
              <span>Paste URL</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition-all flex items-center justify-center gap-1.5 ${
                mode === 'presets'
                  ? 'bg-[#C5A065] text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon name="solar:star-shine-linear" className="text-sm" />
              <span>Presets ({presets.length})</span>
            </button>
          </div>

          {/* Mode 1: File Upload */}
          {mode === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`file-upload-${id}`}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#C5A065] bg-[#C5A065]/10'
                    : 'border-stone-700 hover:border-stone-500 bg-stone-950/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-stone-800 text-[#C5A065] flex items-center justify-center">
                    <Icon name={isProcessing ? "solar:refresh-circle-linear" : "solar:upload-track-2-linear"} className={`text-xl ${isProcessing ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-200 font-medium">
                      {isProcessing ? 'Optimizing image...' : 'Click to browse or drop photo here'}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Supports JPG, PNG, WebP • Auto-compressed for high speed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: URL Input */}
          {mode === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                  External Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://ik.imagekit.io/... or https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-stone-950 border border-stone-700 text-xs text-stone-100 rounded focus:border-[#C5A065] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUrlApply}
                    className="px-4 py-2 bg-[#C5A065] text-stone-950 hover:bg-[#B08955] text-xs font-semibold rounded transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Icon name="solar:check-circle-bold" />
                    <span>Apply</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Works with ImageKit, Unsplash, Cloudinary, Imgur, or direct CDN links.
                </p>
              </div>
            </div>
          )}

          {/* Mode 3: Presets */}
          {mode === 'presets' && (
            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.label)}
                  className={`group relative text-left p-2 rounded border transition-all flex items-center gap-2.5 overflow-hidden ${
                    value === preset.url
                      ? 'border-[#C5A065] bg-[#C5A065]/15'
                      : 'border-stone-800 bg-stone-950 hover:border-stone-700 hover:bg-stone-900/60'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 object-cover rounded shrink-0 border border-stone-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-stone-200 truncate group-hover:text-amber-400">
                      {preset.label}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {preset.description}
                    </p>
                  </div>
                  {value === preset.url && (
                    <Icon name="solar:check-circle-bold" className="text-[#C5A065] text-base shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
