import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Award, HeartHandshake, Car, MapPin, Sparkles, Clock, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Banner */}
      <div className="bg-[#0B252C] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-teal-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Compass className="w-3.5 h-3.5" />
            Discover More. Travel Better.
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            About <span className="text-[#F5B041]">TourLynk</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            The premier self-drive vehicle rental and tourism platform in Sri Lanka. Connecting travelers with dependable vehicles to explore our paradise island without limits.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Our Story</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-4">
                Redefining How the World Explores Sri Lanka
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                TourLynk makes exploring Sri Lanka affordable, convenient, and reliable. We connect travelers with trusted vehicle rental services at competitive prices, helping you find the right vehicle for your budget and travel needs.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Discover Sri Lanka’s best destinations with our Explore Sri Lanka feature. From beautiful beaches and scenic mountains to historic landmarks, find detailed destination information and plan your perfect journey all in one place.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Lanka tea plantations and road"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-semibold">Scenic Central Highlands Route, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Why TourLynk</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Built on Trust, Safety & Transparency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0B3B3C] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">100% Certified Fleet</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every car, SUV, and van undergoes strict mechanical inspection and scheduled maintenance before handing you the keys.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All rates in Sri Lankan Rupees (LKR) with crystal-clear terms. No hidden surcharge surprises at pickup.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0B3B3C] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">24/7 Island Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Round-the-clock roadside assistance anywhere across all 25 districts of Sri Lanka for total confidence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Curated Tourism</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated interactive maps, driving directions, and local insider guides to make every kilometer unforgettable.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-[#0B252C] via-[#0B3B3C] to-[#0E4D52] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black mb-4">Ready to Start Your Journey?</h2>
            <p className="text-slate-200 text-sm sm:text-base mb-8">
              Choose from our high-performance fleet and unlock the beauty of Sri Lanka today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/vehicles"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F5B041] hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" /> Explore Vehicles
              </Link>
              <Link
                to="/destinations"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 transition flex items-center justify-center gap-2"
              >
                Discover Sri Lanka <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
