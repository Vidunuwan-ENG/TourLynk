import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vehicle } from '../../types';
import { Users, Briefcase, Cog, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { vehicleService } from '../../services/vehicles/vehicleService';

interface VehicleCardProps {
  vehicle: Vehicle;
  onFavoriteChange?: (vehicleId: number, isFavorite: boolean) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(vehicle.isFavorite || false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reliable image URLs for each popular model fallback
  const getVehicleImageUrl = (v: Vehicle) => {
    if (v.primaryImageUrl && !imgError) {
      // If it's a relative path, let's also provide realistic high-quality photography fallbacks
      if (v.primaryImageUrl.startsWith('/assets/')) {
        const modelLower = v.model.toLowerCase();
        if (modelLower.includes('axio')) return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('rav4')) return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('hiace')) return 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('prado')) return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('prius')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('aqua')) return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('trail')) return 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('vezel')) return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('wagon')) return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('caravan')) return 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('montero')) return 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80';
        if (modelLower.includes('class')) return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80';
      }
      return v.primaryImageUrl;
    }
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      await vehicleService.toggleFavorite(vehicle.id, isFavorite);
      const newFavState = !isFavorite;
      setIsFavorite(newFavState);
      if (onFavoriteChange) {
        onFavoriteChange(vehicle.id, newFavState);
      }
    } catch (err) {
      console.error('Failed to update favorite', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    maximumFractionDigits: 0
  }).format(vehicle.dailyRate);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group">
      {/* Card Header & Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={getVehicleImageUrl(vehicle)}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge (Top Left) */}
        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-tourlynk-textDark text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
          {vehicle.category}
        </span>

        {/* Favorite Heart (Top Right) */}
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-sm transition-all ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 shadow-md'
              : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Status Badge (Bottom Right of Image) */}
        <div className="absolute bottom-2.5 right-3">
          <Badge status={vehicle.computedStatus || vehicle.listingStatus} size="sm" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-tourlynk-deepTeal transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2.5 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1.5" title="Passenger Capacity">
              <Users size={14} className="text-gray-400" />
              <span>{vehicle.passengerCapacity} Seats</span>
            </span>
            <span className="flex items-center gap-1.5" title="Luggage Capacity">
              <Briefcase size={14} className="text-gray-400" />
              <span>{vehicle.luggageCapacity} Bags</span>
            </span>
            <span className="flex items-center gap-1.5" title="Transmission">
              <Cog size={14} className="text-gray-400" />
              <span>{vehicle.transmission}</span>
            </span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-1">
          <div className="mb-3.5">
            <span className="text-base font-extrabold text-gray-900">
              LKR {formattedPrice}
            </span>
            <span className="text-xs text-gray-500 font-medium"> / day</span>
          </div>

          <Link
            to={`/vehicles/${vehicle.id}`}
            className="w-full bg-tourlynk-teal hover:bg-tourlynk-deepTeal active:scale-[0.99] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
