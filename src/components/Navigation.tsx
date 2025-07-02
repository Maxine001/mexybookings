import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Camera, Menu, User, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  onBookNow?: () => void;
}

const Navigation = ({ onBookNow }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
    } else {
      // Use the onBookNow prop if provided, otherwise do nothing
      if (onBookNow) {
        onBookNow();
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Mexy Studio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-slate-600 hover:text-slate-800 transition-colors font-medium"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleAuthAction}>
              {user ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span>{user ? 'Sign Out' : 'Sign In'}</span>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center space-x-2" onClick={handleBookNow}>
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-lg font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-6 space-y-3">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleAuthAction}>
                    {user ? <LogOut className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                    {user ? 'Sign Out' : 'Sign In'}
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" onClick={handleBookNow}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
