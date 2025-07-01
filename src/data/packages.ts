
export interface PhotoPackage {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const photoPackages: PhotoPackage[] = [
  {
    id: 'basic',
    name: 'Basic Portrait',
    description: 'Perfect for individual headshots and simple portraits',
    monthlyPrice: 299,
    annualPrice: 2988, // 10 months price (2 months free)
    duration: '1 hour',
    features: [
      '1 hour photo session',
      '20 edited high-resolution photos',
      'Online gallery access',
      'Personal usage rights'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Session',
    description: 'Great for couples, families, or small groups',
    monthlyPrice: 499,
    annualPrice: 4990, // 10 months price (2 months free)
    duration: '2 hours',
    features: [
      '2 hour photo session',
      '50 edited high-resolution photos',
      'Online gallery access',
      '2 outfit changes',
      'Personal and social media usage rights'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Experience',
    description: 'Comprehensive session with multiple locations',
    monthlyPrice: 799,
    annualPrice: 7990, // 10 months price (2 months free)
    duration: '3 hours',
    features: [
      '3 hour photo session',
      '100+ edited high-resolution photos',
      'Online gallery access',
      'Multiple locations',
      'Unlimited outfit changes',
      'Hair and makeup consultation',
      'Commercial usage rights'
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding Package',
    description: 'Full wedding day coverage',
    monthlyPrice: 2499,
    annualPrice: 24990, // 10 months price (2 months free)
    duration: '8 hours',
    features: [
      'Full day wedding coverage',
      '500+ edited high-resolution photos',
      'Online gallery access',
      'Engagement session included',
      'Two photographers',
      'USB drive with all photos',
      'Print release included'
    ]
  },
  {
    id: 'event',
    name: 'Event Photography',
    description: 'Corporate events, parties, and special occasions',
    monthlyPrice: 899,
    annualPrice: 8990, // 10 months price (2 months free)
    duration: '4 hours',
    features: [
      '4 hour event coverage',
      '200+ edited photos',
      'Online gallery access',
      'Quick turnaround (48 hours)',
      'Commercial usage rights',
      'Group photos included'
    ]
  }
];
