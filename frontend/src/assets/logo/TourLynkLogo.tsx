import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const TourLynkLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showTagline = true,
}) => {
  const isLight = variant === 'light';
  
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const taglineSize = size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-[11px]' : 'text-[9px]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: Mountains + Road Peak */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <circle cx="32" cy="32" r="30" fill="url(#circleGrad)" />
        {/* Mountain Peaks */}
        <path
          d="M18 42L28 24L36 34L46 18L52 42H18Z"
          fill="url(#mountainGrad)"
          opacity="0.9"
        />
        {/* Winding Road / Lynk path */}
        <path
          d="M24 42C24 42 27 35 32 35C37 35 37 42 43 42"
          stroke="#F5B041"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Golden summit sun/compass dot */}
        <circle cx="46" cy="18" r="3" fill="#F5B041" />
        <defs>
          <linearGradient id="circleGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B3B3C" />
            <stop offset="1" stopColor="#0E4D52" />
          </linearGradient>
          <linearGradient id="mountainGrad" x1="18" y1="18" x2="52" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#26C6DA" />
            <stop offset="1" stopColor="#00897B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight leading-none ${textSize}`}>
          <span className={isLight ? 'text-white' : 'text-tourlynk-navy'}>Tour</span>
          <span className="text-tourlynk-accentTeal">Lynk</span>
          {/* Golden accent plane */}
          <span className="inline-block text-tourlynk-gold ml-0.5 text-xs">✈</span>
        </div>
        {showTagline && (
          <span
            className={`font-semibold tracking-widest uppercase mt-0.5 ${taglineSize} ${
              isLight ? 'text-gray-300' : 'text-tourlynk-textMuted'
            }`}
          >
            Discover More. Travel Better.
          </span>
        )}
      </div>
    </div>
  );
};

export default TourLynkLogo;
