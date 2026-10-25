import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicles/vehicleService';
import { bookingService } from '../../services/bookings/bookingService';
import { Vehicle, VehicleAvailabilityCheck, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Briefcase,
  Cog,
  Fuel,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Heart,
  ChevronLeft
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [returnTime, setReturnTime] = useState('18:00');
  const [specialNotes, setSpecialNotes] = useState('');

  // Availability & Booking State
  const [availability, setAvailability] = useState<VehicleAvailabilityCheck | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Vehicle Details
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await vehicleService.getVehicleById(Number(id));
        setVehicle(data);
        setActiveImage(data.primaryImageUrl);
      } catch (err: any) {
        console.error('Error fetching vehicle', err);
        setErrorMessage(err.message || 'Vehicle not found');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Check Availability whenever pickup or return dates change
  useEffect(() => {
    const runAvailabilityCheck = async () => {
      if (!id || !pickupDate || !returnDate) return;

      const startDateTime = `${pickupDate}T${pickupTime}:00`;
      const endDateTime = `${returnDate}T${returnTime}:00`;

      if (new Date(endDateTime) <= new Date(startDateTime)) {
        setAvailability(null);
        return;
      }

      setCheckingAvailability(true);
      setErrorMessage('');
      try {
        const check = await vehicleService.checkAvailability(Number(id), startDateTime, endDateTime);
        setAvailability(check);
      } catch (err: any) {
        setAvailability(null);
        setErrorMessage(err.message || 'Could not verify availability for selected dates.');
      } finally {
        setCheckingAvailability(false);
      }
    };

    runAvailabilityCheck();
  }, [id, pickupDate, pickupTime, returnDate, returnTime]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!vehicle || !availability?.available) {
      return;
    }

    setBookingLoading(true);
    setErrorMessage('');
    try {
      const startDateTime = `${pickupDate}T${pickupTime}:00`;
      const endDateTime = `${returnDate}T${returnTime}:00`;

      const booked = await bookingService.createBooking({
        vehicleId: vehicle.id,
        startDateTime,
        endDateTime,
        specialNotes: specialNotes.trim() || undefined,
      });

      setBookingSuccess(booked);
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking submission failed. Please choose another date or vehicle.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-tourlynk-grayBg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tourlynk-teal border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center bg-tourlynk-grayBg px-4">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">{errorMessage || 'The requested vehicle is unavailable or has been archived.'}</p>
        <Link to="/vehicles" className="inline-block mt-4 text-xs font-bold text-tourlynk-deepTeal hover:underline">
          ← Back to Vehicle Catalog
        </Link>
      </div>
    );
  }

  const formattedDailyPrice = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(vehicle.dailyRate);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-tourlynk-grayBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-tourlynk-deepTeal hover:text-tourlynk-teal transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to All Vehicles</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: VEHICLE IMAGES & SPECS (8 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Featured Image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-card border border-gray-100 h-72 sm:h-96">
              <img
                src={activeImage || vehicle.primaryImageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <span className="absolute top-4 left-4 bg-white/95 text-tourlynk-navy text-xs font-extrabold px-3 py-1 rounded-md shadow-sm uppercase tracking-wider">
                {vehicle.category}
              </span>
              <div className="absolute top-4 right-4">
                <Badge status={availability?.status || vehicle.computedStatus} size="md" />
              </div>
            </div>

            {/* Vehicle Header & Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-tourlynk-deepTeal uppercase tracking-widest">
                  {vehicle.manufacturingYear} MODEL • REG #{vehicle.registrationNumber}
                </span>
                <span className="text-xl font-extrabold text-gray-900">
                  LKR {formattedDailyPrice} <span className="text-xs font-normal text-gray-500">/ day</span>
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
                {vehicle.make} {vehicle.model}
              </h1>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-tourlynk-goldLight text-tourlynk-goldDark">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block">Passengers</span>
                  <span className="text-xs font-bold text-gray-900">{vehicle.passengerCapacity} Seats</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-tourlynk-goldLight text-tourlynk-goldDark">
                  <Briefcase size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block">Luggage</span>
                  <span className="text-xs font-bold text-gray-900">{vehicle.luggageCapacity} Bags</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-tourlynk-goldLight text-tourlynk-goldDark">
                  <Cog size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block">Transmission</span>
                  <span className="text-xs font-bold text-gray-900">{vehicle.transmission}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-tourlynk-goldLight text-tourlynk-goldDark">
                  <Fuel size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block">Fuel Type</span>
                  <span className="text-xs font-bold text-gray-900">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">About This Vehicle</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Included Rental Features */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Included With Every Rental</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Comprehensive Island Vehicle Insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Unlimited Island Mileage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>24/7 Island-wide Roadside Assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Full Pre-rental Sanitization & Safety Inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Dual Air Conditioning & Bluetooth Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Colombo Airport & Hotel Handover Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING & AVAILABILITY ENGINE WIDGET (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-card border border-gray-100 sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold text-tourlynk-deepTeal uppercase tracking-widest">
                  RESERVATION ENGINE
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                  Check Dates & Book
                </h3>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Modal / Banner */}
              {bookingSuccess && (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h4 className="text-base font-extrabold text-emerald-900">Booking Confirmed!</h4>
                  <p className="text-xs text-emerald-800">
                    Your reservation for <strong>{vehicle.make} {vehicle.model}</strong> has been created.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-gray-800">
                    REF: {bookingSuccess.bookingReference}
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/bookings"
                      className="w-full bg-tourlynk-deepTeal text-white font-bold py-2 rounded-xl text-xs hover:bg-tourlynk-teal"
                    >
                      View in My Bookings
                    </Link>
                    <button
                      onClick={() => setBookingSuccess(null)}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Book Another Date
                    </button>
                  </div>
                </div>
              )}

              {!bookingSuccess && (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Pickup Date & Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Calendar size={14} className="text-tourlynk-deepTeal" />
                      Pickup Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        min={todayStr}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal cursor-pointer"
                      />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Return Date & Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-tourlynk-deepTeal" />
                      Return Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        min={pickupDate || todayStr}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal cursor-pointer"
                      />
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Flight / Handover Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Flight UL102 arrival, please handover at CMB Airport terminal..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-tourlynk-deepTeal"
                    ></textarea>
                  </div>

                  {/* Availability Status Check Result */}
                  <div className="pt-2">
                    {checkingAvailability ? (
                      <div className="p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-500 font-medium">
                        Checking vehicle availability...
                      </div>
                    ) : availability ? (
                      <div className={`p-3 rounded-xl border text-xs ${
                        availability.available
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        <div className="flex items-center gap-2 font-bold">
                          <span>{availability.available ? '✓ Available for selected dates' : '✕ Not Available'}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] opacity-90">{availability.message}</p>
                      </div>
                    ) : null}
                  </div>

                  {/* Price Calculation Breakdown */}
                  {availability?.available && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>LKR {formattedDailyPrice} × {availability.totalDays} {availability.totalDays === 1 ? 'day' : 'days'}</span>
                        <span className="font-semibold text-gray-900">
                          LKR {new Intl.NumberFormat('en-LK').format(availability.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Insurance & Road Assistance</span>
                        <span className="font-semibold text-emerald-700">Free Included</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">Total Price</span>
                        <span className="text-lg font-extrabold text-tourlynk-deepTeal">
                          LKR {new Intl.NumberFormat('en-LK').format(availability.totalAmount)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block text-right">Payment due upon vehicle pickup</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!availability?.available || bookingLoading}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                      availability?.available
                        ? 'bg-tourlynk-gold hover:bg-tourlynk-goldHover text-tourlynk-navy active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {bookingLoading ? (
                      <span>Reserving Vehicle...</span>
                    ) : !isAuthenticated ? (
                      <span>Sign In to Confirm Booking</span>
                    ) : availability?.available ? (
                      <span>Confirm Reservation (LKR {new Intl.NumberFormat('en-LK').format(availability.totalAmount)})</span>
                    ) : (
                      <span>Vehicle Unavailable for Dates</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
