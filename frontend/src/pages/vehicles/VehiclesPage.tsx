import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vehicleService, VehicleQueryParams } from '../../services/vehicles/vehicleService';
import { Vehicle } from '../../types';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { VehicleCardSkeleton } from '../../components/common/LoadingSkeleton';
import { Search, Filter, RotateCcw, Calendar, SlidersHorizontal } from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  );
  const [minPassengers, setMinPassengers] = useState<number | undefined>(
    searchParams.get('passengers') ? Number(searchParams.get('passengers')) : undefined
  );
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'ALL');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || 'ALL');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'price');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'asc');
  const [page, setPage] = useState(0);

  // Date Range Availability States
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Fetch Vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const params: VehicleQueryParams = {
        page,
        size: 12,
        sortBy,
        sortDir,
      };

      if (category && category !== 'ALL') params.category = category;
      if (search.trim()) params.search = search.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minPassengers) params.minPassengers = minPassengers;
      if (transmission && transmission !== 'ALL') params.transmission = transmission;
      if (fuelType && fuelType !== 'ALL') params.fuelType = fuelType;

      if (startDate && endDate) {
        params.startDateTime = `${startDate}T09:00:00`;
        params.endDateTime = `${endDate}T18:00:00`;
      }

      const response = await vehicleService.getVehicles(params);
      setVehicles(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [category, minPassengers, transmission, fuelType, sortBy, sortDir, page, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinPassengers(undefined);
    setTransmission('ALL');
    setFuelType('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('price');
    setSortDir('asc');
    setPage(0);
    setSearchParams({});
  };

  const categories = ['ALL', 'Car', 'SUV', 'Van', 'Compact', 'Luxury'];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-tourlynk-grayBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <span className="text-xs font-bold text-tourlynk-deepTeal uppercase tracking-widest">
            OUR FLEET
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
            Browse & Rent <span className="text-tourlynk-deepTeal">Vehicles</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {totalElements} vehicles ready for your Sri Lankan road expedition.
          </p>
        </div>

        {/* Top Controls: Search Bar, Category Chips, Sort */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search make or model (e.g. Axio, RAV4)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            </form>

            {/* Date Range Selection (Check Availability in Range) */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
                <Calendar size={14} className="text-tourlynk-deepTeal" />
                <span className="text-gray-500 font-medium">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
                <Calendar size={14} className="text-tourlynk-deepTeal" />
                <span className="text-gray-500 font-medium">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              {/* Reset Action */}
              <button
                onClick={handleResetFilters}
                className="p-2 text-gray-500 hover:text-rose-500 hover:bg-gray-50 rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Sort & Filter Drawer Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [b, d] = e.target.value.split('-');
                  setSortBy(b);
                  setSortDir(d);
                }}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="id-desc">Newest Listings</option>
                <option value="year-desc">Latest Model Year</option>
              </select>

              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  filterDrawerOpen
                    ? 'bg-tourlynk-deepTeal text-white border-tourlynk-deepTeal'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-tourlynk-deepTeal text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All Vehicles' : cat}
              </button>
            ))}
          </div>

          {/* Expandable Advanced Filters Drawer */}
          {filterDrawerOpen && (
            <div className="pt-4 mt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Passenger Capacity</label>
                <select
                  value={minPassengers || ''}
                  onChange={(e) => setMinPassengers(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <option value="">Any Capacity</option>
                  <option value="4">4+ Seats</option>
                  <option value="5">5+ Seats</option>
                  <option value="7">7+ Seats (SUV / Van)</option>
                  <option value="12">12+ Seats (Group Van)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <option value="ALL">All Transmissions</option>
                  <option value="Auto">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <option value="ALL">All Fuel Types</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Max Daily Rate (LKR)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="e.g. 20000"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                  />
                  <button
                    onClick={() => fetchVehicles()}
                    className="px-3 py-1.5 bg-tourlynk-teal text-white rounded-lg text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date Active Notice */}
        {startDate && endDate && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <span>
              📅 Checking vehicle availability for <strong>{startDate}</strong> to <strong>{endDate}</strong>.
            </span>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              Clear Dates
            </button>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900">No vehicles match your criteria</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category, price range, or passenger capacity filters to explore available rentals.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 bg-tourlynk-teal text-white rounded-xl text-xs font-bold hover:bg-tourlynk-deepTeal"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-600 px-3">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
