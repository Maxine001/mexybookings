import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Portfolio = () => {
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState<{ [key: number]: boolean }>({});
  const [filter, setFilter] = useState('all');

  const portfolioItems = [
   
    {
      id: 1,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location1.png",
      alt: "Wedding ceremony moment",
      category: "locations",
      title: "locations"
    },
    {
      id: 2,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location4.png",
      alt: "Wedding ceremony moment",
      category: "locations",
      title: "locations"
    },
    {
      id: 3,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location7.jpg",
      alt: "Wedding ceremony moment",
      category: "locations",
      title: "locations"
    },
    {
      id: 4,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location8.jpg",
      alt: "Lifestyle session",
      category: "locations",
      title: "Locations"
    },
    {
      id: 5,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location9.jpg",
      alt: "Lifestyle session",
      category: "locations",
      title: "Locations"
    },
    {
      id: 6,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/locations/location11.jpg",
      alt: "Lifestyle session",
      category: "locations",
      title: "Locations"
    },
    {
      id: 7,
      type: "video",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/videos/vid1.mov",
      poster: "",
      alt: "",
      category: "",
      title: "location Highlights"
    },

    {
      id: 8,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images//portfolio2.JPG",
      alt: "Family portrait",
      category: "family",
      title: "Family Bonds"
    },
    {
      id: 9,
      type: "video",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/videos/vid2.mov",
      poster: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=500&fit=crop",
      alt: "Corporate event coverage",
      category: "event",
      title: "Corporate Gathering"
    },
    {
      id: 10,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images//portfolio5.JPG",
      alt: "Portrait session",
      category: "portrait",
      title: "Artistic Vision"
    },
    {
      id: 11,
      type: "video",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images/videos/vid2.mov",
      poster: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop",
      alt: "First dance video",
      category: "wedding",
      title: "First Dance"
    },
    {
      id: 12,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images//2025_07_02_07_21_IMG_2600.JPG",
      alt: "Children portrait",
      category: "family",
      title: "Childhood Wonder"
    },
    {
      id: 13,
      type: "image",
      src: "https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images//portfolio9.JPG",
      alt: "Business event",
      category: "event",
      title: "Professional Moments"
    }
  ];

  const categories = [
    { key: 'all', label: 'All Work' },
    { key: 'portrait', label: 'Lifestyle session - Mobile' },
    { key: 'family', label: 'Lifestyle session - Camera' },
    { key: 'event', label: 'All Events' },
    { key: 'locations', label: 'Locations' }
  ];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const openLightbox = (mediaId: number) => {
    setSelectedMedia(mediaId);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'unset';
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (selectedMedia === null) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedMedia);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedMedia(filteredItems[newIndex].id);
  };

  const handleMediaLoad = (mediaId: number) => {
    setMediaLoaded(prev => ({ ...prev, [mediaId]: true }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMedia === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateMedia('prev');
          break;
        case 'ArrowRight':
          navigateMedia('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia]);

  const selectedItemData = selectedMedia 
    ? filteredItems.find(item => item.id === selectedMedia)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <style>
        {`
          .masonry-grid {
            column-count: 1;
            column-gap: 1.5rem;
            padding: 1.5rem;
          }
          
          @media (min-width: 640px) {
            .masonry-grid {
              column-count: 2;
            }
          }
          
          @media (min-width: 1024px) {
            .masonry-grid {
              column-count: 3;
            }
          }
          
          @media (min-width: 1280px) {
            .masonry-grid {
              column-count: 4;
            }
          }
          
          .masonry-item {
            break-inside: avoid;
            margin-bottom: 1.5rem;
            display: inline-block;
            width: 100%;
          }
          
          .image-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-in forwards;
          }
          
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          
          .hover-zoom {
            transition: transform 0.3s ease;
          }
          
          .hover-zoom:hover {
            transform: scale(1.05);
          }

          .video-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .video-overlay:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: translate(-50%, -50%) scale(1.1);
          }
        `}
      </style>

      <Navigation />
      
      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Selected <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Works</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            A curated collection showcasing moments of love, joy, and authentic human connection
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={filter === category.key ? "default" : "outline"}
                onClick={() => setFilter(category.key)}
                className={filter === category.key 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                  : "hover:bg-amber-50"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="masonry-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`masonry-item fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openLightbox(item.id)}
                >
                  {!mediaLoaded[item.id] && (
                    <div className="image-skeleton w-full h-64"></div>
                  )}
                  
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={`w-full h-auto object-cover hover-zoom ${
                        mediaLoaded[item.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleMediaLoad(item.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={item.poster}
                        alt={item.alt}
                        className={`w-full h-auto object-cover hover-zoom ${
                          mediaLoaded[item.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleMediaLoad(item.id)}
                        loading="lazy"
                      />
                      <div className="video-overlay opacity-0 group-hover:opacity-100">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm capitalize">{item.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedMedia && selectedItemData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMedia('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMedia('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Media Content */}
            {selectedItemData.type === 'image' ? (
              <img
                src={selectedItemData.src}
                alt={selectedItemData.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedItemData.src}
                poster={selectedItemData.poster}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}

            {/* Media Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-1">{selectedItemData.title}</h3>
              <p className="text-sm opacity-80 capitalize">
                {selectedItemData.category} {selectedItemData.type === 'video' ? 'Video' : 'Photography'}
              </p>
            </div>
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          ></div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Portfolio ;