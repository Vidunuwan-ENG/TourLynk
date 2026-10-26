import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Heart, Save, CheckCircle, AlertCircle, Car, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth/authService';
import { vehicleService } from '../../services/vehicles/vehicleService';
import { Vehicle } from '../../types';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await vehicleService.getUserFavorites();
        setFavorites(favs);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (newPassword && newPassword.length < 6) {
      setSaveError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSaveError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      const updated = await authService.updateProfile({
        fullName,
        phoneNumber: phoneNumber || undefined,
        newPassword: newPassword || undefined
      });
      updateUser(updated);
      setSaveSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (vehicleId: number) => {
    try {
      await vehicleService.toggleFavorite(vehicleId, true);
      setFavorites((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account <span className="text-[#0B3B3C]">Settings</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile, credentials, and saved rental vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Badge Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-[#0B3B3C] text-[#F5B041] flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md uppercase">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{user?.fullName}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#0B3B3C] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {user?.role}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                  {user?.accountStatus || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Overview</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-semibold text-slate-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Saved Vehicles</span>
                  <span className="font-semibold text-slate-800">{favorites.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>

              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  Your profile details have been successfully saved!
                </div>
              )}

              {saveError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  {saveError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Email address cannot be modified after registration.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                    />
                  </div>
                </div>

                {/* Password Change Sub-section */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Change Password (Leave blank to keep current)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Vehicles Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Vehicles
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {favorites.length} Saved
                </span>
              </div>

              {loadingFavorites ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading favorites...</div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                  <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">You haven't added any vehicles to your favorites yet.</p>
                  <Link
                    to="/vehicles"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B3B3C] hover:underline"
                  >
                    Explore fleet <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((veh) => (
                    <div
                      key={veh.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={veh.primaryImageUrl}
                          alt={veh.model}
                          className="w-16 h-14 rounded-xl object-cover bg-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {veh.make} {veh.model}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            LKR {veh.dailyRate.toLocaleString()} / day
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/vehicles/${veh.id}`}
                          className="px-2.5 py-1.5 bg-[#0B3B3C] text-white text-[11px] font-bold rounded-lg hover:bg-[#0E4D52] transition"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveFavorite(veh.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                          title="Remove from favorites"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
