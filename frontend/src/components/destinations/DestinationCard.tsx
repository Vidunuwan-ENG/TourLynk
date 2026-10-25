import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DestinationSummary } from '../../types';
import { MapPin, Star, ArrowUpRight } from 'lucide-react';

interface DestinationCardProps {
  destination: DestinationSummary;
  isSelected?: boolean;
  onSelect?: (destination: DestinationSummary) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isSelected = false,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  // Reliable high-resolution photography for each destination
  const getDestinationImageUrl = (d: DestinationSummary) => {
    if (d.primaryImageUrl && !imgError) {
      if (d.primaryImageUrl.startsWith('/assets/')) {
        const slug = d.slug.toLowerCase();
        if (slug.includes('sigiriya')) return 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('nine-arch') || slug.includes('ella')) return 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('galle')) return 'https://images.unsplash.com/photo-1588258524675-c61919e016a7?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('yala')) return 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('kandy')) return 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('nuwara-eliya')) return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('mirissa')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
        if (slug.includes('anuradhapura')) return 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80';
      }
      return d.primaryImageUrl;
    }
    return 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(destination);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer group ${
        isSelected
          ? 'border-tourlynk-gold shadow-lg ring-2 ring-tourlynk-gold/30'
          : 'border-gray-100 shadow-card hover:shadow-card-hover'
      }`}
    >
      {/* Destination Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={getDestinationImageUrl(destination)}
          alt={destination.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-tourlynk-navy/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {destination.category}
        </span>
      </div>

      {/* Destination Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-gray-900 group-hover:text-tourlynk-deepTeal transition-colors line-clamp-1">
            {destination.name}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <MapPin size={13} className="text-tourlynk-deepTeal" />
            <span>{destination.district} District</span>
          </div>

          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        {/* Bottom Row: Rating and Action Circle */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs">
            <Star size={14} className="text-tourlynk-gold fill-tourlynk-gold" />
            <span className="font-bold text-gray-900">{destination.averageRating.toFixed(1)}</span>
            <span className="text-gray-400">({destination.reviewCount > 1000 ? `${(destination.reviewCount / 1000).toFixed(1)}K` : destination.reviewCount})</span>
          </div>

          <Link
            to={`/destinations/${destination.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-tourlynk-teal hover:text-white hover:border-tourlynk-teal transition-all group-hover:scale-105"
            title="View Destination Details"
          >
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
