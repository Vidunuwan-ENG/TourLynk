import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/vehicles/vehicleService';
import { destinationService } from '../../services/destinations/destinationService';
import { Vehicle, DestinationSummary, District } from '../../types';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { DestinationCard } from '../../components/destinations/DestinationCard';
import { SriLankaMap } from '../../components/maps/SriLankaMap';
import { VehicleCardSkeleton, DestinationCardSkeleton } from '../../components/common/LoadingSkeleton';
import { ArrowRight, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Popular Vehicles State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // Destinations & Districts State
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationSummary[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedMapDestination, setSelectedMapDestination] = useState<DestinationSummary | null>(null);
  const [destinationsLoading, setDestinationsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setVehiclesLoading(true);
        setDestinationsLoading(true);

        const [vData, dData, distData] = await Promise.all([
          vehicleService.getPopularVehicles(),
          destinationService.getPopularDestinations(),
          destinationService.getDistricts()
        ]);

        setVehicles(vData);
        setDestinations(dData);
        setFilteredDestinations(dData);
        if (dData.length > 0) {
          setSelectedMapDestination(dData[0]);
        }
        setDistricts(distData);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setVehiclesLoading(false);
        setDestinationsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // District filter change handler
  const handleDistrictChange = async (districtName: string) => {
    setSelectedDistrict(districtName);
    try {
      setDestinationsLoading(true);
      if (districtName === 'All Districts') {
        const popData = await destinationService.getPopularDestinations();
        setFilteredDestinations(popData);
        if (popData.length > 0) setSelectedMapDestination(popData[0]);
      } else {
        const paged = await destinationService.getDestinations({ district: districtName, size: 8 });
        setFilteredDestinations(paged.content);
        if (paged.content.length > 0) setSelectedMapDestination(paged.content[0]);
      }
    } catch (err) {
      console.error('Error filtering by district', err);
    } finally {
      setDestinationsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-start overflow-hidden pt-28 pb-16">
        {/* Background Image & Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="\Hero.png"
            alt="Scenic road journey through Sri Lanka hill country"
            className="w-full h-full object-cover object-center scale-105 transform animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tourlynk-dark/95 via-tourlynk-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-tourlynk-dark/90 via-transparent to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-tourlynk-gold text-xs font-bold tracking-widest uppercase">
              <span>EXPLORE • DRIVE • DISCOVER</span>
            </div>

            {/* Main Heading matching UI Reference */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Explore Sri Lanka <br />
              <span className="text-tourlynk-gold">Your Way</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal max-w-lg">
              Find the Perfect Vehicle for Your Journey. Unmatched freedom to discover ancient fortresses, misty tea estates, and wild safari parks at your own pace.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/vehicles"
                className="bg-tourlynk-gold hover:bg-tourlynk-goldHover active:scale-95 text-tourlynk-navy font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2.5 transition-all text-sm group"
              >
                <span>Explore Vehicles</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/destinations"
                className="bg-tourlynk-navy/60 hover:bg-tourlynk-navy/80 text-white font-semibold px-6 py-3.5 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-md flex items-center gap-2 transition-all text-sm group"
              >
                <span>Discover Sri Lanka</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: POPULAR VEHICLES (PRIMARY FUNCTIONAL SECTION) */}
      <section className="py-20 bg-tourlynk-grayBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-tourlynk-deepTeal uppercase tracking-widest">
                OUR VEHICLES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                Popular <span className="text-tourlynk-deepTeal">Vehicles</span>
              </h2>
            </div>

            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-tourlynk-deepTeal hover:text-tourlynk-teal group transition-colors"
            >
              <span>View All Vehicles</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Vehicle Cards Grid (4 columns on desktop matching UI reference) */}
          {vehiclesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <VehicleCardSkeleton key={n} />
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-500 text-sm">No vehicles currently available. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: TRAVEL EXPERIENCE BANNER */}
      <section className="relative py-16 bg-tourlynk-navy overflow-hidden">
        {/* Background Coastline with dark teal overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
            alt="Scenic coastline Sri Lanka"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-tourlynk-navy/85 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading and Narrative */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                More Than a Ride <br />
                <span className="text-tourlynk-gold">A Better Travel Experience</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl">
                Explore Sri Lanka’s breathtaking destinations with the freedom of your own vehicle. Create unforgettable memories at your own pace.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-tourlynk-gold" /> Comprehensive Insurance Included
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-tourlynk-gold" /> Transparent Island Pricing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-tourlynk-gold" /> Unlimited Island Mileage
                </span>
              </div>
            </div>

            {/* Right Column: 2x2 Stats Grid matching reference image */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-left">
                <div className="text-3xl font-black text-white">50+</div>
                <div className="text-xs font-semibold text-gray-300 mt-1">Vehicles Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-left">
                <div className="text-3xl font-black text-white">20+</div>
                <div className="text-xs font-semibold text-gray-300 mt-1">Popular Destinations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-left">
                <div className="text-3xl font-black text-tourlynk-gold">100%</div>
                <div className="text-xs font-semibold text-gray-300 mt-1">Customer Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-left">
                <div className="text-3xl font-black text-white">24/7</div>
                <div className="text-xs font-semibold text-gray-300 mt-1">Support Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EXPLORE SRI LANKA (DESTINATIONS & INTERACTIVE MAP) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with District Selector & View All */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-tourlynk-deepTeal uppercase tracking-widest">
                TOP DESTINATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                Explore <span className="text-tourlynk-deepTeal">Sri Lanka</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Discover amazing places across the island.</p>
            </div>

            <div className="flex items-center gap-4">
              {/* District Filter Dropdown matching UI Reference */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-xs font-semibold text-gray-800 transition-colors cursor-pointer">
                  <MapPin size={15} className="text-tourlynk-deepTeal" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="All Districts">All Districts</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} District ({d.destinationCount})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="text-gray-400 pointer-events-none" />
                </div>
              </div>

              <Link
                to="/destinations"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-tourlynk-deepTeal hover:underline"
              >
                <span>View All Destinations</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Map & Cards Grid (Map on Left, 2x2 Grid of cards on Right on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Leaflet Map of Sri Lanka */}
            <div className="lg:col-span-6 w-full">
              <SriLankaMap
                destinations={filteredDestinations}
                selectedDestination={selectedMapDestination}
                onSelectDestination={(d) => setSelectedMapDestination(d)}
                className="h-[440px] sm:h-[500px]"
              />
            </div>

            {/* Right: 2x2 Grid of Destination Cards matching reference image */}
            <div className="lg:col-span-6">
              {destinationsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <DestinationCardSkeleton key={n} />
                  ))}
                </div>
              ) : filteredDestinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDestinations.slice(0, 4).map((d) => (
                    <DestinationCard
                      key={d.id}
                      destination={d}
                      isSelected={selectedMapDestination?.id === d.id}
                      onSelect={(selected) => setSelectedMapDestination(selected)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-8">
                  <p className="text-gray-500 text-sm">No destinations found in {selectedDistrict}.</p>
                  <button
                    onClick={() => handleDistrictChange('All Districts')}
                    className="mt-3 text-xs font-bold text-tourlynk-deepTeal hover:underline"
                  >
                    Reset to All Districts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CALL TO ACTION (CTA BANNER) */}
      <section className="relative py-20 bg-tourlynk-navy overflow-hidden">
        {/* Coastal Ocean Photography */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
            alt="Sri Lanka coastal landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tourlynk-navy/95 via-tourlynk-navy/80 to-tourlynk-navy/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready for Your Next Adventure?
              </h3>
              <p className="text-sm sm:text-base text-gray-200 font-normal">
                Rent a vehicle and explore the beauty of Sri Lanka at your own pace.
              </p>
            </div>

            <Link
              to="/vehicles"
              className="bg-tourlynk-gold hover:bg-tourlynk-goldHover active:scale-95 text-tourlynk-navy font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group flex-shrink-0"
            >
              <span>Explore Vehicles</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
