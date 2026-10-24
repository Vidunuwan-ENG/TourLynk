import React from 'react';

export interface BadgeProps {
  status?: 'Available' | 'Booked' | 'Maintenance' | 'Unavailable' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, size = 'sm', children }) => {
  const effective = status ? status.toUpperCase() : variant?.toUpperCase() || 'DEFAULT';
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  if (effective === 'AVAILABLE' || effective === 'SUCCESS' || effective === 'CONFIRMED') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${padding}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {children || (status === 'CONFIRMED' ? 'Confirmed' : 'Available')}
      </span>
    );
  }

  if (effective === 'BOOKED' || effective === 'CANCELLED' || effective === 'DANGER' || effective === 'REJECTED') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${padding}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {children || (status === 'BOOKED' ? 'Booked' : status === 'CANCELLED' ? 'Cancelled' : 'Unavailable')}
      </span>
    );
  }

  if (effective === 'MAINTENANCE' || effective === 'WARNING' || effective === 'PENDING') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${padding}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {children || (status === 'MAINTENANCE' ? 'Maintenance' : 'Pending')}
      </span>
    );
  }

  if (effective === 'COMPLETED' || effective === 'INFO') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${padding}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        {children || (status === 'COMPLETED' ? 'Completed' : 'Info')}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${padding}`}>
      {children || status || 'Default'}
    </span>
  );
};

export default Badge;
