import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DestinationSummary } from '../../types';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SriLankaMapProps {
  destinations: DestinationSummary[];
  selectedDestination?: DestinationSummary | null;
  onSelectDestination?: (destination: DestinationSummary) => void;
  className?: string;
  zoom?: number;
  height?: string;
  selectedDistrict?: string;
}

// Controller component to pan/zoom when selectedDestination changes
const MapController: React.FC<{ selectedDestination: DestinationSummary | null; zoom?: number }> = ({
  selectedDestination,
  zoom = 8
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDestination) {
      map.flyTo(
        [selectedDestination.latitude, selectedDestination.longitude],
        Math.max(map.getZoom(), zoom),
        { duration: 1.2 }
      );
    }
  }, [selectedDestination, map, zoom]);

  return null;
};

// Create custom circular thumbnail marker icon matching reference design
const createCustomIcon = (d: DestinationSummary, isSelected: boolean) => {
  let imgUrl = d.primaryImageUrl;
  if (!imgUrl || imgUrl.startsWith('/assets/')) {
    const slug = d.slug.toLowerCase();
    if (slug.includes('sigiriya')) imgUrl = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=120&q=80';
    else if (slug.includes('galle')) imgUrl = 'https://images.unsplash.com/photo-1588258524675-c61919e016a7?auto=format&fit=crop&w=120&q=80';
    else if (slug.includes('ella') || slug.includes('nine-arch')) imgUrl = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=120&q=80';
    else if (slug.includes('yala')) imgUrl = 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=120&q=80';
    else if (slug.includes('kandy')) imgUrl = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=120&q=80';
    else if (slug.includes('nuwara')) imgUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80';
    else imgUrl = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=120&q=80';
  }

  const borderClass = isSelected ? 'border-[#F5B041] scale-125' : 'border-white';

  const html = `
    <div class="custom-leaflet-marker">
      <img src="${imgUrl}" class="custom-leaflet-thumb ${borderClass}" alt="${d.name}" />
      <span class="custom-leaflet-label">${d.name.split(' ')[0]}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'leaflet-custom-div',
    iconSize: [42, 54],
    iconAnchor: [21, 27],
    popupAnchor: [0, -25]
  });
};

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  destinations,
  selectedDestination: controlledSelected,
  onSelectDestination,
  className = 'h-[500px]',
  zoom = 7.5,
  height,
  selectedDistrict
}) => {
  const containerClass = height ? `w-full rounded-2xl overflow-hidden relative shadow-inner z-0` : `${className} w-full rounded-2xl overflow-hidden relative shadow-inner z-0`;
  const containerStyle = height ? { height } : undefined;
  const [internalSelected, setInternalSelected] = useState<DestinationSummary | null>(null);

  const activeDestination = controlledSelected !== undefined ? controlledSelected : internalSelected;

  useEffect(() => {
    if (!activeDestination && destinations.length > 0) {
      setInternalSelected(destinations[0]);
    }
  }, [destinations, activeDestination]);

  const handleMarkerClick = (d: DestinationSummary) => {
    setInternalSelected(d);
    if (onSelectDestination) {
      onSelectDestination(d);
    }
  };

  // Center coordinates of Sri Lanka
  const sriLankaCenter: [number, number] = [7.8731, 80.7718];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-card border border-gray-100 ${className}`} style={containerStyle}>
      <MapContainer
        center={sriLankaCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ minHeight: '380px', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedDestination={activeDestination} zoom={9} />

        {destinations.map((d) => {
          const isSelected = activeDestination?.id === d.id;
          return (
            <Marker
              key={d.id}
              position={[d.latitude, d.longitude]}
              icon={createCustomIcon(d, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(d),
              }}
            >
              <Popup>
                <div className="p-1 max-w-[200px]">
                  <h4 className="font-bold text-xs text-gray-900">{d.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{d.district} District</p>
                  <div className="flex items-center gap-1 text-[11px] text-tourlynk-gold font-bold mt-1">
                    <Star size={12} className="fill-tourlynk-gold" />
                    <span>{d.averageRating.toFixed(1)}</span>
                  </div>
                  <Link
                    to={`/destinations/${d.slug}`}
                    className="inline-block mt-2 text-[11px] font-bold text-tourlynk-deepTeal hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Destination Information Card (Bottom-Right of Map) */}
      {activeDestination && (
        <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100 max-w-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <img
            src={activeDestination.primaryImageUrl}
            alt={activeDestination.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=150&q=80';
            }}
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-gray-900 truncate">
              {activeDestination.name}
            </h5>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <MapPin size={11} className="text-tourlynk-deepTeal" />
              <span>{activeDestination.district} District</span>
            </div>
          </div>
          <Link
            to={`/destinations/${activeDestination.slug}`}
            className="w-7 h-7 rounded-full bg-tourlynk-teal hover:bg-tourlynk-deepTeal text-white flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
            title="View Details"
          >
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default SriLankaMap;
