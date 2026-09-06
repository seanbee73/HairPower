import { SalonInfo, ServiceItem, GalleryItem, Testimonial } from '../types';

export const SALON_INFO: SalonInfo = {
  "name": "Hair Power",
  "tagline": "Oxford County's Premier Eco-Friendly Salon",
  "taglineSub": "Look Great, Feel Empowered.",
  "phone": "(519) 537-7302",
  "phoneRaw": "15195377302",
  "whatsappUrl": "https://wa.me/15195377302",
  "address": "565 Dundas St, Woodstock, ON N4S 1C6",
  "instagramUrl": "https://instagram.com",
  "hoursMonSat": "Tue & Thu: 11am-6pm | Wed & Fri: 1pm-6pm | Sat: 8am-2pm",
  "hoursSun": "Closed (Sun & Mon)",
  "quote": "\"Look Great, Feel Empowered. Serving Woodstock & Oxford County for over 35 years.\"",
  "leadStylist": "Frank Commisso (Master Stylist & Owner)",
  "aboutText1": "Hair Power has been serving Woodstock and the surrounding Oxford County community for over 35 years. As a family-run business, Frank Commisso's father, Pino, opened the salon after arriving in Canada from Southern Italy in 1989, and they never looked back.",
  "aboutText2": "Hair Power has maintained its excellence through loyalty, pride, and a reputation in providing fashion-forward looks to classic styles. As Oxford County's premier eco-friendly salon, we proudly partner with Green Circle Salons to recover and repurpose up to 90-95% of daily beauty waste.",
  "heroImageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA6540.jpg",
  "founderImageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA4382.jpg"
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    "id": "womens-cut",
    "title": "Master Women's Haircut",
    "price": "$48 and up",
    "startingAmount": 48,
    "description": "Precision scissor or razor cuts, relaxing shampoo wash, and signature blowout styling.",
    "details": [
      "Personalized face shape & hair texture consultation",
      "Relaxing shampoo wash & moisture conditioner",
      "Precision scissor or body-adding razor haircut",
      "Signature blowout & heat styling finish",
      "Daily maintenance & product advice"
    ],
    "icon": "solar:scissors-linear",
    "category": "cutting"
  },
  {
    "id": "mens-grooming",
    "title": "Men's Cut & Grooming",
    "price": "$30 and up",
    "startingAmount": 30,
    "description": "Classic & modern fades, razor cuts, beard grooming, and specialized gloss treatment.",
    "details": [
      "Tailored consultation for classic cuts or fades",
      "Invigorating scalp wash & conditioning",
      "Precision clipper & razor detailing",
      "Specialized black conditioner for added gloss & shine",
      "Hot towel & pomade styling finish"
    ],
    "icon": "solar:user-linear",
    "category": "cutting"
  },
  {
    "id": "balayage-color",
    "title": "Balayage & Creative Color",
    "price": "Price Upon Consultation",
    "startingAmount": 115,
    "description": "Custom foilyage, hand-painted balayage, ombré, foil highlights, and custom gloss toners.",
    "details": [
      "Custom color & skin tone matching consultation",
      "Partial Highlights ($115+) or Full Head Highlights ($135+)",
      "Bleach & Tone ($105+) or Custom Toner ($35-$45)",
      "Creative Foilyage, Balayage & Ombré expertise",
      "Eco-friendly Green Circle color recovery system"
    ],
    "icon": "solar:star-shine-linear",
    "category": "coloring"
  },
  {
    "id": "bridal-updos",
    "title": "Bridal & Formal Updos",
    "price": "$125 (Includes Trial)",
    "startingAmount": 125,
    "description": "Exquisite bridal updos including a 1-hour separate trial prior to your wedding day.",
    "details": [
      "Includes 1-hour separate trial run prior to wedding",
      "Formal Updo Style ($65+) & bridal party packages",
      "Veil, floral pin & hair accessory securing",
      "All-day & all-night hold formula",
      "Specialized on-site or in-salon group coordination"
    ],
    "icon": "solar:heart-linear",
    "category": "bridal"
  },
  {
    "id": "smartbond-olaplex",
    "title": "Smart Bond & Olaplex Repair",
    "price": "$35 - $40",
    "startingAmount": 35,
    "description": "Deep conditioning, Smart Bond, and Olaplex treatments to restore damaged, colored hair.",
    "details": [
      "Targeted bond-rebuilding structural treatment",
      "Deep steam hydration & moisture lock mask",
      "Scalp detox & relaxing head massage",
      "Frizz reduction & high-gloss mirror shine",
      "Essential post-bleach/color protection"
    ],
    "icon": "solar:user-hand-up-linear",
    "category": "treatment"
  },
  {
    "id": "texture-perm",
    "title": "Texture Service (Body Perm)",
    "price": "$150 and up",
    "startingAmount": 150,
    "description": "Custom wave, body perm, and texturizing services for long-lasting volume and curl.",
    "details": [
      "Hair elasticity & porosity evaluation",
      "Custom rod sizing for beach waves or soft curls",
      "Gentle low-ammonia texturizing formula",
      "Moisture neutralizing rinse & lock-in treatment",
      "Aftercare wave management guidance"
    ],
    "icon": "solar:layers-linear",
    "category": "extensions"
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    "title": "Master Haircuts & Styles",
    "category": "Cutting",
    "imageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA5281.jpg?updatedAt=1788633443471",
    "heightClass": "h-auto",
    "description": "Precision haircut with razor texturizing and blowout by Frank Commisso.",
    "id": "gallery-1"
  },
  {
    "title": "Dimensional Golden Balayage",
    "category": "Color",
    "imageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA2898.jpg?updatedAt=1788633444039",
    "heightClass": "h-80",
    "description": "Seamless balayage blending with bright face-framing money piece.",
    "id": "gallery-2"
  },
  {
    "title": "Bridal Updo Perfection",
    "category": "Bridal",
    "imageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA2724.jpg?updatedAt=1788633443808",
    "heightClass": "h-64",
    "description": "Elegant formal updo designed to hold effortlessly all day and night.",
    "id": "gallery-3"
  },
  {
    "title": "Vivid Creative Color",
    "category": "Color",
    "imageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA2057.jpg?updatedAt=1788633443775",
    "heightClass": "h-auto",
    "description": "Deep plum and vivid violet creative color with glossy protective finish.",
    "id": "gallery-4"
  },
  {
    "title": "Green Circle Sustainable Salon",
    "category": "Interior",
    "imageUrl": "https://ik.imagekit.io/kevfun/IMG-20260905-WA6540.jpg",
    "heightClass": "h-72",
    "description": "Our eco-friendly salon at 565 Dundas St, Woodstock, diverting 95% of beauty waste.",
    "id": "gallery-5"
  },
  {
    "title": "Men's Precision Cut & Fade",
    "category": "Grooming",
    "imageUrl": "https://ik.imagekit.io/kevfun/pinterest_650136896255292073_1788628185999.jpg?updatedAt=1788634380799",
    "heightClass": "h-auto",
    "description": "Sharp fade haircut with specialized black conditioning treatment for extra gloss.",
    "id": "gallery-6"
  }
];

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
    quote: '"I had such a wonderful experience having my hair done by Frank for my daughter\'s wedding. He did a phenomenal job with my hair, very stylish, trendy, and it held all day and night. I can\'t thank him enough!"',
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
