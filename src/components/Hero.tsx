
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Play, Star } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { useAuth } from '@/contexts/AuthContext';

const Hero = ({ onBookNow }) => {
  const { user } = useAuth();

  const portfolioImages = [
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1494790108755-2616c819ca2b?w=400&h=500&fit=crop", 
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&h=500&fit=crop"
  ];

  const username = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <section className="relative py-12 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-amber-500/5 to-orange-500/10"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center ">
          {/* Left Content */}
          <div className="space-y-8">
            {user && (
              <div className="text-lg font-semibold text-amber-600">
                Welcome, {username}!
              </div>
            )}
            <div className="flex items-center space-x-2 text-amber-600 ">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium">Trusted by 1000+ clients</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                Capture Your
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Perfect Moments
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Professional photography services with seamless online booking. 
                From portraits to events, we make every moment unforgettable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onBookNow}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Your Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-slate-50"
              >
                <Play className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">1000+</div>
                <div className="text-sm text-slate-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">1000+</div>
                <div className="text-sm text-slate-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">5★</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Photography Portfolio Slider */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Carousel 
                className="w-full"
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: true,
                  }),
                ]}
              >
                <CarouselContent>
                  {portfolioImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/5] relative">
                        <img 
                          src={image} 
                          alt={`Portfolio image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Available Today</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="text-sm text-slate-600">Starting from</div>
                <div className="text-xl font-bold text-slate-800">₦30,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
