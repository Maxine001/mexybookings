import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import TikTokIcon from './TikTokIcon'; // Assuming you have a TikTokIcon component

const Footer = () => {
  const scrollToServicePackages = () => {
    const element = document.getElementById('service-packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Mexy Studio</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Professional photography services with a modern approach to capturing your most precious moments.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/mexyofabuja_?igsh=MTJ6NTJzMmp6dDZvMg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
         
           {/* 
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              
              <a href='#' target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                
                <Twitter className="w-5 h-5" />
              </a>
            */}

              <a href='https://www.tiktok.com/@mexyofabuja?_t=ZM-8xh1I09dlaw&_r=1' target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="21" viewBox="0 0 448 512"><path fill="#ffffff" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>
              </a>

            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>
                lifestyle / model session
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>
                Wedding Photography
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>
                Family Sessions
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>
                Event Photography
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>
                Corporate Headshots
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors cursor-pointer">
                  Portfolio
                </Link>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={scrollToServicePackages}>Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>sahmmexy25@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>(+234) 0904 2515 461</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 Mexy Studio. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400 mt-4 md:mt-0">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
