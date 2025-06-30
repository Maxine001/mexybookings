import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { photoPackages, PhotoPackage } from '@/data/packages';
import BookingSection from './BookingSection';

interface PackageSelectionProps {
  onBack: () => void;
  onSelectPackage: (pkg: PhotoPackage) => void;
}

const PackageSelection = ({ onBack, onSelectPackage }: PackageSelectionProps) => {
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const [isNight, setIsNight] = useState(false);

  const handleContinue = () => {
    if (selectedPackage) {
      onSelectPackage(selectedPackage);
    }
  };

  const getPrice = (pkg: PhotoPackage) => {
    return isNight ? pkg.nightPrice : pkg.dayPrice;
  };

  const getPriceLabel = (pkg: PhotoPackage) => {
    if (isNight) {
      return `$${pkg.nightPrice} / year`;
    }
    return `$${pkg.dayPrice} / ${pkg.duration}`;
  };

  return (
    <section className="py-8 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Package</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Select the photography package that best fits your needs
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
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {photoPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPackage?.id === pkg.id 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-slate-200 hover:border-amber-300'
              } ${pkg.popular ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <CardHeader className="relative">
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-4 bg-amber-500 hover:bg-amber-600">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardTitle className="text-xl text-slate-800">{pkg.name}</CardTitle>
                <CardDescription className="text-slate-600">{pkg.description}</CardDescription>
                <div className="flex items-baseline mt-4">
                  <span className="text-3xl font-bold text-slate-800">${getPrice(pkg)}</span>
                  <span className="text-slate-500 ml-2">
                    {isNight ? '/ year' : `/ ${pkg.duration}`}
                  </span>
                </div>
                
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPackage && (
          <div className="text-center">
            <div className="bg-white border border-amber-200 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Selected Package</h3>
              <p className="text-amber-600 font-medium">{selectedPackage.name}</p>
              <p className="text-2xl font-bold text-slate-800">{getPriceLabel(selectedPackage)}</p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
            >
              Continue to Booking
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageSelection;