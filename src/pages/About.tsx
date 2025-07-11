
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, Award, Users, Clock, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Heart, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Camera, value: "1000+", label: "Happy Clients" },
    { icon: Users, value: "500+", label: "Events Covered" },
    { icon: Clock, value: "6+", label: "Years Experience" }
  ];

  const achievements = [
    {
      title: "Wedding Photographer of the Year",
      organization: "NYC Photography Awards",
      icon: Award
    },
    {
      title: "Featured in Vogue Weddings",
      organization: "Editorial Feature",
      icon: Star
    },
    {
      title: "International Photography Excellence",
      organization: "World Photography Organization",
      icon: Zap
    }
  ];

  const personalTouches = [
    {
      icon: Camera,
      title: "Favorite Camera",
      description: "Canon EOS R5 - for its incredible dynamic range and color reproduction"
    },
    {
      icon: MapPin,
      title: "Dream Shoot Location",
      description: "Recommended location - rugged beauty meets intimate storytelling"
    },
    {
      icon: Heart,
      title: "Photography Philosophy",
      description: "Every photograph should tell a story that resonates for generations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl font-bold text-slate-800 mb-6">
                Meet <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Samuel Agbo</span>
              </h1>
              <div className="text-xl text-slate-600 mb-8 space-y-4 leading-relaxed">
                <p>
                  I'm a passionate photographer who believes that every moment tells a story worth preserving. 
                  For over eight years, I've been capturing life's most precious moments, from intimate weddings 
                  to corporate milestones.
                </p>
                <p>
                  My journey into photography began during college when I borrowed my roommate's camera for a friend's wedding. 
                  That single day changed everything – I discovered my calling in freezing time and emotion into lasting memories.
                </p>
                <p className="font-medium text-slate-700 italic border-l-4 border-amber-500 pl-4">
                  "Photography is not just about capturing what you see, but revealing what you feel."
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={() => navigate('/portfolio')}
              >
                View My Work
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://ofvrujqjbqevpalfzoyh.supabase.co/storage/v1/object/public/images//mexyprofilepic.JPG"
                  alt="Alex Morgan - Photographer"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <Card className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Always Creating</div>
                      <div className="text-sm text-slate-600">Capturing life's beautiful moments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Touch Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Behind the Lens</h2>
            <p className="text-xl text-slate-600">The personal touches that make each session unique</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {personalTouches.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Philosophy */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">My Creative Philosophy</h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              I believe that the best photographs happen when people feel comfortable being themselves. 
              That's why I spend time getting to know my clients, understanding their stories, and creating 
              an environment where authentic moments can unfold naturally.
            </p>
            <p>
              My approach combines documentary-style storytelling with artistic vision. I'm there to 
              capture the laughter, the tears, the quiet glances, and the spontaneous celebrations that 
              make each event unique. Every click of the shutter is intentional, every frame carefully considered.
            </p>
            
          </div>
        </div>
      </section>

     
      {/* Working Together */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Working Together</h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-12">
            <p>
              Every client relationship begins with a conversation. I want to understand your vision, 
              your style, and what matters most to you. From there, we'll collaborate to create a 
              photography experience that feels natural and authentic to who you are.
            </p>
            <p>
              I work with a limited number of clients each year to ensure that every project receives 
              the attention and creativity it deserves. This approach allows me to build meaningful 
              relationships and deliver images that truly reflect your unique story.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => navigate('/#contact')}
            >
              Let's Work Together
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/portfolio')}
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Get In Touch</h2>
          <p className="text-xl text-slate-600 mb-12">
            Ready to capture your story? I'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12"> 

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Phone className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Call Me</h3>
                <p className="text-slate-600">(+234) 0904 2515 461</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Mail className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Email Me</h3>
                <p className="text-slate-600">sahmmexy25@gmail.com</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/mexyofabuja_?igsh=MTJ6NTJzMmp6dDZvMg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Instagram className="w-5 h-5" fill='#ffffff'/>
              </a>

              <a href='https://www.tiktok.com/@mexyofabuja?_t=ZM-8xh1I09dlaw&_r=1' target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="21" viewBox="0 0 448 512"><path fill="#ffffff" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>
              </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
