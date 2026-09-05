export interface SalonInfo {
  name: string;
  tagline: string;
  taglineSub: string;
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  address: string;
  instagramUrl: string;
  hoursMonSat: string;
  hoursSun: string;
  quote: string;
  leadStylist: string;
  aboutText1: string;
  aboutText2: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  price: string;
  startingAmount: number;
  description: string;
  details: string[];
  icon: string; // Solar icon name
  category: 'cutting' | 'coloring' | 'bridal' | 'makeup' | 'extensions' | 'treatment';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Cutting' | 'Styling' | 'Color' | 'Bridal' | 'Grooming' | 'Interior';
  imageUrl: string;
  heightClass?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  date: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export interface BookingConfirmation {
  referenceCode: string;
  fullName: string;
  serviceTitle: string;
  date: string;
  time: string;
  phone: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Confirmed' | 'Completed' | 'Archived';

export interface CustomerInquiry {
  id: string;
  referenceCode: string;
  createdAt: string; // ISO date string
  type: 'booking' | 'general';
  fullName: string;
  email: string;
  phone: string;
  serviceId?: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: InquiryStatus;
  staffNotes?: string;
}
