import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  Ticket,
  Star,
  Navigation,
  ArrowLeft,
  Share2,
  Car,
  Compass,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { destinationService } from '../../services/destinations/destinationService';
import { Destination, DestinationSummary, DistanceRoute, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import DestinationCard from '../../components/destinations/DestinationCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [related, setRelated] = useState<DestinationSummary[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Directions state
  const [routeInfo, setRouteInfo] = useState<DistanceRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setRouteInfo(null);
      setRouteError(null);
      try {
        const [destData, relatedData, reviewsData] = await Promise.all([
          destinationService.getDestinationBySlug(slug),
          destinationService.getRelatedDestinations(slug).catch(() => []),
          destinationService.getReviews(slug).catch(() => [])
        ]);

        setDestination(destData);
        setRelated(relatedData);
        setReviews(reviewsData);
      } catch (err: any) {
        console.error('Failed to load destination', err);
        setError('Destination not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Request user geolocation and fetch driving route from backend
  const handleGetDirections = () => {
    if (!destination || !slug) return;
    setRouteLoading(true);
    setRouteError(null);

    if (!navigator.geolocation) {
      // Default to Colombo Fort coordinates (6.9344, 79.8428) as starting reference
      fetchRoute(6.9344, 79.8428);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchRoute(pos.coords.latitude, pos.coords.longitude);
      },
      (geoErr) => {
        console.warn('Geolocation denied or timed out, defaulting to Colombo starting point:', geoErr.message);
        // Fallback to Colombo
        fetchRoute(6.9344, 79.8428);
      },
      { timeout: 7000 }
    );
  };

  const fetchRoute = async (lat: number, lng: number) => {
    if (!slug) return;
    try {
      const data = await destinationService.getDirections(slug, lat, lng);
      setRouteInfo(data);
    } catch (err: any) {
      setRouteError('Could not calculate real-time driving route. You can view navigation directly on Google Maps.');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !newReviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const created = await destinationService.submitReview(slug, {
        rating: newRating,
        reviewText: newReviewText.trim()
      });
      setReviews((prev) => [created, ...prev]);
      setNewReviewText('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit your review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 max-w-7xl mx-auto px-4">
        <LoadingSkeleton className="h-96 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <LoadingSkeleton className="h-10 w-2/3 rounded-xl" />
            <LoadingSkeleton className="h-32 rounded-xl" />
          </div>
          <LoadingSkeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-24">
        <div className="text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md">
          <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-slate-800">Destination Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm">{error || 'The requested destination is not available.'}</p>
          <Link
            to="/destinations"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3B3C] text-white rounded-xl font-semibold text-sm hover:bg-[#0E4D52] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0B3B3C] transition"
        >
          <ArrowLeft className="w-4 h-4" /> All Destinations
        </Link>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Destination link copied to clipboard!');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 shadow-sm transition"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Visual Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video max-h-[500px] w-full bg-slate-900">
          <img
            src={destination.primaryImageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#0B3B3C]/80 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30">
                {destination.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-slate-200 text-xs font-medium border border-white/10">
                {destination.province} Province
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-200">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-[#F5B041]" />
                {destination.district} District, Sri Lanka
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                {destination.averageRating ? destination.averageRating.toFixed(1) : '4.8'}
                <span className="text-xs text-slate-300 font-normal">
                  ({destination.reviewCount || reviews.length} reviews)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / Story Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">About this Destination</h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {destination.fullDescription || destination.shortDescription}
              </p>

              {/* Key Quick Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4 text-[#0B3B3C]" />
                    Best Visit Period
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {destination.bestVisitPeriod || 'Year-round'}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Clock className="w-4 h-4 text-[#0B3B3C]" />
                    Recommended Time
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {destination.estimatedVisitDuration || '2 - 4 Hours'}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Ticket className="w-4 h-4 text-[#0B3B3C]" />
                    Entrance Fee
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {destination.entranceFeeInformation || 'Free / Local entry'}
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Directions & Distance Calculator Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-[#0B3B3C]" />
                    Driving Directions & Distance
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Compute real driving distance across Sri Lankan roads to {destination.name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGetDirections}
                  disabled={routeLoading}
                  className="px-4 py-2.5 bg-[#0B3B3C] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#0E4D52] transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Navigation className="w-4 h-4" />
                  {routeLoading ? 'Calculating Route...' : 'Get Directions from My Location'}
                </button>
              </div>

              {routeError && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  {routeError}
                </div>
              )}

              {routeInfo && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-slate-500 block">Driving Distance</span>
                      <span className="text-lg font-bold text-slate-900">
                        {routeInfo.drivingDistanceText || `${routeInfo.drivingDistanceKm || 0} km`}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Estimated Drive Time</span>
                      <span className="text-lg font-bold text-slate-900">
                        {routeInfo.drivingDurationText || `${routeInfo.drivingDurationMinutes || 0} mins`}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Routing Engine</span>
                      <span className="text-xs font-semibold px-2 py-1 bg-teal-100 text-[#0B3B3C] rounded-md inline-block mt-0.5">
                        {routeInfo.routingSource}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Calculated from starting coordinates ({routeInfo.originLatitude.toFixed(4)},{' '}
                      {routeInfo.originLongitude.toFixed(4)})
                    </p>
                    <a
                      href={routeInfo.navigationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B3C] hover:text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg transition"
                    >
                      Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Coordinates display */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  GPS: {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Traveler Reviews</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic feedback from visitors who journeyed with TourLynk
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{destination.averageRating ? destination.averageRating.toFixed(1) : '4.8'}</span>
                  <span className="text-xs text-slate-400 font-normal">({reviews.length})</span>
                </div>
              </div>

              {/* Write Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-8">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Share your experience</h3>
                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      Thank you! Your review has been published.
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Review</label>
                    <textarea
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="How was the journey, scenery, and road conditions?"
                      required
                      className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-[#0B3B3C] text-white text-xs font-bold rounded-xl hover:bg-[#0E4D52] transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8 text-center text-xs text-slate-600">
                  <Link to="/login" className="font-bold text-[#0B3B3C] underline">
                    Sign in
                  </Link>{' '}
                  to share your review and tips for this destination.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No reviews yet. Be the first traveler to leave a review!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0B3B3C] flex items-center justify-center font-bold text-xs uppercase">
                            {rev.userName ? rev.userName[0] : 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.reviewText}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar CTA Column */}
          <div className="space-y-6">
            {/* Rent a Vehicle Box */}
            <div className="bg-gradient-to-br from-[#0B252C] to-[#0E4D52] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-400/30">
                  Drive Sri Lanka
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-3 mb-2 text-white">
                  Planning a road trip to {destination.name}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  Rent a reliable self-drive SUV, Sedan, or Van with TourLynk and explore at your own pace with unlimited island freedom.
                </p>
                <Link
                  to="/vehicles"
                  className="w-full py-3.5 bg-[#F5B041] hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-center block text-sm transition shadow-md shadow-amber-500/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Car className="w-4 h-4" /> Browse Available Vehicles
                  </span>
                </Link>
              </div>
            </div>

            {/* Related Destinations */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-4">Nearby or Similar Spots</h3>
                <div className="space-y-3">
                  {related.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      to={`/destinations/${item.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <img
                        src={item.primaryImageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0B3B3C] transition">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#F5B041]" /> {item.district}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.averageRating ? item.averageRating.toFixed(1) : '4.7'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
