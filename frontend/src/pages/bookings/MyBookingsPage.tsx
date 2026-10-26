import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, AlertCircle, XCircle, CheckCircle, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { bookingService } from '../../services/bookings/bookingService';
import { Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings(0, 50);
      setBookings(data.content);
    } catch (err: any) {
      console.error('Failed to load my bookings', err);
      setError('Could not load your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCancel) return;

    setCancelling(true);
    try {
      const updated = await bookingService.cancelBooking(selectedBookingForCancel.id, cancelReason);
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setSelectedBookingForCancel(null);
      setCancelReason('');
      alert('Booking was successfully cancelled.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel the booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My <span className="text-[#0B3B3C]">Reservations</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your past, current, and upcoming vehicle rentals with TourLynk.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-semibold mb-3">{error}</p>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B3B3C] text-white text-xs font-semibold rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <Car className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No reservations found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't reserved any vehicles yet. Choose from our premium Sri Lankan fleet and start your adventure!
            </p>
            <Link
              to="/vehicles"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white font-bold rounded-xl text-sm transition"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const canCancel =
                booking.bookingStatus === 'PENDING' || booking.bookingStatus === 'CONFIRMED';

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-5 sm:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                        {booking.bookingReference}
                      </span>
                      <span className="text-xs text-slate-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          booking.bookingStatus === 'CONFIRMED'
                            ? 'success'
                            : booking.bookingStatus === 'PENDING'
                            ? 'warning'
                            : booking.bookingStatus === 'COMPLETED'
                            ? 'info'
                            : 'danger'
                        }
                      >
                        {booking.bookingStatus}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mt-5">
                    {/* Vehicle info */}
                    <div className="flex items-center gap-4 md:col-span-2">
                      <img
                        src={booking.vehicleImageUrl}
                        alt={`${booking.vehicleMake} ${booking.vehicleModel}`}
                        className="w-24 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                          {booking.vehicleCategory}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          {booking.vehicleMake} {booking.vehicleModel}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Reg: {booking.vehicleRegistrationNumber}
                        </p>
                      </div>
                    </div>

                    {/* Rental Period */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-[#0B3B3C]" />
                        <span>
                          {new Date(booking.startDateTime).toLocaleDateString()} –{' '}
                          {new Date(booking.endDateTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.totalDays} Rental Day(s)</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block text-right">Total Price</span>
                        <span className="text-lg font-black text-slate-900">
                          LKR {booking.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForCancel(booking)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>

                  {booking.specialNotes && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Notes: </span>
                      {booking.specialNotes}
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div className="mt-3 p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs">
                      <span className="font-semibold">Cancellation reason: </span>
                      {booking.cancellationReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Cancel Reservation</h3>
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to cancel booking{' '}
              <strong className="font-mono text-slate-900">{selectedBookingForCancel.bookingReference}</strong> for{' '}
              <strong className="text-slate-900">
                {selectedBookingForCancel.vehicleMake} {selectedBookingForCancel.vehicleModel}
              </strong>
              ?
            </p>

            <form onSubmit={handleCancelSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Itinerary change, rescheduling dates, etc."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForCancel(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
