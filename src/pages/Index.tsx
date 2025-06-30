import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Camera, Star, Users, MapPin, Clock, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ServicePackages from '@/components/ServicePackages';
import BookingSection from '@/components/BookingSection';
import PackageSelection from '@/components/PackageSelection';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import { useUserRole } from '@/hooks/useUserRole';
import { PhotoPackage } from '@/data/packages';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'packages' | 'booking' | 'admin'>('home');
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const { isAdmin } = useUserRole();

  const handleBookNow = (packageData?: PhotoPackage) => {
    if (packageData) {
      setSelectedPackage(packageData);
      setCurrentView('booking');
    } else {
      setCurrentView('packages');
    }
  };

  const handleSelectPackage = (pkg: PhotoPackage) => {
    setSelectedPackage(pkg);
    setCurrentView('booking');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <Navigation />
      
      {currentView === 'home' && (
        <>
          <Hero onBookNow={() => handleBookNow()} />
          <ServicePackages onBookNow={handleBookNow} />
          
          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose Us</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Professional photography services with modern booking experience
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">Professional Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-center">
                      High-end equipment and years of experience delivering stunning, professional photographs
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">Easy Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-center">
                      Real-time availability calendar and streamlined booking process with instant confirmations
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">Client Focused</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-center">
                      Personalized service, flexible packages, and dedicated support throughout your experience
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-4 bg-white/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Client Stories</h2>
                <p className="text-lg text-slate-600">What our clients say about their experience</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-4 italic">
                      "The booking process was so smooth and the photographer captured our wedding day perfectly. The online gallery made sharing with family effortless!"
                    </p>
                    <div className="font-semibold text-slate-800">Sarah & Mike Johnson</div>
                    <div className="text-slate-600 text-sm">Wedding Photography</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-4 italic">
                      "Professional, creative, and so easy to work with. The portrait session exceeded our expectations and the final photos are absolutely beautiful."
                    </p>
                    <div className="font-semibold text-slate-800">Emily Chen</div>
                    <div className="text-slate-600 text-sm">Family Portrait</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Admin Access Button */}
          {isAdmin && (
            <section className="py-8 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Button
                  onClick={() => setCurrentView('admin')}
                  className="bg-slate-800 hover:bg-slate-900 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </div>
            </section>
          )}

          <Footer />
        </>
      )}

      {currentView === 'packages' && (
        <PackageSelection 
          onBack={handleBackToHome}
          onSelectPackage={handleSelectPackage}
        />
      )}

      {currentView === 'booking' && (
        <BookingSection 
          selectedPackage={selectedPackage}
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'admin' && isAdmin && (
        <AdminPanel onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default Index;