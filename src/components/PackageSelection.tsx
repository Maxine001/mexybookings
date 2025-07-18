
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Check, Star, ArrowDown } from 'lucide-react';
import { photoPackages, PhotoPackage } from '@/data/packages';
import { useToast } from '@/hooks/use-toast';

interface PackageSelectionProps {
  onBack: () => void;
  onSelectPackage: (pkg: PhotoPackage, isAnnual: boolean) => void;
  couplesToggle: { [key: string]: boolean };
  setCouplesToggle: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const PackageSelection = ({ onBack, onSelectPackage, couplesToggle, setCouplesToggle }: PackageSelectionProps) => {
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  const handleContinue = () => {
    if (selectedPackage) {
      onSelectPackage(selectedPackage, isAnnual);
    }
  };

  const getPrice = (pkg: PhotoPackage) => {
    let basePrice = isAnnual ? pkg.annualPrice : pkg.monthlyPrice;
    if (typeof basePrice === 'number' && couplesToggle[pkg.id]) {
      basePrice += 10000;
    }
    return basePrice;
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
    }
    return price;
  };

  const getSavings = (pkg: PhotoPackage) => {
    if (typeof pkg.monthlyPrice !== 'number' || typeof pkg.annualPrice !== 'number') {
      return 0;
    }
    const monthlyCost = pkg.monthlyPrice * 12;
    const annualCost = pkg.annualPrice;
    const savings = monthlyCost - annualCost;
    return Math.round((savings / monthlyCost) * 100);
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
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
                Day Session
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-amber-500"
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
                Night Session
              </span>
            </div>
            {isAnnual && (
              <p className="text-sm text-green-600 font-medium">The city sleeps, but our moments don’t. Capture your best moments with our night sessions</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {photoPackages.filter(pkg => pkg.id !== 'premium').map((pkg) => {
            // Determine features based on couples toggle for lifestyle packages
            let features = pkg.features;
            if ((pkg.id === 'basic' || pkg.id === 'standard') && couplesToggle[pkg.id]) {
              features = [
                '45 minutes photo session',
                '5 edited high-resolution photos',
                'Couples',
                '2 outfit changes',
                'Professional retouching',
                'Custom photo book option',
              ];
            }

            return (
              <Card 
                key={pkg.id} 
                className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPackage?.id === pkg.id 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-slate-200 hover:border-amber-300'
                } ${pkg.popular ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}
                onClick={() => {
                  setSelectedPackage(pkg);
                  toast({
                    title: "Scroll down to continue",
                    description: <ArrowDown className="mx-auto mt-1" />,
                    duration: 4000,
                  });
                }}
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
                    <span className="text-3xl font-bold text-slate-800">{formatPrice(getPrice(pkg))}</span>
                    
                  </div>
                  
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Add toggle for individual/couples for lifestyle packages */}
                  {((pkg.id === 'basic' && !isAnnual) || pkg.id === 'standard') && (
                    <div className="mt-4 flex items-center justify-center space-x-4">
                      <span className="text-sm font-medium">Individual</span>
                      <Switch
                        checked={couplesToggle[pkg.id]}
                        onCheckedChange={(checked) => setCouplesToggle(prev => ({ ...prev, [pkg.id]: checked }))}
                        className="data-[state=checked]:bg-amber-500"
                      />
                      <span className="text-sm font-medium">Couples</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedPackage && (
          <div className="text-center">
            <div className="bg-white border border-amber-200 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Selected Package</h3>
              <p className="text-amber-600 font-medium">{selectedPackage.name}</p>
              <p className="text-slate-600 mb-2">
                {isAnnual ? 'Night Session Price' : 'Day Session Price'}: 
                <span className="font-bold text-slate-800 ml-1">
                  {formatPrice(getPrice(selectedPackage))}
                </span>
              </p>
            
            </div>
            {(selectedPackage.id !== 'basic' || !isAnnual) && (
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
              >
                Continue to Booking
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageSelection;
