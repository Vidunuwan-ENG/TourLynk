import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, Filter, Compass, LayoutGrid, Map as MapIcon, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { destinationService } from '../../services/destinations/destinationService';
import { DestinationSummary, District } from '../../types';
import DestinationCard from '../../components/destinations/DestinationCard';
import SriLankaMap from '../../components/maps/SriLankaMap';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const CATEGORIES = ['All', 'Cultural', 'Nature', 'Coastal', 'Wildlife', 'Adventure'];

const DestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const districtParam = searchParams.get('district') || '';
  const categoryParam = searchParams.get('category') || 'All';

  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState(districtParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load districts list once
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await destinationService.getDistricts();
        setDistricts(data);
      } catch (err) {
        console.error('Failed to fetch districts', err);
      }
    };
    fetchDistricts();
  }, []);

  // Sync state if URL query params change
  useEffect(() => {
    if (districtParam !== selectedDistrict) {
      setSelectedDistrict(districtParam);
    }
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [districtParam, categoryParam]);

  // Fetch destinations
  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryFilter = selectedCategory === 'All' ? undefined : selectedCategory;
      const districtFilter = selectedDistrict === '' ? undefined : selectedDistrict;

      const data = await destinationService.getDestinations({
        district: districtFilter,
        category: categoryFilter,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        size: 9
      });

      setDestinations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      console.error('Failed to load destinations', err);
      setError('Unable to load Sri Lankan destinations. Please check your connection or retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedDistrict, selectedCategory, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchDestinations();
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    setCurrentPage(0);
    if (districtName) {
      searchParams.set('district', districtName);
    } else {
      searchParams.delete('district');
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    if (category !== 'All') {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedDistrict('');
    setSelectedCategory('All');
    setSearchQuery('');
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0B252C] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-teal-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <Compass className="w-3.5 h-3.5" />
            Discover Sri Lanka
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Sri Lankan <span className="text-[#F5B041]">Destinations</span>
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl text-base sm:text-lg">
            Explore heritage wonders, misty highlands, untamed wildlife sanctuaries, and sun-kissed coastlines across all 25 districts with TourLynk.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, district, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5B041] transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#F5B041] hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#0B3B3C] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* District Selector */}
            <div className="relative flex items-center min-w-[200px]">
              <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C] text-slate-700 font-medium"
              >
                <option value="">All 25 Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.destinationCount})
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'grid' ? 'bg-white text-[#0B3B3C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'map' ? 'bg-white text-[#0B3B3C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Interactive Map View"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Clear Filters */}
            {(selectedDistrict || selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{destinations.length}</span> of{' '}
            <span className="font-bold text-slate-900">{totalElements}</span> destinations
            {selectedDistrict ? ` in ${selectedDistrict} District` : ''}
            {selectedCategory !== 'All' ? ` • ${selectedCategory}` : ''}
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchDestinations()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B3B3C] text-white text-sm font-semibold rounded-xl hover:bg-[#0E4D52] transition"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any Sri Lankan destinations matching your current search and filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 bg-[#0B3B3C] text-white text-sm font-semibold rounded-xl hover:bg-[#0E4D52] transition"
            >
              View All Destinations
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 text-sm font-bold rounded-xl transition ${
                      currentPage === i
                        ? 'bg-[#0B3B3C] text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <SriLankaMap
              destinations={destinations}
              height="620px"
              selectedDistrict={selectedDistrict}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;
