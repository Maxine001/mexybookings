
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Clock, Users, MapPin, Camera, Star, Smartphone } from 'lucide-react';

const ServicePackages = ({ onBookNow }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const packages = [
    {
      id: 'portrait',
      name: 'LIFESTYLE SESSION- MOBILE',
      monthlyPrice: 30000,
      annualPrice: 'Not available',
      duration: '1 hour',
      people: '1 person',
      location: 'will assign location',
      description: 'Perfect for individual portraits, couples, or small family photos',
      features: [
        '45 minutes photo session',
        '5 edited high-resolution photos',
        'Individual',
        '1 outfit change',
        'Basic retouching'
      ],
      popular: false,
      icon: <Smartphone className="mx-auto" />
    },
    {
      id: 'family',
      name: 'LIFESTYLE SESSION- CAMERA',
      monthlyPrice: 70000,
      annualPrice: 85000,
      duration: '45 minutes photo session',
      people: 'Individual',
      location: 'will assign location',
      description: 'Comprehensive family photography with multiple outfit changes',
      features: [
        '45 minutes photo session',
        '5 edited high-resolution photos',
        'Individual',
        '1 outfit change',
        'Professional retouching',
        'Custom photo book option'
      ],
      popular: true,
      icon: <Camera className="mx-auto" />
    },
    {
      id: 'event',
      name: 'All Kinds of Events',
      monthlyPrice: 'Contact Us',
      annualPrice: 'Contact Us',
      duration: '3 hours',
      people: 'Up to 50 people',
      location: 'Event venue',
      description: 'Professional event coverage for corporate or private events. For further enquiries, contact us.',
      features: [
        'Weddings',
        'Fashion shows',
        'Company parties',
        'Product launches',
        'Family portraits',
        'Anniversaries',
        'Engagement parties',
        'Bridal showers'
      ],
      popular: false,
      icon: '🎉'
    }
  ];

  const getPrice = (pkg) => {
    const price = isAnnual ? pkg.annualPrice : pkg.monthlyPrice;
    if (typeof price === 'number') {
      return `₦${price.toLocaleString('en-NG')}`;
    }
    return price; // for cases like 'Not available'
  };

  

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Photography Packages
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Choose the perfect package for your needs. All sessions include professional editing 
            and high-resolution digital delivery.
          </p>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
              Day Sessions
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-amber-500"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
              Night Sessions
            </span>
          </div>
          {isAnnual && (
            <p className="text-sm text-green-600 font-medium"> The city sleeps, but our moments don’t. Capture your best moments with our night sessions</p>
          )}
        </div>

        {/* Package Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                pkg.popular ? 'ring-2 ring-amber-500 scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <CardTitle className="text-xl text-slate-800">{pkg.name}</CardTitle>
                <CardDescription className="text-slate-600">
                  {pkg.description}
                </CardDescription>
                
                <div className="pt-4">
                <div className="text-3xl font-bold text-slate-800">
                  {getPrice(pkg)}
                </div>
                  
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Package Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-2 text-amber-500" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-amber-500" />
                    {pkg.people}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                    {pkg.location}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => onBookNow(pkg)}
                  className={`w-full font-semibold py-6 rounded-xl transition-all duration-300 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Book {pkg.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Package CTA */}
        <div className="mt-16 text-center">
          <Card className="border-2 border-dashed border-slate-300 hover:border-amber-500 transition-colors duration-300">
            <CardContent className="py-12">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Need Something Custom?
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Let's create a personalized package that perfectly fits your vision and budget.
              </p>
              <Button variant="outline" size="lg" className="font-semibold">
                Get Custom Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicePackages;
