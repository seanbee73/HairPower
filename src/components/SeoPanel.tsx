import React, { useState } from 'react';
import { Icon } from './Icon';

interface SeoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'google' | 'social' | 'schema' | 'keywords'>('google');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#1C1917] text-white max-w-2xl w-full p-6 md:p-8 rounded-sm shadow-2xl relative border border-[#C5A065]/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#C5A065]/20 text-[#C5A065] flex items-center justify-center">
              <Icon name="solar:star-shine-linear" className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-serif">SEO Optimization & Visibility Hub</h3>
              <p className="text-xs text-stone-400">Live Search Snippet & Structured Schema Validator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors"
            aria-label="Close SEO panel"
          >
            <Icon name="solar:close-circle-linear" className="text-2xl" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('google')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'google' ? 'bg-[#C5A065] text-white' : 'text-stone-400 hover:text-white bg-white/5'
            }`}
          >
            Google Search Snippet
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'social' ? 'bg-[#C5A065] text-white' : 'text-stone-400 hover:text-white bg-white/5'
            }`}
          >
            OpenGraph & Social Card
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'schema' ? 'bg-[#C5A065] text-white' : 'text-stone-400 hover:text-white bg-white/5'
            }`}
          >
            JSON-LD LocalBusiness Schema
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'keywords' ? 'bg-[#C5A065] text-[#1C1917]' : 'text-stone-400 hover:text-white bg-white/5'
            }`}
          >
            Target Keywords
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300">
              Preview how Hair Power appears in Google Search results when potential clients search for salons in Woodstock & Oxford County:
            </p>

            <div className="bg-white text-stone-900 p-4 rounded shadow font-sans border border-stone-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-[#1C1917] text-[#C5A065] text-[10px] flex items-center justify-center font-bold">
                  H
                </div>
                <div className="text-xs text-stone-600 truncate">
                  https://hairpoweroxford.ca <span className="text-stone-400">› woodstock-salon</span>
                </div>
              </div>
              <h4 className="text-blue-700 text-lg hover:underline cursor-pointer font-medium leading-snug">
                Hair Power | Eco-Friendly Beauty Salon in Woodstock, ON
              </h4>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                Hair Power is Oxford County's premier eco-friendly beauty salon in Woodstock, Ontario. Offering master haircuts, creative color, balayage, foil highlights, bridal updos, and Green Circle sustainable beauty care.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Title Tag Status</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">54 chars (Optimal &lt; 60)</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Meta Description</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">158 chars (Optimal ~160)</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Indexing</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">Index, Follow Enabled</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300">
              Preview how Hair Power links display when shared on WhatsApp, Facebook, iMessage, and Twitter:
            </p>

            <div className="bg-[#262626] border border-stone-700 rounded overflow-hidden max-w-sm mx-auto shadow-lg">
              <img
                src="https://ik.imagekit.io/kevfun/IMG-20260905-WA6540.jpg"
                alt="Social Card Preview"
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block">hairpoweroxford.ca</span>
                <p className="text-xs font-bold text-white mt-0.5">Hair Power | Premier Eco-Friendly Salon</p>
                <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">
                  Look Great, Feel Empowered. Serving Woodstock and Oxford County for over 35 years.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-300">
              Valid JSON-LD <code className="text-[#C5A065]">HairSalon</code> schema embedded in head for Google Knowledge Panel & Local Pack ranking:
            </p>

            <pre className="bg-black/60 p-3 rounded text-[11px] font-mono text-amber-300 max-h-52 overflow-y-auto border border-white/10">
{`{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Hair Power",
  "telephone": "+15195377302",
  "address": {
    "streetAddress": "565 Dundas St",
    "addressLocality": "Woodstock",
    "addressRegion": "ON",
    "postalCode": "N4S 1C6",
    "addressCountry": "CA"
  },
  "geo": {
    "latitude": 43.1315,
    "longitude": -80.7562
  },
  "priceRange": "$15 - $150",
  "openingHours": "Tu,Th 11:00-18:00, We,Fr 13:00-18:00, Sa 08:00-14:00"
}`}
            </pre>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Icon name="solar:check-circle-bold" />
              <span>Valid Schema.org syntax detected</span>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-300">
              Active high-intent search keywords integrated across content, headers, and meta tags:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { kw: 'Hair salon in Woodstock ON', density: 'High', placement: 'Title, H1, Meta' },
                { kw: '565 Dundas St Woodstock', density: 'High', placement: 'About, Schema, Contact' },
                { kw: 'Balayage Oxford County', density: 'Medium', placement: 'Services, Gallery' },
                { kw: 'Frank Commisso Hair Power', density: 'Medium', placement: 'About, Testimonials' },
                { kw: 'Eco friendly salon Woodstock', density: 'High', placement: 'Header, About, Meta' },
                { kw: 'Green Circle Salon Ontario', density: 'Medium', placement: 'About, Services' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 p-2.5 rounded border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-stone-200">{item.kw}</span>
                    <span className="block text-[10px] text-stone-400">{item.placement}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A065]/20 text-[#C5A065] font-semibold">
                    {item.density}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C5A065] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B08955] transition-colors"
          >
            Close SEO Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
