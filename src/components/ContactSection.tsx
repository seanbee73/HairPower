import React, { useState } from 'react';
import { SalonInfo, ServiceItem, InquiryFormData, BookingConfirmation, CustomerInquiry } from '../types';
import { Icon } from './Icon';

interface ContactSectionProps {
  salonInfo: SalonInfo;
  services: ServiceItem[];
  preselectedServiceId?: string;
  onClearPreselectedService?: () => void;
  onAddInquiry?: (inquiry: CustomerInquiry) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  salonInfo,
  services,
  preselectedServiceId,
  onClearPreselectedService,
  onAddInquiry
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    serviceId: preselectedServiceId || (services[0]?.id || 'womens-cut'),
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: ''
  });

  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if preselected service changes
  React.useEffect(() => {
    if (preselectedServiceId) {
      setFormData(prev => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const service = services.find(s => s.id === formData.serviceId) || services[0];
      const randomRef = 'HP-' + Math.floor(100000 + Math.random() * 900000);

      const newInquiry: CustomerInquiry = {
        id: 'inq-' + Date.now(),
        referenceCode: randomRef,
        createdAt: new Date().toISOString(),
        type: 'booking',
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceId: formData.serviceId,
        serviceTitle: service?.title || 'Hair Service',
        preferredDate: formData.preferredDate || 'Flexible / To be confirmed',
        preferredTime: formData.preferredTime || 'Anytime',
        notes: formData.notes.trim(),
        status: 'New'
      };

      if (onAddInquiry) {
        onAddInquiry(newInquiry);
      } else {
        // Fallback directly to localStorage
        try {
          const stored = localStorage.getItem('hairpower_customer_inquiries');
          const list = stored ? JSON.parse(stored) : [];
          list.unshift(newInquiry);
          localStorage.setItem('hairpower_customer_inquiries', JSON.stringify(list));
        } catch (err) {
          console.error(err);
        }
      }

      setConfirmation({
        referenceCode: randomRef,
        fullName: formData.fullName,
        serviceTitle: service?.title || 'Hair Service',
        date: formData.preferredDate || 'To be confirmed',
        time: formData.preferredTime,
        phone: formData.phone
      });

      setIsSubmitting(false);
    }, 600);
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  const getWhatsAppBookingText = (refCode: string) => {
    const text = `Hello ${salonInfo.name}! I just submitted an inquiry on your website.\n\n` +
      `Reference: *${refCode}*\n` +
      `Name: ${formData.fullName}\n` +
      `Service: ${selectedService?.title || 'Hair Service'}\n` +
      `Preferred Date: ${formData.preferredDate || 'Asap'}\n` +
      `Preferred Time: ${formData.preferredTime}\n` +
      `Phone: ${formData.phone}\n` +
      (formData.notes ? `Notes: ${formData.notes}\n` : '') +
      `Please confirm availability. Thank you!`;
    return encodeURIComponent(text);
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#0C0A09] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll is-visible">
          <span className="text-[#C5A065] text-xs font-semibold tracking-[0.2em] uppercase">
            Visit Us
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mt-3 text-[#1C1917] dark:text-stone-100 tracking-tight">
            Contact & Booking
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto mt-2 font-light">
            Have questions or want to schedule an appointment? Fill out the form or reach us directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Info & Inquiry Form */}
          <div className="flex flex-col space-y-8 reveal-on-scroll is-visible">
            {/* Salon Info Box */}
            <div className="p-8 bg-[#FDFBF7] dark:bg-[#161412] border border-stone-100 dark:border-stone-800 shadow-sm">
              <h3 className="text-xl font-serif text-[#1C1917] dark:text-stone-100 mb-6">Salon Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#C5A065] mt-1">
                    <Icon name="solar:map-point-linear" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1C1917] dark:text-stone-200">Address</p>
                    <p className="text-stone-500 dark:text-stone-400 font-light text-sm">{salonInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-[#C5A065] mt-1">
                    <Icon name="solar:phone-calling-linear" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1C1917] dark:text-stone-200">Phone & WhatsApp</p>
                    <a
                      href={`tel:${salonInfo.phoneRaw}`}
                      className="text-stone-500 dark:text-stone-400 font-light text-sm hover:text-[#C5A065] block transition-colors"
                    >
                      {salonInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-[#C5A065] mt-1">
                    <Icon name="solar:clock-circle-linear" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1C1917] dark:text-stone-200">Opening Hours</p>
                    <p className="text-stone-500 dark:text-stone-400 font-light text-sm">Mon - Sat: {salonInfo.hoursMonSat}</p>
                    <p className="text-stone-500 dark:text-stone-400 font-light text-sm">Sun: {salonInfo.hoursSun}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={salonInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] text-white text-sm font-medium text-center hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icon name="solar:chat-round-dots-linear" className="text-lg" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={salonInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium text-center hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icon name="solar:camera-linear" className="text-lg" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Customer Inquiry & Booking Form */}
            <div className="p-8 bg-stone-50 dark:bg-[#161412] border border-stone-200 dark:border-stone-800 shadow-sm">
              <h3 className="text-xl font-serif text-[#1C1917] dark:text-stone-100 mb-2 flex items-center gap-2">
                <span>Customer Inquiry & Booking</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
                Send us a message or request an appointment slot.
              </p>

              {confirmation ? (
                <div className="bg-white p-6 border-l-4 border-[#C5A065] shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3 text-emerald-600 mb-3">
                    <Icon name="solar:check-circle-bold" className="text-2xl" />
                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">Inquiry Received!</h4>
                  </div>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                    Thank you, <strong className="text-stone-800">{confirmation.fullName}</strong>. Your inquiry for <strong className="text-stone-800">{confirmation.serviceTitle}</strong> has been received.
                  </p>
                  
                  <div className="bg-stone-50 p-4 text-xs space-y-2 mb-5 rounded border border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Reference:</span>
                      <span className="font-mono font-bold text-[#C5A065]">{confirmation.referenceCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service:</span>
                      <span className="font-medium">{confirmation.serviceTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Preferred Date/Time:</span>
                      <span className="font-medium">{confirmation.date} at {confirmation.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Phone:</span>
                      <span className="font-medium">{confirmation.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://wa.me/${salonInfo.phoneRaw}?text=${getWhatsAppBookingText(confirmation.referenceCode)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider text-center hover:brightness-105 transition-all flex items-center justify-center gap-2 rounded shadow"
                    >
                      <Icon name="solar:chat-round-dots-linear" className="text-base" />
                      <span>Speed Up via WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setConfirmation(null)}
                      className="w-full py-2 bg-stone-200 text-stone-700 text-xs font-medium text-center hover:bg-stone-300 transition-colors rounded"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Ama Mensah"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 50 000 0000"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ama@example.com"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Requested Service *
                      </label>
                      <select
                        value={formData.serviceId}
                        onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                      >
                        <option value="9:30 AM">9:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                      Message / Style Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Tell us about your desired hairstyle, hair type, or special event date..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#0A0908] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-[#C5A065]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#1C1917] text-[#C5A065] font-medium text-sm tracking-widest uppercase hover:bg-[#C5A065] hover:text-white transition-all duration-300 shadow flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Icon name="solar:plain-linear" className="text-lg" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Map with Grayscale filter requirement */}
          <div className="h-[400px] lg:h-auto min-h-[500px] bg-stone-200 relative w-full border border-stone-200 reveal-on-scroll is-visible reveal-delay-200 shadow-sm overflow-hidden">
            <iframe
              title="Hair Power Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2915.6888!2d-80.7562!3d43.1315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c2323a63f7363%3A0x7d9361!2s565%20Dundas%20St%2C%20Woodstock%2C%20ON%20N4S%201C6!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 hover:grayscale-0 transition-all duration-500"
            />
            
            <div className="absolute bottom-4 left-4 bg-white dark:bg-[#1A1715] p-3 shadow-lg max-w-xs hidden sm:block border-l-2 border-[#C5A065]">
              <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">{salonInfo.name}</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">{salonInfo.address}</p>
              <a
                href="https://maps.google.com/?q=565+Dundas+St+Woodstock+ON+N4S+1C6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#C5A065] hover:underline font-medium mt-1 inline-block"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
