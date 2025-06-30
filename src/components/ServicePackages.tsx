import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Clock, Users, MapPin, Camera, Star } from 'lucide-react';

const ServicePackages = ({ onBookNow }) => {
  const [isNight, setIsNight] = useState(false);

  const packages = [
    {
      id: 'portrait',
      name: 'LIFESTYLE SESSION - MOBILE',
      dayPrice: 30000,
      nightPrice:'',
      duration: '45 minutes',
      people: 'individual ',
      location: 'indoor or outdoor',
      description: 'Perfect for individual portraits, couples, or small family photos',
      features: [
      '1 hour photo session',
      '5 edited high-resolution photos',
      'Online gallery access',
      '1 outfit ',
      'Personal and social media usage rights'
      ],
      popular: false,
      icon: '👤'
    },
    {
      id: 'family',
      name: 'LIFESTYLE SESSION - CAMERA',
      dayPrice: 70000,
      nightPrice: 85000,
      duration: '45 minutes',
      people: '3-6 people',
      location: 'indoor or outdoor',
      description: 'Comprehensive family photography with multiple outfit changes',
      features: [
      '1 hour photo session',
      '5 edited high-resolution photos',
      'Online gallery access',
      '1 outfit ',
      'Personal and social media usage rights'
      ],
      popular: true,
      icon: '👨‍👩‍👧‍👦'
    },
    
    {
      id: 'event',
      name: 'Event Photography',
      dayPrice: 599,
      nightPrice: 5990,
      duration: '3 hours',
      people: 'Up to 50 people',
      location: 'Event venue',
      description: 'Professional event coverage for corporate or private events',
      features: [
        '3 hours of coverage',
        '100+ edited photos',
        'Candid and posed shots',
        '48-hour delivery',
        'Commercial usage rights',
        'Group photo coordination'
      ],
      popular: false,
      icon: '🎉'
    }
  ];

  const getPrice = (pkg) => {
    return isNight ? pkg.nightPrice : pkg.dayPrice;
  };

  const getSavings = (pkg) => {
    const dayCost = pkg.dayPrice * 12;
    const nightCost = pkg.nightPrice;
    const savings = dayCost - nightCost;
    return Math.round((savings / dayCost) * 100);
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
            <span className={`text-sm font-medium ${!isNight ? 'text-slate-800' : 'text-slate-500'}`}>
              Day Session
            </span>
            <Switch
              checked={isNight}
              onCheckedChange={setIsNight}
              className="data-[state=checked]:bg-amber-500"
            />
            <span className={`text-sm font-medium ${isNight ? 'text-slate-800' : 'text-slate-500'}`}>
              Night Session
            </span>
          </div>
          {isNight && (
            <p className="text-sm text-green-600 font-medium">Save up to 17% with annual billing</p>
          )}
        </div>

        {/* Package Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
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
              
              {isNight && (
                <Badge className="absolute -top-3 right-4 bg-green-500 hover:bg-green-600">
                  Save {getSavings(pkg)}%
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
                    ₦{getPrice(pkg).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500">
                    {isNight ? 'per year' : 'starting price'}
                  </div>
                  {isNight && (
                    <div className="text-sm text-slate-400 mt-1">
                      <span className="line-through">₦{(pkg.dayPrice * 12).toLocaleString()}/year</span>
                    </div>
                  )}
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
