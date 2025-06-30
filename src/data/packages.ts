export interface PhotoPackage {
  id: string;
  name: string;
  description: string;
  dayPrice: number;
  nightPrice: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const photoPackages: PhotoPackage[] = [
  {
    id: 'basic',
    name: 'LIFESTYLE SESSION - MOBILE',
    description: 'Perfect for individual headshots and simple portraits',
    dayPrice: 30000,
    nightPrice: 5, // 10 months price (2 months free)
    duration: '1 hour',
    features: [
       '1 hour photo session',
      '5 edited high-resolution photos',
      'Online gallery access',
      '1 outfit ',
      'Personal and social media usage rights'
    ]
  },
  {
    id: 'standard',
    name: 'LIFESTYLE SESSION - CAMERA',
    description: 'Great for individuals, night life photos',
    dayPrice: 70000,
    nightPrice: 85000, // 10 months price (2 months free)
    duration: '1 hours',
    features: [
      '1 hour photo session',
      '5 edited high-resolution photos',
      'Online gallery access',
      '1 outfit ',
      'Personal and social media usage rights'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'EVENT SESSION (CAMERA ONLY)',
    description: 'Comprehensive session with multiple locations',
    dayPrice: 799,
    nightPrice: 7990, // 10 months price (2 months free)
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
  
];
