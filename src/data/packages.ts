
export interface PhotoPackage {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const photoPackages: PhotoPackage[] = [
  {
    id: 'basic',
    name: 'LIFESTYLE SESSION - MOBILE',
    description: 'Perfect for individual headshots and simple portraits',
    monthlyPrice: 35000,
    annualPrice: 'Night session not available for this package', // Changed to string as per user request
    duration: '45 minutes',
    features: [
      '45 minutes photo session',
      '5 edited high-resolution photos',
      'Individual',
      '1 outfit change',
      'Basic retouching'
    ]
  },
  {
    id: 'standard',
    name: 'LIFESTYLE SESSION - CAMERA',
    description: 'Great for couples, families, or small groups',
    monthlyPrice: 70000,
    annualPrice: 85000, // 10 months price (2 months free)
    duration: '',
    features: [
      '45 minutes photo session',
        '5 edited high-resolution photos',
        'Individual',
        '1 outfit change',
        'Professional retouching',
        'Custom photo book option'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'ALL EVENTS',
    description: 'Comprehensive session with multiple locations',
    monthlyPrice: 'Contact Us',
    annualPrice: 'Contact us', // 10 months price (2 months free)
    duration: '3 hours',
    features: [
      'Weddings',
      'Fashion shows',
      'Company parties',
      'Product launches',
      'Family portraits',
      'Anniversaries',
      'Engagement parties',
      'Bridal showers'
  ]
  }
  
];
