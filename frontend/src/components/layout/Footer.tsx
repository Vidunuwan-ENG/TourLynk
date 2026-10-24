import React from 'react';
import { Link } from 'react-router-dom';
import { TourLynkLogo } from '../../assets/logo/TourLynkLogo';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-tourlynk-navy text-gray-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <TourLynkLogo variant="light" size="lg" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mt-3">
              TourLynk is Sri Lanka’s premier self-drive vehicle rental and destination discovery platform.
              Explore the emerald mountains, sun-kissed coastlines, and ancient kingdoms of the island with absolute freedom and confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-tourlynk-gold font-semibold pt-1">
              <ShieldCheck size={18} className="text-tourlynk-gold" />
              <span>Verified Fleet • Transparent LKR Pricing • 24/7 Roadside Assistance</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-tourlynk-gold transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-tourlynk-gold" /> Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-tourlynk-gold transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-tourlynk-gold" /> Our Fleet
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-tourlynk-gold transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-tourlynk-gold" /> Explore Sri Lanka
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-tourlynk-gold transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-tourlynk-gold" /> About TourLynk
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-tourlynk-gold transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-tourlynk-gold" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vehicle Fleet */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vehicles</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/vehicles?category=Car" className="hover:text-tourlynk-gold transition-colors">
                  Sedans & Hybrids (Axio, Prius)
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=SUV" className="hover:text-tourlynk-gold transition-colors">
                  SUVs & 4x4 (RAV4, Prado)
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Van" className="hover:text-tourlynk-gold transition-colors">
                  Passenger Vans (HiAce, Caravan)
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Compact" className="hover:text-tourlynk-gold transition-colors">
                  Compact Hatchbacks (Aqua, Wagon R)
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Luxury" className="hover:text-tourlynk-gold transition-colors">
                  Executive Luxury (Mercedes-Benz)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Island Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Support</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-tourlynk-gold flex-shrink-0 mt-0.5" />
                <span>TourLynk Travel Hub, Baseline Road, Colombo 09, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-tourlynk-gold flex-shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-tourlynk-gold flex-shrink-0" />
                <span>support@tourlynk.lk</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-tourlynk-gold flex-shrink-0" />
                <span>Customer Support: 24/7 Island-wide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} TourLynk Platform. All rights reserved. Sri Lanka Tourism & Vehicle Rental.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-gray-300">Help & FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
